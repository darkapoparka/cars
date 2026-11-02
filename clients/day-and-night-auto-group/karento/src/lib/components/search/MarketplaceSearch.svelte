<script lang="ts">
  import "#lib/styles/hero-search.css";
  import { flushSync } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { readRentalRequest } from "#lib/data/journeys.ts";
  import {
    readCatalogFilters,
    catalogDestination,
    matchCatalog,
  } from "#lib/data/mobile-catalog.ts";
  import { filterRentalCars, rentalCars } from "#lib/data/rental-catalog.ts";
  import {
    readDesktopCatalogFilters,
    matchDesktopCatalog,
    desktopCatalogFilterKeys,
  } from "#lib/data/desktop-catalog.ts";
  import {
    rentalVehicleQuery,
    type VehicleSearchCriteria,
    rememberVehicleSearch,
    vehicleSearchStorageKey,
  } from "#lib/data/vehicle-search.ts";
  import { dealer } from "#lib/content.ts";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import { resolveInventoryVehicle } from "#lib/data/vehicle-inventory.ts";
  import VehicleSearchPanel from "./VehicleSearchPanel.svelte";
  import SaleChoicePicker from "./SaleChoicePicker.svelte";
  import { saleMakes, saleModels } from "#lib/data/sale-search.ts";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  let { mode = "buy" }: { mode?: "buy" | "rent" } = $props();
  const locale = useLocale();
  const phone = new MediaQuery("(max-width:767.98px)");
  const purpose = $derived(mode);
  let open = $state(false);
  let editor: VehicleSearchPanel;
  let picker: SaleChoicePicker;
  let pickerOpen = $state(false);
  let pickerField = $state<"make" | "model">("make");
  let buyTrigger: HTMLButtonElement | undefined;
  const path = $derived(purpose === "rent" ? "/rent" : "/vehicles");
  const inResults = $derived(page.params.path === path.slice(1));
  const params = $derived(
    new URLSearchParams(
      page.params.path === path.slice(1)
        ? page.url.searchParams.toString()
        : "",
    ),
  );
  const buyParams = $derived(
    new URLSearchParams(
      page.params.path === "vehicles" ? page.url.searchParams.toString() : "",
    ),
  );
  const filters = $derived(readCatalogFilters(buyParams));
  const desktopFilters = $derived(readDesktopCatalogFilters(buyParams));
  let buyMake = $derived(filters.make);
  let buyModel = $derived(filters.model);
  const buyCriteria = $derived({
    q: filters.q,
    make: buyMake,
    model: buyModel,
  });
  const request = $derived(readRentalRequest(params));
  const criteria = $derived<VehicleSearchCriteria>(
    purpose === "buy"
      ? buyCriteria
      : {
          q:
            params.get("q") ?? (params.has("review") ? "" : request.preference),
          make: params.get("make") ?? "",
          model: "",
        },
  );
  const placeholder = $derived(
    locale.locale === "bg" ? "Търси марка или модел" : "Search make or model",
  );
  const inventory = $derived(
    vehicleListings.gridFourColumns.map((car) =>
      resolveInventoryVehicle(car, dealer.inventory),
    ),
  );
  const cars = $derived(purpose === "buy" ? inventory : rentalCars);
  const makes = $derived(saleMakes(inventory));
  const models = $derived(saleModels(inventory, buyMake));
  const buyCount = $derived(countResults(buyCriteria));
  const buyAction = $derived(
    locale.locale === "bg"
      ? `Виж ${buyCount} ${buyCount === 1 ? "автомобил" : "автомобила"}`
      : `View ${buyCount} ${buyCount === 1 ? "car" : "cars"}`,
  );
  const retainedFilters = $derived(
    purpose === "buy"
      ? phone.current
        ? !!(filters.budget || filters.yearFrom || filters.yearTo)
        : desktopCatalogFilterKeys.some(
            (key) =>
              !["q", "make", "model"].includes(key) && !!desktopFilters[key],
          )
      : !!(params.get("budget") || params.get("category")),
  );
  function countResults(value: VehicleSearchCriteria) {
    return purpose === "buy"
      ? phone.current
        ? matchCatalog(inventory, { ...filters, ...value }).length
        : matchDesktopCatalog(inventory, { ...desktopFilters, ...value }).length
      : filterRentalCars(
          rentalVehicleQuery(value),
          value.make,
          params.get("budget") ?? "",
          params.get("sort") ?? "",
          params.get("category") ?? "",
        ).length;
  }
  function apply(
    value: VehicleSearchCriteria & { pickup: string; returning: string },
  ) {
    const next = new URLSearchParams(params);
    for (const key of ["review", "preference", "car", "collection", "returnTo"])
      next.delete(key);
    if (purpose === "buy") {
      void goto(
        locale.href(
          catalogDestination(
            path,
            { ...filters, q: value.q, make: value.make, model: value.model },
            next,
            inResults ? page.url.hash : "#vehicle-results",
          ),
        ),
        { reset: !inResults },
      );
    } else {
      next.delete("model");
      value = { ...value, q: rentalVehicleQuery(value) };
      for (const key of ["q", "make", "pickup", "returning"] as const) {
        if (value[key]) next.set(key, value[key]);
        else next.delete(key);
      }
      void goto(
        locale.href(
          path +
            (next.size ? "?" + next.toString() : "") +
            (inResults ? page.url.hash : "#rental-results"),
        ),
        { reset: !inResults },
      );
    }
  }
  function openPicker(field: "make" | "model", trigger: HTMLButtonElement) {
    buyTrigger = trigger;
    picker.show(field, trigger);
  }
  function choose(field: "make" | "model", value: string) {
    if (field === "make") {
      if (value !== buyMake) buyModel = "";
      buyMake = value;
    } else buyModel = value;
    if (inResults) apply({ ...buyCriteria, pickup: "", returning: "" });
  }
  function keywords() {
    flushSync(() => {
      pickerOpen = false;
    });
    if (buyTrigger) editor.show(buyTrigger);
  }
  function applyBuy() {
    try {
      localStorage.setItem(
        vehicleSearchStorageKey,
        JSON.stringify(
          rememberVehicleSearch(
            localStorage.getItem(vehicleSearchStorageKey),
            buyCriteria,
            "buy",
          ),
        ),
      );
    } catch {
      /* Search works without storage. */
    }
    apply({ ...buyCriteria, pickup: "", returning: "" });
  }
