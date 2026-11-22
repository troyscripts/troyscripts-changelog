# Bron voor data/configs.json (NL) en data/configs_en.json (EN).
# Draai: python3 scripts/source_configs.py
# Per optie: (sleutel, standaardwaarde, NL-uitleg, EN-uitleg). Sleutels en waarden zijn gelijk in beide talen.
import json, os

S = 'gedeeld'  # client + server
SV = 'server'

def f(path, side, nl, en): return dict(path=path, side=side, nl=nl, en=en)
def g(nl, en, *opts): return dict(nl=nl, en=en, options=list(opts))
def o(key, default, nl, en): return (key, default, nl, en)
def ace(line, nl, en): return (line, nl, en)

SCRIPTS = {}

# ---------------------------------------------------------------- ts_bridge
SCRIPTS['ts_bridge'] = dict(
 intro=("TS Bridge is de centrale koppeling tussen de TroyScripts-resources en jouw framework, bank, inventory, target, garages en Discord. Stel de bridge als eerste in: de andere scripts lezen hun meldingen, betalingen, rechten en webhooks via de bridge.",
        "TS Bridge connects all TroyScripts resources to your framework, banking, inventory, target, garages and Discord. Configure the bridge first: the other scripts use it for notifications, payments, permissions and webhooks."),
 files=[f('config/config.lua', S, "Alle algemene instellingen. Dit bestand gaat ook naar spelers: zet hier nooit webhook-URL's of sleutels in.", "All general settings. This file is also sent to players: never put webhook URLs or keys in it."),
        f('config/webhook_config.lua', SV, "Alle webhook-URL's: de centrale routes voor andere scripts en de eigen auditlogs van de bridge.", "All webhook URLs: central routes for other scripts and the bridge's own audit logs.")],
 groups=[
  g("Algemeen, meldingen en toetsen", "General, notifications and keys",
    o('TSBridgeConfig.Version', "'0.1.2'", "Configschema. Niet zelf veranderen; alleen bijwerken nadat je de nieuwe velden van een update hebt overgenomen.", "Config schema. Do not change it yourself; only update it after copying the new fields from an update."),
    o('TSBridgeConfig.Locale', "'nl'", "Taal van de bridge: 'nl' of 'en'. Ontbrekende teksten vallen terug op Nederlands.", "Bridge language: 'nl' or 'en'. Missing texts fall back to Dutch."),
    o('TSBridgeConfig.NotificationTitle', "'Troy Scripts'", "Standaardtitel boven meldingen. Mag niet leeg zijn; een script kan per melding een eigen titel geven.", "Default title above notifications. Must not be empty; a script may set its own title per notification."),
    o('TSBridgeConfig.NotificationDuration', "5000", "Hoe lang een melding zichtbaar is, in milliseconden (1–300000). 5000 = 5 seconden.", "How long a notification stays visible, in milliseconds (1–300000). 5000 = 5 seconds."),
    o('TSBridgeConfig.WaypointKey', "'G'", "Toets om de locatie van een melding (bijvoorbeeld een gijzeling) als waypoint te zetten. FiveM-toetsnaam, zoals 'G' of 'F6'.", "Key that sets the location of an alert (for example a hostage situation) as a waypoint. FiveM key name, such as 'G' or 'F6'."),
    o('TSBridgeConfig.AlertDismissKey', "'BACK'", "Toets om je eigen melding weg te klikken. 'BACK' = Backspace. Spelers kunnen beide toetsen zelf aanpassen in hun FiveM-instellingen.", "Key to dismiss your own alert. 'BACK' = Backspace. Players can change both keys in their FiveM key bindings."),
    o('TSBridgeConfig.AlertBlip', "true", "true = tijdelijke blip op de kaart bij een melding. Er wordt geen automatische route gezet.", "true = temporary map blip for an alert. No route is set automatically."),
    o('TSBridgeConfig.DeadStateKeys', "{ 'dead', 'isDead', 'laststand' }", "Statebag-sleutels die betekenen dat een speler dood of in laststand is. Pas aan als jouw ambulance-script andere namen gebruikt; {} = geen extra controle.", "State bag keys that mean a player is dead or in last stand. Change them if your ambulance script uses other names; {} = no extra check.")),
  g("Locatie in meldingen", "Location in alerts",
    o('AlertLocation.MapResource', "'ts_gemertmap'", "Resource die gebiedsnamen en postcodes levert. Ontbreekt die, dan gebruikt de bridge de gewone GTA-locatie.", "Resource that provides area names and postcodes. Without it, the bridge uses the normal GTA location."),
    o('AlertLocation.ShowArea', "true", "Gebiedsnaam tonen in de melding.", "Show the area name in the alert."),
    o('AlertLocation.ShowPostcode', "true", "Dichtstbijzijnde postcode tonen, als de kaartresource die levert.", "Show the nearest postcode, if the map resource provides one."),
    o('AlertLocation.ShowStreet', "true", "GTA-straat of kruising toevoegen.", "Add the GTA street or crossing."),
    o('AlertLocation.MaxPostcodeDistance', "1500.0", "Maximale afstand in meters tot een postcode. 0 = geen limiet.", "Maximum distance in meters to a postcode. 0 = no limit.")),
  g("Resources en koppelingen", "Resources and integrations",
    o('TSBridgeConfig.InventoryResource', "'ox_inventory'", "Naam van je inventory. Moet ox_inventory-compatibel zijn.", "Name of your inventory. Must be ox_inventory compatible."),
    o('TSBridgeConfig.TargetResource', "'ox_target'", "Naam van je target-resource. Alleen ox_target-compatibel; qb-target wordt niet ondersteund.", "Name of your target resource. ox_target compatible only; qb-target is not supported."),
    o('Radial.Enabled', "true", "Bridge-opties tonen in het ox_lib-radiaalmenu. Commando's blijven ook bij false werken. Herstart de server na wijzigen.", "Show bridge options in the ox_lib radial menu. Commands keep working when false. Restart the server after changing."),
    o('JobCards.Enabled', "true", "Optionele werkpassen via 0r_idcard. Bij false melden de loketten dat werkpassen niet beschikbaar zijn; sleutelkaarten blijven werken.", "Optional staff IDs through 0r_idcard. When false, the desks report that staff IDs are unavailable; keycards keep working."),
    o('JobCards.Resource', "'0r_idcard'", "Exacte naam van de werkpasresource (met het cijfer nul).", "Exact name of the staff ID resource (with the digit zero)."),
    o('JobCards.KeycardResource', "'ts_keycard'", "Resource die de gedeelde loketten beheert.", "Resource that manages the shared desks.")),
  g("Voertuigen, garage en sleutels", "Vehicles, garage and keys",
    o('Vehicles.Enabled', "true", "Voertuigmodule aan of uit. Nodig voor ts_nlplates en de JG-koppelingen.", "Vehicle module on or off. Needed for ts_nlplates and the JG integrations."),
    o('Vehicles.Ownership', "'esx'", "Eigenaarschap via de ESX-tabellen owned_vehicles, users en jobs. Vereist Server.Framework = 'esx'.", "Ownership through the ESX tables owned_vehicles, users and jobs. Requires Server.Framework = 'esx'."),
    o('Vehicles.DatabaseResource', "'oxmysql'", "Database-resource voor de voertuigmodule.", "Database resource for the vehicle module."),
    o('Vehicles.Dealer / Vehicles.Garage', "'jg'", "JG Dealerships en JG Advanced Garages. Jobgarages vereisen de TSGetJobGarages-export.", "JG Dealerships and JG Advanced Garages. Job garages require the TSGetJobGarages export."),
    o('Vehicles.Keys', "'mrnewb'", "'mrnewb' = sleutels via MrNewbVehicleKeys; 'none' = geen sleutelkoppeling.", "'mrnewb' = keys through MrNewbVehicleKeys; 'none' = no key integration."),
    o('Vehicles.SkyFakePlates', "{ Enabled = true, StateKey = 'sky_fakePlate' }", "Bij valse Sky-kentekens het echte kenteken gebruiken voor de registratie.", "Use the real plate for registration when a Sky fake plate is active."),
    o('Vehicles.PlatesResource', "'ts_nlplates'", "Resource die nieuwe kentekens genereert voor de dealer.", "Resource that generates new plates for the dealer.")),
  g("Framework, bank en facturen", "Framework, banking and invoices",
    o('Server.Framework', "'esx'", "'esx' of 'standalone'. Standalone heeft geen ESX-spelers, jobs of geld.", "'esx' or 'standalone'. Standalone has no ESX players, jobs or money."),
    o('Server.ESXResource', "'es_extended'", "Naam van je ESX-resource.", "Name of your ESX resource."),
    o('Server.Banking', "'apex'", "'apex' = Apex Banking, 'esx' = ESX-bankrekening, 'okok' = okokBanking. Contant geld gaat altijd via ESX.", "'apex' = Apex Banking, 'esx' = ESX bank account, 'okok' = okokBanking. Cash always goes through ESX."),
    o('Server.Billing', "'apex'", "'apex' = Apex Billing, 'none' = geen facturen, 'custom' = eigen resource die RegisterBillingProvider aanroept, 'okok' = alleen met een eigen adapter.", "'apex' = Apex Billing, 'none' = no invoices, 'custom' = your own resource that calls RegisterBillingProvider, 'okok' = only with your own adapter."),
    o('Server.SocietyResource', "'apex_banking'", "Waar bedrijfsgeld staat: 'apex_banking' of 'esx_addonaccount'.", "Where company money is stored: 'apex_banking' or 'esx_addonaccount'."),
    o('Server.SocietyAccounts', "police = { 'society_police', ... }", "Koppelt een korte naam (alias) aan de echte rekeningnaam. Andere scripts gebruiken de alias, bijvoorbeeld 'police'. Voeg eigen aliassen toe als alias = { 'rekeningnaam' }.", "Links a short name (alias) to the real account name. Other scripts use the alias, for example 'police'. Add your own as alias = { 'account_name' }."),
    o('Server.UpdateCheck.Enabled', "true", "Versiecontrole via de TroyScripts-site. Meldt alleen; installeert nooit iets automatisch.", "Version check through the TroyScripts site. Only reports; never installs anything automatically.")),
  g("Screenshots en logging", "Screenshots and logging",
    o('Server.ScreenshotResource', "'screenshot-basic'", "Resource voor foto's in webhooks.", "Resource used for photos in webhooks."),
    o('Server.Screenshots', "true", "false = geen foto's; de webhooktekst wordt wel verstuurd.", "false = no photos; the webhook text is still sent."),
    o('Server.ScreenshotTimeoutMs', "45000", "Maximale wachttijd op een foto in milliseconden.", "Maximum wait for a photo in milliseconds."),
    o('Server.MaxImageBytes', "4 * 1024 * 1024", "Maximale fotogrootte (standaard 4 MiB, maximaal 25 MiB).", "Maximum photo size (default 4 MiB, max 25 MiB)."),
    o('Server.MaxQueue', "32", "Maximaal aantal webhooks en foto's in de wachtrij, voor alle scripts samen.", "Maximum number of queued webhooks and photos, for all scripts together."),
    o('TSBridgeConfig.Audit.Enabled', "true", "Hoofdschakelaar voor de eigen auditlogs van de bridge (betalingen, facturen, fouten). Webhooks van andere scripts blijven werken.", "Master switch for the bridge's own audit logs (payments, invoices, errors). Other scripts' webhooks keep working."))],
 webhooks=dict(
  nl="De bridge verstuurt alle Discord-webhooks van de TroyScripts. In config/webhook_config.lua vul je per script en per gebeurtenis een URL in. Een centrale route heeft voorrang; laat je hem leeg (''), dan mag het script zijn eigen URL uit zijn eigen serverconfig gebruiken.",
  en="The bridge sends all TroyScripts Discord webhooks. In config/webhook_config.lua you set a URL per script and per event. A central route takes priority; if you leave it empty (''), the script may use its own URL from its own server config.",
  routes=[
   ('TSBridgeServer.Webhooks.ts_hostage.start', "Start van een gijzeling.", "A hostage situation starts."),
   ('TSBridgeServer.Webhooks.ts_hostage.actions', "Loslaten, omleggen of afbreken.", "Release, kill or abort."),
   ('TSBridgeServer.Webhooks.ts_nlplates.registration', "Nieuw én vervangend kentekenbewijs. Dit is de route die ts_nlplates gebruikt.", "New and replacement registration documents. This is the route ts_nlplates uses."),
   ('TSBridgeServer.Webhooks.ts_nlplates.created / .replacement', "Worden door de huidige ts_nlplates niet gebruikt; vul registration in.", "Not used by the current ts_nlplates; fill in registration."),
   ('TSBridgeServer.Webhooks.ts_repairpoints.murder', "Reparateur gedood, met foto als die beschikbaar is.", "Mechanic killed, with a photo when available."),
   ('TSBridgeServer.Webhooks.ts_repairpoints.placed', "Reparatiepunt geplaatst.", "Repair point placed."),
   ('TSBridgeServer.Webhooks.ts_repairpoints.removed', "Reparatiepunt verwijderd.", "Repair point removed."),
   ('TSBridgeServer.Webhooks.ts_keycard = { issue, revoke, transfer, point }', "Optioneel: voeg deze regel zelf toe om de sleutelkaartlogs centraal te regelen.", "Optional: add this line yourself to handle keycard logs centrally."),
   ('TSBridgeAuditConfig.Webhooks.payments', "Geslaagde persoonlijke betalingen via de bridge.", "Successful personal payments through the bridge."),
   ('TSBridgeAuditConfig.Webhooks.societies', "Geslaagde transacties met bedrijfsrekeningen.", "Successful company account transactions."),
   ('TSBridgeAuditConfig.Webhooks.invoices', "Aangemaakte facturen (niet: betaalde facturen).", "Created invoices (not: paid invoices)."),
   ('TSBridgeAuditConfig.Webhooks.errors', "Mislukte geldacties, facturen en saldo-opvragingen.", "Failed money actions, invoices and balance lookups.")],
  example="TSBridgeServer.Webhooks = {\n    ts_hostage = {\n        start = 'https://discord.com/api/webhooks/ID/TOKEN',\n        actions = 'https://discord.com/api/webhooks/ID/TOKEN'\n    }\n}"),
 aces=None)

