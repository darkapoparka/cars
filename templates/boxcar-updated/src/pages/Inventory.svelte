<script lang="ts">
  import { vehicles, makes, bodies, fuels, number } from "../lib/catalog";
  import {
    emptyFilters,
    parseFilters,
    filterQuery,
    filterVehicles,
    type Filters,
  } from "../lib/domain";
  import { route, navigate } from "../lib/router.svelte";
  import { selections } from "../lib/state.svelte";
  import VehicleCard from "../components/VehicleCard.svelte";
  import Icon from "../components/Icon.svelte";
  let { savedOnly = false }: { savedOnly?: boolean } = $props();
  let filters = $derived(parseFilters(route.search));
  let draft = $state<Filters>({ ...emptyFilters }),
    error = $state(""),
    rows = $state(new URLSearchParams(route.search).get("view") === "rows");
  let desktopFilters = window.innerWidth >= 1000;
  let filterOpen = $state(desktopFilters);
  let available = $derived(
    savedOnly
      ? vehicles.filter((v) => selections.favorites.includes(v.id))
      : vehicles,
  );
  let results = $derived(filterVehicles(available, filters));
  let pages = $derived(Math.max(1, Math.ceil(results.length / 9)));
  let page = $derived(Math.min(filters.page, pages));
  let visible = $derived(results.slice((page - 1) * 9, page * 9));
  let models = $derived(
    [
      ...new Set(
        vehicles
          .filter((v) => !draft.make || v.make === draft.make)
          .map((v) => v.model),
      ),
    ].sort(),
  );
  let activeCount = $derived(
    Object.entries(filters).filter(
      ([key, value]) => !["page", "sort"].includes(key) && value !== "",
    ).length,
  );
  $effect(() => {
    draft = { ...filters };
    error = "";
    rows = new URLSearchParams(route.search).get("view") === "rows";
  });
  function resizeFilters() {
    const desktop = window.innerWidth >= 1000;
    if (desktop !== desktopFilters) {
      filterOpen = desktop;
      desktopFilters = desktop;
    }
  }
  function update(next: Partial<Filters>, view = rows) {
    const query = new URLSearchParams(filterQuery({ ...filters, ...next }));
    if (view) query.set("view", "rows");
    if (window.innerWidth < 1000) filterOpen = false;
    void navigate(
      (savedOnly ? "/favorites/" : "/inventory/") +
        (query.size ? `?${query}` : ""),
    );
  }
  function search(event: SubmitEvent) {
    event.preventDefault();
    if (draft.min && draft.max && Number(draft.min) > Number(draft.max)) {
      error = "Minimum price must be no greater than maximum price.";
      return;
    }
    update({ ...draft, page: 1 });
  }
</script>

<svelte:window onresize={resizeFilters} />

<div
  class="page-shell inventory-page bc-inner"
  class:has-inventory-banner={!savedOnly}
