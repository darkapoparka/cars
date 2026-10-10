<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Attachment } from "svelte/attachments";
  import { dealer } from "#lib/content.ts";
  import {
    desktopCatalogFilterKeys,
    desktopCatalogFilterMessageKeys,
    desktopCatalogFilterValue,
    matchDesktopCatalog,
    readDesktopCatalogFilters,
    type DesktopCatalogFilters,
    type TypedCatalogItem,
  } from "#lib/data/desktop-catalog.ts";
  import {
    clearDesktopFilterPane,
    desktopFilterChoices,
    desktopFilterGroups,
    desktopFilterPaneKeys,
    desktopFilterPaneMessageKeys,
    removeDesktopFilterSelection,
    selectDesktopFilterMake,
    selectDesktopFilterType,
    type DesktopFilterPane,
  } from "#lib/data/desktop-catalog-modal.ts";
  import { ownCatalogDialog, containCatalogTab } from "./catalog-dialog.ts";
  import VehicleFilterArtwork from "./VehicleFilterArtwork.svelte";

  let {
    id,
    items,
    filters,
    onapply,
    onclose,
  }: {
    id: string;
    items: readonly (TypedCatalogItem & { pricePeriod?: string })[];
    filters: DesktopCatalogFilters;
    onapply: (filters: DesktopCatalogFilters) => void;
    onclose: () => void;
  } = $props();

  let draft = $derived({ ...filters });
  let pane = $state<DesktopFilterPane>("make");
  let makeSearch = $state("");
  let modelSearch = $state("");
  const focusModelSearch: Attachment<HTMLInputElement> = (node) => {
    node.focus({ preventScroll: true });
  };
  const normalized = $derived(
    readDesktopCatalogFilters(new URLSearchParams(Object.entries(draft))),
  );
  const count = $derived(matchDesktopCatalog(items, normalized).length);
  const selected = $derived(
    desktopCatalogFilterKeys.filter((key) => normalized[key]),
  );
  const makes = $derived(desktopFilterChoices(items, normalized, "make"));
  const models = $derived(desktopFilterChoices(items, normalized, "model"));
  const types = $derived(desktopFilterChoices(items, normalized, "type"));
  const choices = $derived(
    pane === "fuel" || pane === "transmission" || pane === "minSeats"
      ? desktopFilterChoices(items, normalized, pane)
      : [],
  );
  const currency = $derived(items[0]?.price.match(/^[^\d\s]+/)?.[0] ?? "$");
  const pricePeriod = $derived(
    items.length &&
      items.every((item) => item.pricePeriod === items[0].pricePeriod)
      ? items[0].pricePeriod
      : "",
  );
  const prices = $derived(
    items
      .map((item) => Number(item.price.replace(/[^\d.]/g, "")))
      .filter((value) => value > 0 && Number.isFinite(value))
      .sort((a, b) => a - b),
  );
  const budgets = $derived.by(() => {
    if (!prices.length) return [];
    const maximum = prices.at(-1)!;
    const step = Math.pow(10, Math.floor(Math.log10(maximum))) / 4;
    return [
      ...new Set(
        [0.25, 0.5, 0.75].map(
          (fraction) =>
            Math.ceil(
              prices[Math.floor((prices.length - 1) * fraction)] / step,
            ) * step,
        ),
      ),
    ].filter((value) => value < maximum);
  });
  const priceError = $derived(
    normalized.minPrice &&
      normalized.budget &&
      Number(normalized.minPrice) > Number(normalized.budget)
      ? locale.t("catalog.priceError")
      : "",
  );
  const paneCount = $derived(
    desktopFilterPaneKeys(pane).filter((key) => draft[key]).length,
  );

  function toggleMake(make: string) {
    draft = selectDesktopFilterMake(draft, draft.make === make ? "" : make);
  }
  function showModels(make: string) {
    if (draft.make !== make) draft = selectDesktopFilterMake(draft, make);
    pane = "model";
    modelSearch = "";
  }
  function toggleType(type: string) {
    draft = selectDesktopFilterType(draft, draft.type === type ? "" : type);
  }
  function toggleSpecification(value: string) {
    if (pane !== "fuel" && pane !== "transmission" && pane !== "minSeats")
      return;
    draft = { ...draft, [pane]: draft[pane] === value ? "" : value };
  }
  function reset() {
    draft = {
      ...readDesktopCatalogFilters(new URLSearchParams()),
      sort: draft.sort,
    };
    makeSearch = "";
    modelSearch = "";
  }
  function apply(event: SubmitEvent) {
    event.preventDefault();
    if (!priceError) onapply({ ...normalized });
  }
  function dismissBackdrop(
    event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement },
  ) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      onclose();
  }
  function money(amount: number) {
    return dealer.businessPreview
      ? locale.money(amount, dealer.businessPreview.currency)
      : currency + locale.number(amount);
  }
  function facetCount(next: Partial<DesktopCatalogFilters>) {
    return matchDesktopCatalog(items, { ...normalized, ...next }).length;
  }