# ---------------------------------------------------------------- ts_nlplates
SCRIPTS['ts_nlplates'] = dict(
 intro=("Hier stel je het kentekenformaat, het kentekenbewijs, het kentekenloket en de taxiplaten in. Webhooks staan in een apart bestand dat alleen op de server wordt geladen.",
        "Here you set the plate format, the registration document, the plate desk and taxi plates. Webhooks live in a separate file that is only loaded on the server."),
 files=[f('config/config.lua', S, "Kentekens, kentekenbewijs, loket, bedrijfsnamen en taxi's.", "Plates, registration document, desk, company names and taxis."),
        f('config/webhooks.lua', SV, "Webhook-instellingen voor uitgifte en vervanging van kentekenbewijzen.", "Webhook settings for issuing and replacing registration documents.")],
 groups=[
  g("Kentekens", "License plates",
    o('Config.Version', "'1.0.6'", "Configschema. Alleen bijwerken na het overnemen van nieuwe velden.", "Config schema. Only update after copying new fields."),
    o('Config.VersionCheck', "true", "Versiecontrole bij het starten. Handmatig in de console: ts_nlplates_check.", "Version check on start. Manually in the console: ts_nlplates_check."),
    o('Config.PlateFormat', "'A 111 AA'", "Patroon voor nieuwe kentekens: A = letter, 1 = cijfer, maximaal 8 tekens inclusief spaties. Bestaande kentekens veranderen hierdoor niet.", "Pattern for new plates: A = letter, 1 = digit, max 8 characters including spaces. Existing plates do not change."),
    o('Config.DefaultPlatePattern', "true", "Ook voertuigen met het standaard FiveM-spawnpatroon krijgen een Nederlands kenteken. Vast ingestelde kentekens blijven gelijk.", "Vehicles with the default FiveM spawn pattern also get a Dutch plate. Explicitly set plates stay the same."),
    o('Config.NPCPlates', "true", "NPC-voertuigen krijgen Nederlandse kentekens.", "NPC vehicles get Dutch plates."),
    o('Config.NPCScanInterval', "2000", "Hoe vaak NPC-voertuigen worden gecontroleerd, in milliseconden.", "How often NPC vehicles are checked, in milliseconds."),
    o('Config.Textures', "plate01 = 'gewoon', ...", "Welke GTA-plaat welke Nederlandse stijl krijgt: gewoon, oldtimer, luxe of taxi. Index 6 (oldtimer) vereist gamebuild 3095 of hoger.", "Which GTA plate gets which Dutch style: gewoon (regular), oldtimer, luxe or taxi. Index 6 (oldtimer) requires game build 3095 or higher."),
    o('Config.DebugCommand', "'nlplaatinfo'", "Commando dat kentekeninfo van je huidige voertuig toont. false = uit.", "Command that shows plate info for your current vehicle. false = off.")),
  g("Kentekenbewijs", "Registration document",
    o('Config.Registration.enabled', "true", "Kentekenbewijzen aan of uit.", "Registration documents on or off."),
    o('Config.Registration.item', "'kentekenbewijs'", "ox_inventory-item van het kentekenbewijs. Voeg dit item toe aan ox_inventory/data/items.lua.", "ox_inventory item for the document. Add it to ox_inventory/data/items.lua."),
    o('Config.Registration.command', "'kentekenbewijs'", "Commando om het bewijs uit het dashboardkastje te bekijken of te tonen.", "Command to view or show the document from the glovebox."),
    o('Config.Registration.showDistance', "3.0", "Afstand in meters waarbinnen je het bewijs aan anderen kunt tonen.", "Distance in meters within which you can show the document."),
    o('Config.Registration.unknownOwner', "'Onbekend'", "Tekst als de eigenaar niet bekend is.", "Text when the owner is unknown."),
    o('Config.CompanyNames', "taxi = 'Cab & Co', ...", "Bedrijfsnaam op het bewijs per ESX-job. Niet ingevuld = het label uit ESX.", "Company name on the document per ESX job. Not set = the ESX label.")),
  g("Kentekenloket", "Plate desk",
    o('Config.Replacement.enabled', "true", "Loket voor een vervangend kentekenbewijs.", "Desk for a replacement registration document."),
    o('Config.Replacement.price', "250", "Prijs in euro; 0 = gratis.", "Price in euros; 0 = free."),
    o('Config.Replacement.account', "'bank'", "Waar de speler betaalt: 'bank' of 'money'.", "How the player pays: 'bank' or 'money'."),
    o('Config.Replacement.society', "'society_police'", "Bedrijfsrekening die het geld ontvangt.", "Company account that receives the money."),
    o('Config.Replacement.placeCommand', "'kentekenpunt'", "Commando om een loket te plaatsen (alleen voor adminGroups).", "Command to place a desk (adminGroups only)."),
    o('Config.Replacement.adminGroups', "{ admin, owner, superadmin, god }", "ESX-groepen die loketten mogen plaatsen.", "ESX groups allowed to place desks."),
    o('Config.Replacement.companyMinGrade', "3", "Minimale rang om een bedrijfsbewijs te vervangen.", "Minimum grade to replace a company document."),
    o('Config.Replacement.cooldownSeconds', "30", "Wachttijd tussen twee aanvragen per speler.", "Wait time between two requests per player."),
    o('Config.Replacement.blip / label', "true / 'Kentekenloket'", "Blip op de kaart en de naam ervan.", "Map blip and its name.")),
  g("Taxi's", "Taxis",
    o('Config.Taxi.enabled', "true", "Automatische blauwe taxiplaten.", "Automatic blue taxi plates."),
    o('Config.Taxi.models', "{ 'taxi' }", "Spawnnamen die altijd een taxiplaat krijgen, ook bij NPC's.", "Spawn names that always get a taxi plate, including NPCs."),
    o('Config.Taxi.jobs', "{ taxi = true }", "Jobs waarvan de garagevoertuigen een taxiplaat krijgen.", "Jobs whose garage vehicles get a taxi plate."),
    o('Config.Taxi.garages', "{ ['Taxi Gemert'] = true }", "Namen van de taxi-jobgarages. Pas aan aan jouw garagenaam.", "Names of the taxi job garages. Change to your garage name."))],
 webhooks=dict(
  nl="Logs van uitgifte en vervanging van kentekenbewijzen. Je kunt de URL in config/webhooks.lua zetten, of centraal in ts_bridge bij ts_nlplates.registration. De centrale route heeft voorrang. Nieuwe en vervangende bewijzen gaan naar hetzelfde kanaal.",
  en="Logs for issuing and replacing registration documents. Set the URL in config/webhooks.lua, or centrally in ts_bridge under ts_nlplates.registration. The central route takes priority. New and replacement documents go to the same channel.",
  routes=[
   ('TSPlateWebhook.enabled', "Webhooks aan of uit.", "Webhooks on or off."),
   ('TSPlateWebhook.url', "Eigen Discord-URL; leeg laten als je de bridge gebruikt.", "Own Discord URL; leave empty when using the bridge."),
   ('TSPlateWebhook.firstIssue', "Log bij het eerste kentekenbewijs.", "Log on the first document."),
   ('TSPlateWebhook.replacement', "Log bij een vervangend bewijs.", "Log on a replacement document."),
   ('TSPlateWebhook.vehiclePhoto', "Foto van het voertuig meesturen (screenshot-basic, voertuig dichtbij en stilstaand).", "Include a vehicle photo (screenshot-basic, vehicle close and standing still).")],
  example=None),
 aces=dict(nl="ts_nlplates gebruikt geen ACE maar ESX-groepen. Wie in Config.Replacement.adminGroups staat (standaard admin, owner, superadmin en god) mag /kentekenpunt gebruiken. De console-opdracht ts_nlplates_check werkt alleen in de serverconsole.",
           en="ts_nlplates uses ESX groups instead of ACE. Anyone in Config.Replacement.adminGroups (admin, owner, superadmin and god by default) can use /kentekenpunt. The console command ts_nlplates_check only works in the server console.", lines=[]))

