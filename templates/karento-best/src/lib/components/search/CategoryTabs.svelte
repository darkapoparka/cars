<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    referenceVehicleSearch,
    type SearchCategoryOption,
    type VehicleSearchCategory,
  } from "#lib/data/search.ts";
  let {
    value = $bindable<VehicleSearchCategory>("all"),
    options = referenceVehicleSearch.categories,
  }: {
    value?: VehicleSearchCategory;
    options?: readonly SearchCategoryOption[];
  } = $props();
</script>

<div class="left-top-search">
  {#each options as option (option.value)}
    <a
      class={[
        "category-link text-sm-bold btn-click desktop-type-pill",
        { active: value === option.value },
      ]}
      href="#!"
      aria-label={locale.text(option.label)}
      role="button"
      aria-pressed={value === option.value}
      onkeydown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      onclick={(event) => {
        event.preventDefault();
        value = option.value;
      }}>{locale.text(option.label)}</a
    >
  {/each}
</div>
