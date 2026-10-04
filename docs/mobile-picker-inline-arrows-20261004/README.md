# Mobile picker: arrows beside family names

The leading disclosure arrows created an extra column and indented plain model
names. On mobile, the disclosure now follows its family name with an 8px gap.
Plain model names align with family names; children retain a 16px indentation.
The text button still expands a family and the separate native checkbox selects
it. The existing All brands and All models reset treatments are retained.
Desktop keeps its trailing disclosure arrows and square checkboxes.

Matched Bulgarian captures use the same initial draft, scroll position, viewport
and family expansion state. Before captures came from the previous 6474 build;
after captures use the verified replacement build, also served on 6474.

| State | Before | After |
| --- | --- | --- |
| Brands, 390 x 844 | [Before](before-makes-390.jpg) | [After](after-makes-390.jpg) |
| Models, 390 x 844 | [Before](before-models-390.jpg) | [After](after-models-390.jpg) |
| Expanded family, 390 x 844 | [Before](before-expanded-390.jpg) | [After](after-expanded-390.jpg) |
| Desktop, 1440 x 900 | [Before](before-desktop-1440.jpg) | [After](after-desktop-1440.jpg) |

Validation: Node 22.20.0, lint, TypeScript, formatting and all 92 domain/localization
tests passed. The production build generated 51 pages. The existing focused
browser suite passed all 12 Chromium/WebKit combinations of Bulgarian/English
at 320, 390 and 1440px, covering arrow geometry, reset controls, family expansion,
mixed selection, row-padding taps, keyboard removal, back navigation, search/apply,
overflow and console errors. See [verification](browser-verification.json).

This is Mobile candidate source polish. The approved release lock and dealer
deployments are unchanged.
