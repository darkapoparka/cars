# Dealer template updates

Use `node scripts/dealer-updates/update-dealer-template.mjs plan` to create a reviewable candidate from exact old and approved target template sources. Candidates live outside dealer source, unresolved conflicts block installation, and install/rollback are atomic and receipt-bound.

A packaging-v1 dealer is reconstructed with its historical mount adapter. When the approved target is a Cars monorepo subtree, the target is generated with the native packaging-v2 contract, exact source tree/digest locators, EN/BG locale contract and adoption seal. Modern retains `NEXT_PUBLIC_BASE_PATH=/variant-2`; no legacy source-replacement mount is applied to native Cars templates.

Run the focused suite with `node --test scripts/dealer-updates/*.test.mjs`. Never install a candidate whose review, source fingerprint, immutable base, resolutions or candidate digest changed after planning.
