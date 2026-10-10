# Centered company heroes and reference service artwork

Desktop About and Contact now use the shared side-profile cars, centered heading and a compact white action panel. The panel reuses `DesktopDiscoveryPanel`; its semantic width token also supplies the car clearance. Home and Inventory retain their existing width and geometry. About links to inventory and Contact. Contact supplies its configured phone number and an enquiry link to the existing form.

The six desktop service images were copied byte for byte from the Carwow master inspected at [port 6464](http://127.0.0.1:6464/bg/services). [The asset manifest](../assets/DESKTOP-COMPANY-REFERENCE-2026-10-02.json) records donor paths, source commit and hashes. The viewing crop preserves the car in its square source. Illustrative service imagery does not claim actual staff or premises. Rejected generated company hero images are preserved in ignored runtime evidence and are not referenced by the implementation.

Mobile composition, imagery and copy remain independent.

## Visual evidence

About and Contact before screenshots were captured on the live development server before this change. Services before is the prior saved state from `docs/desktop-services-process-2026-10-02/after/services.jpg`; it was not freshly recaptured for this comparison. After screenshots show the current implementation at 1440 × 1000.

| Route    | Before                                      | After                                                              |
| -------- | ------------------------------------------- | ------------------------------------------------------------------ |
| About    | [Before](before/about.jpg)                  | [After](after/about.jpg)                                           |
| Contact  | [Before](before/contact.jpg)                | [After](after/contact.jpg)                                         |
| Services | [Previous saved state](before/services.jpg) | [After](after/services.jpg), [lower row](after/services-lower.jpg) |

## Validation

- Svelte check: zero errors and warnings. Scoped ESLint and Prettier passed.
- Architecture check: 57 native route modules, 220 reachable modules and one Tailwind entry.
- Asset check passed, including the six reference assets.
- Unit tests: 18 files and 124 tests passed.
- Production build passed in a separate QA snapshot, preserving the running development server. Its 629 source files matched the live source by SHA-256 at validation. This is local build evidence, not a template release or hosted deployment.
- [Desktop checks](desktop-checks.json): About and Contact in Bulgarian and English at 768, 1024, 1440 and 1920px. Centered panels, two fitting actions, common hero heights and no horizontal overflow.
- [Mobile comparison](mobile-comparison.json): About and Contact at 320 and 390px matched the captured baseline text, visible element geometry and image URLs, with no horizontal overflow.
- [Service checks](service-checks.json): four columns at 1024 and 1440px, two at 768px; original mobile image sources at 320 and 390px; no horizontal overflow. Both service rows were visually inspected.
- [Action checks](action-checks.json): About links reached the intended routes; Contact enquiry scrolled to the visible form heading. Home and Inventory retain the 880px discovery width, 400px hero and default artwork clearance at 1440px.
- No warning or error logs were captured in the checked browser tab.

Preview: [About](http://127.0.0.1:6790/bg/about), [Contact](http://127.0.0.1:6790/bg/contact), [Services](http://127.0.0.1:6790/bg/services). Owner visual acceptance and any later template release or dealer deployment remain separate.