</script>

<div
  class="marketplace-search hero-search"
  role="search"
  aria-label={locale.locale === "bg" ? "Търсене на автомобили" : "Search cars"}
>
  <div
    class={[
      "search-entry hero-search-grid",
      {
        "rental-entry": purpose === "rent",
        "purchase-entry": purpose === "buy",
      },
    ]}
  >
    {#if purpose === "rent"}
      <button
        type="button"
        class={[
          "date-option hero-search-field",
          { "is-empty": !request.pickup },
        ]}
        aria-haspopup="dialog"
        onclick={(event) => editor.show(event.currentTarget, "pickup")}
        ><span class="hero-search-label"
          >{locale.locale === "bg" ? "Вземане" : "Pick-up"}</span
        ><strong class="hero-search-value"
          >{request.pickup
            ? locale.date(request.pickup)
            : locale.locale === "bg"
              ? "Избери дата"
              : "Choose date"}</strong
        ><span class="hero-search-chevron" aria-hidden="true"
          ><MobileIcon name="chevron-down" size={14} /></span
        ></button
      >
      <button
        type="button"
        class={[
          "date-option hero-search-field",
          { "is-empty": !request.returning },
        ]}
        aria-haspopup="dialog"
        onclick={(event) => editor.show(event.currentTarget, "returning")}
        ><span class="hero-search-label"
          >{locale.locale === "bg" ? "Връщане" : "Return"}</span
        ><strong class="hero-search-value"
          >{request.returning
            ? locale.date(request.returning)
            : locale.locale === "bg"
              ? "Избери дата"
              : "Choose date"}</strong
        ><span class="hero-search-chevron" aria-hidden="true"
          ><MobileIcon name="chevron-down" size={14} /></span
        ></button
      >
    {:else}
      <button
        type="button"
        class={[
          "date-option hero-search-field",
          "make-option",
          { "is-empty": !buyMake },
        ]}
        aria-haspopup="dialog"
        aria-expanded={pickerOpen && pickerField === "make"}
        onclick={(event) => openPicker("make", event.currentTarget)}
        ><span class="hero-search-label">{locale.t("catalog.make")}</span
        ><strong class="hero-search-value"
          >{buyMake || (locale.locale === "bg" ? "Всички" : "Any")}</strong
        ><span class="hero-search-chevron" aria-hidden="true"
          ><MobileIcon name="chevron-down" size={14} /></span
        ></button
      >
      <button
        type="button"
        class={[
          "date-option hero-search-field",
          "model-option",
          { "is-empty": !buyModel },
        ]}
        disabled={!buyMake}
        aria-haspopup="dialog"
        aria-expanded={pickerOpen && pickerField === "model"}
        onclick={(event) => openPicker("model", event.currentTarget)}
        ><span class="hero-search-label">{locale.t("catalog.model")}</span
        ><strong class="hero-search-value"
          >{!buyMake
            ? locale.locale === "bg"
              ? "Първо марка"
              : "Make first"
            : buyModel || (locale.locale === "bg" ? "Всички" : "Any")}</strong
        ><span class="hero-search-chevron" aria-hidden="true"
          ><MobileIcon name="chevron-down" size={14} /></span
        ></button
      >
      {#if !inResults}<button
          type="button"
          class="buy-search-apply hero-search-action"
          aria-label={buyAction}
          onclick={applyBuy}
          ><MobileIcon name="search" size={18} />{locale.locale === "bg"
            ? "Търси"
            : "Search"}</button
        >{/if}
    {/if}
    {#if inResults || purpose === "rent"}
      <button
        type="button"
        class="catalogue-search-trigger hero-search-action"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={placeholder}
        onclick={(event) => editor.show(event.currentTarget)}
        ><MobileIcon name="search" size={18} /><span
          >{locale.locale === "bg" ? "Търси" : "Search"}</span
        ></button
      >
    {/if}
  </div>
</div>
<SaleChoicePicker
  bind:this={picker}
  bind:open={pickerOpen}
  bind:field={pickerField}
  make={buyMake}
  model={buyModel}
  {makes}
  {models}
  onselect={choose}
  onkeyword={keywords}
/>
<VehicleSearchPanel
  bind:this={editor}
  bind:open
  {purpose}
  {criteria}
  {cars}
  pickup={request.pickup}
  returning={request.returning}
  {retainedFilters}
  {countResults}
  {inResults}
  onapply={apply}
/>