</script>

{#snippet searchIcon()}
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"
    ><circle
      cx="8.5"
      cy="8.5"
      r="5.5"
      stroke="currentColor"
      stroke-width="1.5"
    /><path
      d="m12.5 12.5 4 4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    /></svg
  >
{/snippet}
{#snippet checkIcon()}
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"
    ><path
      d="m3 8 3 3 7-7"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{/snippet}
{#snippet closeIcon()}
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"
    ><path
      d="m5 5 10 10M15 5 5 15"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    /></svg
  >
{/snippet}

<dialog
  {id}
  class="desktop-catalog-modal"
  aria-labelledby={id + "-title"}
  {@attach ownCatalogDialog}
  {onclose}
  oncancel={(event) => {
    event.preventDefault();
    onclose();
  }}
  onclick={dismissBackdrop}
  onkeydown={containCatalogTab}
>
  <form onsubmit={apply}>
    <div class="modal-body">
      <nav
        aria-label={locale.t(
          "ui.desktop-catalog-filter-modal.filter-categories",
        )}
        class="modal-navigation"
      >
        <h2 id={id + "-title"} class="desktop-type-panel"
          >{locale.t("ui.desktop-catalog-filter-modal.filters")}</h2
        >
        <button
          class="nav-search desktop-type-control"
          type="button"
          aria-pressed={pane === "search"}
          aria-controls={id + "-pane"}
          onclick={() => (pane = "search")}
        >
          {@render searchIcon()}<span
            >{locale.t("ui.desktop-catalog-filter-modal.search")}</span
          >{#if draft.q}<span class="selection-count desktop-type-badge">1</span
            >{/if}
        </button>
        {#each desktopFilterGroups as group (group.label)}
          <section aria-label={locale.t(group.labelKey)}>
            <h3 class="nav-group-title desktop-type-eyebrow"
              >{locale.t(group.labelKey)}<span aria-hidden="true"></span></h3
            >
            <div class="nav-group">
              {#each group.panes as tab (tab)}
                {@const activeCount = desktopFilterPaneKeys(tab).filter(
                  (key) => draft[key],
                ).length}
                <button
                  type="button"
                  aria-pressed={pane === tab}
                  aria-controls={id + "-pane"}
                  onclick={() => (pane = tab)}
                  class="desktop-type-control"
                >
                  <span>{locale.t(desktopFilterPaneMessageKeys[tab])}</span
                  >{#if activeCount}<span
                      class="selection-count desktop-type-badge"
                      aria-label={`${activeCount} selected`}>{activeCount}</span
                    >{/if}
                </button>
              {/each}
            </div>
          </section>
        {/each}
      </nav>

      <section
        class="modal-panel"
        id={id + "-pane"}
        aria-labelledby={id + "-pane-title"}
      >
        <header>
          <h3 id={id + "-pane-title"} class="desktop-type-panel"
            >{locale.t(desktopFilterPaneMessageKeys[pane])}</h3
          >
          {#if paneCount}<button
              type="button"
              class="section-clear desktop-type-control"
              onclick={() => (draft = clearDesktopFilterPane(draft, pane))}
              >{locale.t("ui.desktop-catalog-filter-modal.clear")}</button
            >{/if}
          <button
            class="dialog-close"
            type="button"
            aria-label={locale.t(
              "ui.desktop-catalog-filter-modal.close-vehicle-filters",
            )}
            onclick={onclose}>{@render closeIcon()}</button
          >
        </header>

        {#if pane === "make"}
          <label class="search-field"
            >{@render searchIcon()}<input
              type="search"
              aria-label={locale.t(
                "ui.desktop-catalog-filter-modal.search-makes",
              )}
              placeholder={locale.t(
                "ui.desktop-catalog-filter-modal.search-makes",
              )}
              bind:value={makeSearch}
              class="desktop-type-body-small"
            /></label
          >
          <button
            type="button"
            class="any-choice desktop-type-control"
            aria-pressed={!draft.make}
            onclick={() => (draft = selectDesktopFilterMake(draft, ""))}
            >{locale.t("ui.desktop-catalog-filter-modal.all-makes")}<span
              class="option-count"
              aria-hidden="true">{facetCount({ make: "", model: "" })}</span
            ></button
          >
          <div
            class="make-options"
            role="group"
            aria-label={locale.t(
              "ui.desktop-catalog-filter-modal.make-choices",
            )}
          >
            {#each makes.filter((choice) => choice.value
                .toLowerCase()
                .includes(makeSearch
                    .trim()
                    .toLowerCase())) as choice (choice.value)}
              <div
                class={[
                  "make-option",
                  draft.make === choice.value && "is-selected",
                ]}
              >
                <button
                  class="make-choice desktop-type-control"
                  type="button"
                  aria-pressed={draft.make === choice.value}
                  onclick={() => toggleMake(choice.value)}
                >
                  <VehicleFilterArtwork value={choice.value} kind="make" /><span
                    class="choice-label">{choice.value}</span
                  ><span class="option-count" aria-hidden="true"
                    >{choice.count}</span
                  >
                  <span class="choice-indicator" aria-hidden="true"
                    >{#if draft.make === choice.value}{@render checkIcon()}{/if}</span
                  >
                </button>
                <button
                  type="button"
                  class="make-models"
                  aria-label={`Choose ${choice.value} models`}
                  onclick={() => showModels(choice.value)}
                  ><svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    ><path
                      d="m6 4 4 4-4 4"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg
                  ></button
                >
              </div>
            {:else}<p class="empty-options" role="status"
                >{locale.t(
                  "ui.desktop-catalog-filter-modal.no-makes-match-this-search",
                )}</p
              >{/each}
          </div>
        {:else if pane === "model"}
          {#if draft.make}
            <div class="model-make"
              ><VehicleFilterArtwork value={draft.make} kind="make" /><strong
                >{draft.make}</strong
              ><button type="button" onclick={() => (pane = "make")}
                >{locale.t(
                  "ui.desktop-catalog-filter-modal.change-make",
                )}</button
              ></div
            >
            <label class="search-field"
              >{@render searchIcon()}<input
                type="search"
                aria-label={locale.t(
                  "ui.desktop-catalog-filter-modal.search-models",
                )}
                placeholder={locale.t(
                  "ui.desktop-catalog-filter-modal.search-models",
                )}
                bind:value={modelSearch}
                {@attach focusModelSearch}
                class="desktop-type-body-small"
              /></label
            >
            <button
              type="button"
              class="any-choice desktop-type-control"
              aria-pressed={!draft.model}
              onclick={() => (draft = { ...draft, model: "" })}
              >{locale.t("ui.desktop-catalog-filter-modal.all")}
              {draft.make}
              {locale.t("ui.desktop-catalog-filter-modal.models")}<span
                class="option-count"
                aria-hidden="true">{facetCount({ model: "" })}</span
              ></button
            >
            <div
              class="choice-options"
              role="group"
              aria-label={locale.t(
                "ui.desktop-catalog-filter-modal.model-choices",
              )}
            >
              {#each models.filter((choice) => choice.value
                  .toLowerCase()
                  .includes(modelSearch
                      .trim()
                      .toLowerCase())) as choice (choice.value)}
                <button
                  class="text-choice desktop-type-control"
                  type="button"
                  aria-pressed={draft.model === choice.value}
                  onclick={() =>
                    (draft = {
                      ...draft,
                      model: draft.model === choice.value ? "" : choice.value,
                    })}
                  ><span class="choice-label">{choice.value}</span><span
                    class="option-count"
                    aria-hidden="true">{choice.count}</span
                  ><span class="choice-indicator" aria-hidden="true"
                    >{#if draft.model === choice.value}{@render checkIcon()}{/if}</span
                  ></button
                >
              {:else}<p class="empty-options" role="status"
                  >{locale.t(
                    "ui.desktop-catalog-filter-modal.no-models-match-this-search",
                  )}</p
                >{/each}
            </div>
          {:else}
            <p class="empty-options"
              >{locale.t(
                "ui.desktop-catalog-filter-modal.choose-a-make-to-see-its-models",
              )}</p
            >
            <div
              class="make-options"
              role="group"
              aria-label={locale.t(
                "ui.desktop-catalog-filter-modal.choose-a-make-for-models",
              )}
            >
              {#each makes as choice (choice.value)}<button
                  class="model-make-choice desktop-type-control"
                  type="button"
                  onclick={() => showModels(choice.value)}
                  ><VehicleFilterArtwork
                    value={choice.value}
                    kind="make"
                  /><span class="choice-label">{choice.value}</span></button
                >{/each}
            </div>
          {/if}
        {:else if pane === "type"}
          <button
            type="button"
            class="any-choice desktop-type-control"
            aria-pressed={!draft.type}
            onclick={() => (draft = selectDesktopFilterType(draft, ""))}
            >{locale.t("ui.desktop-catalog-filter-modal.all-types")}<span
              class="option-count"
              aria-hidden="true"
              >{facetCount({ type: "", make: "", model: "" })}</span
            ></button
          >
          <div
            class="body-options"
            role="group"
            aria-label={locale.t(
              "ui.desktop-catalog-filter-modal.body-type-choices",
            )}
          >
            {#each types as choice (choice.value)}<button
                class="body-choice desktop-type-control"
                type="button"
                aria-pressed={draft.type === choice.value}
                onclick={() => toggleType(choice.value)}
                ><VehicleFilterArtwork value={choice.value} kind="type" /><span
                  >{choice.value}</span
                ><span class="body-count">{locale.count(choice.count)}</span
                ><span class="choice-indicator" aria-hidden="true"
                  >{#if draft.type === choice.value}{@render checkIcon()}{/if}</span
                ></button
              >
            {:else}<p class="empty-options"
                >{locale.t(
                  "ui.desktop-catalog-filter-modal.body-types-are-not-specified-for-this-inventory",
                )}</p
              >{/each}
          </div>
        {:else if pane === "price"}
          <fieldset class="range-fields"
            ><legend
              >{locale.t("ui.desktop-catalog-filter-modal.price")}{pricePeriod
                ? ` ${pricePeriod}`
                : ""}</legend
            >
            <div class="field-pair">
              <label class="filter-field"
                ><span
                  >{locale.t("ui.desktop-catalog-filter-modal.minimum")}</span
                ><span class="amount-field"
                  ><span aria-hidden="true">{currency}</span><input
                    type="number"
                    aria-label={locale.t(
                      "ui.desktop-catalog-filter-modal.minimum-price",
                    )}
                    min="0"
                    step="any"
                    placeholder={locale.t(
                      "ui.desktop-catalog-filter-modal.any",
                    )}
                    value={draft.minPrice}
                    oninput={(event) =>
                      (draft = {
                        ...draft,
                        minPrice: event.currentTarget.value,
                      })}
                    aria-invalid={!!priceError}
                    aria-describedby={priceError
                      ? id + "-price-error"
                      : undefined}
                    class="desktop-type-body-small"
                  /></span
                ></label
              >
              <label class="filter-field"
                ><span
                  >{locale.t("ui.desktop-catalog-filter-modal.maximum")}</span
                ><span class="amount-field"
                  ><span aria-hidden="true">{currency}</span><input
                    type="number"
                    aria-label={locale.t(
                      "ui.desktop-catalog-filter-modal.maximum-price",
                    )}
                    min="0"
                    step="any"
                    placeholder={locale.t(
                      "ui.desktop-catalog-filter-modal.any",
                    )}
                    value={draft.budget}
                    oninput={(event) =>
                      (draft = { ...draft, budget: event.currentTarget.value })}
                    aria-invalid={!!priceError}
                    aria-describedby={priceError
                      ? id + "-price-error"
                      : undefined}
                    class="desktop-type-body-small"
                  /></span
                ></label
              >
            </div>
            {#if priceError}<p
                class="price-error desktop-type-meta"
                id={id + "-price-error"}
                role="status">{priceError}</p
              >{/if}
          </fieldset>
          {#if budgets.length}<fieldset class="preset-group"
              ><legend
                >{locale.t(
                  "ui.desktop-catalog-filter-modal.quick-budgets",
                )}</legend
              ><div class="presets"
                >{#each budgets as amount (amount)}<button
                    type="button"
                    aria-pressed={!draft.minPrice &&
                      draft.budget === String(amount)}
                    onclick={() =>
                      (draft = {
                        ...draft,
                        minPrice: "",
                        budget:
                          draft.budget === String(amount) && !draft.minPrice
                            ? ""
                            : String(amount),
                      })}
                    >{locale.t("ui.desktop-catalog-filter-modal.up-to")}
                    {money(amount)}</button
                  >{/each}</div
              ></fieldset
            >{/if}
        {:else if pane === "maxMileage"}
          <label class="filter-field mileage-field"
            ><span
              >{locale.t(
                "ui.desktop-catalog-filter-modal.maximum-mileage-miles",
              )}</span
            ><input
              type="number"
              min="1"
              step="1"
              placeholder={locale.t(
                "ui.desktop-catalog-filter-modal.any-mileage",
              )}
              value={draft.maxMileage}
              oninput={(event) =>
                (draft = { ...draft, maxMileage: event.currentTarget.value })}
              class="desktop-type-body-small"
            /></label
          >
          <div
            class="presets mileage-presets"
            role="group"
            aria-label={locale.t(
              "ui.desktop-catalog-filter-modal.mileage-limits",
            )}
            >{#each [10000, 25000, 50000, 100000] as mileage (mileage)}<button
                type="button"
                aria-pressed={draft.maxMileage === String(mileage)}
                onclick={() =>
                  (draft = {
                    ...draft,
                    maxMileage:
                      draft.maxMileage === String(mileage)
                        ? ""
                        : String(mileage),
                  })}
                >{locale.t("ui.desktop-catalog-filter-modal.up-to")}
                {mileage.toLocaleString(locale.locale)}
                {locale.t("unit.mi")}</button
              >{/each}</div
          >
        {:else if pane === "search"}
          <label class="search-field"
            >{@render searchIcon()}<input
              type="search"
              aria-label={locale.t(
                "ui.desktop-catalog-filter-modal.search-cars",
              )}
              placeholder={locale.t(
                "ui.desktop-catalog-filter-modal.make-model-or-keyword",
              )}
              value={draft.q}
              oninput={(event) =>
                (draft = { ...draft, q: event.currentTarget.value })}
              class="desktop-type-body-small"
            /></label
          >
        {:else}
          <button
            type="button"
            class="any-choice desktop-type-control"
            aria-pressed={!draft[pane]}
            onclick={() => (draft = clearDesktopFilterPane(draft, pane))}
            >{locale.t("ui.desktop-catalog-filter-modal.any")}
            {pane === "minSeats"
              ? locale.t("ui.desktop-catalog-filter-modal.seats")
              : pane === "transmission"
                ? locale.t("ui.desktop-catalog-filter-modal.transmission")
                : locale.t("ui.desktop-catalog-filter-modal.fuel")}<span
              class="option-count"
              aria-hidden="true"
              >{matchDesktopCatalog(
                items,
                clearDesktopFilterPane(normalized, pane),
              ).length}</span
            ></button
          >
          <div
            class="choice-options"
            role="group"
            aria-label={locale.t(desktopFilterPaneMessageKeys[pane]) +
              " choices"}
          >
            {#each choices as choice (choice.value)}<button
                class="text-choice desktop-type-control"
                type="button"
                aria-pressed={draft[pane] === choice.value}
                onclick={() => toggleSpecification(choice.value)}
                ><span class="choice-label"
                  >{pane === "minSeats"
                    ? `${choice.value}+ seats`
                    : choice.value}</span
                ><span class="option-count" aria-hidden="true"
                  >{choice.count}</span
                ><span class="choice-indicator" aria-hidden="true"
                  >{#if draft[pane] === choice.value}{@render checkIcon()}{/if}</span
                ></button
              >
            {:else}<p class="empty-options"
                >{locale.t(desktopFilterPaneMessageKeys[pane])}
                {locale.t(
                  "ui.desktop-catalog-filter-modal.is-not-specified-for-this-inventory",
                )}</p
              >{/each}
          </div>
        {/if}
      </section>
    </div>

    <footer>
      <button
        class="dialog-reset desktop-type-control"
        type="button"
        onclick={reset}
        >{locale.t("ui.desktop-catalog-filter-modal.clear-all-filters")}</button
      >
      <div
        class="modal-selections"
        role="group"
        aria-label={locale.t(
          "ui.desktop-catalog-filter-modal.selected-vehicle-filters",
        )}
      >
        {#each selected as key (key)}<button
            type="button"
            class="selection-pill"
            aria-label={locale.t("catalog.removeFilter", {
              field: locale.t(desktopCatalogFilterMessageKeys[key]),
            })}
            onclick={() => (draft = removeDesktopFilterSelection(draft, key))}
            ><span
              >{desktopCatalogFilterValue(
                key,
                normalized[key],
                currency,
                locale.locale,
              )}</span
            ><svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              ><path
                d="m4 4 8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg
            ></button
          >{/each}
      </div>
      <button
        class="dialog-apply desktop-type-control"
        type="submit"
        disabled={!!priceError}
        >{priceError
          ? locale.t("catalog.checkPrice")
          : locale.t("catalog.showCount", {
              count: locale.count(count),
            })}</button
      >
      <span
        class="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        >{locale.t(
          count === 1 ? "catalog.matching.one" : "catalog.matching.other",
          { count: locale.number(count) },
        )}</span
      >
    </footer>
  </form>
</dialog>

<style>
  dialog.desktop-catalog-modal {
    position: fixed;
    inset: 0;
    width: 1040px;
    max-width: calc(100vw - 64px);
    height: min(720px, calc(100dvh - 64px));
    max-height: calc(100dvh - 64px);
    margin: auto;
    padding: 0;
    border: 0;
    border-radius: 20px;
    background: var(--bs-neutral-100, #f5f5f5);
    color: var(--bs-neutral-1000, #171717);
    box-shadow: 0 24px 80px rgb(0 0 0 / 18%);
    overflow: hidden;
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 32%);
  }
  form {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  .modal-body {
    display: grid;
    grid-template-columns: 216px minmax(0, 1fr);
    gap: 16px;
    flex: 1;
    min-height: 0;
    padding: 16px 16px 0;
  }
  .modal-navigation {
    min-height: 0;
    padding: 4px 8px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
  }
  h2 {
    margin: 0 4px 16px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
  }
  button,
  input {
    font: inherit;
  }
  button {
    color: inherit;
    cursor: pointer;
  }
  .nav-search,
  .nav-group button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    min-height: 36px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .nav-search {
    justify-content: flex-start;
    min-height: 44px;
    padding: 10px 14px;
    margin-bottom: 20px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
  }
  .nav-search .selection-count {
    margin-left: auto;
  }
  .nav-group-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 8px 8px;
    color: var(--bs-neutral-500, #737373);
    font-size: 11px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .nav-group-title span {
    height: 1px;
    flex: 1;
    background: var(--bs-neutral-200, #e5e5e5);
  }
  .nav-group {
    padding: 4px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
  }
  .nav-group button:hover,
  .nav-search:hover {
    background: var(--bs-neutral-100, #f5f5f5);
  }
  .nav-group button[aria-pressed="true"],
  .nav-search[aria-pressed="true"] {
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
    font-weight: 600;
  }
  .selection-count {
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--bs-neutral-100, #f5f5f5);
    color: var(--bs-neutral-1000, #171717);
    font-size: 11px;
    line-height: 20px;
  }
  .modal-panel {
    min-height: 0;
    min-width: 0;
    padding: 0 24px 24px;
    border-radius: 16px;
    background: var(--bs-background-card, #fff);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scroll-padding-block: 84px 16px;
  }
  header {
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 1;
    min-height: 76px;
    margin-bottom: 8px;
    background: var(--bs-background-card, #fff);
  }
  header h3 {
    margin: 0 auto 0 0;
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
  }
  .dialog-close {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    flex-shrink: 0;
    border: 1px solid transparent;
    border-radius: 999px;
    background: var(--bs-neutral-100, #f5f5f5);
  }
  .dialog-close:hover {
    border-color: var(--bs-neutral-200, #e5e5e5);
  }
  .section-clear,
  .model-make button {
    border: 0;
    padding: 8px 4px;
    border-radius: 4px;
    background: transparent;
    color: var(--bs-neutral-500, #737373);
    font-size: 13px;
    line-height: 20px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .section-clear:hover,
  .model-make button:hover {
    color: var(--bs-neutral-1000, #171717);
  }
  .search-field {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    margin: 0 0 20px;
    padding: 0 14px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    color: var(--bs-neutral-500, #737373);
  }
  .search-field svg {
    flex-shrink: 0;
  }
  .search-field input {
    width: 100%;
    min-width: 0;
    height: 42px;
    margin: 0;
    padding: 8px 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--bs-neutral-1000, #171717);
    font-size: 14px;
    line-height: 22px;
    box-shadow: none;
  }
  .search-field:focus-within {
    outline: 2px solid var(--bs-neutral-1000, #171717);
    outline-offset: 3px;
  }
  .search-field input:focus-visible {
    outline: none !important;
  }
  input::placeholder {
    color: var(--bs-neutral-500, #737373);
    opacity: 1;
  }
  .make-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .make-option {
    display: flex;
    min-width: 0;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    overflow: hidden;
  }
  .make-option:hover {
    border-color: var(--bs-neutral-500, #737373);
  }
  .make-choice {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    min-height: 62px;
    padding: 12px 0 12px 10px;
    border: 0;
    background: transparent;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .choice-label {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .option-count {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--bs-neutral-500, #737373);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .choice-indicator {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    border: 1px solid var(--bs-neutral-300, #d4d4d4);
    border-radius: 50%;
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-0, #fff);
  }
  .is-selected,
  .text-choice[aria-pressed="true"],
  .body-choice[aria-pressed="true"] {
    border-color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-100, #f5f5f5);
  }
  [aria-pressed="true"] > .choice-indicator {
    border-color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-1000, #171717);
  }
  .make-models {
    display: grid;
    place-items: center;
    width: 28px;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--bs-neutral-500, #737373);
  }
  .make-models:hover {
    color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-200, #e5e5e5);
  }
  .any-choice {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    min-height: 36px;
    margin: 0 0 16px;
    padding: 7px 14px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    font-size: 13px;
    line-height: 20px;
  }
  .any-choice[aria-pressed="true"] {
    border-color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
  }
  .any-choice[aria-pressed="true"] .option-count {
    color: inherit;
  }
  .model-make {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 15px;
    line-height: 24px;
  }
  .model-make button {
    margin-left: auto;
  }
  .model-make-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 62px;
    padding: 12px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }
  .choice-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .text-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 54px;
    padding: 14px 16px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
    font-size: 14px;
    line-height: 22px;
    text-align: left;
  }
  .body-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .body-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    min-height: 142px;
    padding: 16px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
  .body-choice .choice-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  .body-count {
    color: var(--bs-neutral-500, #737373);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
  .text-choice:hover,
  .body-choice:hover,
  .model-make-choice:hover,
  .any-choice:hover {
    border-color: var(--bs-neutral-500, #737373);
  }
  fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  legend {
    float: none;
    width: auto;
    margin: 0 0 16px;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
  .field-pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    font-size: 14px;
    line-height: 22px;
  }
  .filter-field input {
    width: 100%;
    min-width: 0;
    height: 48px;
    margin: 0;
    padding: 12px 14px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 12px;
    background: var(--bs-background-card, #fff);
    color: inherit;
    font-size: 14px;
    line-height: 22px;
    box-shadow: none;
  }
  .amount-field {
    position: relative;
  }
  .amount-field > span {
    position: absolute;
    left: 14px;
    top: 13px;
    color: var(--bs-neutral-500, #737373);
  }
  .amount-field input {
    padding-left: 32px;
  }
  .preset-group {
    margin-top: 32px;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .presets button {
    min-height: 40px;
    padding: 9px 16px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    font-size: 14px;
    line-height: 20px;
  }
  .presets button[aria-pressed="true"] {
    border-color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
  }
  .mileage-field {
    max-width: 320px;
  }
  .mileage-presets {
    margin-top: 24px;
  }
  .price-error {
    margin: 12px 0 0;
    color: #9f2929;
    font-size: 13px;
    line-height: 20px;
  }
  .empty-options {
    grid-column: 1 / -1;
    margin: 0 0 20px;
    color: var(--bs-neutral-500, #737373);
    font-size: 14px;
    line-height: 22px;
  }
  footer {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
    min-height: 80px;
    padding: 16px 24px;
  }
  .dialog-reset,
  .dialog-apply {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 10px 20px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    white-space: nowrap;
  }
  .dialog-reset:hover {
    border-color: var(--bs-neutral-500, #737373);
  }
  .dialog-apply {
    border-color: var(--bs-neutral-1000, #171717);
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
  }
  .dialog-apply:hover {
    border-color: #333;
    background: #333;
  }
  .dialog-apply:disabled {
    background: var(--bs-neutral-200, #e5e5e5);
    border-color: var(--bs-neutral-200, #e5e5e5);
    color: var(--bs-neutral-500, #737373);
    cursor: default;
  }
  .modal-selections {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 4px;
    margin: -4px;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .selection-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    max-width: 220px;
    min-height: 34px;
    padding: 6px 12px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    font-size: 13px;
    line-height: 20px;
  }
  .selection-pill span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .selection-pill svg {
    flex-shrink: 0;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--bs-neutral-1000, #171717) !important;
    outline-offset: 3px;
  }
  .nav-group button:focus-visible,
  .make-choice:focus-visible,
  .make-models:focus-visible {
    outline-offset: -3px;
  }
  @media (max-width: 1199.98px) {
    .make-options {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .modal-body {
      grid-template-columns: 196px minmax(0, 1fr);
    }
  }

  @media (min-width: 992px) {
    dialog.desktop-catalog-modal {
      border-radius: var(--karento-desktop-card-radius);
    }
    .modal-body {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-gap) var(--karento-desktop-card-gap) 0;
    }
    .modal-panel {
      padding: 0 var(--karento-desktop-panel-padding)
        var(--karento-desktop-panel-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
    header {
      gap: var(--karento-desktop-card-gap);
    }
    .nav-search {
      min-height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .search-field {
      min-height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-pill-radius);
    }
    .make-option,
    .model-make-choice,
    .text-choice,
    .body-choice {
      border-radius: var(--karento-desktop-control-radius);
    }
    .field-pair {
      gap: var(--karento-desktop-card-gap);
    }
    .filter-field input {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .presets {
      gap: var(--karento-desktop-space-2);
    }
    .presets button,
    .any-choice,
    .dialog-close,
    .dialog-apply,
    .selection-pill {
      border-radius: var(--karento-desktop-pill-radius);
    }
    footer {
      padding: var(--karento-desktop-card-gap)
        var(--karento-desktop-panel-padding);
      gap: var(--karento-desktop-space-5);
    }
    .dialog-apply {
      min-height: var(--karento-desktop-control-height);
    }
    .modal-selections {
      gap: var(--karento-desktop-space-2);
      padding: var(--karento-desktop-space-1);
    }
  }
</style>
