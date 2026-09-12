# Mobile finalization plan

Status: original audited plan; implementation and verification are now tracked in the [implementation record](../../implementation/2026-09-12-mobile/README.md). Start from the audited dirty working tree, not the last commit or an earlier screenshot. Work in `J:\cars\templates\auto-best`; keep preview at port 6461. Preserve existing uncommitted changes. Do not run build and dev against the same generated output concurrently. No commit, push, deployment, stock promotion, or backend integration is implied by this plan.

## Definition of finished

Mobile is finished when its approved route/state screenshots are consistent; the release gate is green with zero Svelte errors/warnings; known bugs below have regression tests; every business fact/filter rule has one owner; assets have appropriate responsive exports; and real-device interaction checks pass. A desktop screenshot not overflowing is not desktop approval. A successful production build is not mobile approval.

## Phase 1 — Restore a trustworthy baseline

**M01 / C01 — Asset and test gates.** Owner: `scripts/check-assets.mjs`, asset manifests/provenance, generated static directory. Inventory approved assets versus scratch output, remove only confirmed obsolete files, and replace the fragile global file-total check with real contracts. Acceptance: no `.b64` scratch files under served assets; every referenced local asset exists; no missing/corrupt asset; no unexplained orphan; the gate passes without simply changing one magic count.

**M02 / C06/C09 — Clean warnings and align the hierarchy test.** Owner: `BodyTypes.svelte`, `home-hierarchy-smoke.mjs`, package validation scripts. Remove unused selectors, fix the hidden-label utility, assert the approved three-category-plus-expansion-control design, and exercise expansion/collapse. Include the hierarchy test in the normal release gate. Acceptance: zero Svelte warnings; one accessible expansion label; visible counts are derived from configuration/data; a deliberate regression fails the relevant test.

## Phase 2 — Fix defects before redesigning

**M03 / C02 — Shared overlay lifecycle.** Owner: `VehicleQuickSearch.svelte`, `lib/ui/overlay.ts`, existing dialog owners. Reuse the existing utilities, not a new modal framework. Acceptance: background scroll offset does not change while a modal is open; close/Escape/back/navigation release correctly; nested pickers return to their parent; focus returns to a live trigger; the action footer remains reachable in short viewports and above the keyboard.

**M04 / C03 — Required-value normalization.** Owner: `VehicleEnquiry.svelte`, a small enquiry validation helper only if reused. Acceptance: spaces-only make/model cannot advance Sell; error text identifies the field; valid import-link flows retain their intended optional fields; copy/share summaries cannot discard a supposedly required value silently. Existing six-photo/type/size/object-URL tests stay green.

**M05 / C04 — Single budget/filter contract.** Owner: `data/listing.ts`, homepage presets and their consumers. Define each budget interval once and compute both count and URL from it. Acceptance: fixtures immediately below, exactly at, and above EUR 60,000/70,000 agree between tile count and listing results; all other active query parameters survive relevant filter changes; no production fixture is edited to hide the mismatch.

**M06 / C05 — Responsive artwork isolation.** Owner: `BodyTypes.svelte` and artwork manifest. Acceptance: a 320px tile does not crop its intended label or vehicle; desktop renders one artwork representation, not two; expansion remains usable at 320/390/430px; 767/768 and 991/992 breakpoint transitions do not leak markup or create huge card heights.

**M07 / C07 — Readable secondary text.** Owner: muted-text tokens, listing/PDP/calculator selectors. Acceptance: previously failing normal-text color pairs meet 4.5:1 or better; image text is reviewed separately; keyboard focus remains visible; automated accessibility is run only after verifying the intended dialog is actually open.

## Phase 3 — Remove the expensive loading work

