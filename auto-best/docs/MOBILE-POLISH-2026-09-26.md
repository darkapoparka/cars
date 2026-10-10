# Auto Best mobile polish — 26 September 2026

## Changes

- Mobile service cards retain the four-color 2x2 composition, now with short BG/EN titles (Коли / Продай / Внос / Лизинг), readable supporting text, larger headings/artwork, consistent spacing and responsive heights. No route or service intent changed.
- The featured heading is now “Избрани автомобили” / “Featured cars”. Existing preview/sample context remains elsewhere; no inventory was verified or made live by this copy edit.
- The home hero pair fills more of the mobile frame without clipping. Buy/Import tabs align with the search field; mode changes retain stable panel geometry.
- Long mobile inventory model names use a single line with an ellipsis, preserving the full text and existing title/accessibility information. Desktop card layout is unchanged.
- Mobile-polish browser coverage now checks service copy and the featured heading for one-line fit and checks artwork for text overlap and containment.

## Verification

Runtime: Node 22.23.2, existing npm lockfile. Preview: `http://127.0.0.1:6461/bg`.

- `npm run test:locales`: 25 passed.
- `npm run validate`: passed architecture, CSS policy, token, typography, asset and domain checks; Svelte check reported zero errors and zero warnings; production build passed.
- `BASE_URL=http://127.0.0.1:6461 node scripts/mobile-polish-smoke.mjs`: all eight BG/EN cases passed at 320, 390, 430 and 1440px. Covers home, menu/Escape/focus return, inventory, empty filters, sell/import controls and short editors, detail actions and locale settings.
- Additional homepage matrix: all 20 cases passed with no browser errors. Evidence and final screenshots: Cars `runtime/autobest-home-final.json`, `runtime/autobest-final-*.png`. This checks BG/EN at 320, 360, 375, 390, 430, 640, 767, 768, 992 and 1440px, including text/artwork containment and stable Buy/Import geometry.
- Other evidence: `artifacts/mobile-polish-smoke/report.json` and screenshots; Cars `runtime/autobest-mobile-final-validate.log` and `runtime/autobest-polish-locales.log`.

These are local development/build checks, not owner visual acceptance, an immutable template release or dealer/public deployment. The existing reference assets, palette and desktop composition are retained.

## Preservation and Git handoff

Work is in `L:/CODEX/cars` on main. Existing Auto Best edits, the App candidate, other dealer/workflow changes and all nine pre-staged paths were preserved. Task changes are restricted to this document, four components (`Hero`, `SearchBox`, `MobileCoreActions`, `VehicleCard`), locale inputs/generated output, and `scripts/mobile-polish-smoke.mjs`.

The zero-byte stale index lock (unchanged since 18:30:26 UTC, no running Git process) was preserved at Cars `runtime/autobest-stale-index-20260926.lock`. The subsequent normal fast-forward from `31aab0f8a493e48055252ce2464597fb8b2ae55d` to fetched main `a67b1939e` aborted without changing HEAD because existing dealer-logo, isauto-varna and workflow edits overlap it. Exact blocked paths are in Cars `runtime/autobest-main-sync.log`.

Keep this polish as a scoped local main commit. Before pushing, reconcile those pre-existing edits with their owner against fetched main, then integrate and push normally. Do not blanket-stage, stash, reset, force-push or include unrelated work. No dealer or release lock was updated.
