# Black right-hand desktop hero actions

The owner requested black rather than grey for the right-hand About/Contact hero buttons. Both now select the existing `Action` **strong** variant: `--bc-ink` background and `--bc-white` text. The left action remains red. No new colors, theme tokens or component overrides were added. Mobile actions keep their existing variants.

[Current comparison gallery](http://127.0.0.1:6794/hero-content/) shows matched grey/black screenshots for About and Contact in BG/EN. Before images came from the canonical development server at 1440 × 680px; final after images use the frozen production preview. The previous hero-content screenshots remain in their original before/after directories.

The source change belongs to the desktop snippets in the two native route files. Existing action styling owns colors, hover and focus. The original destinations, sizes, typography, centered hero frame and artwork are preserved.

Verification is recorded in `verification.json`, `preservation.json`, `interactions.json` and the BG/EN viewport matrices. The saved Cars `main` checkout, Node 24.21.0 and retained npm lockfile were used. Unrelated staged/unstaged work and inherited Import ignore edits were preserved. This is local standalone verification; no template promotion or dealer deployment was performed.

- BG/EN About and Contact: 24 production viewport states at 320, 390, 768, 1024, 1440 and 1920px; no overflow, broken images or page errors.
- Eight mobile states exactly match before; all 16 desktop hero frames and titles retain their measurements and styling.
- Four production desktop button states use shared ink RGB(23, 25, 28) with white text; destinations, keyboard navigation, visible focus and local Axe checks pass.
- Existing focused browser suites: four passed, two viewport-specific skips, zero failures. Svelte/TypeScript: zero errors and warnings. Production build, scoped ESLint and Prettier pass.
- The four comparison pairs load all eight matched screenshots. Reviewed canonical source matches the frozen source used for checks and build; the npm lockfile is unchanged.
