import {readFileSync} from 'node:fs';
import {validateData} from './core.mjs';
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));
const releases=JSON.parse(readFileSync(new URL('../data/releases.json',import.meta.url),'utf8'));
validateData(catalog,releases);
console.log(`OK: ${catalog.length} scripts, ${releases.length} geregistreerde changelogs.`);
