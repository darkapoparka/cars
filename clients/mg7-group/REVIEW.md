# MG7 Group — review

Status: **implemented-unverified**. Three complete independent app sources, not a generator.

| Design | Folder | Proposed local review entry | Install/check |
|---|---|---|---|
| Auto Best | auto-best | http://127.0.0.1:6631/ | Node 22; npm ci; npm run validate |
| Modern | modern (whole workspace) | http://127.0.0.1:6632/cars | Node >=22.22 <23; pnpm 11.4.0 install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck |
| Carwow | carwow | http://127.0.0.1:6633/ | Node 24; npm ci; npm run check; npm run build |

These are exact proposed entries, not running servers. After safe integration into a clean/preserved coordinator workspace, use scripts/start-client.ps1 -Client mg7-group -Prepare, then scripts/start-client.ps1 -Client mg7-group. The launcher checks its own listeners and ports; do not kill unrelated processes. No active server or port availability is claimed here. Modern starts from apps/web in its retained monorepo, using its existing static demo configuration and distinct local origins.

## Executed evidence
SOURCE-QA.json records 79 Svelte compilations, 106 JS/TS syntax/transpilation checks, narrow strict data checks, actual directory-schema evaluation, three-way ID/price/km/gallery parity and the actual Auto Best asset validator run against the in-memory source snapshot. This is not a full install, application typecheck, production build or browser review. No files were written to the shared Windows checkout.

## Coordinator acceptance still needed
Install/build each retained runtime; compare master and dealer home, catalogue, real detail/gallery, contact, filter/reset, menu dismissal/focus and back-state at 390/1440 px; inspect header/logo at 320 px; check console/images/overflow and enquiry destinations without sending. Owner review is pending. Public-origin mounts and FAB are not implemented in this branch handoff. No deployment or message was sent.
