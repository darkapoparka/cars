<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { onMount, tick } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { dealer } from "#lib/content.ts";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import {
    readDesktopCatalogFilters,
    vehicleBodyType,
  } from "#lib/data/desktop-catalog.ts";
  import { manufacturerArtwork } from "#lib/data/manufacturer-artwork.ts";
  import {
    bodyTypeArtwork,
    compareBodyTypes,
  } from "#lib/data/body-type-artwork.ts";

  type Picker = "type" | "make" | "model" | "budget";
  let { syncWithCatalog = false }: { syncWithCatalog?: boolean } = $props();
  const pickers = ["type", "make", "model", "budget"] as const;
  const catalogFilters = $derived(
    syncWithCatalog ? readDesktopCatalogFilters(page.url.searchParams) : null,
  );
  const id = $props.id();
  const inventory = $derived(
    vehicleListings.gridFourColumns.map((card) => ({
      ...card,
      ...dealer.inventory[card.title],
    })),
  );
  const types = $derived(
    [...new Set(inventory.map(vehicleBodyType).filter(Boolean))].sort(
      compareBodyTypes,
    ),
  );
  let vehicleType = $derived(catalogFilters?.type ?? "");
  const typeInventory = $derived(
    inventory.filter(
      (card) => !vehicleType || vehicleBodyType(card) === vehicleType,
    ),
  );
  const makes = $derived(
    [...new Set(typeInventory.map((card) => card.title.split(" ")[0]))].sort(),
  );
  let make = $derived(catalogFilters?.make ?? "");
  let model = $derived(catalogFilters?.model ?? "");
  let budget = $derived(catalogFilters?.budget ?? "");
  let budgetAmount = $state<number | undefined>();
  let budgetError = $state("");
  let open = $state<Picker | null>(null);
  let query = $state("");
  let availableHeight = $state(480);
  let panelLeft = $state(0);
  let panelTop = $state(0);
  let placement = $state<"below" | "above" | "viewport">("below");
  let positioned = $state(false);
  let form: HTMLFormElement | undefined;
  const models = $derived(
    [
      ...new Set(
        typeInventory
          .filter((card) => card.title.startsWith(make + " "))
          .map((card) => card.title.slice(make.length + 1)),
      ),
    ].sort(),
  );
  const choices = $derived(
    (open === "type" ? types : open === "make" ? makes : models).filter(
      (choice) =>
        choice.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    ),
  );
  const choiceLabel = $derived(
    open === "type"
      ? locale.t("catalog.types")
      : open === "make"
        ? locale.t("ui.dealership-vehicle-search.makes")
        : locale.t("ui.dealership-vehicle-search.models"),
  );
  const currency = $derived(dealer.businessPreview?.currency || "USD");
  const budgetLabel = $derived(
    budget
      ? locale.t("catalog.upTo", {
          amount: locale.money(Number(budget), currency),
        })
      : locale.t("ui.dealership-vehicle-search.any-price"),
  );
  const preservedParameters = $derived(
    syncWithCatalog
      ? [...page.url.searchParams.entries()].filter(
          ([name]) =>
            !["type", "make", "model", "budget", "filters", "lang"].includes(
              name,
            ),
        )
      : [],
  );

  afterNavigate(() => {
    if (syncWithCatalog) close();
  });

  onMount(() => {
    const header = document.querySelector<HTMLElement>(".header");
    if (!header) return;
    const observer = new ResizeObserver(positionPanel);
    observer.observe(header);
    return () => observer.disconnect();
  });

  async function show(picker: Picker) {
    if (open === picker) {
      close();
      return;
    }
    query = "";
    budgetError = "";
    budgetAmount = budget ? Number(budget) : undefined;
    positioned = false;
    open = picker;
    await tick();
    if (open !== picker) return;
    positionPanel();
    await tick();
    if (open === picker) {
      positioned = true;
      await tick();
      if (open !== picker) return;
      const target =
        form?.querySelector<HTMLElement>(`[data-panel="${picker}"] input`) ??
        form?.querySelector<HTMLElement>(
          `[data-panel="${picker}"] [data-picker-title]`,
        );
      target?.focus({ preventScroll: true });
    }
  }

  function positionPanel() {
    if (!open || !form) return;
    const panel = form.querySelector<HTMLElement>(`[data-panel="${open}"]`);
    const trigger = form.querySelector<HTMLElement>(`[data-picker="${open}"]`);
    if (!panel || !trigger) return;
    const anchor = form.getBoundingClientRect();
    const viewportTop = Math.max(
      16,
      (document.querySelector(".header")?.getBoundingClientRect().bottom ?? 0) +
        12,
    );
    if (
      window.innerWidth < 992 ||
      anchor.bottom <= viewportTop ||
      anchor.top >= window.innerHeight - 16
    ) {
      close();
      return;
    }
    const panelWidth = panel.getBoundingClientRect().width;
    const rightLimit = Math.max(0, form.clientWidth - panelWidth);
    panelLeft =
      open === "budget"
        ? rightLimit
        : Math.max(
            0,
            Math.min(
              trigger.getBoundingClientRect().left -
                anchor.left -
                form.clientLeft,
              rightLimit,
            ),
          );
    const below = window.innerHeight - anchor.bottom - 28;
    const above = anchor.top - viewportTop - 12;
    const heightLimit = open === "type" || open === "make" ? 600 : 480;
    const minimumHeight = Math.min(300, panel.scrollHeight + 2);
    if (below >= minimumHeight) {
      placement = "below";
      availableHeight = Math.min(heightLimit, below);
      panelTop = anchor.height - form.clientTop + 12;
    } else if (above >= minimumHeight) {
      placement = "above";
      availableHeight = Math.min(heightLimit, above);
    } else {
      // A short viewport can need an overlay without moving the page or hero.
      placement = "viewport";
      availableHeight = Math.max(1, window.innerHeight - viewportTop - 16);
      panelTop = viewportTop - anchor.top - form.clientTop;
    }
  }

  function close(returnFocus = false) {
    const previous = open;
    open = null;
    if (returnFocus && previous)
      form
        ?.querySelector<HTMLButtonElement>(`[data-picker="${previous}"]`)
        ?.focus({ preventScroll: true });
  }

  async function resizePanel() {
    await tick();
    positionPanel();
  }

  function choose(value: string) {
    if (open === "type") {
      vehicleType = vehicleType === value ? "" : value;
      make = "";
      model = "";
    } else if (open === "make") {
      make = make === value ? "" : value;
      model = "";
    } else if (open === "model") model = model === value ? "" : value;
  }

  function clear() {
    if (open === "type") {
      vehicleType = "";
      make = "";
      model = "";
    } else if (open === "make") {
      make = "";
      model = "";
    } else if (open === "model") model = "";
    else {
      budget = "";
      budgetAmount = undefined;
      budgetError = "";
    }
  }

  function apply() {
    if (open === "budget") {
      if (
        budgetAmount !== undefined &&
        (!Number.isFinite(budgetAmount) || budgetAmount <= 0)
      ) {
        budgetError = locale.t("catalog.budgetError");
        return;
      }
      budget = budgetAmount === undefined ? "" : String(budgetAmount);
    }
    close(true);
  }

  function outside(event: PointerEvent) {
    if (open && event.target instanceof Node && !form?.contains(event.target))
      close();
  }

  function keyboard(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const options = [
      ...(form?.querySelectorAll<HTMLButtonElement>(".picker-choice") ?? []),
    ];
    if (!options.length || !(event.target instanceof HTMLElement)) return;
    const index = options.indexOf(event.target as HTMLButtonElement);
    if (
      index < 0 &&
      !event.target.matches("[data-picker]") &&
      (!event.target.matches("input, [data-picker-title]") ||
        !["ArrowDown", "ArrowUp"].includes(event.key))
    )
      return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length;
    const target = options[next];
    const list = target?.closest<HTMLElement>(".picker-options");
    if (target && list) {
      const choiceBounds = target.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();
      if (choiceBounds.top < listBounds.top)
        list.scrollTop += choiceBounds.top - listBounds.top;
      else if (choiceBounds.bottom > listBounds.bottom)
        list.scrollTop += choiceBounds.bottom - listBounds.bottom;
    }
    target?.focus({ preventScroll: true });
  }
