# Cars workspace instructions

## Purpose and ownership

`J:\cars` is the owner's automotive template library and workspace for potential-client demos. The goal is to reuse polished layouts and spend lead-specific time on identity and content. Preserve the template's UI/UX by default.

- `templates/<template-key>/`: reusable source baselines. Work here only for an explicitly requested shared template improvement.
- `clients/<client-slug>/<template-key>/`: independent personalized demo copies. `clients` includes prospects; the folder name never means the business has paid or agreed.
- `catalog.json`: exact local keys, nicknames, source ports, library ports, variants and current readiness.
- `docs/WORKFLOW.md`: build and review procedure.
- `docs/LEAD-PUBLISHING.md`: default GitHub/Vercel delivery, `cars-<dealerkey>` naming and the working multi-variant deployment recipe.
- `docs/RENCAR-STYLEGUIDE.md`: owner-requested Rencar polish direction and exact current scope. Applies to Rencar work, not other template families.
- `docs/TEMPLATE-PROMOTION.md`: how a finalized client trial becomes a versioned reusable master without carrying client identity or overwriting independent copies.
- `audits/2026-09-06/REPORT.md`: current comparative audit and future template priorities.
- `runtime/`: local logs, not deployable content.

For automotive work in this workspace, these user-requested J: paths supersede older M: destination defaults. Agency OS on `M:\codex\agency\os` remains the CRM/workflow source of truth. The local catalog is not a replacement CRM registry. Do not silently move existing Agency OS projects, change their records, or run its fixed-root clone/deploy scripts against J: paths.

## Start each task

### Canonical workspace (owner instruction, 2026-09-09)

Work only in `J:\cars` and its main Cars repository. Keep every dealer under `clients/<client-slug>/`, with its requested designs together. Do not create sibling session folders, alternate-drive copies or additional Cars worktrees. The previous ten-session `astra` campaign is closed; its allocation and publish-to-astra rules are historical. Consolidated work continues on `main`, scoped to the requested dealer or workspace operation and preserving unrelated dirty edits. Use `docs/PROJECTS.md` for recovered projects and review status. Consolidation does not make unfinished demos ready or authorize deploying the recovered backlog.

1. Read the catalog and the chosen template's `TEMPLATE.md`. Resolve aliases: `5173`/`autodeal-best` = `auto-best`, `6212` = `modern`, `6517` = `carwow`, `6518` = `import`, `6404` = `showroom`. `motoria` locally means the Motors-derived source, not the old Agency OS Motoria template.
2. State whether this is template work, a client Fast Skin, an audit, or a deployment. Do not turn a Fast Skin into redesign work.
3. Confirm the physical folder, Git identity when present, dirty changes and listener ownership. A port number alone is not source proof. Never stop an unrelated server or silently use another port.
4. Read existing client/project metadata before creating a duplicate. Preserve owner work and use a new explicitly named variant if the requested destination exists; never overwrite it.
5. For lead implementation, read `docs/LEAD-BUILD-GUARDRAILS.md`. For an assigned multi-session batch, also read `docs/lead-build/README.md`, `docs/lead-build/assignments.json` and your session prompt/report before editing.

## Mandatory lead-build standard

The owner-requested guardrails apply to branding, actual template copies, source-backed inventory, local assets, complete content sweeps and honest verification. Visually inspect published branding before declaring a logo missing; use a suitable original or a professional, clearly identified image-generation-assisted refresh, not a final generic text placeholder. Generating an image is not implementation until the asset is integrated and committed in each app.

For the now-closed ten-session campaign (historical rules only; the canonical workspace instruction above takes precedence), each session owned three candidate dealer sets (all three requested variants) and one read-only existing-account inspection. Do not recreate occupied accounts, invent alternate slugs to evade duplicate checks or take another session's allocation. Publish only allowlisted changes to the latest `astra` head using the execution contract's non-force/fresh-head protocol. Preserve all other work. Do not carry forward template QA, treat Navara's isolated logo checks as full app verification, or infer 'never contacted' from unknown history. These documents authorize no deployment, outreach or private sales-record writes.

## Default client build: Fast Skin

A Fast Skin uses the template's actual source pages and stylesheet. Do not rebuild equivalent-looking components, replace its runtime, invent a new shell, or simplify its sections. Passing checks does not establish visual fidelity. The owner rejected the first Day & Night Rencar rewrite for this exact scope error. A branding-only visual trial may retain source sample controls; record that limit instead of silently converting it into a different application.

Clone the selected master first, using `scripts/new-client.mjs`. Change only what the lead requires:

- logo, favicon, business name and metadata;
- primary/secondary colors through existing styling boundaries;
- approved hero, vehicle and showroom media;
- relevant copy, real services, representative stock and prices;
- verified phones, address, hours, map, socials and contact destinations.

Keep layout, spacing, typography, cards, navigation, interactions, breakpoints and routes. Do not refactor, swap icons, add animation, rebuild the design system, upgrade dependencies, or add a backend as part of routine personalization. If a discovered defect needs a shared template change, record it and use a viable template; fix only defects necessary to complete the authorized demo safely. The current owner's explicit instructions always determine scope.

Source-derived masters still contain source business/demo identity. A folder in `templates` is not evidence of completed genericization or outreach readiness. Use `TEMPLATE.md` to locate current personalization boundaries and complete a stale-identity scan across every retained page before claiming readiness.

## Variants and effort

