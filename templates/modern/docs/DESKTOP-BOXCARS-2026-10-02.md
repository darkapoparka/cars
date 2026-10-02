# Desktop correction from the Boxcars reference

The requested scope was Modern's desktop presentation, using the rendered project at `http://127.0.0.1:6455/` as styling reference. Mobile presentation and behavior were to stay unchanged.

## Implementation

- Removed the outer desktop app frame and restored a full-width white page, with consistent inner content gutters.
- Reworked the desktop header, photographic home hero, search panel, inventory spacing and showroom cards around the reference's hierarchy. The existing reviewed hero artwork, dealer identity, inventory and service boundaries remain in use.
- Connected the existing desktop discovery carousel to the unfiltered home page. Filtered results and the dedicated inventory route retain their results controls.
- Kept styling changes in desktop media queries and desktop tokens. The visible search action belongs to the existing desktop-only search component. No mobile component or mobile style rule was edited.
- Updated desktop assertions to check the photographic home, full-width page and retained filters/navigation. Navigation also verifies that the actual browser document survives category changes after initial development compilation.

## Verification

Local preview: `http://127.0.0.1:6482/bg` using Node 22.23.2, pnpm 11.4.0 and the existing provider-free demo mode.

- Inspected Home, Cars, Financing, Import, Sell, Contact and a vehicle detail page at 1024, 1440 and 1920px: 21 rendered states, HTTP 200, no page exceptions or horizontal overflow in the captures.
- Checked default Home filter labels in Bulgarian and English at 1024px in Chromium and WebKit, including opening/closing More filters: all labels fit; the final fresh-load run recorded no console errors, page exceptions or failing local responses. Earlier runs during development compilation logged transient chunk/hot-reload errors; the settled run and complete flow suite passed.
- Complete desktop Playwright run: **14/14 passed** across Chromium and WebKit. It covers route geometry, header stability, category/document continuity, search drafts, gallery/focus, financing preferences and import handoff.
- Mobile baseline comparison: Home, Cars, vehicle detail, Financing, Import, Sell and Contact at 320, 390, 767 and 1023px. **28/28 retained layout and typography**, with no page exceptions or horizontal overflow. **24/28 screenshots are pixel-identical**, including all 320px and 390px states. Four wider screenshots differ by small edge/rasterization pixels: Cars at 767px (83 channel bytes), vehicle detail at 767px (17), Import at 767px (36), vehicle detail at 1023px (18). The strict all-pixels-equal script therefore exits 1; this is not reported as an exact-pixel pass.
- Focused mobile menu/gallery/focus and listing-return journey: **2/2 passed** in Chromium and WebKit.
- Web unit tests: **186/186 passed**. Marketplace UI unit tests: **85/85 passed**.
- Web and Marketplace UI typechecks passed. Final optimized demo build passed after the last source edit. This establishes compilation; the browser checks above used the local development preview.
- Scoped Biome checks and `git diff --check` passed.

Captures, comparison JSON, Playwright results and the fetch-backed workspace report are in ignored `runtime/desktop-reference-20261002/`. The final 1024px screenshots are `final/bg-home-1024-chromium.png` and their locale/engine counterparts.

## Preview recovery and preservation

The L: drive had reached zero free space, and the running preview was retaining stale global CSS. After confirming listener ownership, the preview was restarted with its own fresh build directory. Three inactive physical Next development cache directories were moved, preserving their contents, to:

`C:\Users\radev\.codex\visualizations\2026\10\02\01a0fcc6-e64e-7511-b822-b8be29e52d39\modern-build-cache-recovery`

The preserved subdirectories are `desktop-revision-cache`, `desktop-redesign-cache` and `desktop-category-pills-cache`. This restored about 3.39 GiB on L: before the new compilation. Source, Git history, session/database data and recovery logs were preserved; no cache deletion or broad cleanup was performed.

The fetch-backed Cars workspace report showed main aligned with origin and unrelated dirty work in the Cars fleet, plus independent Admin drift. Those paths were preserved. The task's commit contains only Modern's desktop source, its focused desktop assertions and this receipt. Reference project files were not edited by this task. Template promotion, dealer refresh/deployment and owner visual acceptance are separate steps.
