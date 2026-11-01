<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    budgets,
    filterCars,
    inventoryUrl,
    money,
    rentalDateError,
    nextDate,
    type Filters,
    type ShowroomData,
  } from "../showroom";
  import Icon from "./Icon.svelte";
  import Sheet from "./Sheet.svelte";
  import CarCard from "./CarCard.svelte";
  import "./dealer-page.css";

  let { data, kind }: { data: ShowroomData; kind: "home" | "cars" } = $props();
  let filters: Filters = $derived({ ...data.filters });
  let mode = $state<"buy" | "rent">("buy");
  let picker = $state<"make" | "model" | "budget">("make");
  let query = $state("");
  let pickerSheet: Sheet;
  let requestSheet: Sheet;
  let menuSheet: Sheet;
  let request = $state("");
  let pickup = $state("");
  let dropoff = $state("");
  let rentalType = $state("Any vehicle type");
  let dateError = $state("");
  const services = [
    {
      key: "import",
      icon: "import",
      title: "Import a car",
      detail: "Your next car, sourced abroad.",
      description:
        "Tell the team the make, model and budget you have in mind. Discuss sourcing, checks, transport and the next steps.",
    },
    {
      key: "valuation",
      icon: "value",
      title: "Value my car",
      detail: "A clear next step for your car.",
      description:
        "Discuss your car, its condition and history with the team. A valuation follows a review of the vehicle; this preview does not calculate an offer.",
    },
    {
      key: "servicing",
      icon: "service",
      title: "Servicing",
      detail: "Care for the car you drive.",
      description:
        "Discuss maintenance or a repair with the team. Confirm the work, timing and price before arranging a visit.",
    },
    {
      key: "transport",
      icon: "transport",
      title: "Vehicle transport",
      detail: "From collection to destination.",
      description:
        "Discuss the vehicle, collection point and destination. The team will confirm transport options and a quote.",
    },
  ];
  const visibleServices = $derived(
    services.filter((service) => data.business.services.includes(service.key)),
  );
  const makes = $derived([...new Set(data.cars.map((car) => car.make))].sort());
  const models = $derived(
    [
      ...new Set(
        data.cars
          .filter((car) => !filters.make || car.make === filters.make)
          .map((car) => car.model),
      ),
    ].sort(),
  );
  const matches = $derived(filterCars(data.cars, filters));
  const activeCount = $derived(
    [filters.make, filters.model, filters.budget].filter(Boolean).length,
  );
  const clearUrl = $derived(
    inventoryUrl({ ...filters, make: "", model: "", budget: "" }),
  );
  const pickerTitle = $derived(
    picker === "make"
      ? "Choose a make"
      : picker === "model"
        ? "Choose a model"
        : "Choose your budget",
  );
  const selected = $derived(filters[picker]);
  const choices = $derived(
    picker === "budget"
      ? budgets.map((budget) => ({
          value: String(budget),
          label: "Up to " + money(budget),
        }))
      : (picker === "make" ? makes : models).map((value) => ({
          value,
          label: value,
        })),
  );
  const shownChoices = $derived(
    choices.filter((choice) =>
      choice.label.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
  const requestService = $derived(
    services.find((service) => service.title === request),
  );
  const stockDate = $derived(
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(data.business.observedAt)),
  );

  function openPicker(which: typeof picker) {
    picker = which;
    query = "";
    void pickerSheet.open();
  }
  function choose(value: string) {
    if (picker === "make") {
      filters = { ...filters, make: value, model: "" };
    } else if (picker === "model") {
      filters = {
        ...filters,
        model: value,
        make:
          filters.make ||
          (value
            ? data.cars.find((car) => car.model === value)?.make || ""
            : ""),
      };
    } else filters = { ...filters, budget: value };
    pickerSheet.close();
    if (kind === "cars") void goto(inventoryUrl(filters), { reset: false });
  }
  function browse(event?: SubmitEvent) {
    event?.preventDefault();
    void goto(inventoryUrl(filters));
  }
  function changeSort(value: string) {
    filters = { ...filters, sort: value };
    void goto(inventoryUrl(filters), { reset: false });
  }
  function openRequest(title: string) {
    request = title;
    void requestSheet.open();
  }
  function requestRental(event: SubmitEvent) {
    event.preventDefault();
    dateError = rentalDateError(pickup, dropoff, data.today);
    if (!dateError) openRequest("Rent a vehicle");
  }
  function keyboardChoices(event: KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      document
        .querySelector<HTMLButtonElement>(".dn-picker-options button")
        ?.focus();
    }
    if (event.key === "Enter" && query.trim() && shownChoices.length) {
      event.preventDefault();
      choose(shownChoices[0].value);
    }
  }
