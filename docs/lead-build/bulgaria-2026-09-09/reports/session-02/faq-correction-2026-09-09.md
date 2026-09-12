# Kapitol FAQ source correction — 2026-09-09

State: in-progress. This is a scoped source repair, not completion of Kapitol or the fifteen-app assignment.

Resumed remote branch `codex/astra-bg-02` at `9b21e175b2d435dd71a9a53c0d58aaeb4355ed0c`; root tree `3870a685549ec07a886a114b1fcc9ee885bc4fa6`. The previous chat claim that only four reports remained was incorrect: the branch retained all fifteen application source trees. The original source base remains `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`.

## Actual change

Updated `clients/kapitol-varna/carwow/src/lib/data/daynight-faq.ts`. Its preceding blob was `15fb81f0f298d09e3648b48abd4173c634321171`. The twelve questions previously reused three generic answers, including first-person completion/finance/trade-in language unrelated to the question. Each now has a distinct answer; contact details, hours caveat and observation date are imported from the same `dealer-stock.json` consumed by the catalogue. Incoming and consignment caveats are retained. Missing service evidence is not presented as evidence of service absence.

The three groups, twelve item IDs, question labels, container/heading/toggle classes and `/faq` route are retained. No route, accordion component, CSS, asset, stock price or template was replaced. No new image or photo integration is claimed. Source SHA-256: `911aff9c3952ee1711822869b8ab44b6a904d5526815b9207b36d5d14d70d46b`.

Added a repeatable isolated checker at `clients/kapitol-varna/scripts/check-carwow-faq.mjs`. After installing Carwow's retained dependencies, run `node clients/kapitol-varna/scripts/check-carwow-faq.mjs` from the repository root. It reads the real local source and dealer JSON; it does not emit application output or use the network.

## Executed evidence

An isolated cloud fixture at `/mnt/data/kapitol-faq-check` contained the exact updated FAQ source and the relevant public fields transcribed from remote `dealer-stock.json` blob `c806e7875e1296d49d95b8c140373595ea6675e5`: name, shortName, city, address, phone, phoneE164, hours and observedAt. It did not contain the full Carwow app or full inventory JSON.

Executed: `NODE_PATH=/opt/nvm/versions/node/v22.16.0/lib/node_modules node /mnt/data/kapitol-faq-check/scripts/check-carwow-faq.mjs`. Exit 0; Node v22.16.0; TypeScript 5.8.3. Strict FAQ-module typecheck produced zero diagnostics. Module execution passed checks for three retained groups, twelve unique item IDs, original CSS hooks, twelve distinct answers, source-driven contact/date fields, incoming/consignment distinctions and absence of the inherited transaction assurances.

This is not a Carwow Node 24 framework check, dependency-install result, full SvelteKit typecheck/build or browser/visual pass. None of those ran. No Windows command, file write, process, worktree or server was used in this correction. No deployment or dealer contact occurred. Existing client and variant QA flags remain unchanged and false.

## Remaining work and coordinator

All five accounts retain their three source apps and remain in-progress. Real vehicle-photo/gallery integration, the rest of the supporting-page sweep and complete framework/browser verification remain unfinished. This patch fixes only the native Kapitol Carwow FAQ, not duplicated content elsewhere. Retain `REVIEW.md` and previous verification history; do not treat previous source checks as testing this revised FAQ or as full-app acceptance.

Coordinator: fetch the assigned branch and review Kapitol first; no dealer is yet classified finished. The shared index and launchers are unchanged. The implementation commits and fifteen application-folder paths remain listed in `STATUS.md`; this note supersedes only the native Kapitol FAQ's previous open source-repair item.
