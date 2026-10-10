# Existing dealer fleet: Cloudflare pilot deployed

Observed **2026-10-10T22:04:43.605Z** (11 October 2026, Europe/Sofia).

## Current owner direction and actual result

The owner requested using the working Cloudflare delivery path instead of continuing to wait for Vercel quota. This record covers the existing 25-dealer cohort, not the other agent's ten new Varna leads. The new Varna branch and its Workers were not modified.

**Promosale Varna is deployed and anonymously browser-verified on Cloudflare with all six designs. This run migrated 1/25 existing dealers; it did not complete the other 24.** The earlier statement that this run had zero hosted releases no longer applies to this pilot. Existing Vercel projects, aliases and dedicated publishing repositories are unchanged.

Public dealer origin: **https://cars-promosalevarna.darkapoparka1.workers.dev/**

Cloudflare account: `cb0007f242077bd759331f096eb75531`.

| Design | Entry on the public origin |
|---|---|
| Auto Best | `/` |
| Import | `/variant-2/` |
| Modern | `/variant-3/cars` |
| App | `/variant-4/` |
| Mobile | `/variant-5/` |
| Signature (`karento-best`) | `/variant-6/` |

One public router binds six internal application Workers. The internal Workers have workers.dev and preview URLs disabled; the router is public. Cloudflare's deployment API confirmed each recorded version receiving 100% of its Worker traffic. Admin remains the existing separate demo, not a seventh design.

## Immutable source and compilation

- Repository: `darkapoparka/cars`.
- Isolated release branch: `codex/cloudflare-existing25-20261011`.
- Exact built and deployed source: `5f44a463f4fb3fb2b2113e1f3926bfa87d9b557b`.
- Source tree: `2b11d78f6fdc816c4789d4796ae6de7b5a02ff12`.
- Source baseline: `07768e05360676160495f6dd527458c2bf114d8b`.
- Existing preservation-aware Promosale candidate: `d46d832fe651d24300cfb5bff8a3ac437b572eec`.
- Reused Varna adapter source: `b90e69f6091626c1ee149b0c66c4f645b0f6fea7`.
- GitHub Actions: https://github.com/darkapoparka/cars/actions/runs/38088514327 . Plan and all seven compilation jobs passed.

The release uses existing six-design source, publisher, Cloudflare framework adapters, dealer-reference specialization, static-demo database specialization and the previously tested Modern logo-binding repair. It does not regenerate dealer identity from new research. The variant order intentionally retains Promosale's Import second / Modern third arrangement. App remains fourth, Mobile fifth and Signature sixth. Carwow is excluded from the published choice set, not removed from historical source.

Branding, dealer-brand files, business facts and stock source were checked against the main baseline. Every original App dealer JSON field was retained; only current schema defaults were added. The six Signature records' IDs, prices, mileages and fuel fields were checked against the saved preservation baseline. Existing template pins matched the selected latest committed family sources:

| Family | Source revision |
|---|---|
| Auto Best | `696230a404abd9b20b6f907b9cfb139175298c7a` |
| Modern | `6f87470c1e3ec8ade7d9ecc07daf9ebe45cb9710` |
| Import | `b9373e9ed5453bc7d208898ae140eae4d596a232` |
| App | `4e184777567849a2c5b4a9e4a3e652252179c29c` |
| Mobile | `8a97176e3adfbd95dce69b3096abc84e3eecd9c8` |
| Signature | `cc130e432a41a3a60cc80bc2b3461c6416893b4a` |

GitHub artifact archive digests, complete compiled-file inventories, account identity, Worker names, source consistency and bindings were validated before normal authenticated Wrangler uploads. The source checkout and shared index were not reset, cleaned, blanket-staged or replaced. The inaccessible I-drive preparation was not accessed. Large framework compilation ran in GitHub; compiled artifacts were staged on C, not by copying another full dependency tree into the occupied Cars checkout.

## Observed hosted checks

| Check | Result |
|---|---|
| Compiled application Workers plus router | 7/7 passed and uploaded |
| Six designs, EN/BG, 390px and 1440px entry checks | 24/24 passed |
| Six-design selector/layout checks at 320px | 6/6 passed |
| Representative vehicle detail and reload, every design in EN/BG | 12/12 passed |
| App and Signature second homes, EN/BG | 4/4 passed |
| Anonymous favicon/social/canonical metadata pages | 16/16 passed |
| Hosted identity asset bytes versus compiled SHA-256 inventory | 21/21 passed |
| Screenshots inspected | Selector 390px, App 1440px, Signature 390px |
| External enquiries, phone calls or messages submitted | 0 |

