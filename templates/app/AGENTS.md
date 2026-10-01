# App template candidate

Follow [Cars instructions](../../AGENTS.md) and [TEMPLATE](TEMPLATE.md). This is the Cars-owned `app` candidate at `L:/CODEX/cars/templates/app`. Work on the existing Cars main checkout; do not create a nested Git repository or another editable master.

This is a faithful working-copy import of `L:/cars-app`, including uncommitted UI work. The original remains preserved as reference; shared App template improvements belong here. No approved App release is selected in `templates.lock.json`; default client trios remain unchanged. Dealer-generator, mounted routing and publishing integration follow adaptation and QA.

The current Cars24 identity, captured inventory, finance/inspection claims and reference assets are retained for local comparison. Replace them with appropriate dealer or neutral content before client release. Do not present simulated login, bookings, payments or finance as completed transactions. Historical parity/capture scripts and ledgers are provenance, not an active queue.

Use Node 22.20+ on the 22 line and the retained npm lockfile. Verify 320px, 390px and desktop layouts plus affected interactions. Inspect branch, HEAD, staged/unstaged/untracked files and listeners before writing. Preserve unrelated work and never bypass an active Git lock. Follow Cars scoped commit/push rules when its index is available and main drift resolved.

- Preserve Next.js App Router, React, TypeScript and StyleX as the primary stack.
- Do not add Tailwind, styled-components or a parallel CSS framework.
- Keep the product single-dealer and configuration-driven; never introduce marketplace sellers by default.
- The first Buy/home banner represents that dealer: its retained proportional logo, actual location and verified call/map destinations from `lib/dealer.json` through `DealerHomeBanner`. The dark graphite panel uses `logo.dark`; keep the logo and contacts together, centered above a mobile contact row and grouped side by side on wider screens. Location opens the shared drawer with the configured address and Google Maps action; call uses the verified tel destination. Contact actions use compact white pills and regular text, visually secondary to the logo and search, with comfortable hit targets. Never hardcode Navara or inherit template contact details. Do not replace the dealer's recognizable logo with generated identity or a campaign scene. The mobile home keeps its service tabs without another identity header. The second banner introduces the cars; quick filters follow it immediately above the feed. Show every stocked make with its real manufacturer emblem, preserving the original detailed App badges where available, without a visible homepage brand heading competing with search. Source missing emblems before accepting a client refresh; do not use generic car icons. Put a small make label above each card's year/model title. Keep mileage/transmission/equipment facts in one horizontally scrollable row in the right column, without wrapping onto another row on narrow screens; preserve every fact. Let the photo follow the text column's height. Put the actual result count directly beside regular 16px, weight-400 search text with a clear dark icon. Repeat this preflight on later App client refreshes; see [App rollout rules](../../docs/APP-VARIANT.md).
- Preserve responsive parity across phone, tablet and desktop.
- Use original Drive24/client identity and assets. At the owner's request, real sourced manufacturer emblems identify stocked makes; record their provenance. Do not import another dealer's identity or proprietary app assets.
- Run `npm run check` before claiming completion.
- Do not delete inventory fixtures, screenshots, Git history or unrelated user files.
- Future Capacitor/React Native work must share domain and API layers rather than coupling native code to the DOM.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
