# Six-design dealer rollout contract — 11 October 2026

The owner selected Auto Best, Modern, Import, App, Mobile and Signature (`karento-best`) for every lead, served by **exactly one Cloudflare Worker per dealer**. This instruction supersedes older three/five-design and per-design-Worker guidance. It defines the target and acceptance contract; it does not certify a source candidate, deployment or completed fleet. Use [lead guardrails](LEAD-BUILD-GUARDRAILS.md), [coordination](COORDINATION.md), [publishing](LEAD-PUBLISHING.md) and [QA](QA.md) with the owner's current scope.

The owner clarified **100 dealers total**, including existing Varna and other Bulgaria/UK/USA/UAE identities. The adopted target roster contains 45 existing seed identities (25 registered dealer identities, 10 selected Varna and 10 selected UK) plus 55 qualified Varna additions. Nine replacements retain 46 original additions and add nine checked reserves; all 140 imported workbook rows and the original source hash remain preserved. Public phone/profile reconciliation found no shared identity keys across the 100 intended dealers; this is bounded identity evidence, not a legal-entity audit. Seven UK seed phones and five street addresses remain unknown. Website gaps mean no own site found in bounded searches, and listing counts remain dated advertisements. See [the intake adoption receipt](../leads/varna/intake-2026-10-11.json), [qualification evidence](../leads/varna/qualification-2026-10-11.json) and [100-dealer logo queue](../leads/branding/fleet-20261011/queue.json). Separate recorded deployments, prepared source candidates and new unbuilt candidates; this adopted roster does not certify 100 deployed dealers.

Preserve all spreadsheet research rows, but prioritize active passenger-car sellers with bounded evidence of website gaps. Multiple marketplace profiles do not mean separate businesses; raw listing counts may describe parts stock or placeholders.

## Required composition and mounts

| Public mount | Design |
| --- | --- |
| `/` | Auto Best |
| `/variant-2` | Preserve the dealer's existing Modern or Import; new leads default to Modern |
| `/variant-3` | The other family, replacing published Carwow |
| `/variant-4` | App |
| `/variant-5` | Mobile |
| `/variant-6` | Signature, source family `karento-best` |

Each family appears exactly once. Preserve actual entry/locale/detail routes recorded in `dealer.json`, compatibility redirects, stable dealer/repository identity, the six-choice design FAB and shared Admin demo link. Keep Carwow source/history as provenance. One public router plus six private design Workers still means seven Workers and fails the required architecture. The combined Worker must serve every design route and asset without per-family Worker/service-binding dependencies.

Keep the existing canonical checkout on `main` at `L:/CODEX/cars` (`J:/cars` is its junction). Use existing preservation-aware creation, refresh, package and export tools. Do not create another editable source copy or a second ordinary dealer generator. Immutable approved template pins remain authoritative; unfinished template or publisher work cannot be promoted by editing this document.

## Personalization contract

- Preserve each source template's hero/banner composition, artwork, typography, spacing, responsive behavior, buttons, accent colors and surface palette. Dealer colors belong to logo treatments; they do not recolor the templates.
- Personalize recognizable logos, factual business copy/location/contact channels, locale/metadata and listing data through actual imported configuration/data boundaries. Write short copy that fits the source slots and rendered line counts. Remove inherited dealer identities and unsupported claims without replacing the composition.
- Use Image Gen for every lead with `transparent_background: true`. Refine a visually sourced real logo while preserving its identity when available; retain the original as provenance. If none is found, create and disclose a proposal identity. Integrate transparent PNG/WebP assets using the existing `branding/logo-contract.json` with `onLight`, `onDark` and `onAccent` paths/hashes, actual tool provenance and reviewed surfaces. No CSS/text/font/SVG substitute fulfills branding acceptance.
- Share one sourced and dated stock pack across all six designs, preserving source IDs/URLs, observation dates, prices/currency, distance units and permitted imagery. If usable stock is unavailable, use honest demo listings labeled `illustrative-not-dealer-stock`; sourced observations remain `dated-listing-snapshot`. Unknown facts stay unknown. Demo inventory must not imply dealer ownership, availability, finance or discounts.
- Keep disclosure concise in appropriate existing notice areas. A generated concept is a proposal, dated stock is a snapshot, and an unavailable form remains a demo. Do not lengthen every heading with disclaimers or claim a delivered enquiry without a real service response.

