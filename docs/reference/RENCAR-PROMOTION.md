> Historical reference captured before the workflow migration. This is not active operational guidance. Use [the documentation index](../README.md). Dates, commands and limitations below describe their original context.

# Promoting a client trial into a reusable template

The owner may develop a shared improvement inside a client trial first. Once that direction is finalized, it can become a reusable master. Do this once per version, not during every future lead build.

## Recommended Rencar destination

Preserve `templates/rencar` as the original baseline. Create `templates/rencar-polished` from the finalized trial's implementation, with a new version and provenance. The current Day & Night client remains an independent copy. The name describes the design family; Day & Night identity does not become the master identity.

This is the documented future procedure. No `rencar-polished` folder, catalog entry or preview has been created by the style-guide task.

## Promotion procedure

1. Identify the finalized source folder/version and exact changes. Read its AGENTS, style guide, metadata and QA. Confirm physical paths and dirty state. Never replace an existing destination; use an explicit new version/variant if necessary.
2. Copy the reusable source while excluding `.git`, credentials, `.env*`, deployment bindings, `.vercel`, `.agency-os`, `.client`, dependencies, build caches, runtime logs and rejected experiments. Preserve lockfiles, source licenses and relevant asset provenance.
3. Separate reusable code, layout, motion and style tokens from client identity. In the promoted master, rename the client-named presentation files to a neutral family location and update references. Keep branding in one documented boundary. Do not blindly copy the trial and call it generic.
4. Replace Day & Night names, logo, phone, addresses, social/video links, stock, business claims and client-specific images with explicitly documented demo defaults or a neutral required configuration. Scan every retained route and metadata entry. Do not invent a replacement dealership's facts.
5. Preserve the real five-home codebase. Record which homes have received the polish/dealer adaptation; retaining five pages is not proof all five are ready. Choose one default entry and list exact URLs for supported alternatives.
6. Finish the rental-to-dealer conversion in this shared template task before advertising branding-only dealer builds. Document routes and behaviors for inventory, detail, search and enquiry; remove rental-specific booking/payment assumptions intentionally.
7. Run framework checks/build and browser-check all offered homes and the key journey at 390 and 1440px. Verify images, overflow, menu/search behavior and content defaults. Record any local-only forms honestly.
8. Add a distinct catalog entry with exact path, family, version, readiness, aliases and an explicitly free preview port if started. Write TEMPLATE.md with personalization files and a promotion manifest recording source, date, files and QA. Carry the Rencar style guide forward.
9. Future lead demos use `scripts/new-client.mjs` against the promoted key. Change logo, colours, media, facts and copy. Existing client copies receive no automatic update; later changes are intentional and separately reviewed.

## Updating the original master instead

If the owner chooses to make the polished design the default `rencar`, apply only the reusable delta to that master and version it. Do not overwrite it with the entire client folder. Keep a recoverable original baseline and provenance. Independent client copies still stay independent.

Promotion, Svelte migration, public deployment and outreach are separate actions. A style guide is not evidence any of those has happened.
