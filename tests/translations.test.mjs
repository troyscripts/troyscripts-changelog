import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const en=JSON.parse(readFileSync(new URL('../data/en.json',import.meta.url),'utf8'));
const releaseEn=JSON.parse(readFileSync(new URL('../data/releases_en.json',import.meta.url),'utf8'));
const anti=JSON.parse(readFileSync(new URL('../data/anticheat_en.json',import.meta.url),'utf8'));
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));
const releases=JSON.parse(readFileSync(new URL('../data/releases.json',import.meta.url),'utf8'));
test('Every project has translated English descriptions and installation instructions',()=>{
  for(const s of catalog){
    assert.ok(en.catalog[s.id]?.length===2,s.id);
    const m=en.manuals[s.id];
    assert.ok(m?.requirements?.length && m.install.length && m.update.length && m.verify.length,s.id);
  }
});
test('Every archived release has an English summary and stable version number',()=>{
 for(const r of releases){assert.ok(releaseEn[r.script+'@'+r.version]?.summary,r.script+'@'+r.version);}
 assert.equal(Object.keys(releaseEn).length,releases.length);
});
test('English anti-cheat instructions preserve safe advice and identifiers',()=>{
 assert.ok(anti.steps.length>=6);
 assert.ok(anti.example.resources.includes('ts_bridge'));
 assert.ok(anti.troubleshooting.some(x=>x.code==='ts_bridge:screenshot:result'));
 assert.ok(anti.troubleshooting.some(x=>x.answer.includes('Do not disable antiIllegalTrigger')));
});
