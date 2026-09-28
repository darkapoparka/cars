# App template candidate

Follow [Cars instructions](../../AGENTS.md) and [TEMPLATE](TEMPLATE.md). This is the Cars-owned `app` candidate at `L:/CODEX/cars/templates/app`. Work on the existing Cars main checkout; do not create a nested Git repository or another editable master.

This is a faithful working-copy import of `L:/cars-app`, including uncommitted UI work. The original remains preserved as reference; shared App template improvements belong here. No approved App release is selected in `templates.lock.json`; default client trios remain unchanged. Dealer-generator, mounted routing and publishing integration follow adaptation and QA.

The current Cars24 identity, captured inventory, finance/inspection claims and reference assets are retained for local comparison. Replace them with appropriate dealer or neutral content before client release. Do not present simulated login, bookings, payments or finance as completed transactions. Historical parity/capture scripts and ledgers are provenance, not an active queue.

Use Node 22.20+ on the 22 line and the retained npm lockfile. Verify 320px, 390px and desktop layouts plus affected interactions. Inspect branch, HEAD, staged/unstaged/untracked files and listeners before writing. Preserve unrelated work and never bypass an active Git lock. Follow Cars scoped commit/push rules when its index is available and main drift resolved.

- Preserve Next.js App Router, React, TypeScript and StyleX as the primary stack.
- Do not add Tailwind, styled-components or a parallel CSS framework.
- Keep the product single-dealer and configuration-driven; never introduce marketplace sellers by default.
- Preserve responsive parity across phone, tablet and desktop.
- Use original Drive24/client assets. Do not import third-party trademarks or proprietary app assets.
- Run `npm run check` before claiming completion.
- Do not delete inventory fixtures, screenshots, Git history or unrelated user files.
- Future Capacitor/React Native work must share domain and API layers rather than coupling native code to the DOM.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