**M08 / C08 — Responsive image exports and loading policy.** Owner: approved artwork files, `FeatureArtwork`, `ArtworkRegion`, vehicle-card priority policy. Export responsive WebP/AVIF where appropriate, retain alpha/baked-lettering quality, provide dimensions and width selection, and defer genuinely below-fold assets. Keep approved art direction. Acceptance: those six multi-megabyte service/menu PNG originals no longer download on initial mobile load; offscreen service/media assets are deferred; screenshots show no new blur/crop; repeat the cache-disabled image-byte measurement and publish before/after figures. Proposed budget to validate: initial mobile imagery under 1.5 MB, not the measured 12.2 MB. Treat this as an engineering target, not a claimed current achievement.

## Phase 4 — Consolidate ownership while finalizing mobile

**M09 — Small, targeted code cleanup.** Move business facts to `brand`, service/journey definitions, inventory records, and typed presets. Make the homepage/listing search share parsing, labels, range rules, and small picker pieces while keeping their intentional layouts separate. Consolidate global versus scoped CSS ownership one component at a time. Acceptance: changing a phone/address, budget, supported year, service title, or artwork source requires changing its owner only; URLs/counts/labels remain consistent; no generic form engine, new global store, or framework is added. Do not extract a single-use wrapper merely to reduce a line count.

**M10 — Finalize PDP first among visual pages.** Use the order and CTA hierarchy in the visual audit. Resolve financing banner versus inline calculator presentation; preserve the interactive calculator and truthful disclaimer where used. Keep contact details/prices live, not baked into images. Either preserve selected finance values in an enquiry or clearly keep the calculator as an illustration. Acceptance: one primary action hierarchy, one meaningful location block, consistent spacing, legible specs, selected vehicle preserved, filtered return preserved, and all eight sample PDPs checked.

**M11 — Finalize shared Sell/Import entry and drawers.** Use matched control rhythm/padding, clear no-link import path, consistent call placement and one overlay contract. Acceptance: both entry cards look intentional at 320/390/430px without artificial large empty blocks; dark drawer/field/footer surfaces are consistent; no duplicate explanatory copy; invalid/review/reopen states remain correct.

**M12 — Finalize homepage, listing, then supporting pages.** Agree the shared type/brand expansion treatment, trim repeated lower-page service navigation, and choose a compact footer policy. Keep the useful compact listing row and horizontal card rails. Polish Contact/About and Blog/articles against the same typography/gutter/action rules, not a new design for each route. Acceptance: approved captures of every route family and its key states; no duplicate artwork/text; no clipped current content; existing query/context/navigation behavior unchanged.

## Phase 5 — Prove sign-off and hand over desktop

**M13 — Regression and real-device pass.** Run all gates, all canonical pages, query/empty/invalid states, menu/search/enquiry/nested filters, native focus and reduced-motion behavior. Test real iPhone Safari and Android Chrome, keyboard-open landscape, upload picker, clipboard denial, native sharing cancellation, 200% text, image failure, and a slow connection. Confirm visible/accessible names of image-based tiles. Acceptance: no unresolved P1 finding; any remaining lower-priority issue has an explicit decision and owner; desktop shared-component guardrails remain green.

**M14 — Dependency/production-readiness review.** Resolve or explicitly assess the low-severity dependency advisory with a compatible change, never a forced historic downgrade. Verify actual production headers and production performance separately from local dev. Keep noindex/sample gates until the business identity, canonical domain, stock, and delivery behavior are approved. Acceptance: documented dependency decision, no surprise external submissions, verified production configuration. A live lead backend remains a separate scope decision.

## Implementation discipline

Use small reviewable changes: one defect or one component's styling owner per change, with before/after captures and relevant tests. Do not mix a wholesale CSS move with asset replacement and form behavior changes. Do not weaken tests merely to make them green. Update the C/M finding status only after its acceptance check passes; retain the original audit as the baseline.

Suggested first work package: M01–M07, with M08 immediately after. Then M09–M12 finalize the mobile presentation, and M13/M14 establish readiness. Start desktop design only after this mobile contract is approved; see [DESKTOP-LATER.md](DESKTOP-LATER.md).
