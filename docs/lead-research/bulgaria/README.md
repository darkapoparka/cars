# Bulgaria dealer lead register — Varna first, Sofia second

Research date: **2026-09-08** (Europe/Sofia). **547 source-linked marketplace profiles across 16 city-directory buckets, plus a separately labelled Banovo/Varna-province profile.** This is the full working register produced by this research pass, **not a complete census of Bulgarian dealerships and not 547 qualified leads**.

**62 profiles received additional catalogue/content screening. 49 are in the ordered follow-up queue; 11 are held for unsuitable/mixed catalogues and two for franchise-specific review.** Identity and stock-location gates remain explicit. Profiles sharing a phone/brand are not automatically separate legal businesses. No count is a promise of available cars.

## Open these first

- [Prioritized shortlist](SHORTLIST.md): all 49 follow-up profiles, dated ad counts and the next issue to verify.
- [Varna profile bank](profiles-varna.json): 143 directory profiles, Eco Drive and nearby NEXTCAR/Banovo — 145 in this file. [Detailed screening](screening-varna.json) covers 29.
- [Sofia profile bank](profiles-sofia.json): 117 directory profiles plus Optimum — 118. [Detailed screening](screening-sofia.json) covers 17.
- [Other Bulgaria bank](profiles-other.json): 284 profiles across 14 other city buckets, including four carried-forward assigned profiles. [Detailed screening](screening-other.json) covers 16.
- [Account and duplicate safeguards](account-links.json), [ordered research queue](research-queue.json), [coverage and source dates](coverage.json).

The source banks use explicit `columns` and compact rows. Expand each row by zipping `columns` with its values. `profile` is the stable publisher key; its public page is `https://{profile}.mobile.bg/`. A directory page number of 1 means `directoryUrl`; other numbers append `/p-N`. An empty page list uses the recorded `extraSource`. Apply the screening and account-link overlays before selecting work. These files are **research data, not application configuration**.

## What to work on first

**Varna:** prioritize identity/domain and media review for Перфект Ауто, Теси Кар, Централ–Автосалон, КАПИТОЛ, Аутофест and Експрес Ауто. Then assess the smaller mixed-stock candidates rather than imposing an arbitrary 30-car cutoff. Eco Drive and Kolarov Cars can be interesting specialist prospects, but overseas/in-transit vehicles must not be represented as physically available in Varna.

**Sofia:** TROYA AUTO, FADI CARS, VVC-AUTO, МАВЕРИК, DANGER AUTO, AUTOHOF, Любо Кар and Optimum are research priorities. CAR MAX, NOVA CARS and Stenli Car have domain evidence and belong in an audit-first lane, not a no-website pitch. KJ Cars publishes a Bulgarian/overseas catalogue and needs vehicle-level location separation. Rankings are editorial, not measured conversion potential.

**Rest of Bulgaria:** preserve the stock-led candidates already screened in Plovdiv, Burgas, Ruse, Stara Zagora, Veliko Tarnovo/Sheremetya, Dupnitsa, Vratsa, Pleven, Dobrich, Pernik and Haskovo. These do not jump ahead of Varna/Sofia merely because their ad total is larger.

## Geographic coverage

| Directory bucket | Profiles in register | Additional catalogue screens | Coverage |
|---|---:|---:|---|
| Varna | 144 | 28 | all 8 displayed snapshot pages; not a city census |
| Sofia | 118 | 17 | first 6 of 52 displayed pages |
| Plovdiv | 24 | 2 | first directory page only |
| Burgas | 20 | 2 | first directory page only |
| Ruse | 20 | 2 | first directory page only |
| Stara Zagora | 20 | 1 | first directory page only |
| Veliko Tarnovo | 20 | 1 | first directory page only |
| Shumen | 20 | 2 | first directory page only |
| Dupnitsa | 20 | 1 | first directory page only |
| Pleven | 20 | 1 | first directory page only |
| Dobrich | 20 | 1 | first directory page only |
| Vratsa | 20 | 1 | first directory page only |
| Haskovo | 20 | 1 | first directory page only |
| Pernik | 20 | 1 | first directory page only |
| Blagoevgrad | 20 | 0 | first directory page only |
| Pazardzhik | 20 | 0 | first directory page only |
| Banovo / Varna province | 1 | 1 | Separately discovered; not Varna city |

