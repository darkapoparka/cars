<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { tick } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import MobileSearchField from "#lib/components/mobile/MobileSearchField.svelte";
  import MobileChoicePicker from "#lib/components/mobile/MobileChoicePicker.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { normalizeCatalogBudget } from "#lib/data/mobile-catalog.ts";
  import {
    discoveryBrands,
    discoveryModels,
    discoveryModelLabel,
    discoveryPanels,
    discoveryYears,
    discoveryText,
    discoveryDestination,
    discoveryYearLabel,
    emptyDiscoveryFilters,
    searchCars,
    type DiscoveryFilters,
    type DiscoveryPanel,
  } from "./discovery.ts";

  let {
    query = "",
    filters = emptyDiscoveryFilters,
  }: { query?: string; filters?: DiscoveryFilters } = $props();
  const locale = useLocale();
  const id = $props.id();
  let open = $state(false);
  let panel = $state<"search" | DiscoveryPanel>("search");
  let draftQuery = $state("");
  let draft = $state<DiscoveryFilters>({ ...emptyDiscoveryFilters });
  let showBudgetError = $state(false);
  let budgetInput: HTMLInputElement | undefined;
  let pickerForm: HTMLFormElement | undefined;
  let backButton: HTMLButtonElement | undefined;
  const ownBack: Attachment<HTMLButtonElement> = (node) => {
    backButton = node;
    return () => {
      backButton = undefined;
    };
  };
  const ownPicker: Attachment<HTMLFormElement> = (node) => {
    pickerForm = node;
    return () => {
      pickerForm = undefined;
    };
  };
  const ownBudget: Attachment<HTMLInputElement> = (node) => {
    budgetInput = node;
    return () => {
      budgetInput = undefined;
    };
  };
  const normalizedBudget = $derived(normalizeCatalogBudget(draft.priceMax));
  const budgetInvalid = $derived(
    showBudgetError && normalizedBudget === undefined,
  );
  const previewCount = $derived(searchCars(draftQuery, draft).length);
  const makeMatches = $derived(
    searchCars(draftQuery, { ...draft, make: "", model: "" }),
  );
  const modelMatches = $derived(
    searchCars(draftQuery, { ...draft, model: "" }),
  );
  const makeOptions = $derived(
    discoveryBrands.map((make) => ({
      value: make,
      label:
        make +
        " · " +
        locale.number(makeMatches.filter((car) => car.make === make).length),
    })),
  );
  const modelOptions = $derived(
    discoveryModels(draft.make).map((model) => ({
      ...model,
      label:
        model.label +
        " · " +
        locale.number(
          modelMatches.filter((car) => car.title === model.value).length,
        ),
    })),
  );
  const title = $derived(discoveryText(locale.locale, panel));
  const selectedChoices = $derived({
    make: !!draft.make,
    model: !!draft.model,
    price: !!draft.priceMax,
    year: !!(draft.yearFrom || draft.yearTo),
  });
  const choiceValues = $derived({
    make: draft.make || discoveryText(locale.locale, "anyBrand"),
    model:
      discoveryModelLabel(draft.make, draft.model) ||
      discoveryText(locale.locale, "anyModel"),
    price: draft.priceMax
      ? normalizedBudget
        ? discoveryText(locale.locale, "upTo") +
          " " +
          locale.money(Number(normalizedBudget), "EUR")
        : draft.priceMax
      : discoveryText(locale.locale, "anyBudget"),
    year:
      discoveryYearLabel(draft, locale.locale) ||
      discoveryText(locale.locale, "anyYear"),
  });
  const appliedSummary = $derived(
    [
      query.trim(),
      filters.make,
      discoveryModelLabel(filters.make, filters.model),
      filters.priceMax
        ? discoveryText(locale.locale, "upTo") +
          " " +
          locale.money(Number(filters.priceMax), "EUR")
        : "",
      discoveryYearLabel(filters, locale.locale),
    ]
      .filter(Boolean)
      .join(" · "),
  );
  const context = $derived(
    [
      draft.make,
      discoveryModelLabel(draft.make, draft.model),
      normalizedBudget
        ? discoveryText(locale.locale, "upTo") +
          " " +
          locale.money(Number(normalizedBudget), "EUR")
        : "",
      discoveryYearLabel(draft, locale.locale),
      draftQuery.trim(),
    ]
      .filter(Boolean)
      .join(" · "),
  );

  export function openSearch(nextPanel: "search" | DiscoveryPanel = "search") {
    draftQuery = query;
    draft = { ...filters };
    panel = nextPanel;
    showBudgetError = false;
    open = true;
  }

  async function selectMake(make: string) {
    draft = { ...draft, make, model: "" };
    if (make) {
      await showPanel("model");
    } else {
      await showOverview("make");
    }
  }

  async function showPanel(next: DiscoveryPanel) {
    panel = next;
    await tick();
    if (open && panel === next) backButton?.focus({ preventScroll: true });
  }

  async function showOverview(restore?: DiscoveryPanel) {
    const previous = restore ?? (panel === "search" ? "make" : panel);
    panel = "search";
    await tick();
    if (open && panel === "search")
      pickerForm
        ?.querySelector<HTMLButtonElement>(`[data-panel="${previous}"]`)
        ?.focus({ preventScroll: true });
  }

  function selectModel(model: string) {
    draft.model = model;
    void showOverview("model");
  }

  function clear() {
    draftQuery = "";
    draft = { ...emptyDiscoveryFilters };
    showBudgetError = false;
  }

  function destination(text: string, selection: DiscoveryFilters) {
    return locale.href(
      discoveryDestination(
        text,
        selection,
        page.url.searchParams,
        page.url.hash,
      ),
    );
  }

  async function apply(event: SubmitEvent) {
    event.preventDefault();
    const budget = normalizeCatalogBudget(draft.priceMax);
    if (budget === undefined) {
      panel = "price";
      showBudgetError = true;
      await tick();
      budgetInput?.focus();
      budgetInput?.scrollIntoView({ block: "nearest" });
      return;
    }
    open = false;
    await goto(destination(draftQuery, { ...draft, priceMax: budget }));
  }
