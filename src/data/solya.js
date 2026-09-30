// Hand-written facts about the Solya validator.
//
// Everything in this file is edited by hand on purpose. It is either history
// (dates, reasons behind a move) or a status we never want to change on its own
// (SFDP). Live values (location, provider, DoubleZero, Jito BAM, performance)
// come from SONDA, see src/lib/sonda.js.

export const VOTE = 'HwcVgFSgmfeeF7zGFUBLoVA8Hpx8rtwyfCrJ1npBaSVC';
export const IDENTITY = 'HwN6eoEe9N3kwHi66hpQDBMFPk6ASQGthWKPX5MZmisp';

// Non-mainnet presences: display only, never with copy buttons.
export const ALPENGLOW = {
  identity: '2CY5tXmmEAQ5bwBdv4Yt74T4Gjfz92h1vbETrBdBWNj6',
  vote: '2qdeoX3GL1Gpvf8g5XAF2TmSsbaCmzTv3TGmimnZcHQW',
};
export const TESTNET = {
  identity: 'EYbvBPU9mSPTVJrZgioTt8PGPL9Bjv5342ENBMR5X8r8',
  vote: '6QuNUWCjuvZYpu9hJX8Jrhyt9dszZERVsFPTTEAa3MVz',
};

// SFDP is hardcoded on purpose (decision 2026-09-29): never wire it to live data.
export const SFDP = { status: 'Approved', since: 'September 2021' };

// Start of the "years running" count: the month Solya joined SFDP.
export const RUNNING_SINCE = { year: 2021, month: 9 };

// Location story. The last entry is the current home. Its texts are used only
// while SONDA reports the same country code; if SONDA sees another country
// (a move before this file was updated), the site falls back to neutral copy
// built from live data, so the page never contradicts SONDA.
export const LOCATIONS = [
  {
    place: 'São Paulo, Brazil',
    countryCode: 'BR',
    from: 'June 2025',
    to: 'May 2026',
    why: 'A deliberate move to South America, where Solana had few validators.',
  },
  {
    place: 'Singapore',
    countryCode: 'SG',
    from: 'May 2026',
    to: 'September 2026',
    why: "Jito's BAM rollout did not reach São Paulo in time, so Solya moved next to BAM nodes in Singapore.",
  },
  {
    place: 'Hong Kong',
    countryCode: 'HK',
    from: 'September 2026',
    to: null,
    why: 'Chosen with SONDA: little stake concentration, Jito BAM and DoubleZero nodes in the city, and an established provider whose validators perform well.',
  },
];

export const CURRENT_LOCATION = LOCATIONS[LOCATIONS.length - 1];

// Contacts. The email is stored base64-encoded and assembled in the browser,
// so it never appears as plain text in the page source.
export const CONTACTS = {
  x: { label: 'X', handle: '@SolyaOS', url: 'https://x.com/SolyaOS' },
  telegram: { label: 'Telegram', handle: '@solya_os', url: 'https://t.me/solya_os' },
  emailB64: 'c29seWEudWtAZ21haWwuY29t',
  github: { label: 'GitHub', handle: 'SolyaUk', url: 'https://github.com/SolyaUk' },
};

export const SONDA_LINKS = {
  site: 'https://sonda.network',
  validator: `https://sonda.network/validator?id=${VOTE}&cluster=mainnet-beta`,
  validators: 'https://sonda.network/validators?cluster=mainnet-beta',
  datacenters: 'https://sonda.network/datacenters?cluster=mainnet-beta',
  alpenglow: 'https://sonda.network/?cluster=alpenglow-community',
  x: 'https://x.com/SondaNetwork',
  telegram: 'https://t.me/sonda_network_events',
  repoBackend: 'https://github.com/SolyaUk/sonda',
  repoFrontend: 'https://github.com/SolyaUk/sonda-network',
};

// Badges shown in the "Solya on SONDA" card, in this order.
// Available: 'tvc', 'credits', 'skip', 'votes', 'slot', 'ibrl', 'age'.
// TVC and IBRL stay off (decision 2026-09-29); 'age' stays off because the
// JIP-25 count starts from the current vote account, not from 2021.
export const SONDA_CARD_METRICS = ['skip', 'votes', 'slot'];

