# TroyScripts — Changelog & Updates

Nederlandstalige, gratis statische website met een eigen changelogpagina voor iedere FiveM-resource, actuele versies, versiearchief, bestandswijzigingen, update-instructies en automatische Discord-berichten. **Geen extra Discord-bot of hosting vereist.**

## Publicatie op GitHub Pages

1. Maak op het GitHub-account **troyscripts** een **nieuwe openbare** repository aan, bij voorkeur `troyscripts-changelog`. Gebruik geen van de bestaande privé-scripts of de TikTok-koppelingsrepository. Alleen deze publieke releasegegevens komen online; er staat geen Cfx-escrowcode in.
2. Plaats de inhoud van deze map (inclusief `.github/workflows/publish.yml`) op branch `main`.
3. Ga in die repository naar **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. De eerste push start **Publiceer TroyScripts changelogs**. Controleer het tabblad Actions. De site wordt normaal bereikbaar op `https://troyscripts.github.io/troyscripts-changelog/` als je de voorgestelde naam gebruikt.
5. Maak in het gewenste Discord-kanaal een webhook via **Kanaal bewerken → Integraties → Webhooks → Nieuwe webhook**. Kopieer de URL en bewaar die **alleen** onder repository **Settings → Secrets and variables → Actions → New repository secret** met exact de naam `DISCORD_UPDATES_WEBHOOK`.
6. Gebruik je een aangepaste repositorynaam of eigen domein, dan berekent GitHub Actions de Pages-URL op basis van de repositorynaam. Bij een eigen domein kun je een Actions **variable** `SITE_URL` instellen met de volledige URL inclusief laatste `/`.

De eerste websitepublicatie verstuurt **bewust geen Discord-berichten**. De bestaande versiegetallen zijn baselines uit de huidige `fxmanifest.lua` van de privérepositories. Deze zijn deels administratief gewijzigd voor Cfx.re Asset Escrow; er zijn geen ongeverifieerde release-opmerkingen toegevoegd.

## Nieuwe versie publiceren

Werk `data/releases.json` bij. Voeg een nieuwe release toe als object, bijvoorbeeld:

```json
{
  "script": "ts_nlplates",
  "version": "1.1.3",
  "date": "2026-11-22",
  "status": "draft",
  "highlights": ["Beschrijf hier een aantoonbare nieuwe functie of fix."],
  "changes": ["Beschrijf de overige echte wijzigingen."],
  "files": ["client/main.lua"],
  "instructions": ["Maak een back-up en neem de nieuwe versie volgens de documentatie over."]
}
```

- `status: "draft"` = concept; onzichtbaar op de website en **geen Discord-melding**. Let op: de JSON-data zelf blijft wel leesbaar in een publieke GitHub-repository. Bewaar vertrouwelijke concepten op een privébranch of buiten deze repository.
- Verander `status` naar `"published"` als de nieuwe versie daadwerkelijk beschikbaar is op Cfx.re. Na een succesvolle website-deploy verstuurt Actions één bericht met een release-embed én een gegroepeerd Sky-achtig overzicht van alle scripts en hun actuele versies.
- Een gewone tekstcorrectie, gewijzigde bestandenlijst, een hogere `initialVersion` zonder gepubliceerde release en het toevoegen van een **oudere** changelog versturen geen melding.
- Herstart je handmatig precies dezelfde GitHub Actions-uitvoering, dan kan een webhook technisch nogmaals versturen. Er is nog geen persistente Discord-bericht-ID/deduplicatie voor herhaalde workflowruns.
- Als je de technische `fxmanifest.lua`-versie voor escrow verhoogt zonder gameplaywijziging, verander dan uitsluitend `initialVersion` in `data/catalog.json`: de website toont het nieuwe nummer, maar Discord blijft stil.
- De publieke versiechecker kan later via `api/versions.json` aansluiten op `ts_bridge`. De site verandert **niets** aan je FiveM-scripts of je bestaande Discord-bot.

## Bestanden

| Bestand | Wat doet het? |
|---|---|
| `data/catalog.json` | Alle scripts, huidige basisversies, categorieën en omschrijvingen |
| `data/releases.json` | Echte historische changelogs en nieuwe publicaties |
| `scripts/build.mjs` | Genereert de hele site, het overzicht en de publieke versie-API in `dist/` |
| `scripts/core.mjs` | Versievergelijking, validatie en publicatieregels |
| `scripts/notify_discord.mjs` | Bouwt de Discord-embeds, vergelijkt oude/nieuwe releases en verzendt de webhook |
| `.github/workflows/publish.yml` | Test, bouwt en publiceert de site; stuurt daarna een Discord-melding |
| `assets/` | Vormgeving, zoekfunctie en mobiel scriptmenu |

## Lokaal controleren

Vereist Node.js 22 of nieuwer. Geen externe npm-packages nodig:

```bash
npm run validate
npm test
npm run build
npm run preview
```

De website wordt dan lokaal getoond op `http://localhost:4173/` (gebruik `SITE_URL=http://localhost:4173/ npm run build` voor volledig lokale links).

## Beveiliging

- Alleen eigenaren/schrijvers van de repository mogen releases wijzigen. Stel bij voorkeur branch protection op `main` in. Een publieke site betekent uitsluitend dat bezoekers changelogs en versienummers mogen **lezen**.
- Webhook-URL is een geheim GitHub Actions-secret en wordt niet in de website of `data/` opgeslagen.
- Cfx.re Asset Escrow-code en serverconfiguraties worden niet gepubliceerd.
- Voor Discord geldt standaard `allowed_mentions: {parse: []}`: geen onbedoelde pings.
- Wijzigingen aan changelogs moeten inhoudelijk gecontroleerd worden voordat ze op `published` komen.

## Feitelijke bron

Versies overgenomen uit de huidige manifests van de GitHub-repositories van **troyscripts** op 22 november 2026. De bestaande historische entries zijn gebaseerd op beschikbare `docs/CHANGELOG.md` of README's. Bij metadata-only versieverhogingen tonen we **geen fictieve release notes**. Voor `ts_parkeerapp` ontbreekt in de geraadpleegde repo nog een afzonderlijk changelogbestand.

## Troy's Game Community Bot

De website toont ook **Troy's Game Community Bot** onder de categorie **Discord-bot**, met actuele versie **3.8.4** uit package.json van de bestaande botrepo en de historische 3.x-wijzigingen uit docs/CHANGELOG.md. De bronrepository kan privé blijven. Alleen changelogteksten worden openbaar gemaakt, geen botcode, API-sleutels, database of .env. Als een releasedatum ontbreekt in de bron, toont de site 'Releasedatum niet vermeld'.

De bot draait op de bestaande hosting. GitHub Pages start of beheert de bot niet. Het toevoegen van de bot als nieuw catalogusitem verstuurt geen Discord-aankondiging; bij latere nieuwe gepubliceerde versies werkt de bestaande automatische release-aankondiging.
