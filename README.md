# solya.studio

Website for **Solya**, an independent Solana validator running since 2021.

🌐 [solya.studio](https://solya.studio)

---

## About

Solya is a single-operator Solana validator with 0% commission on inflation rewards and MEV. It runs in Hong Kong (since September 2026; before that in Singapore and São Paulo), is connected to DoubleZero and runs the Jito BAM client. The same operator builds [SONDA](https://sonda.network), an open-source observatory for Solana validators, and runs a genesis validator on the Alpenglow community cluster.

Live facts on the site (location, provider, DoubleZero, Jito BAM, performance) come from SONDA's public data: they are baked in at build time and refreshed in the browser.

## Validator

| | |
|---|---|
| Vote account | `HwcVgFSgmfeeF7zGFUBLoVA8Hpx8rtwyfCrJ1npBaSVC` |
| Identity | `HwN6eoEe9N3kwHi66hpQDBMFPk6ASQGthWKPX5MZmisp` |
| Commission | 0% inflation · 0% MEV |
| Location | Hong Kong (Amarutu, AS206264), since September 2026 |
| SFDP | ✓ Approved since 2021 |
| DoubleZero | ✓ Connected, multicast publisher |
| Jito BAM | ✓ BAM client |
| Alpenglow | ✓ Genesis validator (community cluster, wave 2) |

Live profile: [Solya on SONDA](https://sonda.network/validator?id=HwcVgFSgmfeeF7zGFUBLoVA8Hpx8rtwyfCrJ1npBaSVC&cluster=mainnet-beta)

## Related

- [SONDA backend](https://github.com/SolyaUk/sonda): analyzer and data pipeline
- [SONDA dashboard](https://github.com/SolyaUk/sonda-network): the sonda.network frontend
- [sonda.network](https://sonda.network): public dashboard, live since May 2026

## Stack

- [Astro 5](https://astro.build): static site generator
- [Tailwind CSS v4](https://tailwindcss.com): styling
- [Netlify](https://netlify.com): hosting and CI/CD
- [Plausible](https://plausible.io): privacy-friendly analytics, no cookies
- Data: SONDA public JSON at `data.sonda.network`

## Where things live

| Path | What |
|---|---|
| `src/data/solya.js` | Hand-written facts: keys, SFDP, location story, timeline, links |
| `src/data/sonda-fallback.json` | Last known SONDA snapshot, used when SONDA is unreachable at build time |
| `src/lib/sonda.js` | Reads Solya's record from SONDA data (build time and browser) |
| `src/lib/sonda-card.js` | The "Solya on SONDA" card markup |
| `scripts/sonda-snapshot.mjs` | Refreshes the fallback snapshot |

After a move, add the new place to `LOCATIONS` in `src/data/solya.js` and an entry to `TIMELINE`; everything else follows SONDA.

## Development

```bash
npm install
npm run dev            # localhost:4321
npm run build          # build to dist/
npm run sonda:snapshot # refresh src/data/sonda-fallback.json from SONDA
```

---

[solya.studio](https://solya.studio) · [@SolyaOS](https://x.com/SolyaOS) · [github.com/SolyaUk](https://github.com/SolyaUk)
