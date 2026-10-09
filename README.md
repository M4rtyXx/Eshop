# P&P 3D-Print — frontend a backend

Připravený samostatný projekt pro Python 3.12, FastAPI a SQLite. Obsahuje zvětšenou minimalistickou verzi webu, katalog, košík, kontaktní formulář, ukládání poptávek a administraci. Otevření samotného HTML souboru již nestačí: web spouštějte přes backend.

## Rychlé spuštění

Z kořenové složky projektu:

```sh
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS / Linux:
source .venv/bin/activate
pip install -r requirements.txt
```

Zkopírujte `.env.example` jako `.env`. Příkazem `python -c "import secrets; print(secrets.token_urlsafe(48))"` vygenerujte klíč a vložte jej do `ADMIN_TOKEN` v `.env`. Klíč ani `.env` neposílejte do GitHubu. Aplikace bez klíče alespoň o 32 znacích nenastartuje.

```sh
uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

- Web: http://127.0.0.1:8000/
- Správa: http://127.0.0.1:8000/admin.html
- Stav služby: http://127.0.0.1:8000/api/health

V administraci zadejte svůj `ADMIN_TOKEN`. Uvidíte zákazníka, produkty, poznámky a přílohy. Zakázce můžete změnit stav na „Řeší se“, „Vyřízená“ nebo „Zrušená“. Klíč se nepersistuje v prohlížeči; po obnovení stránky jej zadáte znovu.

## Co backend dělá

- Bere produkty, ceny a povolené varianty z `backend/products.json`.
- Ukládá nezávazné objednávkové poptávky a individuální poptávky do SQLite.
- Cenu počítá na serveru z celých haléřů. Klient neposílá autoritativní cenu.
- Ukládá nejvýše 3 přílohy, každou do 10 MB. Modely: STL/OBJ, obrázky: PNG/JPG/JPEG.
- Přílohy stahuje pouze autorizovaný správce; nejsou ve veřejném adresáři. Obsah modelů se na serveru nespouští ani nerenderuje. Nejde o antivirovou kontrolu souborů.
- Opakované odeslání se stejným klíčem vrací původní potvrzení. Stejný klíč s jinými údaji odmítne.
- Omezuje počet požadavků a celkový objem uložených příloh; výchozí limit úložiště je 1 GB.
- Udržuje stejnou doménu pro frontend i API, chrání zápis kontrolou původu a správu přístupovým klíčem.

Úspěšné odeslání znamená uložení v databázi, ne zaslání e-mailu. Administraci je nyní potřeba kontrolovat ručně. Automatické e-maily, faktury, platební brána, doprava, skladové hospodářství a zákaznické účty nejsou součástí této verze. Chat zůstává jednoduchým lokálním průvodcem materiály.

## GitHub a zveřejnění

1. Vytvořte repozitář a vložte do něj obsah této složky, včetně souborů `.github`, `.gitignore` a `.env.example`.
2. GitHub Actions spustí backendové testy při pushi a pull requestu.
3. Na hostingu s podporou Dockeru připojte repozitář nebo sestavte přiložený `Dockerfile`.
4. Nastavte `ADMIN_TOKEN`, `PUBLIC_ORIGIN` (přesnou HTTPS adresu webu) a případně `MAX_STORAGE_MB`.
5. Připojte trvalý disk na `/data`. Bez trvalého disku se databáze a přílohy při novém nasazení ztratí.
6. Provozujte jednu instanci aplikace. SQLite a lokální přílohy nejsou konfigurací pro více nezávislých replik.
7. Zajistěte HTTPS pomocí hostingu nebo reverzní proxy. Za proxy nastavte `FORWARDED_ALLOW_IPS` na skutečnou důvěryhodnou IP/síť proxy, aby limitování rozlišovalo návštěvníky. Nikdy slepě nepovolujte cizí přeposlané hlavičky.
8. Ověřte `/api/health`, odešlete vlastní testovací poptávku a zkontrolujte ji v administraci.

Pro vlastní server lze použít `docker compose up -d --build`. Služba je záměrně vystavená jen na lokální adrese serveru `127.0.0.1:8000`; před veřejný provoz patří HTTPS proxy. Hosting musí podporovat dlouho běžící Python/Docker proces a persistentní disk, ne pouze statické soubory nebo efemérní serverless funkce.

GitHub zde slouží jako úložiště kódu a spouštěč kontrol. GitHub Pages není vhodná ani povolená služba pro provoz tohoto e-shopu: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Před veřejným spuštěním

Doplňte skutečnou identitu provozovatele a kontakty, informace o zpracování osobních údajů na `frontend/soukromi.html` a pravidla pro vyřizování poptávek. Stránka soukromí zatím výslovně označuje testovací provoz. Zkontrolujte své ceny, daňový režim, popisy a produktové fotografie — zachované ceny a 21% DPH pocházejí z původního frontendu. Formuláře nyní odesílají nezávaznou poptávku bez platby; doprava se naceňuje zvlášť.

## Data a zálohy

Lokálně vzniká složka `data/`; v Dockeru se používá `/data` na persistentním svazku. Obsahuje databázi a adresář `uploads`. Ukládejte zálohy celého adresáře do neveřejného úložiště. Pro jednoduchou konzistentní zálohu aplikaci krátce zastavte, zkopírujte celý adresář a znovu ji spusťte. Záloha musí zahrnout databázi i přílohy. Ověřte také obnovu.

Záznamy se samy nemažou. Nastavte si dobu uchovávání a postup jejich výmazu podle svého provozu; UI pro hromadné mazání zde není. Pro změnu administrátorského klíče změňte prostředí a restartujte aplikaci.

## Testy

```sh
pip install -r requirements-dev.txt
python -m pytest tests -q
```

Testy používají dočasné adresáře a testovací klíč. Nepotřebují skutečnou databázi ani živé objednávky. Ověřují výpočet cen, odmítnutí podvržené ceny a variant, kontakt, přílohy, kvóty, administraci, původ požadavků, omezení četnosti, idempotenci a persistenci po restartu.

## API

| Metoda a cesta | Účel |
| --- | --- |
| GET /api/products | Veřejný katalog |
| POST /api/orders | Uložení produktové poptávky (JSON) |
| POST /api/enquiries | Poptávka na míru (multipart: JSON `payload`, soubory `files`) |
| GET /api/admin/submissions?offset=0 | Přehled po 50 záznamech |
| PATCH /api/admin/submissions/{id} | Změna stavu |
| GET /api/admin/attachments/{id} | Soukromé stažení přílohy |

Veřejné POST endpointy vyžadují hlavičku `Idempotency-Key` s UUID. Správa vyžaduje `Authorization: Bearer <ADMIN_TOKEN>`. Veřejné endpointy neumožňují číst cizí poptávky podle čísla.

Použité podklady: https://fastapi.tiangolo.com/tutorial/request-files/ a https://fastapi.tiangolo.com/tutorial/request-forms-and-files/.
