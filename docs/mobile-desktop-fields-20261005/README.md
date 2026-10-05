# Desktop range fields and filter sidebar — 5 October 2026

At 1024px and above, the comfortable showroom range fields use white input surfaces within pale gray range cards. The desktop sidebar uses a white selected row, dark text, lighter unselected labels and a small orange marker. Keyboard focus remains a visible neutral ring. Existing phone and tablet defaults are retained.

Changed source: RangeField.tsx and ShowroomTabs.tsx. A concurrent ShowroomQuickPills.tsx phone shadow change was preserved and excluded from this commit. Generated preview configuration was kept out of the commit, and only this task's temporary generated includes were removed.

Validation: full source lint, TypeScript, 95 retained domain/localization tests, and a production build with 51 generated routes passed. Twelve focused Chromium/WebKit browser cases at 1023px, 1024x600 and 1440x960 in BG and EN passed; they cover range surfaces, sidebar selection, Home/End and vertical arrows, visible focus, mileage edit/apply/reopen, Escape and focus return. Twenty-four matched phone filter comparisons (price/year/more, 320/390px, BG/EN, Chromium/WebKit) found no sampled geometry, text, state or computed-style differences and no console errors. Pixel statistics are recorded separately, not described as blanket pixel identity.

Matched 1440x960 source captures: before on the left, after on the right. The comparison crop retains the entire modal and immediate surrounding context. See [BG mileage/sidebar](bg-more-before-after.jpg), [EN mileage/sidebar](en-more-before-after.jpg), [BG price](bg-price-before-after.jpg) and [EN price](en-price-before-after.jpg). Full source hashes and browser reports are in [verification.json](verification.json). The local preview remains on http://127.0.0.1:6478/.

This is local template source polish; no template release selection or dealer publication is included.
