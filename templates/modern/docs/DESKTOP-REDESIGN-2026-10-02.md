# Modern desktop refresh

The desktop layout at 1024px and above now uses a consistent 1280px content frame, a showroom hero with an overlapping search panel, quieter inventory cards, and a listing gallery aligned with the sticky price/contact panel. Boxcar informed the spacing and hierarchy; the Modern identity, existing imagery, data boundaries, URLs, and enquiry behavior remain in use. Service pages use the same frame and simpler headings/forms.

Mobile components and styling below 1024px were preserved. The environment default assignment was also corrected to avoid invalid compiled public-origin assignments in the local preview; existing configured origins retain precedence.

Validation completed on 2 October 2026 with Node 22.23.2 and pnpm 11.4.0:

- Web typecheck and isolated public-demo production build passed.
- Biome passed for all 19 changed source/test files.
- 271 unit tests passed across Web and Marketplace UI.
- Seven desktop browser checks passed, covering navigation, layout at 1024/1440/1920px, filters, financing/import flows, gallery focus, information tabs, and phone handoff.
- Eight mobile browser checks passed in Chromium and WebKit.
- Home, inventory, listing, leasing, import, and sell routes rendered successfully without horizontal overflow. All twelve mobile before/after comparisons at 320px and 390px retained the same measured geometry. Some thumbnail decoding and tiny paint differences prevent a blanket pixel-identical claim.

Local review preview: http://127.0.0.1:6482/bg. Screenshots and detailed comparison reports are in the ignored `runtime/desktop-redesign-2026-10-02/` directory. This is a source implementation and local verification record; template release selection, owner visual acceptance, and dealer publication remain separate steps.
