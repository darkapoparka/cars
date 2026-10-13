<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { ownCatalogDialog, containCatalogTab } from "./catalog-dialog.ts";
  import {
    selectDesktopFilterMake,
    selectDesktopFilterType,
  } from "#lib/data/desktop-catalog-modal.ts";
  import { compareBodyTypes } from "#lib/data/body-type-artwork.ts";
  import {
    matchDesktopCatalog,
    readDesktopCatalogFilters,
    vehicleBodyType,
    type DesktopCatalogFilters,
    type TypedCatalogItem,
  } from "#lib/data/desktop-catalog.ts";

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
  const normalized = $derived(
    readDesktopCatalogFilters(new URLSearchParams(Object.entries(draft))),
  );
  const previewCount = $derived(matchDesktopCatalog(items, normalized).length);
  const types = $derived(
    [...new Set(items.map(vehicleBodyType).filter(Boolean))].sort(
      compareBodyTypes,
    ),
  );
  const typeItems = $derived(
    items.filter((item) => !draft.type || vehicleBodyType(item) === draft.type),
  );
  const makes = $derived(
    [...new Set(typeItems.map((item) => item.title.split(" ")[0]))].sort(),
  );
  const models = $derived(
    [
      ...new Set(
        typeItems
          .filter((item) => item.title.startsWith(draft.make + " "))
          .map((item) => item.title.slice(draft.make.length + 1)),
      ),
    ].sort(),
  );
  const fuels = $derived(
    [
      ...new Set(
        items
          .map((item) => item.fuel?.trim())
          .filter((value): value is string => !!value),
      ),
    ].sort(),
  );
  const transmissions = $derived(
    [
      ...new Set(
        items
          .map((item) => item.transmission?.trim())
          .filter((value): value is string => !!value),
      ),
    ].sort(),
  );
  const currency = $derived(items[0]?.price.match(/^[^\d\s]+/)?.[0] ?? "$");
  const pricePeriod = $derived(
    items.length &&
      items.every((item) => item.pricePeriod === items[0].pricePeriod)
      ? items[0].pricePeriod
      : "",
  );
  const priceError = $derived(
    normalized.minPrice &&
      normalized.budget &&
      Number(normalized.minPrice) > Number(normalized.budget)
      ? locale.t("catalog.priceError")
      : "",
  );

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

  function selectType(type: string) {
    draft = selectDesktopFilterType(draft, type);
  }

  function selectMake(make: string) {
    draft = selectDesktopFilterMake(draft, make);
  }

  function reset() {
    draft = {
      ...readDesktopCatalogFilters(new URLSearchParams()),
      sort: draft.sort,
    };
  }

  function apply(event: SubmitEvent) {
    event.preventDefault();
    if (!priceError) onapply({ ...normalized });
  }
</script>

