# Data and configuration reference

The application uses TypeScript modules under [src/lib/config](../src/lib/config) and [src/lib/data](../src/lib/data). These modules are imported by routes and components; there is no runtime admin API or database schema to migrate.

## Brand identity

`config/brand.ts` exports `brand`, checked with `satisfies BrandConfig`.

| Fields | Meaning |
| --- | --- |
| `name`, `shortName` | Business/display names |
| `city`, `addressLine`, `address` | Location text; address is composed from the configured parts |
| `phone`, `phoneHref` | Human-readable phone and `tel:` destination |
| `appointment` | Visit/appointment text |
| `logo` | Local public path beginning with `/` |
| `youtubeUrl`, `instagramUrl`, `facebookUrl` | Outgoing HTTPS social destinations |

The types constrain shape, not the truth of business details. Keep display phone and `tel:` link consistent. The favicon is selected separately in `src/app.html`; coordinates live separately in `company.ts`.

## Template presentation

`config/template.ts` exports `template` and `canIndex()`. Defaults are `mode: preview`, no canonical origin, unverified identity/inventory, and disabled demo-team/demo-partner sections. `canIndex()` returns false in preview mode. Published mode validates its configured origin and content flags rather than merely hiding the noindex tag. [Deployment](DEPLOYMENT.md) explains the complete behavior.

## Inventory

`data/inventory.ts` exports `Vehicle`, `VehicleCondition`, `VehicleEquipment`, `featuredVehicles` and `formatVehiclePrice`. Input records are transformed into the exported vehicles.

| Record field | Representation |
| --- | --- |
| `id` | Unique positive integer used by detail URLs |
| `make`, `title` | Make identity and full display title |
| `category`, `body` | Human-facing category and filter body key, for example `Комби` / `Wagon` |
| `yearNumber`, `mileageKm`, `priceEur` | Numeric year, kilometres and euro price |
| `fuel`, `transmission` | Display/filter values |
| `equipment` | Array of supported `VehicleEquipment` values |
| `condition` | `new` or `used` |
| `image` | Local public image path |
| `verification`, `evidenceUrl` | Sample/verified status and optional source evidence |

The output derives `year`, formatted `mileage` and `href` (`/listing-detail-v1/<id>`). Formatting uses `bg-BG`; the price formatter appends the euro symbol. Store numeric prices/mileage in the input rather than parsing them from displayed strings.

The current local record schema also contains explicit `model` and `version` strings. The mapper defaults `verification` to `sample` but accepts a record-specific value. Model/version facets use those dedicated fields. For a verified record, supply the correct record data and an `evidenceUrl` rather than changing only a site-wide flag.

Adding a vehicle affects inventory, featured stock, brand/body counts, filters, recommendations, contact context and the sitemap. The current fixture set contains eight records, but route resolution is based on the records rather than a fixed eight-page routing table. Shared source images do not establish that two sample records represent the same physical car.

## Listing filters

`data/listing.ts` owns the common URL/domain contract:

| Function | Use |
| --- | --- |
| `parseListingFilters(params)` | Convert URL parameters into a complete `ListingFilters` value |
| `listingParams(filters)` | Serialize non-empty values, repeat equipment values and omit default sort |
| `listingHiddenFields(filters, exclude)` | Keep applied values in smaller GET forms |
| `activeFilterCount(filters)` | Count serialized facets excluding query and sort |
| `removeListingFilter(filters, key, value)` | Remove one facet; removing make also removes model |
| `filterListingVehicles(records, filters)` | Match and sort records without modifying the source list |
| `listingModelsForMake(make)` | Produce model choices for the selected make |
| `vehicleMatchesQuery(vehicle, query)` | Normalize and match the searchable vehicle text |
| `bodyLabel(body)` | Display label for a body key |

The state shape includes query, make/model/body, fuel/transmission/version, equipment, condition, year bounds, price bounds, maximum mileage and sort. Query keys use snake_case for numeric bounds. Empty strings and null bounds mean no constraint. Integer query parsing rejects malformed, negative and unsafe values; zero remains a real value. Unknown equipment values are discarded, duplicates removed, and unknown sorts fall back to `default`.

