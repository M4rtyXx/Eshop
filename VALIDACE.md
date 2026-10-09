# Ověření dodané verze

- 16 automatizovaných backendových testů prošlo.
- DOM integrační testy proti skutečně spuštěnému API prošly: přidání produktu, změna množství, odeslání kontaktu, potvrzení objednávkové poptávky a vyprázdnění košíku; průvodce individuální poptávkou a potvrzení; přihlášení správce, načtení záznamů a změna stavu.
- Zkontrolována syntaxe obou JavaScriptů, místní odkazy v HTML a jedinečnost HTML identifikátorů.
- Testovací data vznikala v dočasných adresářích a nejsou součástí balíčku.
- Vizuální testy v plném prohlížeči a spuštění Docker obrazu nebyly v tomto prostředí provedeny. DOM testy používají jsdom a nenahrazují kontrolu vykreslení.
- Veřejný hosting, HTTPS proxy, trvalý disk, zálohy a skutečné údaje provozovatele se nastavují při nasazení.
