import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {GROUP_ORDER,escapeHtml as h,latestVersion,releasesFor,publishedReleases,siteConfig,absolute} from './core.mjs';
import {renderConfigSection,renderGeneral} from './configs.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const dist=join(root,'dist');
const nlHome=siteConfig(), enHome=absolute(nlHome,'en/');
const catalog=JSON.parse(readFileSync(join(root,'data/catalog.json'),'utf8'));
const releases=JSON.parse(readFileSync(join(root,'data/releases.json'),'utf8'));
const en=JSON.parse(readFileSync(join(root,'data/en.json'),'utf8'));
const releaseEn=JSON.parse(readFileSync(join(root,'data/releases_en.json'),'utf8'));
const anti=JSON.parse(readFileSync(join(root,'data/anticheat_en.json'),'utf8'));
const configs=JSON.parse(readFileSync(join(root,'data/configs_en.json'),'utf8'));
const all=publishedReleases(releases).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
function write(path,content){const target=join(dist,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content,'utf8');}
const url=(path='')=>absolute(enHome,path);
const display=s=>en.catalog[s.id]?.[0]||s.name;
const describe=s=>en.catalog[s.id]?.[1]||s.description;
const group=c=>en.categories[c]||c;
function sidebar(active){
 return '<aside class="sidebar" id="sidebar"><div class="side-label">NAVIGATION</div>'+
 '<a class="side-home" href="'+h(enHome)+'">⌂ &nbsp; All updates</a>'+
 '<a class="side-special" href="'+h(url('installatie/'))+'">⚙ Interactive installation guide ↗</a>'+
 '<a class="side-special ac-nav" href="'+h(url('anticheat/'))+'">🛡 Electron AntiCheat ↗</a>'+
 '<a class="side-special" href="'+h(url('webhooks/'))+'">🔗 Webhooks & permissions ↗</a>'+
 '<div class="side-label side-gap">DOCUMENTATION</div>'+
 GROUP_ORDER.map(c=>{const members=catalog.filter(s=>s.category===c);if(!members.length)return '';
 return '<div class="side-group"><h3 class="side-category">'+h(group(c))+'</h3>'+
 members.map(s=>'<details class="side-details '+(active===s.id?'current':'')+'" '+(active===s.id?'open':'')+'>'+
 '<summary><span class="side-icon">'+h(s.icon)+'</span><span class="side-label-name">'+h(display(s))+'</span><span class="side-chevron">›</span></summary>'+
 '<div class="side-children"><a href="'+h(url('scripts/'+s.id+'/#introduction'))+'">ⓘ Introduction</a>'+
 '<a href="'+h(url('scripts/'+s.id+'/#changelog'))+'">◴ Changelog</a>'+
 '<a href="'+h(url('scripts/'+s.id+'/#installation'))+'">⚙ Installation</a>'+
 (configs.scripts[s.id]?'<a href="'+h(url('scripts/'+s.id+'/#configuration'))+'">🛠 Configuration</a>':'')+
 '<a href="'+h(url('installatie/?script='+s.id))+'">▣ Setup plan</a></div></details>').join('')+'</div>';
 }).join('')+
 '<div class="sidebar-foot">TroyScripts documentation and release updates. Always verify files and settings on your own server.</div></aside>';
}
function page({title,description,body,active,route=''}) {
 const enUrl=url(route),nlUrl=absolute(nlHome,route);
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="color-scheme" content="dark"><meta name="theme-color" content="#070c19"><meta name="description" content="'+h(description)+'">'+
 '<title>'+h(title)+' | TroyScripts</title><link rel="canonical" href="'+h(enUrl)+'">'+
 '<link rel="alternate" hreflang="en" href="'+h(enUrl)+'"><link rel="alternate" hreflang="nl" href="'+h(nlUrl)+'">'+
 '<link rel="stylesheet" href="'+h(absolute(nlHome,'assets/style.css'))+'"><link rel="stylesheet" href="'+h(absolute(nlHome,'assets/anticheat.css'))+'">'+
 '<link rel="stylesheet" href="'+h(absolute(nlHome,'assets/language.css'))+'"><script src="'+h(absolute(nlHome,'assets/app.js'))+'" defer></script>'+
 '<script src="'+h(absolute(nlHome,'assets/installer-en.js'))+'" defer></script></head><body>'+
 '<header class="topbar"><div class="topbar-inner"><a class="brand" href="'+h(enHome)+'" aria-label="TroyScripts home"><span class="brand-mark"><span>T</span>S</span><span>Troy<span class="brand-accent">Scripts</span><small>DOCUMENTATION & UPDATES</small></span></a>'+
 '<nav class="top-links"><a href="'+h(enHome)+'">Overview</a><a href="'+h(url('#scripts'))+'">Projects</a><a href="'+h(url('#updates'))+'">Updates</a><a href="'+h(url('installatie/'))+'">Installation guide</a><a href="'+h(url('anticheat/'))+'">AntiCheat</a><a href="'+h(url('webhooks/'))+'">Webhooks</a><a href="https://troy-scripts.tebex.store/" target="_blank" rel="noopener noreferrer">Tebex ↗</a></nav>'+
 '<label class="language-picker"><span>🌐</span><select data-language data-language-root="'+h(nlHome)+'" aria-label="Choose language"><option value="nl">Nederlands</option><option value="en" selected>English</option></select></label></div></header>'+
 '<div class="layout"><button class="mobile-nav" data-sidebar-toggle aria-controls="sidebar" aria-expanded="false">☰ &nbsp; Open script menu</button>'+
 sidebar(active)+'<main id="main">'+body+'</main></div><footer class="footer"><span>© '+new Date().getUTCFullYear()+' TroyScripts · Versions from the official release catalog</span><a href="'+h(enHome)+'">Back to overview ↑</a></footer></body></html>';
}
function cards(){
 return catalog.map(s=>'<a class="script-card" href="'+h(url('scripts/'+s.id+'/'))+'" data-filter="'+h([s.id,display(s),describe(s),group(s.category)].join(' ').toLowerCase())+'"><div class="script-card-top"><span class="script-emoji">'+h(s.icon)+'</span><span class="version">v'+h(latestVersion(s,releases))+'</span></div><h3>'+h(display(s))+'</h3><p>'+h(describe(s))+'</p><div class="script-bottom"><span>'+h(group(s.category))+'</span><span>View changelog ↗</span></div></a>').join('');
}
const home='<section class="hero"><div class="eyebrow"><span class="spark">✦</span> THE OFFICIAL UPDATE HUB</div>'+
 '<h1>Every update.<br><span>One place.</span></h1><p>Find TroyScripts releases, Discord bot updates, installation guides and release history in one place.</p>'+
 '<div class="hero-actions"><a class="primary-btn" href="#scripts">Browse projects ↘</a><a class="secondary-btn" href="#updates">Recent changes ↗</a><a class="secondary-btn" href="'+h(url('installatie/'))+'">⚙ Installation guide</a></div>'+
 '<div class="hero-stats"><div><b>'+catalog.length+'</b><span>Projects</span></div><div><b>'+all.length+'</b><span>Release notes</span></div><div><b>EN</b><span>English</span></div></div></section>'+
 '<section class="section" id="scripts"><div class="section-head"><div><span class="section-kicker">SCRIPT LIBRARY</span><h2>Our projects</h2></div><label class="searchbox"><span>⌕</span><input data-search type="search" placeholder="Search projects..." aria-label="Search projects"></label></div><div class="cards-grid" data-cards>'+cards()+'</div><p class="empty" data-empty hidden>No matching projects found.</p></section>'+
 '<section id="updates" class="section"><div class="section-head"><div><span class="section-kicker">RELEASE HISTORY</span><h2>Recent changelogs</h2></div><span class="muted">Verified releases</span></div><div class="update-list">'+
 all.slice(0,8).map(r=>{const s=catalog.find(s=>s.id===r.script),summary=releaseEn[r.script+'@'+r.version]?.summary||'Release documentation';return '<a class="update-item" href="'+h(url('scripts/'+s.id+'/#v'+r.version))+'"><span class="update-icon">'+h(s.icon)+'</span><span class="update-info"><strong>'+h(display(s))+'</strong><small>'+h(summary)+'</small></span><span class="update-version">v'+h(r.version)+'</span><span class="update-arrow">↗</span></a>';}).join('')+
 '</div><p class="explain">A registered version may be newer than its latest documented functional release. We do not invent release details.</p></section>';
