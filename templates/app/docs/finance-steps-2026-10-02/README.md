# Finance steps

Checked the live [Cars24 UAE loan page](https://www.cars24.ae/car-loan/) and retained native captures `reference/2026-09-26-continuation/finance-how-427.png` and `finance-how-2-427.png` on 2 October 2026. The reference puts a small illustration beside a numbered title and short explanation; desktop uses three columns.

Finance now follows that composition with monochrome imagery and the existing shared `title` and `body` typography. The six steps remain an informational ordered list. Artwork is configured in `lib/showroom-art.ts`; the car and euro/key assets are existing App artwork, and the unbranded people/document images are retained comparison assets. No new reference assets were downloaded. Existing release rules for retained reference artwork still apply.

The hero, calculator panel and overlay, four finance benefits, budget campaign, Sell and Service remain unchanged.

Verified the Bulgarian route at 320, 390, 768 and 1440 CSS pixels: six steps, one/two/three columns, loaded images, no horizontal overflow, and no button or link inside the process list. Screenshots and DOM measurements are saved here. `npm run check` passed with Node 22.20.0 (lint, TypeScript, optimized build). Workspace doctor fetched Cars main with no main drift; unrelated checkout changes were preserved.
