# Component guide

Components live in [src/lib/components](../src/lib/components), grouped by feature rather than by abstract UI level. Most styling stays beside the markup. Page-wide composition remains in `src/routes`.

## Shell and navigation

| Component | Responsibility and main inputs |
| --- | --- |
| `layout/SiteShell.svelte` | Shared page structure; children snippet and footer presentation flags |
| `layout/Header.svelte` | Desktop navigation/mega menu, mobile navigation and route-aware header state |
| `layout/MobileMenu.svelte` | Mobile menu contents rendered by Header |
| `layout/Footer.svelte` | Business footer and optional next-step actions; `showActions`, `showMobileFooter` |
| `layout/NavigationFeatureCard.svelte` | One illustrated mega-menu feature from navigation data |
| `layout/MobileNavIcon.svelte` | Existing mobile navigation icon geometry |

Navigation content is in `data/navigation.ts`; identity is in `config/brand.ts`. Edit those modules for a destination or business detail before changing the layout components.

## Homepage

The homepage route assembles feature components; it does not contain a second copy of their content or interaction logic.

| Component | Responsibility |
| --- | --- |
| `home/Hero.svelte` | Homepage heading and hero composition |
| `home/SearchBox.svelte` | Buy/Import entry, mobile mode tabs and desktop discovery composition |
| `home/VehicleQuickSearch.svelte` | Compact home search and its mobile subviews |
| `home/TrustActions.svelte` | Illustrated service/campaign groups |
| `home/InventorySection.svelte` | Featured stock and its section introduction |
| `home/BodyTypes.svelte` | Body-category grid and mobile expansion |
| `home/BrandSection.svelte` | Brand grid and mobile expansion |
| `home/Editorial.svelte` | Selected article cards linked to canonical article data |
| `home/VideoSection.svelte` | Curated video cards and selected-video playback |

The body/brand grids use `data/home.ts`, including counts derived from sample inventory. They deliberately support categories with zero matches. Keep their links connected to the real listing filters. A component file being present does not establish that a route currently renders it; the route imports are the entry point.

## Inventory and filtering

| Component | Responsibility and main inputs |
| --- | --- |
| `listing/ListingHero.svelte` | Inventory introduction |
| `listing/ListingFilters.svelte` | Inventory discovery composition from applied filters |
| `listing/VehicleDiscoveryForm.svelte` | Shared desktop GET form; filters, open callback, draft callback, optional sticky presentation |
| `listing/VehicleSearchDialog.svelte` | Full search draft; `filters` and a children snippet receiving the opener/open state |
| `listing/QuickFilterSheet.svelte` | Single-facet/range picker; optional `filters`, `onApply`, `fullScreen`, `id` and trigger snippet |
| `listing/ListingResults.svelte` | Sort/results/empty-state presentation |
| `vehicles/VehicleCard.svelte` | Vehicle link and presentation; `vehicle`, optional `returnTo`, `showPrice`, `priority`, `layout` |

`VehicleDiscoveryForm` also accepts `showFilterAction`, `enableSticky` and `keywordPlaceholder`. Home can use this form without the inventory sticky behavior. `QuickFilterSheet` can either submit a GET change or update the enclosing full-dialog draft through `onApply`; those are different ownership contexts.

`VehicleCard` defaults to `showPrice=false`, `priority=false`, `layout=default`. The `listing` layout is selected explicitly by listing consumers. An eager/priority image is for the relevant initial view, not every card. Example inside a Svelte component:

```svelte
<script lang="ts">
  import VehicleCard from "$components/vehicles/VehicleCard.svelte";
  import type { Vehicle } from "$data/inventory";
  let { vehicle }: { vehicle: Vehicle } = $props();
</script>

<VehicleCard {vehicle} showPrice layout="listing" />
```

## Detail and contact

The vehicle detail route owns its main gallery, tabs, overview, recommendations and sidebar composition. `VehicleFinanceCalculator.svelte` receives `priceEur` and `vehicleId`, and owns calculator input state.

| Component | Responsibility |
| --- | --- |
| `company/ContactHero.svelte` | Contact/topic header and optional vehicle context |
| `company/ContactIntent.svelte` | Topic-specific contact content; `topic`, optional `vehicle` and `importUrl` |
| `company/ContactVehicle.svelte` | Selected vehicle summary/link; `vehicle` and optional `hero` |
| `company/ShowroomMap.svelte` | Map iframe and external directions link from brand/location data |
| `company/AboutHero.svelte` | About header |
| `company/AboutProcess.svelte` | Service/process presentation |
| `company/AboutTeam.svelte`, `AboutPartners.svelte` | Optional sample content selected by presentation flags |
| `company/SocialBrandIcon.svelte` | Outgoing social-platform glyphs |

The current local source uses separate `company/ImportEnquiry.svelte` and `company/TradeInEnquiry.svelte` workflows. `ImportHowItWorks.svelte` and `TradeInInfoDrawer.svelte` own the corresponding information drawers. `vehicles/PdpImportBanner.svelte` provides the detail-page import action; `home/MobileCoreActions.svelte` owns the approved four-card mobile service grid. Contact also accepts the validated finance selection supplied by its loader. Shared browser helpers in `src/lib/ui` handle enquiry validation, local photos, image status and scroll/focus behavior.

## Editorial

`editorial/BlogHero.svelte` introduces the article index. `BlogCard.svelte` renders one article link and summary. `ArticleSupport.svelte` holds related reading/contact support for the article route. The article loader resolves the record, related records, categories and tags; components do not fetch a CMS.

## Artwork and shared UI

| Component | Responsibility |
| --- | --- |
| `ui/ActionLink.svelte` | Internal link with shared action typography; `href`, optional class and children snippet |
| `ui/Icon.svelte` | Shared named SVG icons |
| `ui/VehicleCutout.svelte` | A named vehicle image; optional mobile image, priority, framing and media query |
| `ui/HeroVehicles.svelte` | Vehicle-pair and mobile hero composition from artwork data |
| `ui/RouteHeroArtwork.svelte` | Route-specific hero artwork |
| `ui/ArtworkRegion.svelte` | Responsive crop region of an existing source image |
| `ui/FeatureArtwork.svelte` | Feature/menu artwork region |
| `ui/icons/OriginalActionIcon.svelte` | Existing action icon family |

Artwork components receive real dimensions and crop/bounds data. They preserve aspect ratio and should not be repurposed as a text-rendering or image-generation layer. [Data](DATA.md) explains the tuples; [Styling](STYLING.md) explains the presentation.

## Choosing an edit location

Change a record for content, a component for its internal markup/behavior, its scoped styles for internal presentation, and the route stylesheet for page geometry. Reuse a component when responsibility matches, not merely because two boxes happen to have the same background.
