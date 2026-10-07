# Latest template previews, 7 October 2026

The captured latest polish is pushed to Cars main at `ca8aca86c0f13f06fdb3506fe00299a36a3fa07b`. All five existing Vercel aliases below serve READY deployments with the exact publishing commits listed.

| Template | Phone link | Publishing commit | Deployment |
| --- | --- | --- | --- |
| modern | https://cars-template-modern.vercel.app/bg | `86c8afc683dfd46735af0fe9ef7b58832de469c5` | `dpl_48sf5WHPPAUbhszL4NW5mfJL2DkM` |
| mobile | https://cars-template-mobile.vercel.app/?lang=bg | `af4cdceebb599620b2e5172798e39a596c82cd8b` | `dpl_BJVtX5rx9P3mcwGEg7G2yiWaczyd` |
| app | https://cars-template-app.vercel.app/bg | `a433c9e552b3c3e369e457156b61175ac527051d` | `dpl_GXpooLa2WyRGRt4Bb1VS9KBMtcTV` |
| auto-best | https://cars-template-auto-best.vercel.app/bg | `b0914d93b00bf787896ddacb868b6ba4064aa28b` | `dpl_EZRbM6QcJow1B2z2X5RahXXQ6ZW5` |
| import | https://cars-template-import.vercel.app/bg | `a41a072d7099bbfda883d2073f28bb7289743cba` | `dpl_Qtgm3ZWoHMUxEJnpu3Jhhu21U8yr` |

## Verification

- Anonymous Chromium: 72 BG route/viewport cases at 320, 390 and 1440 px, including inventory, details, contact, Mobile Services and App Sell/Finance. Five EN phone-home cases passed. All responses were 200; no horizontal overflow, broken visible images or page errors were observed.
- All five phone filter dialogs opened, dismissed and restored focus. Modern and Auto Best menu dismissal restored focus; Import still has the previously recorded menu-focus finding.
- Modern: 101 marketplace-ui and 188 web unit tests passed. Mobile: lint/typecheck and 105 domain/localization tests passed, with two existing accessibility lint warnings. App: lint/typecheck passed. Auto Best: architecture, CSS, tokens, typography, assets, domain, localization and Svelte checks passed. Import: zero Svelte diagnostics, all 139 unit tests, architecture and image checks passed. Exact publishing commits completed Vercel builds.
- Workflow documentation validation and six focused workflow tests passed. Full workflow suite: 337/339; the two pre-existing Modern dealer-refresh fixtures still fail with Missing Modern financing logo anchor. Standalone preview publication is separate from dealer refresh acceptance.

## Source and boundaries

Other chats continued writing during this request. A second immutable capture incorporated their then-current source changes; the final test deployments use that capture. Later edits are not silently included in a completed build.

Karento and Karento Best source and QA records are committed in Cars as candidates. Neither has an existing Vercel project. Karento Best passed Svelte checks; the exported C:-to-L: dependency-junction build cannot be certified because Rolldown rejects the cross-drive generated entry name. The canonical local build passed during this run, but it is not exact-final-commit acceptance. No sixth dealer design, template lock, dealer manifest, fleet rollout, billing, DNS or outreach was changed.

Scoped commits and publishing mirrors used private indexes, preserved remote ancestry and checked source fingerprints. The occupied checkout retains its earlier HEAD and shared index; unrelated source, notes and recovery data were preserved. Verification exports under C:/Users/radev/.codex/tmp/cars-template-refresh-20261007 are immutable test copies, not editable masters. Operational receipts remain under runtime/template-refresh-20261007.

See [verification.json](verification.json) for exact provider, browser and interaction evidence.
