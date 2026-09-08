# Rencar · Day & Night adaptation

Client: `dayandnight`. Project: `day-and-night-rencar`. Base: `rencar@2026.09.06-baseline`. Client version: `2026.09.06-daynight-v1`.

This independent prototype is at `J:/cars/clients/dayandnight/rencar`. The original template guide is preserved in `.template/source-template.md`; `.template/source-manifest.json` records the source copy. Generic metadata under `.template/` describes the original baseline; `.client/project.json` describes this adapted application.

## Sources

- Layout: `J:/cars/templates/rencar`, preview 6430, no Git repository. The copy manifest records 316 source files.
- Identity/media: `M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/autodeal-best-day-night`, preview 5173, Git HEAD `ab92ce9671fb1b56afa38f693755b41aee9c28b0`, with owner changes present. Import intentionally includes current uncommitted cutout images.
- `.client/provenance/assets.json` records 18 imported files by SHA-256. Other provenance notes are carried forward as source evidence.
- Contact/services: the public Day & Night Mobile.bg profile and contact page, checked 2026-09-06. CRM registration is unchanged.

## Current application

`src/client/data.js` owns identity, contacts, services, models and home links. Rencar fonts and broad composition are retained; client CSS applies the Day & Night palette. Native Svelte components replace rental widgets for the offered dealer journey.

| Route | Role |
|---|---|
| `/`, `/index-2.html` | Home 2, primary entrance |
| `/index.html`, `/index-3.html`, `/index-4.html`, `/index-5.html` | Four distinct alternate compositions |
| `/variants.html` | Exact choices with local screenshot previews |
| `/car.html`, `/car-2.html` | Model showcase, search, filters and sort |
| `/car-single.html?id=audi-rs6-avant` | Detail; query retains the originating catalog |
| `/contact.html?topic=inspection` | Direct contact and topic preparation |
| `/about.html` | Dealer introduction |
| `/service.html`, `/service-2.html`, `/service-single.html` | Dealer services |
| `/car-booking.html`, `/car-checkout.html`, `/mail-success.html` | Compatibility entry to contact; no booking or success claims |

Other legacy URLs show client not-found content; unknown model IDs provide a clear catalog return. Source pages remain reference files and are not mounted by App.svelte. The Vite SPA server returns the app document for these paths; this is not server-side HTTP 404 routing.

## Future reuse

Review the prototype with the owner first. A requested shared Rencar dealer pass can reuse its brand/data boundary, native controls and responsive corrections. Do not silently replace the rental master or sync this over another lead.

This compares Rencar-derived compositions with Auto Best media; it is not an exact Auto Best layout clone. Model imagery, decorative media and copy still need review for another lead. Public deployment and any live stock/contact backend remain outside this prototype.

Use README.md for port 6601 commands and `.client/QA.md` for evidence. Avoid inherited fixed-port source wrappers and reference generators.
