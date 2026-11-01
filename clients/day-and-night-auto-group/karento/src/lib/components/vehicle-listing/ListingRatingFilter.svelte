<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingFilterPanel from "./ListingFilterPanel.svelte";
  const scores = [5, 4, 3, 2, 1] as const;
  const positions = [1, 2, 3, 4, 5] as const;
</script>

<ListingFilterPanel title={locale.t("ui.listing-rating-filter.review-score")}>
  <ul class="list-filter-checkbox">
    {#each scores as score (score)}
      <li>
        <label class="cb-container">
          <input
            type="checkbox"
            aria-label={locale.t("ui.listing-rating-filter.preview-field")}
          /><span class="text-sm-medium">
            {#each positions as position (position)}<img
                src={position <= score
                  ? "/assets/imgs/template/icons/star-yellow.svg"
                  : "/assets/imgs/template/icons/star-grey.svg"}
                alt={locale.t("image.illustrative")}
              />{/each}</span
          ><span class="checkmark"></span>
        </label>
      </li>
    {/each}
  </ul>
</ListingFilterPanel>
