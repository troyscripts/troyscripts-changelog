export const GROUP_ORDER = ['Basis scripts', 'Voertuigen', 'Hulpdiensten & toegang', 'Gameplay', 'Overige scripts'];
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:[-.]([A-Za-z0-9.-]+))?$/;
export function versionParts(version) {
  const m = SEMVER.exec(String(version));
  if (!m) throw Error(`Ongeldig versienummer: ${version}`);
  return [Number(m[1]),Number(m[2]),Number(m[3]),m[4] || ''];
}
export function compareVersions(a,b) {
  const A=versionParts(a), B=versionParts(b);
  for (let i=0;i<3;i++) {if(A[i]!==B[i]) return A[i]>B[i]?1:-1;}
  if(A[3]===B[3]) return 0;
  if(!A[3]) return 1;
  if(!B[3]) return -1;
  return A[3].localeCompare(B[3],undefined,{numeric:true});
}
export function publishedReleases(releases) {return releases.filter(r=>r.status==='published');}
export function releasesFor(scriptId,releases) {return publishedReleases(releases).filter(r=>r.script===scriptId).sort((a,b)=>compareVersions(b.version,a.version));}
export function latestVersion(script,releases) {return releasesFor(script.id,releases).reduce((latest,entry)=>compareVersions(entry.version,latest)>0?entry.version:latest,script.initialVersion);}
export function releaseId(r){return `${r.script}@${r.version}`;}
export function getNewUpdates(oldCatalog,oldReleases,newCatalog,newReleases){
  const oldById=new Map(oldCatalog.map(s=>[s.id,s]));
  const oldPublished=new Set(publishedReleases(oldReleases).map(releaseId));
  return publishedReleases(newReleases).filter(r=>{
    if (oldPublished.has(releaseId(r))) return false;
    const old=oldById.get(r.script);
    if (!old) return false; // Nieuw catalogusscript kondigen we pas bij een latere versie aan.
    return compareVersions(r.version,latestVersion(old,oldReleases))>0;
  }).sort((a,b)=>a.script.localeCompare(b.script));
}
export function validateData(catalog,releases){
  const errors=[];const names=new Set();
  if(!Array.isArray(catalog)||!Array.isArray(releases)) throw Error('Catalogus en releases moeten arrays zijn.');
  for(const [i,s] of catalog.entries()) {
    const where=`catalog[${i}]`;
    if(!/^[a-z][a-z0-9_]+$/.test(s.id||'')) errors.push(`${where}.id ongeldig`);
    if(names.has(s.id)) errors.push(`Dubbel script-id: ${s.id}`); names.add(s.id);
    if(!s.name||!s.description||!s.icon) errors.push(`${where} mist naam, omschrijving of icoon`);
    if(!GROUP_ORDER.includes(s.category)) errors.push(`${where} onbekende categorie`);
    try{versionParts(s.initialVersion)}catch(e){errors.push(`${where}: ${e.message}`)}
  }
  const ids=new Set();
  for(const [i,r] of releases.entries()){
    const where=`releases[${i}]`;
    if(!names.has(r.script)) errors.push(`${where} onbekend script: ${r.script}`);
    try{versionParts(r.version)}catch(e){errors.push(`${where}: ${e.message}`)}
    const id=releaseId(r);if(ids.has(id))errors.push(`Dubbele release ${id}`);ids.add(id);
    if(!['published','draft'].includes(r.status))errors.push(`${where}.status moet published of draft zijn`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date||'')||Number.isNaN(Date.parse(`${r.date}T00:00:00Z`)))errors.push(`${where} ongeldige datum`);
    for(const field of ['highlights','changes','files','instructions'])if(!Array.isArray(r[field])||r[field].some(v=>typeof v!=='string')) errors.push(`${where}.${field} moet een lijst met teksten zijn`);
    if(r.sourceNote!==undefined && typeof r.sourceNote!=='string')errors.push(`${where}.sourceNote moet tekst zijn`);
    if(r.status==='published' && (!r.highlights?.length&&!r.changes?.length))errors.push(`${where} gepubliceerd zonder wijzigingen`);
  }
  if(errors.length) throw Error(errors.join('\n'));
}
export function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function cleanText(v){return String(v??'').replace(/@/g,'＠').replace(/[`*_~|<>]/g,'').trim();}
export function siteConfig(env=process.env){
  const repo=env.GITHUB_REPOSITORY||'troyscripts/troyscripts-changelog';
  const [owner,name]=repo.split('/');
  if(!owner||!name)throw Error('GITHUB_REPOSITORY moet owner/repo zijn.');
  let base=env.SITE_URL||`https://${owner.toLowerCase()}.github.io/${name===''+owner.toLowerCase()+'.github.io'?'':name+'/'} `;
  base=base.trim();
  const u=new URL(base);
  if(!['http:','https:'].includes(u.protocol))throw Error('SITE_URL moet een geldige http(s)-URL zijn.');
  u.hash='';u.search=''; if(!u.pathname.endsWith('/'))u.pathname+='/';
  return u.href;
}
export function absolute(siteUrl,path=''){return new URL(path,siteUrl).href;}
