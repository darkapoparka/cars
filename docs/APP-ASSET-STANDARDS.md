# App identity and manufacturer artwork standards

Shared implementation belongs in `templates/app`. Port 6483 is the local master preview; 6475 is Navara's mounted `/variant-4` copy. Verify current listener ownership before relying on those ports. Dealer copies receive reviewed changes through the existing Cars workflow, preserving their own configuration and assets.

## Dealer identity

Use the dealer's approved recognizable logo through `lib/dealer.json` and `DealerBrand`. The template preview must use this same image path, not a text/icon shortcut that hides asset problems. `logo.dark` means a logo designed for dark surfaces; `logo.light` means a version for light surfaces. Preserve transparency, proportions, letterforms and colors. Inspect the banner, white desktop header and compact menu at real display size.

Use original SVG artwork or a clean transparent raster at sufficient resolution. Do not stretch a logo, retain an accidental white rectangle, crop its letters, or enlarge a tiny screenshot. Keep the first banner compact and dealer-focused; contact actions remain secondary and use only configured verified destinations. Never invent a phone number or showroom address to fill a demo.

For requested generated logo work, use the imagegen skill and the configured built-in image tool. Ask for an actual transparent asset, exact brand spelling, tight but uncropped framing, and dark/light variants with the same identity. Do not claim a model version unless the tool exposes it. Preserve the original generation and save a web-optimized copy in the project. Record prompts and identify generated proposal/demo identity clearly. Existing approved client logos such as Navara remain their own assets; a template refresh does not replace them with Drive24.

Drive24's generated silver and graphite wordmarks are demo identity for this master, not a client default to carry into release. Source/prompts: `templates/app/docs/branding-polish-2026-10-01/PROMPTS.md`.

## Manufacturer strip

Cars24's retained reference uses consistent circular slots, a centered emblem and a separate make label. Match that structure and optical balance, not a single arbitrary percentage applied to differently padded files.

- Keep original detailed framed App badges intact; do not add a second circle around their baked-in frame.
- Other sourced emblems use the same 72px mobile circular slot. Their visible symbol occupies roughly 36–44px; wide wordmarks may use about 54px. Desktop slots scale proportionally.
- `lib/brand-logos.ts` records source dimensions and symbol view boxes. SVG view boxes remove transparent padding and duplicate embedded wordmarks at render time without modifying original artwork. Preserve the full manufacturer's symbol.
- Manufacturer artwork is sourced, not generated. Record provenance in `public/brands/emblems/SOURCES.md` and include every actually stocked make.
- Inspect the whole strip, including later horizontally scrolled items. Verify legible labels, equal circle size, no clipped symbols and working make filtering at 320px and 390px.

## Card composition

Keep regular-weight titles, clear euro prices and larger photos. The current mobile image occupies 44% of the card's content width. Following the latest owner correction on 1 October, mobile uses a single-line title with ellipsis and removes the card wishlist button and its reserved title space. Facts stay on the right in one horizontally swipeable, keyboard-scrollable row; preserve full text rather than wrapping or dropping equipment. Desktop retains its wishlist button and two fact rows. Keep facts beside the photo.

Keep polish scoped. Use the original Cars24 captures as evidence for a specific improvement; do not copy unrelated marketplace claims, login prompts, campaign guarantees or another dealer's identity.
