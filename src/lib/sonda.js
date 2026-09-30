// Shared helpers for reading Solya's record from SONDA's public data.
// Runs in two places: Astro frontmatter at build time (Node) and the browser
// (live refresh of the "Solya on SONDA" card). Keep it free of Node or DOM APIs.

export const SONDA_DATA = 'https://data.sonda.network';
export const CLUSTER = 'mainnet-beta';
export const VALIDATORS_URL = `${SONDA_DATA}/current/${CLUSTER}/validators.json`;
export const SUMMARY_URL = `${SONDA_DATA}/current/${CLUSTER}/network_summary.json`;

const VALIDATOR_ROLES = new Set(['validator', 'validator-hidden', 'validator-inactive']);

// Places where the country name reads better than the city (city states).
const CITY_STATES = new Set(['SG', 'HK', 'MO', 'MC', 'VA', 'GI']);

const REGIONS = {
  AS: 'Asia-Pacific',
  OC: 'Asia-Pacific',
  EU: 'Europe',
  NA: 'North America',
  SA: 'South America',
  AF: 'Africa',
};

export async function fetchJson(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Same slug rule as sonda.network (src/lib/providers.js). */
export function providerSlug(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function quantile(sorted, p) {
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
}

/**
 * Build a flat view of Solya's record for the site.
 * @param {object} validators  validators.json ({ meta, records })
 * @param {string} vote        vote account to look up
 * @param {object|null} summary network_summary.json (optional, build time only)
 */
export function buildView(validators, vote, summary = null) {
  const records = (validators && validators.records) || [];
  const r = records.find((x) => x.vote_account === vote);
  if (!r) return null;

  const g = r.geolocation || {};
  const cc = String(g.country_code || '').toUpperCase();
  const place = CITY_STATES.has(cc) ? (g.country || cc) : (g.city || g.country || cc);
  // Label for the card: "Hong Kong" for city states, "Frankfurt, Germany" elsewhere.
  const placeLabel = CITY_STATES.has(cc) || !g.city ? place : `${g.city}, ${g.country || cc}`;

  // Universe for ranks and tiers: every vote account with stake (same as sonda.network).
  const universe = records.filter((x) => VALIDATOR_ROLES.has(x.role));

  let tvcRank = null;
  if (r.epoch_credits != null) {
    const withCredits = universe.filter((x) => x.epoch_credits != null);
    tvcRank = {
      rank: 1 + withCredits.filter((x) => x.epoch_credits > r.epoch_credits).length,
      total: withCredits.length,
    };
  }

  const stakes = universe
    .map((x) => x.activated_stake_lamports || 0)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
  const stake = r.activated_stake_lamports || 0;
  const [p25, p75, p90] = [0.25, 0.75, 0.9].map((p) => quantile(stakes, p));
  const stakeTier = stake >= p90 ? 4 : stake >= p75 ? 3 : stake >= p25 ? 2 : 1;

  const provider = g.provider || g.asn_name || '';
  const providers = summary?.metrics?.providers || {};
  const logoPath = providers[provider]?.logo || (g.asn ? `assets/dc/${g.asn}.png` : null);
  const byCountry = summary?.metrics?.validators?.stake_by_country || {};
  const slotMs = summary?.metrics?.chain?.slot_time_ms ?? null;
  const byProvider = summary?.metrics?.validators?.provider_distribution || {};

  return {
    epoch: validators?.meta?.epoch ?? null,
    timestamp: validators?.meta?.timestamp ?? null,
    name: r.name || 'Solya',
    identity: r.identity_pubkey,
    vote: r.vote_account,
    bls: r.bls_pubkey || null,
    version: r.version || null,
    client: r.client_type || null,
    delinquent: !!r.delinquent,
    stakeSol: stake / 1e9,
    stakeTier,
    commission: r.commission,
    mevCommissionBps: r.mev_commission,
    cc,
    country: g.country || cc,
    city: g.city || '',
    place,
    placeLabel,
    region: REGIONS[g.continent_code] || '',
    confidence: g.confidence || null,
    discrepancy: g.discrepancy_details || null,
    provider,
    providerSlug: providerSlug(provider),
    asn: g.asn || null,
    logoUrl: logoPath ? `${SONDA_DATA}/${logoPath}` : null,
    countryStakePct: cc && byCountry[cc] != null ? byCountry[cc] : null,
    providerValidators: provider && byProvider[provider] != null ? byProvider[provider] : null,
    // Mainnet epochs are 432,000 slots; their length in hours follows the slot time.
    epochHours: slotMs ? Math.round((432000 * slotMs) / 3.6e6) : null,
    dz: {
      connected: !!r.dz_connected,
      device: r.dz_device_name || null,
      metro: r.dz_metro_code || null,
      location: r.dz_location || null,
      multicast: !!r.dz_multicast_publisher,
    },
    bam: { node: r.bam_node || null, region: r.bam_region || null },
    perf: {
      skip: r.skip_rate,
      votes: r.vote_credits_ratio_prev,
      slot: r.slot_duration_median,
      credits: r.epoch_credits,
      ibrl: r.ibrl?.ibrl_score ?? null,
      tvc: tvcRank,
    },
    age: {
      epochs: r.age_epochs ?? null,
      firstEpoch: r.first_seen_epoch ?? null,
      asOf: r.age_as_of_epoch ?? null,
    },
  };
}

// ---------- formatting ----------

export function fmtCompact(n) {
  if (n == null || Number.isNaN(n)) return '';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(Math.round(n));
}

export function fmtPct(v, digits = 2) {
  if (v == null || Number.isNaN(v)) return '';
  return `${Number(v).toFixed(digits)}%`;
}

export function timeAgo(iso, now = Date.now()) {
  const t = Date.parse(iso || '');
  if (Number.isNaN(t)) return '';
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return `${s} s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

export function fmtDate(iso) {
  const t = Date.parse(iso || '');
  if (Number.isNaN(t)) return '';
  return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function yearsSince(year, month, now = new Date()) {
  const months = (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 12));
}
