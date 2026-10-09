# Six-design selector logos — 9 October 2026

The owner's requested FAB now displays the actual Auto Best, Modern, Import, App, Mobile and Signature template logos. The active FAB also displays its design's logo. The six counted designs retain a separate Admin demo link and existing mounted navigation/locale behavior.

[prepare-template-logos.mjs](../../scripts/publishing/prepare-template-logos.mjs) converts the reviewed source assets to lossless WebP and records their original/output hashes, dimensions and byte counts in [provenance.json](../../scripts/publishing/design-logos/provenance.json). Import uses its IMPORT wordmark; App uses DRIVE24 and Mobile uses SHOWROOM. Signature uses its new transparent wordmark. These are design-selection identities; personalized dealer headers, favicons and social previews use dealer identities.

The release-bundled selector contains the six images as WebP data URLs so every mount can display them without depending on a separate asset host or an outdated remote switcher. The source assets total 108,370 bytes before base64 encoding. Logo images are decorative beside accessible design names. The former Carwow source remains a historical fallback, while six-design selections omit it.

Validation: 18 existing/focused selector tests passed, all six WebP assets passed their reproducibility/hash check, and Browser fixtures showed the actual runtime at 390 px EN, 320 px BG and 1440 px BG. All six images loaded; the 320 px document had no horizontal overflow. Close/Escape dismissed the selector and the Admin link stayed separate. Evidence and paired before/after captures are in `runtime/fab-logos-20261009/`.

The fixture at port 6499 demonstrates the shared selector. It does not demonstrate actual client builds, mounted detail pages or Vercel deployments. Six-family publisher integration, truthful dealer adaptation, favicons/social metadata and hosted pilot/fleet acceptance remain separately verified release steps.
