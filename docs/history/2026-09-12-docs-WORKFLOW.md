> Historical reference captured before the workflow migration. This is not active operational guidance. Use [the documentation index](../README.md). Dates, commands and limitations below describe their original context.

# Repeatable dealer demos

The aim is a convincing, inexpensive sales sample: choose an existing composition, apply the lead's identity, verify it, push its own private GitHub repository, deploy its public Vercel preview, and prepare the offer. Shared UI improvements belong in a separate template pass. New lead builds include publishing by default under the owner's 2026-09-08 instruction; explicit local-only or audit-only requests take precedence.

## Folder model

```text
J:/cars/
  AGENTS.md
  catalog.json
  templates/
    auto-best/        # polished 5173 derivative
    modern/           # compact 6212 storefront
    carwow/           # yellow desktop / compact mobile 6517
    import/           # dark 6518
    showroom/         # red/white 6404 source
    autodeal/         # all ten homes
    rencar/           # all five homes
    boxcar/
    motoria/          # actually Motors source
    nusavo/
  clients/
    dayandnight/
      CLIENT.md
      rencar/         # original Rencar with Day & Night branding
      auto-best/      # created only when requested
    eliqauto/
      CLIENT.md
    asko96/
      CLIENT.md
  scripts/
  audits/
  runtime/
```

The three client folders began with briefs. The owner subsequently requested the Day & Night Rencar prototype in clients/dayandnight/rencar, using the current 5173 identity and media. The owner rejected a rewritten dealer implementation; the active copy now retains the original Rencar pages and only changes branding, image references and text. Its five original home links and source-placeholder limitations are recorded in the client README. The shared Rencar master remains unchanged. Existing M: lead projects remain separate; they were not moved or overwritten.

## 1. Choose

Start with `auto-best` for a conventional dealer pitch. Choose `modern` for direct stock browsing and `carwow` for a visually different, fuller showroom. Use the audit to choose by the lead's business, not by the number of available themes.

For a request such as “build ASKO96 using Rencar, AutoDeal and Modern,” use three independent folders inside `clients/asko96/`. Keep all five Rencar and ten AutoDeal homes inside their respective codebases. Record which home is the recommended entrance; offer alternate-home links when requested.

`autodeal-best` is an alias for the current polished `auto-best` in this workspace. The older Agency OS static `autodeal-best` was inspected for lineage; it is not the same implementation as the current 5173 preview and was not added as an eleventh duplicate.

## 2. Confirm lead facts

Read the client brief and existing Agency OS record. Inspect current official/site or marketplace sources for identity, stock, contact paths and real services. Do not copy claims or numbers from an old demo without checking. Carry existing CRM IDs forward; a directory is not a CRM event.

## 3. Copy

From `J:/cars`:

```powershell
node scripts/new-client.mjs --client asko96 --templates auto-best --dry-run
node scripts/new-client.mjs --client asko96 --templates auto-best

# When three designs are requested:
node scripts/new-client.mjs --client asko96 --templates rencar,autodeal,modern --dry-run
node scripts/new-client.mjs --client asko96 --templates rencar,autodeal,modern
```

The helper resolves known aliases, refuses existing destinations, copies current template source, verifies every copied file's SHA-256, and records the template version and all available home routes. It excludes dependencies, runtime output, credentials, deployment/CRM bindings, source Git metadata and inherited agent instructions. It does not personalize, publish, send outreach, or register a CRM row. Its output remains `needs-personalization` until the next steps are complete.

## 4. Apply the brand

Use the chosen template's `TEMPLATE.md`. Prepare one lead asset set and one fact sheet before editing three variants. Reuse them consistently across the variants. Keep the current layout and interaction behavior.

For a source that already has typed identity/inventory data, edit those boundaries. For captured-page templates, content is currently spread across many pages; a future template pass should extract shared identity, navigation, inventory and color settings once. A generic JSON brief is documentation until code actually reads it—do not claim changing a disconnected config will update the site.

Scan names, phones, addresses, domains, socials, SEO, favicons, logos, watermarked images and every retained alternate homepage. Use real sample vehicles or clearly limited preview data, and keep facts consistent between cards and detail pages.

## 5. Run and review

Install dependencies from the template's lockfile, then use a free client port (suggested range 6600-6699):

```powershell
./scripts/start-preview.ps1 -Client asko96 -Template auto-best -Port 6601
```

The startup helper refuses an occupied port. It reports a process launch, not browser acceptance. The individual `TEMPLATE.md` files record install and check commands. Modern needs its full workspace, local Prisma generation and distinct app origins; its existing static demo mode can render the public site without production credentials.

Run the existing relevant checks/build. Review desktop and mobile entry, inventory, detail, contact, navigation and at least one search/filter. Check offered homepage variants, Escape/focus return on overlays, images, horizontal overflow, console errors and direct phone/map/enquiry destinations. Do not submit messages to an external service during QA.

Record what passed and what remains in `.client/project.json` and `CLIENT.md`. Stop the design work once the requested skin and QA are complete. Improvement ideas go into the shared template backlog.

## 6. GitHub and Vercel

Follow [LEAD-PUBLISHING.md](LEAD-PUBLISHING.md). Use one private GitHub repository and one Vercel project per dealer, both named `cars-<dealerkey>` (for example `cars-excellentcars` or `cars-dayandnight`). Reuse existing recorded repositories instead of duplicating them. Finish the authorized lead build through hosted verification without asking again whether to push or deploy.

All selected designs share one public origin. For the standard trio, Auto Best owns `/`, Modern enters at `/variant-2/cars`, and Carwow enters at `/variant-3/`. Include the visible right-side design FAB, positioned above chat and mobile navigation. Use normal navigation so only the selected application loads. One selected template needs no switcher. Preserve offered homepages within each template; they do not become separate hosting projects.

Reuse the working Excellent Cars path mounting, Services configuration and compatibility fixes described in the publishing guide. Do not repeat its deployment setup experiments for each lead. This is a verified reference integration, not yet an automatic packaging command in `new-client.mjs`.

Verify the public primary domain without authentication on mobile and desktop, including all offered designs and switching. Record repository, canonical source checkout, Vercel identity, commit/deployment, public URLs, checks and limits in project metadata and the client brief. Keep the owner's progress in [MANUAL-REVIEW.md](MANUAL-REVIEW.md) separate from automated QA.

## 7. Offer

Prepare one recommended design and, when requested, two distinct alternatives. Share the single tested public preview; its design FAB exposes the alternatives. Ten homepages inside a template need not become ten separately maintained projects.

Before sending: verify the exact public preview, recipient, channel and final message. This workspace setup does not authorize outreach. Agency OS remains the place to track actual lead/demo/outreach state; its fixed-root scripts require an explicit path integration before they can manage these J: copies.

## Template improvement order

1. Auto Best: a short content/identity pass for the next lead; no redesign.
2. Rencar: adapt Home 2 and Home 5 to dealer inventory, shorten mobile, simplify motion, centralize repeated brand data. Keep the other homes available.
3. Boxcar: reduce mobile search/header height, centralize content, remove misleading variant/menu aliases from client navigation.
4. Carwow/Modern: fix concrete reusable issues only when a chosen lead exposes them.
5. Motors/Nusavo: retain as reserves; route completeness and dealer fit come before visual polishing.
