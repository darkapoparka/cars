# Shared media for dealer deployments

The September 2026 fleet audit found 9.346 GB of public/static files across 25 dealers, containing 0.829 GB of distinct bytes. These are source measurements, not a reconciliation of Vercel's Deployment Storage meter. Retained deployment outputs and function bundles must be measured separately.

`scripts/publishing/shared-media-catalog.json` records 823 immutable public media objects totaling 454,227,903 bytes. Their copies account for approximately 7.655 GB in the audited source fleet. The originals were uploaded to the `cars-shared-media` public Vercel Blob store in `fra1`, then every public object's SHA-256 and byte count was verified. The catalog contains no credentials.

The packager selects only exact hash/size matches. It inserts per-file external rewrites before Services catchalls. Svelte output is verified and pruned beneath `.vercel/output/static` after compilation. Next public files are verified and pruned inside the generated package before compilation, because its Vercel adapter captures them during the build completion hook. Canonical assets remain available for local previews. The pilot's application code has no static imports or filesystem reads of selected public files; a future static import of removed media fails compilation rather than publishing missing content. Unknown or changed assets stay bundled. Filename matching is limited to supported URL-safe paths, and MIME mismatches fail closed.

Public URLs remain the same. Browser caches revalidate the stable old filenames; the CDN can cache their responses. Blob object names contain their content hash and are never overwritten. Do not delete a catalog object while any retained deployment refers to it.

## Updating existing publishing repositories

Use `package-shared-media.mjs` with the exact current publishing commit, a committed Cars tooling revision, the catalog, and a new derived output directory under `runtime/`. This additive path preserves current publishing application files rather than replacing them with a possibly older dealer checkout. It updates package provenance and verifies the payload. Then use the normal `export-dealer.mjs` proposal, reconciliation, and non-force publication flow. Future fresh native packages apply the shared media catalog automatically.

Pilot builds must prove that files are absent from final Vercel output, external responses preserve bytes/MIME/query handling, and all offered designs and primary routes still work. Keep production aliases and intentional rollback deployments. Delete obsolete deployment history only after an exact live alias/rollback review; uploading media or redeploying does not itself remove old stored versions.

## Listings backend boundary

A database is optional for demo listings and is not the storage fix: image bytes dominate the audit. A later shared inventory API can serve tenant-scoped public dealer records and listing/photo references to all designs. The existing Modern database contracts and Carwow database adapter are potential integration points; the current fleet still uses demo/static inventory. Real admin writes require authentication and tenant authorization, and demo disclosure must remain truthful.

The present Blob Hobby allowance is 1 GB storage, 10 GB data transfer, 10,000 simple operations and 2,000 advanced operations. It is a bounded pilot allowance, not unlimited hosting. Reassess traffic before broader commercial use; an existing object store or a deliberately chosen production plan may be more suitable. No billing upgrade is part of this change.

Sources: [Deployment Storage](https://vercel.com/docs/deployment-storage), [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing), [external rewrites](https://vercel.com/docs/routing/rewrites), [Services routing](https://vercel.com/docs/services/routing).
