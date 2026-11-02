<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import CatalogToolbar from "#lib/components/vehicle-listing/CatalogToolbar.svelte";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileCloseButton from "#lib/components/mobile/MobileCloseButton.svelte";
  import { ownCatalogDialog } from "#lib/components/vehicle-listing/catalog-dialog.ts";
  import { catalogSortOptions } from "#lib/data/mobile-catalog.ts";
  import { rentalCars, filterRentalCars } from "#lib/data/rental-catalog.ts";

  let {
    make,
    budget,
    sort,
    query,
    onapply,
    category,
    count,
    days = 0,
  }: {
    make: string;
    budget: string;
    sort: string;
    query: string;
    category: string;
    count: number;
    days?: number;
    onapply: (value: {
      make: string;
      budget: string;
      sort: string;
      category: string;
      query: string;
    }) => void;
  } = $props();
  const locale = useLocale();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const id = $props.id();
  const makes = [...new Set(rentalCars.map((car) => car.make))].sort();
  let open = $state(false);
  let panel = $state<"filters" | "sort">("filters");
  let draftQuery = $state("");
  let draftMake = $state("");
  let draftBudget = $state("");
  let draftSort = $state("");
  let draftCategory = $state("");
  function categoryLabel(value: string) {
    return value === "suv"
      ? "SUV"
      : value === "compact"
        ? locale.locale === "bg"
          ? "Компактен"
          : "Compact"
        : value === "saloon"
          ? locale.locale === "bg"
            ? "Седан"
            : "Saloon"
          : locale.locale === "bg"
            ? "Тип"
            : "Type";
  }
  const activeCount = $derived(
    Number(!!query.trim()) +
      Number(!!make) +
      Number(!!budget) +
      Number(!!category),
  );
  const countLabel = $derived(
    locale.count(count) +
      (days
        ? " · " +
          days +
          " " +
          (locale.locale === "bg"
            ? days === 1
              ? "ден"
              : "дни"
            : days === 1
              ? "day"
              : "days")
        : ""),
  );
  const appliedFilters = $derived(
    [
      {
        key: "query" as const,
        value: query.trim(),
        label: locale.t("catalog.searchQuery", { query: query.trim() }),
      },
      { key: "make" as const, value: make, label: make },
      {
        key: "budget" as const,
        value: budget,
        label:
          "≤ " +
          locale.money(Number(budget), "EUR") +
          (locale.locale === "bg" ? "/ден" : "/day"),
      },
      {
        key: "category" as const,
        value: category,
        label: categoryLabel(category),
      },
    ].filter((field) => field.value),
  );
  function removeFilter(
    key: "query" | "make" | "budget" | "category" | undefined,
    trigger: HTMLButtonElement,
  ) {
    const next = { query, make, budget, category, sort };
    if (key) next[key] = "";
    else {
      next.query = "";
      next.make = "";
      next.budget = "";
      next.category = "";
    }
    trigger
      .closest("section")
      ?.querySelector<HTMLButtonElement>(".rental-filter-trigger")
      ?.focus({ preventScroll: true });
    onapply(next);
  }
  const title = $derived(
    panel === "sort" ? locale.t("catalog.sort") : locale.t("action.filters"),
  );
  const previewCount = $derived(
    filterRentalCars(
      draftQuery,
      draftMake,
      draftBudget,
      draftSort,
      draftCategory,
    ).length,
  );

  afterNavigate(() => (open = false));

  function show(next: "filters" | "sort") {
    draftQuery = query;
    draftMake = make;
    draftBudget = budget;
    draftSort = sort;
    draftCategory = category;
    panel = next;
    open = true;
  }
  function apply(event: SubmitEvent) {
    event.preventDefault();
    open = false;
    onapply({
      make: draftMake,
      budget: draftBudget,
      sort: draftSort,
      category: draftCategory,
      query: draftQuery,
    });
  }
  function clear() {
    if (panel === "sort") draftSort = "";
    else {
      draftQuery = "";
      draftCategory = "";
      draftMake = "";
      draftBudget = "";
    }
  }
</script>

<CatalogToolbar
  prefix="rental"
  {countLabel}
  filterCount={activeCount}
  {sort}
  entity={locale.t("navigation.vehicles").toLocaleLowerCase()}
  filterOpen={open && panel === "filters"}
  sortOpen={open && panel === "sort"}
  onfilter={() => show("filters")}
  onsort={() => show("sort")}
