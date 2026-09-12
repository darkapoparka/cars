<script lang="ts">
  import BrowseAllCard from './BrowseAllCard.svelte';
  import { resolve } from '$app/paths';
  import VehicleCard from '$components/vehicles/VehicleCard.svelte';
  import { featuredVehicles } from '$data/inventory';
</script>

<section class="dn-section dn-inventory" aria-labelledby="featured-title">
  <div class="container dn-inventory-panel">
    <div class="dn-inventory__heading dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy">
      <h2 id="featured-title" class="dn-home-section-title">
        <span class="dn-heading-desktop">Избрани автомобили</span>
        <span class="dn-heading-mobile">Избрани автомобили</span>
      </h2>
      <a class="dn-inventory__all dn-home-section-action" href={resolve('/listing-grid')} aria-label="Вижте всички автомобили">
        <span class="dn-heading-desktop">Вижте всички автомобили</span>
        <span class="dn-heading-mobile" aria-hidden="true">Всички</span>
      </a>
    </div>

    <div class="dn-inventory__grid">
      {#each featuredVehicles.slice(0, 4) as vehicle, index (vehicle.id)}
        <VehicleCard {vehicle} showPrice priority={index < 4} />
      {/each}
      <BrowseAllCard label="Всички автомобили" detail="Разгледайте цялата колекция" />
    </div>
  </div>
</section>

<style>
  

  .dn-inventory {
    background: #fff;
  }

  .dn-inventory-panel {
    padding: 46px 30px 30px;
    border-radius: 20px;
    background: #f1f3f5;
  }

  .dn-inventory__heading {
    position: relative;
    display: flex;
    min-height: 46px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
    text-align: center;
  }

  .dn-inventory__heading h2 {
    width: auto;
    margin: 0;
    color: #171a20;
    font-size: 42px;
    font-weight: 650;
    line-height: 1.12;
    letter-spacing: -0.03em;
    text-align: center;
  }

  .dn-inventory__all {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: var(--dn-radius-button);
    background: #c40101;
    color: #fff;
    font-size: var(--dn-text-lead);
    font-weight: 600;
    line-height: 1.3;
    transition: background-color 180ms ease-out;
  }

  .dn-heading-mobile {
    display: none;
  }

  .dn-inventory__all:hover,
  .dn-inventory__all:focus-visible {
    background: #24272c;
    color: #fff;
  }

  .dn-inventory__all:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.24);
    outline-offset: 3px;
  }

  .dn-inventory__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;
    align-items: stretch;
  }

  .dn-inventory__grid :global(.dn-vehicle-card) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1200px) {
    .dn-inventory__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
    }
  }

  @media (max-width: 991px) {
    .dn-inventory-panel {
      padding: 38px 20px 20px;
    }

    .dn-inventory__heading {
      justify-content: center;
      text-align: center;
    }

    .dn-inventory__heading h2 {
      width: auto;
      font-size: 2.25rem;
      text-align: center;
    }

    .dn-inventory__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
  }

  @media (max-width: 767px) {
    .dn-inventory {
      padding: 32px 0 12px;
      background: var(--dn-mobile-canvas);
    }

    .dn-inventory-panel {
      width: 100%;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }

    .dn-inventory__heading {
      min-height: 44px;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
      margin: 0 12px 8px;
      text-align: left;
    }

    .dn-inventory__heading h2 {
      font-size: 22px;
      font-weight: 700;
      line-height: 1.15;
      text-align: left;
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    .dn-inventory__all { display: none; }

    .dn-inventory__grid {
      display: grid;
      grid-auto-columns: min(270px, calc(100vw - 96px));
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 10px;
      overflow-x: auto;
      padding: 0 12px 12px;
      scroll-padding-left: 12px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .dn-inventory__grid::-webkit-scrollbar {
      display: none;
    }

    .dn-inventory__grid :global(.dn-vehicle-card) {
      scroll-snap-align: start;
    }
  }

  @media (min-width: 992px) {
    

    .dn-inventory {
      padding-top: var(--dn-home-section-space);
      padding-bottom: var(--dn-home-section-space);
      background: #fff;
    }

    .dn-inventory-panel {
      padding: 0;
      background: transparent;
    }

    .dn-inventory__heading {
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 24px;
      text-align: left;
    }

    .dn-inventory__heading h2 {
      font-size: 36px;
      text-align: left;
    }

    .dn-inventory__all {
      min-height: 44px;
      padding: 0 12px;
      border-radius: 10px;
      background: transparent;
      color: #24272c;
      font-size: 16px;
      white-space: nowrap;
    }

    .dn-inventory__all:hover,
    .dn-inventory__all:focus-visible {
      background: #e4e7eb;
      color: #a80000;
    }

    .dn-inventory__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
      position: relative;
      margin-top: -24px;
      padding: 24px;
      border-radius: 16px;
      background: var(--dn-home-panel);
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-inventory__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-inventory__all {
      transition: none;
    }
  }

</style>
