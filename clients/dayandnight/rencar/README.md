# Day & Night · original Rencar reskin

The rejected rebuild has been removed from the active application. This version uses **Rencar's actual original pages and styling**, with Day & Night branding substitutions.

[Open Home 1](http://127.0.0.1:6601/) · [Home 2](http://127.0.0.1:6601/index-2.html) · [Home 3](http://127.0.0.1:6601/index-3.html) · [Home 4](http://127.0.0.1:6601/index-4.html) · [Home 5](http://127.0.0.1:6601/index-5.html)

Compare the corresponding original at port **6430**, using the same route. Rencar's existing Home dropdown also lists all five versions; the rejected custom comparison page is no longer used.

## Exact scope

- Day & Night logo and metadata.
- Red/charcoal brand colours through `public/daynight/brand.css`; the original theme stylesheet is intact.
- Existing hero/showroom image slots use selected assets from the owner's 5173 project. Original image boxes are preserved. The original wide multi-car artwork remains in Homes 3 and 5.
- Business name, main headline, phone and address substitutions in the existing markup. No new sections or controls.

The original App, runtime and all nine theme stylesheets are unchanged. `.client/skin-changes.json` and `.client/reskin-qa/` record the initial faithful reskin. The subsequent owner-requested Home 1 About composition is a documented exception; do not use that earlier hash report as current proof for Home 1.

The owner subsequently requested a narrow polish pass: quieter hovers, no section/hero entrance choreography, manual carousel rotation, and rounded/inset Home 1 header and booking surfaces. These changes live in `public/daynight/polish.css` and the original widget initializer `public/assets/js/main.js`. The other twelve widget scripts are unchanged. Current evidence is in `.client/polish-qa/`. No Svelte migration or shared master edit was performed.

The latest pass narrows the header to the top-bar content frame plus 24px each side and replaces Home 1's split About collage with a centered introduction and three service items from 5173. Why choose us is preserved. Current composition evidence is in `.client/section-qa/`; earlier polish evidence records the previous wider header. Read [the Rencar style guide](../../../docs/RENCAR-STYLEGUIDE.md) and [promotion procedure](../../../docs/TEMPLATE-PROMOTION.md). A future `rencar-polished` master can carry the finalized improvements into branding-only lead builds; it has not been created yet.

The subsequent hero pass centers and shortens Home 1's headline/car composition, removes the repeated business-name eyebrow, filler copy, shapes and two vague hero buttons, and brings the original booking box higher. Its top information strip now ends at the white header's bounds and contains only phone, location and appointment information. Existing manual slides remain. Current hero evidence: `.client/hero-qa/`.

## Review status

**Visual reskin draft, not an outreach-ready dealer application.** Original rental fields, sample cars/prices, example email/hours, testimonials and remaining English template copy are still present. They are source placeholders, not verified Day & Night claims. Their conversion/localization is intentionally deferred to preserve the owner's requested scope.

The previous custom dealer implementation, its documents and its QA claims were rejected and archived in `.client/rejected-v1`. Those checks do not describe this reskin.

## Local commands

Use the existing 6601 server if it belongs to this folder. `npm run dev` starts the same explicit port. Alternatively, from J:/cars:

```powershell
./scripts/start-preview.ps1 -Client dayandnight -Template rencar -Port 6601
```

`npm run check` · `npm run build` · `npm run qa:reskin`

Install with `npm ci` from the retained lockfile. Dependencies were not upgraded. Source/license notes and the original 5173 asset manifest remain in `.client/provenance/`. See [AGENTS.md](./AGENTS.md) and [.client/QA.md](./.client/QA.md) before further work.
