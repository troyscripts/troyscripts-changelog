(function installerMain() {
  const root = document.getElementById('installer');
  if (!root) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = {selected: new Set(), mode:'install'};
  const providerLabels = {oxmysql:'oxmysql',es_extended:'es_extended (ESX)',ox_lib:'ox_lib',ox_inventory:'ox_inventory',ox_target:'ox_target',sky_phone:'sky_phone'};
  const preferenceOrder = ['oxmysql','ox_lib','es_extended','ox_target','ox_inventory','sky_phone','ts_gemertmap','ts_bridge','ts_antipunch','ts_nohelmet','ts_hostage','ts_nlplates','ts_flatbed','ts_repairpoints','ts_keycard','ts_parkeerapp'];
  const addons = {'ts_flatbed':['Start eventueel gebruikte voertuigresources vóór ts_flatbed.'],'ts_keycard':['0r_idcard is optioneel; start deze na ts_keycard als je werkpassen gebruikt.'],'ts_hostage':['screenshot-basic is optioneel en moet vóór ts_hostage draaien als je foto-webhooks gebruikt.'],'ts_repairpoints':['Voor uitsluitend markerpunten kan ox_target achterwege blijven.'],'ts_parkeerapp':['Sky Phone moet vooraf al volledig zijn geconfigureerd.']};
  let data;
  const byId = id => data.catalog.find(s=>s.id===id);
  const manual = id => data.manuals[id];
  const displayName = s => s.category === 'Discord-bot' ? s.name : s.id;
  function resolve() {
    const ids = [...state.selected];
    const full = new Set(ids);
    if (ids.some(id => (manual(id)?.needs || []).includes('ts_bridge'))) full.add('ts_bridge');
    const providerSet = new Set();
    let onesync = false;
    for (const id of full) {
      const m = manual(id);
      if (!m || (m.type !== 'fivem' && m.type !== 'tool')) continue;
      for (const p of m.providers || []) providerSet.add(p);
      if (m.onesync) onesync = true;
    }
    const resources = [...new Set([...providerSet,...full].filter(id => id !== 'tgc_bot' && manual(id)?.type !== 'tool'))].sort((a,b)=> {
      const x=preferenceOrder.indexOf(a),y=preferenceOrder.indexOf(b);
      return (x < 0 ? 999 : x) - (y < 0 ? 999 : y);
    });
    return {resources, providers:[...providerSet],full,onesync,hasBot:full.has('tgc_bot')};
  }
  function codeBlock(text,label) {
    return `<div class="install-code"><div class="install-code-heading"><span>${esc(label)}</span><button class="copy-install" type="button" data-copy="${esc(text)}">Kopieer</button></div><pre><code>${esc(text)}</code></pre></div>`;
  }
  function sectionList(arr) {return arr?.length ? `<ol class="setup-steps">${arr.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>` : '<p class="muted">Geen aanvullende stappen.</p>';}
  function getItems(ids) {
    const texts = [];
    const picked = [];
    for (const id of ids) {
      if (!data.items[id]) continue;
      texts.push(`-- ${id} (${data.items[id].source})\n${data.items[id].code}`);
      picked.push(id);
    }
    return {code:texts.join('\n\n'),picked};
  }
  function render() {
    const ids = data.catalog.filter(s=>s.id!=='tgc_bot');
    const selectedCount=state.selected.size;
    const {resources,providers,full,onesync,hasBot}=resolve();
    const code = resources.map(s=>`ensure ${s}`).join('\n');
    const itemData = getItems(full);
    const frameworkNote = 'Gebruik deze regels alleen voor resources die je daadwerkelijk hebt geïnstalleerd. Controleer bestaande ensure-regels en voeg niets dubbel toe. Providerinstellingen en eventuele aangepaste resourcenamen moet je zelf verifiëren.';
    root.innerHTML=`
      <div class="installer-head"><span class="section-kicker">INTERACTIEVE INSTALLATIEHULP</span><h1>Stel je eigen installatieplan samen</h1><p>Vink aan welke TroyScripts-resources je gebruikt. De handleiding past de benodigde afhankelijkheden, startvolgorde, inventory-items en controles automatisch aan.</p></div>
      <div class="setup-toolbar"><div class="setup-modes" role="group" aria-label="Kies installatietype"><button type="button" class="${state.mode==='install'?'chosen':''}" data-mode="install">Nieuwe installatie</button><button type="button" class="${state.mode==='update'?'chosen':''}" data-mode="update">Bestaande installatie bijwerken</button></div><div><button type="button" data-select="all">Alle FiveM-scripts</button><button type="button" data-select="none">Selectie wissen</button></div></div>
      <h2>Kies jouw scripts <span class="counter">${selectedCount} geselecteerd</span></h2>
      <p class="muted">ts_bridge wordt automatisch meegenomen zodra een gekozen resource deze vereist. Een Discord-bot wordt nooit aan server.cfg toegevoegd.</p>
      <div class="pick-grid">${ids.map(s=>`<label class="pick-card ${state.selected.has(s.id)?'picked':''}"><input type="checkbox" value="${esc(s.id)}" ${state.selected.has(s.id)?'checked':''}><span class="pick-emoji">${esc(s.icon)}</span><span><strong>${esc(s.id)}</strong><small>${esc(s.description)}</small></span>${s.id==='ts_bridge'?'<span class="pick-note">Basis</span>':''}</label>`).join('')}</div>
      <label class="bot-selector"><input type="checkbox" value="tgc_bot" ${hasBot?'checked':''}><span>🤖</span><span><strong>Troy’s Game Community Bot</strong><small>Optionele aparte Node.js-handleiding — geen FiveM-resource</small></span></label>
      <section class="generated-guide" aria-live="polite"><div class="section-kicker">JOUW GEGENEREERDE HANDLEIDING</div><h2>${state.mode==='install'?'Nieuwe installatie':'Bestaande installatie bijwerken'} — ${selectedCount} gekozen</h2>
      ${selectedCount===0?'<div class="guide-empty">Selecteer hierboven één of meer scripts om jouw handleiding samen te stellen.</div>':`
      <div class="guide-step"><span class="step-number">1</span><div><h3>${state.mode==='install'?'Voorbereiding en vereisten':'Back-ups en voorbereiding'}</h3>${state.mode==='update'?'<p>Stop de betrokken resources op een geschikt onderhoudsmoment. Bewaar je persoonlijke configuraties, databases, data-mappen en eventuele escrowinstellingen. Gebruik de nieuwste volledige releasepakketten.</p>':'<p>Controleer de FiveM-artifacts, OneSync, databases en de door jou gebruikte providers. Zorg dat alle geselecteerde downloads beschikbaar zijn. Externe frameworks of vehicles worden niet meegeleverd.</p>'}
      ${onesync?'<p class="setup-warning">OneSync is noodzakelijk voor minstens één van jouw gekozen scripts.</p>':''}
      ${providers.length?`<p>Benodigde externe providers: ${providers.map(p=>`<code>${esc(providerLabels[p]||p)}</code>`).join(' · ')}. De configuratie van deze systemen blijft afhankelijk van jouw server.</p>`:''}</div></div>
      ${resources.length?`<div class="guide-step"><span class="step-number">2</span><div><h3>FiveM-startvolgorde (server.cfg)</h3><p>${frameworkNote}</p>${codeBlock('# Plaats OneSync en providerconfiguratie vóór deze regels.\n'+code,'Voorbeeld startvolgorde')}${full.has('ts_bridge')&& !state.selected.has('ts_bridge')?'<p class="setup-info">ts_bridge is automatisch toegevoegd vanwege de geselecteerde afhankelijke scripts.</p>':''}</div></div>`:''}
      ${itemData.picked.length?`<div class="guide-step"><span class="step-number">3</span><div><h3>Inventory-items voor ox_inventory</h3><p>Alleen voor ${itemData.picked.map(esc).join(' en ')}. Controleer welke items al bestaan en plak uitsluitend ontbrekende definities binnen <code>return { ... }</code> in <code>ox_inventory/data/items.lua</code>. Bewaar bestaande entries en plaats benodigde iconen in <code>ox_inventory/web/images/</code>.</p>${codeBlock(itemData.code,'Itemdefinities — uit de scriptrepositories')}</div></div>`:''}
      <div class="guide-step"><span class="step-number">${itemData.picked.length?4:3}</span><div><h3>${state.mode==='install'?'Stappen per script':'Update-instructies per script'}</h3>
      ${data.catalog.filter(s=>full.has(s.id)).map(s=>{
        const m=manual(s.id);
        return `<details class="setup-script" ${full.size===1?'open':''}><summary>${esc(s.icon)} <strong>${esc(displayName(s))}</strong><span>v${esc(s.initialVersion)}</span></summary><div><p>${esc(m.summary)}</p><h4>Vereisten</h4>${sectionList(m.requirements)}<h4>${state.mode==='install'?'Installatiestappen':'Update en behoud van gegevens'}</h4>${sectionList(state.mode==='install'?m.install:m.update)}${m.preserve?.length?`<h4>Bewaar je eigen gegevens</h4><p>${m.preserve.map(p=>`<code>${esc(p)}</code>`).join(' · ')}</p>`:''}${addons[s.id]?`<h4>Aanvullend</h4>${sectionList(addons[s.id])}`:''}<h4>Na afloop controleren</h4>${sectionList(m.verify)}${m.warnings?.length?`<div class="setup-warning">${m.warnings.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}</div></details>`;
      }).join('')}</div></div>
      <div class="guide-step"><span class="step-number">${itemData.picked.length?5:4}</span><div><h3>Afronden en controleren</h3><p>Herstart de server na wijzigingen aan de startvolgorde, inventory-items, SQL of streamingbestanden. Test iedere geselecteerde resource afzonderlijk en controleer de serverconsole. Gebruik geen wachtwoorden, API-sleutels of webhook-URL's in publieke GitHubbestanden.</p>${hasBot?'<p>De Discord-bot draait op een afzonderlijke Node.js 24-hosting. Hij heeft geen server.cfg-regels; volg de botsectie hierboven.</p>':''}</div></div>
      `}</section>`;
    root.querySelectorAll('input[type="checkbox"][value]').forEach(input=>input.addEventListener('change',()=>{
      if (input.checked) state.selected.add(input.value);else state.selected.delete(input.value);
      render();
    }));
    root.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;render()}));
    root.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.select==='all') ids.filter(s=>manual(s.id)?.type!=='tool').forEach(s=>state.selected.add(s.id));else state.selected.clear();render()}));
    root.querySelectorAll('.copy-install').forEach(b=>b.addEventListener('click',async()=>{
      const original=b.textContent;
      try { await navigator.clipboard.writeText(b.getAttribute('data-copy'));b.textContent='Gekopieerd!'; }
      catch { b.textContent='Kopiëren mislukt'; }
      window.setTimeout(()=>b.textContent=original,1500);
    }));
  }
  fetch(root.dataset.url,{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()}).then(json=>{
    if(!json.catalog||!json.manuals||!json.items)throw Error('Onvolledige installatiegegevens');
    data=json;
    const params = new URLSearchParams(location.search);
    const chosen=params.get('script');
    if(chosen && json.manuals[chosen])state.selected.add(chosen);
    if(params.get('mode')==='update')state.mode='update';
    render();
  }).catch(e=>{root.textContent='De installatiegegevens konden niet worden geladen. Vernieuw de pagina of probeer het later opnieuw. ('+e.message+')';});
})();
