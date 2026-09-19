> Historical handoff: deployment availability, repository access and FAB rollout status below were superseded by the [verified 19 September workspace/admin audit](../../workspace/2026-09-19/REPORT.md). Preserve this file as dated evidence; use the current report and technical registry for live status.

# Client-facing Cars Admin — delivery handoff

Date: 2026-09-19. This is a separate client-facing dealership demo, NOT the private agency leads dashboard.

## Live application

- Public URL: https://cars-admin-blue.vercel.app/
- Vercel team: tyj5 / team_RTNXBnClGWDdcYFFUW0BnqvJ
- Project: cars-admin / prj_wT1EN9RKpyy4WiKJRuD38KWpRRgW
- Verified READY production deployment: dpl_BPoruc8WiyAHRgRn6WCJhbYaYQa7
- Immutable hostname: cars-admin-l8jn3la17-tyj5.vercel.app
- The primary blue alias was tested publicly without a Vercel session. Do not use the potentially protected team alias for prospect links.

## Source preservation and remaining GitHub step

The complete application is in J:/cars-admin on the authorized Windows computer, local branch main, latest local commit 46a898f83d7295819077416b9bb414c6df5e5764. The working tree was clean after the final commit. The local dev server was left running on http://localhost:3210.

The separate intended GitHub repository darkapoparka/cars-admin has NOT been created and the application source has NOT been pushed. The local GitHub CLI login returned invalid/expired authentication. The connected GitHub tools successfully edited existing repositories but exposed no repository-creation action. This is a pending authentication/repository-creation step, not a claim that all GitHub writes are unavailable.

The official portable GitHub CLI is at J:/cars-admin/runtime/gh/bin/gh.exe. After the owner refreshes its sign-in, create the private cars-admin repository, push the existing local main history without recreating the project, and connect it to the existing Vercel project. Do not request or put credentials into source files or chat.

## Implemented product

Original Fyr-inspired Next.js, TypeScript, Tailwind and shadcn/Radix UI. No paid template source or compiled DOM was copied. The Enlite listing was reviewed, but its interactive preview was blocked during this run.

Seven pages are implemented: overview, inventory, enquiries, calendar, website, assistant and settings. The inventory supports add/edit/delete, statuses, search/sort/list/grid and CSV export. Enquiries support pipeline stages and notes. Appointments can be created, edited and completed. The website editor updates a desktop/mobile embedded content preview. Settings support browser-data export/reset and activity history. Global command search and mobile navigation are implemented.

The assistant is a deterministic read-only local preview, not a connected AI model. It produces sample inventory summaries, listing text and reply drafts using current demo data.

All records are synthetic. Browser localStorage is validated with Zod. No live dealer site publication, database, real staff sign-in, media uploads, outgoing email, calendar integration, payment processing, analytics connection, AI provider or private agency CRM is connected. Published is a demo listing status. Save demo draft changes only this demo's preview. Do not enter real personal information.

The optional dealer query parameter only namespaces browser storage. It is not tenant authentication or production data isolation.

## Build and deployment

Dependencies are pinned with package-lock.json and Node 24.x. Normal npm run build remains a Next.js build for a later server-backed implementation. npm run build:demo creates a static Next.js export and Vercel Build Output API bundle with explicit no-index and security headers. The verified public deployment used the static bundle and has no server secrets or functions.

Commands in J:/cars-admin:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run test:e2e
npm run build:demo
vercel --prebuilt --prod --scope tyj5
```

Browser tests require a running app. PW_CHANNEL=chrome selects installed Chrome; PLAYWRIGHT_BASE_URL selects the public demo for production checks. Never run synthetic-data mutation tests against a future real client database.

## Verification completed

- TypeScript and normal production build passed.
- Static demo export passed and production deployment was READY.
- 10 unit tests passed.
- 10 browser workflow tests passed locally.
- The same 10 browser workflow tests passed against https://cars-admin-blue.vercel.app/ with zero failed, skipped or flaky tests.
- All seven pages were checked at 1440, 390 and 320 pixels for rendering errors and page overflow.
- CRUD, reload persistence, CSV export, enquiry stages/notes, appointments, website preview/theme, assistant read-only behavior, keyboard search, mobile navigation, corrupt-storage recovery, reset and noindex headers were exercised.
- Desktop inventory and mobile overview screenshots were visually reviewed.

Local evidence: runtime/e2e-local.json, runtime/e2e-production.json and runtime/*-1440.png / *-390.png. These are local paths, not GitHub attachments.

## Completed FAB pilot

Navara is live: https://cars-navaracar.vercel.app/

- Shared publishing helper commit in darkapoparka/cars main: de7d10dbbfa968569afb34848710a5341b8232cd, scripts/publishing/preview-switcher.js.
- Navara commit in darkapoparka/cars-navaracar main: eb83d3134d6217e1f9e3d84699ca53c391c42b03, auto-best/static/preview-switcher.js.
- Navara READY production deployment: dpl_EkBUxFuU8cW21dVtb1dELj56DsgS.

The additive change preserves the original three design routes and adds Admin dashboard, opening the shared public admin in a new tab with noopener/noreferrer. The design counter remains 1/3, 2/3 or 3/3 because the admin is not a fourth website design.

Live pilot checks passed on /, /variant-2/cars and /variant-3/ at 1440, 390 and 320 pixels: four links, unchanged original routes, screen bounds, Escape behavior and correct admin URL. A separate popup check verified the admin loaded and window.opener was null. All 10 live pilot checks passed. Evidence: J:/cars-admin/runtime/navara-live-qa.json and navara-live-admin-fab.png.

## Remaining rollout — do not mark complete

The other 23 client-facing projects were NOT connected to the new shared Cars Admin in this run. The shared publishing source is committed, but this does not retroactively update all existing deployments.

Excellent Cars and Elit Auto Import already have a separate DealerDesk /crm/ demo and fourth link. Those were inspected and preserved. Consolidation should repoint the existing admin link, not append a fifth option.

Other projects use both excellent-design-switcher and dealer-design-switcher. Preserve the current file and apply only the link delta after reading the current GitHub SHA. Day and Night uses darkapoparka/day-and-night-autodeal; IS Auto Varna's inspected deployment was CLI-based without Git metadata and its actual source still needs resolution. The read-only audit is J:/cars-admin/runtime/dealer-switcher-audit.json; refresh it before future writes.

Do not regenerate dealer websites for this navigation change. Do not overwrite logos, hero sections, layouts, listing content, build fixes or other agents' changes. The private agency dashboard was not modified. The unrelated dirty J:/cars checkout was not reset, pulled or mass-staged; safely synchronize the shared publishing helper before using that local checkout for new packages.

Additional application-local documentation: README.md, docs/ARCHITECTURE.md, docs/ASSETS.md, docs/DELIVERY.json and docs/FAB-ROLLOUT.md in J:/cars-admin.
