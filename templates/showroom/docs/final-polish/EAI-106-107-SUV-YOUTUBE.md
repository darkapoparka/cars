# EAI-106 / EAI-107 — SUV pairing and YouTube identity

Owner-requested correction, 2026-09-06. Status: READY FOR OWNER REVIEW.

## Changes

- `HomeFiveActionBand.svelte`: removed the desktop sedan source and sedan-specific sizing. The existing transparent white Mercedes GLS now appears at every width, facing left like the BMW. Banner copy, links and layout remain intact.
- `EliqVideoSection.svelte`: replaced the text-only heading with the existing ELIQ header wordmark, the connecting word and an official YouTube wordmark. Updated the channel action label and play-control red. Video data, posters, click-to-play behavior, iframe privacy domain, close controls and focus restoration remain intact.
- Added `static/assets/eliqauto/brand/youtube-logo-fullcolor.png`, copied without modification from the full-color digital asset in YouTube's official brand download. 19,896 bytes. Source: https://brand.youtube/youtube-logo/; archive: https://www.gstatic.com/marketing-cms/52/7d/637fef5a4788a97747e6feabc4aa/youtube-logo.zip.

## Evidence and checks

Evidence root: `artifacts/suv-youtube-20260906/`. Immediate source snapshots are in `before/`.

At 1440 × 1000 and 390 × 1000, both `before/` and `after/` contain:

- `home-banner-{width}.png` — `/`, paired action banners.
- `home-video-{width}.png` — `/`, YouTube section.
- `about-banner-{width}.png` — `/about`, paired action banners.
- `about-video-{width}.png` — `/about`, YouTube section.

Both routes additionally passed logo-load, SUV-source and page-overflow checks at 320, 390, 768 and 1440 pixels; no page errors. Six existing browser tests passed: gallery navigation, failure recovery, service/company/map controls, opt-in video playback, single player, close/focus restoration and mobile video rail. Focused ESLint passed. Svelte autofixer found no issues; its existing `bind:this` suggestions concern the preserved playback/focus implementation. UI scan found no issues.

Typecheck passed with zero errors/warnings. Production build passed with inherited CSS asset warnings. Focused formatting and ESLint passed. Full lint reported formatting issues in 138 files (existing source and local evidence); no broad formatting applied. Full units reported 187 passing / 37 failing tests: the prior 36 failures plus a Windows EPERM rename error in backend-api.spec.ts. That file passed all 21 tests on a targeted retry. Full repository acceptance remains open.

Pixel comparisons confirm both desktop BMW banners are unchanged, and the complete Home mobile banner is unchanged. The About mobile banner was visually inspected; no pixel-identity claim is made for that capture. Immediate component diff: 63 additions / 49 deletions across two files, plus the official PNG.

The shared action component also serves `/home1` and `/home1-tabs`; its image replacement applies there as well. Both secondary routes were rendered at 1440px and the restored GLS verified; screenshots are in after/home1-shared-banner-1440.png and after/home1-tabs-shared-banner-1440.png. No route composition was edited.

Local branch: `codex/home-desktop-polish-0904`, HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`. Existing dirty work preserved. No commit or push; the scoped correction depends on the existing uncommitted shared components.
