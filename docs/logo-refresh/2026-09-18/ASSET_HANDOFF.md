# Dealer logo refresh — asset handoff

Date: 2026-09-18

## Purpose

This file is the source-of-truth handoff for the next implementation session. The logo assets and project-specific asset commits are preserved in GitHub. The remaining task is to inspect, select, wire, deploy, and visually verify the correct logo treatment across every client-facing Vercel project.

A commit message saying that a logo was polished is not visual approval. Every project still requires desktop/mobile inspection on light, dark, accent, drawer, footer, and sell-page surfaces.

## Rules

- Prefer the dealer's recognizable published identity when its core mark is usable; refine it rather than inventing a replacement.
- Use the generated candidate only when the source identity is unusable, boxed, too low-resolution, or explicitly approved.
- Use raster PNG/WebP assets with real transparency. Do not rebuild logos with CSS or decorative SVGs.
- Prepare contextual light, dark, and accent variants where one universal asset cannot maintain contrast.
- Preserve approved template heroes, banners, layouts, section order, and card composition.
- Never personalize or overwrite the reusable `cars-template-*` repositories.
- Validate header, mobile drawer, footer, sell/contact pages, desktop, and mobile before marking a lead ready.

## Generated candidate set

The following dealers have generated transparent raster candidates available in their project asset history:

1. Day & Night Auto Group
2. Champion Auto Pro
3. Perfect Auto
4. KG Team Auto
5. PromoSale Varna
6. The Dealers Point
7. F1rst Motors
8. Outlet Cars Varna
9. Texas Drive Auto
10. Excellent Cars
11. Al Hamoor Al Thahabi
12. Elit Auto Import
13. Automarket Varna
14. AstraCar
15. Legend Auto
16. Ivo Auto
17. Al Basma Motors
18. ASKO 96

These are candidates, not automatic replacements. Compare them against the dealer's real published logo before implementation.

## Refine-existing identity set

These dealers already have a recognizable source identity and should normally retain it while receiving transparency, resolution, crop, and contrast cleanup:

- Priselci
- Autolife
- Avangard Auto
- ELIQ Auto
- Navara Car
- IS Auto Varna

## Client-facing Vercel project asset references

