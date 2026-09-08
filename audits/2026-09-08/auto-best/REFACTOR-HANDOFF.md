# Auto Best — implementation-thread handoff

Prepared 8 September 2026. Audit complete; application source untouched by the audit.

## Suggested opening instruction for the next thread

> Work only on the reusable Auto Best master at `J:/cars/templates/auto-best`. Read `J:/cars/AGENTS.md`, the template's AGENTS.md/TEMPLATE.md/.template/template.json, and the reports in `J:/cars/audits/2026-09-08/auto-best`. Confirm the current files/listener against the audit baseline before editing. This is shared template improvement, not a client Fast Skin and not work in the original M: Day & Night project. Preserve the current desktop/mobile layouts, artwork, typography, navigation and icon families. Implement the approved repair batches below in order, using the audit's reproduction steps and acceptance checks. Keep changes reviewable by component family. Do not turn this into a framework migration, new UI library, new backend or redesign. Do not update independent client copies, commit, push or deploy unless I explicitly ask.

The owner should choose which batches this instruction authorizes. The audit itself did not start implementation.

## Identity to verify

- Master: `auto-best`, family `autodeal`, version label `2026.09.06-refresh-1`.
- Physical path: `J:/cars/templates/auto-best`; no Git repository at audit time.
- Catalog aliases: `5173`, `6511`, `autodeal-best`, `autodeal-polished`.
- Audited local preview: <http://127.0.0.1:6461/>. Audit-created listener PID 60520. PIDs/ports are ephemeral; verify ownership again.
- Recorded source provenance: old M: source commit `ab92ce9671fb1b56afa38f693755b41aee9c28b0` plus source working files. Do not use that SHA as proof of the current J: files.
- Current hashes: [source-manifest.json](evidence/source-manifest.json). Preserve intervening owner changes; do not overwrite them from the report or source project.
- Required runtime: Node 22.12+ in the Node 22 line; audit used `C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe` for validation and preview.

## Proposed batches

| Batch | Concrete result | Audit references | Verification |
|---|---|---|---|
| 1. Qualification and focus | Reliable incremental browser reports; reconcile stale card assertions; fix missing focus token | A01–A02, M07/D03 | Failures still write reports; focus visible; actual stretched hit target preserved |
| 2. Journey context | Car-specific contact intent, accurate CTA labels, safe list return, valid/error dock distinction | A03/A10, M02–M04/M08, D02/D04/D05 | All eight cars; direct/invalid URLs; BMW sorted list round trip; no fake gallery control |
| 3. Discovery domain | One serializer/label/count/reset model; appropriate stock choices; correct guide destinations | A04/A08, M05/M06/M13, D06/D07/D10 | Every facet; repeat equipment; unknown/invalid query; zero state; home/index consistency |
| 4. Overlay and shell ownership | Shared lifecycle contracts; background isolation; skip link; smaller responsibility-based header modules | A05–A07, M09/M12, D09 | Nested Escape, focus return, navigation/unmount, 991/992 boundary, no leaked locks |
| 5. CSS/media polish | Clear family ownership; remove retired asset requests; tighter article supporting layout | A06/A11, M11, D08/D11 | Before/after screenshots; route navigation in both orders; media request evidence |
| 6. Reusable content/release | Typed personalization contract, item provenance/validation, optional sections, version/evidence refresh | A08–A10/A12, M01/M10, D01 | Source-identity scan; sitemap derives from records; no sample people/partners in lead mode |

Do not use source content work as permission to research or change a specific lead's CRM. A master can gain validation/optional-section support without inventing replacement people, reviews or stock.

## Preserve these tested behaviors

1. Compact inventory rows on mobile; four-column vehicle cards at the reviewed desktop width.
2. Distinct home-mobile discovery and desktop search compositions.
3. Full-screen mobile filter dialogs/pickers, with draft cancellation and applied state in the URL.
4. Make changes clear incompatible models and preserve sort; empty results provide recovery.
5. Local Sell/Import photos and drafts, explicit not-sent wording, copy/share fallback. Test sharing with stubs; do not send a real message.
6. Principal calculator reacts to deposit/term, clamps the deposit, and states its excluded finance costs. Do not silently turn it into an actual finance offer.
7. Existing hero art, deliberate route colors, Onest type, bottom navigation and action hierarchy.
8. Working settled maps and YouTube playback; do not delete embeds because a fast screenshot was blank.

## Acceptance before calling the master improved

- Reconfirm runtime identity and untouched unrelated work. If the preview must be started, use the Cars helper with an explicitly free port; do not steal 5173/6511 or silently move the preview.
- Run existing architecture/assets/Svelte/build checks on the supported Node version. Do not build and run a competing runtime against the same generated output concurrently.
- Resolve or explicitly report every remaining general-smoke failure. Current audit baseline: validate PASS; three dedicated smoke suites PASS; general smoke incomplete/failing after mobile assertions and picker timeout.
- Recheck [COVERAGE.md](COVERAGE.md), especially all vehicle/article variants, 390/1440, 320/430, 991/992, landscape, overlays, focus, empty/error states and the corrected journey paths.
- Add meaningful regressions for newly fixed behavior. Do not encode every implementation detail or loosen an assertion to conceal a defect.
- For CSS moves, compare default/focus/open states and both directions of route navigation. Functional success does not prove visual fidelity.
- Record the new master version, changed ownership files, checks and known limitations. Follow [template promotion](J:/cars/docs/TEMPLATE-PROMOTION.md) when creating a reusable release; existing clients remain independent.
- Real lead readiness additionally requires verified lead identity/content and, if requested, a tested public preview. Local master quality is not proof of publication or message delivery.

## Scope guidance

Use **one dedicated implementation thread** for this master. It should own shared shell/style decisions and keep a short batch ledger. Multiple concurrent threads editing the same global CSS and filter state would make the baseline harder to preserve. If separate client work proceeds, it belongs in independent client copies and must not be silently synchronized.

Do not interpret “refactor fully” as “rewrite everything”. Finish the verified problems and the ownership changes that make future Fast Skins predictable. Retain focused modules that already do their jobs well.
