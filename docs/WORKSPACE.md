# Cars workspace and delivery architecture

This is the active folder/repository map. Historical handoffs record what was true on their date; they do not override current verified delivery records.

## One template home in Cars

Open **Cars.code-workspace**. Cars contains all four editable masters and canonical dealer sources. Cars Admin is the separate shared public demo. workspace.json is the machine-readable map.

| Role | Canonical path | Repository |
| --- | --- | --- |
| Templates, dealer source, tools and public lead research | J:/cars | darkapoparka/cars |
| Auto Best master | J:/cars/templates/auto-best | darkapoparka/cars |
| Modern master | J:/cars/templates/modern | darkapoparka/cars |
| Carwow master | J:/cars/templates/carwow | darkapoparka/cars |
| Import master | J:/cars/templates/import | darkapoparka/cars |
| Shared public admin demo | J:/cars-admin | darkapoparka/cars-admin |

The September 24 consolidation moved active template ownership into Cars. The four existing template Vercel projects use Cars main and their respective templates/ roots. Former standalone folders under J:/template-repos are recovery/history holdings. Preserve unique files before any separately reviewed cleanup; do not develop templates there.

Existing clients/<slug>/ folders remain canonical dealer source. Dedicated dealer repositories publish derived packages. An explicitly registered independent dealer keeps its own canonical repository. Follow that recorded ownership instead of making a second editable copy.

