<svelte:options runes={true} />

<script lang="ts">
  import { tick } from "svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  const currency = $derived(dealer.businessPreview?.currency || "USD");
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileChoicePicker from "#lib/components/mobile/MobileChoicePicker.svelte";
  import MobileSearchField from "#lib/components/mobile/MobileSearchField.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import {
    emptyCatalogFilters,
    catalogSortOptions,
    matchCatalog,
    normalizeCatalogBudget,
    type CatalogFilters,
    type CatalogPanel,
    type CatalogItem,
  } from "#lib/data/mobile-catalog.ts";

  let {
    open = $bindable(false),
    draft = $bindable({ ...emptyCatalogFilters }),
    panel = $bindable("filters"),
    items,
    productMode = false,
    compact = false,
    onapply,
  }: {
    open?: boolean;
    draft?: CatalogFilters;
    panel?: CatalogPanel;
    items: readonly CatalogItem[];
    productMode?: boolean;
    compact?: boolean;
    onapply: (filters: CatalogFilters) => void;
  } = $props();

  const noun = $derived(
    productMode
      ? locale.t("catalog.products")
      : locale.t("navigation.vehicles").toLocaleLowerCase(),
  );
  const title = $derived(
    {
      search: locale.t("catalog.search"),
      filters: locale.t("action.filters"),
      make: locale.t("catalog.make"),
      model: locale.t("catalog.model"),
      budget: locale.t("catalog.budget"),
      sort: locale.t("catalog.sort"),
    }[panel],
  );
  const label = $derived(
    panel === "filters"
      ? productMode
        ? locale.t("ui.catalog-filter-sheet.product-filters")
        : locale.t("ui.catalog-filter-sheet.vehicle-filters")
      : title,
  );
  const makes = $derived(
    [...new Set(items.map((item) => item.title.split(" ")[0]))].sort(),
  );
  const models = $derived(
    [
      ...new Set(
        items
          .filter((item) => item.title.startsWith(draft.make + " "))
          .map((item) => item.title.slice(draft.make.length + 1)),
      ),
    ].sort(),
  );
  const previewCount = $derived(matchCatalog(items, draft).length);
  const budgetError = $derived(
    normalizeCatalogBudget(draft.budget) === undefined
      ? locale.t("catalog.budgetError")
      : "",
  );
  const editor = $derived(!productMode && !compact);
  const panelShortcuts = $derived([
    { value: "filters", label: locale.t("ui.catalog-filter-sheet.filters") },
    { value: "make", label: locale.t("ui.catalog-filter-sheet.make") },
    { value: "model", label: locale.t("ui.catalog-filter-sheet.model") },
    { value: "budget", label: locale.t("ui.catalog-filter-sheet.budget") },
  ] as const);
  const id = $props.id();
  let budgetInput: HTMLInputElement | undefined = $state();

  function selectMake(make: string) {
    draft = { ...draft, make, model: "" };
  }

  function reset() {
    if (panel === "search") draft = { ...draft, q: "", make: "", model: "" };
    else if (panel === "make") draft = { ...draft, make: "", model: "" };
    else if (panel === "model") draft = { ...draft, model: "" };
    else if (panel === "budget") draft = { ...draft, budget: "" };
    else if (panel === "sort") draft = { ...draft, sort: "" };
    else draft = { ...emptyCatalogFilters, sort: draft.sort };
  }

  async function apply() {
    const budget = normalizeCatalogBudget(draft.budget);
    if (budget === undefined) {
      if (!["filters", "budget"].includes(panel)) panel = "budget";
      await tick();
      budgetInput?.focus();
      return;
    }
    open = false;
    onapply({ ...draft, budget });
  }
</script>

