# Lead build guardrails

Owner-requested standard, 8 September 2026; branding/template-preservation rules tightened 13 September 2026. Read this with the root `AGENTS.md`, `docs/WORKFLOW.md`, `catalog.json` and the selected masters' `TEMPLATE.md` files before any lead implementation. Current explicit owner instructions determine scope. These rules are acceptance requirements, not an automated QA system.

The old multi-session campaign is closed; its execution contract and assignments remain historical evidence. [WORKFLOW](WORKFLOW.md) owns current implementation and [LEAD-PUBLISHING](LEAD-PUBLISHING.md) owns publication. A research record is not application data, a sale, a contact event or a passed check.

## 1. Deliver applications, not promises

A three-design assignment means independent personalized applications under `clients/<slug>/`, selected by `dealer.json`: Auto Best / Modern / Carwow or Auto Best / Import / Carwow, with their own permitted assets. Keep Modern's full workspace. The owner must be able to pull, install and inspect without collecting assets, running a personalization generator or finishing a content sweep.

Use Navara's [logo integration notes](../clients/navara-car/BRANDING.md) at commit `e12a37997e09fbcacce5d0a19350880d67b174bb` as an example of generated-artwork integration and explicit provenance, NOT as a fully verified application baseline. That patch documented isolated logo checks, not complete app builds. Copy the template masters, never Navara or another dealer's applications, facts or assets.

Before reporting a capability limitation, discover and attempt the relevant connected GitHub actions. A shell DNS failure is not evidence that the GitHub connector is read-only. A generated image in chat is not a repository change; a created blob/tree/commit is not a published branch update. Verify the remote ref and committed paths before reporting delivery.

## 2. Resolve identity before copying

Read current canonical source, relevant preserved branch evidence, registry aliases, client folders and project metadata. Compare trading names, transliterations, legal names where published, domains, marketplace accounts, normalized business phones and showroom locations. Same-name businesses and shared addresses require investigation; neither alone proves common ownership.

Do not recreate ELIQ, Navara or any existing account under an alias. An occupied variant directory is not permission to replace it. Resume only an explicitly assigned in-progress build, preserving its edits; otherwise record the existing location for reuse. Missing private contact history remains unresolved, never 'never contacted'. Do not read or publish private mail/CRM records for this technical campaign.

Record current source URLs and actual observation dates. Historical advertisement counts are not live, unique, available stock. For an existing website, describe a concrete, observed improvement opportunity rather than inventing a defect. A blocked research browser, generic site vendor or request-price policy is not itself a website defect.

## 3. Inspect branding visually — mandatory

Logo research is a completion prerequisite. Inspect the rendered dealer website/profile and run visual public-source checks using browser/image search and business databases/listings (including Google results where accessible), plus marketplace profiles, social profile images, published signage, header/banner imagery and listing watermarks where useful. Save the source URL plus a screenshot or image reference. Text-only page extraction can omit the logo. Do not infer 'no logo' from missing parsed text, a missing downloadable brand guide or a single failed source.

Confirm that each asset belongs to the same business. Do not mistake a marketplace badge, vehicle manufacturer's emblem, nearby dealer or stock photo for the dealer's logo. A blurred but recognizable dealer banner is existing branding; it is not a reason to substitute a generic CSS/text label.

Keep these concepts separate in the facts/asset notes: `publishedBranding`, `sourceLogoUrl`, `workingLogoPath`, `creationMethod` and `approvalStatus`. Unknown source ownership stays unknown. A recreated logo is a demo refresh unless dealership approval is actually evidenced; never label generated artwork an official original asset.

### Required logo decision

1. Use a suitable, permitted original logo when available. Optimize it without changing the identity. Do not generate a different identity merely because image generation is available.
2. When the recognizable published logo is too blurry, low-resolution, dated or otherwise unsuitable for the required UI surfaces, preserve its recognizable business name, lettering character, dominant colors and overall identity in a professional refresh. Use the available image-generation tool for the creative recreation. This step is mandatory when a refresh is required; do not skip it for convenience or replace it with a CSS/text/font/SVG workaround.
3. When no recognizable branding can be found after the documented visual checks above, create a professional, clearly identified proposal concept with the available image-generation tool under the owner's authorization, not a purported historical logo. A temporary text label may exist during implementation only; it cannot satisfy final acceptance.
4. If required image generation cannot be completed, record the precise branding blocker and keep the dealer build incomplete. Do not silently downgrade to a homemade text logo or other workaround and call it finished.

For an edit/recreation tool call, provide an actual usable image target supported by the tool. Do not supply an opaque invented image ID, claim an inaccessible asset was inspected, or claim a generation occurred when it did not. If the reference cannot be used directly by the image tool, use it as visual reference only where permitted and preserve a suitable original asset when that is the correct decision. Do not bypass tool restrictions.

### Finish the asset, then integrate it

