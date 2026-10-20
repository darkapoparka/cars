# Inter typography

The owner requested a firmer English/Bulgarian type treatment on 3 October 2026. Auto Best now uses **Inter v4.1**, pinned to the [official upstream release](https://github.com/rsms/inter/releases/tag/v4.1), under [SIL OFL 1.1](inter-OFL.txt).

The source binary is `docs/font-files/InterVariable.woff2` from that tag, SHA-256 `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. The local delivered subset is `src/lib/styles/fonts/InterVariable-v4.1.woff2`; [the manifest](inter.json) records its hash, byte count, retained Unicode ranges and fontTools version. Subsetting retains all OpenType layout features and both axes: weight 100–900 and optical size 14–32. It covers English, Bulgarian including Ѝ/ѝ, prices, currency, quotation marks, dashes and ≤/≥. The inspected build has no separate Bulgarian localized alternates. Keep the document's real language.

`tokens.css` owns the local `@font-face` and `--dn-font`. Vite bundles the WOFF2 with a content hash, without a third-party font request. Body and entry text use 450; controls use 500; headings and prices retain the 600 role. Optical sizing is automatic. Existing 400-weight metadata remains deliberately quiet. The shared entry-action width is 13rem so the Bulgarian inventory action fits Inter without wrapping at normal mobile text sizes.

Retain the license and manifests in dealer copies. `scripts/check-visual-system.mjs`, run by typography validation, checks the pinned binary, local face and active icon sources. Historical Manrope files/notices are preserved as prior provenance; that package is no longer a runtime dependency.