| Vercel project | GitHub source | Latest logo asset/reference commit | Next-session status |
|---|---|---|---|
| `cars-priselci` | `darkapoparka/cars-priselci` | `30055887099ae9d6db20beaa48f37316477b8360` | Inspect and implement/verify all surfaces |
| `cars-outletcarsvarna` | `darkapoparka/cars-outletcarsvarna` | `6345e253e14e074cde5059c2630670fc049519ae` | Inspect and implement/verify all surfaces |
| `cars-promosalevarna` | `darkapoparka/cars-promosalevarna` | `e667e0738e4eca2c0930033322578a09314f7f75` | Inspect and implement/verify all surfaces |
| `cars-autolife` | `darkapoparka/cars-autolife` | `e564aa8a8812dd302f4e97de303eb97b6596e2c1` | Inspect and implement/verify all surfaces |
| `cars-astracar` | `darkapoparka/cars-astracar` | `25a9003fd105f999a06ae16650a95735c5404212` | Inspect and implement/verify all surfaces |
| `cars-alhamooralthahabi` | `darkapoparka/cars-alhamooralthahabi` | `aae5d2bee239c095d2eff25774135a5c4d83a81c` | Inspect and implement/verify all surfaces |
| `cars-avangardauto` | `darkapoparka/cars-avangardauto` | `385f069927fc57ed18eeafc9c0368656a6c6ea9b` | Inspect and implement/verify all surfaces |
| `cars-f1rstmotors` | `darkapoparka/cars-f1rstmotors` | `7f097598a9a1ceb7a9f1b5160ea1be96e3ae3fbe` | Inspect and implement/verify all surfaces |
| `cars-albasmamotors` | `darkapoparka/cars-albasmamotors` | `47931d3f049592ef4cbbd907fee51d9c15e2af31` | Inspect and implement/verify all surfaces |
| `cars-elitautoimport` | `darkapoparka/cars-elitautoimport` | `9aec65b6fbd4f7d275aa955e0abcef52ff111375` | Inspect and implement/verify all surfaces |
| `cars-automarketvarna` | `darkapoparka/cars-automarketvarna` | `dfbe663ba07a9671955782a4af9bdb962dfebd57` | Inspect and implement/verify all surfaces |
| `cars-eliqauto` | `darkapoparka/cars-eliqauto` | `2db4964c9aeb5a58774bd110065e3830f6253f12` | Inspect and implement/verify all surfaces |
| `cars-kgteamauto` | `darkapoparka/cars-kgteamauto` | `8cf67e2548a00fd9f6cd6783ddb2f3d194d6b8d6` | Inspect and implement/verify all surfaces |
| `cars-championautopro` | `darkapoparka/cars-championautopro` | `5e63d480bc4833a40c58175145a21afe577620f6` | Inspect and implement/verify all surfaces |
| `excellent-cars` | `darkapoparka/excellent-cars` | `ed9d9b15a11300a676483a08036f25d141d32bf0` | Inspect and implement/verify all surfaces |
| `cars-perfectauto` | `darkapoparka/cars-perfectauto` | `0eee7f01acf152a8c8392979dfaf762d07f7d3b3` | Inspect and implement/verify all surfaces |
| `cars-asko96` | `darkapoparka/cars-asko96` | `40413c4cec58375f5bb890e681932579a43666ba` | Inspect and implement/verify all surfaces |
| `cars-texasdriveauto` | `darkapoparka/cars-texasdriveauto` | `ce775992032efbd91daa247d93db1df2b774408b` | Inspect and implement/verify all surfaces |
| `day-and-night-a` | `darkapoparka/day-and-night-autodeal` | `8d43d32972ddf5b8e2e60cc3bc58e5cb9cda1026` | Inspect and implement/verify all surfaces |
| `cars-thedealerspoint` | `darkapoparka/cars-thedealerspoint` | `3a29ca775604f562538fadbe31c5cbeced433c1a` | Inspect and implement/verify all surfaces |
| `cars-ivoauto` | `darkapoparka/cars-ivoauto` | `0be64d02119fbbaa54ff81e2099856b6788197a7` | Inspect and implement/verify all surfaces |
| `cars-navaracar` | `darkapoparka/cars-navaracar` | `5cf05ddccec25fcd7196c885d9558328bef68890` | Inspect and implement/verify all surfaces |
| `cars-legendauto` | `darkapoparka/cars-legendauto` | `39acae68b6c2377dc271f6e9346f053d9f07a71a` | Inspect and implement/verify all surfaces |
| `cars-isautovarna` | `darkapoparka/cars` | `fc3adf9fe19e514eca3fc4b2d9b78696e2127eb5` | Resolve its unlinked Vercel source, then inspect and verify |

## Day & Night example asset contract

`darkapoparka/day-and-night-autodeal@8d43d32972ddf5b8e2e60cc3bc58e5cb9cda1026` contains committed PNG/WebP assets for master, universal, light, dark, and accent contexts and wires them into the package builder. Use this contextual-variant model for the other dealers; do not assume one file works on every surface.

## Exclusions

- `cars-template-auto-best`
- `cars-template-modern`
- `cars-template-carwow`
- `cars-template-import`

These are reusable masters and must remain dealer-neutral.

`day-and-night-carwow` is a recovered/standalone project and is not the client-facing three-design destination. The client-facing Day & Night rollout is `day-and-night-a` with internal variant routes.

## Required next-session execution order

1. Read this file and enumerate the 24 client-facing projects.
2. Open each live Vercel design at desktop and mobile widths before changing it.
3. Inspect the dealer's published logo/source identity.
4. Choose `REFINE ORIGINAL` or `USE GENERATED CANDIDATE`; record the choice.
5. Produce transparent master PNG plus WebP light/dark/accent variants as required.
6. Wire the correct contextual file into all three designs, including drawers, footers, sell pages, and contact pages.
7. Preserve template composition and avoid unrelated redesigns.
8. Build and test all variants.
9. Commit and push to the dealer's real deployment source.
10. Confirm Vercel production is built from that exact commit.
11. Run screenshot QA and reject washed-out, red-on-red, black-on-black, boxed, bordered, haloed, or undersized logos.

## Definition of done

A project is done only when its production deployment has:

- no opaque logo background or unwanted border;
- no red-on-red, dark-on-dark, pale-on-white, or other contrast collision;
- correct logo on desktop header, mobile header/drawer, footer, sell page, and contact page;
- crisp rendering at the actual CSS size;
- no broken images, console errors, or horizontal overflow introduced by the change;
- the exact production commit recorded in the final report.
