# solya.studio

Website for **Solya** — an independent Solana validator running since 2021, hosted in Singapore (previously São Paulo, Brazil from June 2025 to May 2026).

🌐 [solya.studio](https://solya.studio)

---

## About

Solya is a single-operator Solana validator with 0% commission on inflation rewards and MEV. Hosted in Singapore (May 2026 onwards, previously São Paulo, Brazil for nearly a year), connected to DoubleZero and running the Jito BAM client. The same operator also builds [SONDA](https://sonda.network), an open-source network decentralization analysis tool, and participates in early protocol testing (Alpenglow community cluster).

This repository contains the source code for the validator's public website.

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Netlify](https://netlify.com) — hosting and CI/CD

## Validator

| | |
|---|---|
| Vote account | `HwcVgFSgmfeeF7zGFUBLoVA8Hpx8rtwyfCrJ1npBaSVC` |
| Identity | `HwN6eoEe9N3kwHi66hpQDBMFPk6ASQGthWKPX5MZmisp` |
| Commission | 0% inflation · 0% MEV |
| Location | Singapore (AS20473, since May 2026) |
| SFDP | ✓ Approved since 2021 |
| DoubleZero | ✓ Connected (sin001-dz002) |
| Alpenglow | ✓ Genesis validator (community cluster, wave 2) |

## Related

- [SONDA](https://github.com/SolyaUk/sonda) — Solana Observatory for Network Decentralization Analysis, an open-source network analytics tool built by the same operator
- [sonda.network](https://sonda.network) — public dashboard, live since May 2026 (Colosseum Frontier Hackathon)

## Development

```bash
npm install
npm run dev      # localhost:4321
npm run build    # build to dist/
```

---

[solya.studio](https://solya.studio) · [@SolyaOS](https://x.com/SolyaOS) · [github.com/SolyaUk](https://github.com/SolyaUk)
