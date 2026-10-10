<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { listingBrands } from "#lib/data/vehicle-listing.ts";
</script>

<div class="card shadow-none flex-fill"
  ><div class="card-header"
    ><p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t("ui.dashboard-premium-brands-card.premium-brands")}</p
    ></div
  ><div class="card-body"
    ><div
      class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
      ><ul class="carouselTicker__list"
        >{#each listingBrands as brand (brand.id)}<li
            class="carouselTicker__item"
            ><a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t(
                "ui.dashboard-premium-brands-card.view-details",
              )}
              ><img
                class="light-mode"
                src={brand.light}
                alt={locale.t("image.illustrative")}
              /><img
                class="dark-mode"
                src={brand.dark}
                alt={locale.t("image.illustrative")}
              /></a
            ></li
          >{/each}</ul
      ></div
    ></div
  ></div
>