# ---------------------------------------------------------------- ts_nlplates_migrate
SCRIPTS['ts_nlplates_migrate'] = dict(
 intro=("Instellingen voor de eenmalige kentekenmigratie. Pas vooral BlockedResources aan voordat je migreert.",
        "Settings for the one-time plate migration. Above all, check BlockedResources before you migrate."),
 files=[f('config.lua', SV, "Alle instellingen van de migratie.", "All migration settings.")],
 groups=[g("Migratie", "Migration",
    o('Config.Command', "'ts_nlplates_spaties'", "Naam van het consolecommando. Gebruik: ts_nlplates_spaties controle | uitvoeren.", "Console command name. Usage: ts_nlplates_spaties controle | uitvoeren."),
    o('Config.BlockedResources', "{ 'ts_nlplates', 'ox_inventory', ... }", "Resources die tijdens de migratie uit moeten staan. Voeg je eigen garages, sleutelscripts en andere scripts toe die voertuiggegevens opslaan.", "Resources that must be stopped during the migration. Add your own garages, key scripts and other scripts that store vehicle data."),
    o('Config.SourceTables', "{ 'owned_vehicles', ... }", "Tabellen waaruit de oude kentekens worden gelezen.", "Tables the old plates are read from."),
    o('Config.PlateColumns', "{ plate = true, ... }", "Kolomnamen die in de hele database als kenteken worden behandeld.", "Column names treated as plates across the database."),
    o('Config.JsonFields', "owned_vehicles = { vehicle, glovebox, trunk }, ...", "JSON-velden waarin kentekens voorkomen, zoals inventarissen.", "JSON fields that contain plates, such as inventories."),
    o('Config.KeyTableTerms', "{ 'key', 'lock' }", "Tabellen met deze woorden in de naam worden ook doorzocht (sleutelscripts).", "Tables with these words in their name are also searched (key scripts)."),
    o('Config.StashPrefixes', "{ 'glove', 'trunk' }", "Voorvoegsels van ox_inventory-stashes die een kenteken in de naam hebben.", "Prefixes of ox_inventory stashes that contain a plate in their name."))],
 webhooks=None,
 aces=dict(nl="Geen ACE nodig. De commando's werken alleen in de serverconsole, niet voor spelers.", en="No ACE needed. The commands only work in the server console, not for players.", lines=[]))

