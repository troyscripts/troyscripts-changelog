#!/usr/bin/env node
/** GitHub Pages -> Discord. Alleen nieuw gepubliceerde versies, niet manifest-only aanpassingen. */
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {GROUP_ORDER,getNewUpdates,latestVersion,validateData,absolute,siteConfig,cleanText} from './core.mjs';

export function githubSnapshot(revision,path){
  if(!/^[0-9a-f]{40,64}$/i.test(revision)||/^0+$/.test(revision)) return null;
  const result=spawnSync('git',['show',`${revision}:${path}`],{encoding:'utf8',maxBuffer:4*1024*1024});
  if(result.status!==0) return null;
  try{return JSON.parse(result.stdout)}catch{return null}
}

export function createPayload(script,release,catalog,releases,site){
  const changelog=absolute(site,`scripts/${script.id}/#v${release.version}`);
  const bullets=release.highlights.slice(0,4).map(x=>`• ${cleanText(x)}`).join('\n');
  const fields=GROUP_ORDER.map(category=>{
    const items=catalog.filter(s=>s.category===category);
    if(!items.length) return null;
    return {name:category,value:items.map(s=>`${s.icon} **${cleanText(s.id)} · ${latestVersion(s,releases)}** — [Changelog](${absolute(site,`scripts/${s.id}/`)})`).join('\n').slice(0,1024),inline:false};
  }).filter(Boolean);
  return {
    username:'TroyScripts Updates',
    allowed_mentions:{parse:[]},
    embeds:[
      {title:`${script.icon} Nieuwe update: ${script.id} v${release.version}`,description:`${bullets}\n\n📖 [Bekijk de volledige changelog en update-instructies](${changelog})`.slice(0,4096),url:changelog,color:0x38cbd9,timestamp:`${release.date}T12:00:00Z`,footer:{text:'TroyScripts · Nieuw gepubliceerde release'}},
      {title:'TroyScripts Updates',description:'Actuele versies en changelogs van alle TroyScripts-resources.',color:0x7667e8,fields,footer:{text:'TroyScripts · Compleet updateoverzicht'}}
    ]
  };
}

export async function sendWebhook(url,payload,{fetcher=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms))}={}){
  if(!/^https:\/\/(?:discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+(?:\?.*)?$/.test(url))throw new Error('Ongeldige Discord-webhook-URL');
  for(let attempt=0;attempt<4;attempt++){
    const res=await fetcher(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    if(res.status>=200&&res.status<300)return;
    const error=await res.text().catch(()=>`HTTP ${res.status}`);
    if(res.status===429&&attempt<3){let wait=1300;try{const j=JSON.parse(error);wait=Math.max(500,Math.min(30000,Number(j.retry_after)*1000||wait))}catch{}await sleep(wait);continue;}
    throw new Error(`Discord-melding mislukt (HTTP ${res.status}): ${error.slice(0,240)}`);
  }
}

export async function main(args=process.argv.slice(2), env=process.env){
  const beforeFlag=args.indexOf('--before');
  const before=beforeFlag>=0?args[beforeFlag+1]:'';
  const dryRun=args.includes('--dry-run');
  const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));
  const releases=JSON.parse(readFileSync(new URL('../data/releases.json',import.meta.url),'utf8'));
  validateData(catalog,releases);
  const previousCatalog=githubSnapshot(before,'data/catalog.json');
  const previousReleases=githubSnapshot(before,'data/releases.json');
  if(!previousCatalog||!previousReleases){console.log('Eerste installatie of geen voorganger: geen Discord-berichten.');return 0;}
  const updates=getNewUpdates(previousCatalog,previousReleases,catalog,releases);
  if(!updates.length){console.log('Geen nieuwe inhoudelijke releases: geen Discord-bericht.');return 0;}
  const site=siteConfig(env);
  const webhook=env.DISCORD_UPDATES_WEBHOOK;
  if(!webhook&&!dryRun){console.log('DISCORD_UPDATES_WEBHOOK is nog niet ingesteld: geen Discord-berichten verzonden.');return 0;}
  for(const release of updates){
    const script=catalog.find(s=>s.id===release.script);
    const payload=createPayload(script,release,catalog,releases,site);
    if(dryRun)console.log(JSON.stringify(payload,null,2));
    else {await sendWebhook(webhook,payload);console.log(`Discord gemeld: ${script.id} v${release.version}`);}
  }
  return updates.length;
}
if(process.argv[1]&&new URL(`file://${process.argv[1]}`).href===import.meta.url){main().catch(error=>{console.error(error.stack||error);process.exitCode=1;});}
