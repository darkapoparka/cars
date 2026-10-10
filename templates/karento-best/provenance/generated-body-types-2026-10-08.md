# Generated desktop body-style illustrations

The owner requested visual body-style choices and lightweight WebP assets on
8 October 2026. One coordinated transparent PNG was generated with five generic
silver side profiles: Hatchback, Sedan, SUV, Estate and Pickup. These are
illustrative selector artwork, not photographs of dealer inventory.

The 2172 × 724 source PNG is preserved unchanged in the generated-images folder
and in the ignored local evidence. Its size is 543,988 bytes and SHA-256 is
`a013fda543532c829245d7bf5d5d9a862c1eb8cbf4901edca11a0b16c4d6688a`.

The five profiles were exported onto equal transparent 320 × 160 canvases with
a shared scale and baseline. WebP quality 82 and alpha quality 85 retain their
silhouettes and soft shadows. The five files in `static/assets/imgs/body-types/`
total 44,608 bytes. No generated PNG is served by the application.

`src/lib/data/body-type-artwork.ts` maps existing type values to the artwork.
The desktop Type picker renders the images only while open and retains visible
names, selection feedback and keyboard controls. Unrecognized dealer body styles
retain their name with a neutral generic glyph. These images do not introduce
inventory records or classify ambiguous vehicles.

The source crops, output dimensions, bytes and hashes are recorded in
`.runtime/evidence/desktop-final-polish-2026-10-08/body-artwork-receipt.json`.
The generated hero image and original reference assets remain unchanged.
