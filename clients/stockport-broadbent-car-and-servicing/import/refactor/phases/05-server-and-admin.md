# 05 — Server and administrative boundaries

**Status:** Planned — not implemented by this audit.  
**Findings:** F16–F21.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** finish the live-capability architecture and migrate retained account/admin consumers. Phase 00 already contains immediate mode/provider risks; this phase is not permission to defer them.

### P05-1 — Supported capability decision

Confirm which account, agent, CMS, upload and AI features belong in the reusable release. A storefront-only release may deliberately omit/disable them, but it may not expose demo implementations as production-ready. Do not remove an existing product feature merely to simplify the audit score.

### P05-2 — Durable and request-safe services

Separate fixture state from enabled live storage. Replace module-array live sessions and filesystem-dependent live CMS persistence where those capabilities are retained. Define transactions, publication rules, idempotency, failure handling and privacy boundaries. Keep server-only configuration and typed public view models.

**Paths:** `server/db.ts`, `auth.ts`, `cms-persistence.ts`, inquiry persistence/schema/config modules, relevant account/admin APIs and page actions.

### P05-3 — Authorization and upload contract

Test each read/write operation independently for unauthenticated, wrong-role, expired and malformed sessions. Use secure cookie handling and clear logout/revocation behaviour. Implement the private-document/public-image split and actual-content validation before enabling live uploads. Define limits at request, file and provider boundaries.

### P05-4 — Native retained admin/account UI

Consolidate admin/account layout and generated UI theme aliases without leaking reset/colour/font globals into the public site. Migrate retained `AuxeroDashboardSlotShell`/page-wrapper consumers away from raw HTML/runtime replay. Keep intentional admin density and useful existing primitive source. Test authorized data states with synthetic roles.

### P05-5 — Optional AI isolation

Keep provider models/keys/context server-only and independently gated. Bound/validate messages, context and resource usage; make fallback status honest. Test provider-disabled/error cases with mocks. Do not introduce model-driven writes/publication as part of a frontend refactor.

### Exit and handoff

The mode/permission/storage/upload/provider matrix passes for every enabled capability. Unsupported capabilities are visibly and server-side disabled. Retained admin/account pages no longer require unowned legacy globals or unqualified persistence. Document data migrations and rollback separately from Git rollback; never run them against an unknown live store without authorization.
