# Repository audit entry point

This repository is the source snapshot of the owner's `J:/cars` automotive template library, published for review on 8 September 2026. It contains ten reusable template baselines and 34 demo applications across 12 client folders. Client folders include prospects and do not establish a paid relationship or outreach approval.

## Read first

1. [AGENTS.md](../AGENTS.md): ownership, permitted changes, template fidelity and verification rules.
2. [catalog.json](../catalog.json): exact template keys, aliases, versions, stacks, homepage variants and recorded readiness.
3. [Workflow](WORKFLOW.md) and [template promotion](TEMPLATE-PROMOTION.md): independent client copies and shared master improvements.
4. Each `templates/<key>/TEMPLATE.md`: provenance, current limitations, install commands and representative review routes.
5. Each client brief and `clients/<client>/<template>/.client/project.json`: intended scope, lineage and recorded QA. Inspect these alongside actual code; some older README/setup notes predate the current client builds.

## Useful evidence

- [Initial comparative audit](../audits/2026-09-06/REPORT.md).
- [Auto Best improvement report](../audits/2026-09-08/auto-best-improvements/REPORT.md).
- [Carwow finalization report](../audits/2026-09-08/carwow-finalization/REPORT.md).
- The dated `audits/` folders contain additional reports, source snapshots, screenshots and comparison pages. Evidence applies to the recorded version, route and viewport; it is not a fresh qualification of this Git commit.

## Suggested review scope

Audit before proposing implementation. Prioritize concrete issues in maintainability, reusable identity and content boundaries, master/client drift, route completeness, misleading demo interactions, accessibility, mobile UX, security, and reproducible setup. Preserve the actual source layouts and distinguish shared template defects from client personalization gaps.

For each finding, give severity, repository path and line, evidence or reproduction steps, user impact, and the smallest appropriate fix. Separate code inspection from rendered verification. Return a prioritized repair plan, and identify which fixes belong in a master and which belong in a client copy. Start with Auto Best, Modern and Carwow, then review the remaining families against their declared readiness.

## Running and interpreting the snapshot

There is no single root application or root build. Install each selected application's retained lockfile using its documented Node and package-manager version. Keep Modern's full monorepo together; its public web app is under `apps/web`. Use [start-preview.ps1](../scripts/start-preview.ps1) from the repository root with an explicitly free port.

Localhost links and `J:`/`M:` paths in historical evidence refer to the owner's machine. They are not hosted previews or portable links. Dependencies, generated build caches, local runtime logs, credentials and deployment bindings are excluded from Git. Sanitized environment examples are retained where supplied.

Before publication, embedded Google/vendor keys and captured session/CAPTCHA tokens were replaced with explicit placeholders in 114 captured asset, reference and research files. Original local captures were backed up under the ignored `runtime/repository-publish/original-captures/` directory. Historical capture hashes may therefore describe the original bytes. Captured map/API integrations require the operator's own configuration; source test fixtures and empty environment examples were retained after reviewing the scanner's false positives.

Source branding, sample inventory and some frontend-only form feedback remain intentionally documented limitations. A successful local UI state does not establish message delivery, payment, authentication or provider integration. Existing source licenses and asset provenance remain in place; this publication adds no new license grant. No application rebuild, browser acceptance or live deployment is implied by uploading this source snapshot.
