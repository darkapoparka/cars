<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import ListingFilterPanel from "./ListingFilterPanel.svelte";
  import { range } from "#lib/vendor.ts";
</script>

<ListingFilterPanel title={locale.t("ui.listing-price-filter.filter-price")}>
  <div class="pt-20">
    <div class="box-slider-range">
      <div id="slider-range" {@attach range}></div>
      <div class="box-value-price"
        ><span class="text-md-medium neutral-1000 desktop-type-label">$0</span
        ><span class="text-md-medium neutral-1000 desktop-type-label">$500</span
        ></div
      >
      <input
        class="value-money"
        type="hidden"
        aria-label={locale.t("ui.listing-price-filter.preview-field")}
      />
    </div>
  </div>

  {#snippet footer()}<div
      class="d-flex justify-content-between pt-20 border-top"
    >
      <DemoActionLink
        href="#!"
        class="d-flex align-items-center desktop-type-control"
        aria-label={locale.t("ui.listing-price-filter.view-details")}
      >
        <div class="background-100 icon-shape p-1 rounded-1 me-2">
          <svg
            class=""
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <line
              x1="1.20074"
              y1="1.5141"
              x2="7.59837"
              y2="7.91174"
              stroke="black"
              stroke-width="0.904762"
            ></line>
            <line
              x1="1.01337"
              y1="7.91156"
              x2="7.411"
              y2="1.51393"
              stroke="black"
              stroke-width="0.904762"
            ></line>
          </svg>
        </div>
        <span class="text-sm-medium neutral-1000 desktop-type-control"
          >{locale.t("ui.listing-price-filter.clear")}</span
        >
      </DemoActionLink>
      <DemoActionLink
        href="#!"
        class="btn btn-primary px-3 py-2 desktop-type-control"
        aria-label={locale.t("ui.listing-price-filter.apply")}
      >
        <img
          src="/assets/imgs/template/icons/user.svg"
          alt={locale.t("image.illustrative")}
        />
        {locale.t("ui.listing-price-filter.apply")}
      </DemoActionLink>
    </div>{/snippet}
</ListingFilterPanel>