Example using the real helpers inside application TypeScript:

```ts
import { featuredVehicles } from "$data/inventory";
import { parseListingFilters, filterListingVehicles, listingParams } from "$data/listing";

const filters = parseListingFilters(
  new URLSearchParams("make=BMW&price_max=80000&sort=price-asc")
);
const matches = filterListingVehicles(featuredVehicles, filters);
const href = `/listing-grid?${listingParams(filters)}`;
```

The current source also has `priceMinExclusive`, serialized as `price_min_exclusive=1`, for non-overlapping budget bands. `data/discovery.ts` owns the budget partition; `data/filter-fields.ts` provides `filtersFromDraft` and `invalidRange`. `config/discovery.ts` defines the input year policy: 1900 through the current year plus one.

The precise external query keys and examples are in [Routes](ROUTES.md). A new facet needs updates to its type, parse/serialize behavior, matching, controls, chips and tests—not only a new input.

## Services, contact and journeys

`company.ts` defines service cards, contact topics, preparation copy, `resolveContactTopic`, `resolveImportUrl` and showroom coordinates. Contact topics are `general`, `inspection`, `import`, `leasing` and `trade-in`; an unknown topic resolves to general.

`resolveImportUrl` accepts a trimmed HTTP(S) URL of at most 2048 characters without embedded credentials. It normalizes the URL but does not request its content. `journeys.ts` resolves known vehicle IDs, constructs contact links, and confines return links to the expected list.

The current source extracts `finance.ts`: `FinanceSelection`, `financeTerms`, `calculateFinance`, `parseFinanceSelection` and `financeParams`. Deposit/term use `down_payment` and `term` in the URL, and the contact/detail loaders restore valid selections. Invalid amounts or unsupported terms produce no selection. `enquiry.ts` validates trimmed make/model and year; `ui/enquiry-validation.ts` connects errors to native form validity. `ui/enquiry-photos.ts` manages up to six local JPG/PNG/WebP previews, up to 10 MiB each, with object-URL cleanup.

## Editorial

`editorial.ts` defines `BlogPost`: numeric `id`, `title`, summary `text`, `category`, `tag`, `image`, and `sections` containing a title and paragraph array. Categories are currently `Оглед`, `Внос`, `Лизинг`, `Насоки`, `Бартер`.

The blog loader calls `parseBlogFilters` and `filterBlogPosts`. Article details resolve the record and choose up to three related articles, preferring the same category. Homepage editorial content derives from the canonical article records rather than a separate article database. Keep summary, title, image and detail sections consistent when editing a post.

## Discovery, navigation and videos

`home.ts` joins configured body/brand artwork with inventory counts. Artwork coverage is not identical to current stock: zero-stock choices lead to the listing empty state.

`navigation.ts` defines typed links, groups, mega-menu features and actions. A feature uses either a named vehicle illustration or a feature-artwork record. Internal paths and telephone destinations are different types; `ActionLink` accepts internal destinations.

`videos.ts` defines a curated array of video ID, title, displayed duration and local thumbnail. The YouTube channel destination comes from brand configuration. This is not an automatic channel feed. Changing the channel URL alone does not replace the selected video records.

`demo-content.ts` supplies sample team/partner material; presentation flags determine whether it is rendered.

## Artwork data

| Module | Data |
| --- | --- |
| `vehicle-artwork.ts` | Named vehicle cutouts, route pairs, mobile artwork and region mappings |
| `feature-artwork.ts` | Service and editorial menu imagery |
| `service-artwork.ts` | Decorative service-card artwork |
| `home.ts` | Body-category and brand-logo dimensions/bounds |

`width` and `height` describe the full source image. `bounds: [left, top, right, bottom]` describes its visible subject; visible width is right minus left. `crop: [x, y, width, height]` describes a viewport region. Crop coordinates can be negative when the intended frame includes space outside the image. Do not interchange the two tuple formats.

Runtime public paths start at `static`: `/assets/images/...` corresponds to `static/assets/images/...`. URLs embedded inside generated image pixels are not editable TypeScript data. [Asset provenance](../ASSET_PROVENANCE.md) describes image families and source notes.
