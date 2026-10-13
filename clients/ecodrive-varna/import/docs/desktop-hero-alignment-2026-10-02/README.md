# Shared desktop hero alignment

The image heroes already shared their minimum height, but vertically centering the whole content stack placed their headings at different heights. Desktop `PageIntro` now anchors the heading at a shared 32px top inset and flows caption and action slots downward with a shared 16px gap. It owns centered alignment for all intro routes; the redundant desktop alignment prop and its route arguments were removed. Backgrounds, artwork, controls and independent mobile compositions retain their existing owners.

At 1440 × 1000, every intro heading now starts at y=126 below the 94px header. Image hero frames remain 400px; the existing 450px minimum at narrower desktop widths remains. Text-only intros use their content-sized frame and the same heading anchor. Neither Home mode changes nor selected inventory filters move the heading.

## Before and after

Screenshots show the live development server at 1440 × 1000. Coordinates refer to heading boxes, not individual glyph pixels.

| Route                                              |     Before heading top |  After heading top | Screenshots                                                          |
| -------------------------------------------------- | ---------------------: | -----------------: | -------------------------------------------------------------------- |
| Home                                               |                122.8px |              126px | [Before](before/home.jpg), [After](after/home.jpg)                   |
| Inventory                                          |                160.4px |              126px | [Before](before/inventory.jpg), [After](after/inventory.jpg)         |
| Services                                           |                160.4px |              126px | [Before](before/services.jpg), [After](after/services.jpg)           |
| About                                              |                196.4px |              126px | [Before](before/about.jpg), [After](after/about.jpg)                 |
| Contact                                            |                196.4px |              126px | [Before](before/contact.jpg), [After](after/contact.jpg)             |
| Sell                                               |                251.4px |              126px | [Before](before/sell-your-car.jpg), [After](after/sell-your-car.jpg) |
| Import                                             |                251.4px |              126px | [Before](before/import.jpg), [After](after/import.jpg)               |
| Financing                                          |                251.4px |              126px | [Before](before/financing.jpg), [After](after/financing.jpg)         |
| Blog, FAQ, Reviews, Calculator, Compare, Favorites | 148px and left aligned | 126px and centered | [Before data](before/desktop.json), [After data](after/desktop.json) |

## Verification

- [Desktop matrix](after/desktop.json): 14 routes × Bulgarian/English × 768/1024/1440/1920px = 112 states. Every heading has a 32px top inset, centered positioning and the same typography at each width. Captions have the same 16px gap. Content fits inside its frame, with no horizontal overflow.
- [Mobile comparison](mobile-comparison.json): all 14 routes at 320 and 390px match the captured baseline text, visible geometry and image URLs. No horizontal overflow. Raw mobile evidence is retained in the task's temporary QA snapshot.
- [Interaction checks](interaction-checks.json): all four Home modes retain the same heading position and 400px frame; selected BMW inventory at 768px retains the same heading position and fits its 450px frame. No browser warning/error logs were captured.
- Svelte check: zero errors and warnings. Scoped ESLint and Prettier passed.
- Architecture and asset checks passed. Unit tests: 18 files and 124 tests passed.
- Production build passed in the existing temporary QA snapshot on C:, with 629 source files matching the live source. The build retains the compatibility `@reference` minifier warnings; no new hero diagnostic was reported. The running development output was not rebuilt.

The source and local build are separate from owner visual acceptance, a template release or a dealer deployment. Preview: [Home](http://127.0.0.1:6790/bg), [Inventory](http://127.0.0.1:6790/bg/inventory), [About](http://127.0.0.1:6790/bg/about).
