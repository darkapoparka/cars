# Mobile showroom final pass

Historical evidence preserved on 9 October 2026. This report and its screenshots
describe the frontend pass before PRO integration and the owner's subsequent PDP
restoration and refinements. The results apply to that snapshot. See the
[current integration report](../PRO-INTEGRATION-2026-10-09.md) for the latest
implementation and checks.

Audited 8–9 October 2026 in the existing Cars Mobile master. Implementation and local verification are complete. This is a source and local preview pass, not publisher integration, hosted acceptance or a template release.

## Scope and approach

- Source inventory: 180 TypeScript/TSX files, 30 App Router page definitions, approximately 32,900 lines including StyleX declarations. Lint and strict unused-code checks cover the whole source tree. Manual review concentrated on detail screens, inventory/filter/navigation boundaries, reusable controls, locale/persistence, showroom configuration and demo actions.
- Rendered review: phone, tablet and desktop; primary showroom pages in Bulgarian and English, preserved secondary routes in English, and both Chromium and WebKit.
- Baseline: the existing dirty master, including its desktop detail draft and restored hamburger. Existing work was preserved. Before screenshots and focused source backups were captured before these edits.
- References: the original `L:/inspiration/mobile-de-app` detail capture and a live [AutoScout24 BMW X6 listing](https://www.autoscout24.com/offers/bmw-x6-m-sport-bo-hud-standheizung-glasdach-ahk-diesel-black-cat_ma13mo19110-986379c7-73ce-49fd-8a77-c668052f54c0). The useful reference principle was grouping gallery, price and contact clearly. The template keeps its own visual language and supplied data.

## Findings and implemented improvements

| Priority | Finding | Result |
| --- | --- | --- |
| High | Detail screens inferred a net price using German VAT, assigned a price appraisal to all vehicles, and supplied one owner when unknown. | Render only supplied price notes and explicit appraisals. Omit unknown owner counts. Captured appraisals belong to the sample records; added illustrative stock receives no invented appraisal or tax treatment. This also applies to preserved listing cards. |
| High | Vehicle localization replaced supplied descriptions, variants and images when an ID matched a reference fixture. | Sample records are explicitly marked. Reference substitutions apply only to those records; dealer copy and photos remain intact, including when IDs are reused. |
| High | Finance entry and calculator used different starting assumptions and showed different monthly amounts. | One shared set of illustrative defaults and the existing amortization function now drive both values. The entry says “Estimate.” Captured leasing terms remain separate from the loan estimate. |
| Medium | Phone price had weaker hierarchy than the title; title clipping and hidden measurement probes made the summary brittle. | Stronger 24px price, complete wrapping 20px title, conventional responsive layout, single-line variant pills and 48px primary actions. Removed title/rating probe elements, measurement state and their layout observer. |
| Medium | Desktop repeated the overview above and below the gallery, pushing the main photo down. Price/contact and title had inconsistent typography. | Gallery starts sooner; title and sticky price/contact panel share the first row. Facts remain in the Details section. Desktop uses the showroom UI typeface and a consistent spacing rhythm. |
| Medium | Phone specifications had oversized orange icons and dense, noisy table presentation. Preview rows included less useful reference metadata. | Smaller muted icons, quieter separators and a short preview of vehicle condition, body, capacity, seats, colour and interior. Complete captured specifications remain accessible. |
| Medium | At 320px, the full technical-data dialog used a narrow inset panel that reduced values to a column of words. | A phone-width bottom sheet with a clear close control and scrollable content; a bounded 720px dialog on desktop. Escape and return focus are verified. |
| Low | Showroom features maintained separate mobile and desktop render trees. | One semantic responsive list, one column on phones and two on desktop; quieter special-feature tags. |
| Low | Contact, Login and the empty comparison screen exposed duplicate top-level headings. | Introductory and empty-state headings now use level two; the page title remains the single top-level heading. Appearance is preserved. |
| Low | Architecture QA still expected the former desktop contact dock. | The existing check now verifies the sticky price/enquiry panel and its containment. Added `qa:final-pass` for routes, responsive detail states, specification focus, coherent estimates, truthful missing data and real search persistence. |

## Review decisions

The current Home and Services composition is coherent. Their card hierarchy, horizontal filters, wide selected underline and navigation were retained rather than redesigned. Matched captures are included to make that preservation reviewable. The desktop menu restoration and previous filter/range work were preserved.

The domain/storage separation is useful and already has substantial coverage. Large StyleX-heavy screens are not, by themselves, a reason to introduce new configuration engines or split every declaration. This pass adds no dependency, framework, service or dealer generator. It removes measurement and duplicate markup where ordinary layout solves the problem.

## Verification

| Check | Result |
| --- | --- |
| Node runtime | 22.20.0 |
| Whole-source ESLint | Passed |
| TypeScript, including `noUnusedLocals` and `noUnusedParameters` | Passed |
| Domain/localization/persistence tests | 155 passed; three additional regressions cover shared finance assumptions, sample-only appraisals and preservation of dealer content |
| Production build | Passed; 124 generated pages. The existing Windows wrapper used physical `.next-review-local` because `.next-review` is a junction. |
| Development route sweep | 144 rendered states and 12 interaction checks, Chromium/WebKit; no runtime errors or application submissions |
| Final production route sweep | 168 rendered states and 12 focused flow checks passed, Chromium/WebKit; one top-level heading on every checked page, no runtime errors or application submissions |
| Production architecture/storage/keyboard suite | 832 checks passed, Chromium/WebKit; no runtime errors |
| Dependency audit, production dependencies | 0 vulnerabilities |
| Dependency audit, development toolchain | Seven high entries from one upstream advisory; see below |

Primary route coverage includes inventory, all/import/sell/financing/parts Services, Contact, Saved cars, Settings and vehicle detail at 320, 390 and 1440px in both languages and browser engines. The focused PDP checks also include 1024px, all Details/Features/Photos tabs, the full technical sheet and financing dialog. All 30 page definitions are represented in the route sweep; dynamic routes use a valid sample vehicle. Geometry checks reject horizontal overflow and broken loaded images. They supplement visual review and do not constitute visual approval by the owner.

The architecture suite also covers intermediate desktop widths, menu keyboard dismissal, filter and inventory restoration, gallery navigation, contact drafts, and malformed/denied/full storage. An earlier run against the changing development server encountered hot-reload/navigation interruptions; those are not counted as a passing architecture result. Production verification used a temporary local preview at `http://127.0.0.1:6493`, which was stopped after the checks. The user's development server remains on 6474.

The final source-hash check verified all 180 TypeScript/TSX files remained unchanged during the final production suites. [checks.json](checks.json) records the result counts and paths to the full reports in Cars `runtime/`.

## Matched visual evidence

English, same vehicle and selected photo (3/16), same viewport and top-of-page position:

Sizes below are the requested CSS viewports. The browser's saved JPEG dimensions differ; every matched pair has identical image dimensions, recorded in [screenshots.json](screenshots.json). These are direct browser captures.

| View | Before | After |
| --- | --- | --- |
| Detail 390 × 844 | [Before](pdp-before-390.jpg) | [After](pdp-after-390.jpg) |
| Detail 320 × 844 | [Before](pdp-before-320.jpg) | [After](pdp-after-320.jpg) |
| Detail 1440 × 900 | [Before](pdp-before-1440.jpg) | [After](pdp-after-1440.jpg) |
| Long vehicle name, 320 × 844 | [Before](long-name-before-320.jpg) | [After](long-name-after-320.jpg) |
| Inventory 390 × 844 | [Before](home-before-390.jpg) | [After](home-after-390.jpg) |
| Inventory 1440 × 900 | [Before](home-before-1440.jpg) | [After](home-after-1440.jpg) |
| Services 390 × 844 | [Before](services-before-390.jpg) | [After](services-after-390.jpg) |
| Services 1440 × 900 | [Before](services-before-1440.jpg) | [After](services-after-1440.jpg) |

[Full technical sheet at 320px](specifications-after-320.jpg) is additional after evidence, without a saved matched before capture.

[Desktop features and persistent contact panel](features-after-1440.jpg) shows the responsive feature list in context.

## Remaining follow-up

1. **Toolchain advisory:** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) affects `braces <=3.0.3`; deeply nested glob input can exhaust the stack. The audit's seven high entries are the same issue propagated through development dependencies including micromatch/fast-glob, StyleX tooling and Next ESLint tooling. The advisory has no patched release. Keep the lockfile and follow the upstream fix; the audit's suggested incompatible downgrade is not a suitable repair. This pass cannot claim a clean full dependency audit.
2. **Dealer readiness:** some sample photos still contain donor branding, and secondary reference screens retain captured dealer facts. Before dealer use, replace assets and stock/contact facts through the established Cars workflow and run the publisher/release checks. The sample marker must not be used on real dealer stock. No release-lock or dealer variant change was made here.
3. **Optional later architecture work:** persisted English preference is applied after the Bulgarian server document hydrates. A fresh full navigation can briefly show Bulgarian. Server-aware locale rendering would address that; it is a separate rendering change, not a reason to destabilize this final visual pass.

Keep the saved reference, backups and evidence until review. No recovery data, native emulator data or inspiration checkout was removed.
