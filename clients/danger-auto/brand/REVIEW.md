# DANGER AUTO branding checkpoint — 2026-09-09

The real SVG, PNG and ICO files in all three application roots replace the pending central identity values. The outlined wordmark and DA monogram are a proposed demo identity, not an official logo or Image Gen output. Provenance and exact asset Git blobs are in PROVENANCE.json.

## Integration

Auto Best's existing brand.logo now uses the ink wordmark. Carwow's logoLight/logoDark select the backed white and transparent ink variants; the backing also makes the contact-card use legible on white. Modern's existing leadSite.logoPath uses ink, the dark desktop header uses white, and the mobile bar selects one complete wordmark rather than the source logo's 32/68-percent split clipping. The bar geometry, contact controls, navigation destinations and focus hooks remain.

Each application has its own local five-file logo/icon set and manifest. Svelte app shells and Modern metadata reference actual local icons with correct types; all three copies carry noindex/crawl-disallow settings. This is not proof of every nested route's final rendered metadata.

## Executed evidence

`NODE_PATH="$(npm root -g)" node /mnt/data/danger-brand-pass/files/clients/danger-auto/checks/brand-contract.cjs`: exit 0; 50 passed; 0 failed. Node v22.16.0 and runner TypeScript 5.8.3, not a retained-lockfile installation. Reproduce after installing Auto Best dependencies: `node clients/danger-auto/checks/brand-contract.cjs`. Checks and input hashes are in ../checks/BRAND-RESULTS.json.

SVGs were rasterized using CairoSVG and inspected at full size and 240px, with 16/32/48px monograms on light and dark backgrounds. This is asset-only visual inspection, not application/browser screenshots or mobile-header approval.

No dependency install, Auto Best validate, Modern Prisma generation/typecheck/build, Carwow check/build, HTTP route check, or 320/390/1440 app/master comparison ran. A fresh isolated-shell `git ls-remote` failed with exit 128: Could not resolve host: github.com. Connected GitHub reads, blob writes and tree writes worked. No Windows checkout or server was used.

## Remaining integration work

The dealer trio is still in-progress: permitted matched local stock photos/galleries, the full supporting-page/data-consumer sweep, recursive exclusion audit and real application QA are unfinished. This branding checkpoint does not certify the master copies or the separate staff/metadata work. Root REVIEW.md's older statements that all identity bytes are absent are superseded by this checkpoint; its remaining app-completion requirements still apply.

## Concurrent branch work

This pass began at 6b35e33e68acae5de46fb664d355d19f850b370d. Another writer published 43a6ba1db28b38f9cded3ea287b66ccd216be548 while assets were staged. Its ten staff/metadata/test files do not overlap the branding patch. The asset checkpoint is rebuilt on that fresh root, preserving those files, rather than replacing the root with the old tree. Further work on the same dealer needs ownership coordination; no pages from that new commit were edited here.