// Icons are site favicons saved into public/favicons/ (self-hosted, no
// third-party requests at runtime). A missing file falls back to a letter.
export const DASHBOARDS = [
  { label: 'StakeWiz', url: `https://stakewiz.com/validator/${VOTE}`, desc: 'Performance and uptime', icon: '/favicons/stakewiz.png' },
  { label: 'Validators.app', url: `https://www.validators.app/validators/${IDENTITY}?locale=en&network=mainnet`, desc: 'Details and security report', icon: '/favicons/validators-app.png' },
  { label: 'JPool', url: `https://app.jpool.one/validators/${VOTE}?activeTab=performance`, desc: 'Performance and history', icon: '/favicons/jpool.png' },
  { label: 'DoubleZero', url: `https://doublezero.xyz/dzdp/eligible-validators/${IDENTITY}/delegation-criteria`, desc: 'Delegation criteria', icon: '/favicons/doublezero.png' },
  { label: 'IBRL', url: `https://ibrl.wtf/validator/${IDENTITY}/`, desc: 'Block building quality', icon: '/favicons/ibrl.png' },
  { label: 'SONDA', url: SONDA_LINKS.validator, desc: 'Location, infrastructure, performance', icon: '/sonda-mark.png' },
];

export const WALLET_ICONS = {
  phantom: '/favicons/phantom.png',
  solflare: '/favicons/solflare.png',
  blazestake: '/favicons/blazestake.png',
  jpool: '/favicons/jpool.png',
};

// Timeline, oldest first. `show: false` keeps a draft entry out of the page
// until its wording is confirmed.
export const TIMELINE = [
  { year: 2021, month: 'Sep', title: 'Joined the Solana Foundation Delegation Program', text: 'Solya Validator started on Solana in 2021 and has been part of SFDP since September of that year.', kind: 'validator' },
  { year: 2022, month: '', title: 'Kept running through the war and the bear market', text: 'The validator stayed online through the start of the full-scale war in Ukraine and the long bear market that followed.', kind: 'validator' },
  { year: 2023, month: '', title: 'First scripts to find a better location', text: 'Command-line scripts to compare datacenters and find a place where the validator performs well enough for performance-based stake pools such as Jito. SONDA grew out of them.', kind: 'sonda' },
  { year: 2024, month: 'Jul', title: 'Commission set to 0%', text: 'Stakers receive all inflation rewards.', kind: 'validator' },
  { year: 2025, month: 'Jun', title: 'Moved to São Paulo', text: 'The first deliberate move away from the US and Europe, to a region with few Solana validators.', kind: 'validator' },
  { year: 2025, month: 'Sep', title: 'Voted on Alpenglow (SIMD-0326)', text: 'Solya Validator voted on the proposal to move Solana to the Alpenglow consensus, which validators approved.', kind: 'ecosystem' },
  { year: 2025, month: 'Oct', title: 'MEV commission set to 0%', text: 'Jito tips go to stakers in full.', kind: 'validator' },
  { year: 2026, month: 'Mar', title: 'solya.studio launched', text: 'The validator gets its own website, open source like everything else.', kind: 'validator' },
  { year: 2026, month: 'May', title: 'SONDA goes public', text: 'The public dashboard at sonda.network launches during the Colosseum Frontier hackathon.', kind: 'sonda' },
  { year: 2026, month: 'May', title: 'Genesis validator on the Alpenglow community cluster', text: 'Joined in the second wave, on May 15, to test the new consensus in real conditions.', kind: 'ecosystem' },
  { year: 2026, month: 'May', title: 'Moved to Singapore, next to Jito BAM', text: "Jito's BAM rollout did not reach São Paulo in time, so Solya moved next to BAM nodes in Singapore.", kind: 'validator' },
  { year: 2026, month: 'Summer', title: 'First SGP governance votes', text: 'Solya Validator voted in the first Solana Governance Proposals, including SGP-0001, which ratified the Solana Constitution.', kind: 'ecosystem' },
  { year: 2026, month: 'Aug', title: 'Solana Startup Terminal 2.0', text: 'SONDA joins the Superteam Ukraine program: lessons, mentors and new people in the community.', kind: 'sonda' },
  { year: 2026, month: 'Sep', title: "Colosseum's Crypto World's Fair", text: 'SONDA enters its second Colosseum hackathon.', kind: 'sonda' },
  { year: 2026, month: 'Sep', title: 'Moved to Hong Kong, chosen with SONDA', text: 'Low stake concentration, Jito BAM and DoubleZero nodes in the city, and an established provider.', kind: 'validator', now: true },
];
