# Auto Best architecture and code-quality pass

Date: 7 October 2026. Tested application baseline: `4a94d6f47d682b2dafd49870b528c92a8688c644` in `darkapoparka/cars`, `templates/auto-best`.

## Scope and preservation

This is a reusable-master code refactor, not a redesign or a client release. All 96 Svelte files retain their rendered markup and styles. All 21 emitted production stylesheets are byte-identical to the baseline. All 200 static assets, fonts, icon/provenance files and the dependency lockfile are unchanged. Only the script blocks of the two enquiry components changed; no layout, card, logo, banner, copy or typography was restyled.

The Cars checkout contains extensive pre-existing work. Validation ran from Git archives under ignored runtime storage, not from a reset, a new branch, a worktree, or the obsolete J: recovery repository. Delivery is scoped to the Auto Best master on main; it does not deploy, promote a template release, change a dealer copy, or touch other template families.

## Implemented changes

| Finding | Resolution |
| --- | --- |
| Photo validation, allocation and cleanup were duplicated in Sell/Import enquiry code. | Shared `src/lib/ui/enquiry-photos.ts` owns the six-photo/10 MiB/type limits, duplicate detection, removal and disposal. Failed allocations roll back only newly created previews, preserving existing drafts. |
| Browser share capability, failure and cancellation branches were duplicated. | Shared `src/lib/ui/enquiry-share.ts` returns explicit outcomes. Native sharing is invoked before yielding, files are never silently omitted, cancellation stays separate from failure, and duplicate share clicks are guarded. It never sends a lead or treats sharing as a delivery receipt. |
| Enquiry scroll restoration duplicated lifecycle logic; one close handler lacked a repeated-close guard. | Both components reuse the existing scroll-offset owner and release it on close/destruction. Repeated restoration is guarded. Existing focus, draft retention, body styles and modal markup remain intact. |
| Demo showcases indexed six stock positions without guarding smaller inventories. | `createDemoWorkflowShowcases` selects only available records. Empty/small client inventories no longer produce undefined vehicle cards; the current seven-record selection/order is unchanged. |
| Counts and mileage created Intl formatters repeatedly during rendering. | A bounded, validated per-locale formatter cache reuses number, mileage and plural formatters. It stores no visitor data or global active-locale state. EN/BG output is tested against the previous formatter options, including numeric edge cases. |
| Shared resource behavior was outside the standard validation gate. | Eight new enquiry-resource tests and the existing 26 overlay checks now run through `check:domain` and therefore `validate`. Domain tests also cover sparse stock and exact formatter/cache behavior. |
| A retired route assertion required zero demo sections despite the approved preview enabling its sample team. | The unchanged baseline was verified to contain one sample section with noindex. The route suite now verifies that every rendered sample section remains non-indexable and has an introductory disclaimer, rather than removing the approved UI. |
| Old ownership guidance pointed contributors toward a recovery repository. | `TEMPLATE.md` now identifies Cars/main as the reusable master and separates shared development from client promotion. |

## Repository cleanup

Removed **252 generated files / 54,367,356 bytes (54.4 MB; 51.8 MiB)** from `docs/audits/2026-09-12-mobile-finalization/evidence/`. These are historical logs, machine reports and browser captures, not runtime assets. Authored audits, active tests, current references, licenses and provenance remain.

The retained historical reports link to an [immutable evidence archive](https://github.com/darkapoparka/cars/tree/4a94d6f47d682b2dafd49870b528c92a8688c644/templates/auto-best/docs/audits/2026-09-12-mobile-finalization/evidence). The four historical audit generators now write to ignored `artifacts/`; the retired evidence directory is ignored, and local `runtime/` is excluded from both Git tracking and Vercel inputs. This reduces the current checked-out tree, not the historical Git object database or browser image payload.

## Verification results

| Check | Result |
| --- | --- |
| Baseline and candidate `npm run validate` on Node 22.20.0 | Passed: architecture, CSS policy, tokens, typography, assets, domain checks, Svelte checking and production build. Candidate: zero Svelte errors and warnings. |
| `npm run test:locales` | 27 tests passed. |
| Enquiry-resource unit tests | 8 tests passed: ordering, deduplication, exact limits, removal/disposal, allocation rollback, synchronous native sharing, unsupported files and cancellation/failure. |
| Existing overlay unit checks | 26 checks passed, now included in standard validation. |
| `enquiry-smoke.mjs` | Passed at 320, 390, 844 and 1440 pixels; photos, review, copy/share, retained drafts, focus return and zero server submissions. |
| `mobile-filter-smoke.mjs` | All four viewport cases passed. |
| `filter-code-smoke.mjs` | Both EN/BG 1440-pixel Chromium cases passed. |
| `route-smoke.mjs` | All 114 named route/responsive cases passed after repairing the stale preview assertion; includes expected 404s and responsive sweeps from 320 to 1920 pixels. |
| Production visual comparison | **42/42 before/after views are pixel-identical**: EN/BG, widths 320/390/1440, Home, listing, detail, Sell/Import pages and their dialogs. |

Visual captures use identical browser settings, decoded local images, reduced motion, explicit scroll/pointer state and a settled software-rendered frame. External provider responses are stubbed identically; no local artwork or page elements are masked. Initial hardware-rendered captures varied even when comparing the unchanged baseline against itself. The corrected same-build control passed 7/7 pixel-identically before the final comparison. A desktop-English group was repeated once after an isolated 37-pixel native-input border antialiasing difference (at most 2/255 per color channel); all seven repeat views matched exactly. Results use the latest completed capture per view, with the original comparison and repeat reports retained. The first enquiry run reached its preview before it was ready; the recorded rerun passed all four cases.

Raw captures, comparison reports and logs remain in ignored runtime/artifact storage, not in committed documentation. The current development listener was not used as a build target or stopped for validation.

## Size and rollout boundaries

No dependency was added or upgraded. The production build still has 37 JavaScript files. Summed emitted JavaScript changed from 945,223 to 945,477 bytes; summed per-file gzip changed from 302,094 to 302,527 bytes. This small +433-byte gzip change is reported rather than claiming a bundle-size reduction. Formatter reuse reduces repeated allocation; no measured page-load speedup is claimed.

The master remains a preview with sample inventory and deliberate manual enquiry handoff. Real dealer identity, record-level inventory evidence, canonical origin, configured lead delivery and device-specific release checks remain client-rollout work. Browser emulation and mocked native sharing are not physical iPhone/Safari or real share-sheet verification. No client backend, outreach, deployment or publication state was changed.
