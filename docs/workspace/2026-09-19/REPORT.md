# Cars workspace and public admin rollout — 19 September 2026

## Verified result

All **24 public dealership preview URLs** now offer **Design 1, Design 2, Design 3 and the shared Admin dashboard**. The three design destinations stay unchanged; the admin opens in a separate tab with noopener/noreferrer. The design counter remains three, not four.

Anonymous browser checks passed **216/216**: 24 dealers, three design entries, and widths of 1440, 390 and 320 px. Checks cover route availability, exact original design destinations, four FAB links, admin destination/new-tab attributes, menu bounds, touch-target dimensions and Escape/focus return. The public admin's seven routes also passed **21/21** responsive render checks without uncaught browser errors or horizontal page overflow.

Public admin: https://cars-admin-blue.vercel.app/ — repository darkapoparka/cars-admin. It is a synthetic browser-local demonstration, not a production dealer database, real staff login or the private Agency OS CRM. The dealer query parameter is not authentication or tenant isolation.

See [AUDIT.json](AUDIT.json) for the 24 URLs, project/deployment IDs and per-route checks. This is scoped navigation/admin verification, **not** a claim that every vehicle listing, contact workflow, page or logo has received complete visual approval.

## What was repaired in delivery

At the start, 15 public sites exposed the shared admin and nine still served older switchers. The shared helper and dealer source already contained the admin link on GitHub; adding a second implementation would not have solved stale production aliases.

All nine newer existing builds passed 81 browser checks. Their 27 light/dark/accent logo files matched the approved raster-file hashes in the existing dealer-finalization handoff. No logo image was generated, replaced or restyled in this task.

F1rst Motors, Ivo Auto and Legend Auto became current during the audit and were not republished by this task. The six remaining verified existing builds were promoted without rebuilding: Outletcars Varna, Promosale Varna, Priselci, Texas Drive Auto, IS Auto Varna and The Dealers Point. Production was checked again anonymously after promotion. Prior deployment IDs were recorded for rollback; no deployment or project was deleted.

One redundant Git-sourced F1rst preview was queued during investigation, then canceled after the existing successful build was verified. Its ID is dpl_2isqaHDZZo5dAVnZgg1eQTixHFfQ. Temporary authenticated preview access and session files remain in ignored runtime, never in this report or the registry.

## Repository and folder organization

Open J:/cars/Cars.code-workspace. It groups Cars, Auto Best, Modern, Carwow, Import and Cars Admin as six separate repositories. workspace.json records their identities and paths; [WORKSPACE](../../WORKSPACE.md) is the active architecture/procedure reference.

The four masters already share J:/template-repos/. Cars/templates contains pinned release snapshots, not another set of editable masters. Cars/clients contains canonical dealer sources; publishing repositories are derived release outputs. The shared admin lives in J:/cars-admin and is not copied into every dealer.

Existing C:/Users/radev audit/recovery/build folders and the running legacy M: Day/Night applications were left intact. This task did not physically move repositories or delete potentially unique files. New scratch output belongs in ignored runtime rather than new folders under the Windows user root.

The technical registry now includes canonical Day and Night and IS Auto records. The old dayandnight Rencar trial is preserved under historicalSources; dayandnight resolves as an alias of day-and-night-auto-group. Generated deployment/index views were regenerated from the corrected registry, not from an indiscriminate scan of the stale local checkout.

## Safeguards added

- node scripts/workspace-doctor.mjs reports repository identity, main branch, dirty work and ahead/behind counts. --fetch refreshes tracking refs only; --check fails on issues. Fetches time out and do not launch interactive credential prompts. It never pulls, stages, cleans, resets, moves folders or stops applications.
- node scripts/check-live-fab.mjs checks all registered live previews; --dealer SLUG checks one. It uses the sibling Cars Admin Playwright installation, writes only evidence under runtime, never submits forms or deploys, and exits nonzero on failed checks.
- AGENTS, the root README, documentation index, local setup and publishing procedure now point to the same workspace/admin contract. Older admin handoffs are marked historical rather than left to claim that the live admin is still blocked.

Nine workspace-doctor tests, three legacy-reference safety tests, two registry-only view tests and six existing workflow tests cover this change; final command results are recorded with the commit verification. The existing workflow still owns release promotion, packaging, verified dealer facts, approved PNG/WebP logos and preserving template heroes/banners/section layout.

## Important outstanding conditions

