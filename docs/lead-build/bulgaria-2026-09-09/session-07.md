# GPT Pro session 07: Sofia: first group

Hey, please build the five Bulgarian dealer projects assigned below in the GitHub repository **darkapoparka/cars**, exclusively on branch **codex/astra-bg-07**. I want complete, carefully personalized demos using our existing templates, ready for my local Codex agent to pull and review.

This is my explicit session instruction. Its branch-only delivery and folder ownership override conflicting historical batch instructions in the repository.

## Your five accounts — no substitutions

1. **VALENTINO AUTO HOUSE — Sofia**
   - Source: https://valentinoauto.mobile.bg/
   - Destination: `clients/valentino-auto-house/`; three folders: `auto-best/`, `modern/`, `carwow/`.
   - Recheck source facts and representative stock before implementation; no verified stock total is supplied.

2. **TROYA AUTO — Sofia**
   - Source: https://troya-auto.mobile.bg/
   - Destination: `clients/troya-auto/`; three folders: `auto-best/`, `modern/`, `carwow/`.
   - Earlier screening (2026-09-08): 108 advertised category entries, not verified available cars. Auto.bg and Car24 totals are older alternative snapshots, not extra cars. Confirm hours and domain; similarly named registry businesses must not be matched by name alone.

3. **ФАДИ КАРС — Sofia**
   - Source: https://fadicars.mobile.bg/
   - Destination: `clients/fadi-cars/`; three folders: `auto-best/`, `modern/`, `carwow/`.
   - Earlier screening (2026-09-08): 84 advertised category entries, not verified available cars. Do not carry individual own-leasing or time-limited insurance statements into generic service guarantees.

4. **В.В.Ц – АУТО — Sofia**
   - Source: https://vvc-auto.mobile.bg/
   - Destination: `clients/vvc-auto/`; three folders: `auto-best/`, `modern/`, `carwow/`.
   - Earlier screening (2026-09-08): 80 advertised category entries, not verified available cars. Match exact phone and address; source request-price listings are not zero-price cars.

5. **МАВЕРИК — Sofia**
   - Source: https://maverik.mobile.bg/
   - Destination: `clients/maverik-sofia/`; three folders: `auto-best/`, `modern/`, `carwow/`.
   - Earlier screening (2026-09-08): 71 advertised category entries, not verified available cars. Check actual car location when syndicated results differ; do not import finance percentages as universal terms.


## What I am asking you to deliver

Build five dealership demo projects, each with THREE complete personalized applications: Auto Best, Modern and Carwow. This is a Fast Skin of our actual masters. Preserve their UI, UX, layout, styling, typography, spacing, routes, responsive behavior and interactions. Use Navara as an example of care in branding integration, not as source code or a claim that every old Navara check passed.

This is a BRANCH HANDOFF to my local Codex coordinator. Do not deploy, create dealer repositories/Vercel projects, contact dealerships, or merge into main. The coordinator will fetch, inspect, test, finalize and merge here before publication. These explicit instructions override the older automatic-publishing policy for this batch.

## Branch and filesystem ownership

Use only the assigned branch in darkapoparka/cars. Create it from the current published main if absent; record the exact base SHA. If it exists, inspect and resume its owned commits without resetting or overwriting them. Never push to main or the old shared astra branch. Use non-force updates and read the remote branch back after every published checkpoint. Never replace the entire repository tree with just your files; preserve all unmodified trees and blobs.

Ten sessions may run concurrently. Use GitHub branch operations or a genuinely isolated cloud runner supplied to your session. If you have a connector to my Windows computer, J:/cars is the coordinator's shared main checkout: do not switch its branch, write client code there, start competing servers, create cars-session/cars-navara-astra folders, clone beside it, or create worktrees anywhere on my local drives. A different branch name does not isolate a shared physical checkout. Do not use the old M: projects as a working directory. If neither branch writes nor an independent runner is available, report the exact attempted capabilities and blocker; do not pretend a plan or script is a committed build.

Discover and try the available relevant GitHub actions before declaring writes unavailable. A shell network error is not proof the connector is read-only. If using tree/blob APIs, verify actual file bytes and compare the final branch against the recorded base. No force-push, reset, clean, broad staging, unrelated commits, workflow-trigger workarounds or hidden background jobs.

