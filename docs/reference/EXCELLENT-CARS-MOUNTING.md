> Historical reference captured before the workflow migration. This is not active operational guidance. Use [the documentation index](../README.md). Dates, commands and limitations below describe their original context.

# Lead publishing workflow

Owner decision, 2026-09-08: a requested new lead build includes GitHub and Vercel delivery after personalization and QA. One dealer has one private repository, one Vercel project and one public preview origin containing every requested design. Explicit local-only or audit-only requests override this default. Publishing is not permission to send outreach or to publish other existing leads.

## Naming and identity

Use `cars-<dealerkey>` for new GitHub repositories and Vercel projects:

| Dealer | Name |
| --- | --- |
| Excellent Cars | `cars-excellentcars` |
| Day & Night | `cars-dayandnight` |
| ASKO96 | `cars-asko96` |

The key is a recognizable compact business name in lowercase ASCII: remove spaces/punctuation, translate `&` to `and`, and use the business's established Latin spelling for Bulgarian names. Preserve meaningful digits. Persist the chosen key so future tasks do not reinterpret it. If a name is occupied by another business, use a stable location suffix and record it; never attach to an unrelated repository merely because its name matches.

Read `.client/project.json`, the client brief and any existing Git/Vercel bindings before creating anything. Reuse recorded dealer identity. Local client slugs can remain hyphenated; they need not be renamed to match the repository.

Excellent Cars was published before this naming rule: its existing repository is `darkapoparka/excellent-cars`, its source checkout is `J:/excellent-cars`, and its public URL is https://excellent-cars.vercel.app. These remain the working reference. The new naming rule does not itself rename existing remote resources, break their URLs or create a duplicate `cars-excellentcars` repository. Migrations must update remote, Git integration and metadata together when requested.

## Build, package and publish

1. Complete the Fast Skin procedure in `WORKFLOW.md`. Preserve template layouts and the requested number of designs. Install from retained lockfiles and run relevant checks before publishing.
2. Resolve the dealer's canonical published source. New work stays in `J:/cars/clients/<client-slug>` under the owner's canonical-workspace instruction. Do not create sibling deployment checkouts or additional Cars worktrees. Keep all selected variants together. Existing recorded published sources, such as Excellent Cars, remain reference identities until intentionally migrated.
3. Export only required source, public assets, retained lockfiles, licensing/provenance and client metadata. `scripts/export-dealer.mjs <client-slug> <cars-dealerkey>` creates a dry-run manifest; `--write` creates a dealer-root Git commit using a separate index without changing the Cars checkout or staging area. Review and scan that exact commit before pushing it to the dedicated repository. Exclude `.git`, `.vercel`, credentials and `.env` secrets, dependencies, generated caches, local logs and CRM/deployment bindings. Preserve dirty source files and record which canonical folder owns future published edits.
4. For multiple designs, apply the proven deployment integration below to the personalized apps. Reuse infrastructure from the reference without importing Excellent Cars identity, stock, contacts, theme colors, deployment IDs or hardcoded QA origins. Recheck route and asset mounting if a template version differs.
5. Verify authenticated GitHub and Vercel account/team identity. The successful reference used GitHub owner `darkapoparka` and Vercel scope `tyj5`; verify current access rather than assuming it. Create or reuse a **private** repository named `cars-<dealerkey>`, commit only the intended dealer files and push. Link the matching single Vercel project to that repository so later pushes deploy normally.
6. Configure and build the combined project. For the standard trio, use the working Services configuration. For a single template, use its normal framework deployment. Do not launch duplicate CLI and Git-triggered deployments for the same commit. If access is unavailable, finish the reviewable source/package and report the specific missing access.
7. Wait for the intended deployment to become READY, then verify its public primary domain without an authenticated browser session. Confirm the expected page and origin: a login redirect followed by HTTP 200 is not a successful public preview.
8. Record actual hosting details and hosted QA. Return the one public URL and repository link. Publishing a demo does not establish working message delivery, live inventory or owner design acceptance.

## Working three-design integration