</script>

<button
  type="button"
  class="discovery-search"
  aria-label={discoveryText(locale.locale, "search") +
    (appliedSummary ? ": " + appliedSummary : "")}
  aria-haspopup="dialog"
  aria-expanded={open}
  onclick={() => openSearch()}
>
  <span class="search-label"
    >{query.trim() || discoveryText(locale.locale, "search")}</span
  >
  <span class="search-symbol" aria-hidden="true"
    ><MobileIcon name="search" size={18} /></span
  >
</button>

{#snippet headerBack()}
  <button
    type="button"
    class="search-header-back"
    aria-label={discoveryText(locale.locale, "backSearch")}
    {@attach ownBack}
    onclick={() => showOverview()}
    ><MobileIcon name="arrow-left" size={24} /></button
  >
{/snippet}

<MobileSheet
  bind:open
  {title}
  headerLeading={panel === "search" ? undefined : headerBack}
  description={panel === "search" ? undefined : context || undefined}
  class="discovery-search-sheet mobile-catalog-editor"
>
  {#if open}
    <form
      id={id + "-picker"}
      class="mobile-filter-body search-choices"
      onsubmit={apply}
      {@attach ownPicker}
    >
      {#if panel === "search"}
        <MobileSearchField
          bind:value={draftQuery}
          label={discoveryText(locale.locale, "search")}
          placeholder={discoveryText(locale.locale, "search")}
        />
        <div
          class="search-options"
          role="group"
          aria-label={discoveryText(locale.locale, "filters")}
        >
          {#each discoveryPanels as shortcut (shortcut.id)}
            <button
              type="button"
              class="mobile-choice-row search-option"
              class:has-selection={selectedChoices[shortcut.id]}
              data-panel={shortcut.id}
              aria-label={discoveryText(locale.locale, shortcut.title) +
                ": " +
                choiceValues[shortcut.id]}
              onclick={() => showPanel(shortcut.id)}
            >
              <strong>{discoveryText(locale.locale, shortcut.title)}</strong>
              <span class="search-option-value"
                >{choiceValues[shortcut.id]}</span
              >
              <MobileIcon name="chevron-down" />
            </button>
          {/each}
        </div>
      {/if}
      {#if panel === "make"}
        <MobileChoicePicker
          label={discoveryText(locale.locale, "make")}
          searchLabel={discoveryText(locale.locale, "findMake")}
          allLabel={discoveryText(locale.locale, "anyBrand")}
          emptyLabel={discoveryText(locale.locale, "noOptions")}
          options={makeOptions}
          bind:value={draft.make}
          onselect={selectMake}
        />
      {:else if panel === "model"}
        {#if draft.make}
          <p class="picker-context"
            >{discoveryText(locale.locale, "modelContext")} {draft.make}</p
          >
          <MobileChoicePicker
            label={discoveryText(locale.locale, "model")}
            searchLabel={discoveryText(locale.locale, "findModel")}
            allLabel={discoveryText(locale.locale, "anyModel")}
            emptyLabel={discoveryText(locale.locale, "noOptions")}
            options={modelOptions}
            bind:value={draft.model}
            onselect={selectModel}
          />
        {:else}
          <div class="make-prerequisite">
            <p>{discoveryText(locale.locale, "makeFirst")}</p>
            <MobilePill
              label={discoveryText(locale.locale, "chooseMake")}
              onclick={() => showPanel("make")}
            />
          </div>
        {/if}
      {:else if panel === "price"}
        <section class="budget-section">
          <h3>{discoveryText(locale.locale, "budget")}</h3>
          <div
            class="budget-choices"
            role="group"
            aria-label={discoveryText(locale.locale, "budget")}
          >
            <MobilePill
              label={discoveryText(locale.locale, "anyBudget")}
              selected={!draft.priceMax}
              pressed={!draft.priceMax}
              onclick={() => {
                draft.priceMax = "";
                showBudgetError = false;
              }}
            />
            {#each [10000, 20000, 30000, 50000] as amount (amount)}
              <MobilePill
                label={locale.money(amount, "EUR")}
                selected={Number(normalizedBudget) === amount}
                pressed={Number(normalizedBudget) === amount}
                onclick={() => {
                  draft.priceMax = String(amount);
                  showBudgetError = false;
                }}
              />
            {/each}
          </div>
          <div class="budget-field">
            <label for={id + "-budget"}
              >{discoveryText(locale.locale, "maximumPrice")}</label
            >
            <input
              id={id + "-budget"}
              type="text"
              inputmode="decimal"
              autocomplete="off"
              {@attach ownBudget}
              bind:value={draft.priceMax}
              placeholder={discoveryText(locale.locale, "anyBudget")}
              aria-invalid={budgetInvalid}
              aria-describedby={budgetInvalid
                ? id + "-budget-error"
                : undefined}
            />
            {#if budgetInvalid}<p
                id={id + "-budget-error"}
                class="budget-error"
                role="alert">{discoveryText(locale.locale, "budgetError")}</p
              >{/if}
          </div>
        </section>
      {:else if panel === "year"}
        <section class="year-section">
          <h3>{discoveryText(locale.locale, "yearRange")}</h3>
          <div class="year-fields">
            <div class="year-field">
              <label for={id + "-year-from"}
                >{discoveryText(locale.locale, "yearFrom")}</label
              >
              <select id={id + "-year-from"} bind:value={draft.yearFrom}>
                <option value=""
                  >{discoveryText(locale.locale, "anyYear")}</option
                >
                {#each discoveryYears as year (year)}
                  <option
                    value={String(year)}
                    disabled={!!draft.yearTo && year > Number(draft.yearTo)}
                    >{year}</option
                  >
                {/each}
              </select>
            </div>
            <div class="year-field">
              <label for={id + "-year-to"}
                >{discoveryText(locale.locale, "yearTo")}</label
              >
              <select id={id + "-year-to"} bind:value={draft.yearTo}>
                <option value=""
                  >{discoveryText(locale.locale, "anyYear")}</option
                >
                {#each discoveryYears as year (year)}
                  <option
                    value={String(year)}
                    disabled={!!draft.yearFrom && year < Number(draft.yearFrom)}
                    >{year}</option
                  >
                {/each}
              </select>
            </div>
          </div>
          <div
            class="year-shortcuts"
            role="group"
            aria-label={discoveryText(locale.locale, "yearRange")}
          >
            <MobilePill
              label={discoveryText(locale.locale, "anyYear")}
              selected={!draft.yearFrom && !draft.yearTo}
              pressed={!draft.yearFrom && !draft.yearTo}
              onclick={() => {
                draft.yearFrom = "";
                draft.yearTo = "";
              }}
            />
            <MobilePill
              label={discoveryText(locale.locale, "newer")}
              selected={draft.yearFrom === "2020" && !draft.yearTo}
              pressed={draft.yearFrom === "2020" && !draft.yearTo}
              onclick={() => {
                draft.yearFrom = "2020";
                draft.yearTo = "";
              }}
            />
          </div>
        </section>
      {/if}
      <p class="visually-hidden" role="status" aria-live="polite"
        >{locale.count(previewCount)}</p
      >
    </form>
  {/if}
  {#snippet footer()}
    <button type="button" onclick={clear}
      >{discoveryText(locale.locale, "clearAll")}</button
    >
    <button type="submit" form={id + "-picker"} class="show-cars">
      <MobileIcon name="search" />
      {discoveryText(locale.locale, "showCars")}
      <span class="result-count">{locale.number(previewCount)}</span>
    </button>
  {/snippet}
</MobileSheet>

<style>
  @media (max-width: 767.98px) {
    :global(.discovery-search-sheet.mobile-catalog-editor > header > button) {
      display: grid;
      place-items: center;
      position: relative;
      isolation: isolate;
      /* Align the icon with the content inset, preserving its 44px hit area. */
      margin-inline: calc((24px - var(--karento-touch-target)) / 2);
      padding: 0;
      background: transparent;
      color: var(--bs-neutral-1000);
      cursor: pointer;
    }
    :global(.discovery-search-sheet > header > button::before) {
      content: "";
      position: absolute;
      inset: var(--karento-space-1);
      z-index: -1;
      border-radius: inherit;
      pointer-events: none;
    }
    :global(.discovery-search-sheet > header > button > svg) {
      width: 24px;
      height: 24px;
    }
    :global(.discovery-search-sheet > header > button:active::before),
    :global(.discovery-search-sheet > header > button:focus-visible::before) {
      background: var(--bs-neutral-100);
    }
    :global(
      .discovery-search-sheet.mobile-catalog-editor
        > header
        > button:focus-visible
    ) {
      outline: 2px solid currentColor !important;
      outline-offset: calc(-1 * var(--karento-space-1));
    }
  }
  @media (max-width: 767.98px) and (hover: hover) {
    :global(.discovery-search-sheet > header > button:hover::before) {
      background: var(--bs-neutral-100);
    }
  }
  .discovery-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--karento-space-3);
    min-width: 0;
    width: 100%;
    min-height: var(--karento-control-field);
    padding: var(--karento-space-1) var(--karento-space-2)
      var(--karento-space-1) var(--karento-space-4);
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-radius-pill);
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: var(--karento-type-field-size);
    font-weight: var(--karento-type-field-weight);
    line-height: var(--karento-type-field-leading);
    text-align: left;
    box-shadow: 0 var(--karento-space-2) var(--karento-space-6) rgb(0 0 0 / 8%);
    cursor: pointer;
  }
  .search-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search-symbol {
    display: grid;
    place-items: center;
    flex: 0 0 var(--karento-space-8);
    width: var(--karento-space-8);
    height: var(--karento-space-8);
    border-radius: var(--karento-radius-pill);
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  .discovery-search:focus-visible {
    outline: 2px solid var(--karento-accent);
    outline-offset: 2px;
  }
  .search-options {
    display: grid;
    gap: var(--karento-space-2);
  }
  .search-options .search-option {
    width: 100%;
    font: inherit;
    font-size: var(--karento-type-control-size);
    font-weight: var(--karento-type-control-weight);
    line-height: var(--karento-type-control-leading);
    text-align: left;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    cursor: pointer;
  }
  .search-option-value {
    flex: 1;
    min-width: 0;
    color: var(--bs-neutral-500);
    font-weight: var(--karento-type-field-weight);
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search-option :global(svg) {
    flex: 0 0 var(--karento-control-icon);
    transform: rotate(-90deg);
  }
  .search-option.has-selection .search-option-value {
    color: var(--bs-neutral-1000);
  }
  .search-choices {
    gap: var(--karento-space-4);
  }
  h3 {
    margin: 0 0 var(--karento-space-2);
    font-size: var(--karento-type-panel-size);
    font-weight: var(--karento-type-panel-weight);
    line-height: var(--karento-type-panel-leading);
  }
  .picker-context,
  .make-prerequisite p,
  .budget-error {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: var(--karento-type-body-small-size);
    font-weight: var(--karento-type-body-small-weight);
    line-height: var(--karento-type-body-small-leading);
  }
  .budget-error {
    color: var(--bs-neutral-1000);
  }
  .make-prerequisite {
    display: grid;
    justify-items: start;
    gap: var(--karento-space-3);
  }
  .budget-choices,
  .year-shortcuts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--karento-space-1) var(--karento-space-2);
  }
  .budget-field {
    display: grid;
    gap: var(--karento-space-2);
    margin-top: var(--karento-space-3);
  }
  .year-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--karento-space-3);
  }
  .year-field {
    display: grid;
    gap: var(--karento-space-2);
    min-width: 0;
  }
  .year-shortcuts {
    margin-top: var(--karento-space-2);
  }
  :global(.discovery-search-sheet footer) .show-cars {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--karento-space-2);
    border-color: var(--bs-neutral-1000);
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  .result-count {
    min-width: var(--karento-control-line);
    padding-inline: var(--karento-space-1);
    border-radius: var(--karento-radius-pill);
    background: rgb(255 255 255 / 18%);
  }
</style>
