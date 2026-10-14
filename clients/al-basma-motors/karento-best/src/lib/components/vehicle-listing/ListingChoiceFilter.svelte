<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import type { ListingFilterChoice } from "#lib/data/vehicle-listing.ts";
  import ListingFilterPanel from "./ListingFilterPanel.svelte";
  let {
    title,
    choices,
    seeMoreClass,
  }: {
    title: string;
    choices: readonly ListingFilterChoice[];
    seeMoreClass?: string;
  } = $props();
</script>

<ListingFilterPanel {title}>
  <ul class="list-filter-checkbox">
    {#each choices as choice (choice.label)}
      <li>
        <label class="cb-container">
          <input
            type="checkbox"
            aria-label={locale.t("ui.listing-choice-filter.preview-field")}
          /><span class="text-sm-medium desktop-type-body-small"
            >{choice.labelKey ? locale.t(choice.labelKey) : choice.label}</span
          ><span class="checkmark"></span>
        </label><span class="number-item desktop-type-meta">{choice.count}</span
        >
      </li>
    {/each}
  </ul>
  {#if seeMoreClass}<div class={seeMoreClass}>
      <DemoActionLink
        class="link-see-more desktop-type-control"
        href="#!"
        aria-label={locale.t("action.viewMore")}
      >
        {locale.t("action.viewMore")}
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z"
            fill=""
          ></path>
        </svg>
      </DemoActionLink>
    </div>{/if}
</ListingFilterPanel>
