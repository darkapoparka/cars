<script lang="ts">
  import { withListReturn } from '$data/journeys';
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';

  interface Props {
    vehicle: Vehicle;
    returnTo?: string;
    showPrice?: boolean;
    priority?: boolean;
    layout?: 'default' | 'listing' | 'showcase';
  }

  let { vehicle, returnTo, showPrice = false, priority = false, layout = 'default' }: Props = $props();
</script>

<article id={`vehicle-${vehicle.id}`} data-variant={layout} class:dn-vehicle-card--listing={layout === 'listing'} class:dn-vehicle-card--showcase={layout === 'showcase'} class="dn-vehicle-card">
  <a class="dn-vehicle-card__link" href={withListReturn(resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) }), returnTo)} aria-label={`Вижте ${vehicle.title}`}>
    <div class="dn-vehicle-card__visual">
      {#if layout !== 'showcase'}
      <div class="dn-vehicle-card__badges">
        <span class="dn-vehicle-card__badge dn-vehicle-card__badge--mileage">{vehicle.mileage}</span>
        <span class="dn-vehicle-card__badge dn-vehicle-card__badge--year">{vehicle.year}</span>
      </div>
      {/if}

      <div class="dn-vehicle-card__image">
      <img
        src={vehicle.image}
        alt={vehicle.title}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        width="450"
        height="300"
      />
      </div>
    </div>

    <div class="dn-vehicle-card__content">
      {#if layout !== 'showcase'}<div class="dn-vehicle-card__category"><p>{vehicle.category}</p></div>{/if}
      {#if layout === 'listing'}
        <h2 class="dn-vehicle-card__name" title={vehicle.title}>{vehicle.title}</h2>
      {:else}
        <h3 class="dn-vehicle-card__name" title={vehicle.title}>{vehicle.title}</h3>
      {/if}
      {#if layout === 'showcase'}
        <p class="dn-vehicle-card__summary">{vehicle.year} · {vehicle.fuel}</p>
      {/if}
      {#if layout === 'listing'}
        <div class="dn-vehicle-card__mobile-meta" aria-label="Година и пробег">
          <span>{vehicle.year}</span>
          <span>{vehicle.mileage}</span>
        </div>
      {/if}

      {#if layout !== 'showcase'}
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
      {/if}

      {#if showPrice}
        <div class="dn-vehicle-card__amount">{formatVehiclePrice(vehicle.priceEur)}</div>
      {/if}
    </div>
  </a>
</article>

<style>
  .dn-vehicle-card--showcase .dn-vehicle-card__visual { aspect-ratio: 16 / 9; }
  .dn-vehicle-card--showcase .dn-vehicle-card__content { padding: var(--dn-space-2) var(--dn-space-3); }
  .dn-vehicle-card--showcase .dn-vehicle-card__name {
    display: block;
    font-size: var(--dn-text-lead);
    font-weight: var(--dn-weight-medium);
    line-height: var(--dn-leading-card);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dn-vehicle-card__summary {
    margin: var(--dn-space-half) 0 0;
    color: var(--dn-muted);
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-meta);
  }
  .dn-vehicle-card__mobile-meta { display: none; }
  .dn-vehicle-card {
    display: flex;
    width: 100%;
    min-width: 0;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    border: 0;
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--dn-vehicle-card-shadow, none);
    transition: background-color 160ms ease-out, box-shadow 180ms ease-out;
  }

  .dn-vehicle-card__link {
    position: relative;
    border-radius: inherit;
    display: flex;
    min-height: 100%;
    flex: 1;
    flex-direction: column;
    color: inherit;
    text-decoration: none;
  }

  .dn-vehicle-card__link:focus-visible {
    outline: 3px solid var(--dn-focus);
    outline-offset: -3px;
  }

  .dn-vehicle-card__link:focus-visible::after {
    position: absolute;
    inset: 0;
    z-index: 13;
    border: 3px solid var(--dn-focus);
    border-radius: inherit;
    pointer-events: none;
    content: '';
  }

  .dn-vehicle-card__visual {
    position: relative;
    overflow: hidden;
    aspect-ratio: var(--dn-vehicle-card-image-ratio, 3 / 2);
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
    font-size: var(--dn-text-body);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-meta);
    white-space: nowrap;
    backdrop-filter: blur(5px);
  }

  .dn-vehicle-card__badge--year {
    background: var(--dn-red);
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
    padding: var(--dn-vehicle-card-content-padding, 16px 16px 18px);
    background: transparent;
  }

  .dn-vehicle-card__category {
    margin: 0 0 6px;
  }

  .dn-vehicle-card__category p {
    margin: 0;
    color: #6b7280;
    font-size: var(--dn-text-body);
    font-weight: var(--dn-weight-regular);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-label);
  }

  .dn-vehicle-card__name {
    display: -webkit-box;
    min-height: 0;
    margin: 0;
    overflow: hidden;
    color: #11151c;
    font-size: var(--dn-text-card);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-meta);
    letter-spacing: var(--dn-tracking-heading);
    line-clamp: var(--dn-vehicle-card-title-lines, 2);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--dn-vehicle-card-title-lines, 2);
  }

  .dn-vehicle-card__link:focus-visible .dn-vehicle-card__name {
    color: var(--dn-red);
  }

  @media (hover: hover) and (pointer: fine) {
    .dn-vehicle-card:hover {
      background: #fff;
      box-shadow: var(--dn-vehicle-card-shadow, var(--dn-card-hover-shadow));
    }

    .dn-vehicle-card__link:hover .dn-vehicle-card__name {
      color: var(--dn-red);
    }
  }

  .dn-vehicle-card__specs {
    display: flex;
    width: 100%;
    align-items: stretch;
    flex-wrap: nowrap;
    gap: 8px;
    margin-top: var(--dn-vehicle-card-specs-gap, 12px);
  }

  .dn-vehicle-card__spec {
    display: inline-flex;
    min-width: 0;
    min-height: 30px;
    flex: 0 1 auto;
    align-items: center;
    gap: var(--dn-vehicle-card-spec-icon-gap, 6px);
    padding: 0 var(--dn-vehicle-card-spec-padding, 10px);
    overflow: hidden;
    border-radius: 8px;
    background: #f0f2f4;
    color: #5f6671;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-medium);
    line-height: var(--dn-leading-heading);
    white-space: nowrap;
  }

  .dn-vehicle-card__spec { font-variant-numeric: tabular-nums; }

  .dn-vehicle-card__amount {
    margin-top: auto;
    padding-top: var(--dn-vehicle-card-price-gap, 14px);
    color: #11151c;
    font-size: var(--dn-text-subheading);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-heading);
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
      font-size: var(--dn-text-lead);
    }

    .dn-vehicle-card--listing {
      min-height: 132px;
      border-radius: 16px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__link {
      display: grid;
      min-height: 132px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-vehicle-card--listing .dn-vehicle-card__visual {
      height: 132px;
      min-height: 132px;
      aspect-ratio: auto;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__image img {
      object-fit: cover;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__badges {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__badge--mileage {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__content {
      display: grid;
      min-width: 0;
      grid-template-rows: 24px 20px 20px 22px;
      align-content: start;
      gap: 6px;
      padding: 14px 12px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__category {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta {
      display: flex;
      flex-wrap: nowrap;
      gap: 6px;
      margin: 0;
      color: #626a75;
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-meta);
      font-variant-numeric: tabular-nums;
    }
    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta > span {
      display: inline-flex;
      min-height: 20px;
      align-items: center;
      padding: 0 4px;
      border: 1px solid #e7e8eb;
      border-radius: 6px;
      background: #f5f6f7;
      color: #626873;
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-meta);
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__category p {
      font-size: var(--dn-text-body);
      line-height: var(--dn-leading-heading);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__name {
      display: block;
      font-size: var(--dn-text-lead);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-control);
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__specs {
      gap: 6px;
      flex-wrap: nowrap;
      margin-top: 0;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__spec {
      min-height: 20px;
      gap: 4px;
      padding: 0 4px;
      border: 1px solid #e7e8eb;
      border-radius: 6px;
      background: #f5f6f7;
      color: #626873;
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-meta);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__spec :global(.dn-icon) {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__amount {
      margin-top: 0;
      padding-top: 0;
      color: #11151c;
      font-size: var(--dn-text-card);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-section);
    }
  }

  @media (max-width: 359px) {
    .dn-vehicle-card--listing .dn-vehicle-card__content { padding-inline: 6px; }
    .dn-vehicle-card--listing .dn-vehicle-card__specs { gap: 4px; }
    .dn-vehicle-card--listing .dn-vehicle-card__spec { gap: 3px; padding-inline: 2px; }
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
