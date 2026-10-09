# Adapting Auto Best for a dealer

The normal workflow is to clone the template, replace its business content and media, and keep the established page layouts and interactions. The result is an independent client project.

## Logo assets

Set both `brand.logo` (light backgrounds) and `brand.logoOnDark` (dark backgrounds) in `src/lib/config/brand.ts`. Both assets must be transparent. For a black-only lead logo, create a faithful white variant; preserve its shape, lettering, proportions and clear space. Use an approved reversed logo if available. Do not compensate for a dark logo with a white rectangle, pill, border, shadow or a background baked into the image.

The shared header selects the light variant on mobile home/contact dark overlays and the regular variant on light headers. The white mobile menu uses the regular variant; the dark footer uses `logoOnDark`. Future dealer-logo placements must select by their actual background. Keep surrounding page/navigation surfaces intact and preserve visible keyboard focus and a minimum 44px logo-link height. Verify both assets in mobile/desktop headers, open menus and the footer before accepting a clone.

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

General Contact uses the configured Facebook, YouTube and Instagram URLs in one white desktop panel below the visit card. Its title sits above three bordered profile cards, with round brand icons and labels underneath. In preview mode, empty URLs display labelled, noninteractive sample profiles. Published mode omits them; with no configured profiles, the entire panel is omitted. Keep real dealer destinations in `brand.ts`. The hero, About visit panel and mobile social controls continue to show only configured profiles.

## Inventory

Replace sample records with the client inventory. Keep stable positive numeric IDs, correct title/make/body, numeric year/mileage/price and appropriate photos. The application derives formatted values and detail URLs. Use only equipment supported by the record; the source template equipment array is not a specification for every client vehicle.

Review `listingFilterOptions` after changing inventory: some versions derive choices while the standalone baseline has explicit arrays for several facets. Body and brand artwork coverage is separate from current stock. Keep an intentional zero-results state for categories without matches.

In the standalone baseline, the inventory mapper currently marks all output records as sample and derives model options from titles. Supporting verified records or explicit models requires changing that mapper/domain boundary intentionally; changing only `verifiedInventory` does not do it.

## Images and generated banners

### Home section background choices

`leadSite.artwork.homeSectionBanner` in `src/lib/config/lead-site.ts` selects a reusable Home banner style. The owner-selected default for Auto Best lead/client builds is Nürburgring (`variant: 'circuit'`), with `mobile: 'featured'` applying a compact version to the mobile Featured Cars heading. Use this default for new personalizations and requested client refreshes unless the dealer brief selects another style. Set `mobile: 'none'` to retain plain mobile headings. The other mobile section headings keep their existing presentation.

The five retained choices are `motorsport`, `kerb`, `circuit`, `headlights` and `taillights`. Their desktop and mobile asset paths are owned by `homeSectionBannerAssets` and `homeSectionBannerMobileAssets` in the same config; choosing a style requires no component changes. All four desktop Home section headers share the chosen style. Kerbs use photographed painted-concrete corners at their natural proportions, with each side taken from its own edge of the paired image. Both sweep inward over the retained asphalt material. The `circuit` choice now pairs the admired asphalt/left kerb with an exact reflected counterpart on the right. The map is omitted from the final presentation; its [public-domain Nordschleife source](provenance/nordschleife.md) remains retained. Kerbs and Circuit use proportional 960px mobile encodings; the other three choices reuse their existing plates. [Polish provenance and checks](provenance/home-section-polish-2026-10-09.md) record the selected assets.

During client review, phone visitors open **Menu → Банери / Banner preview**, a centered pill below Contact. It opens a separate modal with five labeled thumbnail choices, keeping the menu layout fixed. Closing the modal returns focus to its pill; choosing a style closes both dialogs and opens Home at the Featured Cars banner, including when choosing from another route. The URL retains the selected `banner` value for refreshing or sharing. This chooser is available on ordinary preview pages without needing a special link. A desktop selector appears on explicit review links such as `/bg?banner=kerb#featured-title` or `/en?banner=kerb#featured-title` while `template.mode` is `preview`, including built previews. Development also provides the selector for local comparisons. A published production site uses its configured style, ignores review overrides and omits both choosers. Before copying or publishing, choose the client's variant and mobile placement, then inspect the actual crop and live heading/button contrast at 320/390px and 992/1440px. These illustrations contain no dealer identity or embedded text.

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

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).
