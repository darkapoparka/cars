<script lang="ts">
  import { type HomeSection } from "../data/homes";
  import { vehicles } from "../lib/catalog";
  import { filterQuery } from "../lib/domain";
  import VehicleCard from "./VehicleCard.svelte";
  import Icon from "./Icon.svelte";
  let { section }: { section: HomeSection } = $props();
  let selected = $state("");
  let group = $derived(section.group || "condition");
  let options = $derived(
    group === "make"
      ? ["Audi", "BMW", "Mercedes-Benz", "Ford"]
      : group === "body"
        ? ["SUV", "Sedan", "Truck", "Hybrid"]
        : group === "none"
          ? []
          : ["New", "Used", "All"],
  );
  let filtered = $derived(
    vehicles.filter(
      (v) =>
        !selected ||
        selected === "All" ||
        (group === "make"
          ? v.make === selected
          : group === "body"
            ? v.body === selected || v.fuel === selected
            : v.condition === selected),
    ),
  );
  let cards = $derived(
    (section.style === "specials"
      ? filtered.slice().sort((a, b) => a.price - b.price)
      : filtered
    ).slice(0, section.style === "large" ? 3 : 4),
  );
  let layout = $derived(
    ["rows", "dark"].includes(section.style || "")
      ? "row"
      : section.style === "large"
        ? "feature"
        : "grid",
  );
</script>

<section
  class="section vehicle-shelf shelf-{section.style || 'standard'}"
  aria-label={section.title}
>
  <div class="container">
    <div class="section-heading">
      <h2>{section.title || "Explore All Vehicles"}</h2>
      <a
        href={"/inventory/" +
          filterQuery(
            group === "make"
              ? { make: selected }
              : group === "body"
                ? selected === "Hybrid"
                  ? { fuel: selected }
                  : { body: selected }
                : { condition: selected === "All" ? "" : selected },
          )}
      >
        View All <Icon name="arrow" size={16} />
      </a>
    </div>
    {#if options.length}<div class="shelf-tabs" aria-label="Filter vehicles">
        <button
          class:active={!selected}
          aria-pressed={!selected}
          onclick={() => (selected = "")}
        >
          All cars
        </button>
        {#each options.filter((o) => o !== "All") as option}<button
            class:active={selected === option}
            aria-pressed={selected === option}
            onclick={() => (selected = option)}
          >
            {option}{group === "condition" ? " Cars" : ""}
          </button>{/each}
      </div>{/if}
    <div
      class="vehicle-grid"
      class:row-grid={layout === "row"}
      class:three-grid={layout === "feature"}
    >
      {#each cards as vehicle (vehicle.id)}<VehicleCard
          {vehicle}
          {layout}
          dark={section.style === "dark"}
        />{/each}
    </div>
    {#if !cards.length}<div class="empty-state">
        <h3>No cars in this category yet</h3>
        <p>Browse the complete sample inventory to find another option.</p>
        <button class="button" onclick={() => (selected = "")}>
          Show all cars
        </button>
      </div>{/if}
  </div>
</section>
