<script lang="ts">
  import { flushSync } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { MediaQuery } from "svelte/reactivity";
  import { afterNavigate } from "$app/navigation";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { localToday } from "#lib/data/journeys.ts";
  import {
    emptyVehicleSearch,
    readRecentVehicleSearches,
    rememberVehicleSearch,
    vehicleSearchLabel,
    vehicleSearchText,
    vehicleSearchStorageKey,
    vehicleSearchSuggestions,
    type VehicleSearchCriteria,
    type RecentVehicleSearch,
  } from "#lib/data/vehicle-search.ts";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileCloseButton from "#lib/components/mobile/MobileCloseButton.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import { ownCatalogDialog } from "#lib/components/vehicle-listing/catalog-dialog.ts";

  let {
    purpose,
    criteria,
    cars,
    pickup = "",
    returning = "",
    retainedFilters = false,
    countResults,
    onapply,
    open = $bindable(false),
    inResults = false,
  }: {
    purpose: "buy" | "rent";
    criteria: VehicleSearchCriteria;
    cars: readonly { title: string }[];
    pickup?: string;
    returning?: string;
    retainedFilters?: boolean;
    countResults: (criteria: VehicleSearchCriteria) => number;
    onapply: (
      value: VehicleSearchCriteria & { pickup: string; returning: string },
    ) => void;
    open?: boolean;
    inResults?: boolean;
  } = $props();
  const locale = useLocale();
  const phone = new MediaQuery("(max-width:767.98px)");
  const id = $props.id();
  let text = $state("");
  let chosen = $state<VehicleSearchCriteria | null>(null);
  let draftPickup = $state("");
  let draftReturning = $state("");
  let recent = $state<RecentVehicleSearch[]>([]);
  let today = $state(localToday());
  let left = $state(16),
    top = $state(16);
  let maxHeight = $state(600);
  let input: HTMLInputElement | undefined;
  let form: HTMLFormElement | undefined;
  let opener: HTMLButtonElement | undefined;
  const title = $derived(
    locale.locale === "bg"
      ? purpose === "rent"
        ? "Търсене под наем"
        : "Търсене на автомобил"
      : purpose === "rent"
        ? "Find a rental"
        : "Find a car",
  );
  const placeholder = $derived(
    locale.locale === "bg"
      ? "Марка, модел или ключова дума"
      : "Make, model or keyword",
  );
  const draft = $derived(chosen ?? { ...emptyVehicleSearch, q: text.trim() });
  const suggestions = $derived(vehicleSearchSuggestions(cars, text));
  const count = $derived(countResults(draft));
  const recentHere = $derived(
    recent.filter((value) => value.purpose === purpose),
  );
  const showRecent = $derived(
    !text.trim() || text === vehicleSearchText(criteria),
  );
  const buttonLabel = $derived(
    inResults
      ? locale.locale === "bg"
        ? "Приложи"
        : "Apply"
      : locale.locale === "bg"
        ? `Виж ${count} ${count === 1 ? "автомобил" : "автомобила"}`
        : `View ${count} ${count === 1 ? "car" : "cars"}`,
  );
  const ownInput: Attachment<HTMLInputElement> = (node) => {
    input = node;
    return () => {
      input = undefined;
    };
  };
  const ownForm: Attachment<HTMLFormElement> = (node) => {
    form = node;
    return () => {
      form = undefined;
    };
  };
  const ownDialog: Attachment<HTMLDialogElement> = () => {
    const position = () => {
      const anchor = opener?.getBoundingClientRect();
      const anchorBottom = anchor?.bottom ?? 16;
      left = Math.max(
        16,
        Math.min(anchor?.left ?? 16, window.innerWidth - 576),
      );
      const below = window.innerHeight - anchorBottom - 24;
      top = below >= 240 ? anchorBottom + 8 : 16;
      maxHeight = below >= 240 ? below : window.innerHeight - 32;
    };
    window.addEventListener("resize", position);
    position();
    return () => {
      window.removeEventListener("resize", position);
    };
  };

  function stored() {
    try {
      return localStorage.getItem(vehicleSearchStorageKey);
    } catch {
      return null;
    }
  }
  export function show(
    trigger: HTMLButtonElement,
    field: "query" | "pickup" | "returning" = "query",
  ) {
    trigger.focus({ preventScroll: true });
    const anchor = trigger.getBoundingClientRect();
    opener = trigger;
    chosen = { ...criteria };
    text = vehicleSearchText(criteria);
    draftPickup = pickup;
    draftReturning = returning;
    today = localToday();
    recent = readRecentVehicleSearches(stored());
    left = Math.max(16, Math.min(anchor.left, window.innerWidth - 576));
    top = anchor.bottom + 8;
    // Keep input focus within the original tap event, including on mobile Safari.
    flushSync(() => {
      open = true;
    });
    form
      ?.querySelector<HTMLInputElement>(`[name="${field}"]`)
      ?.focus({ preventScroll: true });
  }
  function choose(value: VehicleSearchCriteria) {
    chosen = { q: value.q, make: value.make, model: value.model };
    text = vehicleSearchText(chosen);
    input?.focus({ preventScroll: true });
  }
  function clear() {
    text = "";
    chosen = null;
    draftPickup = "";
    draftReturning = "";
    input?.focus({ preventScroll: true });
  }
  function clearHistory() {
    recent = recent.filter((value) => value.purpose !== purpose);
    input?.focus({ preventScroll: true });
    try {
      localStorage.setItem(vehicleSearchStorageKey, JSON.stringify(recent));
    } catch {
      /* Search works with storage disabled. */
    }
  }
  function apply(event: SubmitEvent) {
    event.preventDefault();
    const value = { ...draft, pickup: draftPickup, returning: draftReturning };
    recent = rememberVehicleSearch(stored(), draft, purpose);
    try {
      localStorage.setItem(vehicleSearchStorageKey, JSON.stringify(recent));
    } catch {
      /* Search works with storage disabled. */
    }
    open = false;
    onapply(value);
  }
  function arrows(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      open = false;
      return;
    }
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const controls = [
      ...(form?.querySelectorAll<HTMLButtonElement>(".search-suggestion") ??
        []),
    ];
    if (!controls.length) return;
    const index = controls.findIndex((button) => button === event.target);
    event.preventDefault();
    const next =
      index < 0
        ? event.key === "ArrowDown"
          ? 0
          : controls.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) %
          controls.length;
    controls[next]?.focus();
  }
  function backdrop(event: MouseEvent & { currentTarget: HTMLDialogElement }) {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      open = false;
  }
  afterNavigate(() => {
    open = false;
  });
