// src/pages/llms.txt.ts
// /llms.txt: a short plain-text summary of the site for AI assistants and
// answer engines (llmstxt.org convention). Built with the same data as the page.

import { getSondaView } from '../lib/sonda-build.js';
import { yearsSince } from '../lib/sonda.js';
import {
  VOTE, IDENTITY, SFDP, RUNNING_SINCE, CURRENT_LOCATION, CONTACTS, SONDA_LINKS, DASHBOARDS,
} from '../data/solya.js';

export async function GET() {
  const s = await getSondaView();
  const since = s.cc === CURRENT_LOCATION.countryCode ? `, since ${CURRENT_LOCATION.from}` : '';
  const years = yearsSince(RUNNING_SINCE.year, RUNNING_SINCE.month);

  const lines = [
    '# Solya Validator',
    '',
    `> Independent Solana validator since 2021 (${years}+ years) with 0% commission on inflation rewards and MEV, hosted in ${s.place}. Builder of SONDA, an open-source observatory for Solana validators.`,
    '',
    '## Key facts',
    '',
    `- Vote account: ${VOTE}`,
    `- Identity: ${IDENTITY}`,
    '- Commission: 0% on inflation rewards, 0% on MEV (Jito tips)',
    `- Location: ${s.place} (${[s.provider, s.asn].filter(Boolean).join(', ')})${since}; chosen with SONDA for low stake concentration and nearby Jito BAM and DoubleZero nodes`,
    `- Solana Foundation Delegation Program: ${SFDP.status.toLowerCase()} since ${SFDP.since}`,
    `- DoubleZero: connected${s.dz?.device ? ` (${s.dz.device})` : ''}${s.dz?.multicast ? ', multicast publisher' : ''}`,
    '- Client: Jito BAM',
    '- Alpenglow community cluster: genesis validator (second wave, May 2026)',
    '- Governance: votes in every Solana governance vote (SIMD and SGP)',
    '- Operated from Ukraine by one operator',
    '',
    '## Pages',
    '',
    '- [Home](https://solya.studio/): why stake with Solya, SONDA, ecosystem, timeline, how to stake',
    '- [Security](https://solya.studio/security/): infrastructure, key management, cluster isolation, safe staking',
    '',
    '## Live data',
    '',
    `- [Solya on SONDA](${SONDA_LINKS.validator}): location, infrastructure and performance`,
    ...DASHBOARDS.filter((d) => d.label !== 'SONDA').map((d) => `- [${d.label}](${d.url}): ${d.desc.toLowerCase()}`),
    '',
    '## SONDA',
    '',
    `- [sonda.network](${SONDA_LINKS.site}): public dashboard across mainnet-beta, testnet, devnet and the Alpenglow community cluster`,
    `- [Backend code](${SONDA_LINKS.repoBackend}) and [dashboard code](${SONDA_LINKS.repoFrontend}) on GitHub`,
    '',
    '## Contacts',
    '',
    `- X: [${CONTACTS.x.handle}](${CONTACTS.x.url})`,
    `- Telegram: [${CONTACTS.telegram.handle}](${CONTACTS.telegram.url})`,
    `- GitHub: [${CONTACTS.github.handle}](${CONTACTS.github.url})`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
