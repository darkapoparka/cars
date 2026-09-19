# New-lead workflow verification — 19 September 2026

## The supported workflow

Keep the existing six repositories and their main branches. A new standard dealer still gets real Auto Best, Modern and Carwow source copies under `clients/<slug>/`; an Import trio replaces Modern with Import. Personalization changes approved dealer identity/content, not template composition. The three apps publish together to one dealer repository, one Vercel project and one prospect URL. The FAB includes the separate shared Admin demo. No multi-tenant migration was introduced.

The authoritative instructions remain [WORKFLOW](../../WORKFLOW.md), [TEMPLATE-PROMOTION](../../TEMPLATE-PROMOTION.md) and [LEAD-PUBLISHING](../../LEAD-PUBLISHING.md). The owner asks for the dealer; the agent handles release checks, personalization, testing, source commit, publishing and hosted verification.

## Defects corrected

The new-client command now checks the canonical Windows checkout recorded in workspace.json, correct origin, main branch and current remote main. A stale checkout, uncommitted workflow/release inputs, existing identity or reused publishing repository is refused before creating a dealer. It does not require unrelated dealer drafts or template masters to be discarded.

Current upstream development heads are checked automatically. An unfinished newer commit is reported rather than silently released. The selected release must be approved, committed and intact. A completed template update should be reviewed/promoted as part of finishing that update, so the owner does not have to manage manual template copies.

Copying now uses the same export policy as release fingerprinting and publishing, instead of a different legacy copy filter. All three copies must match their approved digests before being installed together. Preparation happens under ignored runtime, with an operation lock and failure receipt. Failed candidates never become partially-created canonical dealers. Successful candidates are moved, not left as another editable source copy.

The verification found 84 generated files causing false Modern snapshot drift: next-env.d.ts plus Prisma generated output. Comparison against the exact approved upstream commit showed no authored source differences. The policy now excludes those narrowly-defined reproducible outputs without hiding schema files or arbitrary authored generated directories. No template source, approval digest or dealer logo was changed to silence the check.

## Checks completed

- Full Node workflow suite: 71 passed, zero failed, no excluded test files. This includes 19 new creation/checkout/copy-policy tests and the existing real-dealer refresh tests.
- Both standard and Import trios were created and verified in isolated filesystem fixtures. Failure, byte-corruption, duplicate, stale-main and competing-writer cases were tested.
- All four real template snapshots match their approved content digests after the policy repair.
- Documentation/skill/command check: 12 active documents, three skills and the six-repository workspace map passed.
- Fresh anonymous live FAB verification: 216/216 checks passed across 24 dealers, three design entries and widths 1440, 390 and 320. This is navigation QA, not full visual/contact/stock approval.

The current production template aliases resolve to the selected commits: Auto Best 989ec3a1, Modern 703feaeb, Carwow 89f50c42 and Import 5ff9805e. Provider source identity and local snapshot integrity were checked separately. A READY badge alone is not a claim of full template QA.

## Limits of this completion

This finalizes and verifies the new-lead creation workflow, not every page in every historical project or every unfinished template draft. New clients still need sourced personalization, approved raster logos, application builds and desktop/mobile checks before delivery. The helper does not pretend that copying source creates a finished dealership website.

No existing dealer application, template UI, logo, production alias, hosting plan or retention setting was changed by this maintenance. Existing independent drafts were not staged, reset, moved or published. No new branch, worktree or replacement repository was created.

The two previously pending redesigned-logo deliveries were checked at the provider: Priselci still resolves to dpl_6hEcRNo9nmtQUCGEG7Y3H3icJ3aV (4efc240e), and IS Auto to dpl_Dsn693jzxTqzZtTfRhqzHwjHebw4 (a99428c8). They are not described as the newest six-logo release. The logo agent's [delivery record](../../logo-refresh/2026-09-19/six-generated/DELIVERY.md) remains the source for that rollout, separate from workflow readiness.

Logs and byte-level evidence are retained under ignored runtime/new-lead-* paths. Generated test directories were isolated; no fake prospect was deployed during this maintenance.