</script>

{#snippet body()}
  <form
    id={id + "-form"}
    class="vehicle-search-body"
    {@attach ownForm}
    onsubmit={apply}
  >
    {#if purpose === "rent"}
      <div class="search-dates">
        <label
          ><span>{locale.locale === "bg" ? "Вземане" : "Pick-up"}</span><input
            type="date"
            name="pickup"
            min={today}
            required={!!draftReturning}
            bind:value={draftPickup}
            oninput={(event) => {
              if (draftReturning && event.currentTarget.value > draftReturning)
                draftReturning = "";
            }}
          /></label
        >
        <label
          ><span>{locale.locale === "bg" ? "Връщане" : "Return"}</span><input
            type="date"
            name="returning"
            min={draftPickup || today}
            required={!!draftPickup}
            bind:value={draftReturning}
          /></label
        >
      </div>
    {/if}
    <div class="query-group">
      <label for={id + "-query"}>{placeholder}</label>
      <div class="query-input-wrap">
        <MobileIcon name="search" size={20} />
        <input
          id={id + "-query"}
          class="vehicle-query-input"
          name="query"
          type="search"
          autocomplete="off"
          maxlength="160"
          placeholder={locale.locale === "bg"
            ? "Например Audi RS6"
            : "Try Audi RS6"}
          bind:value={text}
          oninput={() => {
            chosen = null;
          }}
          onkeydown={arrows}
          {@attach ownInput}
        />
        {#if text}<button
            class="query-clear"
            type="button"
            aria-label={locale.locale === "bg"
              ? "Изчисти търсенето"
              : "Clear search"}
            onclick={() => {
              text = "";
              chosen = null;
              input?.focus();
            }}><MobileIcon name="close" size={18} /></button
          >{/if}
      </div>
    </div>
    {#if showRecent && recentHere.length}
      <section aria-labelledby={id + "-recent"}>
        <div class="suggestions-heading">
          <h3 id={id + "-recent"}>
            {locale.locale === "bg" ? "Последни търсения" : "Recent searches"}
          </h3>
          <button type="button" class="history-clear" onclick={clearHistory}
            >{locale.locale === "bg" ? "Изтрий" : "Clear history"}</button
          >
        </div>
        {#each recentHere as value (JSON.stringify(value))}<button
            type="button"
            class="search-suggestion recent-search"
            onkeydown={arrows}
            onclick={() => choose(value)}
            ><span class="suggestion-label">{vehicleSearchLabel(value)}</span
            ><MobileIcon name="arrow-up-right" size={16} /></button
          >{/each}
      </section>
    {/if}
    <section aria-labelledby={id + "-suggestions"}>
      <h3 id={id + "-suggestions"}>
        {text.trim()
          ? locale.locale === "bg"
            ? "Марки и модели"
            : "Makes and models"
          : locale.locale === "bg"
            ? "Разгледай по марка"
            : "Browse by make"}
      </h3>
      {#each suggestions as value (vehicleSearchLabel(value))}
        <button
          type="button"
          class="search-suggestion"
          aria-pressed={vehicleSearchText(draft).toLocaleLowerCase() ===
            vehicleSearchText(value).toLocaleLowerCase()}
          onkeydown={arrows}
          onclick={() => choose(value)}
          ><span class="suggestion-label">{vehicleSearchLabel(value)}</span
          ><span class="suggestion-kind"
            >{locale.locale === "bg"
              ? value.model
                ? "Модел"
                : "Марка"
              : value.model
                ? "Model"
                : "Make"}</span
          ></button
        >
      {/each}
      {#if !suggestions.length}<p class="query-note">
          {locale.locale === "bg"
            ? "Търси по въведените ключови думи."
            : "Search using the keywords you entered."}
        </p>{/if}
    </section>
    {#if retainedFilters}<p class="query-note">
        {locale.locale === "bg"
          ? "Останалите филтри остават активни."
          : "Your other filters stay active."}
      </p>{/if}
    {#if inResults}<p class="query-note search-result-count">
        {locale.count(count, "vehicles")}
      </p>{/if}
  </form>
{/snippet}
{#snippet actions()}
  <button type="button" class="search-reset" onclick={clear}
    >{locale.locale === "bg" ? "Изчисти" : "Reset"}</button
  >
  <button type="submit" class="search-apply" form={id + "-form"}
    >{buttonLabel}<MobileIcon name="arrow-right" size={18} /></button
  >
{/snippet}

{#if phone.current}
  <MobileSheet
    bind:open={
      () => open && phone.current,
      (value) => {
        if (phone.current) open = value;
      }
    }
    {title}
    class="vehicle-search-sheet mobile-catalog-editor"
    >{#if open}{@render body()}{/if}{#snippet footer()}{@render actions()}{/snippet}</MobileSheet
  >
{:else if open}
  <dialog
    class="vehicle-search-dialog"
    style:left={left + "px"}
    style:top={top + "px"}
    style:max-height={maxHeight + "px"}
    aria-labelledby={id + "-title"}
    {@attach ownCatalogDialog}
    {@attach ownDialog}
    onclose={() => {
      if (!phone.current) open = false;
    }}
    oncancel={() => {
      open = false;
    }}
    onclick={backdrop}
  >
    <header>
      <h2 id={id + "-title"}>{title}</h2>
      <MobileCloseButton
        label={locale.locale === "bg" ? "Затвори търсенето" : "Close search"}
        onclick={() => {
          open = false;
        }}
      />
    </header>
    {@render body()}
    <footer>{@render actions()}</footer>
  </dialog>
{/if}

<style>
  .vehicle-search-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
    padding: 12px 16px 24px;
    color: var(--bs-neutral-1000);
  }
  .query-group {
    display: grid;
    gap: 8px;
  }
  label {
    display: grid;
    gap: 8px;
    min-width: 0;
    font-size: 14px;
    line-height: 20px;
  }
  .query-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 0 12px;
    border: 1px solid var(--bs-neutral-300);
    border-radius: 12px;
    background: var(--bs-neutral-0);
  }
  .query-input-wrap:focus-within {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 1px;
  }
  input {
    min-width: 0;
    width: 100%;
    height: 48px;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-neutral-0);
    color: inherit;
    font: inherit;
    font-size: 16px;
  }
  .vehicle-query-input {
    flex: 1;
    padding: 10px 0;
    border: 0;
    outline: 0;
    background: transparent;
  }
  .vehicle-query-input::-webkit-search-cancel-button {
    display: none;
  }
  .query-input-wrap .vehicle-query-input:focus,
  .query-input-wrap .vehicle-query-input:focus-visible {
    border: 0;
    /* The wrapper owns the single focus ring, including shared mobile overrides. */
    outline: 0 !important;
    box-shadow: none;
  }
  .query-input-wrap :global(svg) {
    flex-shrink: 0;
  }
  .query-clear {
    display: grid;
    place-items: center;
    flex: 0 0 44px;
    height: 44px;
    margin-right: -10px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .search-dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 13px;
    line-height: 20px;
    font-weight: 500;
    color: var(--bs-neutral-500);
  }
  .suggestions-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .suggestions-heading h3 {
    margin: 0;
  }
  .history-clear {
    min-height: 44px;
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: var(--bs-neutral-700);
    font: inherit;
    font-size: 13px;
    text-decoration: underline;
    cursor: pointer;
  }
  .search-suggestion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .search-suggestion[aria-pressed="true"] {
    background: var(--bs-neutral-100);
    font-weight: 600;
  }
  .suggestion-label {
    overflow-wrap: anywhere;
    font-size: 15px;
    line-height: 22px;
  }
  .suggestion-kind {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--bs-neutral-500);
  }
  .query-note {
    margin: 0;
    font-size: 13px;
    line-height: 20px;
    color: var(--bs-neutral-500);
  }
  .search-reset,
  .search-apply {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 10px 16px;
    border: 0;
    border-radius: 999px;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .search-reset {
    flex: 0 0 auto;
    background: transparent;
    color: var(--bs-neutral-1000);
    text-decoration: underline;
  }
  .search-apply {
    flex: 1;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  button:focus-visible,
  input[type="date"]:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: -2px;
  }
  @media (hover: hover) {
    .search-suggestion:hover {
      background: var(--bs-neutral-100);
    }
  }
  .vehicle-search-dialog {
    position: fixed;
    inset: auto;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: 560px;
    max-width: calc(100vw - 32px);
    max-height: calc(100dvh - 32px);
    margin: 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 16px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  .vehicle-search-dialog::backdrop {
    background: rgb(0 0 0 / 20%);
  }
  .vehicle-search-dialog .vehicle-search-body {
    overflow-y: auto;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
  }
  h2 {
    margin: 0;
    font-size: 20px;
    line-height: 26px;
  }
  header :global(.mobile-close-button) {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--bs-neutral-200);
  }
</style>
