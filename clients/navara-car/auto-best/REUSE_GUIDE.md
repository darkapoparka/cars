# Reuse guide

This codebase is deliberately easy to reskin, but the checked-in project is a **lead-specific Day & Night demo**. It is not the shared `autodeal-best` master and must not be cloned as an untracked template.

## Reskin surface

Keep lead identity and content changes inside these owned modules:

- `src/lib/config/brand.ts` — business name, phone, address, logo, and verified contact details.
- `src/lib/data/navigation.ts` — route labels and menu content; contact values derive from the brand configuration.
- `src/lib/data/inventory.ts` — illustrative vehicle records and their local media.
- `src/lib/data/company.ts` — services, visit information, and explicitly disclosed demo-only team/partner data.
- `src/lib/data/editorial.ts` — article summaries and detail content.
- `src/lib/data/home.ts` — homepage discovery and conversion content.
- `src/app.css` — stable design tokens and global visual primitives.
- `static/assets/images/lead` — lead-owned or lead-approved identity/campaign media.

Routes, components, filters, and interaction behavior should remain generic. Never add a new lead by duplicating route markup, reviving the legacy mirror, or applying post-load DOM mutation.

## Proper Agency OS reuse

For another lead:

1. Use the canonical Agency OS demo factory and a `ready` template record.
2. Create a new tracked project under `M:\codex\agency\projects\leads\<vertical>\<lead-slug>\<project-key>`.
3. Keep this project's exact qualified commit as implementation evidence, not as an unregistered master.
4. Replace identity, contacts, metadata, inventory, claims, and lead-specific media.
5. Search for `Day & Night`, `day-night`, the current phone/address, and every old social/domain value.
6. Run the full quality, asset, route, browser, and license gates before deployment.
7. Record QA and the exact deployment URL against the new demo project in Neon.

## Template promotion

If this native architecture should replace the current reusable template, open a separate **Template Promotion** task. Work in a generic candidate under the Agency OS template root, remove all lead identity, declare every runtime asset, pass the structured reuse preflight, and update the template registry only after the filesystem and Neon evidence agree.
