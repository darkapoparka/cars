# Karento Best native Svelte frontend

The maintained Cars template is now a self-contained Svelte 5 / SvelteKit 3 application. Home 3, Car List 2 and Car Details 3 remain the selected website compositions. All 39 variants use compiled Svelte pages, shared sections and typed content inputs. Production source contains no whole-page HTML injection, captured-page renderer, jQuery, Slick, legacy datepicker or global legacy script runner.

CalendarInput.svelte, Gallery.svelte and PhotoViewer.svelte own date selection, image navigation and modal viewing, including keyboard/phone controls and route disposal. Preview account state is isolated per layout. Swiper, PerfectScrollbar, ApexCharts and noUiSlider remain independent libraries behind lifecycle-owned Svelte actions.

The final approved Contact design is preserved: one white outer container, an inner card only for the form, and the corrected map filling the right column. The address and directions link agree with the map. This owner-requested adjustment was made directly in the native component after the captured-renderer checkpoint.

## Source and preservation

Cars templates/karento-best is the editable master. darkapoparka/cars-template-karento mirrors it for standalone publication. Captured Best was checkpointed before promotion, most recently at Cars commit 4dda98868c448f1735e595628624f5e4178dce86. Original templates/karento source and artwork stay untouched. The standalone mirror's nested original folders are immutable evidence, not application source.

All 607 hash-recorded original files and original asset bytes are protected by contracts. Cars uses the preserved sibling library and 26 hash-locked files under provenance/frozen-best; neither is a runtime dependency. The original untracked instruction file is separately archived under provenance/frozen-library, so preservation checks also work from a clean checkout without staging another owner's original file. Approved styles, Contact portraits and semantic compositions have separate receipts. The earlier recovery-verification.json remains historical evidence for f697401; native-verification.json records this completed frontend promotion. No dealer generator, template-lock release, fleet registration or provider deployment was added.

## Local verification, 7–8 October 2026

| Check | Result |
| --- | --- |
| Strict Svelte checks | 0 errors, 0 warnings |
| Formatting and production build | Passed |
| Unit contracts | 15 passed, including asynchronous disposal and date arithmetic |
| Original preservation | 607 file hashes and original static asset/CSS checks passed |
| Server-rendered routes | 102 compositions/aliases and 9 designed HTTP 404 checks passed |
| Browser journeys | 14 passed |
| Native widgets | Calendar, gallery, viewer and billing passed at 320/390/1440px; no legacy widget requests or jQuery global |
| Page-loading smoke tests | 30 canonical routes passed |
| Responsive visual matrix | 117 page comparisons (39 variants × three widths) and three drawer views passed; zero pixels above the unchanged 0.1 threshold |
| Dependency audit | 0 reported vulnerabilities after updating screenshot tooling Sharp to 0.35.5 |
| Cars workflow integration check | Documentation checker passed; 379 of 381 portfolio tests passed. Two unrelated Modern refresh fixtures fail with Missing Modern financing logo anchor in the existing refresh adapter. Those files were not changed for this promotion. |

The screenshot-tooling patch follows the [Sharp security advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). These are fresh local results, not an assumed GitHub Actions pass.

The comparison uses the same headless Chromium renderer on both sides, a fixed clock, reduced motion, decoded images and deterministic font settings. Its fixed pixelmatch threshold remains 0.1, with zero pixels permitted above that threshold. All 117 page comparisons passed; 99 also have exact raw-pixel equality. The remaining 18 contain differences below the fixed threshold, so this result does not claim universal raw-pixel equality. Drawer raw equality is recorded separately in the verification receipt. Overlapping 900px-high browser views cover the complete document, with settled scrolling and stable document height asserted. Original horizontal overflow is recorded separately, and native overflow fails. Alternate Details 4 fixes the original overflowing carousel while retaining visible neighbouring images.

The preserved reference predates the final Contact grouping request. provenance/reviewed-reference-adjustments.json explicitly declares that approved adjustment. The comparison applies its outer wrapper and spacing to the reference Contact page only. It also disables the reference wallet chart's parent-resize feedback loop, matching the native fix while retaining its data and dimensions. Range sliders use a stable 2D layer in the actual native application. The reference receives that same layer for comparison: its previous 3D layer produced a variable 59-pixel label difference despite identical font files, computed styles and rectangles. Fonts, values and geometry remain unchanged. These reference adjustments are recorded per comparison; no reference source, visible comparison region or threshold is changed. Native screenshots capture the delivered page. Earlier failed and interrupted runs remain in ignored evidence and are not counted as passing runs.

## Remaining product integrations

Account, shop, bookings, memberships, wallet and dashboards remain truthful demonstrations. This source work does not supply authentication, persisted enquiries, checkout, payment providers, live inventory or complete localization. Typed identity/content inputs exist, with their coverage documented in REUSE.md. Dealer sales/import adaptation, mounted-path publisher qualification and an authorized dealer/fleet release remain separate work. The 25 lead projects and approved template lock are unchanged.

The canonical preview is http://127.0.0.1:6466/; the standalone preview uses 6477 during this review. Test logs and screenshots remain in Cars runtime/ or the template's ignored .runtime/. The final committed verification receipt records actual comparison coverage and the source digest.
