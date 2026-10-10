# Approved Signature source handoff

Cars `templates/karento-best` remains the editable master. The existing private
`darkapoparka/cars-template-karento` repository is its standalone publishing
mirror. This handoff includes the named Svelte components, typed data and
localization, shared styles, Signature assets, and the approved final mobile
overlay pass. The separate `/2` experiment and intermediate audit captures are
excluded from publication.

Integration checks on Node 26.10.0 passed: strict Svelte checks (zero errors or
warnings), typography and geometry guards, formatting, all 102 unit tests, and
the production Node build. The original stylesheet and all 607 preservation
files still match their immutable provenance. Native news title rules live in
the owning component; phone and tablet rendering was checked at 320, 390 and
768 pixels. The retained [mobile comparisons](mobile-final-20261010/README.md)
record the approved overlay changes.

The publishing mirror uses the existing Cars
`scripts/publishing/signature-vercel-adapter.json` qualification: adapter-vercel
7.0.0 and Node.js 24 on Vercel. Its guarded package/lock inputs must match the
exact Cars source before applying those hosting overrides. Local development
keeps the Node version pinned in this master. Mirror receipts record the source
commit and the small provider-specific file differences; immutable reference
directories remain protected.

Historical SSR pixel/content comparisons target the preserved Karento baseline
and cannot certify the subsequently approved Signature identity and UI. Current
HTTP and browser checks cover the actual selected routes, language state,
overlays, assets and genuine 404 responses. This handoff does not update dealer
manifests or the template release lock.