## Release gates

1. **Source and ownership:** inspect branch/HEAD and relevant dirty/staged paths, coordinate overlapping writers, preserve paid customization and publishing-only fixes, and resolve stable dealer IDs. Al Reef retains its independent repository boundary. Before integration/publication run `node scripts/workspace-doctor.mjs --fetch`; routine documentation or local copy edits do not require the portfolio preflight.
2. **Template/publisher qualification:** select reviewed immutable source through the existing release tools. Prove six-family packaging and all mounts for both Modern-first and Import-first dealers. Prove the combined single-Worker output, including SSR/static adapters, asset paths, localized routes, compatibility redirects and safe demo behavior. A six-choice manifest or local build is insufficient evidence.
3. **Personalization acceptance:** inspect all six designs against their exact source at 390 and 1440 px; check changed copy slots, affected controls/layout and FAB at 320 px. Check logo alpha/visible bounds and on-light/on-dark/on-accent contrast, hero/banner crops and preserved colors, copy line counts, primary actions, factual contacts, inventory/card/detail/gallery consistency, menus/focus and overflow. Verify each logo consumer selects the intended surface asset, including any distinct `onAccent` bytes. Fix missing logos, extra lines, shifted actions and inherited identity before release.
4. **Pilot and hosted acceptance:** use the authorized dealer pilot/cohort. Recheck current account capacity and actual Worker names/bindings before mutation. Record exact source/export/package digests, Worker/version identity and unauthenticated hosted route/asset/browser results. Verify all six choices navigate on one origin, the shared Admin link and compatibility routes. Confirm that the public Worker has no per-design Worker dependencies. Preserve existing Vercel identities/releases until an authorized cutover; billing/DNS changes and provider deletion are separate scope.
5. **Bounded rollout:** advance only from the qualified pilot into the authorized dealer set, with per-dealer receipts and retryable progress. Reuse one stable dependency installation and one bounded owner output. Report each dealer's actual state; a partial cohort is partial delivery. Do not infer fleet completion from template changes, a provider READY state or a source push.

Run proportionate checks during iteration and the required production/mounted-design release checks once at the integration checkpoint. Keep compact results and useful matched before/after evidence; normally 2–4 captures for a small change. Retire only the owner's inactive generated intermediates after consumer checks, preserving declared baselines, unresolved defects, recovery evidence and other owners' work. See [QA retention rules](QA.md).

Before packaging, run the read-only branding check using the existing `sharp` installation:

```powershell
node scripts/verify-lead-branding.mjs --client <slug> --integrated
```

This requires a logo contract, declared real Image Gen provenance and identity status, transparent nonempty PNG/WebP treatments with matching hashes, and matching assets in all six public roots. It does not establish spelling, rendered contrast or correct consumer selection; those remain browser checks. Without `--integrated`, it checks the source treatments only and cannot certify a six-design release.

## Evidence and coordination

Record source implementation, scoped commit/push, package/reconciliation, build, deployed version, hosted browser health and owner review as separate facts. Record Image Gen provenance and inventory meaning explicitly. Never inherit QA pass flags or claim owner acceptance from agent checks. Publication does not authorize outreach.

This contract update owns `docs/LEAD-BUILD-GUARDRAILS.md` and this document. The active “Investigate UK template issues” chat owns template components and overlapping dealer-generator/logo/business-preview repairs; coordinate executable guard changes before writing shared scripts. Compact task evidence lives in `runtime/fleet-rollout-20261011/`.
