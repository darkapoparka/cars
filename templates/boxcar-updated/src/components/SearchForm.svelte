<script lang="ts">
  import { makes, vehicles, bodies } from "../lib/catalog";
  import { filterQuery } from "../lib/domain";
  import { navigate } from "../lib/router.svelte";
  import Icon from "./Icon.svelte";
  let {
    layout = "pill",
    tabs = true,
    extended = false,
    dark = false,
    initialCondition = "",
  }: {
    layout?: string;
    tabs?: boolean;
    extended?: boolean;
    dark?: boolean;
    initialCondition?: string;
  } = $props();
  let condition = $state(""),
    make = $state(""),
    model = $state(""),
    max = $state(""),
    body = $state("");
  $effect(() => {
    condition = initialCondition;
  });
  let models = $derived(
    [
      ...new Set(
        vehicles.filter((v) => !make || v.make === make).map((v) => v.model),
      ),
    ].sort(),
  );
  function search(event: SubmitEvent) {
    event.preventDefault();
    void navigate(
      "/inventory/" + filterQuery({ condition, make, model, max, body }),
    );
  }
</script>

<div class:dark class="search-component {layout}">
  {#if tabs}
    <div class="condition-tabs" aria-label="Vehicle condition">
      {#each [["", "All"], ["New", "New"], ["Used", "Used"]] as [value, label]}
        <button
          type="button"
          class:active={condition === value}
          aria-pressed={condition === value}
          onclick={() => (condition = value)}
        >
          {label}
        </button>
      {/each}
    </div>
  {/if}
  <form class="car-search" onsubmit={search} aria-label="Find a car">
    {#if !tabs}<label class="search-field">
        <span>Condition</span>
        <select bind:value={condition} aria-label="Condition">
          <option value="">All cars</option>
          <option>Used</option>
          <option>New</option>
        </select>
      </label>{/if}
    <label class="search-field">
      <span>Make</span>
      <select bind:value={make} onchange={() => (model = "")} aria-label="Make">
        <option value="">Any Makes</option>
        {#each makes as item}<option>{item}</option>{/each}
      </select>
    </label>
    <label class="search-field">
      <span>Model</span>
      <select bind:value={model} aria-label="Model">
        <option value="">Any Models</option>
        {#each models as item}<option>{item}</option>{/each}
      </select>
    </label>
    {#if extended}<label class="search-field">
        <span>Body type</span>
        <select bind:value={body} aria-label="Body type">
          <option value="">Any Body</option>
          {#each bodies as item}<option>{item}</option>{/each}
        </select>
      </label>{/if}
    <label class="search-field">
      <span>Price up to</span>
      <select bind:value={max} aria-label="Price up to">
        <option value="">Any Price</option>
        {#each [15000, 30000, 50000, 75000, 150000] as amount}<option
            value={amount}
          >
            ${amount.toLocaleString("en-US")}
          </option>{/each}
      </select>
    </label>
    <button class="button search-submit" type="submit">
      <Icon name="search" size={18} />
      <span>Search cars</span>
    </button>
  </form>
</div>