# ---------------------------------------------------------------- ts_flatbed
SCRIPTS['ts_flatbed'] = dict(
 intro=("Hier stel je in wie de bergingswagen mag gebruiken, welke voertuigen worden ondersteund en hoe de lier, laadbak en wielheffer zich gedragen. De afstelling per voertuigmodel doe je in-game met /flatbedafstellen; die wordt opgeslagen in calibration.json.",
        "Here you set who may use the tow truck, which vehicles are supported and how the winch, deck and wheel lift behave. Per-model calibration is done in-game with /flatbedafstellen and saved in calibration.json."),
 files=[f('config.lua', S, "Alle instellingen.", "All settings."), f('calibration.json', SV, "Wordt automatisch gemaakt door /flatbedafstellen. Bewaar dit bestand bij updates.", "Created automatically by /flatbedafstellen. Keep this file when updating.")],
 groups=[
  g("Toegang en voertuigen", "Access and vehicles",
    o('Config.Models', "{ energyrampamec = true, energyguinchotop = true }", "Spawnnamen van de bergingswagens die werken met het script.", "Spawn names of the supported tow trucks."),
    o('Config.Jobs', "false", "false = iedereen mag de flatbed gebruiken. Met ESX-jobs en minimale rang: { mechanic = 0, anwb = 0 }.", "false = everyone may use the flatbed. With ESX jobs and minimum grade: { mechanic = 0, anwb = 0 }."),
    o('Config.UseAce', "false", "Extra ACE-recht om de flatbed te bedienen, bijvoorbeeld 'ts_flatbed.use'. false = geen ACE-controle.", "Extra ACE permission to operate the flatbed, for example 'ts_flatbed.use'. false = no ACE check."),
    o('Config.AdminAce', "'ts_flatbed.admin'", "ACE-recht voor /flatbedafstellen (laadbak en oprijplaten afstellen en opslaan).", "ACE permission for /flatbedafstellen (calibrate and save deck and ramps).")),
  g("Bediening en limieten", "Operation and limits",
    o('Config.InteractionDistance', "3.0", "Afstand in meters om de flatbed te bedienen.", "Distance in meters to operate the flatbed."),
    o('Config.ServerDistance', "18.0", "Maximale afstand die de server toestaat tot het midden van de vrachtwagen.", "Maximum distance the server allows to the middle of the truck."),
    o('Config.MaxCableLength', "20.0", "Maximale lengte van de lierkabel in meters.", "Maximum winch cable length in meters."),
    o('Config.PullSpeed', "0.65", "Liersnelheid in meter per seconde.", "Winch speed in meters per second."),
    o('Config.MaxCargoLength / MaxCargoWidth', "6.5 / 3.0", "Grootste voertuig dat op de laadbak past, in meters.", "Largest vehicle that fits on the deck, in meters."),
    o('Config.MaxSlope', "5.0", "Maximale helling in graden; de vrachtwagen moet redelijk vlak staan.", "Maximum slope in degrees; the truck must stand fairly level."),
    o('Config.StreamDistance', "100.0", "Afstand waarop andere spelers lading en onderdelen zien.", "Distance at which other players see cargo and parts."),
    o('Config.Timing', "ModelLoad = 5000, ...", "Wachttijden van de stappen in milliseconden. Alleen aanpassen als iets te snel of te traag gaat.", "Step timings in milliseconds. Only change if something is too fast or too slow."),
    o('Config.SpeedLimits', "Truck = 0.3, ...", "Maximale snelheden (m/s) tijdens laden. Vermenigvuldig met 3,6 voor km/u.", "Maximum speeds (m/s) while loading. Multiply by 3.6 for km/h."),
    o('Config.Alignment', "SecureSide = 0.65, ...", "Marges in meters en graden voor het uitlijnen van de lading.", "Margins in meters and degrees for aligning the cargo."),
    o('Config.Debug', "false", "Extra uitvoer voor diagnose.", "Extra diagnostic output.")),
  g("Afstandsbediening, wielheffer en oprijplaten", "Remote, wheel lift and ramps",
    o('Config.Remote.enabled', "true", "Zichtbare afstandsbediening met animatie tijdens het lieren. Geen item nodig.", "Visible remote with animation while winching. No item needed."),
    o('Config.WheelLift.enabled', "true", "Wielheffer om een tweede auto achter de wagen mee te nemen.", "Wheel lift to tow a second car behind the truck."),
    o('Config.WheelLift.maxAngle', "55.0", "Hoe ver de tweede auto mag meedraaien, in graden.", "How far the second car may swing, in degrees."),
    o('Config.WheelLift.dollies', "{ enabled = true, ... }", "Zichtbare wielkarretjes onder de achterwielen.", "Visible wheel dollies under the rear wheels."),
    o('Config.RampModel', "'imp_prop_flatbed_ramp'", "Propmodel van de oprijplaten. Bij een ander model ook RampHighEnd en RampNativeRise instellen.", "Prop model of the ramps. For another model, also set RampHighEnd and RampNativeRise."),
    o('Config.Defaults / Config.Profiles', "per spawnnaam", "Beginwaarden voor laadbak en oprijplaten. Opgeslagen afstellingen uit /flatbedafstellen gaan altijd voor.", "Starting values for deck and ramps. Saved calibrations from /flatbedafstellen always take priority."))],
 webhooks=None,
 aces=dict(nl="Voor het afstellen van de laadbak is een ACE-recht nodig. Zet de regels in server.cfg en pas de groep of speler aan.",
           en="Calibrating the deck requires an ACE permission. Put the lines in server.cfg and adjust the group or player.",
           lines=[ace('add_ace group.admin ts_flatbed.admin allow', "Admins mogen /flatbedafstellen gebruiken.", "Admins may use /flatbedafstellen."),
                  ace('add_ace group.mechanic ts_flatbed.use allow', "Alleen nodig als je Config.UseAce = 'ts_flatbed.use' zet: deze groep mag de flatbed bedienen.", "Only needed when Config.UseAce = 'ts_flatbed.use': this group may operate the flatbed."),
                  ace('add_principal identifier.license:JOUW_LICENSE group.mechanic', "Voorbeeld: zet een speler in die groep. Vervang JOUW_LICENSE door de license van de speler.", "Example: add a player to that group. Replace JOUW_LICENSE with the player's license.")]))

