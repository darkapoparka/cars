# 07 — Runtime modes, capability safety and security

## Scope and threat model

This is a template-readiness review, not a penetration-test report or a claim about a currently deployed instance. No live database, provider, dealer account or private upload was exercised. Preview data and live dealer data must have different trust assumptions.

The highest-priority architectural risk is the coupling between missing database configuration, demo authentication and independently enabled live features. Resolve that before enabling a real provider or promoting a dealer release, independently of the visual migration schedule.

## Explicit mode and capability matrix

Use a validated server configuration with an explicit preview/live mode. Public presentation flags are not authorization. A provider key or `DATABASE_URL` is not a substitute for an intentional mode selection.

| Mode/capability                                             | Required behaviour                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Preview, no providers                                       | Synthetic data and clearly labelled demo submissions; no real outbound delivery                   |
| Preview, provider key accidentally present                  | Live provider remains disabled; no paid request or real lead delivery                             |
| Live inquiry enabled, missing durable store                 | Startup/configuration failure or explicit unavailable capability; never memory fallback           |
| Live admin enabled, missing real auth/session store         | Admin capability unavailable; never prototype role fallback                                       |
| Live uploads enabled, missing private/public storage policy | Upload capability unavailable                                                                     |
| Live AI enabled                                             | Independent authorization and permission plus explicit provider configuration and resource limits |
| Feature disabled                                            | Navigation and server endpoints agree; direct requests do not bypass the flag                     |

Configuration validation must happen in server-only code. Return only non-sensitive presentation values to the client. Keep demo adapters small and explicit rather than embedding mode branches in every component.

## Authentication and authorization

Retain the already tested protection of durable inquiries. Replace prototype session synthesis for live access with a supported authenticated-session mechanism and durable/session-verifiable storage. A database connection does not itself make an account authenticated. Gate every protected read and mutation at the server boundary; a protected page layout alone does not authorize its API routes or actions.

Sessions need expiry, logout/revocation behaviour, secure cookie settings appropriate to the actual origin and path, and predictable behaviour across restarts/instances. Prefer framework cookie handling over hand-built strings where practical. Review the current unguarded decode path on logout with malformed-cookie tests. Do not expose session tokens or private configuration in logs or client load data.

This plan does not require a new authentication vendor now. Choose the smallest supported solution for the enabled dealer capabilities and prove the boundary. A storefront-only release may keep administrative capability disabled instead of building a comprehensive multi-role system.

## Persistence and concurrency

The inquiry database path is a useful existing durable boundary. Preserve its safe failure behaviour. The rest of `db.ts`, local CMS JSON and public filesystem uploads must not be advertised as a multi-instance production persistence layer.

Use durable storage for live sessions, submissions and content where those features are enabled. Specify transaction boundaries for competing writes, idempotent submissions and publication changes. Atomic rename of one local JSON file does not prevent stale concurrent reads or distribute state across instances.

Keep local file-backed fixtures useful for development, but do not silently fall back to them when a live store fails. Backups/migrations/retention need an explicit operator procedure. No migration should run automatically against an unknown production database during an application refactor.

## Upload handling

Separate public vehicle imagery from private documents. Validate actual file signatures/content, canonical MIME and allowed extension together. Re-encode public images where appropriate, use safe generated names and bound dimensions, per-file size, count and total request size. The current extension-or-MIME test is insufficient for a live boundary.

Store private documents outside public static directories. Use an authorized download path or controlled signed access with a retention policy. Do not assume a client-supplied MIME label makes an arbitrary extension safe. Test partially failed batches and cleanup so one failure does not leave orphaned files or half-published records.

Perform authentication and inexpensive request checks before costly processing where possible. Rate/resource limits should be backed by the actual deployment capability, not a per-process map that disappears or differs across instances. Test synthetic files only.

## HTML and script trust

Raw HTML is not automatically a vulnerability; its source and sanitization matter. The current imported template/runtime replay path is nevertheless unnecessary complexity for migrated native routes and impedes a clear script/content policy.

Keep any remaining imported HTML source fixed and allowlisted. Do not allow dealer/customer text to become executable runtime HTML. Trace untrusted interpolation and escaping before exposing editing features. Remove dynamic script replay with the relevant feature rather than attempting to preserve it as a general plugin system. Review a restrictive content-security policy after the required script/asset sources are understood; do not ship an untested policy that breaks forms or add broad unsafe exceptions just to silence reports.

## Optional AI

Treat AI as an optional admin capability, not part of the public rendering path. A key alone must not enable it. Require real authorization, validate message types and size, minimize customer data in context, apply model/provider allowlists and execution/output limits, and handle aborts/errors predictably. Avoid automatic actions or publication from model text; any mutation capability needs separate permission and confirmation semantics.

Keep fallback responses visibly distinguishable from real provider output. Tests use mocks and never incur charges. Upgrading AI SDK families is a separate compatibility task, not a dependency side effect of the design-system refactor.

## Advisory triage

The captured npm full audit reports 20 affected dependency entries; the production-filtered report reports 11. Review both plus the built artifact’s dependency use. Severity is not equivalent to application reachability, and an indirect package’s presence is not a demonstrated exploit.

Important follow-ups include the installed Vite Windows development-server advisory, framework/serialization findings, Sharp native-image advisories when processing untrusted input, and the AI-provider utility advisory when that capability is enabled. Keep dev servers loopback-only. Do not use forced automatic fixes; the current report includes a Drizzle Kit downgrade suggestion that would be a separate migration, not a safe repair.

Every retained advisory needs package/path, affected capability, actual exposure, chosen remediation or temporary mitigation, owner, and recheck condition. Do not set a blanket “ignore all moderate/dev dependencies” rule. A release-critical reachable issue must be resolved or its capability disabled.

## Required security tests before a live release

Test the complete mode/configuration matrix; unauthenticated and cross-role read/write requests; malicious role headers/query strings; malformed/expired/revoked sessions; provider-key-without-live-mode; storage outage without fallback; request size/format failures; upload mismatch/private access; and replay/idempotency behaviour. Assert both rejection status and absence of storage/provider side effects.

Use separate synthetic users/fixtures and isolated stores. Do not attach production credentials to browser tests. Operational logs should identify failure classes without logging passwords, session tokens, provider keys, document contents or unnecessary personal contact information.