/>
{#if appliedFilters.length}<div class="rental-active-filters">
    <MobilePillRail
      variant="secondary"
      label={locale.t("catalog.selectedFilters", {
        entity: locale.t("navigation.vehicles").toLocaleLowerCase(),
      })}
    >
      {#each appliedFilters as field (field.key)}<MobilePill
          label={field.label}
          trailingIcon="close"
          variant="secondary"
          ariaLabel={locale.t("catalog.removeFilter", { field: field.label })}
          onclick={(event) => removeFilter(field.key, event.currentTarget)}
        />{/each}
      <MobilePill
        label={locale.t("ui.mobile-catalog.clear-all")}
        variant="secondary"
        onclick={(event) => removeFilter(undefined, event.currentTarget)}
      />
    </MobilePillRail>
  </div>{/if}

{#snippet body()}
  <form id={id + "-form"} onsubmit={apply}>
    <div class="mobile-filter-body control-fields">
      {#if panel === "sort"}
        <fieldset class="mobile-sort-options">
          <legend class="visually-hidden">{title}</legend>
          {#each catalogSortOptions as option (option.value)}
            <label class="mobile-choice-row"
              ><span>{locale.t(option.labelKey)}</span><input
                type="radio"
                name={id + "-sort"}
                value={option.value}
                bind:group={draftSort}
              /></label
            >
          {/each}
        </fieldset>
      {:else}
        <label class="rental-control-field"
          ><span
            >{locale.locale === "bg"
              ? "Марка или модел"
              : "Make or model"}</span
          ><input
            name="query"
            type="search"
            maxlength="120"
            bind:value={draftQuery}
            placeholder={locale.locale === "bg" ? "Ключова дума" : "Keyword"}
          /></label
        >
        <label class="rental-control-field"
          ><span
            >{locale.locale === "bg" ? "Тип автомобил" : "Vehicle type"}</span
          ><select name="category" bind:value={draftCategory}
            ><option value=""
              >{locale.locale === "bg" ? "Всички типове" : "All types"}</option
            >{#each ["compact", "saloon", "suv"] as value (value)}<option
                {value}>{categoryLabel(value)}</option
              >{/each}</select
          ></label
        >
        <label class="rental-control-field"
          ><span>{locale.t("catalog.make")}</span><select
            name="make"
            bind:value={draftMake}
            ><option value="">{locale.t("catalog.allMakes")}</option
            >{#each makes as name (name)}<option value={name}>{name}</option
              >{/each}</select
          ></label
        >
        <label class="rental-control-field"
          ><span
            >{locale.locale === "bg"
              ? "Максимална цена на ден (€)"
              : "Maximum daily price (€)"}</span
          ><input
            name="budget"
            type="number"
            min="1"
            step="1"
            value={draftBudget}
            oninput={(event) => (draftBudget = event.currentTarget.value)}
            placeholder={locale.locale === "bg"
              ? "Без ограничение"
              : "Any price"}
          /></label
        >
      {/if}
    </div>
  </form>
{/snippet}

{#snippet actions()}
  <button type="button" onclick={clear}
    >{locale.t("ui.catalog-filter-sheet.reset")}</button
  >
  <button class="mobile-filter-apply" type="submit" form={id + "-form"}
    >{locale.t("catalog.showCount", {
      count: locale.count(previewCount),
    })}</button
  >
{/snippet}

{#if phone.current}
  <MobileSheet
    bind:open
    {title}
    class="mobile-catalog-sheet rental-controls-sheet"
  >
    {#if open}{@render body()}{/if}
    {#snippet footer()}{@render actions()}{/snippet}
  </MobileSheet>
{:else if open}
  <dialog
    class="rental-controls-dialog"
    aria-labelledby={id + "-title"}
    {@attach ownCatalogDialog}
    onclose={() => (open = false)}
    oncancel={() => (open = false)}
  >
    <header>
      <h2 id={id + "-title"}>{title}</h2>
      <MobileCloseButton
        label={locale.locale === "bg" ? "Затвори" : "Close"}
        onclick={() => (open = false)}
      />
    </header>
    {@render body()}
    <footer>{@render actions()}</footer>
  </dialog>
{/if}

<style>
  .rental-active-filters {
    margin-top: 8px;
  }
  .control-fields {
    display: grid;
    gap: 20px;
  }
  .rental-control-field {
    display: grid;
    gap: 8px;
    min-width: 0;
    font-size: 14px;
    font-weight: 500;
  }
  .rental-control-field input,
  .rental-control-field select {
    width: 100%;
    min-width: 0;
    height: 44px;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font-size: 16px;
  }
  input:focus-visible,
  select:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
  .rental-controls-dialog {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(480px, 100vw);
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    padding: 0;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 20px 0 0 20px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  .rental-controls-dialog::backdrop {
    background: rgb(0 0 0 / 32%);
  }
  .rental-controls-dialog header,
  .rental-controls-dialog footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
  }
  h2 {
    margin: 0;
    font-size: 24px;
    line-height: 1.3;
  }
  .rental-controls-dialog .control-fields {
    padding: 24px;
  }
  .rental-controls-dialog footer button {
    min-height: 44px;
    padding: 10px 16px;
    border: 0;
    border-radius: 999px;
    font-size: 14px;
    background: transparent;
    color: var(--bs-neutral-1000);
    cursor: pointer;
  }
  .rental-controls-dialog footer .mobile-filter-apply {
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  .rental-controls-dialog .mobile-choice-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 52px;
    font-size: 15px;
  }
  @media (min-width: 768px) {
    .rental-active-filters :global(.mobile-pill-rail) {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .rental-active-filters :global(.mobile-pill) {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 36px;
      padding: 6px 10px;
      border: 1px solid var(--bs-neutral-200);
      border-radius: 999px;
      background: var(--bs-neutral-0);
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
