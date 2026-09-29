# Neutral showroom refinement

Follow-up to the owner's feedback on the red navigation treatment. Scope remains the local App candidate.

- Preserved the four-card service navigation, studio banner and compact icon-only dock.
- Removed pink/red selection surfaces. Expanded cards use a neutral fill and short charcoal indicator; scrolled compact tabs use charcoal with white text.
- Enlarged Buy/Sell artwork and reduced Finance/Services artwork for more even visual weight. Kept the existing assets.
- Changed the shared primary palette and native filter/focus controls to charcoal. The dark dock now has a white active circle.
- Made the banner purpose explicit: “Find your next car. Browse online. See it in person.”
- Reviewed the two edited React components: stable keys, semantic links, decorative artwork/indicator hidden from accessible names, `aria-current` and icon-only accessible labels preserved; no new hooks, client state or dependencies.

Source at start: Cars main `52114c11b6c44254dba1abaddc8a95ab1d91b6af`, fetched origin/main with 3 local and 28 remote divergent commits. Nine unrelated staged paths and the entire untracked App import remain preserved. No commit/push attempted: committing selected untracked component files alone would not create a complete runnable App import, and parent main requires reconciliation outside this visual refinement.

Validation: Node 22.23.2 `npm run check` passed (ESLint, TypeScript, production build and 205 generated pages). Development preview startup was slow and browser calls timed out; stopped only this task's dev processes and verified the completed production build instead. Production preview is running on port 6473.

Inspected 320x740, 390x844, 768x1024 and 1440x1000. No page-wide horizontal overflow; all four service cards fit. Verified the scrolled Buy tab has white text on charcoal, Sell active indicator, Sell/Finance/Services navigation, the hero inventory destination and return through the Home dock. The verification tab reported no console errors. Screenshots are under Cars `runtime/app-showroom-qa/v3-home-320.png`, `v3-home-390.png` and `v3-home-desktop.png`. Owner visual acceptance remains pending.
