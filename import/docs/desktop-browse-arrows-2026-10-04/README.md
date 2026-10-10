# Desktop browse arrows — 4 October 2026

The five Home browse cards now use a white arrow inside the existing 48px black circle from 768px. Stock, makes, body types, reviews and guides consume `HomeBrowseCard.svelte`; each card remains one native link with its localized destination and accessible context.

The SVG has an explicit decorative-arrow class. The component's redundant local focus rule was removed because the shared protected keyboard-focus rule already supplied the actual outline. Keyboard focus remains a 3px black outline with a 3px offset and white contrast shadow. The card dimensions, white surface, radius, artwork, typography and neutral hover retain their existing owners.

![Before: Home hero and stock grid](before-home.jpg)

![After: Home hero and stock grid](after-home.jpg)

Both screenshots show the source-rendered BG Home at 1440×1000 with the same scroll position. All five card dimensions match the before measurements exactly at this width.

Validation covers BG/EN Home at 768/1024/1440/1920px: five matching black-circle/white-arrow cards per case, no nested controls and no page overflow. The existing browse-card tests verify keyboard navigation and all five native destinations, including BG/EN with JavaScript disabled. BG/EN at 320/390px retains identical computed geometry, typography, surfaces and arrow presentation for all four rendered mobile browse cards; this is focused component preservation evidence.

`verification.json` records the checked source hashes and actual command results. The isolated build uses the existing frozen QA workspace with Node 24.21.0; the live Vite server on port 6790 is retained. These are local source checks, separate from template release selection and dealer publication.
