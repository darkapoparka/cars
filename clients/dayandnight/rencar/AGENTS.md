# Day & Night Rencar — strict reskin

The owner explicitly rejected V1 on 2026-09-06 because it rebuilt Rencar. Fast Skin remains branding, colours, image references and business text only. Subsequent explicit owner polish requests are the narrow exceptions below, not permission to rebuild the application.

- The actual Rencar source in `src/pages` is authoritative. Keep all 45 pages, five homes, original section structure, navigation, cards, forms, typography and breakpoints. Only the narrow polish exception below changes presentation or motion.
- `src/App.svelte`, `src/main.js`, `src/template.js` and the original asset CSS remain byte-identical to `J:/cars/templates/rencar`. The only changed original widget script is `public/assets/js/main.js`, for the explicitly requested motion reduction.
- Branding is in `public/daynight/brand.css`. It changes colour values and preserves original image boxes when a replacement image has a different aspect ratio. Do not add layout rules here as a shortcut to redesign.
- `.client/skin-changes.json` records the source-page substitutions. Do not rerun the initial substitution script over edited client work.
- Home 1 is the original default `/`. Homes 2–5 use their original `/index-2.html` through `/index-5.html` URLs and Rencar's existing Home menu.
- The rejected custom `src/client` implementation and its documentation are archived in `.client/rejected-v1`. Do not reintroduce them or reuse their QA claims.
- This is a visual reskin draft. Original rental widgets, sample stock, example email/hours, testimonials and remaining template copy are intentionally still present. They are not verified Day & Night business facts or live functionality. Do not claim outreach readiness or silently convert them into a new sales application.
- Preview: 6601, physical folder `J:/cars/clients/dayandnight/rencar`. Verify listener ownership. Master 6430 stays separate.
- Shared dealer conversion, new components, redesign, refactors, dependency changes, deployment and outreach need an explicit request. No CRM identity changed.

## Owner-requested polish exception — 2026-09-06

After accepting the restored reskin, the owner requested cleaner hovers, fewer section reveals and rounded/inset header and booking surfaces. `public/daynight/polish.css` holds these limited overrides. `public/assets/js/main.js` disables WOW section reveals, hero entrance choreography and automatic carousel rotation; manual carousel controls remain. Page markup, branding and original layouts remain intact apart from the specified surface bounds. This is a client review trial; the master is untouched. The owner's question about Svelte migration is a discussion, not authorization for another rebuild.

## Centered section and library guidance — subsequent request

Read `J:/cars/docs/RENCAR-STYLEGUIDE.md` and `J:/cars/docs/TEMPLATE-PROMOTION.md`. The owner explicitly requested a narrower header and cleaner section compositions informed by 5173. The header now follows the top-bar content width plus 24px per side. Home 1's About section is a centered introduction above three services from the existing 5173 demo, replacing its collage, example rental benefits and unverified experience badge. It retains the original About route. This is the only page markup changed beyond the original reskin. Why choose us is explicitly preserved; other variants and editorial sections are not silently redesigned. `.client/skin-changes.json` is the earlier reskin record, not a current hash assertion for Home 1. See `.client/section-qa/` for this pass. `rencar-polished` is a proposed future master, not yet created or registered.

## Subsequent Home 1 hero cleanup

The owner then explicitly requested a centered shorter hero, higher booking box, removal of the red business-name eyebrow and About More/Learn More buttons, and a top information background ending at the header bounds. Home 1 now uses `header-contained` and `hero-centered` scopes: compact factual top strip; centered headline/car; no hero filler copy, spiral or diagonal shapes. All three manual slides remain. The booking form itself and everything below it are unchanged by this pass. Its evidence is in `.client/hero-qa/`. This is an additional authorized Home 1 markup exception; do not restore the removed clutter or apply it to other variants without scope.