{#snippet budgetField()}
  <div class="mobile-budget-field"
    ><label
      >{locale.t(
        dealer.businessPreview || productMode
          ? "catalog.maximumPrice"
          : "catalog.maximumDaily",
      )} ({currency})
      <input
        type="text"
        inputmode="decimal"
        placeholder={locale.t("ui.catalog-filter-sheet.any-price")}
        bind:value={draft.budget}
        bind:this={budgetInput}
        aria-invalid={!!budgetError}
        aria-describedby={budgetError ? id + "-budget-error" : undefined}
      />
    </label>
    {#if budgetError}<p
        class="mobile-budget-error"
        id={id + "-budget-error"}
        role="status">{budgetError}</p
      >{/if}
  </div>
{/snippet}

{#snippet vehicleShortcuts()}
  <MobilePillRail
    class="mobile-catalog-panel-tabs"
    label={locale.t("ui.catalog-filter-sheet.vehicle-search-options")}
  >
    {#each panelShortcuts as shortcut (shortcut.value)}
      <MobilePill
        label={shortcut.label}
        selected={panel === shortcut.value}
        pressed={panel === shortcut.value}
        onclick={() => (panel = shortcut.value)}
      />
    {/each}
  </MobilePillRail>
{/snippet}

{#snippet filterShortcut(
  target: "make" | "model",
  heading: string,
  value: string,
)}
  <button
    class="mobile-choice-row mobile-filter-shortcut"
    type="button"
    onclick={() => (panel = target)}
  >
    <span><strong>{heading}</strong><span>{value}</span></span>
    <MobileIcon name="arrow-right" />
  </button>
{/snippet}

{#snippet sheetBody()}
  {#if open}
    <form
      {id}
      onsubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <div class="mobile-filter-body">
        {#if editor}{@render vehicleShortcuts()}{/if}
        {#if panel === "filters" || panel === "search"}
          <MobileSearchField
            label={productMode
              ? locale.t("ui.catalog-filter-sheet.product-name")
              : locale.t("ui.catalog-filter-sheet.make-or-model")}
            placeholder={locale.t("catalog.searchEntities", { entity: noun })}
            bind:value={draft.q}
          />
          {#if !productMode}
            {@render filterShortcut(
              "make",
              locale.t("catalog.make"),
              draft.make || locale.t("catalog.allMakes"),
            )}
            {@render filterShortcut(
              "model",
              locale.t("catalog.model"),
              draft.make
                ? draft.model || locale.t("catalog.allModels")
                : locale.t("catalog.makeFirst"),
            )}
          {/if}
          {#if panel === "filters"}{@render budgetField()}{/if}
        {:else if panel === "make"}
          <MobileChoicePicker
            label={locale.t("ui.catalog-filter-sheet.vehicle-make")}
            searchLabel={locale.t("catalog.searchMakes")}
            allLabel={locale.t("catalog.allMakes")}
            emptyLabel={locale.t("catalog.noMakes")}
            options={makes.map((make) => ({ value: make, label: make }))}
            bind:value={draft.make}
            onselect={selectMake}
          />
        {:else if panel === "model"}
          {#if draft.make}
            <p class="mobile-choice-context"
              >{locale.t("ui.catalog-filter-sheet.models-for")} {draft.make}</p
            >
            <MobileChoicePicker
              label={locale.t("ui.catalog-filter-sheet.vehicle-model")}
              searchLabel={locale.t("catalog.searchModels")}
              allLabel={locale.t("catalog.allModels")}
              emptyLabel={locale.t("catalog.noModels")}
              options={models.map((model) => ({ value: model, label: model }))}
              bind:value={draft.model}
            />
          {:else}
            <div class="mobile-choice-prerequisite">
              <p
                >{locale.t(
                  "ui.catalog-filter-sheet.choose-a-make-to-see-its-models",
                )}</p
              >
              <MobilePill
                label={locale.t("ui.catalog-filter-sheet.choose-a-make")}
                onclick={() => (panel = "make")}
              />
            </div>
          {/if}
        {:else if panel === "budget"}
          {@render budgetField()}
        {:else}
          <fieldset class="mobile-sort-options">
            <legend class="visually-hidden"
              >{locale.t("ui.catalog-filter-sheet.sort")} {noun}</legend
            >
            {#each catalogSortOptions as option (option.value)}
              <label class="mobile-choice-row"
                ><span>{locale.t(option.labelKey)}</span><input
                  type="radio"
                  name={id + "-sort"}
                  value={option.value}
                  bind:group={draft.sort}
                /></label
              >
            {/each}
          </fieldset>
        {/if}
      </div>
    </form>
  {/if}
{/snippet}

{#snippet sheetFooter()}
  <button type="button" onclick={reset}
    >{locale.t("ui.catalog-filter-sheet.reset")}</button
  >
  <button class="mobile-filter-apply" type="submit" form={id}
    >{locale.t("catalog.showCount", {
      count: locale.count(previewCount, productMode ? "products" : "vehicles"),
    })}</button
  >
{/snippet}

<MobileSheet
  bind:open
  {title}
  {label}
  class={editor ? "mobile-catalog-editor" : ""}
  children={sheetBody}
  footer={sheetFooter}
/>
