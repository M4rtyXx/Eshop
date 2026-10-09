import importlib
import json
import uuid

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def api(tmp_path, monkeypatch):
    monkeypatch.setenv('DATA_DIR', str(tmp_path))
    monkeypatch.setenv('ADMIN_TOKEN', 'test-only-' + 'x' * 40)
    monkeypatch.delenv('PUBLIC_ORIGIN', raising=False)
    import backend.app as module
    module = importlib.reload(module)
    with TestClient(module.app) as client:
        yield client, module


def auth(module):
    return {'Authorization': 'Bearer ' + module.ADMIN_TOKEN}


def order_payload():
    return {'customer': {'name': 'Test zákazník', 'email': 'test@example.com'},
            'items': [{'product_id': 'p2', 'quantity': 2, 'color': 'Matná Černá', 'material': 'PLA (Základní)'}]}


def key():
    return {'Idempotency-Key': str(uuid.uuid4())}


def enquiry_payload(kind='model'):
    return {'kind': kind, 'customer': {'name': 'Test zákazník', 'email': 'test@example.com'},
            'material': 'PLA', 'color': 'zelená', 'quality': '0.2 mm', 'infill': '20%',
            'description': 'Držák', 'environment': 'interiér', 'load': 'malá', 'dimensions': '10 cm'}


def test_catalog_static_and_admin_access(api):
    c, module = api
    assert c.get('/api/health').json() == {'status': 'ok'}
    assert len(c.get('/api/products').json()['products']) == 4
    assert 'P&amp;P' in c.get('/index.html').text
    assert c.get('/api/admin/submissions').status_code == 401
    assert c.get('/api/admin/submissions', headers=auth(module)).json()['items'] == []
    for path in ['/data/shop.sqlite3', '/.env', '/backend/app.py', '/uploads/file.stl']:
        assert c.get(path).status_code == 404


def test_server_prices_idempotency_and_status(api):
    c, module = api
    headers = key()
    response = c.post('/api/orders', json=order_payload(), headers=headers)
    assert response.status_code == 201
    assert response.json()['total_cents'] == 59800
    assert c.post('/api/orders', json=order_payload(), headers=headers).json()['id'] == response.json()['id']
    changed = order_payload(); changed['items'][0]['quantity'] = 3
    assert c.post('/api/orders', json=changed, headers=headers).status_code == 409
    records = c.get('/api/admin/submissions', headers=auth(module)).json()
    assert records['total'] == 1
    ident = response.json()['id']
    assert c.patch('/api/admin/submissions/' + ident, json={'status': 'completed'}, headers=auth(module)).status_code == 200
    assert c.patch('/api/admin/submissions/' + ident, json={'status': 'invalid'}, headers=auth(module)).status_code == 422
    with module.connection() as db:
        assert db.execute('SELECT status FROM submissions WHERE id=?', (ident,)).fetchone()[0] == 'completed'


@pytest.mark.parametrize('field,value', [('quantity', 0), ('quantity', 51), ('quantity', 1.5), ('quantity', True), ('color', '<script>bad</script>'), ('material', 'unknown'), ('product_id', 'no')])
def test_invalid_variants_and_quantities(api, field, value):
    c, _ = api
    payload = order_payload(); payload['items'][0][field] = value
    assert c.post('/api/orders', json=payload, headers=key()).status_code == 422


def test_price_tampering_and_invalid_contact(api):
    c, _ = api
    payload = order_payload(); payload['items'][0]['unit_cents'] = 1
    assert c.post('/api/orders', json=payload, headers=key()).status_code == 422
    payload = order_payload(); payload['customer']['email'] = 'invalid'
    assert c.post('/api/orders', json=payload, headers=key()).status_code == 422
    assert c.post('/api/orders', json=order_payload()).status_code == 422


def test_private_files_and_duplicate_upload(api):
    c, module = api
    headers = key(); payload = json.dumps(enquiry_payload())
    files = [('files', ('../../part.stl', b'solid test\nendsolid test', 'application/octet-stream'))]
    response = c.post('/api/enquiries', data={'payload': payload}, files=files, headers=headers)
    assert response.status_code == 201, response.text
    repeat = c.post('/api/enquiries', data={'payload': payload}, files=files, headers=headers)
    assert repeat.json()['id'] == response.json()['id']
    assert len(list(module.UPLOADS.iterdir())) == 1
    item = c.get('/api/admin/submissions', headers=auth(module)).json()['items'][0]
    attachment = item['attachments'][0]
    assert attachment['filename'] == 'part.stl'
    url = '/api/admin/attachments/' + attachment['id']
    assert c.get(url).status_code == 401
    result = c.get(url, headers=auth(module))
    assert result.content == b'solid test\nendsolid test'
    assert 'attachment' in result.headers['content-disposition']


def test_upload_restrictions_and_body_limit(api):
    c, module = api
    payload = {'payload': json.dumps(enquiry_payload())}
    assert c.post('/api/enquiries', data=payload, headers=key()).status_code == 422
    for name, content in [('bad.html', b'<script/>'), ('empty.stl', b''), ('huge.stl', b'x' * (module.MAX_FILE + 1))]:
        assert c.post('/api/enquiries', data=payload, files={'files': (name, content)}, headers=key()).status_code in (413, 422)
    files = [('files', (f'{i}.stl', b'solid a')) for i in range(4)]
    assert c.post('/api/enquiries', data=payload, files=files, headers=key()).status_code == 400
    assert c.post('/api/orders', content=b'x' * (128 * 1024 + 1), headers={'Content-Type': 'application/json', **key()}).status_code == 413
    assert list(module.UPLOADS.iterdir()) == []


def test_idea_and_image_signature(api):
    c, _ = api
    payload = {'payload': json.dumps(enquiry_payload('idea'))}
    assert c.post('/api/enquiries', data=payload, headers=key()).status_code == 201
    assert c.post('/api/enquiries', data=payload, files={'files': ('fake.png', b'html')}, headers=key()).status_code == 422


def test_origin_and_rate_limit(api):
    c, _ = api
    assert c.post('/api/orders', json=order_payload(), headers={'Origin': 'https://attacker.example', **key()}).status_code == 403
    for _ in range(20):
        assert c.post('/api/orders', json=order_payload(), headers=key()).status_code == 201
    response = c.post('/api/orders', json=order_payload(), headers=key())
    assert response.status_code == 429
    assert 'Retry-After' in response.headers


def test_storage_quota(api, monkeypatch):
    c, module = api
    monkeypatch.setattr(module, 'MAX_STORAGE', 2)
    response = c.post('/api/enquiries', data={'payload': json.dumps(enquiry_payload())}, files={'files': ('a.stl', b'solid test')}, headers=key())
    assert response.status_code == 503
    assert list(module.UPLOADS.iterdir()) == []


def test_database_survives_restart(api):
    c, module = api
    ident = c.post('/api/orders', json=order_payload(), headers=key()).json()['id']
    with TestClient(module.app) as restarted:
        assert restarted.get('/api/admin/submissions', headers=auth(module)).json()['items'][0]['id'] == ident
