# About and Contact artwork — 9 October 2026

The desktop company banners used a cover crop inside a 540px hero. At smaller
desktop widths their image layer also moved down by 140px, changing the visible
car size and floor position. Both images now retain their natural 3:1 ratio and
share a floor anchor 50px above the hero bottom. The title, actions and foreground
layout retain their positions. Home/Cars cutouts keep their existing laptop inset.

Two image edits remove the dotted backdrops while preserving the original car
compositions over quiet charcoal. Each optimized WebP is 2160×720; the About
asset is 68,164 bytes and Contact is 58,936 bytes. Original assets and generated
PNG outputs are retained. [Generation provenance](../../provenance/company-hero-polish-2026-10-09.json)
records the prompts, inputs, encoding and hashes. These are decorative template
illustrations, not verified dealer premises or inventory photographs.

| Surface | Before | After |
| --- | --- | --- |
| About, EN 1440×900 | [Before](before-about-1440.png) | [After](after-about-1440.png) |
| Contact, EN 1440×900 | [Before](before-contact-1440.png) | [After](after-contact-1440.png) |
| About, EN 992×900 | [Before](before-about-992.png) | [After](after-about-992.png) |
| Contact, EN 992×900 | [Before](before-contact-992.png) | [After](after-contact-992.png) |
| About, EN 390×900 | [Before](before-about-390.png) | [After](after-about-390.png) |
| Contact, EN 390×900 | [Before](before-contact-390.png) | [After](after-contact-390.png) |

Node 22.20.0 checks passed: Svelte (zero errors/warnings), architecture, CSS,
tokens, Inter/Fluent visual-system pins, assets (368 guarded files), and locale
source policy. Svelte autofixer reviewed the affected scene component.

[33 responsive cases](verification.json) cover EN widths 320–2560, BG at
390/992/1440, and the three desktop service entries that reuse Contact artwork.
They check natural proportions, centered framing, the shared floor, accessible
hero actions and no horizontal overflow. The eight matched captures preserve
foreground geometry; the two 390px pairs are byte-identical. Mobile artwork and
desktop asset loading boundaries remain unchanged.

The isolated production bundle passed, followed by
[15 compiled-preview cases](production-verification.json). The separate
[Cars toolbar correction](../cars-toolbar-polish-2026-10-09/README.md) is included
in that bundle. QA used task-owned output under `node_modules/.cache/` so the
other running preview and ordinary build output were preserved. Adapter
packaging, template release selection and dealer deployment were not run.

These are local shared-working-tree checks. The [source fingerprints](source-hashes.json)
identify the rendered source, including concurrent work left outside this task's
scoped commit. Build evidence does not claim owner visual or release acceptance.
