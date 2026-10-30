<script lang="ts">
  import { site } from "#lib/config/site.ts";
  import { attr, makes, vehicles, type Vehicle } from "#lib/data/vehicles.ts";
  import { currentLocale, t } from "#lib/i18n/index.ts";
  import VehicleCard from "#lib/components/VehicleCard.svelte";

  type Sort = "newest" | "priceAsc" | "priceDesc" | "yearDesc";

  const locale = $derived(currentLocale());
  const m = $derived(t());

  const bodies = [...new Set(vehicles.map((v) => v.body))].sort();
  const fuels = [...new Set(vehicles.map((v) => v.fuel))].sort();

  let query = $state("");
  let make = $state("");
  let body = $state("");
  let fuel = $state("");
  let sort = $state<Sort>("newest");

  const sorters: Record<Sort, ((a: Vehicle, b: Vehicle) => number) | null> = {
    newest: null,
    priceAsc: (a, b) => (a.priceEur ?? Infinity) - (b.priceEur ?? Infinity),
    priceDesc: (a, b) => (b.priceEur ?? -Infinity) - (a.priceEur ?? -Infinity),
    yearDesc: (a, b) => (b.year ?? 0) - (a.year ?? 0),
  };

  const results = $derived.by(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = vehicles.filter((v) => {
      const text = `${v.make} ${v.model}`.toLowerCase();
      return (
        (!make || v.make === make) &&
        (!body || v.body === body) &&
        (!fuel || v.fuel === fuel) &&
        words.every((w) => text.includes(w))
      );
    });
    const compare = sorters[sort];
    return compare ? list.toSorted(compare) : list;
  });

  const filtered = $derived(Boolean(query || make || body || fuel));

  function reset() {
    query = make = body = fuel = "";
    sort = "newest";
  }
</script>

<svelte:head>
  <title>{m.collection.title} · {site.name}</title>
  <meta name="description" content={m.collection.lead} />
</svelte:head>

<section class="container page">
  <header class="intro">
    <p class="label">{site.name}</p>
    <h1 class="display">{m.collection.title}</h1>
    <p class="muted">{m.collection.lead}</p>
  </header>

  <div class="filters" role="search">
    <label class="field search">
      <span class="visually-hidden">{m.collection.search}</span>
      <input
        type="search"
        placeholder={m.collection.search}
        bind:value={query}
      />
    </label>
    <label class="field select">
      <span class="label">{m.collection.make}</span>
      <select bind:value={make}>
        <option value="">{m.collection.any}</option>
        {#each makes as option (option)}<option value={option}>{option}</option
          >{/each}
      </select>
    </label>
    <label class="field select">
      <span class="label">{m.collection.body}</span>
      <select bind:value={body}>
        <option value="">{m.collection.any}</option>
        {#each bodies as option (option)}<option value={option}
            >{attr(option, locale)}</option
          >{/each}
      </select>
    </label>
    <label class="field select">
      <span class="label">{m.collection.fuel}</span>
      <select bind:value={fuel}>
        <option value="">{m.collection.any}</option>
        {#each fuels as option (option)}<option value={option}
            >{attr(option, locale)}</option
          >{/each}
      </select>
    </label>
    <label class="field select">
      <span class="label">{m.collection.sort}</span>
      <select bind:value={sort}>
        {#each Object.entries(m.collection.sortOptions) as [value, label] (value)}
          <option {value}>{label}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="summary">
    <p class="label" aria-live="polite">
      {m.collection.results(results.length)}
    </p>
    {#if filtered}
      <button class="text-link reset" onclick={reset}
        >{m.collection.reset}</button
      >
    {/if}
  </div>

  {#if results.length}
    <ul class="grid">
      {#each results as vehicle, i (vehicle.id)}
        <li><VehicleCard {vehicle} eager={i < 3} /></li>
      {/each}
    </ul>
  {:else}
    <div class="empty">
      <p class="display">{m.collection.empty}</p>
      <button class="button" onclick={reset}>{m.collection.reset}</button>
    </div>
  {/if}
</section>

<style>
  .page {
    padding-top: calc(var(--header) + clamp(3rem, 8vw, 6rem));
    padding-bottom: var(--section);
  }

  .intro h1 {
    margin-block: 1rem;
    font-size: var(--step-4);
  }

  .intro p:last-child {
    max-width: 34rem;
  }

  .filters {
    position: sticky;
    top: var(--header);
    z-index: 10;
    display: grid;
    grid-template-columns: 2fr repeat(4, 1fr);
    gap: 0 1.5rem;
    margin-top: clamp(2.5rem, 6vw, 4.5rem);
    padding-block: 1rem;
    background: var(--bg);
    border-block: 1px solid var(--line);
  }

  .field {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .search {
    align-self: end;
  }

  input,
  select {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.375rem 0;
    border: 0;
    border-bottom: 1px solid transparent;
    border-radius: 0;
    background: transparent;
    font-size: var(--step-0);
    cursor: pointer;
    transition: border-color var(--fast) ease;
  }

  input {
    cursor: text;
    font-size: var(--step-1);
  }

  input:focus,
  select:focus {
    outline: none;
    border-bottom-color: var(--accent);
  }

  select {
    appearance: none;
    padding-right: 1.25rem;
  }

  .select {
    position: relative;
  }

  .select::after {
    content: "";
    position: absolute;
    right: 0.25rem;
    bottom: 1.25rem;
    width: 0.375rem;
    height: 0.375rem;
    border-right: 1px solid currentColor;
    border-bottom: 1px solid currentColor;
    transform: rotate(45deg);
    pointer-events: none;
  }

  option {
    background: var(--raised);
    color: var(--text);
  }

  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 1.75rem 2.5rem;
  }

  .reset {
    border: 0;
    background: none;
    padding: 0;
    cursor: pointer;
    color: var(--muted);
  }

  .reset:hover {
    color: var(--text);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(2.5rem, 4vw, 3.5rem) clamp(1.25rem, 2.5vw, 2.5rem);
  }

  .empty {
    display: grid;
    justify-items: start;
    gap: 1.5rem;
    padding-block: 4rem;
  }

  .empty p {
    font-size: var(--step-2);
  }

  @media (max-width: 64rem) {
    .filters {
      grid-template-columns: repeat(2, 1fr);
      position: static;
    }

    .search {
      grid-column: 1 / -1;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 40rem) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
