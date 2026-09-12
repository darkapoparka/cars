# Cars workflow organization — local Codex handoff

Status: proposed implementation plan based on a read-only audit. No repository changes, synchronization, cleanup, or deployments were performed by the audit. Re-read the current repository state before implementing; other work may have advanced.

## Objective

Keep independent template development, repeatable three-design dealer builds, and one-domain dealer publishing. Give every piece of editable source one authoritative repository. Remove the need for the owner to remember manual synchronization steps.

## Recommended ownership

- `darkapoparka/cars-template-auto-best`, `cars-template-modern`, `cars-template-carwow`, and `cars-template-import`: authoritative reusable template source. Shared frontend work belongs here.
- `darkapoparka/cars`: integration workspace, approved template snapshot catalog, public lead research, canonical prospect implementations, packaging tools, and technical deployment registry.
- `cars/templates/<key>`: version-pinned, managed copies of approved template releases. Do not develop a second independently editable master here after reconciliation.
- `cars/clients/<slug>`: authoritative editable prospect source, with all selected variants together.
- Existing dedicated dealer repositories, including `excellent-cars` and the `cars-*` dealer repositories: publishing mirrors of the canonical dealer source plus reproducible deployment integration. Preserve their identities and history.
- Vercel: one project and primary origin per dealer; all offered variants use the same origin and an accessible design switcher.

Preserve the current local directory choices: `J:/cars`, `J:/template-repos/<repository>`, and existing recorded publishing checkouts. Do not create another Cars workspace or nested template Git repositories. Do not delete old publishing copies until unique source and history have been reconciled.

## Evidence found during this audit

### GitHub

`cars/main` was `39a19af3ec6e60a707d8427942dbdbb528aea832`.

Standalone template main commits observed:

| Repository | Commit |
| --- | --- |
| cars-template-auto-best | 1a32dc2b994d78c794e2d19bfd2d24c7adc48807 |
| cars-template-modern | f64006130523375e440d48e4c4be6ec1b830d46a |
| cars-template-carwow | d769bb0558ad0228b92440fc3fd9ff81548bc890 |
| cars-template-import | 3c24db073b0b1a3bf26c64ed5336921117658e29 |

These are observed commits, NOT an approval to promote them. A comparison of Git blob hashes for shared paths found differences between every standalone template and the committed Cars counterpart. Auto Best, Modern, and Carwow include source-code differences; Import's shared-path differences were instruction documents. No semantic quality judgment follows from those counts.

`cars` was public. A private publishing mirror does not make source already committed to a public upstream private. Keep CRM information, credentials, and private sales material outside public repositories. Do not change repository visibility as part of this handoff without a separate owner decision.

### Local work that must be preserved

- Cars local `main` HEAD: `adc16cc3e3ae430c1f53e64dd7086ce632e29e38`.
- Cars had 9,393 staged paths and 235 unstaged paths. These counts are audit observations, not a current guarantee.
- Local template checkouts exist under `J:/template-repos`.
- Auto Best had 28 unstaged paths; Carwow 327; Import 74.
- Modern's local checkout was on branch `astra`, HEAD `ecaf6324c21805df0054011063473f9fce978788`, with three unstaged paths. Its local `main` tracked the standalone main noted above.
- Do not switch Modern's branch or reset any checkout without preserving and reviewing the existing work.

The local Cars publishing guide already contains an uncommitted change favoring canonical client-source exports over new sibling deployment checkouts. Preserve and reconcile it rather than reintroducing the old copy-edit-copy loop.

Local untracked workflow work includes:

- `scripts/export-dealer.mjs`
- `scripts/index-deployments.mjs`
- `scripts/serve-dealer-preview.mjs`
- `scripts/verify-dealer-preview.mjs`
- `docs/DEPLOYMENT-INVENTORY.json`
- `docs/DEPLOYMENTS.md`

The published Cars workflow does not yet include all of these files.

### Specific implementation gaps

1. `scripts/new-client.mjs` reads `catalog.json` and copies the local `templates/<key>` directory. It does not fetch or promote standalone template repositories. It records a human-readable template version, not a complete upstream release lock.
2. Generated client `AGENTS.md` instructions reference absolute `J:/cars/...` paths. Standalone dealer repositories and hosted agents need portable instructions.
3. The local `export-dealer.mjs` allowlist contains `auto-best`, `modern`, `carwow`, and `scripts`, but not `import`. It also excludes top-level `assets`; resolve whether each dealer requires those files instead of silently omitting them.
4. The local `index-deployments.mjs` variant list is `auto-best`, `modern`, `carwow`, and `rencar`; it omits `import` and hardcodes standard route descriptions.
5. The local exporter derives parent history from a local export ref. A robust publisher must inspect the actual target remote head and preserve its history and any unmatched changes. Do not force-push an unrelated root history to make publication succeed.
6. Publishing transformation scripts live under `J:/cars-deployments`, including `apply-three-design.py` and `apply-three-design-import.py`. The standard helper reads the FAB from an absolute `J:/excellent-cars/...` path. This dependency must become a versioned, portable publishing asset.
7. The rollout included changes in publishing copies. A fresh export of the older canonical client source could erase those fixes unless they are backported or represented in a tested, versioned packaging layer.
8. The local deployment inventory is historical and cannot be treated as a live Vercel audit.

