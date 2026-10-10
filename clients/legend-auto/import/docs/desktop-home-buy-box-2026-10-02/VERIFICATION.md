# Desktop Home Buy box — 2 October 2026

The attached Buy, Finance, Sell and Import tabs retain their existing behavior. Buy now places the keyword entry above Make, Model, Price and Mileage. A labelled 44px Search icon sits inside the same visual field and follows the canonical inventory URL directly. The keyword entry retains the focused result dialog. Keyboard Enter opens that dialog, Escape restores focus, and Tab reaches the inset Search action.

`DesktopHomeSearchEntry.svelte` owns the compound control, with separate native button and link targets. `DesktopHomeHero.svelte` retains the query, dependent model selection and mode state. Sell and Import use a separately named form row, so Buy styling cannot change their field layout. Shared/mobile component styles and server URL contracts were not edited.

## Evidence

- [Before at 1440px](before-1440.jpg) and [after at 1440px](after-1440.jpg).
- [After at 1920px](after-1920.jpg) and [English at 768px](after-en-768.jpg).
- Bulgarian and English geometry checked at 768, 900, 1024, 1440 and 1920px: no horizontal overflow, search above the filters, 56px search row, 44px inset action and 48px filter controls. The shared hero remains 400px, or 450px at 768–900px.
- Make BMW plus keyword X5 submitted to `/en/inventory?brand=BMW&keyword=X5&lang=en` and displayed BMW X5 results.
- Full-page mobile Home screenshots are pixel-identical at 320px and 390px; see [pixel comparison](mobile-comparison.json).
- No browser console errors observed during the manual interaction.

## Checks

Pinned Node 24.21.0, retained npm lockfile and a frozen copy of the full working source were used. The three task-owned source/document paths still match the tested snapshot; hashes and geometry are in [verification.json](verification.json).

- Svelte check: zero errors and warnings.
- Scoped Prettier and ESLint: passed.
- Architecture check: passed.
- Production build: passed.
- Existing desktop-search, desktop-page-patterns and inventory browser suites against the frozen production preview on port 6832: 21 passed, 17 expected device-specific skips.

The live dev server on port 6790 retains its own build output. This is local source and browser verification; template promotion and dealer deployment were outside this refinement.
