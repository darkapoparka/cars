# EAI-107 owner correction — About composition

Status: READY FOR OWNER REVIEW. Supersedes the first EAI-107 visual treatment, which the owner rejected. The owner explicitly requested a better composition, not a 1:1 restoration.

## Current result

- A compact showroom composition: large actual showroom adaptation on the left, factual company introduction and two original lounge photos on the right. Each photo opens at full size.
- Removed the repeated consultant-role/contact rows from the About composition. Existing consultant profile routes are unchanged.
- Replaced the large inventory-count tiles with one compact row of eight linked marque logos. The BMW and other inventory-filter destinations remain unchanged.
- Reinstated relevant service photography with the homepage news-card structure: 5:2 image, white content body, 20px title and restrained outlined action. Mobile uses a 100px photo column and readable compact copy.
- Replaced the address table with one entrance-photo/contact panel using the homepage's dark consultation surface and red/white action treatment. Phone, secondary phone, email, hours and directions remain available. No repeated entrance photo elsewhere.
- The mobile section shortcut says "За нас" and retains #about-team for old links. The contact drawer and bottom navigation remain intact.
- Mercedes header pair and existing working three-video section are preserved.

## Exact correction files

Six existing components only: AboutContent.svelte, AboutShowroomSection.svelte, AboutIntroSection.svelte, AboutBrandsSection.svelte, AboutLocationSection.svelte, AboutMobileSurface.svelte (one shortcut label).

No shared Home, Contact, Cars, Services, video, data or global-style changes. No new assets generated in this correction: the image-generation showroom adaptation and three original ELIQ photographs from the prior pass are retained; the existing homepage inspection image is reused for its corresponding service card. Original sources and generation prompt remain in EAI-107-ABOUT-LAYOUT.md.

## Evidence and checks

Evidence folder: artifacts/about-refinement-20260906/.

- Pre-edit source and full-page screenshots: before/.
- Full-page comparisons: about-390.png and about-1440.png; readable detail views: showroom-desktop.png, services-desktop.png, visit-desktop.png.
- Responsive matrix: 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920, viewport height 900. No overflow or broken visible images. Final layout is 3194px tall at 1440 and 4358px at 390, versus 3928px and 5563px in the rejected version.
- Type check: 0 errors / 0 warnings. Scoped ESLint and Prettier pass. Svelte autofixer passes for all six components. Impeccable detector reports no findings.
- Video interaction tests: 2/2 pass (poster opt-in, one active player, focus entry/return, direct YouTube link and mobile third-card access).
- Gallery original image opens successfully; BMW link navigates correctly; About mobile anchor lands at 164px; contact drawer opens and closes.
- Contact and Cars first-viewport preservation screenshots are pixel-identical at 390 and 1440. Home desktop is pixel-identical. The first Home mobile capture differed only in header pixels (bounding box x12..377/y8..49) while build/sync operations were running; there are no Home source edits. A fresh final capture is retained as preserve-home-390-final.png.
- First production build ran out of available memory. Retrying alone with process-local RAYON_NUM_THREADS=2 and NODE_OPTIONS=--max-old-space-size=2048 succeeded (build-final.log). No persistent configuration was changed.
- A concurrent build/sync invalidated one development module during the second responsive sweep. Final fresh hydration and local-asset checks after the build are recorded separately in final-runtime.json. This was runtime interference, not a layout defect.
- Repository-wide lint/unit failures from the earlier EAI-107 run are still disclosed in EAI-107-ABOUT-LAYOUT.md. Those unrelated suites were not repaired or repeatedly rerun for this visual correction.

Local working-tree result at http://127.0.0.1:6404/about. No commit/push; pre-existing owner work preserved. No next batch started.
