# Karento

Local Carento HTML-reference capture hosted with Svelte 5.57.2 and SvelteKit 3.0.1. The default `/` is homepage 2; `/index.html`, `/index-2.html` and `/index-3.html` retain the three original homepages. All captured pages also accept extensionless URLs.

## Run

```powershell
npm ci
npm run check
npm run build
npm run dev -- --host 127.0.0.1 --port 6462 --strictPort
```

From Cars root, the standard preview helper also works:

```powershell
powershell -NoProfile -File scripts/start-preview.ps1 -Template karento -Port 6462
```

`npm run qa` checks every captured route and downloaded asset against the active preview. Set `KARENTO_QA_URL` to check another local preview.

## Source and editing

The author-hosted HTML reference is `https://carento-demo.vercel.app/`; the requested visual reference was `https://carento-nextjs.vercel.app/index-2`. These are different implementations of the same design and may differ in copy and functionality. This capture targets the HTML version, not a claim of byte-identical parity with the Next.js implementation.

`src/lib/server/pages/` contains 39 separately editable HTML page bodies. `src/lib/server/pages.json` contains their head, attributes and script metadata. `static/assets` retains vendor CSS, imagery, fonts and JavaScript. The Svelte page renders the original markup, then loads classic scripts sequentially. Full document navigation preserves each vendor plugin's lifecycle. This is an HTML capture hosted by SvelteKit, not a full conversion of vendor plugins into native Svelte components or recovery of the author's Gulp/SCSS/Figma development source.

The capture script is specific to this template reference and does not generate dealer proposals. It preserves source failure evidence and hashes in `provenance/capture.json`. Running it replaces captured page data and downloaded assets; review local edits first. Run `node scripts/localize-fonts.mjs` afterwards to retain local Urbanist fonts.

## Coverage and limits

- Three homepages, four vehicle listing layouts, four detail layouts, dealer listing/detail, two shop pages, three blog pages.
- About, services, pricing, calculator, FAQs, terms, contact, login, register and the designed 404 page.
- Six user-dashboard pages and five agent-dashboard pages.
- `privacy.html` and `destination.html` are linked by the upstream demo but return HTTP 404. They are unavailable source pages, not completed captures.
- Upstream missing assets are recorded rather than replaced with invented artwork. Most failures are references in shared CSS to unrelated template sections.
- Portability repairs normalize redundant slashes in detail-layout-2 image paths and skip a chart initialization when its target is absent. These preserve intended visuals and avoid local image failures or the upstream missing-chart exception.
- Forms, bookings, sign-in, payments and dashboards retain demo behavior; no dealership backend or real transaction integration is supplied.
- The user reports an Envato license. Keep this source private and retain the licensed archive/license when supplied.

This is an additional template draft. It is not selected in the approved five-family dealer release or published to dealers. Approval, publisher integration, personalization and hosted verification remain separate work.
