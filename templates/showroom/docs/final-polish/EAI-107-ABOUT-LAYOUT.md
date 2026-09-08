# EAI-107 — About page layout and showroom images

Status: READY FOR OWNER REVIEW. Owner-requested About-only batch, 2026-09-06.

## Result

The About body now follows the homepage's light grey background, plain dark section headings, 32px desktop section padding, restrained 8px radii and compact content. A company introduction and real showroom/gallery images lead the page. The old gradient heading banners and giant logo consultant cards are removed. Contact specialties retain profile, telephone and email destinations in compact rows. Brands retain their inventory filters. Services retain their destinations in small text cards. About now uses the homepage's three-video composition. The location area shows the actual entrance and directions links instead of a blank third-party map frame. The About footer uses the current wordmark with readable white rendering.

The approved inward-facing Mercedes pair is unchanged. No Home, Contact, Inventory, Services, shared component, shared style or data-source files were changed by this batch.

During interaction QA, the existing `csr = false` setting in `src/routes/about/+page.ts` was found to prevent all Svelte video handlers from running. This required dependency was reported before editing and added to the batch. It is now `true`; server rendering remains enabled. Actual embedded playback and mobile controls were checked afterward.

## Changed application files

- `src/lib/components/about/AboutContent.svelte`: showroom section and three-video composition, section spacing.
- `src/lib/components/about/AboutSectionHeader.svelte`: plain responsive headings.
- `src/lib/components/about/AboutConsultantsSection.svelte`: compact contact specialties.
- `src/lib/components/about/AboutIntroSection.svelte`: compact service links.
- `src/lib/components/about/AboutBrandsSection.svelte`: compact brand tiles.
- `src/lib/components/about/AboutLocationSection.svelte`: readable contact details, actual entrance photo, directions.
- `src/lib/components/about/AboutTemplatePage.svelte`: scoped current footer wordmark.
- `src/lib/components/about/AboutShowroomSection.svelte`: new introduction and photo gallery.
- `src/routes/about/+page.ts`: enable hydration for the existing interactive components.
- Four assets under `static/assets/eliqauto/about/`.
- `tasks.md` and this scoped report.

Budget: seven existing components, one new component, one one-line route setting. No dependency upgrades or shared redesign. Task-only before/after source diff is saved in `artifacts/about-layout-20260906/task-only.diff`; exact pre-edit source copies are under `baseline/`. Existing About source was simplified substantially (consultants 311 to 105 lines; location 470 to 192 lines).

## Image sources and generation

Official source page: https://eliqauto.com/za-nas

Its `/assets/js/about.js?v=1ec661b45e` gallery supplies the original filenames. Downloaded source HTML and JS are retained in the evidence folder. The source site was used for imagery only; its layout, effects and styling were not copied.

| Shipped image                                              | Source                                            | Processing                                                     |
| ---------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| `static/assets/eliqauto/about/showroom-retouched-v1.webp`  | https://eliqauto.com/assets/galeriq/IMG_6721.webp | Built-in image generation retouch, exported as WebP quality 88 |
| `static/assets/eliqauto/about/entrance-official.webp`      | https://eliqauto.com/assets/galeriq/IMG_6736.webp | Original bytes preserved                                       |
| `static/assets/eliqauto/about/customer-area-official.webp` | https://eliqauto.com/assets/galeriq/IMG_6732.webp | Original bytes preserved                                       |
| `static/assets/eliqauto/about/lounge-official.webp`        | https://eliqauto.com/assets/galeriq/IMG_6737.webp | Original bytes preserved                                       |

Four shipped images total 610,900 bytes. The lead image is a generated adaptation of the actual location; the three gallery photographs are originals. No synthetic staff identities, stock people or unrelated celebrity images were added. Source and generated images were visually inspected and shown to the owner. The full generated output remains at `C:/Users/radev/.codex/generated_images/01a0733f-5cd8-7990-9d80-b5767401dda3/exec-b627345d-4c82-4db5-9b18-f4fc98ed903b.png`.

Built-in image generation prompt:

