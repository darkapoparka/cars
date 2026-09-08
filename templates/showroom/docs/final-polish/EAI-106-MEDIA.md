# EAI-106 — Transparent banners and official YouTube videos

## Owner correction — 2026-09-06

The presenter/GLS composite below was rejected for poor composition. It is no longer referenced by About. Both About and Services now use `eliq-s-class-cutout-v1.webp` twice: left faces right, right is mirrored to face left. Identical 22%-width, 190px-high image boxes anchored 64px above the desktop banner bottom. At 1920px both rendered boxes measure 310.1875×190 with matching y=174 and bottom=364. The source alpha and equal fitting give matching vehicle scale and alignment. About, Services and the opt-in PageBanner fleet styles are the only application edits in this correction. Contact, Cars, YouTube and other page content remain unchanged.

Evidence: `artifacts/about-asset-correction-20260906/`, including owner-reference before captures and final About/Services renders at 390, 1024, 1440 and 1920. No page errors, failed cutout loads or horizontal overflow. Mobile About is pixel-identical before/after. Discarded source files are preserved; no new asset is shipped. The historical record below describes the earlier iteration and its YouTube implementation, which remains in place.

Correction checks: `npm run check` (zero errors/warnings), `npm run build`, focused ESLint/Prettier, and Svelte autofixer on all three touched components passed. The earlier documented repository-wide lint/unit failures were not repaired or reclassified. No browser flow changed in this correction. Local-only, READY FOR OWNER REVIEW; no commit/push.

Owner-requested follow-up to the rejected rectangular About photo, 2026-09-05. READY FOR OWNER REVIEW.

## Delivered scope

- About: generated presenter/white GLS cutout with real alpha, directly on the existing red banner. The rectangular photo variant is removed.
- Services: generated black S-Class cutout replaces the generic inspection illustration. The title, search, shortcuts and 300px desktop banner remain intact.
- Homepage consultation banner: the same S-Class cutout, with a smaller desktop crop to keep it clear of the copy. Original mobile banner art remains unchanged.
- Shared YouTube section: three videos on the homepage after the brand browse section; two on About before Location. Desktop grid and compact horizontally scrollable mobile row. No iframe before selection, one player at a time, close returns keyboard focus, and each card retains a direct YouTube link. Existing page sections remain.

## Asset provenance and processing

Official feed: https://eliqauto.com/data/media.json, retrieved 2026-09-05. Local snapshot: `artifacts/eliq-cutouts-video-20260905/media.json`.

| Shipped asset | Official source | Dimensions | Transparency |
|---|---|---|---|
| `static/assets/eliqauto/hero/about-eliq-gls-cutout-v2.webp` | https://eliqauto.com/assets/video/7669939643659357442.jpg | 810×900 | Verified alpha with transparent exterior and opaque subject |
| `static/assets/eliqauto/hero/eliq-s-class-cutout-v1.webp` | https://eliqauto.com/assets/video/7676049420319837462.jpg | 900×427 | Verified alpha with transparent exterior and opaque subject |

These are generated adaptations of ELIQ's published imagery, not untouched original photographs. Built-in image generation produced the foreground assets. Direct transparency requests returned opaque checkerboards, which were rejected. The selected outputs used a flat green export matte; `artifacts/export-generated-cutout.mjs` converts the green matte to alpha, removes edge spill, trims transparent margins and encodes WebP. No green/checkerboard/photograph rectangle is present in the shipped background. Original sources and rejected outputs were preserved.

Final generation prompts:

1. Presenter/GLS: preserve the source presenter in her blue striped dress and white GLS, pose, clothing, proportions and relative placement; remove showroom, ceiling and floor; tightly frame the complete subjects with a small margin; use a uniform pure green `#00ff00` export matte with no checkerboard, shadow, green reflections, frame or added text.
2. S-Class: isolate only the source black Mercedes S-Class, retaining the front three-quarter angle, black paint/wheels and chrome grille; remove people and all surrounding environment; naturally complete the small occluded car portion; tightly frame the car on a uniform pure green export matte, with no shadow, pattern, green reflections or added text.

