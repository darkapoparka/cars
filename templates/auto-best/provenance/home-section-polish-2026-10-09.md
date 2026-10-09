# Photographic Home banner polish — 9 October 2026

The owner requested finished lead-choice banners, retaining all five styles, with more convincing Kerbs and preservation of the Nürburgring option's asphalt and left edge. This is reusable master work on Cars main, not a template promotion or dealer update. The default remains `kerb`, with the compact mobile Featured Cars placement. The earlier comparison history remains in [the original provenance](home-section-comparison-2026-10-08.md).

## Generation and selected assets

The built-in `image_gen.imagegen` tool generated the new paired photographic kerb plate from the retained `home-section-circuit-asphalt-v3.webp` material reference and `home-section-kerb-paired-v4.webp` curve reference. The direction requested realistic matte painted concrete, warm off-white and restrained red, coherent overcast light, fine irregular asphalt, two inward curves, and a quiet centre without text, logos, vehicles, maps or UI. It explicitly replaced the previous smooth plastic-like segments and black/silver piping. These are decorative generated materials, not photographs of verified dealer premises or a claimed track location.

Generated original, retained unchanged: `C:/Users/radev/.codex/generated_images/01a11f61-3cce-7182-90a9-d4f6335b5a5d/exec-e761bb09-9f3a-47db-bc88-f4509d319362.png` (2172 × 724).

| Public asset under `static/assets/images/template/` | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `home-section-kerb-photographic-v5.webp` | 2172 × 724 | 503426 | `993dcaec97acc3e3aa671151a310957395af7f598bd0c1ff7df1bebc66d580b6` |
| `home-section-kerb-photographic-v5-960.webp` | 960 × 320 | 84888 | `4323cf68d34553abb90471f114e65a096faee95c674597af8eb90c8ade13584b` |
| `home-section-circuit-asphalt-v3-960.webp` | 960 × 349 | 17056 | `6a99872ddf1630fa4693b200def1112b923f862965d77f4803a3df6768a0b134` |

Sharp encoded the complete kerb canvas as WebP at quality 88, effort 6. Mobile encodings use proportional 960px width, WebP quality 84, effort 6. No cropping, compositing or material editing was performed in encoding. The original `home-section-circuit-asphalt-v3.webp` remains byte-identical. Its public-domain Nordschleife SVG remains separate and unchanged.

A generated circuit refinement, `exec-a6f7f93b-4589-4ad8-985b-aba29d8d5019.png` in the same Codex generated-image directory, was rejected because its material did not improve the retained asphalt. It is generation history, not a runtime asset. The superseded paired v4 kerb remains inventoried for provenance.

## Rendering and client choice

The Kerbs choice renders each photographed corner at its natural aspect ratio. The right edge uses its own source pixels, without CSS reflection or rotation. A quiet asphalt background connects the corners; fades stay behind live text. In the final owner-requested direction, the Nürburgring/Circuit choice omits the map and reflects its admired photographic left edge onto the right, preserving the asphalt and left pixels. The vector remains retained for history. Existing heading and button typography, 164px desktop geometry, destinations, tablet presentation and other mobile sections remain intact.

All five config keys and existing BG/EN preview links remain available: `motorsport`, `kerb`, `circuit`, `headlights`, `taillights`. Published mode still takes the configured choice and omits the review selector. Nothing changes `templates.lock.json`, dealer checkouts or a deployment.

## Verification

Matched Chromium captures and browser records are under [banner evidence](../docs/banner-polish-2026-10-09/). The focused matrix includes 320/390px BG/EN mobile, 992/1440/1920px desktop, all five desktop choices, review selection with focus/scroll preservation, and unaffected 768/991px tablet views. Node 22.20.0 is the verification runtime. The Svelte autofixer retains its advisory about the existing localized `goto()` wrapper; that handler already calls `resolve()` and the browser selection checks exercise it.

The browser captures are visual evidence for review. Owner acceptance, immutable template release and hosted dealer verification remain separate.

The mobile Headlights choice also has a restrained dark centre overlay, preventing its white title from crossing bright lamp details. Its raster plate and desktop presentation remain unchanged. The final built-browser pass includes this choice at 320/390px.

The final paired-kerb Circuit source passes the production build, Svelte/TypeScript with zero errors and warnings, 14 fresh built-preview HTTP/configuration cases and six built-browser cases. Four additional development-browser cases verify the final Circuit at 320/390/992/1440px. The comparison and choice sheets were regenerated with that finish.

The owner's subsequent mobile review request adds a centered pill below Contact in the menu. A separate native dialog offers the five choices without expanding or moving the menu. Selection closes both dialogs and navigates to the Featured Cars banner; dismissal returns focus to the pill. Review gating remains shared with the desktop control, so published dealers use their configured variant. This control selects existing assets and does not generate new artwork.
