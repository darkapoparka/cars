# Navara logo update — 2026-09-08

## Implemented

The project owner's image-generated red НАВАРА КАР wordmark replaces the original temporary Arial label in all three independent application asset directories. The SVG files contain actual outlined geometry derived from the generated PNG, not font-dependent text or a link to a master. Red primary and red/white dark-surface versions share identical geometry. Favicons and Apple touch icons derive from the first outlined Cyrillic Н.

Auto Best already reads `/navara/wordmark.svg` through `src/lib/config/brand.ts`. Modern reads it through `packages/marketplace/lead-site.ts`; its mobile brand bar now selects a whole logo rather than applying the inherited 32%/68% split mask. Carwow reads the same paths through `src/lib/data/daynight-site.ts` and `SiteChromeLogo.svelte`; two mobile brand components now use that data directly. Carwow's old `/brand/daynight-logo-generated.png` and `/brand/daynight-favicon.png` contain the matching new PNG exports as compatibility assets for remaining direct references and metadata. Modern favicon MIME/URL and manifest are corrected; Carwow's manifest no longer identifies the source dealership.

Templates, other clients, layouts, typography, breakpoints, dependencies, inventory and integration configuration are unchanged. No regeneration script or deployment is required.

## Provenance

Generation ID: `6f04e7f5-5407-4e05-96b9-3b41140c0f20`.
Generated input PNG SHA-256: `1f32afae030a18a7fafc7e1d48611c0802eac8ab4d75af1f033615dc40b61416`.
Brand reference identified by the owner: https://navara.mobile.bg/ — red НАВАРА КАР lettering. The generated car silhouette is a demo refresh, not a verified official vector recreation or dealership-approved rebrand. No dealership approval is asserted. See each application's `navara/README.md` for formats and the unchanged inventory-photo limitations.

Parent implementation inspected: `edadcfae26ec3efcd6090a51ed2b9a7ed6edd6cb` on `astra`. Existing template lineage and false application QA flags remain in `.client/project.json`.

## Checks actually run

- SVG XML parsed; outlined paths only, with no text/font dependency, scripts or external image references.
- PNG decoding passed. Four uploaded asset blob hashes matched locally calculated Git blob hashes before inclusion in the commit.
- Both modified TSX files parsed with the installed TypeScript parser: zero syntax diagnostics. This is not package import resolution or a framework typecheck.
- Chromium rendered the actual logo/icon bytes in an isolated in-memory asset harness at 390px and 1440px viewports, 2x pixel density. All 15 images loaded at each width, no horizontal overflow, no page errors. Header-sized slots were inspected on white, dark and yellow backgrounds. This was not a browser test of the complete applications.

Full dependency installation, framework checks, builds and application route reviews were not executed. Shell access to GitHub failed DNS resolution; browser navigation to the local HTTP harness was blocked by administrator policy. The offline asset harness did not change browser security settings. The broader project remains a work in progress; this patch only resolves the generated-logo integration.

## Local inspection

Safely update the existing Navara preview worktree from `origin/astra`, preserving local edits. Restart the three existing preview processes and hard-refresh their tabs; clear the site icon cache if the old favicon persists. No dependency changes were made. Do not recreate the applications or copy the template masters again.
