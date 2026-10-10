# Contact mobile composition — 2 October 2026

General Contact now puts its single visible `Контакти` / `Contact` H1 in the white
intro card below 992px. A generated showroom entrance, location pin and handset
occupy the banner above it. The 244px hero and 52px card overlap match the mobile
Home/About composition. Address and appointment information remain in the contact
details card; the map has no repeated visit heading or address introduction.

The existing About, Sell and Import compositions remain intact. Desktop Contact
keeps its own title and scene, and requests neither new mobile image variant.
The banner is configured through `lead-site.ts`, with 960px and 480px alpha WebP
encodings. Their addition updates the exact asset inventory from 166 to 168;
unreferenced and retired-asset guards remain in place. The generation prompt and
source are recorded in `provenance/contact-mobile-banner-2026-10-02.md`.

Verified locally on port 6461 with Node 22.20.0:

- Chromium: 14 focused cases passed, covering Bulgarian/English, 320/390/430px,
  320px with 200% root text, 768/991/992/1440px, About, both service entries and
  the no-JavaScript Contact fallback.
- WebKit: both 320px cases passed with normal and 200% root text.
- Checks cover visible heading ownership, card overlap, actual responsive image
  decoding and transparency, mobile-only loading, contact actions, the real
  Google map and directions, text reflow, page overflow and runtime errors.
- CSS policy, tokens, typography and the exact asset guard passed.
- Svelte/type check passed with zero errors and warnings.
- Production build passed, including locale and source-catalog checks.
- Inspected the rendered Contact header/card and the address-to-map transition.
- Workspace doctor fetched the current sources; other desktop draft changes
  remain preserved and outside this change's commit scope.

Browser reports, screenshots and build logs are retained under ignored
`runtime/contact-banner-20261002/`. These are local working-tree checks, including
existing desktop drafts; they do not constitute a template release or dealer
deployment.