Varna directory snapshots yielded **153 row appearances and 143 distinct profile URLs**. Sofia yielded **120 appearances and 117 distinct profile URLs**. Repeated rows caused by changing page snapshots were collapsed, while all observed page references were retained. Across all directories: **553 appearances / 540 distinct profiles**, plus three separately discovered profiles and four assigned records carried from the existing source snapshot.

## Existing work and active sessions

The inspected heads were `main` at `6998a7ce8092b99422cdb9cccc0b18449ff2f541` and `astra` at `4ef7edfe4c1566dcc0688bc78b87f812de1223c4`. The client trees were read on both. This was a **directory/known-account cross-check, not a full current content or QA audit**.

Ten historical Varna accounts, Navara, ELIQ, Day & Night and ASKO paths remain protected. The ASKO brief explicitly refers to ASKO96-2; the similarly named Sofia profile is held for relationship review, not silently merged or treated as new.

The seven Bulgarian candidates already allocated to sessions 01–03 remain reserved: VALENTINO AUTO HOUSE, Success Automobile, VOIVODOV AUTO & ANTONIO, K-G Team Auto, icars Plovdiv, FIVE AUTO and MG7 Group. **Assignment does not tell us whether a session was launched, and a folder does not prove completion.** This research changes no existing assignments, reports, client files or completion flags. Recheck the latest `main` and `astra` immediately before allocating more work.

## Qualification and city-completion rules

A discovered profile enters the build queue only after current business identity/location, relevant whole-vehicle stock, domain status, media-use basis and a useful template-fit opportunity have been checked. Match names, primary and secondary phones, marketplace URLs, domains and possible branch relationships. Unresolved contact history stays unknown in the private authority; never turn it into “never contacted.”

A city is **not complete** merely because directory pages were read. For this campaign, city closure requires each discovered profile to be accounted for as existing/reuse, duplicate/branch, qualified, explicit hold, or out-of-scope, plus a bounded cross-check of other marketplace/social/independent-domain sources. Every approved dealer then needs its three variants audited individually. **Neither Varna nor Sofia is marked complete by this document.** Other-city first-page samples and cities not listed here remain discovery gaps.

Website absence is never inferred from a failed fetch. A cover image reference is never interpreted as a missing logo. Before a later build, visually inspect actual banners/signage; use original branding or a source-based professional image-generated refresh, integrate local assets and verify the real consumers. Follow [Lead Build Guardrails](../../LEAD-BUILD-GUARDRAILS.md) and the [existing batch contract](../../lead-build/README.md). No generated logo, media licence or full visual website audit is claimed in this research.

## Resuming and recording outcomes

Keep the stable profile key and mapped lead ID. Update research evidence separately from build status. A later coordinator may record per-variant states such as `no-committed-build-found`, `partial`, `implemented-verification-pending`, `verified-with-evidence`, or `blocked`, with commit/path/check evidence. Do not set those states from a chat summary or this shortlist. Do not regenerate an occupied client folder.

New research is **not new build, deployment or outreach authorization**. The ongoing batch retains its existing authorization. No external forms were submitted, no dealer was called or messaged, and no private CRM/outreach record was created here.

## Verification of this register

See [VALIDATION.md](VALIDATION.md) for structural checks actually run. The evidence URLs were collected during the research; the validator does not claim an HTTP check of every URL or a visual audit. Contact details and stock counts need refresh when used. The final GitHub compare must remain limited to this research directory.