**runtime/** holds generated packages, review candidates, logs and screenshots. Routine frontend edits and previews use templates/<key>. Identify candidate previews by their actual source path and stop them when their review finishes. Never treat an old runtime server as the current master. No folder is safe to delete merely because its name contains runtime, backup or old.

## Main-only, without overwriting another writer

Before writing or publishing, run the existing Git status checks and:

    node scripts/workspace-doctor.mjs --fetch

The doctor verifies the Cars/Admin repository identities and four in-Cars template paths, main branches, changed entries and ahead/behind counts. Without --fetch it only reports cached tracking refs; it does not establish current remote state. --check provides a nonzero exit for a workspace with issues. It never pulls, resets, cleans, stashes, stages, stops processes or moves files. A failed fetch retains the local findings and is explicitly marked as cached, not freshly verified. On Windows, when the only configured helper is the first-run helper-selector, a fetch selects the existing Git Credential Manager for that command only. Global/repository settings, custom helpers and Git hooks are not changed; missing credentials remain a reported error, not an interactive login.

Resolve issues in the checkout you need. An unrelated template's unfinished draft does not prevent using an already approved immutable Cars release. Do not perform unattended writes across unrelated repositories when the report has blockers.

Fetch does not update local files. A behind-main checkout with local work needs reconciliation with its writer, not a blind pull or reset. Preserve modified/untracked files and their exact base first, compare against current remote main, retain unique edits, and advance only when there is no loss. A clean checkout can be fast-forwarded after verifying its identity. A scoped commit made with a separate index must be based on current remote main and pushed without force; explicitly record when the occupied local checkout still has an older HEAD.

## Repeatable template to dealer workflow

Use [WORKFLOW](WORKFLOW.md), [TEMPLATE-PROMOTION](TEMPLATE-PROMOTION.md) and [LEAD-PUBLISHING](LEAD-PUBLISHING.md); do not invent another clone script or hand-copy the newest-looking directory.

A template release is an approved exact Cars commit, template subtree and verified source digest. It is not whichever loose folder or deployment was opened most recently. A template update does not silently update existing dealers. New dealers use the approved release; existing dealers receive an explicit reviewed refresh.

Preserve template heroes, banners, section order and full brand/body-type discovery. Personalize verified business copy, contacts, socials, accent and approved logo assets. Keep original recognizable identities when suitable; retain approved PNG masters and transparent WebP outputs, including light/dark/accent variants. Do not replace them with fabricated CSS/text/SVG wordmarks. SVG interface icons are not dealership logos. No logo file-extension check substitutes for inspecting contrast, crop, background and mobile readability. Keep licensing and provenance.

Preserve real dealer inventory. Where a prospect demonstration uses stock template inventory, label it illustrative; do not claim those cars are verified stock. Public demos must not send real enquiries during tests. Each delivery records source commit, template commits, publishing commit, project, production alias and timestamped browser checks separately.

## One dealer URL, three designs, one shared admin

Keep each existing dealer's publishing repository, Vercel project and URL. Use the dealer manifest's actual trio: Auto Best at /; Modern at /variant-2/cars OR Import at /variant-2/; Carwow at /variant-3/.

The FAB has three design choices plus **Admin dashboard (demo)**. Admin is not Design 4; the counter remains 1/3, 2/3 or 3/3. Point it to https://cars-admin-blue.vercel.app/ in a new tab with noopener/noreferrer. Replace an older CRM choice rather than append a fifth link. Do not duplicate the admin application per lead.

The optional dealer query parameter only namespaces synthetic browser-local demo state. It is not authentication, tenant isolation, or a connection to that dealer's live website. The public admin has no real staff accounts, email, production database, private agency CRM, or live AI integration. Do not enter real personal data.

The implementation source is scripts/publishing/preview-switcher.js. A helper update affects future packages; existing deployed copies still require a verified release. For a navigation-only fix preserve the current deployed site's layouts, logos and routes rather than regenerate the dealer.

Verify anonymous access and all three route entries at desktop and mobile, including 320 px: exactly four links, reachable 44 px touch targets, panel bounds/scrolling, Escape/focus return, original design destinations, safe new-tab admin and no login wall. An HTTP 200 for the JavaScript alone is not browser verification.

Run node scripts/check-live-fab.mjs for the live registry, or node scripts/check-live-fab.mjs --dealer navara-car for one dealer. It uses the sibling Cars Admin Playwright installation, writes evidence under ignored runtime, and exits nonzero for a failed route/FAB check. This is navigation QA, not a replacement for full template, contact-flow or visual logo review.

After deliberately updating the registry from current committed source and live evidence, use `node scripts/index-deployments.mjs --views-only` to regenerate its readable views without rescanning this machine's potentially stale dealer folders. Normal `--write` still refreshes local source metadata and must only run from a reconciled checkout.

A READY deployment or manually supplied Git metadata is not proof that the actual uploaded files match GitHub. Compare the served switcher with the reviewed source and verify the production alias, not just a newer team/immutable URL. CLI uploads from stale local directories can diverge from Git even when metadata names a main commit. Never promote a deployment on its READY badge alone.

## Hosting now and at larger scale

For the existing 24 demos, keep one dealer publishing repository and one Vercel project each. This preserves prospect URLs and independent rollback. A push to a correctly linked production main branch is the normal single deployment trigger. Do not also send the same commit through a CLI upload. Unlinked/CLI-only projects need an explicitly verified source mapping before repair.

The direction is **shared source with hybrid delivery**, not an unconditional move to one Vercel project. Prove configuration-driven rendering with a small multi-tenant pilot for uniform new prospects; keep existing URLs and use dedicated projects where custom code or independent rollback is needed. A shared service may use more than one template/runtime deployment. Follow [PREVIEW-ARCHITECTURE](PREVIEW-ARCHITECTURE.md) for the content boundary, topology options, isolation tests and measured rollout gate.

This shared-preview platform is a future migration, not an implementation claim. Do not create a new Vercel project per design or assume that a shared project can issue arbitrary dealername.vercel.app hostnames. Confirm domain ownership and routing before introducing new prospect domains.

## Storage and account controls

Deployment Storage concerns retained build outputs; Functions Storage concerns retained function bundles. Local folders, Git source size, Blob storage and build caches are different measurements. More retained deployments and repeated large media/function outputs can increase storage even when Git repositories are small.

Audit Usage by project before cleanup. Review retained deployments and large output assets; keep active production aliases, current previews needed for review, and a deliberate rollback reserve. Never bulk-delete projects, all deployments, historical source or unique assets to chase a quota. Retention changes and plan upgrades require an explicit reviewed action; this organization change does not perform either.

As verified on 19 September 2026, tyj5 reports Hobby. Official Vercel guidance restricts Hobby to personal non-commercial use, and its 16 September 2026 storage notice describes a 10 GB Deployment Storage allowance and protected recent deployments. Commercial agency lead demos should use an appropriate commercial plan or hosting service. Do not evade limits with extra accounts. Billing usage APIs may be unavailable on Hobby; that does not mean usage is zero. A deployment/day limit and a storage limit are separate issues.

Official references (checked 19 September 2026):
- https://vercel.com/docs/deployment-storage
- https://vercel.com/docs/deployment-retention
- https://vercel.com/changelog/hobby-projects-now-retain-fewer-deployments-to-free-up-storage
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/git

## Agency OS boundary

Agency OS remains the private agency operations system. Cars owns automotive template releases, public dealer configuration, preview/publication tooling and the shared dealership admin demo. Future clinics/restaurants should have equivalent vertical modules, not copies of private agency CRM data.

Later integration should exchange a stable public lead ID, vertical, template release, deployment URL and delivery state through an authenticated service boundary. Keep outreach history, personal customer records, credentials and internal notes private. A public tenant query string is never authorization. Backend/production admin integration requires real authentication, tenant-scoped access controls, audit logging and explicit deployment configuration before it is sold as a live CRM.

## Latest organization receipt

The [19 September organization receipt](workspace/2026-09-19/ORGANIZATION.md) records the in-place main synchronization, nine archived image-evidence folders with compatible old paths, full workflow test results, and the two still-pending redesigned-logo deployments. The workspace map and editor folder list are validated together by `node scripts/check-workflow.mjs`.
