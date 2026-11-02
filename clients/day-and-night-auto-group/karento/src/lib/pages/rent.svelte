<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { readRentalRequest } from "#lib/data/journeys.ts";
  import {
    rentalCars,
    rentalDays,
    filterRentalCars,
  } from "#lib/data/rental-catalog.ts";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleLandingHero from "#lib/sections/VehicleLandingHero.svelte";
  import MarketplaceSearch from "#lib/components/search/MarketplaceSearch.svelte";
  import RentalSearch from "#lib/components/search/RentalSearch.svelte";
  import RentalCatalogControls from "#lib/components/search/RentalCatalogControls.svelte";
  import RentalVehicleTile from "#lib/components/RentalVehicleTile.svelte";
  import Footer from "#lib/components/Footer.svelte";
  const locale = useLocale();
  const request = $derived(readRentalRequest(page.url.searchParams));
  let draftPickup = $derived(request.pickup);
  let draftReturning = $derived(request.returning);
  let draftPreference = $derived(request.preference);
  const query = $derived(
    page.url.searchParams.get("q") ??
      (page.url.searchParams.has("review") ? "" : request.preference),
  );
  const make = $derived(page.url.searchParams.get("make") ?? "");
  const budget = $derived(page.url.searchParams.get("budget") ?? "");
  const sort = $derived(page.url.searchParams.get("sort") ?? "");
  const category = $derived(page.url.searchParams.get("category") ?? "");
  const cars = $derived(filterRentalCars(query, make, budget, sort, category));
  const days = $derived(rentalDays(request.pickup, request.returning));
  const selected = $derived(
    rentalCars.find((car) => car.title === draftPreference),
  );
  let rental: RentalSearch;
  const title = $derived(
    locale.locale === "bg" ? "Коли под наем" : "Find your next rental",
  );
  function filter(value: {
    make: string;
    budget: string;
    sort: string;
    category: string;
    query: string;
  }) {
    const params = new URLSearchParams(page.url.searchParams.toString());
    params.delete("review");
    params.delete("preference");
    if (value.query.trim()) params.set("q", value.query.trim());
    else params.delete("q");
    for (const key of ["make", "budget", "sort", "category"] as const) {
      if (value[key]) params.set(key, value[key]);
      else params.delete(key);
    }
    void goto(
      locale.href(
        "/rent" +
          (params.size ? "?" + params.toString() : "") +
          "#rental-results",
      ),
      { reset: false },
    );
  }
  function chooseCar(title: string) {
    draftPickup = request.pickup;
    draftReturning = request.returning;
    draftPreference = title;
    void rental.openSearch();
  }
  function apply(value: {
    pickup: string;
    returning: string;
    preference: string;
  }) {
    const params = new URLSearchParams(page.url.searchParams.toString());
    for (const key of ["pickup", "returning", "preference"] as const) {
      if (value[key]) params.set(key, value[key]);
      else params.delete(key);
    }
    params.set("review", "1");
    void goto(locale.href("/rent?" + params.toString()));
  }
</script>

<PageMetadata {title} />
<main class="main rental-landing">
  <VehicleLandingHero {title}
    ><MarketplaceSearch mode="rent" /></VehicleLandingHero
  >
  <section
    class="container rental-results"
    id="rental-results"
    aria-label={title}
  >
    <RentalCatalogControls
      {make}
      {budget}
      {sort}
      {query}
      {category}
      count={cars.length}
      {days}
      onapply={filter}
    />
    <div class="rental-grid">
      {#each cars as car (car.id)}<RentalVehicleTile
          {car}
          {days}
          onclick={() => chooseCar(car.title)}
        />{/each}
    </div>
    {#if !cars.length}<div class="rental-empty">
        <p>
          {locale.locale === "bg"
            ? "Няма автомобили с тези критерии."
            : "No cars match these filters."}
        </p>
        <a href={locale.href("/rent")}
          >{locale.locale === "bg"
            ? "Виж всички автомобили"
            : "View all cars"}</a
        >
      </div>{/if}
  </section>
  <RentalSearch
    bind:this={rental}
    bind:pickup={draftPickup}
    bind:returning={draftReturning}
    bind:preference={draftPreference}
    autoReview
    onapply={apply}
    dailyRate={selected?.dailyRate}
  />
  <Footer />
</main>

<style>
  .rental-results {
    padding-top: 20px;
    padding-bottom: 48px;
    scroll-margin-top: 90px;
  }
  .rental-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px 24px;
    margin-top: 18px;
  }
  .rental-empty {
    display: grid;
    gap: 12px;
    padding: 32px 0;
  }
  .rental-empty a {
    color: inherit;
    text-decoration: underline;
  }
  @media (max-width: 991.98px) {
    .rental-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px 16px;
    }
  }
  @media (max-width: 767.98px) {
    .rental-results {
      padding-top: 16px;
      scroll-margin-top: 68px;
    }
    .rental-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px 12px;
      margin-top: 16px;
    }
  }
</style>