# ---------------------------------------------------------------- ts_repairpoints
SCRIPTS['ts_repairpoints'] = dict(
 intro=("Hier stel je de prijzen, de NPC-monteur, de dienstcontrole en de gevolgen van het doden van de monteur in. Reparatiepunten plaats je in-game met /reparatiepunt.",
        "Here you set prices, the NPC mechanic, the duty check and what happens when the mechanic is killed. Place repair points in-game with /reparatiepunt."),
 files=[f('config/config.lua', S, "Prijzen, monteur, dienstcontrole en vergoedingen.", "Prices, mechanic, duty check and compensation."),
        f('config/server.lua', SV, "Eigen dienstcontrole (DutyMode = 'custom') en webhookinstellingen. De URL's zelf staan in ts_bridge.", "Custom duty check (DutyMode = 'custom') and webhook settings. The URLs themselves are in ts_bridge.")],
 groups=[
  g("Reparatie en prijs", "Repair and price",
    o('Config.Interaction', "'ped'", "'ped' = NPC-monteur via ox_target; 'marker' = cirkel met de E-toets.", "'ped' = NPC mechanic through ox_target; 'marker' = circle with the E key."),
    o('Config.Price', "5000", "Maximale reparatieprijs. De echte prijs hangt af van de schade.", "Maximum repair price. The actual price depends on the damage."),
    o('Config.MinPrice', "250", "Minimumprijs, ook voor alleen banden of ruiten.", "Minimum price, also for only tyres or windows."),
    o('Config.DamageWeights', "{ engine = 0.6, body = 0.4 }", "Hoe zwaar motor- en carrosserieschade meetellen in de prijs.", "How much engine and body damage count towards the price."),
    o('Config.Account', "'bank'", "Waar de speler betaalt: 'bank' of 'cash'.", "How the player pays: 'bank' or 'cash'."),
    o('Config.Society', "'society_mechanic'", "Bedrijfsrekening die de reparatiekosten ontvangt.", "Company account that receives the repair costs."),
    o('Config.Duration', "10000", "Duur van de reparatie in milliseconden.", "Repair duration in milliseconds."),
    o('Config.QuoteLifetime', "30", "Seconden om de prijsopgave te bevestigen.", "Seconds to confirm the quote."),
    o('Config.Cooldown', "30", "Wachttijd in seconden, per speler en per voertuig.", "Wait time in seconds, per player and per vehicle."),
    o('Config.Blips', "true", "Blips voor reparatiepunten op de kaart.", "Map blips for repair points.")),
  g("Monteur en dienstcontrole", "Mechanic and duty check",
    o('Config.Ped.Model', "'s_m_y_xmech_02'", "Model van de NPC-monteur.", "Model of the NPC mechanic."),
    o('Config.Ped.DepartureMode', "'wander'", "Wat de NPC doet als er een echte monteur in dienst komt: 'wander' = wegwandelen, 'point' = naar een vaste plek.", "What the NPC does when a real mechanic goes on duty: 'wander' = walk away, 'point' = go to a fixed spot."),
    o('Config.MechanicJobs', "{ mechanic = true }", "Exacte jobnamen van echte monteurs.", "Exact job names of real mechanics."),
    o('Config.DutyMode', "'auto'", "'auto' = ESX-job en onDuty, 'job' = de jobnaam betekent in dienst, 'custom' = eigen koppeling in config/server.lua.", "'auto' = ESX job and onDuty, 'job' = the job name means on duty, 'custom' = your own check in config/server.lua."),
    o('Config.AdminGroups', "{ admin, owner, superadmin, god }", "ESX-groepen die /reparatiepunt mogen gebruiken.", "ESX groups allowed to use /reparatiepunt."),
    o('Config.Points', "{}", "Optionele vaste punten in de config. Meestal plaats je punten in-game.", "Optional fixed points in the config. Usually you place points in-game.")),
  g("Monteur gedood", "Mechanic killed",
    o('Config.PedDeath.Compensation', "10000", "Schadevergoeding die de dader betaalt per gedode monteur.", "Compensation the killer pays per killed mechanic."),
    o('Config.PedDeath.Account / Society', "'bank' / 'society_police'", "Waarvandaan betaald wordt en welke rekening het ontvangt. Bij te weinig saldo blijft het als schuld staan.", "Where it is paid from and which account receives it. If the balance is too low, it stays as a debt."),
    o('Config.PedDeath.PoliceJobs', "{ police = true }", "Jobs die een melding krijgen.", "Jobs that receive an alert."),
    o('Config.PedDeath.RespawnSeconds', "600", "Na hoeveel seconden er een nieuwe monteur komt.", "After how many seconds a new mechanic appears."),
    o('Config.UpdateCheck.IntervalHours', "6", "Hoe vaak de versie wordt gecontroleerd; 0 = alleen bij het starten.", "How often the version is checked; 0 = only on start."))],
 webhooks=dict(
  nl="De webhook-URL's staan centraal in ts_bridge (ts_repairpoints.murder, .placed en .removed). In config/server.lua bepaal je welke gebeurtenissen worden gelogd en of er een foto bij komt. Test met ts_repairpoints_webhookcheck in de serverconsole.",
  en="The webhook URLs are set centrally in ts_bridge (ts_repairpoints.murder, .placed and .removed). In config/server.lua you choose which events are logged and whether a photo is included. Test with ts_repairpoints_webhookcheck in the server console.",
  routes=[('RepairWebhookConfig.Enabled', "Webhooks aan of uit.", "Webhooks on or off."),
          ('RepairWebhookConfig.Events', "Per gebeurtenis aan of uit: murder, placed, removed.", "Per event on or off: murder, placed, removed."),
          ('RepairWebhookConfig.Photos', "Per gebeurtenis een foto meesturen.", "Include a photo per event."),
          ('RepairWebhookConfig.WitnessRadius', "Bij een moord moet de foto komen van een speler binnen deze afstand.", "For a murder, the photo must come from a player within this distance.")],
  example=None),
 aces=dict(nl="Wie in Config.AdminGroups staat, mag /reparatiepunt gebruiken. Je kunt het recht ook via ACE geven:", en="Anyone in Config.AdminGroups can use /reparatiepunt. You can also grant it through ACE:",
           lines=[ace('add_ace group.admin ts_repairpoints.admin allow', "Admins mogen reparatiepunten plaatsen, bekijken en verwijderen.", "Admins may place, view and remove repair points.")]))

# ---------------------------------------------------------------- ts_keycard
SCRIPTS['ts_keycard'] = dict(
 intro=("Hier stel je per dienst de sleutelkaart, prijzen, rangen en uitgiftepunten in, en het vervalsingssysteem. Uitgiftepunten plaats je in-game met /kaartpunt.",
        "Here you set the keycard, prices, grades and issuing points per department, and the forgery system. Place issuing points in-game with /kaartpunt."),
 files=[f('config/config.lua', S, "Kaarten, rangen, prijzen, loketten en vervalsing.", "Cards, grades, prices, desks and forgery."),
        f('config/server.lua', SV, "Politiemeldingen, logging en eigen webhook-URL's.", "Police alerts, logging and own webhook URLs.")],
 groups=[
  g("Politie (standaard)", "Police (default)",
    o('Config.Item', "'politie_sleutelkaart'", "ox_inventory-item van de politiekaart.", "ox_inventory item for the police card."),
    o('Config.Jobs', "{ police = true }", "Jobs die een politiekaart kunnen krijgen. Voeg bijvoorbeeld sheriff = true toe.", "Jobs that can get a police card. Add for example sheriff = true."),
    o('Config.IssueMinimumGrade', "0", "Minimale rang om een eigen kaart te maken.", "Minimum grade to make your own card."),
    o('Config.IssueOthersMinimumGrade', "7", "Minimale rang om een kaart voor een collega te maken.", "Minimum grade to make a card for a colleague."),
    o('Config.CardPrice', "10", "Prijs van een nieuwe kaart, betaald door de ontvanger.", "Price of a new card, paid by the recipient."),
    o('Config.FreeCardMinimumGrade / FreeIssueMinimumGrade', "7 / 7", "Vanaf deze rang zijn nieuwe of vervangende kaarten gratis.", "From this grade, new or replacement cards are free."),
    o('Config.SocietyAccount', "'police'", "Alias uit ts_bridge (SocietyAccounts) die het geld ontvangt.", "Alias from ts_bridge (SocietyAccounts) that receives the money."),
    o('Config.PaymentAccount', "'cash'", "Waar de ontvanger betaalt: 'cash' of 'bank'.", "How the recipient pays: 'cash' or 'bank'."),
    o('Config.IssuancePoint', "station + coords", "Standaardlocatie van het politieloket. Een met /kaartpunt opgeslagen locatie gaat voor.", "Default location of the police desk. A location saved with /kaartpunt takes priority.")),
  g("Andere diensten", "Other departments",
    o('Config.Ambulance', "Item, Jobs, Price, ...", "Eigen kaart, NPC en loket voor ambulance. IssuancePoint = false tot je het loket plaatst met /kaartpunt.", "Own card, NPC and desk for ambulance. IssuancePoint = false until you place the desk with /kaartpunt."),
    o('Config.Firefighter', "Item, Jobs, Price, ...", "Hetzelfde voor de brandweer (job firefighter).", "The same for the fire department (job firefighter)."),
    o('Config.Departments', "mechanic, taxi, sheriff, justice, fib", "Extra diensten. Per dienst: Label, Jobs, Item, rangen, Price en SocietyAccount. Geen NPC tot je /kaartpunt gebruikt.", "Extra departments. Per department: Label, Jobs, Item, grades, Price and SocietyAccount. No NPC until you use /kaartpunt.")),
  g("Beheer en intrekken", "Management and revoking",
    o('Config.SetupCommand', "'kaartpunt'", "Commando om een loket te plaatsen.", "Command to place a desk."),
    o('Config.SetupMinimumGrade', "7", "Minimale rang om /kaartpunt te gebruiken.", "Minimum grade to use /kaartpunt."),
    o('Config.AdminGroups', "{ owner = true, admin = true }", "ESX-groepen die altijd /kaartpunt en /kaartenintrekken mogen gebruiken.", "ESX groups that can always use /kaartpunt and /kaartenintrekken."),
    o('Config.SetupAce', "'ts_keycard.admin'", "ACE-recht voor /kaartpunt en /vervalspunt.", "ACE permission for /kaartpunt and /vervalspunt."),
    o('Config.RevokeCommand', "'kaartenintrekken'", "Commando om alle uitgegeven politiekaarten in te trekken.", "Command to revoke all issued police cards."),
    o('Config.RevokeAce / RevokeMinimumGrade', "'ts_keycard.revoke' / 7", "ACE-recht of minimale rang om kaarten in te trekken.", "ACE permission or minimum grade to revoke cards."),
    o('Config.RevokeCooldownSeconds', "30", "Wachttijd tussen twee intrekkingen.", "Wait time between two revocations.")),
  g("Vervalsing", "Forgery",
    o('Config.Forgery.Enabled', "true", "Illegale handel in vervalste kaarten.", "Illegal trade in forged cards."),
    o('Config.Forgery.SetupCommand', "'vervalspunt'", "Commando om het verkooppunt te plaatsen (ACE ts_keycard.admin).", "Command to place the dealer (ACE ts_keycard.admin)."),
    o('Config.Forgery.Materials', "lege_sleutelpas, kaartchip, codeerset", "Benodigde items en hun prijs. Ze worden verbruikt bij een geslaagde vervalsing.", "Required items and their price. They are used up on a successful forgery."),
    o('Config.Forgery.DurationSeconds', "86400", "Hoe lang een vervalste kaart werkt (86400 = 24 uur).", "How long a forged card works (86400 = 24 hours)."))],
 webhooks=dict(
  nl="Logs van uitgifte, intrekken, overdracht en het plaatsen van loketten. Vul in config/server.lua de URL's in, of voeg in ts_bridge een centrale route ts_keycard toe; die heeft voorrang. Laat je de tekst plaat_hier_jou_webhook staan, dan wordt er niets verstuurd.",
  en="Logs for issuing, revoking, transfers and placing desks. Set the URLs in config/server.lua, or add a central ts_keycard route in ts_bridge, which takes priority. If you leave the text plaat_hier_jou_webhook, nothing is sent.",
  routes=[('KeycardAuditConfig.Enabled', "Logging aan of uit.", "Logging on or off."),
          ('KeycardAuditConfig.Events', "Per gebeurtenis aan of uit: issue, revoke, transfer, point.", "Per event on or off: issue, revoke, transfer, point."),
          ('KeycardAuditConfig.Webhooks.issue', "Kaart uitgegeven of bijgewerkt.", "Card issued or updated."),
          ('KeycardAuditConfig.Webhooks.revoke', "Kaarten ingetrokken.", "Cards revoked."),
          ('KeycardAuditConfig.Webhooks.transfer', "Kaart overgedragen.", "Card transferred."),
          ('KeycardAuditConfig.Webhooks.point', "Loket of vervalspunt geplaatst.", "Desk or forgery point placed."),
          ('KeycardAuditConfig.PoliceAlert', "Politiemelding bij verdachte acties; Jobs en WaypointSeconds instelbaar.", "Police alert on suspicious actions; Jobs and WaypointSeconds configurable.")],
  example=None),
 aces=dict(nl="Leidinggevenden met de juiste rang en de ESX-groepen uit Config.AdminGroups hebben de rechten al. Wil je ze los van rang of groep geven, gebruik dan ACE:",
           en="Leaders with the right grade and the ESX groups in Config.AdminGroups already have these permissions. To grant them regardless of grade or group, use ACE:",
           lines=[ace('add_ace group.admin ts_keycard.admin allow', "Mag /kaartpunt en /vervalspunt gebruiken.", "May use /kaartpunt and /vervalspunt."),
                  ace('add_ace group.admin ts_keycard.revoke allow', "Mag met /kaartenintrekken alle politiekaarten intrekken.", "May revoke all police cards with /kaartenintrekken.")]))

