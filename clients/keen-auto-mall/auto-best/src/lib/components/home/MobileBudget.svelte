<script lang="ts">
  import { resolve } from '$app/paths';
  import { featuredVehicles } from '$data/inventory';

  const budgetTiles = [
  {
    "label": "Up to $12,000",
    "detail": "2 samples",
    "href": "/listing-grid?price_max=12000",
    "image": "/dealer/inventory/6572737-1.webp"
  },
  {
    "label": "$12,001–$16,000",
    "detail": "3 samples",
    "href": "/listing-grid?price_min=12001&price_max=16000",
    "image": "/dealer/inventory/7027165-1.webp"
  },
  {
    "label": "Over $16,000",
    "detail": "3 samples",
    "href": "/listing-grid?price_min=16001",
    "image": "/dealer/inventory/7435783-1.webp"
  },
  {
    "label": "All samples",
    "detail": "8 vehicles",
    "href": "/listing-grid",
    "image": "/dealer/inventory/5826218-1.webp"
  }
] as const;
</script>

<section class="dn-mobile-budget" aria-labelledby="mobile-budget-title">
  <div class="dn-mobile-section-heading">
    <h2 id="mobile-budget-title">Choose by budget</h2>

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
