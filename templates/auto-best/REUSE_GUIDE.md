# Adapting Auto Best for a dealer

The normal workflow is to clone the template, replace its business content and media, and keep the established page layouts and interactions. The result is an independent client project.

## Create the project

For a standalone client repository:

```sh
git clone https://github.com/darkapoparka/cars-template-auto-best.git dealer-site
cd dealer-site
npm ci
```

Give the client project its own Git remote before publishing changes. To retain template history while making the destination clear:

```sh
git remote rename origin template
git remote add origin <client-repository-url>
```

Replace the placeholder with the actual client repository. For a multi-design dealer project, put the complete app in its `auto-best/` subdirectory; the parent project owns Git and deployment composition. This template itself does not supply a multi-design router.

In the existing Cars workspace, `scripts/new-client.mjs` is an alternative copy helper run from that workspace. It is not a script shipped by this standalone package. A manual copy needs the source, static assets, package/lock/config files, useful documentation and relevant notices—not `node_modules`, build caches, `.git`, `.vercel` bindings, local secrets or generated test output.

## Personalization map

| Change | Main files |
| --- | --- |
| Business names, phone, address, appointment text, socials, logo | `src/lib/config/brand.ts` |
| Favicon and document language | `src/app.html` |
| Brand colors and common typography/geometry | `src/lib/styles/tokens.css` |
| Stock, prices, photographs, evidence | `src/lib/data/inventory.ts` |
| Services, contact topic text and map coordinates | `src/lib/data/company.ts` |
| Navigation titles, groups and destinations | `src/lib/data/navigation.ts` |
| Body types, brands and featured editorial selection | `src/lib/data/home.ts` |
| Articles and their images | `src/lib/data/editorial.ts` |
| Featured videos | `src/lib/data/videos.ts` |
| Hero, menu and service artwork | `vehicle-artwork.ts`, `feature-artwork.ts`, `service-artwork.ts` under data |
| Page titles/descriptions and route-specific copy | Relevant `src/routes` page and feature components |
| Preview/indexing and sample sections | `src/lib/config/template.ts` |

This is a set of practical edit locations, not a claim that all text lives in one config file. Hero headlines, footer copy, call-to-action labels and some service-card copy remain in Svelte components. [Components](docs/COMPONENTS.md) provides the map.

## Identity and contacts

Start with verified business name, usable logo, phone, location and destinations. Set `name` and `shortName` deliberately. Keep `phone` readable and `phoneHref` in international `tel:` format. Update the selected logo path and the independent favicon reference.

Update both textual address and `showroomCoordinates`; changing only the address will not move the map pin. Set the actual social profiles and review all displayed video records. A new YouTube channel URL does not replace the inherited thumbnail/video selection.

## Inventory

Replace sample records with the client inventory. Keep stable positive numeric IDs, correct title/make/body, numeric year/mileage/price and appropriate photos. The application derives formatted values and detail URLs. Use only equipment supported by the record; the source template equipment array is not a specification for every client vehicle.

Review `listingFilterOptions` after changing inventory: some versions derive choices while the standalone baseline has explicit arrays for several facets. Body and brand artwork coverage is separate from current stock. Keep an intentional zero-results state for categories without matches.

The local refactored records include explicit `model` and `version` fields and accept a record-level `verification` value. Supply `evidenceUrl` for a verified vehicle. Those fields also feed model/version discovery and published-mode validation.

## Images and generated banners

Store runtime images under `static/` and use public `/assets/...` paths. Update the source dimensions and any crop/bounds metadata when replacing artwork. Photography and cutouts use different framing; substituting one for the other can change the composition even when the CSS is untouched.

Some approved banners contain image-generated text and dealer identity inside their pixels. Replacing the brand config or image alt text does not personalize those pixels. Replace the actual image where the client identity requires it, keeping the same intended composition and interactive destination.

Inspect stock watermarks, portraits, logos, premises imagery, thumbnails and campaign copy. Decorative generated facilities/cars are illustrations, not photographs proving the new dealer owns them. Credits and notices are covered in [Assets](ASSET_PROVENANCE.md).

## Copy and localization

The interface defaults to Bulgarian, euros and kilometres. Localization touches `src/app.html`, copy in routes/components, navigation, contact topics, editorial categories, filter labels, number formatting, price labels, phone presentation and image-baked text. There is no installed translation framework to configure.

Review the actual services before retaining import, trade-in or leasing claims. Optional team/partner sections remain off until their records are suitable for the client. Keep the existing calculator explanation: it displays principal division without interest, fees or insurance.

## Contact delivery

The existing enquiry UI prepares a local draft for copying or sharing. It does not send email, upload stock photos to a server or create a CRM lead. Keeping that behavior is valid for a visual demo; a client needing automatic delivery requires a separately implemented server action/endpoint and provider integration.

A real integration needs server-side validation, recipient configuration, request limits and meaningful success/failure states. Secrets belong on the server, not in `brand.ts`, client modules or `static/`. The integration should use the existing form journey rather than replacing the frontend merely to send its data.

## Review the client site

Run the documented checks, then inspect home, inventory, a vehicle detail, About, Contact, an article and the offered sell/import/finance journeys at 390px and 1440px. Exercise a filter and return path, mobile menu dismissal, form review/copy behavior and actual contact destinations. [Testing](docs/TESTING.md) gives the commands.

Search the retained source for `Auto Best`, `Day & Night`, `day-night`, the old phone/address, social handles and video IDs. Review rather than blindly replacing filenames: historical provenance may retain names, while active content must match the client. Visual inspection is necessary for image-baked identity.

Keep the site in preview mode during preparation. Build and indexing configuration are in [Deployment](docs/DEPLOYMENT.md). Record the actual template commit used for the copy so later shared fixes can be selectively ported without overwriting client changes.
