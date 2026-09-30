// Refresh src/data/sonda-fallback.json from SONDA's live data.
// Usage: npm run sonda:snapshot
// Optional: node scripts/sonda-snapshot.mjs <validators.json> <network_summary.json>
// to build the snapshot from local files instead of the network.

import { readFile, writeFile } from 'node:fs/promises';
import { VALIDATORS_URL, SUMMARY_URL, fetchJson, buildView } from '../src/lib/sonda.js';
import { VOTE } from '../src/data/solya.js';

const [validatorsPath, summaryPath] = process.argv.slice(2);
const readLocal = async (p) => JSON.parse(await readFile(p, 'utf8'));

const validators = validatorsPath ? await readLocal(validatorsPath) : await fetchJson(VALIDATORS_URL);
const summary = summaryPath ? await readLocal(summaryPath) : await fetchJson(SUMMARY_URL);

const view = buildView(validators, VOTE, summary);
if (!view) {
  console.error('Solya not found in validators.json, snapshot not written');
  process.exit(1);
}
const out = new URL('../src/data/sonda-fallback.json', import.meta.url);
await writeFile(out, JSON.stringify(view, null, 2) + '\n');
console.log(`Snapshot written: epoch ${view.epoch}, ${view.place}, ${view.provider}, ${view.timestamp}`);
