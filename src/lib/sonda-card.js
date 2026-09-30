// HTML for the "Solya on SONDA" card. One renderer for both the build-time
// snapshot and the live refresh in the browser, so the two never drift apart.
// Visual language follows the validators table on sonda.network; the layout
// is a compact business card. Tooltips use data-tip (instant, see BaseLayout).

import { fmtCompact, fmtPct, fmtDate, timeAgo } from './sonda.js';

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function short(key, n = 6) {
  if (!key) return '';
  return key.length > n * 2 + 3 ? `${key.slice(0, n)}...${key.slice(-n)}` : key;
}

const COPY_ICON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const ARROW_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';

function keyRow(label, value, what) {
  if (!value) return '';
  return `<span class="sv-key"><span class="sv-key-l">${label}</span><span class="sv-key-v">${esc(short(value))}</span>` +
    `<button type="button" class="sv-copy" data-copy="${esc(value)}" data-copy-what="${esc(what)}" data-tip="Copy ${esc(what)}" aria-label="Copy ${esc(what)}">${COPY_ICON}</button></span>`;
}

function pinFlag(cc) {
  const code = String(cc || '').toLowerCase();
  if (!code || code === '??') return '<span class="sv-pin-none"></span>';
  const shape = 'M10 23.2 C5.2 17.4 1.5 13.4 1.5 9.5 a8.5 8.5 0 1 1 17 0 c0 3.9-3.7 7.9-8.5 13.7z';
  const img = `https://flagcdn.com/w80/${code}.png`;
  return `<svg class="sv-pin" viewBox="0 0 20 24" width="16" height="20" aria-hidden="true">` +
    `<clipPath id="sv-pin-clip"><path d="${shape}"/></clipPath>` +
    `<path d="${shape}" class="sv-pin-bg"/>` +
    `<image href="${img}" x="1.5" y="6.2" width="17" height="17" preserveAspectRatio="xMidYMid slice" clip-path="url(#sv-pin-clip)"/>` +
    `<image href="${img}" x="1.5" y="1" width="17" height="17" preserveAspectRatio="xMidYMid slice" clip-path="url(#sv-pin-clip)"/>` +
    `<path d="${shape}" class="sv-pin-ring"/></svg>`;
}

function badge(cls, text, tip) {
  return `<span class="sv-badge ${cls}"${tip ? ` data-tip="${esc(tip)}"` : ''}>${esc(text)}</span>`;
}

function perf(value, unit, tip, extra = '') {
  return `<span class="sv-perf${extra}" data-tip="${esc(tip)}"><b>${esc(value)}</b><i>${esc(unit)}</i></span>`;
}

function perfBadges(v, metrics) {
  const p = v.perf || {};
  const out = [];
  for (const m of metrics) {
    if (m === 'tvc' && p.tvc) out.push(perf(`#${p.tvc.rank}`, 'TVC', `TVC rank ${p.tvc.rank} of ${p.tvc.total}: position by vote credits this epoch`, ' sv-perf-rank'));
    if (m === 'credits' && p.credits != null) out.push(perf(fmtCompact(p.credits), 'credits', 'Vote credits this epoch'));
    if (m === 'skip' && p.skip != null) out.push(perf(fmtPct(p.skip), 'skip', 'Skip rate: leader slots skipped this epoch'));
    if (m === 'votes' && p.votes != null) out.push(perf(fmtPct(p.votes * 100), 'votes', 'Vote credits compared with the best validator, last full epoch'));
    if (m === 'slot' && p.slot != null) out.push(perf(Math.round(p.slot), 'ms', 'Median slot time of blocks produced by Solya'));
    if (m === 'ibrl' && p.ibrl != null) out.push(perf(Math.round(p.ibrl), 'ibrl', 'IBRL block building score'));
    if (m === 'age' && v.age?.epochs != null) out.push(perf(v.age.epochs, 'epochs', 'Epochs with vote credits (JIP-25 count)'));
  }
  return out.join('');
}

/**
 * @param {object} v        view from buildView()
 * @param {object} opts     { metrics, sfdpStatus, validatorUrl, live }
 */
