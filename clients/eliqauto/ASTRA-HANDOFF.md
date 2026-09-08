# ELIQ AUTO — Astra three-template implementation

Status: **first-pass code personalization; local build and browser acceptance pending**. This is not a finished, sendable offer. Read each `.client/project.json`; no QA flag has been marked passed.

## What is committed

Three full independent source copies exist under this folder: `auto-best/`, `modern/` (the entire workspace), and `carwow/`. They were copied by Git tree identity from `templates/` at commit `6998a7ce8092b99422cdb9cccc0b18449ff2f541`, then personalized in place on branch `astra`. No template master or other client's source was edited. The temporary root source-review workflow was removed.

The existing layouts, component implementations, styles, dependencies and lockfiles are retained. Added ELIQ logo/photo directories are real repository files, not links to another local drive. Each variant has its own saved source JSON and identical `eliq-stock.ts` normalizer. It selects at most twelve records with a known positive price, known core specs and local photos. Unknown-price records are excluded rather than advertised for zero euros. Source IDs and advert URLs are retained; numeric parsing handles normal/non-breaking/narrow spaces. Equipment and finance guarantees are not invented.

Auto Best has ELIQ identity/contact configuration, inventory data, home-location copy, contact topics, a showroom pin from the saved ELIQ source, and ELIQ's curated video IDs. Modern has ELIQ lead-site configuration and explicit ELIQ stock/search/detail/related adapters; the original non-public fixture contracts remain in `template-mock-data.ts`. Carwow has ELIQ identity/navigation, stock/gallery adapters and SEO. Its source testimonials were removed rather than attributed to ELIQ.

## Facts and provenance

Contact source checked 8 September 2026: https://eliqauto.mobile.bg/contacts — ELIQ AUTO, Pazardzhik, 0896 781 662 / 0897 415 674, Svoboda Street behind the cemetery; the marketplace lists Mon–Fri 09:30–19:00 and Sat–Sun 09:30–17:00. The recorded own-site hours in older source material differ, so confirm before an external offer.

Stock JSON is copied from `templates/showroom/src/lib/data/eliqauto-listings.json` (blob `d6ada0340756d4ff9ce2ac1b157e4197ed475b08`), captured **21 June 2026**, not newly verified September stock. Its old Sofia location strings are not used as the dealer's present address. Brand assets come from `templates/showroom/static/assets/eliqauto/brand` (tree `4cc2e4763242d985bb86a7e7a450ce3addc1dcc6`), vehicle photos from its `cars` directory (tree `581243ef6aab176f9ed7ab072de19b1d32f22e90`). Source video selection and the showroom pin come from the saved `eliqauto-media.ts` / `eliqauto-about.ts`. YouTube thumbnails still require network access. Existing source license/provenance notes remain; no new commercial rights clearance was performed.

## Local execution

Use a separate worktree or inspect dirty work before checking out `origin/astra`. Never overwrite the currently running local client projects. Resolve the actual Cars root; do not assume J: exists. Do not re-run `new-client.mjs`: these three folders already contain the copies.

Auto Best: use its retained Node 22 constraint, install with `npm ci` inside `clients/eliqauto/auto-best`, then run `npm run validate`. From the Cars root launch on an explicitly free port:

```powershell
./scripts/start-preview.ps1 -Client eliqauto -Template auto-best -Port 6681
```

Modern: use **Node >=22.22.0 <23 and pnpm 11.4.0** as declared by the retained source. From `clients/eliqauto/modern`:

```powershell
pnpm install --frozen-lockfile
pnpm --filter @repo/database build
$env:SKIP_ENV_VALIDATION="true"
$env:AUTOMARKET_PUBLIC_DATA_MODE="demo"
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:6682"
$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:6684"
$env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:6685"
pnpm --filter web typecheck
pnpm --filter web build
```

The database build generates the local Prisma client; do not migrate or connect a production database. The three configured origins must be distinct. 6684/6685 are configuration placeholders, not servers to start. The validation bypass is local-preview-only. In the same environment, return to the Cars root:

```powershell
./scripts/start-preview.ps1 -Client eliqauto -Template modern -Port 6682
```

Carwow: switch to **Node 24** before its `npm ci`, `npm run check` and `npm run build`. From Cars root:

```powershell
./scripts/start-preview.ps1 -Client eliqauto -Template carwow -Port 6683
```

Intended local entries are `http://127.0.0.1:6681/`, `http://127.0.0.1:6682/cars`, and `http://127.0.0.1:6683/`. These are suggestions, not claims that listeners exist. The root launcher must refuse occupied ports. Run heavy builds sequentially; do not run a Next build and dev server against the same output folder. Do not upgrade packages to solve environment setup unless a specific dependency defect is established.

## Required local completion/QA

This implementation has NOT been compiled or rendered in the authoring environment. The GitHub connection supported direct file commits, but the local shell could not resolve GitHub to install/check out the full applications. No CI-based build is being used as a substitute.

Inspect primary entry, inventory, first real ELIQ detail, contact and about at 390 and 1440 px. Verify actual logos/photos, euro prices and mileage, identical selected source IDs across variants, search/sort, direct detail navigation, galleries, Back behavior, menu/filter Escape and focus return, overflow and console/network errors. Test unavailable IDs as 404s; do not map old dealer IDs onto arbitrary ELIQ cars. Do not submit a real form or place a call.

**Remaining work must not be hidden:** a complete inherited-identity/media scan and rendering pass has not happened. Inspect all runtime source, metadata, public assets and offered supporting routes for Day & Night, old phones/domains, Sofia/Studentski Grad, source maps, biographies, source-branded artwork and template claims. Historical file names and source provenance may remain; visible dealer identity must not. Auto Best editorial/support surfaces and Carwow's static auxiliary copy/team/chat/profile routes particularly need review. Remove empty social links from rendered controls. Verify unknown Carwow door counts render as an em dash, not zero doors. Check the empty-review state and remove false rating decorations where a component hardcodes them. Keep all fixes within these ELIQ copies and preserve the source layouts.

Run relevant existing tests. Some source-specific smoke expectations may still name old stock IDs; distinguish a test-fixture update from an actual regression and do not blindly reset visual baselines. Record precise commands, exit codes, screenshots, routes, viewports and remaining defects in a new `ASTRA-QA.md` and the selected `.client/project.json` files. Mark ready only after actual local acceptance. Do not mistake the master's historical TEMPLATE.md QA for evidence about these copies.

No deployment, live inventory feed, CRM registration, message delivery, outreach, sale, or client endorsement has been performed or implied.
