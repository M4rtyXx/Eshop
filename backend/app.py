"""P&P 3D-Print: same-origin storefront, SQLite and private administration."""
from __future__ import annotations

import hashlib
import json
import logging
import os
import secrets
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager, contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationError
from starlette.datastructures import UploadFile

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / '.env')
log = logging.getLogger('pp-shop')
DATA = Path(os.getenv('DATA_DIR', str(ROOT / 'data'))).resolve()
UPLOADS = DATA / 'uploads'
DB = DATA / 'shop.sqlite3'
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', '')
MAX_FILE = 10 * 1024 * 1024
MAX_BODY = 32 * 1024 * 1024
MAX_STORAGE = int(os.getenv('MAX_STORAGE_MB', '1024')) * 1024 * 1024
PUBLIC_ORIGIN = os.getenv('PUBLIC_ORIGIN', '').rstrip('/')
PRODUCTS = json.loads((ROOT / 'backend/products.json').read_text())
PRODUCT_MAP = {p['id']: p for p in PRODUCTS}


@contextmanager
def connection():
    conn = sqlite3.connect(DB, timeout=15)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys=ON')
    try:
        with conn:
            yield conn
    finally:
        conn.close()


@asynccontextmanager
async def lifespan(app):
    if len(ADMIN_TOKEN) < 32:
        raise RuntimeError('Nastavte ADMIN_TOKEN na náhodný řetězec s alespoň 32 znaky.')
    UPLOADS.mkdir(parents=True, exist_ok=True)
    with connection() as db:
        db.execute('PRAGMA journal_mode=WAL')
        db.executescript('''
        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY, kind TEXT NOT NULL, created_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new', payload TEXT NOT NULL,
            total_cents INTEGER, idempotency_key TEXT UNIQUE NOT NULL,
            request_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS attachments (
            id TEXT PRIMARY KEY, submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
            filename TEXT NOT NULL, stored_name TEXT NOT NULL, size INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS rate_limits (
            bucket TEXT PRIMARY KEY, window INTEGER NOT NULL, count INTEGER NOT NULL
        );
        ''')
    yield


app = FastAPI(title='P&P 3D-Print API', version='1.0.0', lifespan=lifespan,
              docs_url=None, redoc_url=None, openapi_url=None)


