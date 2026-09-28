# Remaining purple surfaces and inventory banner

The black banner configuration now also selects the five Sell method/guide illustrations through `showroom.artwork.selling`. The original compositions, source dimensions, subject placement and light copy areas are preserved. Built-in image generation changed the lavender decoration to silver and charcoal. Original blue-theme files remain. Exact prompts, source files and destinations: `public/showroom/black/SELL-PROMPTS.md` and `ASSETS.json`.

FeatureContent service package headers, contact tiles, outlines, checks and light borders now consume campaign theme tokens. Blue remains an explicit alternative; black uses neutral surfaces and charcoal actions. The desktop active navigation and brand accent match the selected theme.

The Cars promotion uses the showroom visit illustration, no eyebrow, a short heading, supporting sentence and a 32px visual CTA. The whole 160px-tall mobile banner is one accessible link to `/stores`, so the compact visual button does not shrink the tap target. Desktop height is 180px. Existing inventory filters, listing cards and mobile dock behavior are preserved.

Verification: `npm run check` (lint, TypeScript, production build), visual review at 320/390/1440px and layout measurements at 768px. Service information actions and both unconnected contact actions retain honest demo information. Sell valuation/trade-in lead to `/sell/details`; Cars promotion leads to `/stores`. No browser console errors were observed. Generated asset dimensions exactly match originals: methods 1536×1024, guides 1448×1086.

Evidence is in Cars `runtime/app-showroom-qa/theme-*`. This is local candidate work, not a dealer release or deployment.