- Default to one strong template; use up to three when the owner requests multiple directions. More only on explicit request.
- A template with many homepages stays one codebase. Preserve all real variants when cloning. Do not create a separate folder per Home 1/Home 2.
- `autodeal` has ten real homepages; `rencar` has five. `auto-best` is one polished composition. Boxcar currently has one local homepage even though its menu lists more.
- Choose one recommended homepage as the demo's entry. When the owner asks to show all variants, retain an intentional choice page or a list of exact variant URLs; do not pretend a menu alias is a separate design.
- Default effort target: 60-90 minutes for a straightforward Fast Skin plus necessary QA. This is a planning target, not permission to skip required work or an enforced deadline. Record substantial template blockers rather than spending days polishing an unqualified prospect.
- Polish the master once, version it, and let new clients use the improved version. Existing client copies remain independent; never sync over their edits automatically.

## Content and integrations

Use source-backed business facts. Never inherit another dealer's phone, inventory, testimonials, finance promises, map pin, YouTube channel or watermark as the new lead's facts. Do not invent stock, reviews, guarantees or completed transactions.

Rental templates require a shared dealer adaptation before branding-only dealer builds: booking dates, daily rates, driver age, cart and checkout cannot become a sales journey merely by relabeling them. Keep this conversion work in the template task.

Carry forward existing license and asset provenance. Existing source notes are evidence, not a new rights determination. Keep project secrets and deployment bindings out of copies. Never copy `.env` credentials, `.git`, `.vercel`, `.agency-os/project.json`, generated caches or dependencies into a new client.

## Verification and delivery

- Install from the retained lockfile. Use the package's documented Node version. Keep the full `modern` monorepo together and start its web app from `apps/web`.
- Use `scripts/start-preview.ps1` with an explicitly free port; it bypasses inherited source-specific fixed-port wrappers.
- Run relevant existing framework checks/build. Do not run simultaneous Next builds/dev servers against one output directory.
- Browser-check home/entry, inventory, one detail, contact, navigation, a filter/search, menu dismissal, and the main enquiry path at 390 and 1440 px. Check URLs, images, overflow and console errors. Check every homepage actually offered to the lead.
- Forms and sample checkout behavior remain demos until real delivery is verified. Do not claim a local form sends messages because it displays success.
- Record template/version, selected homepage(s), changes, checks, known gaps and preview link in `.client/project.json` and the client brief. Existing CRM IDs retain their identity; coordinate Agency OS updates when an actual demo is registered.
- A new lead build includes personalization, QA, creation or reuse of its private GitHub repository, pushing the finished demo, deployment to one Vercel project, and verification of its public preview. This is the owner's standing workflow instruction of 2026-09-08; no separate publish confirmation is needed for that requested lead. Explicit local-only, audit-only or pause instructions override this default. A template edit or this workflow change does not authorize publishing the existing lead backlog.
- Name new repositories `cars-<dealerkey>`: lowercase ASCII, compact business name, no spaces or internal punctuation; use `and` for `&`. Examples: `cars-excellentcars`, `cars-dayandnight`, `cars-asko96`. Use the same name for the new Vercel project. Record the chosen key; reuse existing recorded identity rather than creating duplicates or silently renaming existing repositories/projects.
- Each dealer gets its own repository and Vercel project. Put all requested designs under one public origin with a visible right-side design FAB; load only the selected application. Follow `docs/LEAD-PUBLISHING.md` and reuse the verified Excellent Cars deployment integration. Do not create one Vercel project per design or combine different dealers into one app.
- A localhost URL is for local review. A sendable offer needs an unauthenticated, tested public preview. Publishing a preview does not authorize outreach; sending still requires approval of the exact recipient, channel, text and links. Automated QA does not complete the owner's manual-review checklist.
- Scope commits, pushes and deployments to the requested dealer's dedicated repository. Do not commit, push, deploy, reset, clean, or overwrite unrelated work, including dirty Cars library changes.

The source projects on M: and their historic task ledgers are provenance. Do not resume their old polishing backlogs when working in a J: template or client copy.

## International three-design campaign

For lead research and the owner's three-choice offer, also read [the lead index](leads/README.md), [coverage and qualification](leads/COVERAGE.md) and [the three-design workflow](docs/THREE-DESIGN-WORKFLOW.md). These extend the working rules above; they do not authorize template redesigns, a CRM migration or changes to existing client projects.

For an approved dealer build in this campaign, the owner has selected **all three**: `auto-best`, `modern`, `carwow`. This is the requested three-variant case, not the default-one case. A recommended entry template means show it first, not omit the other two. Prepare one verified fact/asset pack across the variants and reuse existing projects before cloning anything.

`leads/*.json` is public company research, not a private sales ledger or an automatic build queue. Apply file-level defaults when reading records. Respect each priority, dated inventory meaning, uncertainty and next action. A null website is not proof no website exists; an existing website needs a concrete current opportunity, not an unsupported negative design label. Preserve stable research IDs, existing CRM IDs and project identity; resolve duplicates across markets and aliases before work.

Keep research updates in the regional JSON and readable index together. For authorized builds/QA, update the selected project's existing metadata and evidence, then synchronize the approved private project/opportunity record when available and in scope. For actual authorized messages/replies, append private activity evidence and update only justified sales states. Drafted is not contacted; silence is not declined; liking a concept is not won. Report unknown history or pending synchronization honestly.

The public research index can be used independently of Agency OS. This addition does not change the existing private CRM authority or require a migration; never invent a blank contact history when it cannot be read. Do not publish private contact notes, deal amounts, rejection reasons, suppression lists or CRM exports in this public repository. Do not send, deploy, archive or delete merely because a lead appears in the list. Verify channel-specific outreach requirements and exact action approval first.