## Implementation sequence

### 1. Preserve and reconcile before reorganizing

Inventory each relevant checkout's physical path, remote, branch, HEAD, dirty state, and unique commits. Preserve staged/unstaged/untracked work and relevant local refs. Compare the local Cars history with the actual remote main before integration. Do not use `reset --hard`, blanket `git clean`, force-pushes, or a blanket commit of the current index.

Resolve template changes into the appropriate standalone upstream without losing Cars-only improvements. Reconcile dealer publishing fixes back into canonical source or a reproducible packaging layer. Keep deployment URLs and repository identities unchanged.

### 2. Establish one source for approved template versions

Extend the current catalog or introduce `templates.lock.json`; do not create two conflicting authoritative version lists. Record, per template:

- upstream repository;
- immutable commit SHA;
- optional human-readable release tag;
- snapshot path and digest of included content;
- export/normalization policy version;
- supported standalone and mounted modes;
- verified runtime/package manager requirements;
- QA evidence tied to the exact commit.

Keep local preview ports in the catalog. A template's `main` is development head; the Cars lock selects the reviewed release used for new leads. Do not treat an arbitrary latest commit as approved.

Build an explicit template promotion/synchronization operation. It must show a dry-run diff, refuse or report unexpected local edits, verify the exact upstream commit and exported files, update the snapshot and lock together, and leave existing client copies unchanged. Begin with one template as a pilot.

A release may create an update proposal in Cars, but promotion must remain distinguishable from discovery. Before a new lead build, automatically verify that the cached template matches the selected lock. No repeated owner reminder to pull templates should be necessary.

### 3. Improve new-client creation without redesigning templates

Extend the existing clone helper rather than replacing it with an unrelated system. Preserve its duplicate/path checks and source-copy exclusions. Resolve existing lead aliases and stable dealer identities first. Record per-variant template commit and packaging compatibility in client metadata.

Use one sourced, dated fact/inventory/asset pack per dealer and feed each template through its real data boundaries. Do not introduce a JSON configuration that the application never reads. Preserve layout and interaction behavior during ordinary personalization.

Generate portable client instructions: identify the copy as a dealer project, link to the workflow at its source revision, include local variant commands, and do not declare the dealer copy a reusable master. Preserve required technical template guidance while removing irrelevant historical task orders.

### 4. Make the Excellent-style publisher reproducible

Bring the existing deployment recipes and switcher into versioned Cars tooling. Use one dealer manifest to declare variant keys and entry routes. Retain current public routes:

- Standard trio: `/` Auto Best, `/variant-2/cars` Modern, `/variant-3/` Carwow.
- Promosale/OutletCars-style trio: `/` Auto Best, `/variant-2/` Import, `/variant-3/` Carwow.

Do not force Modern into a dealer already intentionally built with Import. Do not infer a fourth design merely because four templates are available.

Parameterize reusable base-path handling within each upstream template where feasible, preserving standalone operation by default. Keep root Services routing and cross-design navigation in the publishing layer. Test assets, CSS URLs, raw links, locale handling, requests, redirects, and deep links; setting a base path alone is insufficient.

Preserve the full Modern workspace. Generate Prisma only as required for the build; static preview mode must not introduce live database dependencies or relax unrelated production modes. Honor the release's documented runtimes and lockfiles.

Avoid repeated broad regex mutations of already-transformed source. The same canonical source commit, template locks, and packaging version must yield the same application payload. Keep timestamps and deployment evidence separate from deterministic source output where necessary.

Review existing target remote commits before exporting. Preserve the target history, compare exact payloads, reject unexpected publishing-only changes, and push without force. Use the existing Git-to-Vercel link as the sole trigger for that commit; do not launch duplicate CLI and Git deployments.

### 5. Consolidate technical project/deployment records

Evolve the existing deployment inventory rather than inventing another competing registry. Keep stable dealer IDs, canonical source path, aliases, repository name, Vercel project/team identity, primary domain, actual offered variant routes, template source SHAs, canonical source commit, exported commit, packaging version, deployment ID, and timestamped verification evidence.

