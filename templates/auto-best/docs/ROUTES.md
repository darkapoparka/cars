# Routes and visitor journeys

Pages are defined under [src/routes](../src/routes). There is one homepage composition, not a collection of hidden template variants.

## Public pages

| URL | Source directory | Purpose |
| --- | --- | --- |
| `/` | `src/routes` | Homepage and discovery |
| `/listing-grid` | `src/routes/listing-grid` | Inventory search, filters and sorting |
| `/listing-detail-v1/[id]` | `src/routes/listing-detail-v1/[id]` | One known vehicle |
| `/about-us` | `src/routes/about-us` | Company and services |
| `/contact` | `src/routes/contact` | General or topic-specific contact |
| `/blog` | `src/routes/blog` | Editorial index and search |
| `/blog-detail/[id]` | `src/routes/blog-detail/[id]` | One known article |
| `/robots.txt` | `src/routes/robots.txt` | Crawler policy |
| `/sitemap.xml` | `src/routes/sitemap.xml` | Canonical page/record URLs |

The current fixtures provide vehicle IDs 1–8 and article IDs 1–9. These are data records, not permanent route limits. A detail ID must be a positive canonical integer identifying an existing record; `01`, `0`, malformed values and unknown IDs return 404. Unknown routes use the shared error page.

## Inventory parameters

All parameters belong to `/listing-grid`. Values are parsed by `data/listing.ts`.

| Parameter | Meaning / example |
| --- | --- |
| `q` | Trimmed vehicle search text |
| `make` | Make, such as `BMW` |
| `model` | Model selection |
| `body` | Body key, such as `Wagon` or `SUV` |
| `fuel` | Configured fuel value |
| `transmission` | Configured transmission value |
| `version` | Version/trim filter |
| `equipment` | Repeated key for each selected equipment value |
| `condition` | `new` or `used` |
| `year_min`, `year_max` | Inclusive integer year bounds |
| `price_min`, `price_max` | Inclusive integer euro bounds |
| `mileage_max` | Maximum integer kilometres |
| `sort` | `default`, `newest`, `price-asc`, `price-desc`, `mileage-asc` |

`newest` sorts by vehicle year, not by the date an advert was imported. `default` sorts by vehicle ID. Empty bounds mean no constraint; `price_max=0` is a real zero limit rather than an empty filter.

```text
/listing-grid?make=BMW&sort=price-asc
/listing-grid?body=Wagon&price_max=80000
/listing-grid?equipment=4x4&equipment=Навигация
```

Use `URLSearchParams` when building links so spaces, Unicode and repeated values are encoded correctly. Changing make clears its dependent model. Form controls preserve unrelated applied parameters.

The current local source additionally supports `price_min_exclusive=1`. Budget links use it to make adjacent bands non-overlapping. Keep it with its minimum-price value when preserving the applied filter state.

## Detail return links

Vehicle cards can carry the original inventory URL plus a `#vehicle-<id>` anchor as the `return` value. Article cards similarly preserve the blog filters and an `#article-<id>` anchor. The detail loader returns a confined `returnTo` destination for its back links.

```text
/listing-detail-v1/4?return=%2Flisting-grid%3Fmake%3DBMW%23vehicle-4
/blog-detail/2?return=%2Fblog%3Fcategory%3D%D0%92%D0%BD%D0%BE%D1%81%23article-2
```

An external, protocol-relative or unrelated return path falls back to `/listing-grid` or `/blog`. This behavior lives in `data/journeys.ts`, not in separate per-card string handling.

## Contact topics

| URL | Meaning |
| --- | --- |
| `/contact` | General contact |
| `/contact?topic=inspection` | Viewing/inspection |
| `/contact?topic=leasing` | Finance discussion |
| `/contact?topic=trade-in` | Selling or trade-in |
| `/contact?topic=import` | Import enquiry |

The optional `vehicle` parameter is resolved only for inspection/leasing. For example, `/contact?topic=inspection&vehicle=4` provides the known vehicle to the contact components. An invalid vehicle leaves the contact page usable without vehicle context. An unknown topic resolves to general.

Import can receive `vehicle_url`, for example `/contact?topic=import&vehicle_url=<encoded-https-url>`. The value is normalized by `resolveImportUrl`; no remote advert content is fetched. The `#contact-intent` fragment targets the enquiry section.

The current local source also carries `down_payment` and `term` for a known vehicle. For example, `/contact?topic=leasing&vehicle=1&down_payment=10000&term=24` displays the valid selection; the detail return can restore it. Allowed terms are 12, 24, 36, 48 and 60 months. The deposit must be nonnegative, no greater than the price, and at most two decimal places. Invalid selection data is ignored rather than becoming an offer.

## Enquiry behavior

Sell/trade-in collects vehicle details, optional contact information and local photo previews before showing a review step. Import starts from a URL or written criteria and collects the preferences needed for a conversation. The visitor can edit, copy or invoke the browser share sheet.

Opening, advancing and closing a dialog are client-side interactions. No POST-to-CRM/email endpoint is provided. Telephone and map links are real outgoing actions using configured destinations. Draft text may contain personal information; it is not persisted as application-wide state.

## Editorial parameters

`/blog` supports `q` and `category`. Categories come from `editorial.ts`; unrecognized categories become the unfiltered category choice. The loader filters the canonical post array. Detail pages prefer related articles in the same category and preserve list-return context.

## Legacy redirects

The hook in [hooks.server.ts](../src/hooks.server.ts) emits HTTP 308 redirects and retains the incoming query string.

| Old path | Destination |
| --- | --- |
| `/home02` through `/home10` | `/` |
| `/blog-grid` | `/blog` |
| `/listing-grid2`, `/listing-list` | `/listing-grid` |
| `/listing-grid-map`, `/listing-list-map` | `/listing-grid` |
| `/listing-detail-v2/<id>` through `/listing-detail-v5/<id>` | `/listing-detail-v1/<id>` for an existing record |
| `/faq` | `/contact` |

Former accounts, dashboards and other unsupported template pages are not functioning product features. They resolve to 404 rather than an unrelated page.

## Metadata and search endpoints

Routes set their own title/description; the root layout handles the canonical link and preview noindex tag. `sitemap.xml` builds its page set from the canonical routes plus current vehicle/article records. `robots.txt` uses `canIndex()`. See [Deployment](DEPLOYMENT.md) for preview versus published behavior.
