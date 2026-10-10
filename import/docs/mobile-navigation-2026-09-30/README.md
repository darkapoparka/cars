# Sell / Import access and typography

Verified on 30 September 2026 against the canonical Import development server and an isolated production build.

## Findings and correction

The older development tab logged a Svelte hot-replacement exception while mounting the shared service entry: `Cannot read properties of undefined (reading 'call')`, through `get_next_sibling` and `dev/hmr.js`. A first restart also hit a 60-second SSR module-fetch timeout while loading the Cog icon. The subsequent restart initialized in 1.3 seconds and recovered normal responses. A fresh in-app browser tab at `http://127.0.0.1:5174/en/import?lang=en` successfully navigated between Home, Sell and Import, opened both forms, switched request modes and closed the forms. The old tab's failed debugger attachment was not treated as evidence of a current route failure.

The root layout also imported its font stylesheet from `static/`. Development rewrote font requests to `/static/fonts/sofia-sans/…`, which returned HTTP 403 outside Vite's serving allow list. The layout now imports `src/lib/styles/fonts.css`, whose assets use public `/fonts/sofia-sans/…` URLs. The existing font binaries, license and relative-path compatibility stylesheet are retained. The maintenance script generates both stylesheet copies. This changes font delivery without changing the typography scale or route contracts.

Actual Latin and Cyrillic Sofia Sans faces now load successfully. The regression test waits for loaded `FontFace` objects and checks successful font responses, including normal HTTP 304 revalidation. A computed family name alone would not have caught the original failure.

## Mobile appearance

Home Buy / Import, Sell VIN / No VIN?, and Import LINK / VIN / Find a car use the same Sofia Sans scale: 20px text, 24px line height, weight 400, and a 44px tab height. Visual inspection at 320px and 390px found no horizontal page overflow or clipped tab labels. The screenshots and [measured geometry](metrics.json) show the current result.

| Route  | 320px                        | 390px                        |
| ------ | ---------------------------- | ---------------------------- |
| Home   | [Screenshot](home-320.png)   | [Screenshot](home-390.png)   |
| Sell   | [Screenshot](sell-320.png)   | [Screenshot](sell-390.png)   |
| Import | [Screenshot](import-320.png) | [Screenshot](import-390.png) |

Working forms: [Sell](sell-form-390.png), [Import](import-form-390.png).

## Verification

- Node 24.21.0, retained npm lockfile; isolated `npm ci`.
- `npm run check`: zero errors and warnings. `npm run build`: successful Vercel adapter output.
- Scoped Prettier and ESLint checks passed. Architecture checks passed for 57 native route modules; image signature checks passed for 824 assets. The font maintenance script passed Python syntax parsing.
- Production preview: 14 focused browser tests passed. Seven desktop executions of mobile-only cases were intentionally skipped. Coverage included Latin/Cyrillic font loading at 390px and 1440px, public action typography, repeated Home → Sell → Import → Sell → Home navigation at 320px and 390px, and multi-step forms at 320/390px by 568/844px.
- Automated WCAG 2.2 AA checks passed for the expanded Import requirements and for Home, Sell and Import at 320px, with no reported violations. These are automated checks, not a complete accessibility certification.
- Canonical development server on port 5174: three focused browser tests passed for actual font loading and repeated mobile service navigation. The fresh in-app tab also exercised VIN and manual Sell modes, listing and manual Import modes, form opening/closing, and navigation. Its captured warning/error log was empty.

The production build was frozen from base `8709bb3f0b5295bff0c107862e66227450eceb8b`, including the six inherited Import drafts. Tested source digest: `e0d1652d595a2858157c60b932588d316b72e43d67616a1975ca239d0484643c`. Test-only additions were copied into that verification snapshot before execution. Runtime/build output, logs and source hashes remain under `C:/Users/radev/AppData/Local/Temp/import-mobile-final-20260930/navigation-debug/`.

The inherited drafts and unrelated staging are outside this commit. This evidence covers standalone local source and the frozen preview; it does not promote a template release or deploy a dealer. The dev server remains available on port 5174.