export function renderSondaCard(v, opts) {
  const live = !!opts.live;
  const status = live
    ? `<span class="sv-status is-live"><i></i><span data-sv-ago>Live · updated ${esc(timeAgo(v.timestamp))}</span></span>`
    : `<span class="sv-status"><i></i><span>Snapshot · epoch ${esc(v.epoch)} · ${esc(fmtDate(v.timestamp))}</span></span>`;

  const initial = esc((v.provider || '?').charAt(0).toUpperCase());
  const logo = `<span class="sv-prov-logo" data-initial="${initial}">${v.logoUrl ? `<img src="${esc(v.logoUrl)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>`;

  const conn = [];
  if (v.dz?.connected) {
    conn.push(badge('sv-badge-dz', `DZ ${String(v.dz.metro || '').toUpperCase()}`.trim(), `DoubleZero device ${v.dz.device || ''}${v.dz.location ? ` (${v.dz.location})` : ''}`));
    if (v.dz.multicast) conn.push(badge('sv-badge-mc', 'Multicast', 'Publishes shreds through DoubleZero multicast'));
  }
  if (v.bam?.node) conn.push(badge('sv-badge-bam', `BAM ${String(v.bam.region || '').toUpperCase()}`.trim(), `Jito BAM node ${v.bam.node}`));

  const flags = [];
  if (live && v.delinquent) flags.push(badge('sv-badge-del', 'Delinquent', 'Delinquent in the latest SONDA snapshot'));
  if (opts.sfdpStatus === 'Approved') flags.push(badge('sv-badge-sfdp', 'SFDP', 'Solana Foundation Delegation Program: approved'));

  const tierBars = [1, 2, 3, 4].map((i) => `<i${i <= v.stakeTier ? ' class="on"' : ''}></i>`).join('');
  const mev = v.mevCommissionBps != null ? badge('sv-badge-comm', `mev ${v.mevCommissionBps / 100}%`, 'MEV commission: share of Jito tips kept by the validator') : '';

  const rows = [];
  if (conn.length) rows.push(`<div class="sv-lbl">Connections</div><div class="sv-badges">${conn.join('')}</div>`);
  const perfHtml = perfBadges(v, opts.metrics || []);
  if (perfHtml) rows.push(`<div class="sv-lbl">Performance</div><div class="sv-badges">${perfHtml}</div>`);
  if (flags.length) rows.push(`<div class="sv-lbl">Flags</div><div class="sv-badges">${flags.join('')}</div>`);

  return `
  <div class="sv-head">
    <img class="sv-mark" src="/sonda-mark.png" alt="" width="20" height="20">
    <span class="sv-brand">SONDA</span>
    <span class="sv-cluster">mainnet-beta</span>
    ${status}
  </div>
  <div class="sv-body">
    <div class="sv-id">
      <img class="sv-logo" src="/logo.jpg" alt="" width="48" height="48">
      <div class="sv-id-text">
        <div class="sv-name">${esc(v.name)}</div>
        <div class="sv-keys">${keyRow('id', v.identity, 'identity')}${keyRow('vt', v.vote, 'vote account')}${keyRow('bls', v.bls, 'BLS key')}</div>
      </div>
    </div>
    <div class="sv-facts">
      <div class="sv-fact">
        <div class="sv-lbl">Version</div>
        <div class="sv-val">${esc(v.version || '')}</div>
        <div class="sv-sub sv-cli">${esc(v.client || '')}</div>
      </div>
      <div class="sv-fact">
        <div class="sv-lbl">Stake</div>
        <div class="sv-val"><span class="sv-meter t${v.stakeTier}" data-tip="Stake tier within mainnet">${tierBars}</span>${esc(fmtCompact(v.stakeSol))} <small>SOL</small></div>
        <div class="sv-sub sv-badges">${badge('sv-badge-comm', `comm ${v.commission}%`, 'Inflation commission: share of staking rewards kept by the validator')}${mev}</div>
      </div>
      <div class="sv-fact sv-fact-loc">
        <div class="sv-lbl">Location</div>
        <div class="sv-val sv-city">${pinFlag(v.cc)}<span>${esc(v.placeLabel || v.place || '')}</span></div>
        <div class="sv-sub sv-prov">${logo}<span class="sv-prov-name">${esc(v.provider)}</span>${v.asn ? `<span class="sv-asn">${esc(v.asn)}</span>` : ''}</div>
      </div>
    </div>
    ${rows.length ? `<div class="sv-rows">${rows.join('')}</div>` : ''}
  </div>
  <a class="sv-open" href="${esc(opts.validatorUrl)}" target="_blank" rel="noopener noreferrer">Open Solya on SONDA ${ARROW_ICON}</a>`;
}