<dialog
  {id}
  class="desktop-catalog-dialog"
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
    <header>
      <h2 id={id + "-title"} class="desktop-type-panel"
        >{locale.t("ui.desktop-catalog-filter-dialog.filters")}</h2
      >
      <button
        class="dialog-close"
        type="button"
        aria-label={locale.t(
          "ui.desktop-catalog-filter-dialog.close-vehicle-filters",
        )}
        onclick={onclose}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          ><path
            d="m5 5 10 10M15 5 5 15"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          /></svg
        >
      </button>
    </header>

    <div class="dialog-body">
      <label class="filter-field desktop-type-label">
        <span>{locale.t("ui.desktop-catalog-filter-dialog.search")}</span>
        <span class="keyword-field">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
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
          <input
            type="search"
            placeholder={locale.t(
              "ui.desktop-catalog-filter-dialog.make-model-or-keyword",
            )}
            value={draft.q}
            oninput={(event) =>
              (draft = { ...draft, q: event.currentTarget.value })}
            class="desktop-type-body-small"
          />
        </span>
      </label>

      <fieldset class="type-field">
        <legend class="desktop-type-label"
          >{locale.t("ui.desktop-catalog-filter-dialog.body-type")}</legend
        >
        <div class="type-options">
          {#each ["", ...types] as type (type)}
            <label class="type-choice">
              <input
                type="radio"
                name={id + "-type"}
                value={type}
                checked={draft.type === type}
                onchange={() => selectType(type)}
              />
              <span class="desktop-type-pill"
                >{type ||
                  locale.t("ui.desktop-catalog-filter-dialog.all-types")}</span
              >
            </label>
          {/each}
        </div>
      </fieldset>

      <div class="field-pair">
        <label class="filter-field desktop-type-label">
          <span>{locale.t("ui.desktop-catalog-filter-dialog.make")}</span>
          <select
            value={draft.make}
            onchange={(event) => selectMake(event.currentTarget.value)}
            class="desktop-type-body-small"
          >
            <option value=""
              >{locale.t("ui.desktop-catalog-filter-dialog.all-makes")}</option
            >
            {#if draft.make && !makes.includes(draft.make)}<option
                value={draft.make}>{draft.make}</option
              >{/if}
            {#each makes as make (make)}<option value={make}>{make}</option
              >{/each}
          </select>
        </label>
        <label class="filter-field desktop-type-label">
          <span>{locale.t("ui.desktop-catalog-filter-dialog.model")}</span>
          <select
            disabled={!draft.make}
            value={draft.model}
            onchange={(event) =>
              (draft = { ...draft, model: event.currentTarget.value })}
            class="desktop-type-body-small"
          >
            <option value=""
              >{draft.make
                ? locale.t("catalog.allModels")
                : locale.t("catalog.makeFirst")}</option
            >
            {#if draft.model && !models.includes(draft.model)}<option
                value={draft.model}>{draft.model}</option
              >{/if}
            {#each models as model (model)}<option value={model}>{model}</option
              >{/each}
          </select>
        </label>
      </div>

      <fieldset class="price-field">
        <legend class="desktop-type-label"
          >{locale.t(
            "ui.desktop-catalog-filter-dialog.price-range",
          )}{#if pricePeriod}<span class="price-period desktop-type-meta"
              >&nbsp;{pricePeriod}</span
            >{/if}</legend
        >
        <div class="field-pair">
          <label class="filter-field desktop-type-label">
            <span>{locale.t("ui.desktop-catalog-filter-dialog.minimum")}</span>
            <span class="amount-field"
              ><span aria-hidden="true">{currency}</span><input
                aria-label={locale.t(
                  "ui.desktop-catalog-filter-dialog.minimum-price",
                )}
                type="number"
                min="0"
                step="any"
                placeholder={locale.t("ui.desktop-catalog-filter-dialog.any")}
                value={draft.minPrice}
                oninput={(event) =>
                  (draft = { ...draft, minPrice: event.currentTarget.value })}
                aria-invalid={!!priceError}
                aria-describedby={priceError ? id + "-price-error" : undefined}
                class="desktop-type-body-small"
              /></span
            >
          </label>
          <label class="filter-field desktop-type-label">
            <span>{locale.t("ui.desktop-catalog-filter-dialog.maximum")}</span>
            <span class="amount-field"
              ><span aria-hidden="true">{currency}</span><input
                aria-label={locale.t(
                  "ui.desktop-catalog-filter-dialog.maximum-price",
                )}
                type="number"
                min="0"
                step="any"
                placeholder={locale.t("ui.desktop-catalog-filter-dialog.any")}
                value={draft.budget}
                oninput={(event) =>
                  (draft = { ...draft, budget: event.currentTarget.value })}
                aria-invalid={!!priceError}
                aria-describedby={priceError ? id + "-price-error" : undefined}
                class="desktop-type-body-small"
              /></span
            >
          </label>
        </div>
        {#if priceError}<p
            class="price-error desktop-type-meta"
            id={id + "-price-error"}
            role="status">{priceError}</p
          >{/if}
      </fieldset>

      <div class="field-pair specification-fields">
        <label class="filter-field desktop-type-label">
          <span>{locale.t("ui.desktop-catalog-filter-dialog.fuel")}</span>
          <select
            value={draft.fuel}
            onchange={(event) =>
              (draft = { ...draft, fuel: event.currentTarget.value })}
            class="desktop-type-body-small"
          >
            <option value=""
              >{locale.t("ui.desktop-catalog-filter-dialog.any-fuel")}</option
            >
            {#if draft.fuel && !fuels.includes(draft.fuel)}<option
                value={draft.fuel}>{draft.fuel}</option
              >{/if}
            {#each fuels as fuel (fuel)}<option value={fuel}>{fuel}</option
              >{/each}
          </select>
        </label>
        <label class="filter-field desktop-type-label">
          <span
            >{locale.t("ui.desktop-catalog-filter-dialog.transmission")}</span
          >
          <select
            value={draft.transmission}
            onchange={(event) =>
              (draft = { ...draft, transmission: event.currentTarget.value })}
            class="desktop-type-body-small"
          >
            <option value=""
              >{locale.t(
                "ui.desktop-catalog-filter-dialog.any-transmission",
              )}</option
            >
            {#if draft.transmission && !transmissions.includes(draft.transmission)}<option
                value={draft.transmission}>{draft.transmission}</option
              >{/if}
            {#each transmissions as transmission (transmission)}<option
                value={transmission}>{transmission}</option
              >{/each}
          </select>
        </label>
        <label class="filter-field desktop-type-label">
          <span
            >{locale.t(
              "ui.desktop-catalog-filter-dialog.maximum-mileage-miles",
            )}</span
          >
          <input
            type="number"
            min="1"
            step="1"
            placeholder={locale.t(
              "ui.desktop-catalog-filter-dialog.any-mileage",
            )}
            value={draft.maxMileage}
            oninput={(event) =>
              (draft = { ...draft, maxMileage: event.currentTarget.value })}
            class="desktop-type-body-small"
          />
        </label>
        <label class="filter-field desktop-type-label">
          <span>{locale.t("ui.desktop-catalog-filter-dialog.seats")}</span>
          <select
            value={draft.minSeats}
            onchange={(event) =>
              (draft = { ...draft, minSeats: event.currentTarget.value })}
            class="desktop-type-body-small"
          >
            <option value=""
              >{locale.t("ui.desktop-catalog-filter-dialog.any-seats")}</option
            >
            {#if draft.minSeats && !["2", "4", "5", "7"].includes(draft.minSeats)}<option
                value={draft.minSeats}
                >{draft.minSeats}{locale.t(
                  "ui.desktop-catalog-filter-dialog.seats-e1f930",
                )}</option
              >{/if}
            {#each ["2", "4", "5", "7"] as seats (seats)}<option value={seats}
                >{seats}{locale.t(
                  "ui.desktop-catalog-filter-dialog.seats-e1f930",
                )}</option
              >{/each}
          </select>
        </label>
      </div>
    </div>

    <footer>
      <button
        class="dialog-reset desktop-type-control"
        type="button"
        onclick={reset}
        >{locale.t("ui.desktop-catalog-filter-dialog.reset-filters")}</button
      >
      <button
        class="dialog-apply desktop-type-control"
        type="submit"
        disabled={!!priceError}
      >
        {priceError
          ? locale.t("catalog.checkPrice")
          : locale.t("catalog.showCount", {
              count: locale.count(previewCount),
            })}
      </button>
    </footer>
  </form>
</dialog>

<style>
  dialog.desktop-catalog-dialog {
    position: fixed;
    inset: 0 0 0 auto;
    width: 560px;
    max-width: calc(100vw - 32px);
    height: 100dvh;
    max-height: none;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 20px 0 0 20px;
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-1000, #171717);
    box-shadow: -16px 0 60px rgb(0 0 0 / 12%);
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
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 28px;
    border-bottom: 1px solid var(--bs-neutral-200, #e5e5e5);
    flex-shrink: 0;
  }
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }
  button {
    font: inherit;
    cursor: pointer;
  }
  .dialog-close {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    color: inherit;
  }
  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 0;
    flex: 1;
    padding: 24px 28px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scroll-padding-block: 16px;
  }
  fieldset {
    padding: 0;
    margin: 0;
    border: 0;
    min-width: 0;
  }
  legend {
    float: none;
    width: auto;
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
  input,
  select {
    width: 100%;
    min-width: 0;
    height: 44px;
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 10px;
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-1000, #171717);
    font: inherit;
    font-size: 14px;
    line-height: 22px;
    box-shadow: none;
    text-overflow: ellipsis;
  }
  select {
    cursor: pointer;
    padding-right: 28px;
  }
  select:disabled {
    cursor: default;
    color: var(--bs-neutral-500, #737373);
    background: var(--bs-neutral-100, #f5f5f5);
  }
  input::placeholder {
    color: var(--bs-neutral-500, #737373);
    opacity: 1;
  }
  input:hover,
  select:not(:disabled):hover,
  .dialog-close:hover {
    border-color: var(--bs-neutral-500, #737373);
  }
  input:focus-visible,
  select:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000, #171717) !important;
    outline-offset: 3px;
  }
  .field-pair {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
  }
  .keyword-field {
    position: relative;
    display: block;
  }
  .keyword-field svg {
    position: absolute;
    left: 12px;
    top: 13px;
    pointer-events: none;
    color: var(--bs-neutral-500, #737373);
  }
  .keyword-field input {
    padding-left: 38px;
  }
  .type-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
  .type-choice {
    position: relative;
    margin: 0;
  }
  .type-choice input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: 0;
    opacity: 0;
  }
  .type-choice span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 6px 12px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    font-size: 13px;
    line-height: 22px;
    font-weight: 500;
    cursor: pointer;
  }
  .type-choice:hover span {
    border-color: var(--bs-neutral-500, #737373);
  }
  .type-choice input:checked + span {
    background: var(--bs-neutral-1000, #171717);
    border-color: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
  }
  .type-choice input:focus-visible {
    outline: none !important;
  }
  .type-choice input:focus-visible + span {
    outline: 2px solid var(--bs-neutral-1000, #171717) !important;
    outline-offset: 3px;
  }
  .price-period {
    color: var(--bs-neutral-500, #737373);
    font-weight: 400;
  }
  .amount-field {
    position: relative;
    display: block;
  }
  .amount-field > span {
    position: absolute;
    left: 12px;
    top: 11px;
    pointer-events: none;
    color: var(--bs-neutral-500, #737373);
  }
  .amount-field input {
    padding-left: 28px;
  }
  .price-error {
    margin: 12px 0 0;
    font-size: 13px;
    line-height: 20px;
    color: #9f2929;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-shrink: 0;
    padding: 20px 28px;
    border-top: 1px solid var(--bs-neutral-200, #e5e5e5);
  }
  .dialog-reset {
    padding: 10px 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--bs-neutral-500, #737373);
    font-size: 14px;
    line-height: 22px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .dialog-reset:hover {
    color: var(--bs-neutral-1000, #171717);
  }
  .dialog-apply {
    min-height: 44px;
    padding: 10px 24px;
    border: 1px solid var(--bs-neutral-1000, #171717);
    border-radius: 999px;
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
  }
  .dialog-apply:hover {
    background: #333;
    border-color: #333;
  }
  .dialog-apply:disabled {
    background: var(--bs-neutral-200, #e5e5e5);
    border-color: var(--bs-neutral-200, #e5e5e5);
    color: var(--bs-neutral-500, #737373);
    cursor: default;
  }

  @media (min-width: 992px) {
    dialog.desktop-catalog-dialog {
      border-radius: var(--karento-desktop-card-radius) 0 0
        var(--karento-desktop-card-radius);
    }
    header,
    .dialog-body,
    footer {
      padding: var(--karento-desktop-panel-padding);
      gap: var(--karento-desktop-panel-gap);
    }
    .dialog-close,
    .type-choice span,
    .dialog-apply {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .dialog-body input:not([type="checkbox"]):not([type="radio"]),
    select {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .field-pair {
      gap: var(--karento-desktop-card-gap);
    }
    .dialog-apply {
      min-height: var(--karento-desktop-control-height);
      padding-inline: var(--karento-desktop-panel-padding);
    }
  }
</style>
