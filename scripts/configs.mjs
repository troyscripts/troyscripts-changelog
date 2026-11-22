// Weergave van de configuratie-uitleg (per script) en de pagina Webhooks & rechten.
// Data: data/configs.json (NL) en data/configs_en.json (EN), gemaakt met scripts/source_configs.py.
import {escapeHtml as h} from './core.mjs';

export const CONFIG_LABELS = {
  nl: {kicker:'CONFIGURATIE', title:'Configuratie van', files:'Configbestanden', file:'Bestand', where:'Geladen op', what:'Inhoud',
       side:{gedeeld:'Server én spelers', server:'Alleen server'}, setting:'Instelling', def:'Standaard', explain:'Uitleg',
       webhooks:'Webhooks', aces:'Rechten (ACE)', copy:'Kopieer', serverCfg:'server.cfg', example:'Voorbeeld', more:'Webhooks & rechten uitgelegd',
       none:'Dit script heeft geen webhooks.', secret:'Zet webhook-URL\'s alleen in bestanden met "Alleen server".'},
  en: {kicker:'CONFIGURATION', title:'Configuring', files:'Config files', file:'File', where:'Loaded on', what:'Contents',
       side:{gedeeld:'Server and players', server:'Server only'}, setting:'Setting', def:'Default', explain:'Explanation',
       webhooks:'Webhooks', aces:'Permissions (ACE)', copy:'Copy', serverCfg:'server.cfg', example:'Example', more:'Webhooks & permissions explained',
       none:'This script has no webhooks.', secret:'Only put webhook URLs in files marked "Server only".'}
};

const codebox=(text,label,copy)=>`<div class="ac-codebox"><div class="ac-codebar"><strong>${h(label)}</strong><button type="button" class="ac-copy" data-copy-text="${h(text)}">${h(copy)}</button></div><pre><code>${h(text)}</code></pre></div>`;
const table=(head,rows)=>`<div class="ac-table-wrap"><table class="ac-table cfg-table"><thead><tr>${head.map(x=>`<th>${h(x)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;

export function renderConfigSection(d,name,lang,generalUrl){
  if(!d)return '';
  const L=CONFIG_LABELS[lang];
  const files=table([L.file,L.where,L.what],d.files.map(f=>`<tr><td><code>${h(f.path)}</code></td><td><span class="cfg-side cfg-${h(f.side)}">${h(L.side[f.side]||f.side)}</span></td><td>${h(f.text)}</td></tr>`));
  const groups=d.groups.map((g,i)=>`<details class="cfg-group" ${i===0?'open':''}><summary>${h(g.title)}<span class="cfg-count">${g.options.length}</span></summary>${table([L.setting,L.def,L.explain],g.options.map(o=>`<tr><td><code>${h(o.key)}</code></td><td><code class="cfg-default">${h(o.default)}</code></td><td>${h(o.text)}</td></tr>`))}</details>`).join('');
  const hooks=d.webhooks?`<h3 id="webhooks">${h(L.webhooks)}</h3><p>${h(d.webhooks.intro)}</p>${table([L.setting,L.explain],d.webhooks.routes.map(r=>`<tr><td><code>${h(r.key)}</code></td><td>${h(r.text)}</td></tr>`))}${d.webhooks.example?codebox(d.webhooks.example,L.example,L.copy):''}<p class="ac-note">${h(L.secret)}</p>`:'';
  const aces=d.aces?`<h3 id="ace">${h(L.aces)}</h3><p>${h(d.aces.intro)}</p>${d.aces.lines.length?codebox(d.aces.lines.map(l=>l.line).join('\n'),L.serverCfg,L.copy)+`<ul class="bullet-list">${d.aces.lines.map(l=>`<li><code>${h(l.line)}</code> — ${h(l.text)}</li>`).join('')}</ul>`:''}`:'';
  return `<section id="configuration" class="guide-section cfg-section"><span class="section-kicker">${h(L.kicker)}</span><h2>${h(L.title)} ${h(name)}</h2><p>${h(d.intro)}</p><h3>${h(L.files)}</h3>${files}${groups}${hooks}${aces}<div class="guide-action-links"><a class="secondary-btn" href="${h(generalUrl)}">🔗 ${h(L.more)}</a></div></section>`;
}

export function renderGeneral(data,catalog,lang,{home,scriptUrl,displayName}){
  const g=data.general, L=CONFIG_LABELS[lang];
  const li=a=>a.map(x=>`<li>${h(x)}</li>`).join('');
  const hookScripts=catalog.filter(s=>data.scripts[s.id]?.webhooks);
  const aceRows=catalog.flatMap(s=>(data.scripts[s.id]?.aces?.lines||[]).filter(l=>l.line.startsWith('add_ace')).map(l=>`<tr><td><a href="${h(scriptUrl(s)+'#ace')}">${h(displayName(s))}</a></td><td><code>${h(l.line)}</code></td><td>${h(l.text)}</td></tr>`));
  const toc=lang==='nl'?['Webhook maken','Waar invullen','Veiligheid','Per script','ACE-rechten']:['Create a webhook','Where to set it','Security','Per script','ACE permissions'];
  return `<div class="breadcrumb"><a href="${h(home)}">Home</a><span>/</span><span>${h(g.title)}</span></div>
  <header class="ac-head"><span class="section-kicker">${h(L.kicker)}</span><h1>🔗 ${h(g.title)}</h1><p>${h(g.lead)}</p></header>
  <nav class="ac-toc"><a href="#maken">${h(toc[0])}</a><a href="#waar">${h(toc[1])}</a><a href="#veilig">${h(toc[2])}</a><a href="#scripts">${h(toc[3])}</a><a href="#ace">${h(toc[4])}</a></nav>
  <section class="ac-panel" id="maken"><h2>${h(toc[0])}</h2><ol class="ac-list">${li(g.create)}</ol></section>
  <section class="ac-panel" id="waar"><h2>${h(toc[1])}</h2><ul class="ac-list">${li(g.where)}</ul><p class="ac-note">${h(g.photos)}</p></section>
  <section class="ac-panel" id="veilig"><h2>${h(toc[2])}</h2><ul class="ac-list">${li(g.safety)}</ul></section>
  <section class="ac-panel" id="scripts"><h2>${h(toc[3])}</h2>${table(['Script',L.webhooks],hookScripts.map(s=>`<tr><td><a href="${h(scriptUrl(s)+'#webhooks')}">${h(displayName(s))}</a></td><td>${h(data.scripts[s.id].webhooks.intro)}</td></tr>`))}</section>
  <section class="ac-panel" id="ace"><h2>${h(toc[4])}</h2><p>${h(g.ace_intro)}</p>${codebox(g.ace_lines.map(x=>x[0]).join('\n'),L.serverCfg,L.copy)}<ul class="ac-list">${g.ace_lines.map(x=>`<li><code>${h(x[0])}</code> — ${h(x[1])}</li>`).join('')}</ul><ul class="ac-list">${li(g.ace_notes)}</ul>${table(g.table_head,aceRows)}</section>
  <div class="ac-bottom"><a class="secondary-btn" href="${h(home)}">← ${lang==='nl'?'Alle scripts':'All projects'}</a></div>`;
}
