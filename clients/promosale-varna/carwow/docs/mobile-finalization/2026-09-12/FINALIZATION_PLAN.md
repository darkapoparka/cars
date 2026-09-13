# Mobile-first finalization plan

Status: planned, not implemented by the audit. Work on the current dirty working tree without discarding the owner's changes. The objective is a dependable, coherent mobile storefront with simple ownership boundaries. Desktop redesign begins only after mobile acceptance; desktop regression checks remain mandatory for shared changes.

## Operating rules

- Keep the current home, compact inventory, vehicle drawer, and two-step lead-flow direction. No replacement UI framework, state library, schema-driven form engine, or blanket CSS rewrite.
- Change one responsibility at a time. Put repeated business facts, route policy, domain limits, assets, and design tokens in one authoritative place; derive catalog-dependent values. Keep legitimate local geometry and ordinary UI markup readable.
- Record before/after screenshots and acceptance results per batch. Do not commit other people's work, deploy, send live leads, migrate a database, or bless new screenshot baselines without the corresponding authorization and review.

## Batch 0 — establish a trustworthy baseline

**Files:** existing Playwright tests/config, the new audit reports, and current modified-file inventory.
[ ] Agree that mobile inventory cards remain uncluttered and saving/comparing happens through available controls. Repair the two stale action-button tests and three heading-selector failures to express that contract. Keep semantics tested; do not merely remove assertions.
[ ] Fix the seven ESLint errors with narrow edits and format only reviewed files. Separate formatting, ESLint, Svelte, unit, and browser outputs so one failure does not hide another. Add explicit mobile device profiles instead of relying only on viewport dimensions with a desktop user agent.
[ ] Preserve the original screenshot evidence. Add deterministic test fixtures for empty inventory, long labels, a multi-photo vehicle, unavailable saved vehicles, and mocked API failures/successes.
**Exit:** meaningful existing tests are green, new failing regression cases reproduce V01/V02/C01/C02, and no app behavior has been changed just to accommodate obsolete selectors.

## Batch 1 — fix immediately visible shared defects

**Files:** `BlogIndexPage.svelte`, `MobileBottomDock.svelte`, `MobileDrawer.svelte`, `MobileLeadContactCard.svelte`, and the relevant token owners.
[ ] Give mobile blog active/unselected/hover/focus states valid semantic colors; do not depend on a desktop-only variable. Preserve the desktop yellow hero and white article cards.
[ ] Remove the menu's unconstrained-height override. Keep its close/header area in view and let its body scroll within the visual viewport. One owner should calculate safe-area and dock spacing.
[ ] Correct small muted contact copy and rating semantics; keep clear contrast and keyboard focus. Avoid adding another end-of-file override layer.
**Exit:** selected blog labels are visible at 320/390/430px; menu close and all items remain reachable at 568×320 and portrait sizes; Escape, focus restoration, background inertness, and scroll restoration pass.

## Batch 2 — stabilize route shells and first render

**Files:** `PublicStorefrontRoute.svelte`, root/shared shells, `is-mobile.svelte.ts`, contact/favorites/compare/financing/sell-request wrappers, and the mobile detail first-render owner.
[ ] Define a consistent initial viewport/rendering contract. Render useful core content and actions on the server, then enhance drawers and client storage. Avoid hydration-only blank pages and two complete interactive copies hidden by CSS.
[ ] Give each public route exactly one real main landmark and one unique skip-link target. Remove duplicate financing/sell-request IDs and add missing article/FAQ/reviews main regions at the correct owner.
[ ] Resolve import intent and its title/description from route data on the server. Decide deliberate behavior for declared sell aliases, `/inventory/map`, the stale Plovdiv slug, and experimental home routes; retain redirects where existing URLs need them.
**Exit:** sampled JavaScript-disabled pages show useful content; direct/internal navigation, refresh, browser back, phone/desktop UA, and 991/992px transitions do not produce a blank or double page. Semantic landmark assertions pass for all canonical routes.

## Batch 3 — make content/configuration and garage state reusable

**Files:** `daynight-site.ts`, site/dealer types, public inventory loaders, money/contact URL helpers, `garage.svelte.ts`, and its consumers/tests.
[ ] Consolidate approved dealer identity, E.164/display phone, email, contact links, map URL, logo variants, locale/currency, and business copy. Derive inventory counts from loaded data. Stop repeatedly assuming a Bulgarian local number in presentation components.
[ ] Resolve saved/compared identifiers against the current catalog, not only static seed vehicles. Define unavailable/sold behavior and keep the comparison cap in one named constant.
[ ] Reuse small vehicle display data/formatters across inventory, favorites, and comparison without coupling their different layouts. Keep data numeric until display formatting where feasible; do not introduce unverified conversion or financing rules.
**Exit:** a new non-seed fixture can be saved/compared, survives reload, and has an explicit removal/unavailable state. A dealer-fixture swap changes identity without edits scattered across components. The current three-car limit and URL/back behavior remain intact.

## Batch 4 — finish sell/import as reliable tasks