## Videos

Video IDs were taken from the official feed, verified via YouTube oEmbed, then played in the embedded player:

- Showroom opening: https://www.youtube.com/watch?v=WK_2HFbtxrs
- BMW 740 handover: https://www.youtube.com/watch?v=d4AK0HnNADU
- Porsche Panamera Turbo: https://www.youtube.com/watch?v=G5SeKj8JZro
- Official-site channel link: https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw

The initial AMG selection was excluded after the embedded player reported it unavailable. `playback.json` records that discarded candidate; `playback-bmw.json` verifies its final replacement. YouTube owns availability and thumbnail content. Every shipped video reached `readyState=4`, `paused=false`, and an advancing playback time in the local Chromium check. No fabricated views or popularity counts.

## Verification

Evidence root: `artifacts/eliq-cutouts-video-20260905/`, also accessible through `C:/Users/radev/.codex-artifacts/eliq-cutouts-video-20260905/`.

- Before full-page screenshots at 390×844 and 1440×900, plus copies of all five starting component files and the ledger.
- Initial rendered matrix: Home/About/Services at 320, 390, 768, 1024, 1440 and 1920 widths. Zero page errors, broken images or page overflow. Desktop About/Services banners remain 300px; media hidden below 1024 as before.
- Final captures include 390, 1280 and 1440 with the shipped BMW video and final homepage crop. `videos-*` initial captures may contain the discarded AMG candidate; use `final-*` for the delivered selection.
- Contact/Inventory preserved first viewports are pixel-identical at 390 and 1440. Their source was untouched. Existing 1024px duplicate header branding is outside this task.
- The About banner and Services banner on mobile retain their prior imagery visibility and geometry. The newly authorized video section is the mobile content addition.
- Real YouTube playback verified on desktop for Showroom and BMW, mobile for Panamera. `playback-*.png`, `playback.json`, `playback-bmw.json`.
- Two focused Playwright e2e tests pass: opt-in playback, one player, close/focus restoration, direct fallback href, and keyboard access across the mobile rail without overflow. The e2e fixture isolates component behavior; separate live playback checks provide provider evidence. Command: `PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_PORT=6404 npm run test:e2e -- artifacts/eliq-media.e2e.ts --workers=1 --reporter=line`.
- 200% CSS zoom: no page overflow in the video section.
- `npm run check`: zero errors and warnings.
- `npm run build`: passed; final build repeated after the homepage crop and video selection changes.
- Focused ESLint and Prettier: passed for touched components/data. Svelte autofixer: no issues; the new component's element refs are retained for keyboard focus handling. UI scan: zero findings across six components.
- Repository-wide lint remains blocked by pre-existing formatting/parser issues, now also scanning local artifact scripts. Unit suite: 187 passed, 37 failed in existing data/server/API/CMS areas. No out-of-scope test or formatting repairs.

## Change budget and delivery

Five existing components: AboutContent, PageBanner, ServicesContent, HomeFiveActionBand, HomeFiveTemplatePage. New shared component EliqVideoSection, data file eliqauto-media.ts, two WebP assets, and this scoped ledger/provenance documentation. No dependencies, routes, header, inventory, contact, backend, or source-data changes.

Physical checkout: `M:/codex/agency-os-projects/leads/automotive/eliq-auto/bohemcars`. Branch `codex/home-desktop-polish-0904`, HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`, existing verified Vite listener 6404. Existing uncommitted owner work is preserved. No commit or push: integration depends on the preceding uncommitted component changes.

C: filled during verification. Only the two evidence folders created in this conversation were moved to the repository's artifacts folder on M:, with junctions preserving their old paths. Browser temporary files for subsequent verification were directed to M:. No unrelated storage or processes were cleaned up.
