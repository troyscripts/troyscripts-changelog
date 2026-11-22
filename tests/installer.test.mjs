import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url)));
const manuals=JSON.parse(readFileSync(new URL('../data/manuals.json',import.meta.url)));
const items=JSON.parse(readFileSync(new URL('../data/items.json',import.meta.url)));
test('Alle TroyScripts-projecten hebben een installatie- en updatehandleiding',()=>{
 for(const script of catalog){assert.ok(manuals[script.id],script.id);assert.ok(manuals[script.id].install.length);assert.ok(manuals[script.id].update.length);assert.ok(manuals[script.id].verify.length);}
});
test('ts_bridge is afhankelijkheid bij bridge-scripts',()=>{
 for(const id of ['ts_nlplates','ts_flatbed','ts_keycard','ts_repairpoints','ts_hostage','ts_antipunch','ts_nohelmet','ts_parkeerapp'])assert.ok(manuals[id].needs.includes('ts_bridge'));
});
test('Discord-bot is geen FiveM-resource',()=>assert.equal(manuals.tgc_bot.type,'bot'));
test('Keycarditems en kentekenbewijs uit bronmateriaal aanwezig',()=>{
 assert.equal(items.ts_keycard.items.length,14);
 assert.ok(items.ts_keycard.code.includes('politie_sleutelkaart'));
 assert.ok(items.ts_nlplates.code.includes('kentekenbewijs'));
});
