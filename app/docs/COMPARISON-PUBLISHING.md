# App and reference comparison deployments

The editable App source remains `L:/CODEX/cars/templates/app` in Cars. Its separate GitHub repository is a publishing snapshot, not a second editable master. No nested Git repository was created in the template.

| Site | GitHub publishing repository | Vercel project / alias | Canonical source |
| --- | --- | --- | --- |
| App showroom candidate | darkapoparka/cars-template-app | cars-template-app.vercel.app | L:/CODEX/cars/templates/app |
| Original CARS24 reference | darkapoparka/inspiration-cars24 | inspiration-cars24.vercel.app | L:/inspiration/cars24 |
| mobile.de reference | darkapoparka/inspiration-mobile | inspiration-mobile.vercel.app | L:/inspiration/mobile-de-app |

All repositories are private. The production comparison URLs are accessible for review, while non-production previews retain Vercel authentication. Deployments use Node 22 and the retained npm lockfile. Search indexing is disabled. Reference captures, APKs, environments, dependencies and build caches are excluded from publishing; required website assets remain included. Original source histories and reference captures remain local.

App is catalogued as a candidate, not approved in `templates.lock.json`. This comparison publication does not add it to dealer trios or update existing dealers. Dealer configuration, EN/BG localization, mounted routes, generator integration and removal of remaining reference claims/transactions still require acceptance before a client release.

For a single showroom, App has the more suitable presentation and compact service navigation. For a multi-seller platform, the mobile.de reference has the better starting information architecture: vehicle categories, structured search, detailed filters, saved searches and parked cars. Its four fixtures and disconnected marketplace/account flows do not constitute a production backend. A future platform should use original branding and assets rather than ship the reference identity.

The final frontend pass preserves App's composition and generated artwork. It normalizes inventory filter accents, enlarges close/model-expansion hit areas, formats monthly values consistently, removes duplicate desktop identity, updates compact header state on resize, and removes redundant empty Saved-page height.

Deployment receipts, source manifests, validation logs and screenshots are recorded in Cars `runtime/app-showroom-qa`. The current Cars checkout has unrelated changes and remote drift; publishing snapshots preserve these without resetting or staging the shared index.
