<script lang="ts">
  import { imageStatus } from '$lib/ui/image';
  let failedImage = $state('');
  import { withListReturn } from '$data/journeys';
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';

  interface Props {
    vehicle: Vehicle;
    returnTo?: string;
    showPrice?: boolean;
    priority?: boolean;
    layout?: 'default' | 'listing';
  }

  let { vehicle, returnTo, showPrice = false, priority = false, layout = 'default' }: Props = $props();
</script>

<article id={`vehicle-${vehicle.id}`} class:dn-vehicle-card--listing={layout === 'listing'} class="dn-vehicle-card">
  <a class="dn-vehicle-card__link" href={withListReturn(resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) }), returnTo)} aria-label={`Вижте ${vehicle.title}`}>
    <div class="dn-vehicle-card__visual">
      <div class="dn-vehicle-card__badges">
        <span class="dn-vehicle-card__badge dn-vehicle-card__badge--mileage">{vehicle.mileage}</span>
        <span class="dn-vehicle-card__badge dn-vehicle-card__badge--year">{vehicle.year}</span>
      </div>

      <div class="dn-vehicle-card__image">
      <img
        src={vehicle.image}
        {@attach imageStatus(failed => failedImage = failed ? vehicle.image : '')}
        style:visibility={failedImage === vehicle.image ? 'hidden' : undefined}
        alt={vehicle.title}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        width="450"
        height="300"
      />
      </div>
      {#if failedImage === vehicle.image}<span class="dn-vehicle-image-fallback" role="img" aria-label={`Снимката на ${vehicle.title} не е налична`}>Снимката не е налична</span>{/if}
    </div>

    <div class="dn-vehicle-card__content">
      <div class="dn-vehicle-card__category"><p>{vehicle.category}</p></div>
      <h3 class="dn-vehicle-card__name">{vehicle.title}</h3>
      {#if layout === 'listing'}
        <div class="dn-vehicle-card__mobile-meta" aria-label="Година и пробег">
          <span>{vehicle.year}</span>
          <span>{vehicle.mileage}</span>
        </div>
      {/if}

      <div class="dn-vehicle-card__specs" aria-label="Основни характеристики">
        <span class="dn-vehicle-card__spec">
          <Icon name="fuel" size={15} strokeWidth={1.7} />
          {vehicle.fuel}
        </span>
        <span class="dn-vehicle-card__spec">
          <Icon name="transmission" size={15} strokeWidth={1.7} />
          {vehicle.transmission}
        </span>
      </div>

      {#if showPrice}
        <div class="dn-vehicle-card__amount">{formatVehiclePrice(vehicle.priceEur)}</div>
      {/if}
    </div>
  </a>
</article>

<style>
  .dn-vehicle-image-fallback { position: absolute; inset: 0; display: grid; place-items: center; padding: 16px; color: #626974; background: #eceff2; text-align: center; }
  .dn-vehicle-card__mobile-meta { display: none; }
  .dn-vehicle-card {
    display: flex;
    min-width: 0;
    overflow: hidden;
    flex-direction: column;
    border: 0;
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--dn-vehicle-card-shadow, none);
    transition: background-color 160ms ease-out, box-shadow 180ms ease-out;
  }

  .dn-vehicle-card__link {
    display: flex;
    min-height: 100%;
    flex: 1;
    flex-direction: column;
    color: inherit;
    text-decoration: none;
  }

  .dn-vehicle-card__link:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.24);
    outline-offset: -3px;
  }

  .dn-vehicle-card__visual {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3 / 2;
    background: #eceff2;
  }

  .dn-vehicle-card__badges {
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
    z-index: 12;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    pointer-events: none;
  }

  .dn-vehicle-card__badge {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 6px 12px;
    border-radius: var(--dn-pill);
    background: rgba(20, 23, 29, 0.86);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    line-height: 18px;
    white-space: nowrap;
    backdrop-filter: blur(5px);
  }

  .dn-vehicle-card__badge--year {
    background: #c40101;
  }

  .dn-vehicle-card__image {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #eceff2;
    color: inherit;
  }

  .dn-vehicle-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dn-vehicle-card__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 16px 16px 18px;
    background: transparent;
  }

  .dn-vehicle-card__category {
    margin: 0 0 6px;
  }

  .dn-vehicle-card__category p {
    margin: 0;
    color: #6b7280;
    font-size: var(--dn-text-body);
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: 0.01em;
  }

  .dn-vehicle-card__name {
    display: -webkit-box;
    min-height: 0;
    margin: 0;
    overflow: hidden;
    color: #11151c;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.32;
    letter-spacing: -0.015em;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .dn-vehicle-card__link:focus-visible .dn-vehicle-card__name {
    color: #c40101;
  }

  @media (hover: hover) and (pointer: fine) {
    .dn-vehicle-card:hover {
      background: #fff;
      box-shadow: var(--dn-vehicle-card-shadow, var(--dn-card-hover-shadow));
    }

    .dn-vehicle-card__link:hover .dn-vehicle-card__name {
      color: #c40101;
    }
  }

  .dn-vehicle-card__specs {
    display: flex;
    width: 100%;
    align-items: stretch;
    flex-wrap: nowrap;
    gap: 8px;
    margin-top: 12px;
  }

  .dn-vehicle-card__spec {
    display: inline-flex;
    min-width: 0;
    min-height: 30px;
    flex: 0 1 auto;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    overflow: hidden;
    border-radius: 8px;
    background: #f0f2f4;
    color: #5f6671;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
  }

  .dn-vehicle-card__spec { font-variant-numeric: tabular-nums; }

  .dn-vehicle-card__amount {
    margin-top: auto;
    padding-top: 14px;
    color: #11151c;
    font-size: var(--dn-text-subheading);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 767px) {
    .dn-vehicle-card {
      --dn-vehicle-card-shadow: 0 2px 8px rgba(18, 25, 38, 0.07);
    }

    .dn-vehicle-card__badge {
      min-height: 26px;
      padding: 4px 8px;
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-meta);
    }

    .dn-vehicle-card__name {
      font-size: 18px;
    }

    .dn-vehicle-card--listing {
      min-height: 132px;
      border-radius: 16px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__link {
      display: grid;
      min-height: 132px;
      grid-template-columns: minmax(126px, 40%) minmax(0, 1fr);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__visual {
      height: 100%;
      min-height: 132px;
      aspect-ratio: auto;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__badges {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__badge--mileage {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__content {
      min-width: 0;
      padding: 10px 12px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__category {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 6px 0 0;
      color: #626a75;
      font-size: 12px;
      line-height: 1.4;
      font-variant-numeric: tabular-nums;
    }
    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta > span {
      display: inline-flex;
      min-height: 24px;
      align-items: center;
      padding: 2px 6px;
      border: 1px solid #dce0e5;
      border-radius: 6px;
      background: #f5f6f7;
      color: #454d59;
      font-size: 12px;
      line-height: 1.4;
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__category p {
      font-size: 12px;
      line-height: 1.2;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__name {
      font-size: 16px;
      line-height: 1.25;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__specs {
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__spec {
      min-height: 24px;
      gap: 4px;
      padding: 2px 6px;
      border: 1px solid #dce0e5;
      border-radius: 6px;
      background: #f5f6f7;
      color: #454d59;
      font-size: 12px;
      line-height: 1.4;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__spec :global(.dn-icon) {
      display: block;
      width: 12px;
      height: 12px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__amount {
      margin-top: 8px;
      padding-top: 0;
      color: #11151c;
      font-size: 20px;
      font-weight: 650;
      line-height: 1.1;
    }
  }

  @media (max-width: 359px) {
    .dn-vehicle-card--listing .dn-vehicle-card__link {
      grid-template-columns: 108px minmax(0, 1fr);
    }
    .dn-vehicle-card--listing .dn-vehicle-card__specs { gap: 4px; }
    .dn-vehicle-card--listing .dn-vehicle-card__spec { gap: 3px; padding-inline: 3px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-vehicle-card,
    .dn-vehicle-card__image img,
    .dn-vehicle-card__name,
    .dn-vehicle-card__spec {
      transition: none;
    }
  }
</style>
