<script lang="ts">
  import { vehicles, money, number, detailHref } from "../lib/catalog";
  import { selections, toggleCompare } from "../lib/state.svelte";
  import Icon from "../components/Icon.svelte";
  let selected = $derived(
    selections.compare
      .map((id) => vehicles.find((v) => v.id === id)!)
      .filter(Boolean),
  );
  let rows = $derived([
    ["Price", ...selected.map((v) => money(v.price))],
    ["Body", ...selected.map((v) => v.body)],
    ["Condition", ...selected.map((v) => v.condition)],
    ["Year", ...selected.map((v) => String(v.year))],
    ["Mileage", ...selected.map((v) => `${number(v.mileage)} miles`)],
    ["Fuel", ...selected.map((v) => v.fuel)],
    ["Transmission", ...selected.map((v) => v.transmission)],
    ["Engine", ...selected.map((v) => `${v.engine}L`)],
    ["Drive", ...selected.map((v) => v.drive)],
    ["Doors", ...selected.map((v) => String(v.doors))],
    ["Seats", ...selected.map((v) => String(v.seats))],
  ]);
</script>

<div class="page-shell compare-page">
  <div class="container">
    <div class="breadcrumbs">
      <a href="/">Home</a>
      <span>/ Compare</span>
    </div>
    <div class="page-heading">
      <div>
        <h1>Compare Cars</h1>
        <p>Compare up to four cars side by side.</p>
      </div>
      {#if selected.length}<button
          class="button outline"
          onclick={() => [...selections.compare].forEach(toggleCompare)}
        >
          Clear comparison
        </button>{/if}
    </div>
    {#if selected.length}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables horizontal comparison scrolling.) -->
      <div
        class="comparison-scroll"
        tabindex="0"
        role="region"
        aria-label="Scrollable vehicle comparison"
      >
        <table class="comparison-table">
          <caption class="sr-only">
            Compare {selected.length} selected sample vehicles
          </caption>
          <thead>
            <tr>
              <th scope="col">Vehicle details</th>
              {#each selected as vehicle}<th scope="col">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    width="320"
                    height="210"
                  />
                  <a href={detailHref(vehicle)}>
                    {vehicle.title}
                    <Icon name="arrow" size={14} />
                  </a>
                  <button
                    aria-label={`Remove ${vehicle.title} from comparison`}
                    onclick={() => toggleCompare(vehicle.id)}
                  >
                    Remove <Icon name="close" size={14} />
                  </button>
                </th>{/each}{#if selected.length < 4}<th
                  scope="col"
                  class="compare-add"
                >
                  <a href="/inventory/">
                    <Icon name="plus" size={30} />Add another car
                  </a>
                </th>{/if}
            </tr>
          </thead>
          <tbody>
            {#each rows as [label, ...values]}<tr>
                <th scope="row">{label}</th>
                {#each values as value}<td>
                    {value}
                  </td>{/each}{#if selected.length < 4}<td></td>{/if}
              </tr>{/each}
          </tbody>
        </table>
      </div>
      <p class="fine-print">
        Sample specifications. Confirm the details with the seller before
        buying.
      </p>{:else}<div class="empty-state">
        <Icon name="compare" size={48} />
        <h2>Build your comparison</h2>
        <p>Select Compare on a car to add it here.</p>
        <a class="button" href="/inventory/">
          Browse Inventory <Icon name="arrow" size={16} />
        </a>
      </div>{/if}
  </div>
</div>