Inspect spelling (including Cyrillic/Arabic where applicable), letter shapes, spacing, small-size legibility, stray pixels, unwanted backgrounds and transparency. No fake checkerboard transparency, giant invisible margins, clipping, stretched lettering, unwanted slogans or watermarks. Generate intentional light/dark treatments of the same identity when the design actually requires them, not three unrelated dealer logos.

For this dealer workflow, final integrated primary logo treatments must be committed raster image assets such as transparent PNG/WebP and appropriate favicon/touch-icon exports. An official/source SVG may be retained as provenance or a working source when permitted, but an SVG—especially a text/font-based SVG—is not the final dealer-branding workaround. CSS-only wordmarks, quick SVG text labels, font tricks, HTML text substitutes and generated placeholder badges cannot satisfy completion.

Save the logo, any required alternate-surface logo, favicon and appropriate PNG/touch-icon exports in EACH application's public/static directory. Verify the bytes were committed and all consumers use them. Check desktop/mobile headers, sticky bars, drawers, footers, dealer cards, metadata, favicons and manifests in every offered design. Inspect inherited masks, filters, `srcset`, dimensions, transparent padding and backgrounds: Modern's old split-logo clipping was a concrete Navara integration trap. Fix consumer-specific presentation without redesigning the surrounding layout.

## 4. Copy actual masters and preserve the working approach

Use `scripts/new-client.mjs` when executable, including its dry run, then personalize those copies. Read `scripts/copy-source.mjs` for the current exclusions. GitHub-only work may reproduce retained Git trees/blobs as independent files, but must reproduce relevant exclusions and write fresh lineage/metadata.

Do not inherit Git metadata, deployment/CRM bindings, `.env` credentials, caches, dependencies, generated test reports, historical agent instructions/tasks, private license certificates or passed QA. Keep necessary workspace packages, manifests, lockfiles, source licenses and applicable asset provenance. Reject unsafe symlinks rather than linking applications to the masters. Record source template version and exact source commit/tree.

Preserve layouts, components, routes, typography, spacing, breakpoints, navigation and interactions. Do not migrate frameworks, upgrade dependencies, add a backend, replace screens with lookalikes, or create Actions to defer copying/personalization. Change only lead data/content/assets and minimal consumer fixes needed for correctness. Masters and unrelated client folders remain unchanged.

### Preserve hero composition and media behavior

The template's hero is part of the master composition, not a blank canvas for each dealer. Preserve its section structure, sizing, aspect treatment, masks/overlays, object positioning, responsive behavior and intended visual hierarchy unless the owner explicitly requests shared template work.

- Keep the template's existing hero media when it is a deliberate reusable design asset and no dealer-specific replacement is required by that template's content boundary.
- If a template intentionally exposes dealer-specific hero media, select a suitable sourced/permitted dealer asset that works inside the existing composition. Do not redesign the hero around the image.
- Do not create custom collages, replacement hero systems, arbitrary zoom/crop/object-position overrides, stretched media, invented gradients/masks or client-only layout changes simply to make a new image fit.
- Compare the personalized hero against the exact source template at both mobile and desktop widths. Cropped faces/vehicles/logos, awkward empty areas, loss of focal subject, stretched media or materially different composition are build defects.
- If correct dealer media cannot be found for an optional replacement slot, keep the template-safe asset/state or record the gap; do not improvise a worse hero.

Normal personalization is dealer identity/logo assets, supported theme colors, sourced facts/copy/contact details, inventory/listing data, permitted vehicle media and metadata. It is not authorization to restyle sections or invent a one-off design system inside a client copy.

## 5. One fact sheet and stock/asset set for three designs

Verify published name, locations, business contact channels, services and branding. Collect approximately 8–12 representative current, relevant listings with available permitted photos and known specifications. Retain source IDs/URLs, observation dates, source currency/units, availability labels and image provenance. Use the same sample in all three variants. Record conflicts and unknown values rather than filling them from another dealer.

Bundle permitted photos inside each app; critical branding and inventory imagery must not depend on hotlinks or a future download script. Public visibility is not proof of a reuse license. Do not remove third-party watermarks, bypass access controls or replace missing dealer media with another dealer's cars/staff. An unresolved essential media permission/access gap is a recorded blocker, not a completed asset pack.

Wire facts into the data/config files the apps actually import. A disconnected `business-facts.json` alone is not implementation. Check card/detail/gallery consistency and every alternate source used by recommendations, search, filters, metadata and mobile views.

Retain meaningful prices and currency: null/unknown prices render as 'Price on request' or an accurate local equivalent, never zero. Filters/sorts must handle unknowns without pretending they are free cars. Distinguish advertised price from down payment/monthly estimate. Do not invent finance rates, warranties, verified badges, staff, testimonials or available-stock guarantees. These are dated listing samples, not a live feed or independently verified stock.

