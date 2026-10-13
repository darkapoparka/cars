# Desktop manufacturer picker marks

The owner requested the logo treatment used in the live Drive24 (6491) and
Auto Best (6461) make pickers. Karento Best reuses twelve existing WebP marks
from `templates/mobile/public/images/makes/`: Audi, Chevrolet, Ford, GMC,
Hyundai, Jeep, Kia, Mazda, Mini, Porsche, Subaru and Toyota.

The copied files in `static/assets/imgs/makes/` are byte-identical to the local
Mobile source and total 34,814 bytes. Their original identities and ownership
are preserved. The Mobile source records its imported reference in
`templates/mobile/TEMPLATE.md`; Auto Best also uses that catalogue, as recorded
in `templates/auto-best/provenance/desktop-make-catalogue-2026-10-07.md`.

`src/lib/data/manufacturer-artwork.ts` records the measured visible bounds.
The picker normalizes the displayed size through CSS without changing image
pixels. Names remain visible and supply the accessible labels. Buick and any
unrecognized dealer make retain their name with a neutral initial fallback.
Artwork does not add catalogue makes, vehicle records or model families.

The local evidence receipt, including source and destination hashes, is at
`.runtime/evidence/desktop-make-logos-2026-10-08/asset-provenance.json`.
