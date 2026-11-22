import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createOverviewPayload } from '../scripts/publish_discord_overview.mjs';
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));
const releases=JSON.parse(readFileSync(new URL('../data/releases.json',import.meta.url),'utf8'));
const site='https://troyscripts.github.io/troyscripts-changelog/';
test('Alle scripts en de bot zijn klikbaar in de Discord-index',()=>{
 const payload=createOverviewPayload(catalog,releases,site);
 const embed=payload.embeds[0];
 assert.equal(payload.allowed_mentions.parse.length,0);
 assert.equal(embed.fields.length,6);
 assert.ok(embed.fields.some(f=>f.name==='Discord-bot'));
 for(const s of catalog) assert.ok(embed.fields.some(f=>f.value.includes(`scripts/${s.id}/`)),s.id);
 assert.ok(embed.description.includes('/installatie/'));
 assert.ok(embed.fields.every(f=>f.value.length<=1024));
 assert.ok(embed.fields.every(f=>f.value.includes('#installation') || !f.value));
});
test('Geen dubbele pagina- of embedlimieten overschreden',()=>{
 const p=createOverviewPayload(catalog,releases,site).embeds[0];
 const sum=(p.title+p.description+p.footer.text).length+p.fields.reduce((n,f)=>n+f.name.length+f.value.length,0);
 assert.ok(sum<6000,`Discord embed is ${sum} tekens`);
 assert.ok(p.fields.length<=25);
});
