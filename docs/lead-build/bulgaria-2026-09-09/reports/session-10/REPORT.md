# Session 10 branch handoff — 2026-09-09

Repository: `darkapoparka/cars`  
Branch: `codex/astra-bg-10`  
Recorded base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`  
Scope: five assigned Bulgarian dealer Fast Skins only; no deployment, outreach or main/astra writes.

## Template sources actually used

| Template | Version | Published tree |
| --- | --- | --- |
| Auto Best | `2026.09.08-polish-1` | `97833980ab127f6de8f675ac1a188e4b7f717976` |
| Modern | `2026.09.06-refresh-1` | `66bfb8196bbce18832ada6b34b02dda97baba25b` |
| Carwow | `2026.09.08-repair-1` | `d4a08817e87cf84d08c4db1c08a515937245f2dd` |

All client apps are independent normal Git files. Modern retains the full workspace. Source agent/task metadata and old QA state were not carried forward as client QA.

## Outcomes

| Dealer | Folder | Outcome | Key branch commits |
| --- | --- | --- | --- |
| Plus Auto — Ruse | `clients/plus-auto-ruse` | implemented-unverified; three personalized apps, sourced sample pack and local assets | `52b6495cac62bea42c930bbb0f35ef8c475385c1`, follow-up `07e4ecdd238891cec3242ac654731a49c2e5d9c5` |
| Фреш Ауто — Ruse | `clients/fresh-auto-ruse` | implemented-unverified; three personalized apps, sourced sample pack and local assets | `10d860e92a37e0e8cf89eaad766ecb1c62402640` |
| F1 - AUTO — Vratsa | `clients/f1-auto-vratsa` | implemented-unverified; three personalized apps, sourced sample pack and generated demo branding | `1dacf744d9113f71df878affed4d630432bffc7c` |
| КЪНЧЕВ — Pleven | `clients/kunchev-auto` | implemented-unverified; three master-derived apps, published logo integrated; representative seller listings in Auto Best/Carwow | `c08c0d957362445f4b1cfd118d6768b4e188fa46` |
| ХАСКОВО КАРС БГ — Haskovo | `clients/haskovo-cars-bg` | implemented-unverified; three master-derived apps, generated demo logo integrated; representative seller listings in Auto Best/Carwow | `1d059b48285f796464a31e2e1ed1969c55b6a6c2` |

## Dealer-specific safeguards

### Plus Auto — Ruse
Source: https://plusauto.mobile.bg/  
The repository contains `SOURCE_PACK.json`, `ASSETS.json`, source checks and three app folders. Advertisement counts are not treated as independently verified current available stock.

### Фреш Ауто — Ruse
Source: https://freshauto.mobile.bg/  
Kept distinct from FRESH MOTORS in Sheremetya. The repository contains `SOURCE_PACK.json`, `ASSETS.json`, source checks and three app folders.

### F1 - AUTO — Vratsa
Source: https://f1auto.mobile.bg/  
Kept distinct from F1rst Motors Dubai. Published finance-provider names are not promoted as verified current partnerships, approvals or rates. Generated brand proposal is documented as an unapproved demo treatment.

### КЪНЧЕВ — Pleven
Source: https://kunchev-auto.mobile.bg/  
Published phone/location and logo reference were integrated. Multiple inspected current adverts explicitly decline barter; no generic trade-in/barter service is advertised. Auto Best and Carwow use a dated representative seller-advertised sample. Modern is fully branded but still uses its retained static sample inventory. Source listing-photo bytes were not available through the connector-only runner, so KUNCHEV Auto Best/Carwow retain documented template automotive artwork pending coordinator replacement with cleared, listing-matched media.

### ХАСКОВО КАРС БГ — Haskovo
Source: https://haskovocarsbg.mobile.bg/  
Published phones/location were integrated. VAT/import/customs statements remain record-level seller claims rather than global dealer promises. Auto Best and Carwow use a dated representative seller-advertised sample. Modern is fully branded but still uses retained static sample inventory. A generated black/red Cyrillic logo concept was integrated because a suitable reusable logo file was not established; generation id `0c10d61e-40c0-4891-b97f-d044ef78be47`, repository blob `3de651911e2fd24747ece0e2df4877b1dd805e76`. It is explicitly an unapproved demo concept. Haskovo Auto Best/Carwow also retain documented template automotive artwork pending cleared matched dealer media.

## Verification state

This session used GitHub branch/tree/blob/commit operations without touching the owner's Windows checkout. Remote branch refs and committed directories were read back after publication.

Executed evidence for earlier Plus/Fresh/F1 work is recorded in their client-local source-check files. For all five, `.client/project.json` deliberately keeps browser QA flags false unless corresponding runtime evidence exists.

Not executed in this connector-only handoff for the newly completed KUNCHEV/HASKOVO skins:
- lockfile dependency installation;
- Modern local Prisma generation;
- framework typecheck/build;
- local preview launch/process ownership checks;
- 390/1440 route and interaction review;
- 320 header/logo review;
- console/overflow/browser visual comparison.

The coordinator should run each client's `REVIEW.md` commands. No localhost URL in those files is a claim that a listener is currently running.

## Required coordinator follow-up before publication

1. Fetch `codex/astra-bg-10` without switching or overwriting dirty shared work.
2. Start/review one dealer at a time with the existing Cars launcher.
3. Run the documented framework checks for all three variants.
4. Replace the documented KUNCHEV/HASKOVO template vehicle artwork and Modern static sample stock with cleared listing-matched media/data before any public release.
5. Perform stale-identity and 390/1440/320 visual/interaction QA.
6. Do not infer external form delivery, live inventory, dealer approval or successful outreach from these demos.

No Vercel project, dealer repository, CRM row, external enquiry or outreach action was created by this session.
