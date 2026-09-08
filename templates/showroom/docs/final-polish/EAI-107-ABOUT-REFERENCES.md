# EAI-107 — Reference-led About correction

Status: READY FOR OWNER REVIEW. This supersedes the two rejected EAI-107 layouts; neither is considered owner-approved.

## Reference and scope

The owner supplied `6517/about`, `6518/about`, and a concatenated URL containing `5173/about-us`. All three were opened, captured, and visually inspected. `6518/about` is the primary layout reference: centered section headings, contained photo cards, individual centered brand tiles, inset service photos and a light structured contact panel.

ELIQ's page retains its approved Mercedes banner and actual showroom imagery. The reference dealers' staff, names, claims and identities were not imported. The existing photo retouch from the built-in image generator and existing generated service illustrations are reused; no new generation or replacement asset was necessary for this layout correction. Original provenance remains in EAI-107-ABOUT-LAYOUT.md.

Six application files changed, all in `src/lib/components/about/`:

- AboutContent.svelte: showroom, video, brands, services, visit order and white page surface.
- AboutSectionHeader.svelte: centered heading/description with a bounded text width.
- AboutShowroomSection.svelte: three restrained photo cards; horizontally scrollable on mobile, full-size image links retained.
- AboutBrandsSection.svelte: four desktop columns / two mobile columns, logos and source-backed inventory counts.
- AboutIntroSection.svelte: inset 16:9 service imagery, consistent soft surfaces and red actions; existing service destinations preserved.
- AboutLocationSection.svelte: actual exterior photo beside grouped address, phone and hours details, with directions/call/email actions.

Source delta against this correction's saved baseline: 312 insertions, 375 deletions. No shared components, source data, dependencies, other routes or asset files changed. Ledger and this report are additional documentation changes.

## Evidence

Evidence root: `artifacts/about-references-20260906/`.

- Reference captures: 6517-desktop.png, 6518-desktop.png, 5173-desktop.png and 6518-mobile.png.
- Before: before/about-390.png, before/about-1440.png and six saved component sources.
- After: about-390.png, about-1440.png; readable section images intro-detail.png, brands-detail.png, services-detail.png, visit-detail.png.
- Responsive matrix: 320x700, 360x800, 390x844, 430x932, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080. No page overflow, broken visible images or page errors at any width. See qa.json.
- Preservation: Home, Contact, Inventory and Services at 390x900 and 1440x900 have zero changed screenshot pixels against captures immediately before this correction. See preserved-*.png and qa.json.

## Verification

- Svelte check: zero errors and zero warnings.
- Production build: pass, run alone with process-local RAYON_NUM_THREADS=2 and NODE_OPTIONS=--max-old-space-size=2048 to accommodate host memory pressure. Existing adapter-auto deployment-target notice remains.
- All six Svelte autofixers: no issues/suggestions. One npm launcher failure was retried successfully through the installed CLI entry point.
- Focused ESLint and Prettier: pass.
- Impeccable and Clean Product UI scans: zero findings.
- BMW brand navigation reaches the matching inventory query, and browser Back returns to About.
- Showroom link opens a loaded full-size photo in a new tab. Mobile keyboard focus reaches the final gallery photo and scrolls the rail.
- All three service links preserve their destinations. Phone/email/map hrefs checked; no calls, emails or submissions made.
- Mobile section shortcut lands at the existing 164px scroll offset. Contact drawer opens and closes; no horizontal overflow.
- Video component tests: opt-in single-player behavior, keyboard activation, focus restoration on close, direct YouTube fallback and final mobile video card reachability. Provider playback itself was previously proven for EAI-107; the repeated component tests use an intercepted iframe and do not claim a new provider playback verification.

The selected EAI-107 batch's earlier full-repository lint and unit runs remain failing outside this scope (78 formatting warnings; 188 passing and 36 failing unit tests). Those results are recorded in EAI-107-ABOUT-LAYOUT.md and were not rerun or repaired for this six-component visual correction. Current scoped checks and build pass; this is not a claim that the full repository suite is green.

## Delivery

Local dev server remains at `http://127.0.0.1:6404/about`, PID 48624, using this physical checkout. Baseline branch `codex/home-desktop-polish-0904`, HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`.

No commit or push: the checkout and integration files contain substantial prior uncommitted owner work. This correction's exact baseline and scoped delta are preserved for review. No other batch activated.
