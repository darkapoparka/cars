# Six-design dealer release: executed checkpoint

## Result, not an approval

The existing **Promosale pilot now passes all six native service production builds** at `963ba03df08ecaa98e7508fc9111af056c57fd3a`. [GitHub Actions run 38085547657](https://github.com/darkapoparka/cars-promosalevarna/actions/runs/38085547657) holds the exact build receipts. The worker commands come from the actual generated `vercel.json`, not substitute template builds. See `promosale-native-builds-web-resume.json` for service jobs, artifact digests and runtimes selected by the workflow.

**No dealer was installed into canonical source or deployed to production by this checkpoint. The fleet is not complete.** Native compilation does not establish combined Vercel output, mounted routes, browser behavior, production READY or aliases.

## What was changed

The first pilot run passed Auto Best, Import, App, Mobile and Signature, but Modern failed TypeScript because `logoSource` was declared in the parent and referenced in the extracted mobile-wordmark child. The pilot fix passes that same selected dealer asset through a typed prop; its only application diff is three added lines and one changed line in the header. The shared fix is in `scripts/lib/client-logo-contract.mjs`, with legacy/idempotence/CRLF/fail-closed regression cases in `scripts/client-logo-contract.test.mjs`. No branding assets, crop, layout or dealer facts were replaced.

The existing pilot branch advanced from `1f9e00d9153b305cfe48e10a454efd633d5ed500` to workflow commit `0b92355c8690a05d133b7ba47c8dc6fd648fe622`, then the application fix `963ba03df08ecaa98e7508fc9111af056c57fd3a`. Do not overwrite it from the older local push receipt. Preserve the pilot-only CI file when reconciling a later publishing export.

## Exact six-source selection

- auto-best: `696230a404abd9b20b6f907b9cfb139175298c7a`
- modern: `6f87470c1e3ec8ade7d9ecc07daf9ebe45cb9710`
- import: `b9373e9ed5453bc7d208898ae140eae4d596a232`
- app: `4e184777567849a2c5b4a9e4a3e652252179c29c`
- mobile: `8a97176e3adfbd95dce69b3096abc84e3eecd9c8`
- Signature: `cc130e432a41a3a60cc80bc2b3461c6416893b4a`

These pins were verified against the latest committed family source. The recovered/untracked App tooling and unrelated owner edits were not swept into a commit. The 25-dealer scope, existing bindings, proposed mount order and 325 retained stock records are recorded in `fleet-scope-20261010-web-resume.json`. The separate new-Varna and UK batches are not this 25-dealer target.

## Local refresh state

A fresh Al Basma six-family candidate completed through the existing `refresh-client` tool with zero conflicts; its retained run is `runtime/dealer-template-upgrades/al-basma-motors-1791664814874-kV1TNw`. Deliberate source-boundary decisions for Al Basma, Al Hamoor and independently owned Al Reef are in `runtime/vercel-six-rollout-20261010-execute/fleet-plan-resume-20261010/`. They preserve exact stock initializers, dealer locale settings, bilingual facts, App JSON values and existing logo surfaces. They are not build/installation approval.

The single-process fleet planner failed while starting its fourth dealer, Asko 96, with `FATAL ERROR: Committing semi space failed` / external-memory pressure. Its first three review outputs are preserved. Do not rerun the long-lived 25-dealer loop as though it succeeded; use isolated, bounded processes and reuse existing evidence. Later physical free space was approximately 0.86 GiB on L and 1.45 GiB on C during concurrent work. Do not start another full asset/dependency copy without a fresh capacity check.

The direct file connector rejected the I-drive batch path under its allowed-directory policy. Do not circumvent that denial through another command or silently widen access. The GitHub pilot is independently accessible through the authorized repository connector. Keep all existing I-drive preparation intact.

Six inactive incomplete Git `tmp_pack_*` files previously reported as garbage were preserved, not discarded, at `C:/Users/radev/Documents/Codex/2026-10-10/cars-release-preservation/interrupted-git-packs`; `receipt.jsonl` records original paths, sizes and verified SHA-256 values. This freed the release checkout enough for a successful scoped fetch. No Git history, project source or Codex session data was deleted.

## Provider capacity

An authenticated Vercel preview-creation request for the existing Promosale project returned HTTP 402 with `payment_required`, limit `api-deployments-free-per-day`, more than 100 deployments, and `retryAfter: 86400`. The recorded observation is **2026-10-10 20:25:42.084 UTC**. No deployment was created. This is an observed rejection, not a promise that a specific future retry will succeed. Billing, plan, aliases, DNS and protection settings were not changed.

## Checks and outstanding work

The 29 focused release-regression tests pass, including all seven logo tests. The repository documentation/workflow check passes. The broad workspace test run reports **568 passed, 2 failed, 1 skipped (571 total)**: a separate UK Mobile boundary expectation mismatch and a UK Git-read timeout. Preserve those findings and that other owner's changes instead of reporting an all-green workspace.

Continue the actual preservation-aware refresh and installation for all 25, then reconcile publishing mirrors. Regenerate accepted packages with the shared logo fix; do not mutate an old candidate and keep its old fingerprint as approval. The combined Vercel output audit, full mounted Promosale acceptance, Priselci's opposite mount order, EN/BG and both alternate homes, details/reloads, branding/favicon/social/canonical metadata, FAB/Admin and primary-action checks remain necessary. Publication must use existing repos/project IDs/public aliases, and conclude with exact source SHA plus production READY and alias proof. Do not run the legacy version-2 fleet workflow, bypass quota, add paid capacity or send outreach.
