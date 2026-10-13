# Showroom map verification — 2 October 2026

The shared `ShowroomMap.svelte` now renders a real Google Maps embed on About,
Contact and vehicle pages. The map and native directions action use the showroom
coordinates in `brand.ts`; the map language follows the active locale. The
existing desktop company map remains intact. No API key or new dependency was
introduced.

The iframe mounts when its card is within 240px of the viewport. Hidden mobile
company maps do not mount during an initial desktop visit. A reserved 280px map
area avoids movement during normal loading. The address fallback can grow with
enlarged text, and directions stay available without JavaScript or when the map
provider cannot load. Mobile retains the official Hugeicons arrow.

Verified locally at `http://127.0.0.1:6461` with Node 22.20.0:

- CSS policy, token and typography checks passed.
- Svelte/type check passed with zero errors and warnings.
- Production build passed, including locale/catalog source checks.
- Chromium: 25 focused cases passed across the three routes, Bulgarian and
  English, 320/390/430px, 320px at 200% root text and 1440px desktop. These include
  correct map/directions coordinates, localized labels, touch targets, keyboard
  focus, deferred mounting, no horizontal overflow, no local runtime errors,
  enlarged no-JavaScript fallback text and a blocked-provider directions check.
- WebKit: all six cases passed across the three routes at 320px with normal and
  200% root text.
- Inspected the actual Google map, street tiles and pin, plus final rendered
  About and Contact screenshots.
- `node scripts/workspace-doctor.mjs --fetch` passed; unrelated source and staged
  work were preserved.

Final browser reports and two screenshots are retained under ignored
`runtime/showroom-map-20261002/`. These checks establish local browser behavior;
they do not claim physical-device acceptance, a template release or dealer
deployment. Modern, Carwow and Import already contain configured Google embeds
and were inspected read-only; this change belongs to the Auto Best master.
