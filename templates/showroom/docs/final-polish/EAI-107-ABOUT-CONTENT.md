# EAI-107 — Official information and complete showroom gallery

Status: READY FOR OWNER REVIEW. This is the owner-requested content correction following the rejected visual-only revisions.

## Result

About now includes the dealer's history from 2017, six business activities, all 27 published services grouped into four accessible expandable lists, four customer amenities, all 16 original showroom photos, company details, three published telephone numbers, Viber, the showroom's actual map link and corrected opening hours.

The gallery has a five-image desktop preview (three on mobile) and a full-size viewer with all 16 thumbnails, previous/next navigation, wrapping, keyboard arrows, Escape, backdrop/close controls, mobile swipe, focus containment and return, body scroll locking, and an image-failure fallback. Original portrait and landscape image ratios are preserved inside the viewer.

Hours are Monday–Saturday 09:30–19:00 and Sunday 10:00–16:00. About's mobile contact drawer and footer receive the same corrected values. The company's registered address is labeled separately from the showroom directions. The optional map uses the coordinates published by the dealer; a direct Google Maps link remains available.

## Source and coverage

Source: https://eliqauto.com/za-nas and its linked about.js, freshly retrieved on 2026-09-06. Local captures: `artifacts/about-content-20260906/official-about.html` and `official-about.js`. Company information is reproduced as published by the dealer, not represented as independently registry-audited.

`source-coverage.json` proves exact set coverage for **27/27 service labels** and **16/16 gallery image IDs**. Descriptive copy is condensed and adapted to this site's voice. The dealer's unconditional financing-approval advertising is not presented as a verified guarantee. No unsupported metrics or staff profiles were invented.

All gallery originals were copied without modification from `https://eliqauto.com/assets/galeriq/IMG_*.webp`. Local optimized thumbnails are resized copies. Asset manifest with source URLs, dimensions and SHA-256 hashes: `asset-provenance.json`. Files: `static/assets/eliqauto/about/gallery/` (16 originals plus 16 thumbnails, 2,285,356 bytes total). The original photographs are not AI reconstructions. Existing generated banner/service assets remain in use; no new image generation was necessary to recover this factual content.

## Exact scope

Nine application files:

- `src/lib/data/eliqauto-about.ts` — new, source-backed About content.
- `src/lib/auxero/about.ts` — About-only opening hours and map values.
- `src/lib/components/about/AboutContent.svelte` — adds gallery section.
- `src/lib/components/about/AboutShowroomSection.svelte` — history and six real business activities.
- `src/lib/components/about/AboutGallerySection.svelte` — new gallery, viewer and amenities.
- `src/lib/components/about/AboutIntroSection.svelte` — complete categorized service list below existing service cards.
- `src/lib/components/about/AboutLocationSection.svelte` — published hours, map, phone/Viber and company details.
- `src/lib/components/about/AboutMobileSurface.svelte` — gallery shortcut only; updated office values flow through existing props.
- `src/lib/components/about/AboutTemplatePage.svelte` — About-only footer hours.

Also: gallery assets, task ledger, this report and local QA artifacts. No shared design tokens, footer implementation, header/banner implementation, other route content, dependencies or backend behavior changed. Exact pre-edit copies are in `artifacts/about-content-20260906/before/`; the preceding About screenshots are in `artifacts/about-references-20260906/about-{390,1440}.png`.

## Verification and evidence

- Svelte check: zero errors/warnings; focused ESLint/Prettier pass; production build passes.
- Seven Svelte autofixers: no issues. Gallery retains a deliberate button reference for dialog autofocus; its generic attachment suggestion was reviewed.
- Impeccable scan: no findings. Clean Product UI flags `backdrop-filter: none` (false positive) and pre-existing mobile header blur, which was preserved.
- **Six browser tests pass**, including all 16 original full-size image loads, wraparound navigation, thumbnail selection, keyboard focus containment/return, Escape/backdrop, mobile swipe and rail navigation, background scroll restoration, gallery-above-mobile-nav stacking, missing-image recovery, all 27 expanded services, company details, footer hours, map toggling and existing YouTube behaviors. See `e2e-final.log`.
- Nine widths: 320x700, 360x800, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080. No page overflow, broken visible images or page errors. See `qa.json`.
- Home, Contact, Inventory and Services at both 390x900 and 1440x900 have **zero changed screenshot pixels** against the preceding baseline. Pointer was moved off content to exclude hover-state differences.
- Final gallery and mobile contact recheck after build: `final-runtime.json`, `gallery-320.png`, `gallery-1440.png`, `visit-mobile-final.png`.
- Full-page and detail screenshots: `about-390.png`, `about-1440.png`, `story-detail.png`, `gallery-detail.png`, `services-expanded.png`, `visit-detail.png`.

The first rendered gallery check exposed missing positioning utilities in the retained template context. Explicit scoped positioning fixed it. Final layering also covers the existing mobile bottom navigation. Test harness corrections accounted for the original portrait photo and asynchronous scroll-lock restoration; these are reflected in the final passing run.

The earlier EAI-107 full-repository lint/unit limitations remain documented in EAI-107-ABOUT-LAYOUT.md (78 formatting warnings; 188 passing/36 failing unit tests). They were not rerun for unrelated repairs here; current focused checks and build do not imply a wholly green repository suite. No communications were sent, no calls were placed and no forms were submitted.

## Runtime and delivery

The stopped dev server was restarted on the free, verified project port. Current runtime: port 6404, PID 46816, physical checkout `M:/codex/agency-os-projects/leads/automotive/eliq-auto/bohemcars`, branch `codex/home-desktop-polish-0904`.

Local review: http://127.0.0.1:6404/about. No commit or push; substantial prior uncommitted owner work remains preserved. No next batch activated.
