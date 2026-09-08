<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { featuredVehicles } from '$data/inventory';

  const budgetTiles = [
    {
      label: 'До 60 000 €',
      detail: `${featuredVehicles.filter((vehicle) => vehicle.priceEur <= 60000).length} автомобила`,
      href: '/listing-grid?price_max=60000',
      image: featuredVehicles[1].image
    },
    {
      label: '60–70 000 €',
      detail: `${featuredVehicles.filter((vehicle) => vehicle.priceEur > 60000 && vehicle.priceEur <= 70000).length} автомобила`,
      href: '/listing-grid?price_min=60000&price_max=70000',
      image: featuredVehicles[0].image
    },
    {
      label: 'Над 70 000 €',
      detail: `${featuredVehicles.filter((vehicle) => vehicle.priceEur > 70000).length} автомобила`,
      href: '/listing-grid?price_min=70000',
      image: featuredVehicles[6].image
    },
    {
      label: 'Цялата селекция',
      detail: `${featuredVehicles.length} автомобила`,
      href: '/listing-grid',
      image: featuredVehicles[2].image
    }
  ] as const;
</script>

<section class="dn-mobile-budget" aria-labelledby="mobile-budget-title">
  <div class="dn-mobile-section-heading">
    <h2 id="mobile-budget-title">Изберете по бюджет</h2>
    <a href={resolve('/listing-grid')}>
      Всички
      <Icon name="arrow-right" size={16} strokeWidth={2} />
    </a>
  </div>

  <div class="dn-mobile-budget__grid">
    {#each budgetTiles as tile (tile.href)}
      <a class="dn-mobile-budget-card" href={resolve(tile.href)}>
        <span class="dn-mobile-budget-card__media">
          <img src={tile.image} alt="" width="450" height="300" loading="lazy" decoding="async" />
        </span>
        <span class="dn-mobile-budget-card__copy">
          <strong>{tile.label}</strong>
          <small>{tile.detail}</small>
        </span>
      </a>
    {/each}
  </div>
</section>

<style>
  .dn-mobile-budget {
    display: none;
  }

  @media (max-width: 767px) {
    .dn-mobile-budget {
      display: grid;
      gap: 12px;
      padding: 24px 12px 4px;
      background: var(--dn-mobile-canvas);
    }

    .dn-mobile-section-heading {
      display: flex;
      min-height: 44px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .dn-mobile-section-heading h2 {
      margin: 0;
      color: #171a20;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.025em;
    }

    .dn-mobile-section-heading a {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      gap: 3px;
      color: #4f5661;
      font-size: 14px;
      font-weight: 650;
    }

    .dn-mobile-budget__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .dn-mobile-budget-card {
      display: grid;
      min-width: 0;
      grid-template-rows: 96px auto;
      overflow: hidden;
      border: 0;
      border-radius: 14px;
      background: var(--dn-mobile-surface);
      color: #171a20;
    }

    .dn-mobile-budget-card:focus-visible {
      outline: 3px solid rgba(196, 1, 1, 0.25);
      outline-offset: 2px;
    }

    .dn-mobile-budget-card__media {
      position: relative;
      display: block;
      overflow: hidden;
      background: #e1e4e8;
    }

    .dn-mobile-budget-card__media::after {
      position: absolute;
      inset: 38% 0 0;
      background: linear-gradient(to bottom, transparent, rgba(10, 13, 18, 0.2));
      content: '';
    }

    .dn-mobile-budget-card__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dn-mobile-budget-card__copy {
      display: grid;
      gap: 3px;
      padding: 12px;
    }

    .dn-mobile-budget-card__copy strong {
      overflow: hidden;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dn-mobile-budget-card__copy small {
      color: #626a75;
      font-size: 12px;
      font-weight: 550;
      line-height: 1.3;
    }
  }
</style>