**Files:** mobile sell/import pages, `MobileFullSheet`, shared lead presentation, submit clients, and minimal shared validation/serialization helpers.
[ ] Align the sell make/model rule with its error text; validate reasonable field shapes/bounds without inventing business eligibility. Keep VIN/link entry distinct from promises of automated decoding.
[ ] Extract only the duplicated visual step frame, field treatment, summary, and action/footer styles. Keep each flow's payload and state owner separate. Move import banner words out of the image.
[ ] Add localized field/service/network errors, associated error descriptions, progress/busy behavior, abort/timeout handling, retry with preserved input, and explicit success only after a valid response. Add compare-limit feedback and proper PDP tab keyboard behavior in the same behavior-focused stage if not completed earlier.
**Exit:** empty/invalid, back/edit, close/reopen, pending, duplicate click, network failure, 400/429/503, malformed response, and valid success are tested with intercepted responses. Confirm physical keyboard and safe-area behavior on real phones separately; a resized desktop browser is not that test. A successful mock is never recorded as delivered mail/CRM data.

## Batch 5 — finish the mobile visual families

**Files:** mobile home and inventory composition, detail/favorites/compare presentation, mobile contact/services/about/financing, and article/blog/calculator/FAQ/terms/team/review/profile pages.
[ ] Lock a small visual contract for gutters, section spacing, heading/body hierarchy, card radii, fields, action targets, selected/focus states, and dock clearance. Preserve intentional dark browsing/lead headers and lighter reading pages rather than forcing unrelated pages to look identical.
[ ] Home/inventory: retain useful quick pills and the compact card direction, make rails deliberately scrollable, verify long labels and empty results, and extract sections only along real responsibilities. Do not add redundant filters or restore removed card buttons.
[ ] Detail/garage: finish multi-photo states, short-height drawer content, accessible tabs, one/two/three comparison alignment, and unavailable-car messaging. Keep native share/telephone/Viber hand-offs honest and testable.
[ ] Content pages: fix blog controls and reading typography; reduce inherited oversized gaps on dealer/team profiles; bring the calculator result closer to its inputs and compact budget links; retain sample/demo disclosures and verified-only business statements.
**Exit:** every canonical page family and important state has reviewed 320/390/430px screenshots; additional 360/375/414px and landscape spot checks pass. Text enlargement and long Bulgarian content do not clip actions. Any intentional horizontal rail is accessible without document-wide overflow.

## Batch 6 — remove measured weight and proven duplication

**Files:** logo assets/configuration, root/shared style imports, route assets, large component owners, and proven unused module families.
[ ] Replace the oversized logo with appropriately sized optimized variants while preserving quality. Stop phone routes from fetching desktop-only hero/chrome assets where they are not needed. Verify request initiators rather than guessing from source references.
[ ] Fold repeated overrides into their correct owners and split large components by behavior/content boundaries. Review the unused-module candidate list, then remove only demonstrated dead families with their generation/runtime references checked. Do not perform a blanket deletion of starter files based on the AST report alone.
[ ] Rerun the production weight audit with phone and desktop user agents. Inspect compressed transfer and actual performance traces separately; establish budgets without relabeling decoded response totals as Web Vitals.
**Exit:** the existing image/page budgets pass or any changed budget has an explicit product reason. Mobile UI remains unchanged except for approved improvements; bundle/request evidence supports each optimization. No new framework or global stylesheet is introduced to conceal unresolved ownership.

## Batch 7 — release acceptance, then desktop

[ ] Run formatting, ESLint, Svelte/type checks, all unit/browser tests, the production build, secret-boundary and asset checks. Exercise canonical routes in Chromium, WebKit, and Firefox against the production build, not only the Vite dev server.
[ ] Review visual changes explicitly before accepting new baselines. Test landmarks, keyboard-only navigation, focus visibility, dialogs, meaningful headings, contrast, and error associations; manually review axe incomplete results rather than treating zero reported violations as certification.
[ ] On a physical iPhone and Android phone, verify keyboard opening/closing, address-bar collapse, orientation, scrolling, safe areas, touch targets, focus zoom, native share, and telephone/Viber hand-offs. Run VoiceOver/TalkBack checks on core journeys.
[ ] In an authorized non-production integration environment, confirm lead/import storage, staff notifications, failure/retry behavior, and unavailable providers. Audit authenticated admin workflows and authorization boundaries separately. Do not use real customer data for tests or interpret mocked response IDs as delivery evidence.
[ ] Confirm final dealer identity/content, canonical redirects, metadata, sitemap exposure, map fallback, and explicit handling of experimental/demo routes. Measure deployed mobile performance under realistic conditions; local decoded weights are only a regression signal.
**Exit:** no unresolved P1 findings, no unexplained failing checks, approved screenshots and copy, completed real-device/integration gates, and a documented owner for any accepted P2 deferral. Only then begin a dedicated desktop finalization pass.

## Suggested first implementation slice

Start with the blog selected state and the short-landscape menu regression. They are small, directly reproduced, and have clear file ownership. Pair those fixes with focused tests; do not mix them with a broad homepage redesign, dealer data migration, or desktop hero restructuring. Then address the main/SSR contract before extracting large page sections.

## Completion record

Each batch should record: files changed; user-visible behavior; before/after screenshots; executed checks with actual results; unresolved limitations; and whether the mobile acceptance gate passed. Keep the checkbox list above open until those artifacts exist. The audit itself has not completed these implementation batches.