</script>

<svelte:window
  onpointerdown={outside}
  onkeydown={keyboard}
  onresize={resizePanel}
  onscroll={positionPanel}
/>

{#snippet chevron()}
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    ><path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{/snippet}

{#snippet selectionCheck()}
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m5 12 4 4L19 6"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

<form
  bind:this={form}
  action={locale.href("/vehicles#vehicle-results")}
  method="GET"
  role="search"
  aria-label={locale.t("ui.dealership-vehicle-search.find-a-car")}
  class="dealership-search background-card"
  onsubmit={() => close()}
>
  <input type="hidden" name="lang" value={locale.locale} />
  <input type="hidden" name="type" value={vehicleType} />
  <input type="hidden" name="make" value={make} />
  <input type="hidden" name="model" value={model} />
  <input type="hidden" name="budget" value={budget} />
  {#each preservedParameters as [name, value], index (`${name}-${index}`)}
    <input type="hidden" {name} {value} />
  {/each}
  <div class="search-fields">
    {#each pickers as key (key)}
      {@const value =
        key === "type"
          ? vehicleType || locale.t("catalog.allTypes")
          : key === "make"
            ? make || locale.t("catalog.allMakes")
            : key === "model"
              ? model || locale.t("catalog.allModels")
              : budgetLabel}
      <button
        type="button"
        class="search-field"
        data-picker={key}
        onclick={() => show(key)}
        aria-expanded={open === key}
        aria-controls={open === key ? id + "-" + key : undefined}
        aria-label={locale.t(`catalog.${key}`) + ", " + value}
      >
        <span class="field-label desktop-type-label"
          >{locale.t(`catalog.${key}`)}</span
        >
        <span class="field-value desktop-type-control"
          ><span>{value}</span>{@render chevron()}</span
        >
      </button>
    {/each}
    <button
      type="submit"
      class="search-button btn btn-brand-2 desktop-type-control"
      aria-label={locale.t("ui.dealership-vehicle-search.search-cars")}
      title={locale.t("ui.dealership-vehicle-search.search-cars")}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        ><circle
          cx="10.5"
          cy="10.5"
          r="7"
          stroke="currentColor"
          stroke-width="1.6"
        /><path
          d="m16 16 5 5"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        /></svg
      >
    </button>
  </div>
  {#if open}
    <div
      id={id + "-" + open}
      data-panel={open}
      class:budget-picker={open === "budget"}
      class:make-picker={open === "make"}
      class:type-picker={open === "type"}
      class:model-picker={open === "model"}
      class:positioned
      class:compact-picker={availableHeight < 360}
      class="picker"
      style:max-height={availableHeight + "px"}
      style:left={panelLeft + "px"}
      style:top={placement === "above" ? "auto" : panelTop + "px"}
      style:bottom={placement === "above" ? "calc(100% + 12px)" : "auto"}
      role="region"
      aria-label={locale.t("catalog.choose", {
        field: locale.t(`catalog.${open}`),
      })}
    >
      <div class="picker-heading"
        ><h2 tabindex="-1" data-picker-title class="desktop-type-panel"
          >{locale.t("catalog.choose", {
            field: locale.t(`catalog.${open}`),
          })}</h2
        ><button
          type="button"
          class="close-picker"
          aria-label={locale.t("ui.dealership-vehicle-search.close-picker")}
          onclick={() => close(true)}
          ><svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            ><path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            /></svg
          ></button
        ></div
      >
      {#if open === "budget"}
        <label class="budget-label desktop-type-label" for={id + "-maximum"}
          >{locale.t("catalog.maximumPrice")} ({currency})</label
        >
        <input
          id={id + "-maximum"}
          class="picker-input desktop-type-body-small"
          type="number"
          min="0.01"
          step="any"
          placeholder={locale.t("ui.dealership-vehicle-search.any-price")}
          bind:value={budgetAmount}
        />
        {#if budgetError}<p class="picker-error desktop-type-meta" role="alert"
            >{budgetError}</p
          >{/if}
        {#if dealer.contentStatus === "reference-demo"}<p
            class="picker-note desktop-type-meta"
            >{locale.t(
              "ui.dealership-vehicle-search.the-current-catalogue-contains-sample-prices",
            )}</p
          >{/if}
      {:else}
        {#if open !== "type"}
          <label class="visually-hidden" for={id + "-query"}
            >{locale.t("ui.dealership-vehicle-search.search")}
            {choiceLabel}</label
          >
          <input
            id={id + "-query"}
            class="picker-input desktop-type-body-small"
            type="search"
            placeholder={locale.t("catalog.searchEntities", {
              entity: choiceLabel,
            })}
            bind:value={query}
          />
        {/if}
        <div class="picker-options">
          {#if open === "make" && !query.trim()}
            <button
              type="button"
              class="picker-choice make-choice desktop-type-control"
              aria-pressed={!make}
              onclick={() => choose("")}
            >
              <span class="make-mark" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M7 4v6m0 6v12M16 4v15m0 6v3M25 4v6m0 6v12"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="7"
                    cy="13"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <circle
                    cx="16"
                    cy="22"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <circle
                    cx="25"
                    cy="13"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                </svg>
              </span>
              <span class="choice-name"
                >{locale.t("ui.dealership-vehicle-search.all-makes")}</span
              >
              {#if !make}{@render selectionCheck()}{/if}
            </button>
          {/if}
          {#each choices as choice (choice)}
            {@const selected =
              (open === "type"
                ? vehicleType
                : open === "make"
                  ? make
                  : model) === choice}
            {@const artwork =
              open === "make" ? manufacturerArtwork(choice) : undefined}
            {@const typeArtwork =
              open === "type" ? bodyTypeArtwork(choice) : undefined}
            <button
              type="button"
              class="picker-choice desktop-type-control"
              class:type-choice={open === "type"}
              class:make-choice={open === "make"}
              aria-pressed={selected}
              onclick={() => choose(choice)}
            >
              {#if open === "type"}
                <span class="type-artwork" aria-hidden="true">
                  {#if typeArtwork}
                    <img
                      src={typeArtwork.image}
                      alt=""
                      width={typeArtwork.width}
                      height={typeArtwork.height}
                      decoding="async"
                    />
                  {:else}
                    <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
                      <path
                        d="M9 21v-7l7-2 7-7h19l9 9 5 2v5H9Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20 12h24M31 5v7"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <circle
                        cx="19"
                        cy="23"
                        r="4"
                        fill="white"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <circle
                        cx="47"
                        cy="23"
                        r="4"
                        fill="white"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                    </svg>
                  {/if}
                </span>
              {/if}
              {#if open === "make"}
                <span class="make-mark" aria-hidden="true">
                  {#if artwork}
                    {@const visibleWidth =
                      artwork.bounds[2] - artwork.bounds[0]}
                    {@const visibleHeight =
                      artwork.bounds[3] - artwork.bounds[1]}
                    <span
                      class="make-artwork"
                      style:width={Math.min(
                        64,
                        (36 * visibleWidth) / visibleHeight,
                      ) + "px"}
                      style:aspect-ratio={visibleWidth + " / " + visibleHeight}
                    >
                      <img
                        src={artwork.image}
                        alt=""
                        width={artwork.width}
                        height={artwork.height}
                        decoding="async"
                        style:width={(artwork.width / visibleWidth) * 100 + "%"}
                        style:left={(-artwork.bounds[0] / visibleWidth) * 100 +
                          "%"}
                        style:top={(-artwork.bounds[1] / visibleHeight) * 100 +
                          "%"}
                      />
                    </span>
                  {:else}
                    <span class="make-initial desktop-type-badge"
                      >{choice.charAt(0)}</span
                    >
                  {/if}
                </span>
              {/if}
              <span class="choice-name">{choice}</span>
              {#if selected}{@render selectionCheck()}{/if}
            </button>
          {/each}
        </div>
        {#if !choices.length}<p class="picker-note desktop-type-meta"
            >{open === "type"
              ? "No body styles are available for this catalogue."
              : open === "model" && !make
                ? locale.t(
                    "ui.dealership-vehicle-search.choose-a-make-to-see-its-models",
                  )
                : "No matches. Try another search."}</p
          >{/if}
      {/if}
      <div class="picker-footer"
        ><button
          type="button"
          class="clear-picker desktop-type-control"
          onclick={clear}
          >{locale.t("ui.dealership-vehicle-search.clear")}</button
        ><button
          type="button"
          class="apply-picker btn btn-brand-2 desktop-type-control"
          onclick={apply}
          >{locale.t("ui.dealership-vehicle-search.apply")}</button
        ></div
      >
    </div>
  {/if}
</form>

<style>
  .dealership-search {
    position: relative;
    padding: 12px 14px;
    border: 1px solid #e4e4e4;
    border-radius: 16px;
    color: #171717;
    text-align: left;
    box-shadow: 0 8px 24px rgb(0 0 0 / 6%);
  }
  .search-fields {
    display: grid;
    grid-template-columns: 1fr 1fr 1.25fr 1fr auto;
    align-items: center;
  }
  .search-field {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    min-height: 48px;
    padding: 2px 20px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: inherit;
    text-align: left;
  }
  .search-field::after {
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    height: 32px;
    background: #e0e0e0;
    content: "";
    transform: translateY(-50%);
    pointer-events: none;
  }
  .search-field:hover,
  .search-field:focus-visible,
  .search-field[aria-expanded="true"] {
    background: #f5f5f5;
  }
  .search-field:is(:hover, :focus-visible, [aria-expanded="true"])::after,
  .search-field:has(
      + .search-field:is(:hover, :focus-visible, [aria-expanded="true"])
    )::after {
    opacity: 0;
  }
  .field-label {
    font-size: 13px;
    line-height: 1.4;
    font-weight: 500;
    color: #707070;
  }
  .field-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    font-size: 16px;
    line-height: 1.4;
    font-weight: 600;
  }
  .field-value > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  svg {
    flex: 0 0 auto;
  }
  .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    min-width: 48px;
    height: 48px;
    min-height: 48px;
    margin-left: 14px;
    padding: 0;
    border-radius: 50%;
  }
  .picker {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 50;
    width: 100%;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 18px 40px rgb(0 0 0 / 14%);
    overflow-anchor: none;
    transition: none;
  }
  .picker:not(.positioned) {
    visibility: hidden;
  }
  .budget-picker {
    width: min(390px, 100%);
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .model-picker {
    width: min(480px, 100%);
  }
  .make-picker {
    padding: 16px;
  }
  .model-picker .picker-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .picker-heading {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
  }
  .picker-heading h2 {
    margin: 0;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 600;
  }
  .close-picker {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid #e3e3e3;
    border-radius: 10px;
    background: #fff;
  }
  .picker-input {
    flex-shrink: 0;
    width: 100%;
    height: 46px;
    padding: 10px 14px;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    background: #fff;
    color: #171717;
    font: inherit;
    font-size: 16px;
    line-height: 1.4;
  }
  .make-picker .picker-input {
    height: 42px;
    padding-block: 8px;
  }
  .picker-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    min-height: 0;
    max-height: 270px;
    overflow-y: auto;
    overscroll-behavior: contain;
    margin: 15px 0;
  }
  .picker-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    padding: 10px 14px;
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    background: #fff;
    color: #171717;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
  }
  .make-picker .picker-options {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    max-height: 360px;
    margin-block: 12px;
    margin-inline: -3px;
    padding: 3px;
  }
  .make-choice {
    position: relative;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-height: 88px;
    padding: 8px 10px;
  }
  .type-picker .picker-options {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    max-height: 260px;
    margin: -3px;
    padding: 3px;
  }
  .type-choice {
    position: relative;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-height: 120px;
    padding: 12px 10px;
  }
  .type-choice:hover,
  .make-choice:hover {
    border-color: #999;
    background: #f7f7f7;
  }
  .type-choice .choice-name,
  .make-choice .choice-name {
    flex: none;
    width: 100%;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
  }
  .type-choice > svg,
  .make-choice > svg {
    position: absolute;
    top: 9px;
    right: 9px;
  }
  .type-artwork {
    display: grid;
    place-items: center;
    width: 100%;
    height: 64px;
  }
  .type-artwork img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .choice-name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .make-mark {
    display: grid;
    place-items: center;
    flex: none;
    width: 100%;
    height: 40px;
  }
  .make-artwork {
    display: block;
    position: relative;
    overflow: hidden;
    mix-blend-mode: multiply;
  }
  .make-artwork img {
    position: absolute;
    max-width: none;
    height: auto;
  }
  .make-initial {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f2f2f2;
    color: #666;
    font-size: 14px;
    font-weight: 600;
  }
  .picker-choice[aria-pressed="true"] {
    border-color: #171717;
    background: #f3f3f3;
  }
  .picker-footer {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 15px;
    padding-top: 14px;
    border-top: 1px solid #e8e8e8;
  }
  .type-picker .picker-footer,
  .make-picker .picker-footer {
    margin-top: 12px;
    padding-top: 12px;
  }
  .clear-picker {
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: #171717;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-size: 14px;
  }
  .apply-picker {
    min-height: 42px;
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 14px;
  }
  .budget-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
  }
  .picker-note,
  .picker-error {
    margin: 14px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
  }
  .picker-error {
    color: #a12626;
  }
  .search-field:focus-visible,
  .picker-input:focus-visible,
  .picker-choice:focus-visible,
  .close-picker:focus-visible,
  .clear-picker:focus-visible,
  .apply-picker:focus-visible,
  .search-button:focus-visible {
    outline: 2px solid #171717 !important;
    outline-offset: 3px;
  }
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .search-field {
      padding-inline: var(--karento-desktop-space-4);
    }
    .search-button {
      margin-left: var(--karento-desktop-space-3);
    }
  }
  .compact-picker {
    padding: 14px;
  }
  .compact-picker .picker-heading {
    margin-bottom: 10px;
  }
  .compact-picker .picker-input {
    height: 40px;
  }
  .compact-picker .picker-options {
    margin-block: 10px;
  }
  .compact-picker .picker-footer {
    margin-top: 10px;
    padding-top: 10px;
  }
</style>
