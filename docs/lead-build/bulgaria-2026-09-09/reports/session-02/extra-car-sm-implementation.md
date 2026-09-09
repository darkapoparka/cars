# ЕКСТРА КАР-СМ — source implementation and verification

State: **in-progress; runtime-unverified**. All three actual independent applications are present. This replaces the old report-only/zero-app state, but does not close the real-photo or full visual acceptance gaps.

Source base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`. Delivery: `codex/astra-bg-02`. Only the assigned client folder and this session report are written.

| App | Published master version | Source tree |
|---|---|---|
| auto-best | 2026.09.08-polish-1 | `97833980ab127f6de8f675ac1a188e4b7f717976` |
| modern | 2026.09.06-refresh-1 | `66bfb8196bbce18832ada6b34b02dda97baba25b` |
| carwow | 2026.09.08-repair-1 | `d4a08817e87cf84d08c4db1c08a515937245f2dd` |

## Implemented

The retained master sources, runtimes, compositions and lockfiles are copied independently; Modern keeps its full workspace. Each catalogue imports the same eight dated real advertisements with actual EUR/km, IDs, source links and vehicle-specific status. Dealer contacts, address/map, noindex metadata and supporting source consumers were personalized.

Five manually authored source-informed identity proposals are integrated per dealer with outlined light/dark SVGs, icon marks and PNG/touch/OG exports. No font dependencies or embedded bitmap logos. These are not official dealer originals, not dealer-approved and not Image Gen results. The attempted generation did not start. Stock photos still use an explicit unavailable-image state, not another dealer’s vehicles.

Known client-local defects repaired: Modern eager directory fixtures referencing removed stock; popular searches tied to old IDs; synthetic unrelated directory businesses; Carwow doubled E164 telephone prefix; unsupported Viber/WhatsApp destinations in the inspected consumers; Modern split-logo mask; static-demo enquiry delivery/record creation on the main enquiry paths.

## Executed checks

All three isolated catalogue adapter executions pass (8 records each). All three targeted TypeScript data/config no-emit checks pass. Edited Svelte/TypeScript/JavaScript source parsing passes. Outlined SVG structure/hash checks and in-memory PNG dimension checks pass. The actual artwork contact sheet was visually reviewed; this is not a rendered app review.

Exact versions, files, diagnostics, hashes and limitations: `clients/extra-car-sm/VERIFICATION.json`, `ASSET-CHECKS.json`, `SOURCE-CHECKS.json`.

## Remaining acceptance

Real matched vehicle photo authorization/integration, complete supporting-page content acceptance (including FAQ/article claims), dependency install, Prisma generation, full app checks/builds, and all browser/320/390/1440 route/interactions checks are outstanding. None was reported as executed or passed. Owner review remains pending.

`clients/extra-car-sm/REVIEW.md` contains coordinator install/check commands and proposed local entries. No app server or deployment was started; no real enquiry or private record was sent. The shared Windows checkout and its source files were left unchanged.
