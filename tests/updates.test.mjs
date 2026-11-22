import test from 'node:test';
import assert from 'node:assert/strict';
import {getNewUpdates,latestVersion,validateData,compareVersions} from '../scripts/core.mjs';
import {createPayload,sendWebhook,githubSnapshot} from '../scripts/notify_discord.mjs';
const script={id:'ts_test',name:'Test',icon:'🧪',category:'Gameplay',initialVersion:'1.1.0',description:'Testscript'};
const release=(version,status='published')=>({script:'ts_test',version,date:'2026-11-22',status,highlights:['Echte wijziging'],changes:[],files:[],instructions:[]});
test('Een manifestversie op zichzelf veroorzaakt geen melding',()=>assert.deepEqual(getNewUpdates([script],[],[{...script,initialVersion:'1.1.1'}],[]),[]));
test('Een historische changelog toevoegen zonder nieuwe versie veroorzaakt geen melding',()=>assert.deepEqual(getNewUpdates([script],[],[script],[release('1.0.9')]),[]));
test('Nieuwe gepubliceerde versie veroorzaakt één melding',()=>assert.deepEqual(getNewUpdates([script],[],[script],[release('1.1.1')]).map(r=>r.version),['1.1.1']));
test('Nieuwe conceptversie veroorzaakt geen melding',()=>assert.deepEqual(getNewUpdates([script],[],[script],[release('1.1.1','draft')]),[]));
test('Publicatie vanuit concept veroorzaakt één melding',()=>assert.equal(getNewUpdates([script],[release('1.1.1','draft')],[script],[release('1.1.1')]).length,1));
test('Redactionele correctie veroorzaakt geen nieuwe melding',()=>assert.deepEqual(getNewUpdates([script],[release('1.1.1')],[script],[{...release('1.1.1'),highlights:['tekstcorrectie']}]),[]));
test('Manifest komt vóór oudere changelog in overzicht',()=>assert.equal(latestVersion(script,[release('1.0.9')]),'1.1.0'));
test('Semver vergelijken',()=>{assert.equal(compareVersions('1.2.0','1.1.10'),1);assert.equal(compareVersions('1.2.0','1.2.0-beta'),1)});
test('Een ongeldige release met lege changelog wordt geweigerd',()=>assert.throws(()=>validateData([script],[{...release('1.1.1'),highlights:[]}])));
test('Eerste publicatie met zero hash heeft geen voorganger',()=>assert.equal(githubSnapshot('0'.repeat(40),'data/catalog.json'),null));
test('Discord payload bevat toegestane URLs maar geen role pings',()=>{const p=createPayload(script,release('1.1.1'),[script],[release('1.1.1')],'https://troyscripts.github.io/troyscripts-changelog/');assert.equal(p.allowed_mentions.parse.length,0);assert.match(p.embeds[0].url,/scripts\/ts_test\/\#v1\.1\.1/);assert.equal(p.embeds[1].fields.length,1)});
test('Discord HTTP error wordt doorgegeven',async()=>assert.rejects(()=>sendWebhook('https://discord.com/api/webhooks/123/token',{},{fetcher:async()=>({status:400,text:async()=>'{"message":"bad"}'})}),/HTTP 400/));

test('Historische botchangelogs in een nieuwe categorie sturen geen aankondiging',()=>{
  const bot={...script,id:'tgc_bot',name:'Troy Game Community Bot',category:'Discord-bot',initialVersion:'3.8.4'};
  const history=[{...release('3.8.4'),script:'tgc_bot',date:null}];
  assert.deepEqual(getNewUpdates([script],[],[script,bot],history),[]);
  assert.doesNotThrow(()=>validateData([script,bot],history));
});
test('Nieuwe botversie na de eerste import geeft een update',()=>{
  const bot={...script,id:'tgc_bot',name:'Troy Game Community Bot',category:'Discord-bot',initialVersion:'3.8.4'};
  assert.deepEqual(getNewUpdates([bot],[],[bot],[{...release('3.8.5'),script:'tgc_bot'}]).map(x=>x.version),['3.8.5']);
});
