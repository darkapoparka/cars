# PRO architecture and reuse review

> Historical standalone review. The current Cars result and replacement evidence paths are in [the 9 October reconciliation report](pro-integration-2026-10-09/README.md). The C: review paths below describe the original handoff, not the maintained master.

## Review boundary

The review started from the active Cars `templates/app` source, not an old frontend from GitHub. The source snapshot is commit `fa78a47d770fe27b7004e4a201eaac89672ff9d6`, based on standalone main `e2504af29c9e6e86911f3a1e5b61e1b4e1894674`. The snapshot and the refactor are separate commits on `PRO` so that their visual and code differences can be inspected independently.

Work happened in an isolated checkout outside the active Cars repository. The canonical subtree, Cars index/branch, concurrent Codex work, release locks and deployments were not changed. Generated evidence remains under ignored `runtime/`; it is not production source. Historical one-off scripts and obsolete narratives were retained outside the checkout or in the baseline/canonical history rather than copied into the active workflow.

## Changes

**Public configuration and stock contracts.** Dealer identity, enabled/default locales, contact formats, asset paths, stock values and unique slugs are validated before development and production builds. Strict objects reject unexpected private fields. Vehicle and dealer types are inferred from that schema, with type-only exports keeping the validator out of client runtime imports. Local public image existence is checked, and only explicitly configured HTTPS image origins are allowed by Next Image.

**Inventory behavior.** Shared predicates distinguish published price, mileage and monthly estimates from absent values. Unknown prices are not bargains, discounts or free finance; unknown mileage is not zero kilometres. The same rules are used in filtering and card/detail presentation. Sorting is stable and non-mutating, puts unknown values last in either direction and uses optional actual `listedAt` dates for Recently added instead of manufacturing recency from model years.

**Client portability.** Numeric controls preserve the reference bounds while expanding for actual dealer stock, including cheap cars, classics, newer model years, high mileage, larger engines and additional cylinders. Make/model matching normalizes incidental case/whitespace. Unit examples use independent fixtures rather than assuming a future client stocks a Suzuki or even has stock. A separate dealer build exercises a single locale and a non-root mount with deliberately awkward inventory.

**Component and data boundaries.** Filter checkbox presentation, make/model selection and unchanged StyleX declarations have separate modules. The inventory page consumes a single sort catalogue instead of embedding duplicate comparators. Seed vehicles are separated from the catalogue adapter; slug membership uses a Set instead of repeated linear scans. Server-only locale/detail helpers are marked explicitly and their client import graphs are checked. Existing modal, history, navigation and storage boundaries were retained rather than replaced with speculative frameworks.

**Cleanup.** Removed dead inventory enquiry state, misleading login identifiers, unused catalogue exports, duplicate Chrome DevTools screenshot transport, obsolete generated TypeScript paths and two authoring-prompt documents from public assets. Enquiry inputs/headings use per-instance accessible IDs. The reference comparison stays template-only. Current README, template contract and maintenance instructions replace contradictory dated work queues. No new styling system, backend, auth simulation, checkout or generic form engine was introduced.

**Build and integration.** Node 22.20+ on 22.x is the supported toolchain. The required StyleX/Babel/webpack integration remains. Next and its ESLint configuration are pinned to 16.3.8. Playwright supplies maintained browser journeys and visual comparisons. The CI quality workflow includes PRO, production dependency auditing and browser checks. Independent mounted sites can set `CARS_PREVIEW_SWITCHER=0`; the default preserves the Cars host's existing `/preview-switcher.js` integration.

## Validation evidence

The final local gate uses the actual production build, not just a development server. Captures use Chrome through Playwright, one worker, deterministic viewport/locale settings and no retries.

| Gate | Result |
| --- | --- |
| Lint and TypeScript | Passed |
| Unit/domain/architecture regression tests | 121 passed, versus 75 in the baseline |
| Production template build | Passed |
| Before/after visual comparisons | 72 passed |
| Main template browser journeys | 36 passed |
| Main template production route checks | 50 passed |
| Mounted EN-only dealer build | Passed |
| Mounted dealer unit/domain/architecture tests | 121 passed |
| Mounted dealer browser journeys | 28 passed |
| Mounted dealer production route checks | 25 passed |
| Custom dealer edge-case assertions | Passed |
| Production-only npm audit | 0 known vulnerabilities at review time |
| Full npm audit including development tools | 9 high dependency-tree entries from one unpatched braces advisory; see below |

