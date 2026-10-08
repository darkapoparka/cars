# PDP gallery and fact badges — 4 October 2026

The later [photo-preview and stat-hierarchy correction](../pdp-gallery-hierarchy-2026-10-04/README.md) supersedes the grey badge treatment and 76px preview height below. This receipt preserves the earlier trial and its comparison evidence.

The exterior, interior and details previews are slightly shorter. Mileage, gearbox and fuel appear as quiet grey fact badges. The image action uses the short localized label “Подобни” / “Similar”, with a smaller visible pill and the existing Similar Cars drawer.

| Element | Before | After |
| --- | --- | --- |
| Photo category previews | 80px tall | 76px tall; same three columns and category counts |
| Bulgarian Similar control | 180.44 × 44px | 85.5 × 28px visible pill, inside a 44px tall button |
| Mileage, gearbox, fuel | Plain text separated by dots | Three static 26px tall grey badges |
| Photo counter | 24px tall | 24px tall; still 1 / 18 |

Matched captures use the same vehicle, locale, requested viewport and scroll position. Mobile is 390 × 844 at scroll 0; desktop is 1440 × 900 at scroll 270. The native scrollbar occupies 15px of the available content width.

| View | Before | After |
| --- | --- | --- |
| Bulgarian mobile | [Before](bg-390-before.jpg) | [After](bg-390-after.jpg) |
| Bulgarian desktop | [Before](bg-1440-before.jpg) | [After](bg-1440-after.jpg) |

Focused verification passed on Bulgarian 320, 390, 768 and 1440px, and English 320, 390 and 1440px. Images loaded; all three album previews and all three badges fit in one row; no horizontal overflow was observed. Labels, values, counts and the full Similar Cars accessible name were retained. All three category buttons opened the corresponding photo viewer; the exterior viewer advanced to its second photo. Escape returned focus to each initiating button. Keyboard focus, Enter activation, Escape dismissal and focus restoration passed for Similar Cars.

`npm run check` passed using Node 22.20.0: ESLint, TypeScript and the Webpack production build (407 pages). Build output was isolated from the running preview and the preview type reference was restored. See [before geometry](before-geometry.json) and [verification results](verification.json). Additional evidence: [Bulgarian 320px](bg-320-after.jpg), [English mobile](en-390-after.jpg), [English desktop](en-1440-after.jpg).

The L: drive temporarily ran out of space while saving extra evidence. Four inactive, ignored Webpack pack files from `.next-quick-pill-check/cache/webpack` (87,291,793 bytes) were preserved by moving them to `C:/Users/radev/.codex/tmp/cars-app-obsolete-cache-20261004-pdp-gallery`. The source and destination were resolved and checked for reparse points, payload type and active consumers before moving. The running preview and current build output were kept intact.

Source and evidence are ready locally. At closeout, `main` was at `399e33bd2ec58a0443386ccb7ca2cd8a42087690`, with an empty staged index. The shared `.git/index.lock` (0 bytes, last written 4 October at 11:07:09 local time) prevented a scoped commit/push. The lock was preserved. Pending scope is `TEMPLATE.md`, `components/VehicleDetailClient.tsx`, `components/VehiclePhotoAlbums.tsx`, both locale JSON files and this evidence directory.
