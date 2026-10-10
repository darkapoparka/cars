# Mobile Home order and entry balance - 10 October 2026

Services follows the completed Buying guides section again. Its title, copy, artwork, action and destination are unchanged. The entire card remains the single link to localized About #process.

The mobile search prompt was 18px while the adjacent tabs and CTA were 16px. EntryCard now maps the prominent field typography to the existing 16px/450 field role below 768px. This applies to Home Buy/Import, Sell/Trade-in, Import listing/criteria and the Blog entry opener. The generic 18px desktop entry role and editor typography remain independent.

The existing proportions are retained: 16px card padding and stack gaps; centered 240px segment track with 44px targets and 40px selected paint; 48px fields; a centered 160px CTA with a 44px target and 40px paint. Shared 12px mobile card corners, 6px car fact corners, 10px inset car photos and Fluent Regular icons are preserved.

The four actual EntryCard consumers were inspected in BG/EN at 320/390/768/1440px. All visible desktop and tablet entry typography and geometry, plus Home section geometry, match the production baseline exactly. Mobile fields resolve to 16px with no horizontal page overflow. Existing shared-entry assertions passed in eight locale/viewport cases, including both selected states, keyboard operation, stable segment geometry, invalid-link validation and valid-link prefill. Focused checks also passed Home search focus/return, View all navigation, Services/article destinations, Sell and Blog focus/return, and 200% Home text in both modes at 320px.

CSS, token, typography, pinned visual-system and script syntax checks passed. EntryCard has no autofixer findings; Home retains the existing advisory for its localized goto(resolve(...)) wrapper. Physical phone keyboard behavior was not tested in this browser pass. The development server needed restart after the interrupted session and route warming before it responded reliably; successful checks use the recovered existing preview.

| Entry before | Entry after |
| --- | --- |
| ![Before](entry-before-390.png) | ![After](entry-after-390.png) |

| Home section order before | Home section order after |
| --- | --- |
| ![Before](services-before-390.png) | ![After](services-after-390.png) |

The retained visual evidence is these four matched 390px captures, this explanation and compact result.json. Before uses the preceding production variant; after uses the live local preview. Source publication and hosted verification are recorded separately, and this change does not promote the five-design dealer release.
