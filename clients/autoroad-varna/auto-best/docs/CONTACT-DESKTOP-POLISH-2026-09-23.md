# Contact desktop polish — 23 September 2026

## Current implementation

General Contact follows the centered About hero composition. `ContactActions.svelte` renders a compact call/directions row, the address and social links. The two cards and repeated card headings are removed. Actions start at the shared 320px baseline; their content stays in document flow within the shared 540px hero.

The component owns its presentation and reads actual dealer contacts and localized address data. It uses existing typography, color and button tokens, with 48px primary actions, 44px social targets, visible keyboard focus and reduced-motion support. No new artwork, dependencies or translation strings were added.

`ContactIntent.svelte` retains the existing mobile Contact layout and other enquiry journeys. General desktop Contact hides that mobile presentation. Obsolete desktop card markup and styles were removed. The route owns component assembly and spacing to the map.

Earlier fixes to the duplicate desktop Sell heading and clipped duplicate viewing call action remain in place. Unrelated working changes are preserved.

## Verification

- `npm run validate`: architecture, CSS policy, tokens, typography, assets, domain, locale checks, Svelte diagnostics and production build passed; zero Svelte errors/warnings.
- Bulgarian desktop at 1440px and English at 1024px: no horizontal overflow; primary actions remain at the shared baseline.
- Keyboard Tab proceeds from the phone button to Directions and then social links, with a visible focus ring.
- At 390px, desktop actions are hidden and the existing mobile Contact grid and 248px hero remain; no horizontal overflow.
- Matching 1440×900 before/after screenshots: `artifacts/contact-centered-actions/before.png` and `after.png`. Earlier Contact artifact directories document superseded designs.

## Limits

Google Maps remained blank in the test browser before and after the change. External map rendering and real enquiry delivery are not verified. No calls or enquiries were submitted. These are working-checkout checks, not template-release or dealer-deployment evidence. Only Contact component, route and report changes belong to this pass.
