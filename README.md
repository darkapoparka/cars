# Cars template library

Ten source baselines, stable names and independent client copies. Start with **Auto Best**, and use Modern or Carwow when a different sales direction helps. Shared polishing happens once in a master; client work stays focused on logo, colors, assets and verified copy.

Read [the full browser audit](./audits/2026-09-06/REPORT.md), [the build workflow](./docs/WORKFLOW.md), [agent instructions](./AGENTS.md), or [the machine-readable catalog](./catalog.json).

For an external code review, start with [the repository audit guide](./docs/REPOSITORY-AUDIT.md). The 8 September snapshot contains ten template baselines and 34 client demo applications across 12 client folders; older setup notes below describe earlier milestones.

## Current catalog

Scores are comparative visual/UX judgement out of 10, not a production certification.

| Template | Original port | Desktop | Mobile | Real homes | Recommended use |
|---|---:|---:|---:|---:|---|
| [Auto Best](./templates/auto-best/TEMPLATE.md) | 5173 | 8.5 | 8.5 | 1 | use-first |
| [Modern](./templates/modern/TEMPLATE.md) | 6212 | 7.0 | 8.5 | 1 | shortlist |
| [Carwow](./templates/carwow/TEMPLATE.md) | 6517 | 8.0 | 8.0 | 1 | shortlist |
| [Import](./templates/import/TEMPLATE.md) | 6518 | 7.5 | 8.0 | 1 | reserve |
| [Showroom](./templates/showroom/TEMPLATE.md) | 6404 | 7.5 | 8.0 | 1 | reserve |
| [AutoDeal Full](./templates/autodeal/TEMPLATE.md) | full library | 8.0 | 7.0 | 10 | variant-library |
| [Boxcar](./templates/boxcar/TEMPLATE.md) | 6450 | 8.0 | 6.5 | 1 | polish-next |
| [Rencar](./templates/rencar/TEMPLATE.md) | 6430 | 7.5 | 5.5 | 5 | polish-next |
| [Motoria (Motors source)](./templates/motoria/TEMPLATE.md) | 6440 | 6.5 | 5.0 | 1 | hold |
| [Nusavo](./templates/nusavo/TEMPLATE.md) | 6420 | 6.5 | 6.0 | 1 | hold |

## Available previews

- [AutoDeal full library](http://127.0.0.1:6460/) — all ten homepages.
- [Auto Best library copy](http://127.0.0.1:6461/) — independent of original 5173.
- [Modern library copy](http://127.0.0.1:6462/cars) — public static demo mode.
- [Carwow library copy](http://127.0.0.1:6463/), [Import library copy](http://127.0.0.1:6464/), [Showroom library copy](http://127.0.0.1:6465/inventory).
- [Boxcar](http://127.0.0.1:6450/), [Rencar](http://127.0.0.1:6430/), [Nusavo](http://127.0.0.1:6420/), [Motors alias Motoria](http://127.0.0.1:6440/) — moved sources, original ports retained.

All ten local library previews were rendered during this setup. Runtime identities and verification scope are in the audit. The original M: previews remain separate and available.

## Client work

[Day & Night](./clients/dayandnight/CLIENT.md) has a [strict Rencar branding preview](./clients/dayandnight/rencar/README.md) at [port 6601](http://127.0.0.1:6601/), using the original five home layouts and Home menu. The initial custom rebuild was rejected and archived. [ELIQ](./clients/eliqauto/CLIENT.md) and [ASKO96](./clients/asko96/CLIENT.md) remain prospect folder scaffolds. No outreach has been sent.

Example: “Build ASKO96 using auto-best, carwow and modern; keep their layouts and change branding, assets and copy.”

```powershell
node scripts/new-client.mjs --client asko96 --templates auto-best,carwow,modern --dry-run
```

Remove --dry-run only when that build is requested. The helper preserves every real homepage variant, rejects occupied destinations and records source/version lineage. It creates source copies that still need personalization and QA.

The library intentionally preserves source-branded layouts for the next discussion. Captured-page templates still need shared brand-data extraction or dealer adaptation before every lead can be a quick config-only reskin.
