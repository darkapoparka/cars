# Desktop manufacturer catalogue

Auto Best's desktop Make selectors use the 178 car-make names from the Cars
Mobile picker, plus the existing Dongfeng Home brand. Names and logos come from
`templates/mobile/src/lib/makes.ts` and `templates/mobile/public/images/makes/`
as preserved at Cars commit `70ac9bca22df90a9ce15bbc1abaeb96c2a01897b`.
The original template records mobile.de Android 10.26 as its captured reference
in `templates/mobile/TEMPLATE.md`; this is a local catalogue, not an inventory feed.

The 149 additional WebP files in `static/assets/images/makes/` are byte-identical
copies (453,264 bytes total). Alpha and white-canvas bounds were measured for
optical sizing; the image pixels were not changed. White catalogue canvases blend
with neutral option surfaces through CSS. Auto Best's 13 existing curated manufacturer
assets take precedence, including its Volkswagen badge. Those original assets
and their provenance remain preserved.

The names and lookup metadata live in `src/lib/data/desktop-makes.ts`. Shared
existing artwork and bounds live in `src/lib/data/make-artwork.ts`. Makes without
supplied artwork retain their full name and the template's neutral car glyph.
Manufacturer marks retain their original identities and ownership.

Visible availability counts come only from Auto Best's actual inventory module.
Catalogue additions do not add vehicle records or model families. Phones and
tablets retain their stock-derived picker options.
