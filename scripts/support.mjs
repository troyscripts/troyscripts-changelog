// Supportblok op de pagina van elk FiveM-script (niet bij de Discord-bot). Teksten staan in data/support.json.
import {readFileSync} from 'node:fs';
import {escapeHtml as h} from './core.mjs';

const support=JSON.parse(readFileSync(new URL('../data/support.json',import.meta.url),'utf8'));

export function renderSupport(script,lang,name=script.id){
  if(script.category==='Discord-bot')return '';
  const t=support[lang];
  if(!t)throw Error('Supporttekst ontbreekt voor taal '+lang);
  return `<section id="support" class="guide-section support-section"><span class="section-kicker">${h(t.kicker)}</span><h2>${h(t.title.replace('{script}',name))}</h2><p>${h(t.intro)}</p><h3>${h(t.listTitle)}</h3><ol class="setup-steps">${t.items.map(x=>`<li>${h(x)}</li>`).join('')}</ol><p class="support-privacy"><span>🔒</span>${h(t.privacy)}</p><div class="guide-action-links"><a class="primary-btn" href="${h(support.discord)}" target="_blank" rel="noopener">💬 ${h(t.button)}</a></div><p class="support-note">${h(t.note)}</p></section>`;
}