class SizeLimitMiddleware:
    """Bound the actual streamed body, including clients without Content-Length."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or scope['method'] not in ('POST', 'PATCH', 'PUT'):
            return await self.app(scope, receive, send)
        chunks = []
        size = 0
        limit = MAX_BODY if scope['path'] == '/api/enquiries' else 128 * 1024
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                return
            size += len(message.get('body', b''))
            if size > limit:
                return await JSONResponse({'detail': 'Požadavek je příliš velký.'}, 413)(scope, receive, send)
            chunks.append(message)
            if not message.get('more_body', False):
                break
        iterator = iter(chunks)
        async def replay():
            try:
                return next(iterator)
            except StopIteration:
                return await receive()
        await self.app(scope, replay, send)


app.add_middleware(SizeLimitMiddleware)


@app.middleware('http')
async def security_headers(request: Request, call_next):
    # No wildcard CORS. Browser writes are accepted only from this site's origin.
    if request.method in ('POST', 'PATCH', 'DELETE'):
        origin = request.headers.get('origin')
        expected = PUBLIC_ORIGIN or str(request.base_url).rstrip('/')
        if origin and origin != expected:
            return JSONResponse({'detail': 'Nepovolený původ požadavku.'}, 403)
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    if request.url.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response


@app.exception_handler(RequestValidationError)
async def validation_error(request, exc):
    return JSONResponse({'detail': 'Zkontrolujte povinné údaje, formát e-mailu a počet kusů.'}, 422)


class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)


class Customer(StrictModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr = Field(max_length=254)
    phone: str = Field(default='', max_length=40)


class Item(StrictModel):
    product_id: str = Field(max_length=20)
    quantity: int = Field(strict=True, ge=1, le=50)
    color: str = Field(max_length=100)
    material: str = Field(max_length=100)


class Order(StrictModel):
    customer: Customer
    items: list[Item] = Field(min_length=1, max_length=30)
    note: str = Field(default='', max_length=3000)
    website: str = Field(default='', max_length=300)  # honeypot


class Enquiry(StrictModel):
    kind: Literal['model', 'idea']
    customer: Customer
    description: str = Field(default='', max_length=5000)
    material: str = Field(default='', max_length=100)
    color: str = Field(default='', max_length=100)
    quality: str = Field(default='', max_length=150)
    infill: str = Field(default='', max_length=150)
    environment: str = Field(default='', max_length=300)
    load: str = Field(default='', max_length=300)
    dimensions: str = Field(default='', max_length=150)
    url: str = Field(default='', max_length=1000)
    website: str = Field(default='', max_length=300)


class Status(StrictModel):
    status: Literal['new', 'in_progress', 'completed', 'cancelled']


def limited(request: Request, group: str, maximum: int, seconds: int):
    address = request.client.host if request.client else 'unknown'
    bucket = hashlib.sha256(f'{group}:{address}'.encode()).hexdigest()
    window = int(time.time()) // seconds
    with connection() as db:
        db.execute('BEGIN IMMEDIATE')
        row = db.execute('SELECT window,count FROM rate_limits WHERE bucket=?', (bucket,)).fetchone()
        count = row['count'] + 1 if row and row['window'] == window else 1
        if count > maximum:
            raise HTTPException(429, 'Příliš mnoho pokusů. Zkuste to prosím později.', headers={'Retry-After': str(seconds)})
        db.execute('INSERT OR REPLACE INTO rate_limits VALUES (?,?,?)', (bucket, window, count))


def admin(request: Request, authorization: str = Header(default='')):
    limited(request, 'admin', 120, 60)
    if not ADMIN_TOKEN or not secrets.compare_digest(authorization, f'Bearer {ADMIN_TOKEN}'):
        raise HTTPException(401, 'Neplatný přístupový klíč.', headers={'WWW-Authenticate': 'Bearer'})


def key(value: str | None):
    try:
        return str(uuid.UUID(value or ''))
    except ValueError:
        raise HTTPException(422, 'Chybí platný identifikátor požadavku.')


def receipt(row):
    return {'id': row['id'], 'status': row['status'], 'total_cents': row['total_cents'], 'currency': 'CZK'}


def save_submission(kind, payload, total, idempotency, files=()):
    serial = json.dumps(payload, ensure_ascii=False, sort_keys=True)
    digest = hashlib.sha256((kind + serial).encode())
    for name, content in files:
        digest.update(name.encode())
        digest.update(content)
    fingerprint = digest.hexdigest()
    written = []
    try:
        with connection() as db:
            db.execute('BEGIN IMMEDIATE')
            previous = db.execute('SELECT * FROM submissions WHERE idempotency_key=?', (idempotency,)).fetchone()
            if previous:
                if previous['request_hash'] != fingerprint:
                    raise HTTPException(409, 'Tento požadavek již obsahoval jiné údaje. Obnovte formulář.')
                return receipt(previous)
            used = db.execute('SELECT COALESCE(SUM(size),0) FROM attachments').fetchone()[0]
            if used + sum(len(content) for _, content in files) > MAX_STORAGE:
                raise HTTPException(503, 'Úložiště příloh je plné. Zkuste to prosím později.')
            ident = ('OBJ-' if kind == 'order' else 'POP-') + secrets.token_hex(8).upper()
            now = datetime.now(timezone.utc).isoformat()
            db.execute('INSERT INTO submissions VALUES (?,?,?,?,?,?,?,?)',
                       (ident, kind, now, 'new', serial, total, idempotency, fingerprint))
            for name, content in files:
                fid = uuid.uuid4().hex
                stored = fid + Path(name).suffix.lower()
                path = UPLOADS / stored
                written.append(path)
                path.write_bytes(content)
                db.execute('INSERT INTO attachments VALUES (?,?,?,?,?)', (fid, ident, name, stored, len(content)))
            return {'id': ident, 'status': 'new', 'total_cents': total, 'currency': 'CZK'}
    except Exception:
        for path in written:
            path.unlink(missing_ok=True)
        raise


@app.get('/api/health')
def health():
    with connection() as db:
        db.execute('SELECT 1')
    return {'status': 'ok'}


@app.get('/api/products')
def products():
    return {'products': PRODUCTS}


@app.post('/api/orders', status_code=201)
def order(data: Order, request: Request, idempotency_key: str | None = Header(default=None)):
    limited(request, 'submission', 20, 3600)
    if data.website:
        raise HTTPException(422, 'Požadavek nelze přijmout.')
    lines = []
    for item in data.items:
        p = PRODUCT_MAP.get(item.product_id)
        if not p or item.color not in p['colors'] or item.material not in p['materials']:
            raise HTTPException(422, 'Neplatný produkt, barva nebo materiál. Obnovte katalog.')
        lines.append({**item.model_dump(), 'name': p['name'], 'unit_cents': p['price_cents']})
    total = sum(i['unit_cents'] * i['quantity'] for i in lines)
    payload = {'customer': data.customer.model_dump(), 'items': lines, 'note': data.note,
               'delivery': 'Domluva e-mailem', 'payment': 'Domluva e-mailem', 'type': 'nonbinding_request'}
    return save_submission('order', payload, total, key(idempotency_key))


@app.post('/api/enquiries', status_code=201)
async def enquiry(request: Request, idempotency_key: str | None = Header(default=None)):
    limited(request, 'submission', 20, 3600)
    async with request.form(max_files=3, max_fields=2, max_part_size=20_000) as form:
        raw = form.get('payload')
        if not isinstance(raw, str):
            raise HTTPException(422, 'Chybí údaje poptávky.')
        try:
            data = Enquiry.model_validate_json(raw)
        except ValidationError:
            raise HTTPException(422, 'Zkontrolujte údaje poptávky a e-mail.')
        if data.website:
            raise HTTPException(422, 'Požadavek nelze přijmout.')
        uploads = form.getlist('files')
        if data.kind == 'model' and (not uploads or not all((data.material, data.color, data.quality, data.infill))):
            raise HTTPException(422, 'Doplňte model, materiál, barvu, kvalitu a výplň.')
        if data.kind == 'idea' and not all((data.description, data.environment, data.load, data.dimensions, data.color)):
            raise HTTPException(422, 'Doplňte popis, prostředí, namáhání, rozměry a barvu.')
        if data.url and not data.url.startswith(('https://', 'http://')):
            raise HTTPException(422, 'Odkaz musí začínat https:// nebo http://.')
        files = []
        for upload in uploads:
            if not isinstance(upload, UploadFile):
                raise HTTPException(422, 'Neplatná příloha.')
            name = Path((upload.filename or '').replace('\\', '/')).name[:150]
            extension = Path(name).suffix.lower()
            allowed = {'.stl', '.obj'} if data.kind == 'model' else {'.png', '.jpg', '.jpeg'}
            if extension not in allowed:
                raise HTTPException(422, 'Nepovolený typ přílohy.')
            content = await upload.read(MAX_FILE + 1)
            if not content or len(content) > MAX_FILE:
                raise HTTPException(413, 'Každá příloha musí mít 1 B až 10 MB.')
            if extension == '.png' and not content.startswith(b'\x89PNG\r\n\x1a\n'):
                raise HTTPException(422, 'Neplatný PNG soubor.')
            if extension in {'.jpg', '.jpeg'} and not content.startswith(b'\xff\xd8\xff'):
                raise HTTPException(422, 'Neplatný JPEG soubor.')
            files.append((name, content))
        return save_submission('enquiry', data.model_dump(exclude={'website'}), None, key(idempotency_key), files)


@app.get('/api/admin/submissions', dependencies=[Depends(admin)])
def submissions(offset: int = 0):
    if offset < 0:
        raise HTTPException(422, 'Neplatná stránka.')
    with connection() as db:
        rows = db.execute('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 50 OFFSET ?', (offset,)).fetchall()
        total = db.execute('SELECT COUNT(*) FROM submissions').fetchone()[0]
        result = []
        for row in rows:
            entry = dict(row)
            entry.pop('idempotency_key')
            entry.pop('request_hash')
            entry['payload'] = json.loads(entry['payload'])
            entry['attachments'] = [dict(f) for f in db.execute('SELECT id,filename,size FROM attachments WHERE submission_id=?', (row['id'],))]
            result.append(entry)
    return {'items': result, 'total': total}


@app.patch('/api/admin/submissions/{ident}', dependencies=[Depends(admin)])
def update_status(ident: str, data: Status):
    with connection() as db:
        result = db.execute('UPDATE submissions SET status=? WHERE id=?', (data.status, ident))
        if not result.rowcount:
            raise HTTPException(404, 'Záznam neexistuje.')
    return {'id': ident, 'status': data.status}


@app.get('/api/admin/attachments/{ident}', dependencies=[Depends(admin)])
def download(ident: str):
    with connection() as db:
        row = db.execute('SELECT * FROM attachments WHERE id=?', (ident,)).fetchone()
    if not row or not (UPLOADS / row['stored_name']).is_file():
        raise HTTPException(404, 'Příloha neexistuje.')
    return FileResponse(UPLOADS / row['stored_name'], media_type='application/octet-stream', filename=row['filename'])


app.mount('/', StaticFiles(directory=ROOT / 'frontend', html=True), name='frontend')