write('en/index.html',page({title:'Changelogs & Updates',description:'English TroyScripts changelogs and setup guides for FiveM scripts and the Discord bot.',body:home}));

for(const s of catalog){
 const m=en.manuals[s.id],history=releasesFor(s.id,releases),latest=latestVersion(s,releases);
 const bullets=arr=>'<ol class="setup-steps">'+arr.map(x=>'<li>'+h(x)+'</li>').join('')+'</ol>';
 const releaseHtml=history.map((r,i)=>{const summary=releaseEn[r.script+'@'+r.version]?.summary;
 if(!summary)throw Error('Missing English release summary: '+r.script+' '+r.version);
 const date=r.date?new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'}).format(new Date(r.date+'T12:00:00Z')):'Release date not provided';
 return '<article class="release" id="v'+h(r.version)+'"><div class="release-date">'+h(date)+'<span class="timeline-dot"></span></div><div class="release-body"><div class="release-head"><h2>Version '+h(r.version)+'</h2>'+(i===0?'<span class="release-tag">Latest changelog</span>':'')+
 '</div><section><h3>Release summary</h3><p class="ac-note">'+h(summary)+'</p></section>'+
 (r.files.length?'<section><h3>Changed files</h3><ul class="files-list">'+r.files.map(f=>'<li><code>'+h(f)+'</code></li>').join('')+'</ul></section>':'')+
 '<p class="source-note">English summary of the original Dutch release notes; version numbers and file names are unchanged.</p></div></article>';
 }).join('');
 const content='<div class="breadcrumb"><a href="'+h(enHome)+'">Home</a><span>/</span><span>'+h(s.id)+'</span></div>'+
 '<section id="introduction" class="script-hero intro-section"><div class="big-icon">'+h(s.icon)+'</div><div><span class="section-kicker">'+h(group(s.category))+'</span><h1>'+h(display(s))+'</h1><p>'+h(describe(s))+'</p><div class="script-tags"><span class="version">Current registered version: '+h(latest)+'</span><span>'+history.length+' release notes</span></div></div></section>'+
 (!history.some(r=>r.version===latest)?'<div class="notice"><span>ℹ</span><p>Version '+h(latest)+' is registered, but a verified feature changelog is not available. It may be an administrative release. Previous documented changes appear below.</p></div>':'')+
 '<section id="installation" class="guide-section"><span class="section-kicker">INSTALL OR UPDATE</span><h2>Installation: '+h(display(s))+'</h2><p>'+h(m.summary)+'</p><h3>Requirements</h3>'+bullets(m.requirements)+'<h3>New installation</h3>'+bullets(m.install)+'<h3>Updating an existing installation</h3>'+bullets(m.update)+
 '<div class="guide-action-links"><a class="primary-btn" href="'+h(url('installatie/?script='+s.id))+'">⚙ Create setup plan</a><a class="secondary-btn" href="'+h(url('installatie/?script='+s.id+'&mode=update'))+'">↻ Update plan</a>'+(m.type==='fivem'?'<a class="secondary-btn" href="'+h(url('anticheat/'))+'">🛡 AntiCheat guide</a>':'')+'</div></section>'+renderConfigSection(configs.scripts[s.id],display(s),'en',url('webhooks/'))+
 '<section id="changelog" class="history-header"><div><span class="section-kicker">RELEASE ARCHIVE</span><h2>Changelog</h2><p>English summaries of the published release history for '+h(display(s))+'.</p></div><a class="secondary-btn" href="'+h(enHome)+'">← All projects</a></section>'+
 '<div class="timeline">'+(releaseHtml||'<p class="muted">No release notes have been published yet.</p>')+'</div>';
 write('en/scripts/'+s.id+'/index.html',page({title:display(s)+' · Changelog',description:describe(s),body:content,active:s.id,route:'scripts/'+s.id+'/'}));
}
write('en/installatie/index.html',page({title:'Interactive Installation Guide',description:'Select FiveM scripts and generate a tailored installation or upgrade plan.',body:'<div class="breadcrumb"><a href="'+h(enHome)+'">Home</a><span>/</span><span>Installation guide</span></div><div id="installer" data-url="'+h(url('api/installer.json'))+'"><p class="muted">Loading installation data...</p></div>',route:'installatie/'}));
write('en/api/installer.json',JSON.stringify({catalog:catalog.map(s=>({...s,name:display(s),description:describe(s)})),manuals:en.manuals,items:JSON.parse(readFileSync(join(root,'data/items.json'),'utf8'))},null,2)+'\n');

