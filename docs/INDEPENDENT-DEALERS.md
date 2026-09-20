# Independent dealer repositories

This is an additive pilot for explicitly requested independent dealer builds. Existing 24 dealer projects retain their recorded source ownership; this document does not migrate or overwrite them.

## Ownership

The dedicated dealer repository is the sole editable source, including all three applications, branding, facts, agent instructions and checks. Cars retains only technical registration, template releases, generator tooling and handoff evidence. Do not commit another copy of the dealer applications into Cars. Do not use the legacy publishing exporter on an independent source repository.

On this machine new independent checkouts are grouped under `I:/cars-clients`, recorded in workspace.json. J: had about 1.2 GB free during the pilot; source/dependency/build files must not exhaust the system's existing Cars volume. This is one permanent checkout per dealer, on main, not another session worktree. Generated preparation/evidence stays under the group's `.runtime` directory or the dealer's ignored runtime.

## Create and finish

Run from the synchronized J:/cars main checkout:

    node scripts/create-independent-dealer.mjs --client SLUG --repository darkapoparka/cars-DEALER --preset standard

The default is a plan. Add --write for the authorized build. The helper reuses release verification, source copying and mounting code; copies the selected exact template releases; records source versions; and installs one independent, mounted source tree. Preparation is not a completed dealer. It never creates GitHub/Vercel resources or invents facts.

Personalize that independent source, add approved raster logos and a dated public fact pack, initialize its own main repository, and record layout/asset baselines for scripts/check-dealer.mjs. AGENTS.md states the content-only default; checks detect drift and missing assets. Neither is a substitute for desktop/mobile visual and application QA. Client-specific features are permitted when explicitly requested and reviewed.

Create the dedicated private GitHub repository, push the tested main source, connect one Vercel project to it, and verify the exact public deployment. Give the lead one URL with three designs plus the shared Admin demo. No outreach or production backend is implied. Record source, build, provider and browser status separately.

A build whose remote repository could not be created, deployment was blocked, or application checks failed remains explicitly incomplete. Do not claim a localhost URL is a Vercel deployment or that a plan installed a multi-tenant platform.

## Completed example

[Al Reef Used Cars, Sharjah](independent-dealers/2026-09-19/AL-REEF.md) proves the independent repository flow: one permanent checkout, three designs, a Git-linked Vercel preview, shared Admin, explicit illustrative inventory, agent instructions and enforced asset/presentation checks. Cars stores its registration and delivery evidence, not its application source.


## Localization release preflight — 20 September 2026

`--locale-config FILE` validates an explicit, bounded JSON request and reports the intended language-prefixed entries. It is a **blocked preflight**, not native template adoption. A declaration does not prove complete catalogs or working localized routes. A blocked dry run exits 2; `--write` refuses the request before creating a staging directory or installing a dealer.

The input has exactly these fields:

```json
{
  "schemaVersion": 1,
  "dealerId": "example-dealer",
  "defaultLocale": "en",
  "enabledLocales": ["en", "bg"],
  "dealerCountry": "GB",
  "inventoryCurrency": "GBP"
}
```

These are illustrative values, not approved business facts. `dealerId` must match `--dealer-id` or the requested client slug. Country, default language and inventory currency are independent explicit inputs. Arabic/RTL and unknown languages remain unavailable; selecting a country cannot enable a language.

Packaging v1 still has a single-default-locale Modern transform. The packager now refuses a localization declaration or detected native locale source before applying that transform, even when a caller supplies a retained file map. Existing localized independent dealers must not be sent through this legacy packager.

Generation also checks its own packaging inputs for uncommitted changes and rechecks the workflow head, approved template pins, source bytes, prepared bytes, dealer identity, repository identity and destination before installation. These checks preserve other writers instead of quietly installing a stale candidate.

Shared packager, catalog, template-pin and workflow-file changes no longer automatically publish Champion Auto Pro. Its existing publisher remains available for an explicit manual run or a change to its own client source. The publishing job and package-branch identity are unchanged.

The [dated localization gate handoff](independent-dealers/2026-09-20-LOCALE-GATE.md) records actual release evidence and work that is still not performed. No template pin or existing dealer application is updated by this preflight.