# ---------------------------------------------------------------- ts_hostage
SCRIPTS['ts_hostage'] = dict(
 intro=("Hier stel je de bediening, wapens, camera, gijzeling in voertuigen en de politiemelding in. Teksten staan in locales/nl.lua.",
        "Here you set controls, weapons, camera, hostage situations in vehicles and the police alert. Texts are in locales/nl.lua."),
 files=[f('config/config.lua', S, "Bediening, wapens, camera en animaties.", "Controls, weapons, camera and animations."),
        f('config/server_config.lua', SV, "Webhooks en politiemelding.", "Webhooks and police alert.")],
 groups=[
  g("Bediening", "Controls",
    o('Config.Interaction', "'both'", "'target' = via ox_target, 'key' = met de E-toets, 'both' = allebei.", "'target' = through ox_target, 'key' = with the E key, 'both' = both."),
    o('Config.Keys', "{ Action = 'E', Release = 'X' }", "Toetsen om te gijzelen en los te laten. Spelers kunnen ze aanpassen in FiveM.", "Keys to take and release a hostage. Players can change them in FiveM."),
    o('Config.RequireAimOnFoot', "true", "Te voet alleen gijzelen terwijl je richt (geldt voor de E-toets).", "On foot, only take a hostage while aiming (applies to the E key)."),
    o('Config.Distance / BreakDistance', "1.8 / 4.0", "Afstand om te beginnen en afstand waarop de gijzeling stopt.", "Distance to start and distance at which the situation ends."),
    o('Config.ExecuteDelayMs', "1500", "Wachttijd voordat omleggen kan, zodat dezelfde E-toets niet meteen doorgaat.", "Delay before killing is possible, so the same E press does not carry through."),
    o('Config.RequireAmmo', "true", "Een vuurwapen moet munitie hebben.", "A firearm must have ammo."),
    o('Config.HandsUp', "{ Enabled = true, Key = 'H' }", "Eigen handen-omhoog-functie; ook via /handenomhoog.", "Own hands-up function; also through /handenomhoog."),
    o('Config.Radial.Enabled', "true", "Opties in het ox_lib-radiaalmenu. Zet uit bij een eigen radiaalmenu.", "Options in the ox_lib radial menu. Turn off if you use your own radial menu.")),
  g("Wapens en camera", "Weapons and camera",
    o('Config.Weapons', "WEAPON_PISTOL = 'firearm', ...", "Wapens waarmee je kunt gijzelen: 'firearm', 'blade' of 'blunt'. Voeg custom wapens toe met hun spawnnaam.", "Weapons that can be used: 'firearm', 'blade' or 'blunt'. Add custom weapons by spawn name."),
    o('Config.Camera.ForceFirstPersonOnFoot / InVehicle', "true / true", "De dader zit in first person tijdens de gijzeling.", "The captor is in first person during the situation."),
    o('Config.AntipunchCompatibility', "true", "Pauzeert alleen de noodrem van ts_antipunch tijdens een gijzeling.", "Only pauses ts_antipunch's emergency brake during a situation."),
    o('Config.BladePose', "{ Enabled = true, ... }", "Positie van het mes bij de keel. Alleen aanpassen als je de pose wilt bijstellen.", "Knife position at the throat. Only change to fine-tune the pose.")),
  g("Voertuigen", "Vehicles",
    o('Config.Vehicle.Enabled', "true", "Gijzelen in een voertuig.", "Hostage situations in a vehicle."),
    o('Config.Vehicle.MaxStartSpeed', "0.5", "Het voertuig moet vrijwel stilstaan (m/s).", "The vehicle must be almost stationary (m/s)."),
    o('Config.Vehicle.SeatPairs', "{ { captor = 0, victim = -1 } }", "Welke stoel gijzelt welke: standaard de bijrijder de bestuurder.", "Which seat takes which: by default the passenger takes the driver.")),
  g("Politiemelding", "Police alert",
    o('PoliceAlertConfig.Enabled', "true", "Eén melding voor de politie per gestarte gijzeling.", "One police alert per started situation."),
    o('PoliceAlertConfig.Jobs', "{ police = true }", "Jobs die de melding krijgen.", "Jobs that receive the alert."),
    o('PoliceAlertConfig.WaypointSeconds', "60", "Tijd om met G een route naar de melding te zetten.", "Time to set a route to the alert with G."))],
 webhooks=dict(
  nl="Twee Discord-kanalen: één voor de start van een gijzeling en één voor wat daarna gebeurt. Zet de URL's in config/server_config.lua of centraal in ts_bridge (ts_hostage.start en .actions); de centrale route heeft voorrang. Voor foto's moet screenshot-basic vóór ts_hostage starten en moet je Electron AntiCheat goed instellen.",
  en="Two Discord channels: one for the start of a situation and one for what happens next. Set the URLs in config/server_config.lua or centrally in ts_bridge (ts_hostage.start and .actions); the central route takes priority. For photos, screenshot-basic must start before ts_hostage and Electron AntiCheat must be configured.",
  routes=[('WebhookConfig.Enabled', "Webhooks aan of uit.", "Webhooks on or off."),
          ('WebhookConfig.Start', "URL voor: gijzeling gestart.", "URL for: situation started."),
          ('WebhookConfig.Actions', "URL voor: loslaten, omleggen of afgebroken.", "URL for: released, killed or aborted."),
          ('WebhookConfig.Username / AvatarUrl', "Naam en logo van de webhookbot.", "Name and logo of the webhook bot."),
          ('WebhookConfig.Screenshots', "Foto meesturen (screenshot-basic).", "Include a photo (screenshot-basic)."),
          ('WebhookConfig.LogAutomaticRelease', "Ook loggen als de gijzeling vanzelf eindigt.", "Also log when the situation ends by itself."),
          ('WebhookConfig.PlayerName', "Functie voor de naam in de log. Standaard FiveM-naam en server-ID; vervang door je eigen RP-naamkoppeling.", "Function for the name in the log. Default is FiveM name and server ID; replace with your own RP name lookup.")],
  example=None),
 aces=dict(nl="Geen ACE nodig. ts_hostage_policecheck werkt alleen in de serverconsole.", en="No ACE needed. ts_hostage_policecheck only works in the server console.", lines=[]))