const el=arr=>arr.map(x=>'<li>'+h(x)+'</li>').join('');
const antiBody='<div class="breadcrumb"><a href="'+h(enHome)+'">Home</a><span>/</span><span>Electron AntiCheat</span></div>'+
 '<header class="ac-head"><span class="section-kicker">SECURITY & INTEGRATIONS</span><h1>🛡 Electron AntiCheat</h1><p class="ac-subtitle">Resource whitelist and Discord webhook screenshots</p><p>'+h(anti.scope)+'</p><p class="muted">Source last reviewed: November 6, 2026</p></header>'+
 '<nav class="ac-toc"><a href="#whitelist">Whitelist</a><a href="#voorbeeld">Example</a><a href="#controle">Testing</a><a href="#problemen">Troubleshooting</a></nav>'+
 '<section class="ac-panel"><h2>When is this required?</h2><p>'+h(anti.intro)+'</p><h3>Which resources should be whitelisted?</h3><div class="ac-table-wrap"><table class="ac-table"><thead><tr><th>Resource</th><th>When?</th></tr></thead><tbody>'+anti.table.map(x=>'<tr><td><strong>'+h(x.name)+'</strong></td><td>'+h(x.condition)+'</td></tr>').join('')+'</tbody></table></div></section>'+
 '<section id="whitelist" class="ac-panel"><h2>Configure the Electron whitelist</h2><ol class="ac-list">'+el(anti.steps)+'</ol><p class="ac-note">'+h(anti.notes[1])+'</p></section>'+
 '<section id="voorbeeld" class="ac-panel"><h2>Example: ts_hostage + ts_bridge</h2><p>'+h(anti.example.lead)+'</p><div class="ac-codebox"><div class="ac-codebar">Resource whitelist<button type="button" class="ac-copy" data-copy-text="'+h(anti.example.resources.join('\n'))+'">Copy</button></div><pre><code>'+h(anti.example.resources.join('\n'))+'</code></pre></div><p class="ac-note">'+h(anti.example.caution)+'</p></section>'+
 '<section id="controle" class="ac-panel"><h2>Verification checklist</h2><div class="ac-checks">'+anti.checks.map(x=>'<label><input type="checkbox"><span>'+h(x)+'</span></label>').join('')+'</div></section>'+
 '<section id="problemen" class="ac-panel"><h2>Troubleshooting</h2><div class="ac-faq">'+anti.troubleshooting.map((x,i)=>'<details '+(i===0?'open':'')+'><summary>'+h(x.title)+'<span>⌄</span></summary><div><p>'+h(x.answer)+'</p>'+(x.code?'<pre><code>'+h(x.code)+'</code></pre>':'')+'</div></details>').join('')+'</div></section>'+
 '<section class="ac-panel"><h2>Important notes</h2><ul class="ac-list">'+el([anti.notes[0],anti.notes[2]])+'</ul><h3>Official references</h3><div class="ac-source-links">'+anti.sources.map(s=>'<a href="'+h(s.url)+'" rel="noopener noreferrer" target="_blank">'+h(s.label)+' ↗</a>').join('')+'</div><p class="ac-source-note">'+h(anti.sourceNote)+'</p></section>'+
 '<div class="ac-bottom"><a class="primary-btn" href="'+h(url('installatie/'))+'">⚙ Installation guide</a><a class="secondary-btn" href="'+h(enHome)+'">← All projects</a></div>';
