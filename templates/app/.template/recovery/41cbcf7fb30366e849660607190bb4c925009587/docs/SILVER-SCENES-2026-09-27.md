# Matching silver banner scenes

The Home, Sell, Finance and Services banners share the silver/charcoal styling, responsive height, typography, subtext and CTA spacing. Original generated scenes fill the Sell, Finance and Services backgrounds and blend into the silver surface. The Buy and Sell shortcut car cutouts are smaller and fully contained.

Generation used the built-in image tool with the existing Home studio image as the visual reference. Exact prompts and asset provenance are in `../public/showroom/SILVER-BANNER-PROMPTS.md`. The tool did not expose a model-version selector.

Validation: `npm run check` passed (lint, TypeScript and production build, 205 pages). All four affected routes were visually checked at 320px, 390px and 1440px; Home and Finance were also checked at 768px. Top shortcut navigation worked. The final Finance browser check reported no console errors. Screenshot evidence is saved under `L:/CODEX/cars/runtime/app-showroom-qa/`, including `silver-finance-final.png` and `silver-home-390.png`.

The local production preview remains on port 6473. This candidate was not published or promoted to a dealer release. Existing unrelated staged work was preserved.