</script>

<svelte:head>
  <title>{kind === "home" ? "Home" : "Cars"} | {data.business.name}</title>
  <meta
    name="description"
    content="Explore Day & Night Auto Group in Sofia. Cars, import, valuations, servicing, rental and vehicle transport."
  />
  <link rel="icon" href="/dealer-brand/icon.png" />
</svelte:head>

<div class="dn-site" data-dealer={data.business.slug}>
  <a class="dn-skip" href="#main-content">Skip to content</a>
  <header class="dn-header dn-container">
    <a class="dn-logo" href="/" aria-label="Day & Night Home"
      ><img
        src={data.business.logo}
        alt={data.business.name}
        width="205"
        height="62"
      /></a
    >
    <nav class="dn-desktop-nav" aria-label="Main navigation">
      <a href="/" aria-current={kind === "home" ? "page" : undefined}>Home</a>
      <a href="/vehicles" aria-current={kind === "cars" ? "page" : undefined}
        >Cars</a
      >
      <a href="/#services">Services</a><a href="/about" data-sveltekit-reload
        >About us</a
      ><a href="/contact" data-sveltekit-reload>Contact</a>
    </nav>
    <div class="dn-header-actions">
      <a
        class="dn-phone"
        href={data.business.phoneHref}
        aria-label={"Call " + data.business.phoneDisplay}
        ><Icon name="phone" /><span>{data.business.phoneDisplay}</span></a
      ><button
        type="button"
        class="dn-icon-button dn-menu-opener"
        aria-label="Open menu"
        onclick={() => menuSheet.open()}><Icon name="menu" /></button
      >
    </div>
  </header>

  <main id="main-content" tabindex="-1">
    {#if kind === "home"}
      <section class="dn-home-intro dn-container" aria-labelledby="home-title">
        <div class="dn-hero">
          <img
            class="dn-hero-image"
            src="/assets/imgs/hero/hero-3/banner.png"
            alt="Illustrative premium car outside a modern showroom"
            width="1920"
            height="900"
            fetchpriority="high"
          />
          <div class="dn-hero-copy">
            <p>DAY & NIGHT AUTO GROUP · SOFIA</p>
            <h1 id="home-title">Your next car.<br />Everything around it.</h1>
            <span>Buy, rent, import. Make your next move.</span>
          </div>
        </div>
        <div class="dn-search-card">
          <div class="dn-modes" role="group" aria-label="Buy or rent a car">
            <label
              ><input
                type="radio"
                name="mode"
                value="buy"
                bind:group={mode}
              /><span><Icon name="car" size={18} />Buy a car</span></label
            >
            <label
              ><input
                type="radio"
                name="mode"
                value="rent"
                bind:group={mode}
              /><span><Icon name="calendar" size={18} />Rent a car</span></label
            >
          </div>
          {#if mode === "buy"}
            <form
              class="dn-search-fields"
              action="/vehicles"
              method="get"
              onsubmit={browse}
            >
              <button
                type="button"
                class="dn-search-field"
                aria-haspopup="dialog"
                onclick={() => openPicker("make")}
                ><Icon name="car" /><span
                  ><small>Make</small><strong
                    >{filters.make || "Any make"}</strong
                  ></span
                ><Icon name="chevron" size={16} /></button
              >
              <button
                type="button"
                class="dn-search-field"
                aria-haspopup="dialog"
                onclick={() => openPicker("model")}
                ><Icon name="search" /><span
                  ><small>Model</small><strong
                    >{filters.model || "Any model"}</strong
                  ></span
                ><Icon name="chevron" size={16} /></button
              >
              <button
                type="button"
                class="dn-search-field"
                aria-haspopup="dialog"
                onclick={() => openPicker("budget")}
                ><Icon name="value" /><span
                  ><small>Budget</small><strong
                    >{filters.budget
                      ? "Up to " + money(Number(filters.budget))
                      : "Any budget"}</strong
                  ></span
                ><Icon name="chevron" size={16} /></button
              >
              <input type="hidden" name="make" value={filters.make} /><input
                type="hidden"
                name="model"
                value={filters.model}
              /><input type="hidden" name="budget" value={filters.budget} />
              <button class="dn-primary" type="submit"
                ><Icon name="search" size={19} />Show {matches.length}
                {matches.length === 1 ? "car" : "cars"}</button
              >
            </form>
          {:else}
            <form
              class="dn-search-fields dn-rental-fields"
              onsubmit={requestRental}
            >
              <label class="dn-date-field"
                ><small>Pickup date</small><input
                  type="date"
                  aria-label="Pickup date"
                  min={data.today}
                  bind:value={pickup}
                  oninput={() => (dateError = "")}
                  aria-invalid={dateError ? true : undefined}
                  aria-describedby={dateError
                    ? "dn-rental-date-error"
                    : undefined}
                  required
                /></label
              >
              <label class="dn-date-field"
                ><small>Return date</small><input
                  type="date"
                  aria-label="Return date"
                  min={nextDate(pickup || data.today)}
                  bind:value={dropoff}
                  oninput={() => (dateError = "")}
                  aria-invalid={dateError ? true : undefined}
                  aria-describedby={dateError
                    ? "dn-rental-date-error"
                    : undefined}
                  required
                /></label
              >
              <label class="dn-date-field"
                ><small>Preference</small><select
                  aria-label="Rental vehicle preference"
                  bind:value={rentalType}
                  ><option>Any vehicle type</option><option>City car</option
                  ><option>Premium car</option><option>SUV</option><option
                    >Van</option
                  ></select
                ></label
              >
              <button class="dn-primary" type="submit"
                >Ask about availability<Icon name="arrow" size={18} /></button
              >
              {#if dateError}<p
                  class="dn-date-error"
                  id="dn-rental-date-error"
                  role="alert"
                >
                  {dateError}
                </p>{/if}
            </form>
            <p class="dn-rental-note">
              Vehicle options and rates are confirmed directly with the team.
            </p>
          {/if}
        </div>
      </section>

      <section
        id="services"
        class="dn-container dn-services"
        aria-label="More ways we can help"
      >
        {#each visibleServices as service (service.key)}
          <button
            type="button"
            class="dn-service-tile"
            aria-haspopup="dialog"
            onclick={() => openRequest(service.title)}
            ><span class="dn-service-icon"
              ><Icon name={service.icon} size={23} /></span
            ><span
              ><strong>{service.title}</strong><small>{service.detail}</small
              ></span
            ><Icon name="chevron" size={17} /></button
          >
        {/each}
      </section>

      {#if mode === "buy"}
        <section class="dn-container dn-stock" aria-labelledby="stock-title">
          <div class="dn-section-heading">
            <div>
              <p class="dn-eyebrow">THE COLLECTION</p>
              <h2 id="stock-title">Find your next car.</h2>
            </div>
            <a class="dn-browse-link" href="/vehicles"
              >All cars<Icon name="arrow" size={18} /></a
            >
          </div>
          <div class="dn-make-rail" aria-label="Browse cars by make">
            <a class="is-active" href="/vehicles">All makes</a
            >{#each makes as make (make)}<a
                href={inventoryUrl({ ...filters, make, model: "", budget: "" })}
                >{make}</a
              >{/each}
          </div>
          <div class="dn-car-grid">
            {#each data.cars.slice(0, 4) as car (car.id)}<CarCard
                {car}
              />{/each}
          </div>
        </section>
      {/if}
      <section class="dn-container dn-ownership">
        <div>
          <p class="dn-eyebrow">BEYOND THE KEYS</p>
          <h2>One team.<br />Every next step.</h2>
        </div>
        <div>
          <p>
            From finding the right car to keeping it moving. Talk to Day & Night
            about buying, importing, servicing or transporting your vehicle.
          </p>
          <a class="dn-text-link" href="/contact" data-sveltekit-reload
            >Talk to the team<Icon name="arrow" size={18} /></a
          >
        </div>
      </section>
    {:else}
      <section class="dn-container dn-cars-intro">
        <p class="dn-eyebrow"><a href="/">Home</a><span>/</span>Cars</p>
        <h1>Find your next car.</h1>
        <p>Explore the Day & Night collection.</p>
      </section>
      <section
        class="dn-container dn-catalogue"
        aria-label="Vehicle collection"
      >
        <div class="dn-catalogue-filters">
          <button
            type="button"
            aria-haspopup="dialog"
            onclick={() => openPicker("make")}
            >{filters.make || "Any make"}<Icon
              name="chevron"
              size={16}
            /></button
          >
          <button
            type="button"
            aria-haspopup="dialog"
            onclick={() => openPicker("model")}
            >{filters.model || "Any model"}<Icon
              name="chevron"
              size={16}
            /></button
          >
          <button
            type="button"
            aria-haspopup="dialog"
            onclick={() => openPicker("budget")}
            >{filters.budget
              ? "Up to " + money(Number(filters.budget))
              : "Any budget"}<Icon name="chevron" size={16} /></button
          >
          <button
            type="button"
            class="dn-apply-filters"
            disabled={!activeCount}
            onclick={() => goto(clearUrl, { reset: false })}
            >Reset filters</button
          >
        </div>
        <div class="dn-results-bar">
          <p role="status">
            <strong>{matches.length}</strong>
            {matches.length === 1 ? "car" : "cars"}
          </p>
          <div class="dn-results-controls">
            <label
              ><span class="dn-sr-only">Sort cars</span><select
                aria-label="Sort cars"
                value={filters.sort}
                onchange={(event) => changeSort(event.currentTarget.value)}
                ><option value="featured">Featured</option><option
                  value="price-asc">Price: low to high</option
                ><option value="price-desc">Price: high to low</option><option
                  value="year-desc">Year: newest first</option
                ></select
              ></label
            >
            <div class="dn-view-toggle" aria-label="Display cars">
              <a
                aria-label="Grid view"
                aria-current={filters.view === "grid" ? "true" : undefined}
                href={inventoryUrl({ ...filters, view: "grid" })}
                ><Icon name="grid" size={18} /></a
              ><a
                aria-label="List view"
                aria-current={filters.view === "list" ? "true" : undefined}
                href={inventoryUrl({ ...filters, view: "list" })}
                ><Icon name="list" size={19} /></a
              >
            </div>
          </div>
        </div>
        {#if matches.length}<div
            class={["dn-car-grid", { "dn-list": filters.view === "list" }]}
          >
            {#each matches as car (car.id)}<CarCard
                {car}
                list={filters.view === "list"}
              />{/each}
          </div>
        {:else}<div class="dn-empty">
            <Icon name="search" size={32} />
            <h2>No cars match these choices.</h2>
            <p>
              Try another make, model or budget—or talk to us about sourcing
              your car.
            </p>
            <a class="dn-primary" href="/vehicles">Show all cars</a>
          </div>{/if}
      </section>
    {/if}
  </main>

  <footer class="dn-footer dn-container">
    <p class="dn-stock-notice">
      Vehicle samples dated {stockDate}. Confirm price and availability with the
      showroom.
    </p>
    <div class="dn-footer-main">
      <div>
        <img
          src={data.business.logo}
          alt={data.business.name}
          width="180"
          height="55"
        />
        <p>{data.business.address}</p>
      </div>
      <div>
        <span>LET’S TALK</span><a
          class="dn-footer-phone"
          href={data.business.phoneHref}
          >{data.business.phoneDisplay}<Icon name="arrow" /></a
        >
        <p>Visits by arrangement.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/contact" data-sveltekit-reload>Contact</a><a
          href="/about"
          data-sveltekit-reload>About Day & Night</a
        ><a href="/shop" data-sveltekit-reload>Shop</a><a
          href="/login"
          data-sveltekit-reload>Account</a
        >
      </nav>
    </div>
    <div class="dn-footer-bottom">
      <span>© 2026 {data.business.name}</span><span
        >Independent design preview</span
      >
    </div>
  </footer>

  <nav class="dn-bottom-nav" aria-label="Mobile navigation">
    <a href="/" aria-current={kind === "home" ? "page" : undefined}
      ><Icon name="home" /><span>Home</span></a
    ><a href="/vehicles" aria-current={kind === "cars" ? "page" : undefined}
      ><Icon name="car" /><span>Cars</span></a
    ><a href="/#services"><Icon name="service" /><span>Services</span></a
    ><button type="button" onclick={() => menuSheet.open()}
      ><Icon name="menu" /><span>Menu</span></button
    >
  </nav>
</div>

<Sheet bind:this={pickerSheet} title={pickerTitle}>
  <div class="dn-picker-search">
    <Icon name="search" /><input
      data-initial-focus
      aria-label="Search options"
      placeholder={picker === "budget"
        ? "Search budgets"
        : "Search " + picker + "s"}
      bind:value={query}
      onkeydown={keyboardChoices}
    />
  </div>
  <div class="dn-picker-options">
    <button type="button" aria-pressed={!selected} onclick={() => choose("")}
      >{picker === "make"
        ? "Any make"
        : picker === "model"
          ? "Any model"
          : "Any budget"}{#if !selected}<Icon name="check" />{/if}</button
    >{#each shownChoices as choice (choice.value)}<button
        type="button"
        aria-pressed={selected === choice.value}
        onclick={() => choose(choice.value)}
        >{choice.label}{#if selected === choice.value}<Icon
            name="check"
          />{/if}</button
      >{/each}{#if !shownChoices.length}<p class="dn-no-options">
        No matches. Try another search.
      </p>{/if}
  </div>
</Sheet>
<Sheet bind:this={requestSheet} title={request}>
  <div class="dn-request">
    <span class="dn-request-icon"
      ><Icon name={requestService?.icon || "calendar"} size={28} /></span
    >
    <p>
      {requestService?.description ||
        "Tell us when you need a vehicle. The team will confirm suitable options, availability and the rental price with you."}
    </p>
    {#if request === "Rent a vehicle"}<dl>
        <div>
          <dt>Pickup</dt>
          <dd>{pickup}</dd>
        </div>
        <div>
          <dt>Return</dt>
          <dd>{dropoff}</dd>
        </div>
        <div>
          <dt>Preference</dt>
          <dd>{rentalType}</dd>
        </div>
      </dl>
      <p class="dn-request-note">
        Your preferences are ready to discuss. This is not a reservation.
      </p>{/if}<a class="dn-primary" href={data.business.phoneHref}
      ><Icon name="phone" />Call {data.business.phoneDisplay}</a
    ><a
      class="dn-request-contact"
      href={"/contact?service=" + encodeURIComponent(request)}
      data-sveltekit-reload
      >Showroom & contact details<Icon name="arrow" size={17} /></a
    >
    <p class="dn-request-address">
      <Icon name="pin" size={18} />{data.business.address}
    </p>
  </div>
</Sheet>
<Sheet bind:this={menuSheet} title="Day & Night">
  <nav class="dn-menu-links" aria-label="All pages">
    <a href="/">Home<Icon name="arrow" /></a><a href="/vehicles"
      >Cars<Icon name="arrow" /></a
    ><a href="/#services" onclick={() => menuSheet.close()}
      >Services<Icon name="arrow" /></a
    ><a href="/about" data-sveltekit-reload>About us<Icon name="arrow" /></a><a
      href="/contact"
      data-sveltekit-reload>Contact<Icon name="arrow" /></a
    ><a href="/shop" data-sveltekit-reload>Shop<Icon name="arrow" /></a><a
      href="/login"
      data-sveltekit-reload>Account<Icon name="arrow" /></a
    >
  </nav>
</Sheet>
