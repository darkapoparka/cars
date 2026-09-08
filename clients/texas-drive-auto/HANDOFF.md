# Texas Drive Auto — implementation checkpoint

Three independent application copies now exist: `auto-best`, full-workspace `modern`, and `carwow`. They were copied from the real masters with the repository helper after its dry run. Source commit: `57a0c9694e325747d776cfd78255b60241080a8a`. This supersedes the earlier no-apps handoff, but is **not a finished or sendable delivery**.

Auto Best has eight dated source-backed listings, explicit USD/miles consumers, published local logo exports, corrected payment-policy and safe draft copy, no inherited staff/reviews/video channel, and zero Svelte errors/warnings. Modern has the same eight listing samples, one matched dealer directory record, US brand/locale configuration, no inherited fictitious operational records, and a successful full-workspace frozen-lockfile installation. Carwow is copied and has the local brand pack; its data/content pass is underway.

Original stock facts remain in SOURCE.json; the shared set is stock.json. Asset origins and unresolved redistribution permission are in assets/provenance.json. Only three matching vehicle photographs were retrievable; the other five remain explicit diagnostic placeholders, not other cars. The 2018 Escalade is prominently marked REBUILT TITLE based on matched public syndication.

## Actual checks

Evidence: evidence/session-05. Auto Best: Node22.22.0/npm10.9.8 `npm ci` and `npm run check` passed. Modern: Node22.22.0/pnpm11.4.0 `pnpm install --frozen-lockfile` passed. Production builds, Prisma generation, full browser checks and final asset/content acceptance are not claimed at this checkpoint. Proposed ports7441/7442/7443 have not yet been started. No deployment, contact, database migration or CRM action occurred.

## Local runtimes / eventual launch

Auto Best uses Node22 and npm; install in auto-best, then use the root preview launcher on an explicitly free7441. Modern uses Node>=22.22<23 and pnpm11.4.0, install at modern root, generate local Prisma using `pnpm --filter @repo/database build`, then launch web from apps/web with demo environment and distinct public/API/private origins on7442. Carwow uses Node24, npm ci/check/build and the root launcher on free7443, not its inherited fixed-port dev wrapper. Do not run a generator or assume this in-progress checkpoint has passed browser acceptance.