The entry checks include browser runtime errors, visible broken images, document language, horizontal overflow, exactly six selector choices, Escape dismissal, noindex and the shared Admin destination/target/rel. Detail checks include an actual card URL, anonymous HTTP 200, visible images, language, browser errors and reload. These are representative journeys, not a claim of exhaustive acceptance of every route or vehicle.

The first requests immediately after router upload observed three 404s. Later checks on the unchanged deployment passed, including a complete repeated 24-case browser pass. Original failures are retained rather than erased. An initial supplemental QA script incorrectly compared the status method instead of calling it; the corrected check passed and both receipts remain. Signature social canonical checking requires the publisher's actual `lang` query policy; the generic run without those expectations is retained separately.

**Known retained behavior:** Mobile resolves the English locale after browser hydration; its initial server HTML remains the template default Bulgarian. Browser EN/BG checks pass, but this is not a claim that Mobile has English server-rendered HTML. Owner visual approval and outreach readiness are not asserted by agent QA.

## Exact uploaded versions

| Worker | Version |
|---|---|
| `cars-promosalevarna-auto-best` | `94d52954-5898-4dad-853a-7c6a695ce3cf` |
| `cars-promosalevarna-modern` | `214190b0-fcd5-4373-9562-e77bea101d53` |
| `cars-promosalevarna-import` | `d0e4c451-b5bc-48d5-8746-d695069a7206` |
| `cars-promosalevarna-app` | `7781b905-3b53-4ccf-a047-90f3b0467fdd` |
| `cars-promosalevarna-mobile` | `b0be131c-3e51-447e-a167-45c403f45021` |
| `cars-promosalevarna-signature` | `13042616-005f-479b-9a4d-2793c5e5f4b4` |
| `cars-promosalevarna` router | `c4ab119d-36a2-4009-bec2-93baf7c558c8` |

Router deployment ID: `b02a8ba1-c626-4c91-94d6-ee0c69a96b3f`. Router version was deployed at 2026-10-10T21:55:12.245467Z. Its compiled digest is `348f0c569728b99462b8b9e4578923599f70d2d53b6e9260350323ae6a9d1854`.

## Evidence and continuation

Detailed evidence and exact downloaded ZIPs are currently retained under:

`C:/Users/radev/AppData/Local/Temp/cars-existing-cloudflare-artifacts/38088514327/promosale-varna/`

The reviewed upload/verification helpers are in its parent cohort directory. The public release branch holds the build workflow, compiler adaptation and source inputs. The GitHub artifacts expire on 17 October 2026; preserve them before then if longer artifact retention is required. This document is durable, but the detailed PC evidence is in temporary storage and is not a permanent archive.

| Evidence | SHA-256 |
|---|---|
| `deployment.json` | `d31c0ce0c9b1446206908277f7a90fcec461d4a19cf621064cf1bebe72cf4a1e` |
| `hosted-browser-first-pass.json` | `26975d80df3bbee82e93bbc1e820ca06f5b91a3edc0354a93ce7039d92301666` |
| `hosted-browser.json` | `2a3bfb7d211da52bc5113e6d5c5bbbcac65213b5e9d74e02a6ae5d4f8b2a2ecb` |
| `hosted-social-verified.json` | `b217e48145c6dde0c818477c60a327653bd227f0351d498ccfc992e556f7c50e` |
| `hosted-compact-and-details-verified.json` | `160af780d5d7e464c9f0145295bde736cc295653135cc4f9a88112da947a047f` |
| `hosted-identity.json` | `cee09586bcddbc3b5dde51e1199747cedf6afc3f33e227b61808ffdcc6910469` |
| `hosted-detail-locales.json` | `b8e0d50680e76101e59370ed99d8d48a2932fbb38dc1afff91189b1c7317f438` |

Continue from this compiled/hosted pilot, not a new Vercel retry or a duplicate dealer identity. The other 24 preservation-aware template refreshes, source/package reconciliations and Cloudflare deployments remain outstanding; they are not already queued or verified. Canonical main dealer source still needs a reviewed reconciliation with this isolated candidate. Preserve independent Al Reef ownership and existing Priselci Cloudflare resources when extending the fleet.

Capacity must be checked before expanding this exact architecture: 25 dealers times seven Workers is 175 Workers, excluding the other Varna/UK projects and qualification Workers. Official limits are 100 Workers/account on Free and 500 on Paid: https://developers.cloudflare.com/workers/platform/limits/ . Workers Paid has a $5/month minimum account subscription plus applicable usage: https://developers.cloudflare.com/workers/platform/pricing/ . The current account billing subscription could not be read with the connected permissions; `default_usage_model: standard` alone was not treated as proof of its plan. No upgrade, billing change, alternate account, DNS migration, protection weakening or outreach was performed.