> Edit this actual ELIQ AUTO showroom photograph for an About page. Conservative professional photo retouch ONLY. Preserve exactly the same actual room, concrete ceiling, black structural columns, dark wall, hexagonal wall lighting, framed prints, plants, rope barriers and all vehicles in their exact same positions/colors/proportions. Keep the red Lamborghini foreground, blue Mercedes behind it, yellow BMW and white vehicles. Improve exposure balance and natural contrast, recover window highlights, correct mild smartphone haze, subtle optical sharpness without plastic textures. Maintain natural documentary appearance. Do not add people, invented cars, furniture, signs, logos or text. Do not redesign or extend the room. Output a clean landscape 4:3 photograph, edge to edge, same framing, with background intact. This is a real business location and must remain recognizably identical. No dramatic cinematic color grading, no vignette, no artificial glow.

## Render and behavior evidence

Evidence root: `artifacts/about-layout-20260906/`.

- Before: `before-about-390.png`, `before-about-1440.png` (full pages).
- After: `after-about-{320,360,390,430,768,1024,1280,1440,1920}.png`; 390 and 1440 are full pages. All heights 900px for the viewport matrix.
- Readable section previews: `showroom-desktop.png`, `location-desktop.png` at 1440x1000.
- Metrics: `qa.json`, `hydrated-qa.log`: no horizontal overflow, no broken visible images, no page exceptions at any tested width, including after enabling hydration.
- Preservation: `preserved-{home,contact,inventory}-{390,1440}.png`, `preservation.json`. The first 900px of all six route/viewport screenshots have zero changed pixels against the before captures.
- Existing anchor `#about-team` lands at the preserved 164px mobile offset. BMW navigates to `/inventory?brand=BMW`, and browser Back returns to About.
- Gallery: focusing the last photo scrolls the mobile rail; no page overflow. Opening a photo loads the original image in its own tab.
- Contact drawer: opens and closes correctly at 390x844 with hydration enabled.
- Video component checks: two passing Playwright tests for opt-in playback, one active player, focus entry/return, direct YouTube fallback and mobile access to the third card. Test iframe is mocked for deterministic component interactions only.
- Separate real provider proof: `about-live-video.png`, `live-interactions.json`. The actual showroom YouTube embed reached currentTime 2.176906, paused false, readyState 4 on About. No provider mock in that check.
- 720x500 layout, equivalent to the CSS viewport of a 1440x1000 window at 200% zoom, has no horizontal overflow. This is a viewport-equivalence check, not a browser chrome zoom-control test.

## Checks and limits

- `npm run check`: 0 errors, 0 warnings (`check-final.log`).
- `npm run build`: passes (`build-final.log`).
- ESLint and Prettier on all changed Svelte components: pass.
- Svelte autofixer on all eight components: no issues or suggestions.
- Impeccable detector on all eight components: empty findings (`detector-final.json`).
- Playwright with `PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_PORT=6404`: 2/2 passing (`video-e2e-final.log`). The first attempt used the wrong environment variable/port; the next correctly exposed disabled hydration. Both are corrected in the final run.
- Full repository lint remains failing: 78 formatting warnings, including existing files and local artifact files. No broad formatting changes made.
- Full unit suite: 188 passed, 36 failed across 8 failing/27 passing files. Failures concern existing vehicle/data, route records, server/API/CMS/agent/blog expectations; these owners were not edited. This is not a claim of a green full repository.
- Development console emits the existing shared video component's non-reactive trigger binding warning. Playback/focus assertions pass. The shared component was preserved. Provider frames also emit browser/provider warnings.

## Delivery

Verified checkout: `M:/codex/agency-os-projects/leads/automotive/eliq-auto/bohemcars`, branch `codex/home-desktop-polish-0904`, HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`, origin `https://github.com/darkapoparka/eliq-auto-import.git`.

Dev server remains running at http://127.0.0.1:6404/about with the confirmed owned PID 48624.

Local working-tree delivery. No commit or push: the integration files already contain substantial uncommitted work from earlier owner batches. The pre-edit copies and task-only diff isolate this batch for review without sweeping that work into a new commit. No next batch started.
