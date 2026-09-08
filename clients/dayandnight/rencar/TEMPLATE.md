# Rencar — strict Day & Night skin

Base: `rencar@2026.09.06-baseline`, `J:/cars/templates/rencar`. Client: `J:/cars/clients/dayandnight/rencar`. Current direction: original Rencar with branding/assets only. V1 was rejected for rebuilding the project.

Read README.md and AGENTS.md. The original template guide is retained at `.template/source-template.md` and the source manifest at `.template/source-manifest.json`.

The active application uses Rencar's original `src/App.svelte`, `src/template.js`, `src/pages`, `src/manifest.json` and asset CSS/JS. There is no active `src/client` application. Preserve all original home variants, page sections, navigation, cards and widgets.

Personalization boundaries: `public/daynight/brand.css`, existing image URLs, text/identity substitutions in source pages and metadata titles. `.client/skin-changes.json` records this pass. No shared master improvement or dealer conversion has been performed.

The owner's subsequent motion/surface polish request is implemented separately in `public/daynight/polish.css` and `public/assets/js/main.js`. It rounds/insets Home 1's existing header and booking panel, calms hovers, removes section/hero entrances and disables carousel autoplay. Original page structure remains intact. See AGENTS.md for this narrow exception; migration to native Svelte components remains a future decision.

The original rental/sample content remains a visual reference, not verified client content. Do not publish it as an actual dealership implementation. New functional adaptation requires the owner to request it. Exact page URLs and preview commands are in README.md.

Subsequent owner-requested composition pass: Home 1's About uses a centered intro and three source-backed service items; its collage and experience badge are removed. Header width follows the top-bar content plus a 24px overhang on each side. Why choose us and Homes 2–5 retain their compositions. Governing guide: `J:/cars/docs/RENCAR-STYLEGUIDE.md`. Promotion procedure: `J:/cars/docs/TEMPLATE-PROMOTION.md`. The proposed `rencar-polished` master does not exist yet.

Further explicit Home 1 refinement: bounded top information strip; centered compact headline/car hero; higher booking box; no repeated name, filler, decorative shapes or About More/Learn More buttons. The three manual slides and original booking form remain. See `.client/hero-qa/` and the style guide for the current state.
