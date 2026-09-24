---
name: cars-lead-build
description: "Create or correct a dealer demo in Cars using approved template releases, sourced content and the existing three-design workflow. Use for dealer implementation; exclude read-only status and shared-template polish."
---

# Cars dealer implementation

Read [WORKFLOW](../../../docs/WORKFLOW.md) and the selected dealer's existing manifest/brief/metadata. For new personalization also read [LEAD-BUILD-GUARDRAILS](../../../docs/LEAD-BUILD-GUARDRAILS.md).

Resolve stable identity and registry aliases before cloning. New dealers use the approved standard trio (Auto Best, Modern, Carwow) or intentional Import trio (Auto Best, Import, Carwow). Existing manifests determine actual designs. Use one sourced, dated fact/inventory/asset pack through the real app data boundaries; preserve the template composition.

Use the existing canonical Cars checkout on synchronized main. `new-client.mjs` now performs checkout and current Cars template development checks itself, verifies committed releases, refuses drift/duplicates and stages all three copies before canonical installation. Newer unfinished development is reported rather than released automatically. Complete release review/promotion for a finished update within the task; do not claim an older snapshot is the newest release. `template-release.mjs discover` and `status` remain available for Cars template release work. Preview creation with `node scripts/new-client.mjs --client <slug> --repository <owner/repo> --preset standard --dry-run` (or import). Continue the authorized build with the same command without dry-run. Never bypass an unexplained release hold.

For a correction, edit canonical `clients/<slug>/`; compare publishing-only fixes before generating a replacement. Template-only work belongs in Cars templates/<key> and does not invoke publication. An audit/status request remains read-only.

Complete [QA](../../../docs/QA.md), scope the source commit, then follow [publishing](../../../docs/LEAD-PUBLISHING.md) when included in the request. New dealer builds include publication under root policy; do not ask again for already authorized steps. Explicit local-only instructions override that default. Publication never authorizes outreach.

Return the actual source/export commits, public URL when verified, checks and unresolved evidence. Update the existing technical registry; do not invent private CRM history or owner approval.
