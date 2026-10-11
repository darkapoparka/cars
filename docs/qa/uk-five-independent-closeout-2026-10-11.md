# Five UK dealers: independent hosted closeout

Verified 11 October 2026, 07:26–07:28 UTC. This supersedes the earlier zero-public-UK status for the five dealers below; it does not claim delivery of the remaining five leads.

## Public delivery

The UK resume session completed the single-Worker rollout. This follow-up independently checked the actual Cloudflare deployments, public responses, current approved template selection, logo assets and browser journey evidence. No duplicate rollout was started.

**Five public dealers, six designs each, thirty public design entries, five UK Workers.** Each public Worker has `workers.dev` enabled, serves its verified version at 100%, and has no service bindings to separate application Workers.

| Dealer | Public origin | Build | Active version |
| --- | --- | --- | --- |
| Broadbent | https://cars-uk-stockport-broadbent-car-and-servicing.darkapoparka1.workers.dev | 38096573283 | 98b11c03-2f96-43ea-8d3f-2a32610a692a |
| Motors Castle | https://cars-uk-motherwell-motors-castle.darkapoparka1.workers.dev | 38096574521 | 2e12a697-5401-4d9e-bbe6-6b8971d1a02c |
| Trade Car Sales | https://cars-uk-birmingham-trade-car-sales-grasmere.darkapoparka1.workers.dev | 38096575807 | 10defb56-3e5e-40ad-9937-8e48247bfbaa |
| Square One Motors | https://cars-uk-birmingham-square-one-motors.darkapoparka1.workers.dev | 38096577012 | c6fb23d6-15e0-4a94-8db1-0573effd1b4e |
| AS Motor Group | https://cars-uk-batley-as-motor-group.darkapoparka1.workers.dev | 38096571739 | ed126f50-3e0c-4d31-b062-1befde515fea |

Every dealer offers Auto Best, Modern, Import, App, Mobile and Signature. The selector is separate from the shared admin demonstration.

The Cloudflare account read at 07:24:40 UTC returned **100 total Workers, five UK Workers**. This is an observed account count, not an inferred count from the number of Bulgarian leads. The former seven-Worker-per-UK-dealer design is no longer the live arrangement.

## What passed

- 30/30 direct public design entries returned HTTP 200, with expected dealer titles and no detected Worker/server-error page.
- 30/30 template pins (six per dealer) matched the current approved lock by revision and digest. Lock bytes SHA-256: `ecdfaf9599fbcbeadebc24de3b9aa1c7615a9a49e29d338e5e9a23427d405e26`.
- 15/15 on-light, on-dark and on-accent logo asset responses matched the exact source-contract SHA-256 hashes.
- 60/60 retained rendered checks (six designs at 390 and 1440 px for five dealers) passed status, overflow, visible-image, JavaScript-error and failed same-origin request checks. These records postdate the corresponding active deployments.
- 30/30 primary browser journeys passed inventory entry, six selector choices, Escape dismissal, selector fit at 320 px, a real vehicle detail, detail reload, back navigation and contact-route checks. No external enquiry was submitted.

The follow-up independently reran primary journeys for Motors Castle, Trade Car Sales and Square One. The already-passing post-deployment AS Motor Group and Broadbent evidence was retained and checked rather than overwritten.

## Branding and template palette

Modern's rendered mobile surface is neutral charcoal with the white logo; its desktop header uses the dark logo on white. The erroneous dealer accent override no longer recolours the native template palette. The current Import configuration now binds the correct light/dark logo slots, including its mobile header, with versioned asset names so old client caches do not restore the wrong mark.

Matching transparent raster variants preserve the existing generated emblem and lettering. The retained contracts explicitly record deterministic background separation and monochrome preparation. **This was not five newly redesigned logos and no new Image Gen 2.5 call is claimed by this verification.**

Relevant published fixes: provider composition `dd71b96f6ac93b1c9fba5d4a4c0e9aed33759cd5`; presentation/logo policy `8cb6002cbf9fbb405c29bad34b3804e604a413a9`.

## Remaining limitation, not hidden by the pass count

On a fresh direct visit to `/variant-5/` without `lang`, the English Mobile page initially gives the floating selector a Bulgarian label. Verified on Broadbent at 07:28:10 UTC: document language `en`, selector initially `bg`; opening the selector changes it to `en` and all six design links carry English correctly. Normal entry through the English selector uses `/variant-5/?lang=en` and is not affected. This is a cosmetic direct-link initialization defect; it was not repaired in this closeout and the sites are not described as flawless.

These remain independent proposal demos with dated stock samples and illustrative vehicle images, not an owner-approved live inventory feed or proven enquiry/CRM integration. Sustained Free CPU-load qualification is not established by the browser checks.

## Evidence and source identities

Canonical build source: `eb6e2d9e3d8a6581b963529f2aff6cf4fde0a300`. Private publishing commits:

- Broadbent: `fae86baf406f7c4584f65ce3503b58a2b795ee2d`.
- Motors Castle: `b14a384d11ca1d8295a38f26cde16b9ba0716221`.
- Trade Car Sales: `6a5e2784731aa5fe46199ff937db6bb16e2ba1a1`.
- Square One Motors: `f3fab73c4c6662e19f50d32deabf7d10961f352f`.
- AS Motor Group: `59d9c858a8e28cc3070e09ed8644a0bfeb1f483c`.

Bounded local evidence is retained under `runtime/uk-closeout-20261011/` (`final-verification.json`, `mobile-direct-language.json`, primary journeys). Deployment and original provider receipts remain under `runtime/uk-five-final-20261011/`; rendered checks remain under `runtime/uk-resume-20261011/`. Existing source, unrelated working changes and other rollout processes were preserved.
