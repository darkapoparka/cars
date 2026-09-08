# Rencar — Svelte reproduction

Local reproduction of [Rencar's public demo](https://live.themewild.com/rencar/), corresponding to ThemeForest item 61437651.

## Run

```powershell
cd J:\cars\rencar
npm install
npm run dev
```

Open http://127.0.0.1:6430. The current development server is already running on that port.

```powershell
npm run check
npm run build
npm run preview
```

Stop the development server before running preview, since both use port 6430.

## Implementation

- Svelte 5 and Vite; 45 editable, compiled Svelte page components in `src/pages`.
- All five homepages and the linked car, booking, account, services, blog, contact, and utility pages retain their `.html` URLs.
- Original DOM structure, classes, CSS, images, locally stored fonts, icons, and responsive breakpoints.
- 193 successfully downloaded public assets in `public/assets`. One unused Owl video-play image is also missing on the reference server; no rendered local page requested it during verification.
- Original Bootstrap, Owl Carousel, SlimSelect, Flatpickr, WOW, and popup widgets initialize after Svelte mounts. This deliberately retains the reference's widget behavior and appearance.
- No iframe wrapper around the site. The contact map and external video players retain their original external embeds.
- Accessible names and form-label associations were added without changing appearance. Search supports Escape, keyboard focus trapping, and focus return.

The source demo's content, prices, testimonials, sample account details, placeholder links, and copy are preserved for visual fidelity. This is a frontend template reproduction: authentication, actual reservations, payments, and sending email are not connected. Form submission remains local and explains when a backend is required; no data is posted to the original author's PHP service. Booking navigation connects the available template screens.

## Verification

- `npm run check`: zero errors and zero warnings.
- `npm run build`: production build succeeds.
- Svelte autofixer: App and all 45 page components pass.
- All 45 routes loaded at 1440px and 390px: 90 checks with no JavaScript errors, failed local asset requests, broken images, or horizontal overflow.
- Homepage comparison at 1440×1000 and 390×844, with carousel and scroll-animation state normalized. First viewport mismatch: 0.0007% desktop and 0% mobile. Full-page mismatch: approximately 0.0012% desktop and 0.000032% mobile. These are screenshot comparisons at the tested sizes, not a guarantee about every browser or animation frame.
- Verified desktop search/focus return, information drawer, carousel, location selection, calendar selection, booking navigation, FAQ disclosure, mobile menu, car details, and browser back.
- Alternate homepages 2–5 were also compared at both widths: 0% first-viewport mismatch in seven comparisons and 0.0043% for homepage 2 on desktop. Per-page body theme classes are preserved.
- The UI copy scan flags 24 instances of placeholder copy from the supplied reference; retained intentionally for this exact reproduction.

Evidence and scripts:

- `reference/qa/visual-report.json` and matching screenshots
- `reference/qa/route-report.json`
- `reference/qa/interaction-report.json`
- `reference/qa/variant-report.json`
- `reference/svelte-check.txt`, `reference/build.txt`, `reference/autofixer-all.txt`
- `scripts/capture.mjs`: capture public pages and assets
- `scripts/prepare.mjs`: regenerate Svelte pages from captured HTML (overwrites generated page files)
- `scripts/verify.mjs`, `scripts/check-routes.mjs`, `scripts/check-interactions.mjs`: browser checks

Static hosting requires an SPA fallback to `index.html` for the original `.html` page routes. No hosting deployment was performed.