Localize public copy, number/date formatting, phone links, maps, currency and distance units for the actual market. US/UK miles must not merely be relabeled as kilometres; USD/AED/GBP amounts must not merely gain a euro symbol. Store original values/units and document any necessary conversions. Use existing localization boundaries and minimal local type/formatter extensions; do not migrate the app. Do not fabricate legal or finance disclosures, or claim Arabic/RTL support without implementing and checking it.

## 6. Complete the content and integration sweep

Inspect home, inventory, real details, about, services, contact, header/footer, mobile navigation, maps, socials, titles/descriptions, structured data, favicons, manifests, supporting pages and EVERY reachable alternate entry. Include hero/promotion imagery, videos, staff, testimonials, blog/guides, legacy route shells and compatibility assets. No other dealer's identity may remain visible or in metadata.

Replace unsupported source-business claims with accurate preview content or the template's honest unavailable state, preserving composition and routes. Do not conceal failures by deleting whole sections or breaking navigation. Do not mark global identity QA passed because one configuration file changed.

Unavailable forms/integrations stay demos. A local draft/share/copy action is not delivered mail. Never show successful delivery without evidence of an actual configured service response. Do not send real enquiries, call the dealer, submit external forms, connect CRM/payments or provision services. Do not deploy, buy domains, archive projects or create private sales records.

## 7. Verify evidence, not appearances of completion

Run checks supported by the environment: source/data consistency, local asset paths, imports/types, lockfile installation, relevant framework checks/builds and browser review. Fix repairable issues yourself. Use retained manifests for exact runtime/package-manager versions; a successful install in one app says nothing about another. Keep full Modern dependencies and generate its local Prisma client where required without running migrations or provisioning a database.

Where executable, review home/entry, inventory, a real detail, contact, desktop/mobile navigation, search/filter, gallery, dismissal/focus return and safe demo enquiry behavior at 390 and 1440 px. Review offered alternate homepages. Check image loads, overflow, console errors and selected-vehicle context. Compare each personalized template against its exact source composition before/after, not another client's content.

Brand/hero QA is mandatory in that browser review. At both 390 and 1440 px, inspect the hero crop/composition and every visible logo treatment in each offered design. A logo that is clipped, tiny because of excess transparent padding, unreadable, filtered incorrectly, missing, replaced by styled text, or inconsistent between variants is a failed check. A hero that is awkwardly cropped, stretched, zoomed or structurally different from the master without explicit authorization is a failed check.

Label an isolated logo harness as an asset test, syntax parsing as syntax parsing, and source review as source review. None is a full application browser test, typecheck or build. Keep `.client/project.json` in the normal schema with false/unverified QA flags until corresponding app evidence exists. Do not inherit or manufacture pass flags. A local server launch is not browser acceptance.

Record each command, working directory, runtime, outcome and relevant log/screenshot path. Logs must be scrubbed of secrets and personal form content. Separate `implemented`, `committed`, `checks passed`, `checks not executed` and `known limitations`. Do not call unbuilt/unreviewed apps tested or ready to send. Record existing-template failures separately, but do not use them to hide defects introduced by this build.

## 8. Publish safely and give a reproducible handoff

Follow [LEAD-PUBLISHING](LEAD-PUBLISHING.md): scope canonical source commits, compare the actual dedicated remote head, preserve publishing-only fixes and push without force. The historical campaign branch is not the current delivery target. An early copy commit is in-progress evidence, not completion.

Each new dealer gets one concise `HANDOFF.md` containing selected business, public sources and stock observation dates; template versions/source commits; actual data/asset consumers changed; runtime/package-manager versions from retained manifests; exact install/check/launch commands and working directories; distinct proposed ports checked for availability; real results, limitations and commit references. Include a safe local-agent pull/start/inspect prompt, not instructions to regenerate/personalize the apps.

Use `scripts/start-preview.ps1` where applicable to avoid source-specific fixed-port wrappers. Identify physical paths and listener ownership. Never stop unrelated servers, silently switch ports or run Next build and dev against the same output directory simultaneously.

### Completion gate

All three apps contain real independent files, coherent source-backed content and local permitted assets, and every necessary content/brand fix is implemented. Their final canonical and publishing commits match the requested delivery scope; the changed-path allowlist was checked. The handoff and per-variant evidence distinguish executed and unavailable checks. Outstanding essential branding/content/assets or known functional defects mean incomplete; unavailable full runtime QA means committed but not runtime-verified. Neither is 'finished and tested'.

A build also fails this gate if any offered design ships with a workaround text/CSS/SVG logo instead of the selected committed image branding, if a required image-generation refresh/proposal was skipped, if the logo was not visually sourced/researched, or if the personalized hero no longer matches the template's intended composition at mobile and desktop widths.

The owner asked for working demos, not a polished explanation of missing work. Deliver the implementation and precise evidence; never promise unattended/background completion.
