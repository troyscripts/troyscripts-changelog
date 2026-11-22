import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const catalog=read('catalog.json'), nl=read('configs.json'), en=read('configs_en.json');
test('Elk FiveM-script heeft een configuratie-uitleg in NL en EN',()=>{
  for(const s of catalog.filter(x=>x.id!=='tgc_bot')){assert.ok(nl.scripts[s.id],s.id);assert.ok(en.scripts[s.id],s.id);}
});
test('NL en EN hebben dezelfde instellingen',()=>{
  for(const [id,d] of Object.entries(nl.scripts)){
    const e=en.scripts[id];
    assert.deepEqual(d.groups.map(g=>g.options.map(o=>o.key)),e.groups.map(g=>g.options.map(o=>o.key)),id);
    assert.deepEqual(d.files.map(f=>f.path),e.files.map(f=>f.path),id);
    assert.deepEqual((d.webhooks?.routes||[]).map(r=>r.key),(e.webhooks?.routes||[]).map(r=>r.key),id);
    assert.deepEqual((d.aces?.lines||[]).map(l=>l.line),(e.aces?.lines||[]).map(l=>l.line),id);
  }
});
test('Geen echte webhook-URL in de configuratie-uitleg',()=>{
  for(const d of [nl,en])assert.doesNotMatch(JSON.stringify(d),/discord(app)?\.com\/api\/webhooks\/\d{5,}\//);
});
test('ACE-regels zijn geldige server.cfg-regels',()=>{
  for(const d of Object.values(nl.scripts))for(const l of d.aces?.lines||[])assert.match(l.line,/^add_(ace|principal) \S+ \S+( allow)?$/);
});