# ---------------------------------------------------------------- ts_antipunch
SCRIPTS['ts_antipunch'] = dict(
 intro=("Hier bepaal je welke combatacties worden geblokkeerd en hoe first person werkt tijdens het richten.",
        "Here you choose which combat actions are blocked and how first person works while aiming."),
 files=[f('config/config.lua', S, "Alle instellingen. Teksten staan in locales/nl.lua.", "All settings. Texts are in locales/nl.lua.")],
 groups=[
  g("Camera", "Camera",
    o('Config.ForceFirstPerson', "true", "First person verplicht tijdens het richten te voet.", "First person required while aiming on foot."),
    o('Config.FirstPersonOnlyFirearms', "false", "true = alleen bij vuurwapens; false = bij elke richtknop, ook met vuisten of messen.", "true = only with firearms; false = on every aim, also with fists or knives."),
    o('Config.RestoreCamera', "true", "Na het richten terug naar de vorige camera.", "Return to the previous camera after aiming."),
    o('Config.DefaultCamera', "1", "Camera om naar terug te gaan: 0 = dichtbij, 1 = gemiddeld, 2 = ver, 4 = first person.", "Camera to return to: 0 = close, 1 = medium, 2 = far, 4 = first person."),
    o('Config.CameraRestoreDelay', "50", "Vertraging in milliseconden voordat de camera terugzet.", "Delay in milliseconds before the camera is restored.")),
  g("Combat", "Combat",
    o('Config.BlockShootingWithoutAim', "true", "Niet schieten zonder te richten.", "No shooting without aiming."),
    o('Config.BlockMeleeWithoutAim', "true", "Geen melee zonder te richten.", "No melee without aiming."),
    o('Config.DisableWeaponMelee', "true", "Niet slaan met een vuurwapen, ook niet tijdens het richten. Herladen blijft werken.", "No hitting with a firearm, not even while aiming. Reloading keeps working."),
    o('Config.CancelForcedMelee', "true", "Extra noodrem die een slag met een vuurwapen afbreekt.", "Extra emergency brake that cancels a firearm hit."),
    o('Config.MeleeCancelMode', "'secondary'", "'secondary' = rustige annulering (aanbevolen); 'immediate' = harde annulering, alleen als 'secondary' niet genoeg is.", "'secondary' = gentle cancel (recommended); 'immediate' = hard cancel, only if 'secondary' is not enough."),
    o('Config.RespectCombatContexts', "true", "Andere scripts (zoals ts_hostage) mogen de noodrem tijdelijk pauzeren via ts_bridge.", "Other scripts (such as ts_hostage) may pause the emergency brake through ts_bridge."),
    o('Config.AimControl', "25", "Control-ID van de richtknop (25 = rechtermuisknop / LT).", "Control ID of the aim button (25 = right mouse button / LT)."),
    o('Config.Debug', "false", "Extra uitvoer voor diagnose.", "Extra diagnostic output."))],
 webhooks=None,
 aces=dict(nl="Geen ACE nodig. Het script heeft geen beheercommando's.", en="No ACE needed. The script has no admin commands.", lines=[]))

# ---------------------------------------------------------------- ts_nohelmet
SCRIPTS['ts_nohelmet'] = dict(
 intro=("Kleine config: helm en doorschuiven aan of uit, het commando en de teksten.", "Small config: helmet and seat shuffling on or off, the command and the texts."),
 files=[f('config/config.lua', S, "Alle instellingen en meldingen.", "All settings and messages.")],
 groups=[g("Instellingen", "Settings",
    o('DisableAutomaticHelmet', "true", "Geen automatische GTA-motorhelm. Eigen kleding blijft staan.", "No automatic GTA motorcycle helmet. Your own clothing stays."),
    o('PreventAutoShuffle', "true", "Een passagier schuift niet vanzelf naar de bestuurdersstoel.", "A passenger does not move to the driver's seat automatically."),
    o('ShuffleCommand', "'schuif'", "Commando om zelf van voorstoel te wisselen, zonder /. false = uit.", "Command to switch front seats yourself, without /. false = off."),
    o('ShuffleTimeoutMs', "8000", "Maximale duur van één wissel in milliseconden.", "Maximum duration of one switch in milliseconds."),
    o('Radial.Enabled / Label / Icon', "true / 'Wissel voorstoel' / 'chair'", "Optie in het ox_lib-radiaalmenu, met naam en Font Awesome-icoon.", "Option in the ox_lib radial menu, with name and Font Awesome icon."),
    o('Messages', "NotInVehicle, Dead, ...", "Alle meldingen aan de speler; pas de tekst aan naar wens.", "All messages to the player; change the text as you like."))],
 webhooks=None,
 aces=dict(nl="Geen ACE nodig.", en="No ACE needed.", lines=[]))

# ---------------------------------------------------------------- ts_gemertmap
SCRIPTS['ts_gemertmap'] = dict(
 intro=("Hier stel je de radarzoom, de Nederlandse gebiedsnamen en eigen kaartpunten in. Na het vervangen van kaarttextures: volledige serverherstart en opnieuw verbinden.",
        "Here you set the radar zoom, Dutch area names and your own map points. After replacing map textures: full server restart and reconnect."),
 files=[f('config/config.lua', S, "Alle instellingen.", "All settings.")],
 groups=[g("Kaart", "Map",
    o('Config.StartupMessage', "'compact'", "Opstartmelding: 'full' = logo en info, 'compact' = alleen versieregel, 'off' = uit.", "Startup message: 'full' = logo and info, 'compact' = version line only, 'off' = off."),
    o('Config.UpdateCheck.Enabled', "true", "Versiecontrole via de TroyScripts-site (met of zonder ts_bridge).", "Version check through the TroyScripts site (with or without ts_bridge)."),
    o('Config.RadarZoom', "1100", "Zoomniveau van de minimap.", "Minimap zoom level."),
    o('Config.ZoomRefreshMs', "0", "0 = zoom alleen bij start, respawn en /gemertmapreset (aanbevolen). Vanaf 1000 = steeds opnieuw zetten, alleen als je HUD de zoom overschrijft.", "0 = set zoom only on start, respawn and /gemertmapreset (recommended). From 1000 = keep resetting it, only if your HUD overrides the zoom."),
    o('Config.DutchZoneNames', "true", "Nederlandse gebiedsnamen in de GTA-interface.", "Dutch area names in the GTA interface."),
    o('Config.ZoneNames', "AIRP = 'Gemert Airport', ...", "Eigen naam per GTA-gebied. Straatnamen veranderen niet.", "Own name per GTA area. Street names do not change."),
    o('Config.Points', "{}", "Eigen kaartpunten: { label, x, y, z, sprite, colour, scale, shortRange }.", "Own map points: { label, x, y, z, sprite, colour, scale, shortRange }."))],
 webhooks=None,
 aces=dict(nl="Geen ACE nodig. /postcode en /gemertmapreset zijn voor iedereen.", en="No ACE needed. /postcode and /gemertmapreset are for everyone.", lines=[]))

