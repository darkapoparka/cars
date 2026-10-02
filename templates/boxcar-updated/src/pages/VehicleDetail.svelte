<script lang="ts">
  import { showDialog } from "../lib/dialog";
  import { type Vehicle, money, number, vehicles } from "../lib/catalog";
  import { safeReturn } from "../lib/domain";
  import { route } from "../lib/router.svelte";
  import {
    selections,
    toggleFavorite,
    toggleCompare,
  } from "../lib/state.svelte";
  import EnquiryForm from "../components/EnquiryForm.svelte";
  import LoanCalculator from "../components/LoanCalculator.svelte";
  import VehicleCard from "../components/VehicleCard.svelte";
  import ShowroomCard from "../components/ShowroomCard.svelte";
  import Icon from "../components/Icon.svelte";
  let { vehicle }: { vehicle: Vehicle } = $props();
  let photo = $state(0),
    gallery: HTMLDialogElement,
    enquiry: HTMLDialogElement;
  let back = $derived(
    safeReturn(new URLSearchParams(route.search).get("return")),
  );
  let specs = $derived([
    ["Body", vehicle.body],
    ["Condition", vehicle.condition],
    ["Year", String(vehicle.year)],
    ["Mileage", `${number(vehicle.mileage)} miles`],
    ["Fuel Type", vehicle.fuel],
    ["Transmission", vehicle.transmission],
    ["Drive Type", vehicle.drive],
    ["Engine Size", `${vehicle.engine}L`],
    ["Color", vehicle.color],
    ["Doors", String(vehicle.doors)],
    ["Seats", String(vehicle.seats)],
  ]);
  let related = $derived(
    vehicles
      .filter(
        (v) =>
          v.id !== vehicle.id &&
          (v.make === vehicle.make || v.body === vehicle.body),
      )
      .slice(0, 4),
  );
  function changePhoto(direction: number) {
    photo =
      (photo + direction + vehicle.gallery.length) % vehicle.gallery.length;
  }
  function backdrop(event: PointerEvent) {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
</script>

<div class="page-shell detail-page">
  <div class="container">
    <nav class="detail-navigation" aria-label="Vehicle navigation">
      <a class="detail-back" href={back}>
        <Icon name="left" size={18} />
        <span>
          Back to {back.startsWith("/favorites")
            ? "saved cars"
            : back.startsWith("/home") || back === "/"
              ? "home"
              : "results"}
        </span>
      </a>
    </nav>
    <div class="detail-layout">
      <header class="detail-heading">
        <div>
          <h1>{vehicle.title}</h1>
          <p>
            {vehicle.year} · {vehicle.engine}L · {vehicle.transmission} · {vehicle.condition}
          </p>
        </div>
        <div class="detail-actions">
          <button
            class="button outline"
            aria-pressed={selections.favorites.includes(vehicle.id)}
            onclick={() => toggleFavorite(vehicle.id)}
          >
            <Icon name="bookmark" size={18} />
            <span>
              {selections.favorites.includes(vehicle.id) ? "Saved" : "Save car"}
            </span>
          </button>
          <button
            class="button outline"
            aria-pressed={selections.compare.includes(vehicle.id)}
            onclick={() => toggleCompare(vehicle.id)}
          >
            <Icon name="compare" size={18} />
            <span>
              {selections.compare.includes(vehicle.id)
                ? "Remove comparison"
                : "Compare"}
            </span>
          </button>
        </div>
      </header>
      <div class="detail-main">
        <div class="vehicle-gallery">
          <button
            class="gallery-image"
            aria-label={`Enlarge photo ${photo + 1} of ${vehicle.title}`}
            onclick={(event) => showDialog(gallery, event)}
          >
            <img
              src={vehicle.gallery[photo]}
              alt={`${vehicle.title} — photo ${photo + 1}`}
              width="931"
              height="550"
              fetchpriority="high"
            />
            <span>View photos <Icon name="plus" size={16} /></span>
          </button>
          {#if vehicle.gallery.length > 1}<div class="gallery-controls">
              <button
                class="icon-button"
                aria-label="Previous vehicle photo"
                onclick={() => changePhoto(-1)}
              >
                <Icon name="left" />
              </button>
              <span>{photo + 1} / {vehicle.gallery.length}</span>
              <button
                class="icon-button"
                aria-label="Next vehicle photo"
                onclick={() => changePhoto(1)}
              >
                <Icon name="right" />
              </button>
            </div>{/if}
          <div class="gallery-thumbs">
            {#each vehicle.gallery as image, i}<button
                class:active={photo === i}
                aria-label={`Show vehicle photo ${i + 1}`}
                aria-pressed={photo === i}
                onclick={() => (photo = i)}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  width="180"
                  height="110"
                />
              </button>{/each}
          </div>
        </div>
        <section class="detail-section">
          <h2>Car Overview</h2>
          <dl class="overview-grid">
            {#each specs as [label, value]}<div>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>{/each}
          </dl>
        </section>
        <section class="detail-section">
          <h2>Description</h2>
          <p>
            Explore this {vehicle.year}
            {vehicle.title}. Review its key specifications and compare it with
            the other cars on your shortlist.
          </p>
          <p>
            Contact the showroom for more information about its specification,
            condition, service history or availability.
          </p>
        </section>
        <section class="detail-section">
          <h2>Features</h2>
          <ul class="feature-list">
            {#each vehicle.features as feature}<li>
                <Icon name="check" size={17} />{feature}
              </li>{/each}
          </ul>
        </section>
        <div class="mobile-showroom">
          <ShowroomCard />
        </div>
        <details class="detail-finance">
          <summary>Finance estimate <Icon name="chevron" size={18} /></summary>
          <LoanCalculator startPrice={vehicle.price} />
        </details>
      </div>
      <aside class="detail-sidebar">
        <div class="detail-sidebar-stack">
          <div class="price-panel">
            {#if vehicle.badge}<span class="vehicle-badge">
                {vehicle.badge}
              </span>{/if}
            <strong>{money(vehicle.price)}</strong>
            <button
              class="button"
              onclick={(event) => showDialog(enquiry, event)}
            >
              <span>Enquire about this car</span>
              <Icon name="arrow" size={20} />
            </button>
            <a
              class="button outline"
              href={`/calculator/?price=${vehicle.price}`}
            >
              <span>Calculate repayments</span>
              <Icon name="arrow" size={20} />
            </a>
          </div>
          <div class="seller-info">
            <ShowroomCard />
          </div>
        </div>
      </aside>
    </div>
    {#if related.length}<section class="section related-section">
        <div class="section-heading">
          <h2>You May Also Like</h2>
          <a href="/inventory/">View All <Icon name="arrow" size={16} /></a>
        </div>
        <div class="vehicle-grid">
          {#each related as item}<VehicleCard vehicle={item} />{/each}
        </div>
      </section>{/if}
  </div>
</div>
<dialog
  class="photo-dialog"
  bind:this={gallery}
  aria-label={`${vehicle.title} photo gallery`}
  onpointerdown={backdrop}
>
  <div class="dialog-top">
    <h2>{vehicle.title}</h2>
    <button
      class="icon-button"
      aria-label="Close photo gallery"
      onclick={() => gallery.close()}
    >
      <Icon name="close" />
    </button>
  </div>
  <img
    src={vehicle.gallery[photo]}
    alt={`${vehicle.title} — photo ${photo + 1}`}
  />
  <div class="dialog-gallery-controls">
    <button
      class="icon-button"
      aria-label="Previous enlarged photo"
      onclick={() => changePhoto(-1)}
    >
      <Icon name="left" />
    </button>
    <span>{photo + 1} / {vehicle.gallery.length}</span>
    <button
      class="icon-button"
      aria-label="Next enlarged photo"
      onclick={() => changePhoto(1)}
    >
      <Icon name="right" />
    </button>
  </div>
</dialog>
<dialog
  class="enquiry-dialog"
  bind:this={enquiry}
  aria-labelledby="enquiry-title"
  onpointerdown={backdrop}
>
  <div class="dialog-top">
    <h2 id="enquiry-title">Enquire about this car</h2>
    <button
      class="icon-button"
      aria-label="Close enquiry"
      onclick={() => enquiry.close()}
    >
      <Icon name="close" />
    </button>
  </div>
  <EnquiryForm vehicle={vehicle.title} />
</dialog>
