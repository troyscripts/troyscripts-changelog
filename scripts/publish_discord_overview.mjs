#!/usr/bin/env node
/** Publiceer het actuele TroyScripts-overzicht in Discord met de bestaande repository-webhook. */
import { readFileSync } from 'node:fs';
import { GROUP_ORDER, absolute, cleanText, latestVersion, siteConfig, validateData } from './core.mjs';
import { sendWebhook } from './notify_discord.mjs';

export function createOverviewPayload(catalog, releases, site) {
  validateData(catalog, releases);
  const fields = GROUP_ORDER.map(category => {
    const scripts = catalog.filter(s => s.category === category);
    if (!scripts.length) return null;
    const value = scripts.map(s => {
      const url = absolute(site, `scripts/${s.id}/`);
      const title = s.category === 'Discord-bot' ? s.name : s.id;
      return `${s.icon} **[${cleanText(title)} · v${latestVersion(s,releases)}](${url}#changelog)** · [Installatie](${url}#installation)`;
    }).join('\n');
    if (value.length > 1024) throw new Error(`Discord-categorie te lang: ${category}`);
    return { name: category, value, inline: false };
  }).filter(Boolean);
  if (!fields.length) throw new Error('Geen projecten beschikbaar voor het Discord-overzicht.');
  return {
    username: 'TroyScripts Updates',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: '📚 TroyScripts — Changelogs & installatie',
      url: site,
      color: 0x38cbd9,
      description: `**Alle TroyScripts-updates op één plek!**\n\nHieronder staan de actuele versies, changelogs en installatiehandleidingen van onze FiveM-scripts én Discord-bot.\n\n🌐 [Bezoek de website](${site}) · 🛠️ [Maak je installatieplan](${absolute(site,'installatie/')})`,
      fields,
      footer: { text: 'TroyScripts · Scriptbibliotheek · Geregistreerde versies; inhoudelijke changelogs kunnen ouder zijn' }
    }]
  };
}

export async function main(args=process.argv.slice(2), env=process.env) {
  const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));
  const releases=JSON.parse(readFileSync(new URL('../data/releases.json',import.meta.url),'utf8'));
  const payload=createOverviewPayload(catalog,releases,siteConfig(env));
  if(args.includes('--dry-run')) {
    console.log(JSON.stringify(payload,null,2));
    return;
  }
  if(!env.DISCORD_UPDATES_WEBHOOK) {
    throw new Error('GitHub Actions-secret DISCORD_UPDATES_WEBHOOK ontbreekt. Geen bericht verzonden.');
  }
  await sendWebhook(env.DISCORD_UPDATES_WEBHOOK, payload);
  console.log(`Discord-overzicht succesvol gepubliceerd met ${catalog.length} projecten.`);
}
if(process.argv[1] && new URL(`file://${process.argv[1]}`).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode=1; });
}