# ---------------------------------------------------------------- ts_parkeerapp
SCRIPTS['ts_parkeerapp'] = dict(
 intro=("Tarief, boetes en welke rekeningen het geld ontvangen. De bedrijfsrekeningen zelf stel je in bij ts_bridge (SocietyAccounts).",
        "Rate, fines and which accounts receive the money. The company accounts themselves are set in ts_bridge (SocietyAccounts)."),
 files=[f('config.lua', S, "Alle instellingen.", "All settings.")],
 groups=[g("Parkeren en boetes", "Parking and fines",
    o('centsPerMinute', "250", "Parkeertarief in centen per begonnen minuut (250 = € 2,50).", "Parking rate in cents per started minute (250 = € 2.50)."),
    o('parkingSociety', "'firefighter'", "Alias uit ts_bridge die het parkeergeld ontvangt.", "Alias from ts_bridge that receives parking money."),
    o('policeJobs', "{ police = true }", "Jobs die kunnen controleren en boetes geven.", "Jobs that can check and fine."),
    o('fineEuros', "100", "Boetebedrag in euro.", "Fine amount in euros."),
    o('fineSociety', "'police'", "Alias uit ts_bridge die de boetes ontvangt.", "Alias from ts_bridge that receives fines."),
    o('evidenceRadius', "8", "Maximale afstand in meters tussen agent en voertuig bij het uitschrijven.", "Maximum distance in meters between officer and vehicle when fining."),
    o('versionCheck', "true", "Versiecontrole via ts_bridge en de TroyScripts-site.", "Version check through ts_bridge and the TroyScripts site."))],
 webhooks=None,
 aces=dict(nl="Geen ACE nodig. Politierechten lopen via policeJobs.", en="No ACE needed. Police rights go through policeJobs.", lines=[]))

GENERAL = dict(
 nl=dict(
  title="Webhooks & rechten",
  lead="Hoe je Discord-webhooks maakt en invult, waar ze horen, en hoe je met ACE-rechten bepaalt wie beheercommando's mag gebruiken.",
  create=["Open in Discord het kanaal waar de logs moeten komen en klik op het tandwiel (Kanaal bewerken).",
          "Ga naar Integraties → Webhooks → Nieuwe webhook. Geef hem een naam, bijvoorbeeld 'TroyScripts gijzelingen'.",
          "Klik op 'Webhook-URL kopiëren'. Die ziet eruit als https://discord.com/api/webhooks/ID/TOKEN.",
          "Plak de URL tussen de aanhalingstekens in het juiste configbestand, bijvoorbeeld start = 'https://discord.com/api/webhooks/...'.",
          "Herstart het script en voer de actie één keer uit om te testen."],
  where=["Centraal: ts_bridge/config/webhook_config.lua. Hier kun je alle scripts op één plek instellen. Een ingevulde centrale route heeft altijd voorrang.",
         "Per script: het serverconfigbestand van het script zelf (bijvoorbeeld ts_hostage/config/server_config.lua). Dit wordt alleen gebruikt als de centrale route leeg is ('').",
         "Gebruik één van beide; dezelfde URL mag bij meerdere gebeurtenissen."],
  safety=["Een webhook-URL is een wachtwoord: wie hem heeft, kan berichten in je kanaal plaatsen.",
          "Zet URL's alleen in bestanden die alleen op de server worden geladen (webhook_config.lua, server.lua, server_config.lua, webhooks.lua). Nooit in config.lua, want dat bestand gaat ook naar spelers.",
          "Deel ingevulde configbestanden niet op Discord of GitHub. Is een URL uitgelekt? Verwijder de webhook in Discord en maak een nieuwe.",
          "Alleen discord.com-URL's van de vorm /api/webhooks/ID/TOKEN worden geaccepteerd; geen andere sites of extra parameters."],
  photos="Foto's in webhooks gebruiken screenshot-basic. Start die vóór de scripts en stel bij Electron AntiCheat de whitelist in. De limieten (wachttijd, grootte, wachtrij) staan in ts_bridge/config/config.lua.",
  ace_intro="ACE is het rechtensysteem van FiveM. Je zet de regels in server.cfg. Een speler krijgt een recht via een groep (principal).",
  ace_lines=[("add_ace group.admin ts_flatbed.admin allow", "Geef de groep admin het recht ts_flatbed.admin."),
             ("add_principal identifier.license:JOUW_LICENSE group.admin", "Zet een speler in de groep admin. Vervang JOUW_LICENSE door de license van de speler (te zien in txAdmin)."),
             ("add_principal identifier.discord:JOUW_DISCORD_ID group.admin", "Hetzelfde met een Discord-ID in plaats van een license.")],
  ace_notes=["Zet de regels na de ensure-regels in server.cfg en herstart de server.",
             "Veel scripts accepteren ook ESX-groepen of een minimale jobrang; ACE is dan een extra manier om het recht te geven. Per script staat hieronder wat er nodig is."],
  table_head=("Script", "ACE-regel", "Wat mag je ermee?")),
 en=dict(
  title="Webhooks & permissions",
  lead="How to create and fill in Discord webhooks, where they belong, and how to use ACE permissions to decide who may use admin commands.",
  create=["In Discord, open the channel for the logs and click the gear (Edit channel).",
          "Go to Integrations → Webhooks → New webhook. Give it a name, for example 'TroyScripts hostage'.",
          "Click 'Copy webhook URL'. It looks like https://discord.com/api/webhooks/ID/TOKEN.",
          "Paste the URL between the quotes in the right config file, for example start = 'https://discord.com/api/webhooks/...'.",
          "Restart the script and perform the action once to test."],
  where=["Central: ts_bridge/config/webhook_config.lua. Configure all scripts in one place. A filled-in central route always takes priority.",
         "Per script: the script's own server config file (for example ts_hostage/config/server_config.lua). Only used when the central route is empty ('').",
         "Use either one; the same URL may be used for several events."],
  safety=["A webhook URL is a password: anyone who has it can post in your channel.",
          "Only put URLs in files that are loaded on the server only (webhook_config.lua, server.lua, server_config.lua, webhooks.lua). Never in config.lua, because that file is also sent to players.",
          "Do not share filled-in config files on Discord or GitHub. Has a URL leaked? Delete the webhook in Discord and create a new one.",
          "Only discord.com URLs of the form /api/webhooks/ID/TOKEN are accepted; no other sites or extra parameters."],
  photos="Photos in webhooks use screenshot-basic. Start it before the scripts and set up the Electron AntiCheat whitelist. The limits (wait time, size, queue) are in ts_bridge/config/config.lua.",
  ace_intro="ACE is FiveM's permission system. You put the lines in server.cfg. A player gets a permission through a group (principal).",
  ace_lines=[("add_ace group.admin ts_flatbed.admin allow", "Give the admin group the ts_flatbed.admin permission."),
             ("add_principal identifier.license:JOUW_LICENSE group.admin", "Add a player to the admin group. Replace JOUW_LICENSE with the player's license (shown in txAdmin)."),
             ("add_principal identifier.discord:JOUW_DISCORD_ID group.admin", "The same with a Discord ID instead of a license.")],
  ace_notes=["Put the lines after the ensure lines in server.cfg and restart the server.",
             "Many scripts also accept ESX groups or a minimum job grade; ACE is then an extra way to grant the permission. Each script's needs are listed below."],
  table_head=("Script", "ACE line", "What does it allow?")))

def build(lang):
    i = 0 if lang == 'nl' else 1
    out = {'general': GENERAL[lang], 'scripts': {}}
    for sid, s in SCRIPTS.items():
        d = {'intro': s['intro'][i],
             'files': [{'path': x['path'], 'side': x['side'], 'text': x[lang]} for x in s['files']],
             'groups': [{'title': gr[lang], 'options': [{'key': k, 'default': v, 'text': (nl if lang == 'nl' else en)} for k, v, nl, en in gr['options']]} for gr in s['groups']],
             'webhooks': None, 'aces': None}
        if s['webhooks']:
            w = s['webhooks']
            d['webhooks'] = {'intro': w[lang], 'routes': [{'key': k, 'text': (nl if lang == 'nl' else en)} for k, nl, en in w['routes']], 'example': w.get('example')}
        if s['aces']:
            a = s['aces']
            d['aces'] = {'intro': a[lang], 'lines': [{'line': l, 'text': (nl if lang == 'nl' else en)} for l, nl, en in a['lines']]}
        out['scripts'][sid] = d
    return out

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
for lang, name in (('nl', 'configs.json'), ('en', 'configs_en.json')):
    with open(os.path.join(root, name), 'w', encoding='utf-8') as fh:
        fh.write(json.dumps(build(lang), ensure_ascii=False, indent=2) + '\n')
print('configs.json en configs_en.json geschreven:', len(SCRIPTS), 'scripts')
