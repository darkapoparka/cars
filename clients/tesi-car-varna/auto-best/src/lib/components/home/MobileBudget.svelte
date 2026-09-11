<script lang="ts">
  import { resolve } from '$app/paths';
  import ArtworkRegion from '$components/ui/ArtworkRegion.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { vehicleArtwork } from '$data/vehicle-artwork';
  import { featuredVehicles } from '$data/inventory';

  const vehicleCount = (count: number) => `${count} ${count === 1 ? 'автомобил' : 'автомобила'}`;

  const budgetTiles = [
    {
      label: 'До 60 000 €',
      detail: vehicleCount(featuredVehicles.filter((vehicle) => vehicle.priceEur <= 60000).length),
      href: '/listing-grid?price_max=60000',
      artwork: vehicleArtwork.graphite
    },
    {
      label: '60–70 000 €',
      detail: vehicleCount(featuredVehicles.filter((vehicle) => vehicle.priceEur > 60000 && vehicle.priceEur <= 70000).length),
      href: '/listing-grid?price_min=60000&price_max=70000',
      artwork: vehicleArtwork.silver
    },
    {
      label: 'Над 70 000 €',
      detail: vehicleCount(featuredVehicles.filter((vehicle) => vehicle.priceEur > 70000).length),
      href: '/listing-grid?price_min=70000',
      artwork: vehicleArtwork.urus
    }
  ] as const;
</script>

<section class="dn-mobile-budget" aria-labelledby="mobile-budget-title">
  <div class="dn-mobile-section-heading">
    <h2 id="mobile-budget-title">По бюджет</h2>
    <a href={resolve('/listing-grid')}>Виж всички</a>

  </div>

  <div class="dn-mobile-budget__grid">
    {#each budgetTiles as tile (tile.href)}
      <a class="dn-mobile-budget-card" href={resolve(tile.href)}>
        <span class="dn-mobile-budget-card__media">
          <ArtworkRegion artwork={{ ...tile.artwork, crop: [0, 100, 1000, 460] }} />
        </span>
        <span class="dn-mobile-budget-card__copy">
          <strong>{tile.label}</strong>
          <small>{tile.detail}</small>
          <Icon name="arrow-right" size={18} />
        </span>
      </a>
    {/each}
  </div>
</section>

<style>
  .dn-mobile-budget { display: none; }
  @media (max-width: 767px) {
    .dn-mobile-budget { display: grid; gap: 12px; padding: 24px 12px 4px; background: var(--dn-mobile-canvas); }
    .dn-mobile-section-heading { display: flex; min-height: 44px; align-items: center; justify-content: space-between; gap: 12px; }
    .dn-mobile-section-heading h2 { margin: 0; color: var(--dn-ink); font-size: 22px; line-height: 1.15; letter-spacing: -.025em; }
    .dn-mobile-section-heading a { display: inline-flex; min-height: 44px; align-items: center; font-size: 14px; font-weight: 600; color: var(--dn-muted); }
    .dn-mobile-budget__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; }
    .dn-mobile-budget-card { display: grid; grid-template-columns: 46% 54%; min-height: 112px; min-width: 0; align-items: center; overflow: hidden; border-radius: 14px; background: var(--dn-mobile-surface); color: var(--dn-ink); }
    .dn-mobile-budget-card:last-child { background: var(--dn-ink); color: #fff; }
    .dn-mobile-budget-card:focus-visible { outline: 3px solid var(--dn-red); outline-offset: 3px; }
    .dn-mobile-budget-card__media { grid-column: 2; grid-row: 1; display: block; min-width: 0; padding-right: 8px; }
    .dn-mobile-budget-card__copy { grid-column: 1; grid-row: 1; display: grid; gap: 6px; padding: 16px 0 16px 16px; }
    .dn-mobile-budget-card__copy strong { font-size: 18px; font-weight: 700; line-height: 1.2; }
    .dn-mobile-budget-card__copy small { font-size: 13px; line-height: 1.3; opacity: .8; }
    .dn-mobile-budget-card__copy :global(svg) { color: var(--dn-red); }
    .dn-mobile-budget-card:last-child .dn-mobile-budget-card__copy :global(svg) { color: #fff; }
  }
</style>
