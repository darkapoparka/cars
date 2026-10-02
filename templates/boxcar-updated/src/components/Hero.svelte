<script lang="ts">
  import { type HomeDesign } from "../data/homes";
  import {
    vehicles,
    vehicleBySlug,
    money,
    number,
    detailHref,
  } from "../lib/catalog";
  import { filterQuery, calculateLoan } from "../lib/domain";
  import SearchForm from "./SearchForm.svelte";
  import Icon from "./Icon.svelte";
  let { design }: { design: HomeDesign } = $props();
  let slide = $state(0);
  const slides = [
    vehicleBySlug("mercedes-e-class")!,
    vehicleBySlug("volvo-xc90-recharge")!,
    vehicles.find((v) => v.make === "Audi")!,
  ];
  let vehicle = $derived(
    design.id === 4 ? slides[(slide + 1) % slides.length] : slides[slide],
  );
  let estimate = $derived(calculateLoan(vehicle.price, 5000, 6.9, 60));
  const bodyLinks = ["SUV", "Sedan", "Hatchback", "Coupe", "Hybrid"];
  const backgrounds: Record<string, string> = {
    mountain: "/media/banner/banner-page1.jpg",
    city: "/media/banner/banner-hp3.jpg",
    electric: "/media/background/banner-v8.jpg",
    lifestyle: "/media/banner/banner-page9.jpg",
    classic: "/media/banner/bg-7.jpg",
    touring: "/media/banner/bg-7.jpg",
  };
</script>

{#snippet bodyChips()}
  <div class="hero-body-links" aria-label="Browse by type">
    {#each bodyLinks as body}<a
        href={"/inventory/" +
          filterQuery(body === "Hybrid" ? { fuel: body } : { body })}
      >
        <Icon name="car" size={20} />{body}
      </a>{/each}
  </div>
{/snippet}
<section
  class="hero hero-{design.hero}"
  data-home={design.id}
  style:background-image={backgrounds[design.hero]
    ? `url('${backgrounds[design.hero]}')`
    : undefined}
  aria-labelledby="hero-title"
>
  {#if ["mountain", "city"].includes(design.hero)}
    <div class="container hero-content">
      <p class="hero-eyebrow">Find cars for sale near you</p>
      <h1 id="hero-title">Find Your Perfect Car</h1>
      <SearchForm />{#if design.id === 1}<p class="hero-browse-caption">
          Or Browse Featured Models
        </p>
        {@render bodyChips()}{/if}
    </div>
    {#if design.id === 3}<div class="container city-body-tabs">
        {@render bodyChips()}
      </div>{/if}
  {:else if ["featured", "luxury"].includes(design.hero)}
    <img
      class="feature-hero-photo"
      src={vehicle.image}
      alt={vehicle.title}
      fetchpriority="high"
    />
    <div class="container featured-hero-content">
      <div>
        <p class="hero-price">
          {#if "monthly" in estimate}{money(estimate.monthly)}
            <small>/ month estimate</small>{/if}
        </p>
        <h1 id="hero-title">
          {design.id === 2 && slide === 0
            ? "Mercedes New E-Class"
            : vehicle.title}
        </h1>
        {#if design.id === 2}<div class="hero-car-specs">
            <span><Icon name="fuel" size={18} />{vehicle.fuel}</span>
            <span>
              <Icon name="speed" size={18} />{number(vehicle.mileage)} miles
            </span>
            <span><Icon name="gear" size={18} />{vehicle.transmission}</span>
          </div>
          <a class="button white" href={detailHref(vehicle)}>
            View Details <Icon name="arrow" size={16} />
          </a>{/if}
        <p class="hero-finance-note">
          60 months · 6.9% APR · $5,000 deposit. Illustration only.
        </p>
      </div>
      {#if design.id === 4}<div class="hero-spec-panel">
          {#each [["fuel", "Fuel Type", vehicle.fuel], ["speed", "Mileage", `${number(vehicle.mileage)} miles`], ["gear", "Transmission", vehicle.transmission], ["clock", "Year", String(vehicle.year)]] as [icon, label, value]}<div
            >
              <Icon name={icon} size={23} />
              <span>
                {label}
                <strong>{value}</strong>
              </span>
            </div>{/each}
          <a class="button white" href={detailHref(vehicle)}>
            More Info <Icon name="arrow" size={14} />
          </a>
        </div>{/if}
    </div>
    <div class="container hero-slide-controls">
      {#if design.id === 2}{#each slides as item, i}<button
            class:active={slide === i}
            onclick={() => (slide = i)}
            aria-pressed={slide === i}
          >
            {item.title}
          </button>{/each}{:else}<button
          class="icon-button"
          aria-label="Previous featured car"
          onclick={() => (slide = (slide + 2) % 3)}
        >
          <Icon name="left" />
        </button>
        <span>{slide + 1} / 3</span>
        <button
          class="icon-button"
          aria-label="Next featured car"
          onclick={() => (slide = (slide + 1) % 3)}
        >
          <Icon name="right" />
        </button>{/if}
    </div>
  {:else if design.hero === "minimal"}
    <div class="container hero-content">
      <p class="hero-eyebrow">Find cars for sale near you</p>
      <h1 id="hero-title">Find Your Perfect Car</h1>
      <SearchForm tabs={false} />
      <img
        class="minimal-hero-car"
        src="/media/banner/banner5-1.png"
        alt="Silver sports sedan"
        fetchpriority="high"
        width="1000"
        height="360"
      />
    </div>
  {:else if design.hero === "showroom"}
    <img
      class="showroom-hero-photo"
      src="/media/resource/banner-six.png"
      alt="Mercedes-Benz at the showroom"
      fetchpriority="high"
    />
    <div class="container hero-content">
      <p class="hero-eyebrow">Find a car that fits your life</p>
      <h1 id="hero-title">
        {vehicles.length} Vehicles
        <br />
        Available
      </h1>
      <div class="hero-buttons">
        <a class="button outline" href="/inventory/">
          View Inventory <Icon name="arrow" size={15} />
        </a>
        <a class="button outline" href="/contact/">
          Contact Us <Icon name="arrow" size={15} />
        </a>
      </div>
      <p class="hero-browse-caption">Or Browse Featured Models</p>
      {@render bodyChips()}
      <p class="sample-note">Sample inventory</p>
    </div>
  {:else if ["classic", "touring"].includes(design.hero)}
    <div class="hero-content">
      <p class="hero-eyebrow">Find cars for sale near you</p>
      <h1 id="hero-title">
        Find Your Perfect New
        <br class="desktop-break" />
         or Used Car
      </h1>
      <a class="hero-explore" href="/inventory/">
        Explore inventory <Icon name="arrow" size={16} />
      </a>
    </div>
    <div class="hero-floating-search">
      <SearchForm
        layout={design.id === 7 ? "panel" : "bar"}
        tabs={design.id === 7}
        extended={design.id === 7}
        dark={design.id === 10}
      />
    </div>
  {:else if design.hero === "electric"}
    <div class="container hero-content">
      <h1 id="hero-title">Let’s Find Your Perfect Car</h1>
      <SearchForm layout="vertical" />
    </div>
  {:else if design.hero === "lifestyle"}
    <div class="container lifestyle-search"><SearchForm dark extended /></div>
    <div class="container hero-content">
      <p class="hero-eyebrow">We make finding the right car simple</p>
      <h1 id="hero-title">Search Less. Live More.</h1>
      <div class="hero-buttons">
        <a class="button white" href="/inventory/">
          View Inventory <Icon name="arrow" size={15} />
        </a>
        <a class="button outline" href="/contact/">
          Contact Us <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  {/if}
</section>
