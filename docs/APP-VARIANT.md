# App as the fourth dealer design

The owner requested App on all 25 existing dealer projects on 28 September 2026. The default new-dealer trio remains supported. For this fleet update, App is additive at /variant-4; the first three designs and public URLs remain unchanged. Admin remains a separate fifth link in the FAB.

## Source and identity

The editable App master is templates/app. Its native Next.js routing owns /en and /bg and reads NEXT_PUBLIC_BASE_PATH at build time. Dealer data is adapted from the existing auto-best/src/lib/data/dealer-profile.json, including native and legacy field spellings. Actual listing currency and amounts are retained, never relabelled or converted. Missing prices and mileage remain explicitly unknown.

The adapter reuses each dealer's raster light/dark logos and retained listing photographs. Icon artwork is derived from the same logo, not a generated replacement identity. Existing safe SVG vehicle placeholders remain labelled listing/demo material. No new official logo, finance offer, warranty or live inventory assertion is invented. Enquiry controls prepare a draft or open a verified contact destination; this preview does not submit bookings, messages, payments or approvals.

## Packaging version 3

scripts/publishing/app-variant.mjs extends a verified version-2 trio to version 3. Existing native localization acceptance continues to validate the original trio, independently of App's own locale/source checks. App has an exact source locator and .cars-app.json digest; it does not inherit a fabricated native-release approval record.

The additive publisher reads verified current-production files rather than regenerating the first three designs from a potentially older checkout. It preserves every original byte except dealer.json, vercel.json, the generated package receipt, the shared switcher configuration, and the native build helper's version predicate. App and its build helper are additional files. The prior deployment and package-receipt hash are retained for reconciliation and rollback.

The App collector includes runtime code, locales, approved campaign images, fonts and icons. Large reference inventory/capture directories remain in the master for provenance but are not replicated to dealer packages. Never copy .env files, node_modules, build outputs, login data or private agency records.

## Update and verify

Use prepareAppDealer, collectAppSource and appendAppVariant from the existing Cars packaging modules. Baseline files must match their recorded SHA-256 hashes before adaptation. Repeated or unknown fourth variants are rejected instead of silently overwritten. A later App refresh must be an explicit exact-source change with a fresh receipt and browser checks.

Verify all four designs plus the separate Admin link, EN/BG, mobile/desktop layouts, mounted assets, deep vehicle links, actual inventory counts, contacts and logo rendering. Distinguish source commit, successful build, production alias, anonymous browser checks and owner review. A READY badge alone is insufficient. Do not send real enquiries during QA.