Model source presence, personalization, build checks, publication, HTTP/browser verification, and owner review separately. Missing evidence means unknown, not failed or ready. Owner review is not automatically satisfied by agent QA. Lead research is not a private CRM ledger.

Build the dashboard and readable deployment list from the same registry. Include Import and legacy variant exceptions explicitly. Do not overwrite unknown existing data with guessed defaults.

### 6. Rewrite instructions for current task boundaries

Keep root `AGENTS.md` short: ownership, task routing, preservation, expected completion, and relevant commands. Move the closed ten-session `astra` campaign's operational directions out of active instructions while retaining history and a clear superseded marker. Do not confuse that historical branch name with the Astra model.

Use contextual references rather than demanding that every task read every document. Root rules should distinguish:

- shared template polish;
- new dealer personalization;
- dealer correction;
- template release/promotion;
- publication;
- read-only audit.

A requested dealer build under the standing workflow includes personalization, appropriate QA, commit/push, publication, and hosted verification. A template typo fix does not authorize redeploying all dealers. Publication never implies authorization to contact a dealer. Respect narrower explicit scope.

Keep model choice in Codex configuration/preferences, not business manifests or every skill. Do not mass-replace application API model strings or upgrade dependencies as part of an instruction cleanup.

Suggested small repo-scoped workflow set in `cars/.agents/skills`:

- `cars-lead-build`
- `cars-publish`
- `cars-template-release`

Use short, specific descriptions. Keep deterministic synchronization and publishing logic in tested scripts; keep judgment and procedure in skill instructions. Existing template-specific AGENTS/docs may be sufficient without adding more skills to every template.

For this web project, use a short project instruction to read the current Cars AGENTS/workflow through GitHub when relevant. Local Codex skills and local uncommitted files are not automatically synchronized into the web conversation. An installable shared plugin is optional later, not a prerequisite.

### 7. Verify with a bounded pilot

Use one template promotion and one already-existing dealer publication as the pilot; choose an authorized low-risk target and preview before changing production. Test the actual changed paths rather than rebuilding the entire dealer portfolio for a documentation change.

Required automation checks include snapshot integrity, duplicate/alias prevention, secret/generated-file exclusion, supported variants including Import, repeatable packaging, preservation of existing remote commits, mounted routing and assets, and technical-registry consistency.

For a newly published or materially changed dealer, verify all offered design entries, inventory, one detail, contact/enquiry destination, relevant interactions, and actual deployed FAB on mobile and desktop. Confirm public access without a login redirect. Verify the intended deployment and commit, not merely some older READY deployment. Do not send external test enquiries.

Return exact changed files and commits, verified template locks, pilot deployment evidence, preserved/unresolved work, and commands that now actually exist. Do not call planned CLI commands implemented.

## Daily working rule for the owner

- Open Cars in Codex for a new dealer, existing dealer fixes, lead research, dashboard, and publication.
- Open the relevant standalone template project for reusable frontend work.
- Use all five projects, but never independently edit the same template in Cars and its upstream.
- Let one agent own a checkout's writes/index/build output at a time. Other agents can review, research, or work in a different template repository.
- Share handoffs through repository state: repo, branch, base/head SHA, owned paths, actual checks, deployment identity, and next action. Do not depend on conversation memory.

## Source references

Current Cars guidance and code read:

- https://github.com/darkapoparka/cars/blob/main/AGENTS.md
- https://github.com/darkapoparka/cars/blob/main/docs/WORKFLOW.md
- https://github.com/darkapoparka/cars/blob/main/docs/LEAD-PUBLISHING.md
- https://github.com/darkapoparka/cars/blob/main/docs/TEMPLATE-PROMOTION.md
- https://github.com/darkapoparka/cars/blob/main/scripts/new-client.mjs
- https://github.com/darkapoparka/cars/blob/main/catalog.json
- https://github.com/darkapoparka/cars-template-modern/blob/main/AGENTS.md
- https://github.com/darkapoparka/cars-template-auto-best/blob/main/AGENTS.md
- https://github.com/darkapoparka/cars-template-carwow/blob/main/REUSE_GUIDE.md
- https://github.com/darkapoparka/cars-tesicarvarna/blob/main/vercel.json

OpenAI guidance read:

- https://github.com/openai/skills/blob/main/skills/.curated/openai-docs/SKILL.md
- https://developers.openai.com/api/docs/guides/latest-model
- https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra
- https://developers.openai.com/codex/guides/agents-md
- https://developers.openai.com/codex/skills

Local observations came from read-only Git/gh commands and the named files in the authorized remote workspace. They need refreshing before any migration.
