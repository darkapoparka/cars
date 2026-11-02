<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import HomeCampaignHero from "#lib/sections/HomeCampaignHero.svelte";
  import MarketplaceSearch from "#lib/components/search/MarketplaceSearch.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import RentalVehicleTile from "#lib/components/RentalVehicleTile.svelte";
  import { rentalCars } from "#lib/data/rental-catalog.ts";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  import DiscoveryCard from "./DiscoveryCard.svelte";
  import { discoveryCars, discoveryText } from "./discovery.ts";
  const locale = useLocale();
  const rentalSources = new Set(
    rentalCars.map((car) => car.id.replace(/^rental-/, "")),
  );
  const saleCars = discoveryCars
    .filter((car) => !rentalSources.has(car.id))
    .slice(0, 6);
  const fromRate = Math.min(...rentalCars.map((car) => car.dailyRate));
  const categories = $derived([
    { label: "SUV", href: "/vehicles?q=SUV#vehicle-results" },
    {
      label: locale.locale === "bg" ? "Купе" : "Coupé",
      href: "/vehicles?q=coupe#vehicle-results",
    },
    {
      label: locale.locale === "bg" ? "До 30 000 €" : "Under €30,000",
      href: "/vehicles?budget=30000#vehicle-results",
    },
  ]);
</script>

<main class="main background-body discovery-home">
  <HomeCampaignHero><MarketplaceSearch /></HomeCampaignHero>
  <div class="container home-filters">
    <MobilePillRail
      label={locale.locale === "bg" ? "Разгледай автомобили" : "Explore cars"}
      >{#each categories as category (category.href)}<MobilePill
          label={category.label}
          href={category.href}
        />{/each}</MobilePillRail
    >
    <a class="home-rent-link" href={locale.href("/rent")}
      ><span
        >{locale.locale === "bg" ? "Коли под наем" : "Cars to rent"} · {locale.locale ===
        "bg"
          ? "от "
          : "from "}{locale.money(fromRate, "EUR")}{locale.locale === "bg"
          ? "/ден"
          : "/day"}</span
      ><MobileIcon name="arrow-right" size={16} /></a
    >
  </div>
  <div class="container home-sections">
    <section aria-labelledby="home-buy-heading">
      <div class="collection-heading">
        <h2 id="home-buy-heading">
          {locale.locale === "bg" ? "За покупка" : "Cars to buy"}
        </h2>
        <a href={locale.href("/vehicles")}
          >{locale.locale === "bg" ? "Виж всички" : "View all"}<span
            aria-hidden="true"
          >
            →</span
          ></a
        >
      </div>
      <div
        class="car-rail"
        role="region"
        aria-label={locale.locale === "bg" ? "Коли за покупка" : "Cars to buy"}
        {@attach focusableScroll}
      >
        {#each saleCars as car (car.id)}<DiscoveryCard {car} />{/each}
      </div>
    </section>
    <section aria-labelledby="home-rent-heading">
      <div class="collection-heading">
        <h2 id="home-rent-heading">
          {locale.locale === "bg" ? "Под наем" : "Cars to rent"}<span
            >{locale.locale === "bg" ? "от " : "from "}{locale.money(
              fromRate,
              "EUR",
            )}{locale.locale === "bg" ? "/ден" : "/day"}</span
          >
        </h2>
        <a href={locale.href("/rent")}
          >{locale.locale === "bg" ? "Виж всички" : "View all"}<span
            aria-hidden="true"
          >
            →</span
          ></a
        >
      </div>
      <div
        class="car-rail"
        role="region"
        aria-label={locale.locale === "bg" ? "Коли под наем" : "Cars to rent"}
        {@attach focusableScroll}
      >
        {#each rentalCars as car (car.id)}<RentalVehicleTile
            {car}
            href={locale.href("/rent?q=" + encodeURIComponent(car.title))}
          />{/each}
      </div>
    </section>
    <section
      class="home-areas"
      aria-label={locale.locale === "bg"
        ? "Услуги и магазин"
        : "Services and shop"}
    >
      <a class="home-area" href={locale.href("/services")}
        ><MobileIcon name="services" size={22} /><strong
          >{locale.locale === "bg" ? "Услуги" : "Services"}</strong
        ><MobileIcon name="arrow-right" size={16} /></a
      >
      <a class="home-area" href={locale.href("/shop")}
        ><MobileIcon name="shop" size={22} /><strong
          >{locale.locale === "bg" ? "Магазин" : "Shop"}</strong
        ><MobileIcon name="arrow-right" size={16} /></a
      >
    </section>
    <p class="sample-note">{discoveryText(locale.locale, "sample")}</p>
  </div>
  <Footer />
</main>

<style>
  .home-filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px 16px;
    padding-top: 16px;
  }
  .home-rent-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    color: var(--bs-neutral-1000);
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
  }
  .home-rent-link span {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .home-rent-link :global(svg) {
    flex-shrink: 0;
  }
  .home-areas {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .home-area {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    min-height: 76px;
    padding: 16px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 14px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  .home-area strong {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
  }
  .home-area :global(svg) {
    flex-shrink: 0;
  }
  .home-area:focus-visible,
  .home-rent-link:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 2px;
  }
  @media (hover: hover) {
    .home-area:hover {
      background: var(--bs-neutral-100);
    }
  }
  .home-filters :global(.mobile-pill) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 6px 16px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 999px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font-size: 13px;
    text-decoration: none;
  }
  .home-filters :global(.mobile-pill-rail) {
    display: flex;
    gap: 8px;
  }
  .home-sections {
    display: grid;
    gap: 28px;
    padding-top: 20px;
    padding-bottom: 28px;
  }
  section {
    min-width: 0;
  }
  .collection-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  h2 {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    margin: 0;
    font-size: 22px;
    line-height: 1.3;
    color: var(--bs-neutral-1000);
  }
  h2 span {
    font-size: 14px;
    font-weight: 400;
    color: var(--bs-neutral-500);
  }
  .collection-heading > a {
    gap: 6px;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    min-height: 44px;
    color: var(--bs-neutral-600);
    font-size: 13px;
    text-decoration: none;
  }
  .car-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 72px) / 4);
    gap: 24px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    padding: 4px 0;
  }
  .car-rail::-webkit-scrollbar {
    display: none;
  }
  .sample-note {
    margin: 0;
    font-size: 12px;
    color: var(--bs-neutral-500);
  }
  @media (max-width: 991.98px) {
    .car-rail {
      grid-auto-columns: calc((100% - 32px) / 3);
      gap: 16px;
    }
  }
  @media (max-width: 767.98px) {
    .home-area {
      padding: 12px;
      gap: 8px;
      min-height: 72px;
    }
    .home-area strong {
      font-size: 14px;
      line-height: 20px;
    }
    .home-filters {
      padding-top: 12px;
    }
    .home-sections {
      gap: 24px;
      padding-top: 12px;
    }
    .collection-heading {
      margin-bottom: 10px;
    }
    h2 {
      display: grid;
      row-gap: 3px;
      font-size: 20px;
    }
    h2 span {
      font-size: 12px;
    }
    .car-rail {
      grid-auto-columns: 47%;
      gap: 12px;
    }
  }
</style>