J:/cars was 189 commits behind fetched GitHub main at the earlier audit and 190 behind at resumed verification and contained extensive uncommitted dealer/logo work. That work was not pulled over, stashed, staged into this change, reset or discarded. This task publishes only its own scoped files against current remote main; it does not advance the occupied local working tree. Its writer must reconcile that checkout before uploading local source as current. Other template checkout health is reported against cached tracking refs where a complete online refresh was not obtained.

IS Auto's public site is verified, but the Vercel project remains unlinked/CLI-published. Its canonical source is Cars main; its existing manifest still refers to the legacy publish/isauto-varna publishing ref. The presumed dedicated cars-isautovarna main ref was not found through connected GitHub. No substitute Git binding or publishing branch was invented. The inventory now accepts this exact documented legacy reference only when its unlinked-provider and canonical-source evidence match. Normal publishing still rejects the integration repository, and regression tests prove that the read-only exception cannot silently become a publishing target. Establish a verified dedicated main publishing mirror before enabling Git-triggered releases for that project.

## Hosting decision

Keep today's 24 dealer URLs and their projects. Use one deployment trigger per release, not both Git integration and a duplicate CLI upload. Most dealers are linked to dedicated main publishing repositories; IS Auto is the explicitly recorded exception.

For hundreds of unqualified prospects, the next architecture should share template renderers and load each dealer's public configuration/assets through a tenant-aware preview service. Each lead still receives a branded path or owned custom subdomain. That future service must be canaried without removing today's URLs. Paying/customized clients can keep dedicated projects and authenticated tenant-isolated backends. This migration has not been implemented here.

The team reported Hobby during the audit. The billing usage API did not provide actual GB usage, so no storage amount or cleanup saving is claimed. Deployment Storage concerns retained build outputs; Functions Storage concerns retained function bundles, not merely local folders or Git source. No retention setting or plan was changed. Vercel's commercial-use and storage policies are linked in [WORKSPACE](../../WORKSPACE.md); commercial agency demos need an appropriate commercial hosting plan.

Agency OS remains private. Future integration should exchange stable lead IDs, vertical/template release, public URL and delivery state through an authenticated boundary, not copy private outreach/customer data into public demos.

## Resumed verification and completion

Fresh anonymous verification passed 216/216 FAB checks and 21/21 admin page checks again. See AUDIT.json reverification for the timestamp. No dealer application, hero, logo or production alias was changed during this resumed pass; the already-successful rollout was verified rather than rebuilt.

The canonical source snapshot inspected was `488b5d1d78127c46fdcb94299b485f9b17a2616b`. All 72 registered design provenance records now copy the complete commit/digest pair from that exact committed source manifest. Source evidence identifies the Cars snapshot separately from the provider build. Older browser/source evidence is retained as history, not presented as current visual approval.

`node scripts/index-deployments.mjs --views-only` now regenerates the dealer index and readable deployment list directly from the reviewed registry without rescanning stale local source. The workspace doctor retains useful local state after a failed fetch, marks remote freshness honestly, and uses an explicit main tracking ref. The workflow check includes these helper commands and the active workspace document.

The occupied Cars checkout is intentionally not fast-forwarded by this change. Template masters still contain independent ongoing work: Modern has six unpublished commits; Carwow is behind its cached main; Import has uncommitted changes. Fetch failures or missing tracking data remain explicit findings rather than clean-state claims. These are not permission to reset, move, stage or publish another agent's files.

## Final code checks

All 38 self-contained workflow tests passed against the exact candidate script tree assembled from current GitHub main plus this scoped change. The active documentation/skill/command check passed (11 documents, three skills). The 20 focused checks are included in that scope, not additional tests.

The initial all-files test invocation in the source-light validation directory reported missing fixtures: the copy test needed its dated temporary-fixture parent, and the older refresh-client integration test directly reads full real dealer/template source and assets. The temporary parent was supplied; the passing 38-test run intentionally excludes that data-dependent integration file. This is not a claim that the full template/application integration suite passed. No dealer/template tree was copied or modified to manufacture a passing result.

[FOLDERS.json](FOLDERS.json) records six canonical repositories and observed Cars-related user-root working/evidence folders. Those old folders remain preserved until unique content and running-process ownership are reconciled; the workspace grouping does not claim physical cleanup or recovered disk space.

The final Windows fetch check used existing Git Credential Manager only for commands whose sole configured helper was the first-run chooser. No global Git settings, custom credential helpers, or hooks were changed. The final isolated suite passed 38/38; current per-repository synchronization findings are retained in AUDIT.json.
