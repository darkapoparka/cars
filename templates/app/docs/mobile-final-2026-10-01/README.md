# Shared dealer home mobile finish — 1 October 2026

The canonical source is `L:/CODEX/cars/templates/app` on Cars main. The earlier home branding, manufacturer badges, search count and card-fact changes already existed identically in this master and the Navara App copy. This pass retains that work and finishes the dealer banner here. Navara is a local personalized verification copy, not the template source.

## Result

- Service buttons remain above a compact graphite dealer panel; search follows immediately below it.
- The panel uses the dealer's original proportional `logo.dark` asset, city and configured phone. The 40 KB generated satin background is decorative, with no generated identity. Exact prompt and provenance: `../../public/showroom/black/DEALER-SATIN-PROMPT.md`.
- Location opens a bottom drawer on phones and a centered dialog on wider screens. It shows the configured dealer name/address, Google Maps destination and phone when available. Missing template contact data produces no invented destinations.
- The drawer uses the existing modal hook for focus containment/return, inert background, scroll locking, Escape and browser Back. It is portalled outside the clipped banner.
- Search retains regular 16px text and the actual inline result count, with a clearer border and keyboard focus outline.
- Stocked manufacturer emblems and the previous one-row scrollable card facts are retained.

## Verification

Node 22.20.0; `npm run check` passed for master and Navara (ESLint, TypeScript, Next webpack production build), using isolated `.next-build-check` outputs. The first Navara build compiled but hit a transient Windows open error on `next-env.d.ts`; exclusive file access succeeded and the complete check passed on retry. No locks or recovery files were removed.

In-app browser checks: 320, 390, 768 and 1440px for both homepages; no horizontal overflow or broken loaded images; 44px contact targets; Navara logo preserves its intrinsic ratio. EN/BG dealer contact labels verified. The original Navara URL now serves the rebuilt output.

Interaction checks: location address/Google Maps/tel destinations; Escape, close button, browser Back and focus return; missing-contact template state; Nissan filter (2), Micra search (1), clear (2); save/unsave; detail and inventory return; 320px fact-row keyboard scrolling without wrapping. No call or external message was sent. Browser warning/error log was empty for the checked Navara routes.

Evidence: `layout-verification.json`, `master-home-{320,390,768,1440}.jpg`, `navara-home-{320,390,768,1440}.jpg`, `navara-location-390.jpg`, `navara-inventory-320.jpg`.

Local URLs: master `http://127.0.0.1:6483/bg`; Navara `http://127.0.0.1:6475/variant-4/bg`.

## Delivery boundary

No Vercel deployment or immutable fleet release was made. Existing public sites require the Cars exact-source refresh/package/publish workflow and dealer-specific logo/contact checks. Navara's local source differs from its existing package receipt until that requested refresh is prepared. Other client identities, inventory, previous screenshots and unrelated dirty work remain preserved.
