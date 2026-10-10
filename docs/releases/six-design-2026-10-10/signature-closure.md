# Signature release closure - 10 October 2026

The general source envelope in [signature-release.json](signature-release.json) is accepted by the read-only approval function: ready=true. Source cc130e432a41a3a60cc80bc2b3461c6416893b4a, tree c661129affb32649c8fcecea097fc9a6487783d0, cars-source-v1 digest bf8c6628be5f28b7e3358b121b7cf9e236d36a2fc0138bf640d72113c7e17f30. No lock or Git mutation was made.

All 1,087 declared source hashes match committed source and mirror f5378b16daa6ff6924141779a0fcf5f41931d9a8, with the five documented Vercel overrides verified. The 29 files omitted by the mirror projection are historical capture/reference/tooling files; no maintained application file is omitted. The frozen adapter SHA-256 is 87f06c6e658ffc6b077481d270bd7da6b9eff933354dd8163ba65b6b5f7b669c; both input hashes match the committed package and lock. Its current root-owned modification still needs inclusion in publisher integration.

Existing source Node 26.10.0 and mirror Node 24.21.0 checks, formatting, 117 tests and builds are reused. READY dpl_EDXrTKKtTcB8toeHoXadsUvoo68x binds the mirror SHA. Existing hosted proof covers 127 HTTP contracts, 3,139 links, 320/430 phone checks and 1440 desktop Contact. Current EN/BG catalogs each resolve 2,293 matching keys with no catalog problems. The complete standalone 390px/all-route journey matrix and owner visual acceptance are not asserted. Signature has no detected native-v1 source, so no nativeLocalization block is invented.

The authorized root can select this release with:

    node scripts/template-release.mjs approve --key karento-best --commit cc130e432a41a3a60cc80bc2b3461c6416893b4a --evidence docs/releases/six-design-2026-10-10/signature-release.json --write

Then commit the reviewed lock/evidence/publisher integration and run:

    node scripts/template-release.mjs verify --key karento-best

Latest-source assembly is supported by the existing CLI, after all six approved pins are selected:

    node scripts/refresh-client.mjs --client promosale-varna --design-set six --candidate-dir I:/cars-runtime/cars-signature-25-20261009-2140/promosale-six-candidate --candidate-asset-pool I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool --asset-pool I:/cars-runtime/cars-signature-25-20261009-2140/asset-pool

The actual path is refresh-client -> scripts/dealer-updates/update-dealer-template.mjs plan -> readPinnedTemplateTree in scripts/dealer-updates/pinned-template-source.mjs, with the Signature .cars-signature.json input seal from scripts/lib/client-refresh-six.mjs. It reads the approved immutable Cars tree, personalizes it through the existing typed boundary and checks source/candidate/lock identities before installation. This is not a new latest-source flag or another generator. Install only after candidate QA with refresh-client --reviewed-run <printed-runDirectory> --write.

The 25 existing drafts still record Signature 03b70f633d1ab3191379b8d976a9dd35a84271bc; their source-candidate/preparation receipts record zero installations and deployments. Keep them as prior preparation evidence. The command above proposes a fresh complete candidate and does not overwrite those drafts.

Actual remaining gates are selecting/committing the release and publisher revision, candidate preservation/conflict review, and actual mounted /variant-6 and complete combined Services output/hosted checks at 320/390/1440. BG 19 is the launch scope; UAE 5 and USA 1 remain deferred. No source build was rerun and no canonical dealer, lock, Git index, push or deployment was changed here.