>
  {#if !savedOnly}
    <section class="inventory-banner" aria-labelledby="inventory-title">
      <div class="bc-container inventory-banner-inner">
        <div class="inventory-banner-copy">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Cars</span>
          </nav>
          <div class="page-heading">
            <div>
              <h1 id="inventory-title">Cars for sale</h1>
              <p>
                Find your next car. Save your favourites and compare the
                details.
              </p>
            </div>
          </div>
        </div>
        <img
          class="inventory-banner-art"
          src="/media/services/boxcar-browse-v1.webp"
          alt=""
          width="720"
          height="405"
        />
      </div>
    </section>
  {/if}
  <div class="container">
    {#if savedOnly}
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Saved cars</span>
      </nav>
      <div class="page-heading">
        <div>
          <h1>Your Saved Cars</h1>
          <p>Your favourites, ready for a closer look.</p>
        </div>
      </div>
    {/if}
    <div class="inventory-layout">
      <details class="inventory-filters" bind:open={filterOpen}>
        <summary>
          <Icon name="filter" />Filters {activeCount
            ? `(${activeCount})`
            : ""}<Icon name="chevron" size={16} />
        </summary>
        <form onsubmit={search} aria-label="Inventory filters">
          <h2>Search cars</h2>
          <label>
            Keyword
            <input
              bind:value={draft.q}
              type="search"
              placeholder="Make, model or year"
            />
          </label>
          <div class="filter-fields">
            <label>
              Condition
              <select aria-label="Condition" bind:value={draft.condition}>
                <option value="">Any</option>
                <option>New</option>
                <option>Used</option>
              </select>
            </label>
            <label>
              Make
              <select
                aria-label="Make"
                bind:value={draft.make}
                onchange={() => (draft.model = "")}
              >
                <option value="">Any</option>
                {#each makes as make}<option>{make}</option>{/each}
              </select>
            </label>
            <label>
              Model
              <select aria-label="Model" bind:value={draft.model}>
                <option value="">Any</option>
                {#each models as model}<option>{model}</option>{/each}
              </select>
            </label>
            <label>
              Body type
              <select aria-label="Body type" bind:value={draft.body}>
                <option value="">Any</option>
                {#each bodies as body}<option>{body}</option>{/each}
              </select>
            </label>
            <label>
              Fuel type
              <select aria-label="Fuel type" bind:value={draft.fuel}>
                <option value="">Any</option>
                {#each fuels as fuel}<option>{fuel}</option>{/each}
              </select>
            </label>
            <label>
              Year from
              <select aria-label="Year from" bind:value={draft.year}>
                <option value="">Any</option>
                {#each [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a) as year}<option
                    value={year}
                  >
                    {year}
                  </option>{/each}
              </select>
            </label>
            <label>
              Minimum price ($)
              <input
                type="number"
                min="0"
                bind:value={draft.min}
                placeholder="No minimum"
              />
            </label>
            <label>
              Maximum price ($)
              <input
                type="number"
                min="0"
                bind:value={draft.max}
                placeholder="No maximum"
              />
            </label>
          </div>
          {#if error}<p class="form-error" role="alert">{error}</p>{/if}
          <button class="button" type="submit">
            <Icon name="search" size={22} />Search cars
          </button>
          <button
            class="reset-button"
            type="button"
            onclick={() => update({ ...emptyFilters })}
          >
            Reset filters
          </button>
        </form>
      </details>
      <div class="inventory-results">
        <div class="results-toolbar">
          <p role="status" aria-live="polite">
            {results.length
              ? `Showing ${(page - 1) * 9 + 1}–${Math.min(page * 9, results.length)} of ${number(results.length)} cars`
              : "No matching cars"}
          </p>
          <div>
            <label class="sort-label">
              <span>Sort by</span>
              <select
                aria-label="Sort by"
                value={filters.sort}
                onchange={(e) =>
                  update({ sort: e.currentTarget.value, page: 1 })}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Lowest price</option>
                <option value="price-high">Highest price</option>
                <option value="newest">Newest first</option>
                <option value="mileage">Lowest mileage</option>
              </select>
            </label>
            <div class="view-toggle" aria-label="Inventory view">
              <button
                class:active={!rows}
                aria-label="Grid view"
                aria-pressed={!rows}
                onclick={() => update({}, false)}
              >
                <Icon name="grid" size={20} />
              </button>
              <button
                class:active={rows}
                aria-label="List view"
                aria-pressed={rows}
                onclick={() => update({}, true)}
              >
                <Icon name="list" size={20} />
              </button>
            </div>
          </div>
        </div>
        {#if activeCount}<div
            class="active-filters"
            aria-label="Active filters"
          >
            {#each Object.entries(filters).filter(([key, value]) => !["page", "sort"].includes(key) && value !== "") as [key, value]}<button
                aria-label={`Remove ${key} filter: ${value}`}
                onclick={() =>
                  update({
                    [key]: "",
                    ...(key === "make" ? { model: "" } : {}),
                    page: 1,
                  })}
              >
                {key === "min"
                  ? "From $"
                  : key === "max"
                    ? "Up to $"
                    : key === "year"
                      ? "From "
                      : ""}{value}<Icon name="close" size={13} />
              </button>{/each}
            <button onclick={() => update({ ...emptyFilters })}>
              Clear all
            </button>
          </div>{/if}
        <div class="vehicle-grid inventory-grid" class:list-view={rows}>
          {#each visible as vehicle (vehicle.id)}<VehicleCard
              {vehicle}
              layout={rows ? "row" : "grid"}
            />{/each}
        </div>
        {#if !results.length}<div class="empty-state">
            <Icon
              name={savedOnly && !available.length ? "bookmark" : "search"}
              size={44}
            />
            <h2>
              {savedOnly && !available.length
                ? "Your shortlist starts here"
                : "No cars match these filters"}
            </h2>
            <p>
              {savedOnly && !available.length
                ? "Save a car while browsing and find it here when you return."
                : "Try a wider price range or remove a filter to explore more cars."}
            </p>
            {#if savedOnly && !available.length}<a
                class="button"
                href="/inventory/"
              >
                Browse Cars <Icon name="arrow" size={16} />
              </a>{:else}<button
                class="button"
                onclick={() => update({ ...emptyFilters })}
              >
                Reset filters
              </button>{/if}
          </div>{/if}
        {#if pages > 1}<nav class="pagination" aria-label="Inventory pages">
            <button
              aria-label="Previous page"
              disabled={page === 1}
              onclick={() => update({ page: page - 1 })}
            >
              <Icon name="left" size={18} />
            </button>
            {#each Array.from({ length: pages }, (_, i) => i + 1) as n}<button
                aria-label={`Page ${n}`}
                aria-current={page === n ? "page" : undefined}
                class:active={page === n}
                onclick={() => update({ page: n })}
              >
                {n}
              </button>{/each}
            <button
              aria-label="Next page"
              disabled={page === pages}
              onclick={() => update({ page: page + 1 })}
            >
              <Icon name="right" size={18} />
            </button>
          </nav>{/if}
      </div>
    </div>
  </div>
</div>