Your write allowlist is the five listed clients/<slug>/ folders and your unique report directory below. Read shared files, but do not modify templates/, catalog.json, clients/index.json, shared launchers, root instructions, global research/assignment files or another session's report. Store client-specific helpers inside that client's folder. Record proposed shared fixes in your report for the coordinator.

## Read before implementation

Read AGENTS.md, catalog.json, docs/WORKFLOW.md, docs/LEAD-BUILD-GUARDRAILS.md, docs/LEAD-PUBLISHING.md, docs/PROJECTS.md and each selected templates/<key>/TEMPLATE.md. Read existing client briefs/metadata and the relevant docs/lead-research/bulgaria screening/account-link records.

This prompt is the new allocation authority for these five accounts. Older docs/lead-build/prompts, assignments and README are historical: their shared-astra pushes, local-worktree instructions and prior session allocations do not apply here. This does not change another session's scope. If another current worker owns one of these accounts, report the collision rather than editing concurrently.

Published main was faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca when this packet was prepared. Read the actual current remote main; never assume uncommitted improvements visible on the owner's machine exist in GitHub. Record the published template versions/source trees you actually copied.

## Finish one dealer before beginning the next

1. Resolve identity and existing work. Search current main, your branch, old astra/relevant branches, clients/index.json, client metadata and account-links by name, aliases, source URL, public phone and location. Preserve existing CRM/repository identity when known; do not create CRM records or read private correspondence. An older M: demo is provenance and must remain intact. For an assigned account with only a brief, retain and complete that brief. If the requested trio already exists, inspect and report existing-reuse instead of cloning a duplicate; do not overwrite an occupied application. If partial work belongs to this assigned account and is not owned by an active worker, resume it deliberately and document what was retained.

2. Establish current public facts and visual identity. Open the official website, marketplace profile and matching public Facebook/Instagram presence where accessible. Inspect actual logos, cover images, signage and listing watermarks; text extraction alone cannot establish that no logo exists. Match a social page to the dealer using corroborating source links/contact/location, not the name alone. Record recent visible post dates/permalinks if available; do not call a page active when only its title is visible. Do not log in or bypass access restrictions. Website absence is a bounded finding; an existing website makes this an alternative demo concept, not evidence of a bad website. If essential identity, whole-car stock or media cannot be established, record that dealer as blocked and proceed to the next named account. Never replace it with an unassigned dealer.

3. Prepare one sourced fact sheet and asset set. Use approximately 8–12 representative current whole-car listings, or all usable listings if fewer. Keep source URLs/IDs, observation dates, actual advertised currency, specifications, availability, tax/price qualifications and per-image provenance. The same vehicles and facts must drive all three variants. Advertisement totals are not verified available stock; incoming, reserved, sold, parts and consignment vehicles must be treated honestly. Unknown price means "Цена при запитване", never zero; a deposit/monthly payment is not the full cash price. No invented finance guarantees, staff, reviews, sales totals, inventory feed or provider integrations. Localize Bulgarian copy and units accurately.

4. Clone complete masters, then personalize. Prefer:
   node scripts/new-client.mjs --client <assigned-slug> --templates auto-best,modern,carwow --dry-run
   node scripts/new-client.mjs --client <assigned-slug> --templates auto-best,modern,carwow
   Run only in your independent cloud checkout. With GitHub-only tools, copy the actual retained trees/blobs with the same exclusions and fresh lineage metadata. Retain the FULL Modern monorepo, including apps/web and required packages. Exclude source .git, credentials/.env files, .vercel and .agency-os bindings, dependencies, caches, old passed QA and historical task instructions. Preserve necessary licenses and asset provenance. No symlinks to masters, empty wrappers, disconnected config-only outputs, generated stubs, framework changes or replacement lookalike screens. Changes to business-facts.json count only when the actual rendered apps consume them.