The 72 visual cases cover home, alternative home, inventory, alternative inventory, Sell, Finance, Services and the vehicle detail page in both EN/BG at widths 320, 390, 1100 and 1440, plus open Brand/Budget filters at those widths. The original baseline images were preserved. The final comparisons use Playwright's normal perceptual colour threshold 0.2 and zero allowed differing pixels above that threshold, with no masked page regions.

These are **not byte-identical image claims**. A zero-colour-tolerance diagnostic after the framework security patch detected small differences confined to two vehicle photographs in the inspected `/2` inventory case: maximum channel delta 8/255, average absolute channel delta 0.031 across the screenshot, with no pixels changing outside their photo bounds. The visible layout and controls matched, and the normal perceptual suite passed. Exact source checks also confirm unchanged global styles/tokens, unchanged extracted filter-style declarations and no changed public images/fonts.

Journey coverage includes responsive navigation, empty results, URL sorting across reload, filter dismissal/reopening, exact filtered-list return via Back, persisted saved cars and the actual Viewing -> Request a viewing -> editable enquiry-draft flow. Console errors and uncaught exceptions fail the tests. The mounted dealer proof additionally checks honest missing values, cheap-stock filtering, unknown-last sorting, disabled-locale redirects inside the mount, missing-stock 404s and rejected POST submissions.

## Security follow-up retained explicitly

The production Next.js advisories were addressed with the 16.3.8 patch; see the [official release](https://github.com/vercel/next.js/releases/tag/v16.3.8) and [affected-version advisory](https://github.com/advisories/GHSA-3w37-wq28-93x7). The recorded `npm audit --omit=dev --audit-level=high` result is clean.

The full dependency audit is **not clean**: [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) affects `braces <=3.0.3` with no published patched version listed at review time. It is reached through development-only lint, StyleX glob and cleanup tooling, resulting in nine inherited audit entries. npm's proposed forced downgrades would change the Next/StyleX toolchain and do not provide a safe in-place solution for all paths. No advisory was suppressed, no nonexistent patched version was pinned and no unaudited fork was installed. Keep build/glob inputs trusted, recheck the full audit before a release and update when a maintained compatible fix becomes available.

## Codex reconciliation

Use the diff **from `fa78a47d770fe27b7004e4a201eaac89672ff9d6` to the final PRO head** for the architectural work. The earlier main-to-snapshot diff is the user's already-existing local polishing and should not be blindly reapplied over newer Codex edits.

Read current Cars coordination and parent instructions first. Reconcile the application changes into `L:\CODEX\cars\templates\app` with conflict-aware review. Do not merge this standalone repository root into the Cars root, switch/reset the active workspace, overwrite newer source or import standalone `.github` workflow files into the app subtree. A refactor-only patch excluding publishing workflows is provided locally as `C:\Users\radev\cars-template-app-PRO.refactor.patch`; run an apply/check or review it before applying anything.

The review checkout is `C:\Users\radev\cars-template-app-PRO`. Its ignored `runtime\pro-review` directory contains source/build logs, browser JSON reports, the mounted dealer proof, image-difference diagnostics and labelled comparison images. Compare both normal and `/2` journeys, retain newer frontend edits, then repeat checks against the reconciled result. No merge, deployment or existing-client refresh was performed by this review.

## Remaining acceptance boundaries

Chromium emulation does not prove physical iOS/Safari keyboard, touch, accessibility or every possible viewport/state. Do a real-device acceptance pass and review any known desktop design concerns separately from this no-restyle refactor. Client identity/stock validation does not approve service claims, finance figures, campaign copy or image permissions. Enquiries remain honest drafts/external contact actions; a real submission, CRM, booking or payment integration requires its own delivery and failure-path tests. Existing captured demo catalogues remain available in template mode; this is not a fully live inventory-service architecture or a measured performance benchmark.