Reference source: `J:/excellent-cars`, GitHub commit `41226e45fa7321ab777d4d7147dab9b00ed99d74`. The combined application was verified before this commit; this commit adds the larger right-side FAB, which also passed public checks at 320, 390 and 1440 px. See its `README.md`, `DEPLOYMENT.md`, `vercel.json` and scripts. This is a known working implementation, not a promise that the original unmodified masters already support base paths.

| Service | Source folder | Public entry |
| --- | --- | --- |
| Auto Best | `auto-best` | `/` |
| Modern | `modern/apps/web` (retain full `modern` workspace) | `/variant-2/cars` |
| Carwow | `carwow` | `/variant-3/` |

Retain the following integration details when reusing the same template stack:

- Root `vercel.json` builds three Services inside one project. Route `/variant-2/(.*)` and `/variant-3/(.*)` before the Auto Best `/(.*)` fallback. The explicit expressions handle the root and trailing slash cases that failed during the initial setup. Keep entry redirects and preview `noindex, nofollow` response headers.
- Both SvelteKit builds run `scripts/fix-svelte-service-output.mjs`; Carwow passes `/variant-3`. It maps the generated root function and base-mounted prerendered routes to their actual output files. Preserve and recheck it when adapters change.
- Carwow uses `kit.paths.base = '/variant-3'`, `relative: false`, and an idempotent path helper. Retain the associated navigation, static asset, fetch, redirect and route-classification changes. Merely setting the base path is insufficient.
- Modern uses `basePath: '/variant-2'`. Preserve its static asset and raw-link prefixes, locale proxy handling and request-loop guard, and tracing root covering the enclosing dealer repository. Its static dealer mode does not require the unrelated multi-origin SaaS setup. Do not disable validation for normal production app modes.
- Modern's reference serves its existing optimized WebP files directly (`images.unoptimized`) because its image-optimizer route did not work inside the service mount. This is an explicit limitation to assess if future demos introduce large, unoptimized media.
- Use the retained runtime/package versions: the reference uses Node 22.23.2 for Auto Best and Modern, Node 24 for Carwow, and pnpm 11.4.0 for Modern. Its Modern cloud command selects Node 22 explicitly and generates Prisma before building the web app. No live database is needed for the existing static demo.
- `auto-best/static/preview-switcher.js` supplies the shared FAB to all three apps: 64px right-side button, 28px icon, active design badge, visible label, accessible menu, Escape dismissal and normal page navigation. Adapt accent and identifiers for the lead. Keep it above mobile navigation/chat. Do not embed all three applications in iframes or preload all their scripts.
- The reference CLI was Vercel 59.11.7. Verify installed capabilities before using it: the older global CLI did not support the required setup. On Windows, direct `node <vercel-cli>/dist/vc.js ...` avoided leading-slash API argument mangling observed with `npx`. Paths and versions are reference evidence, not permanent machine-wide assumptions.

Only the selected application's assets load, plus the small switcher. The combined project builds all three apps, so deploys take longer than a single template. Do not promise zero performance impact without measurement. Keep changes in coherent commits and avoid repeated full deployments for fixes that can be checked locally first.

## Verification and records

Check home/entry, inventory, one detail, contact, navigation, search/filter, menu dismissal and enquiry destination at 390 and 1440 px for every offered design. Check the FAB at 320 px too: size, placement, open panel, active state, keyboard dismissal and switching to each design. Confirm deep links, back navigation, base-prefixed assets, visible images, console errors and horizontal overflow. Never submit external messages as part of QA.

Use or adapt the reference verification scripts, replacing its dealer-specific URLs, inventory IDs and output paths. Do not mistake candidate script injection for proof of the published asset: confirm the actual deployed FAB after the release.

In each variant's `.client/project.json` and the client brief, record template/version, selected home, repository URL, canonical source path, Vercel project/team, deployment ID and commit, public entry URL, verification date/widths/evidence and known limits. Keep CRM IDs intact; Agency OS remains the CRM source of truth. Add the shared public link to `docs/MANUAL-REVIEW.md`; only the owner can mark a manual review complete. Do not leave metadata saying “local only” after verified publication, or mark a preview public before verification.

`scripts/new-client.mjs` still only clones and creates initial metadata. Its generated agent instructions already point to this workspace's `AGENTS.md` and `WORKFLOW.md`; publishing remains an agent-operated step under this workflow, not an implemented one-command deployment helper.