write('en/webhooks/index.html',page({title:configs.general.title,description:configs.general.lead,body:renderGeneral(configs,catalog,'en',{home:enHome,scriptUrl:s=>url('scripts/'+s.id+'/'),displayName:display}),route:'webhooks/'}));
write('en/anticheat/index.html',page({title:'Electron AntiCheat · Whitelist Guide',description:anti.scope,body:antiBody,route:'anticheat/'}));
const sitemap='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[enHome,url('installatie/'),url('anticheat/'),url('webhooks/'),...catalog.map(s=>url('scripts/'+s.id+'/'))].map(s=>'<url><loc>'+h(s)+'</loc></url>').join('')+'</urlset>';
write('en/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>'+sitemap);
console.log('English pages built: '+(catalog.length+4)+' (NL version catalog unchanged)');


/* Render the interactive installer in English without changing the Dutch original. */
let installer=readFileSync(join(root,'assets/installer.js'),'utf8');
const strings={"Voor uitsluitend markerpunten kan ox_target achterwege blijven.":"If you only use markers, ox_target is optional.","Sky Phone moet vooraf al volledig zijn geconfigureerd.":"Configure Sky Phone before installing this app.","0r_idcard is optioneel; start deze na ts_keycard als je werkpassen gebruikt.":"0r_idcard is optional; start it after ts_keycard when using staff IDs.","screenshot-basic is optioneel en moet vóór ts_hostage draaien als je foto-webhooks gebruikt.":"screenshot-basic is optional; start it before ts_hostage for photo webhooks.","Start eventueel gebruikte voertuigresources vóór ts_flatbed.":"Start any required recovery vehicle resources before ts_flatbed.","Gebruik deze regels alleen voor resources die je daadwerkelijk hebt geïnstalleerd. Controleer bestaande ensure-regels en voeg niets dubbel toe. Providerinstellingen en eventuele aangepaste resourcenamen moet je zelf verifiëren.":"Use these lines only for resources installed on your server. Check existing ensure entries to avoid duplicates. Verify providers and custom resource names.","Stel je eigen installatieplan samen":"Build your own installation plan","Vink aan welke TroyScripts-resources je gebruikt. De handleiding past de benodigde afhankelijkheden, startvolgorde, inventory-items en controles automatisch aan.":"Select the TroyScripts resources you use. Requirements, startup order, inventory items and checks will update automatically.","INTERACTIEVE INSTALLATIEHULP":"INTERACTIVE INSTALLATION GUIDE","Kies installatietype":"Choose installation type","Nieuwe installatie":"New installation","Bestaande installatie bijwerken":"Update an existing installation","Alle FiveM-scripts":"All FiveM scripts","Selectie wissen":"Clear selection","Kies jouw scripts":"Choose your scripts","geselecteerd":"selected","ts_bridge wordt automatisch meegenomen zodra een gekozen resource deze vereist. Een Discord-bot wordt nooit aan server.cfg toegevoegd.":"ts_bridge is included automatically if needed. The Discord bot is never added to server.cfg.","Optionele aparte Node.js-handleiding — geen FiveM-resource":"Separate optional Node.js guide — not a FiveM resource","JOUW GEGENEREERDE HANDLEIDING":"YOUR GENERATED GUIDE","gekozen":"chosen","Selecteer hierboven één of meer scripts om jouw handleiding samen te stellen.":"Select one or more resources above to generate your guide.","Voorbereiding en vereisten":"Preparation and requirements","Back-ups en voorbereiding":"Backups and preparation","Stop de betrokken resources op een geschikt onderhoudsmoment. Bewaar je persoonlijke configuraties, databases, data-mappen en eventuele escrowinstellingen. Gebruik de nieuwste volledige releasepakketten.":"Stop the relevant resources during a maintenance window. Preserve custom configurations, databases, data folders and escrow settings. Use complete release packages.","Controleer de FiveM-artifacts, OneSync, databases en de door jou gebruikte providers. Zorg dat alle geselecteerde downloads beschikbaar zijn. Externe frameworks of vehicles worden niet meegeleverd.":"Check FiveM artifacts, OneSync, databases and installed providers. Download the required packages. External frameworks and vehicles are not included.","OneSync is noodzakelijk voor minstens één van jouw gekozen scripts.":"OneSync is required by at least one selected script.","Benodigde externe providers:":"Required external providers:","De configuratie van deze systemen blijft afhankelijk van jouw server.":"Configure these providers according to your own server.","FiveM-startvolgorde (server.cfg)":"FiveM startup order (server.cfg)","# Plaats OneSync en providerconfiguratie vóór deze regels.":"# Configure OneSync and your providers before these lines.","Voorbeeld startvolgorde":"Example startup order","ts_bridge is automatisch toegevoegd vanwege de geselecteerde afhankelijke scripts.":"ts_bridge was included automatically because selected scripts depend on it.","Inventory-items voor ox_inventory":"Inventory items for ox_inventory","Alleen voor":"Only for","Controleer welke items al bestaan en plak uitsluitend ontbrekende definities binnen":"Check which items already exist and add only missing definitions inside","Bewaar bestaande entries en plaats benodigde iconen in":"Keep existing entries and put the required icons in","Itemdefinities — uit de scriptrepositories":"Item definitions — from the script repositories","Stappen per script":"Steps by script","Update-instructies per script":"Update instructions by script","Vereisten":"Requirements","Installatiestappen":"Installation steps","Update en behoud van gegevens":"Updating and preserving data","Bewaar je eigen gegevens":"Preserve your files and data","Aanvullend":"Additional information","Na afloop controleren":"Verify after installation","Afronden en controleren":"Finish and verify","Herstart de server na wijzigingen aan de startvolgorde, inventory-items, SQL of streamingbestanden. Test iedere geselecteerde resource afzonderlijk en controleer de serverconsole. Gebruik geen wachtwoorden, API-sleutels of webhook-URL's in publieke GitHubbestanden.":"Restart the server after changing startup order, inventory items, SQL or streamed assets. Test each resource and inspect the server console. Never publish passwords, API keys or webhook URLs on GitHub.","De Discord-bot draait op een afzonderlijke Node.js 24-hosting. Hij heeft geen server.cfg-regels; volg de botsectie hierboven.":"The Discord bot runs on separate Node.js 24 hosting. It does not use server.cfg; follow its dedicated instructions above.","Kopieer":"Copy","Gekopieerd!":"Copied!","Kopiëren mislukt":"Copy failed","Geen aanvullende stappen.":"No additional steps.","De installatiegegevens konden niet worden geladen. Vernieuw de pagina of probeer het later opnieuw.":"Installation data could not be loaded. Refresh the page and try again.","Plak uitsluitend ontbrekende definities":"Add only missing definitions","of":"or"};
for(const [dutch,english] of Object.entries(strings)) {
 if(dutch==='of')continue;
 installer=installer.split(dutch).join(english);
}
write('assets/installer-en.js',installer);
