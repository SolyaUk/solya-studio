// Build-time loader for Solya's SONDA view. Fetches live data once per build
// and falls back to the committed snapshot, so a SONDA outage never breaks
// a deploy. The fallback file is refreshed with `npm run sonda:snapshot`.

import fallback from '../data/sonda-fallback.json';
import { VALIDATORS_URL, SUMMARY_URL, fetchJson, buildView } from './sonda.js';
import { VOTE } from '../data/solya.js';

let cached = null;

export function getSondaView() {
  if (!cached) cached = load();
  return cached;
}

async function load() {
  try {
    const [validators, summary] = await Promise.all([
      fetchJson(VALIDATORS_URL),
      fetchJson(SUMMARY_URL).catch(() => null),
    ]);
    const view = buildView(validators, VOTE, summary);
    if (!view) throw new Error('Solya not found in validators.json');
    // Values that only the summary provides survive a missing summary.
    if (!summary) {
      view.countryStakePct = view.cc === fallback.cc ? fallback.countryStakePct : null;
      view.providerValidators = view.provider === fallback.provider ? fallback.providerValidators : null;
      view.logoUrl = view.provider === fallback.provider ? fallback.logoUrl : view.logoUrl;
      view.epochHours = fallback.epochHours ?? null;
    }
    console.log(`[sonda] live data: epoch ${view.epoch}, ${view.place}, ${view.provider}`);
    return { ...view, source: 'live' };
  } catch (err) {
    console.warn(`[sonda] live data unavailable (${err.message}); using src/data/sonda-fallback.json`);
    return { ...fallback, source: 'fallback' };
  }
}