5. Finish branding and media. Prefer permitted original dealer logos. If only a poor reference exists, use Image Gen to make a professional demo refresh preserving its recognizable identity. If no branding is found after visual inspection, use Image Gen for a restrained proposed logo; mark it as a concept in provenance, not an official dealership asset. Inspect spelling, Cyrillic, transparency, margins, small-size legibility and light/dark use. A generic text placeholder is not a finished generated logo. Create consistent logo/favicons, save their real bytes and wire every header, mobile drawer, sticky bar, footer, metadata icon and relevant dealer card. Beware Modern's inherited logo masks/cropping. Generate conceptual service/hero illustration only where appropriate to the template; never fabricate the dealer's vehicles, premises, employees or customer transactions. Real stock needs correctly matched, permitted real photos. Do not remove other parties' watermarks or claim public visibility grants a license. Use existing authorization/provenance where it actually covers the asset. Record essential unresolved gaps instead of inventing permissions or saying generation happened without a tool result. Commit assets inside each app; no expiring image-chat URLs, critical hotlinks or "download later" scripts.

6. Complete the entire content sweep. Inspect entry, catalogue, details, about, services, contact, navigation, footer, supporting pages, search data, recommendations, metadata, manifests, social/map links, videos and offered alternate entries. Remove inherited dealer facts through existing content boundaries. Preserve the composition; do not hide missing work by deleting major sections or disabling routes. Minimal client-local fixes necessary for accurate data/asset rendering are allowed; broad template redesigns are not. Demo forms must never falsely claim external delivery. Keep previews noindex.

7. Run meaningful checks and compare rendered output. Install retained lockfiles and documented runtimes. At the recorded baseline Auto Best/Modern use Node 22, Modern pnpm 11.4.0 and Carwow Node 24; current package requirements take precedence. Auto Best: npm run validate. Modern: frozen install, local database-package build for Prisma generation, web typecheck/build in the existing static demo configuration; no live DB or migrations. Carwow: npm run check and npm run build. Use existing launchers with explicitly free ports in your own runner and verify process/cwd/route ownership. No concurrent Next builds/dev against one output directory.

   For EACH design at 390 and 1440 px, compare the retained master and dealer copy, then test home/entry, inventory, a real detail/gallery, contact, navigation/menu dismissal and focus, search/filter/reset, detail-to-list back state and main enquiry destination without sending anything. Check images, console errors, overflow, direct routes and stale identity. Check 320 px for logo/header controls. Save compact screenshots and a route/check matrix. No visual pass from HTTP 200, a logo mockup, a build log or an unrun script. If runtime/browser execution is unavailable, commit actual implemented source and report implemented-unverified with exact missing checks; do not mark verified or stop pretending the work was tested.

8. Commit and checkpoint this dealer before the next. Stage only its actual source/assets/metadata and your report. Verify all three application trees and media blobs on the remote assigned branch. Then continue to the next dealer until all five have honest outcomes. Five dealers is the work queue, not permission to leave five superficial half-builds. If interrupted, checkpoint the current real state and give an exact resume point; no untracked work left behind, no automatic job or new session.

## Review and handoff required

Keep the three applications independent at clients/<slug>/auto-best, clients/<slug>/modern and clients/<slug>/carwow. Default local entries are /, /cars and / respectively; record actual routes after checking. Include a client REVIEW.md with install/start commands and three exact review entries. The existing coordinator launcher scripts/start-client.ps1 will run the trio one dealer at a time.

Do not add a monolithic app or iframe wrapper. Shared public-origin mounting and the right-side design FAB are part of the coordinator's final publishing pass using docs/LEAD-PUBLISHING.md. Clearly record whether any integration is already implemented and tested; do not claim a public preview exists in this branch-only phase.

Write your own report under docs/lead-build/bulgaria-2026-09-09/reports/session-07/. Record all five outcomes, source base/template trees, duplicate checks, current source URLs, per-dealer commit SHAs, implemented files, generated asset provenance, commands/exits, viewport/route evidence, checks not run and precise blockers. Keep per-variant .client/project.json and each CLIENT.md accurate. Use pending, in-progress, implemented-unverified, verified-local, existing-reuse or blocked; do not mark owner manual review complete. Do not copy private CRM exports or secrets into reports.

End with a five-row outcome table, a verified remote codex/astra-bg-07 commit/compare link, links to each implemented application's GitHub folder, exact test evidence and a short message for my local coordinator to fetch this branch and inspect the first finished dealer. A report is not a substitute for the actual committed applications.

Please execute the work, not merely propose a plan. If a tool limitation prevents an essential step, state exactly what remains while completing independent work on the other assigned accounts.

