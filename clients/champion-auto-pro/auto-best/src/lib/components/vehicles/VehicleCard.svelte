<script lang="ts">
  import { specificationLabel, formatMileage } from '$lib/i18n/presentation';


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

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

  // The make has its own label; retain titles that use a different model family.
  const modelTitle = $derived(vehicle.title.startsWith(`${vehicle.make} `)
    ? vehicle.title.slice(vehicle.make.length + 1)
    : vehicle.title);
</script>

<article id={`vehicle-${vehicle.id}`} data-variant={layout} class:dn-vehicle-card--listing={layout === 'listing'} class:dn-vehicle-card--showcase={layout === 'showcase'} class="dn-vehicle-card">
  <a class="dn-vehicle-card__link" href={i18n.href(withListReturn(resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) }), returnTo))} aria-label={i18n.t("m_7e95f8ea5711", { p0: vehicle.title })}>
    <div class="dn-vehicle-card__visual">
      {#if layout !== 'showcase'}
      <div class="dn-vehicle-card__badges">
        <span class="dn-vehicle-card__badge dn-vehicle-card__badge--mileage">{formatMileage(vehicle.mileageKm, i18n.locale)}</span>
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
      <div class="dn-vehicle-card__identity">
        <p class="dn-vehicle-card__make">{vehicle.make}</p>
        {#if layout === 'listing'}
          <h2 class="dn-vehicle-card__name" title={vehicle.title}>{modelTitle}</h2>
        {:else}
          <h3 class="dn-vehicle-card__name" title={vehicle.title}>{modelTitle}</h3>
        {/if}
      </div>
      {#if layout === 'showcase'}
        <p class="dn-vehicle-card__summary">{vehicle.year} · {specificationLabel(vehicle.fuel, i18n.locale)}</p>
      {/if}
      {#if layout === 'listing'}
        <div class="dn-vehicle-card__mobile-meta" aria-label={i18n.t("m_fe73f0109419")}>
          <span>{vehicle.year}</span>
          <span>{formatMileage(vehicle.mileageKm, i18n.locale)}</span>
        </div>
      {/if}

      {#if layout !== 'showcase'}
      <div class="dn-vehicle-card__specs" aria-label={i18n.t("m_148a9be6e575")}>
        <span class="dn-vehicle-card__spec">
          <Icon name="fuel" size={15} strokeWidth={1.7} />
          {specificationLabel(vehicle.fuel, i18n.locale)}
        </span>
        <span class="dn-vehicle-card__spec">
          <Icon name="transmission" size={15} strokeWidth={1.7} />
          {specificationLabel(vehicle.transmission, i18n.locale)}
        </span>
      </div>
      {/if}

      {#if showPrice}
        <div class="dn-vehicle-card__amount">{formatVehiclePrice(vehicle.priceEur, i18n.locale)}</div>
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
    transition: background-color 160ms ease-out, box-shadow 180ms ease-out, transform 180ms ease-out;
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
    transition: transform 220ms ease-out;
  }

  .dn-vehicle-card__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: var(--dn-vehicle-card-content-padding, 16px 16px 18px);
    background: transparent;
  }

  .dn-vehicle-card__identity { min-width: 0; }

  .dn-vehicle-card__make {
    margin: 0 0 var(--dn-space-half);
    color: var(--dn-ink-hover);
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-regular);
    line-height: var(--dn-leading-meta);
    letter-spacing: var(--dn-tracking-normal);
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
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

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

  @media (min-width: 992px) {
    .dn-vehicle-card {
      box-shadow: var(--dn-card-shadow);
      transition: box-shadow 120ms ease-out, transform 180ms ease-out;
    }

    .dn-vehicle-card--listing { border-radius: var(--dn-radius-lg); }

    @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
      .dn-vehicle-card--listing:hover { transform: translateY(-2px); }
      .dn-vehicle-card--listing:hover .dn-vehicle-card__image img { transform: scale(1.025); }
    }

    .dn-vehicle-card__content { padding: var(--dn-space-5); }
    .dn-vehicle-card--showcase .dn-vehicle-card__content { padding: var(--dn-space-3) var(--dn-space-4); }
    .dn-vehicle-card__name { line-height: var(--dn-leading-card); }
    .dn-vehicle-card__badges { inset: 12px 12px auto; }
    .dn-vehicle-card__badge { padding: 5px 10px; font-size: var(--dn-text-meta); font-variant-numeric: tabular-nums; }
    .dn-vehicle-card__specs { margin-top: auto; padding-top: var(--dn-space-3); }
    .dn-vehicle-card__amount { margin-top: 0; }

    @media (hover: hover) and (pointer: fine) {
      .dn-vehicle-card:hover { box-shadow: var(--dn-card-hover-shadow); }
    }
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
      min-height: 0;
      border-radius: 16px;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__link {
      display: grid;
      min-height: 0;
      grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__visual {
      height: 100%;
      min-height: 0;
      aspect-ratio: auto;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__image {
      position: absolute;
      inset: 0;
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
      grid-template-rows: repeat(4, auto);
      align-content: start;
      gap: var(--dn-space-2);
      padding: var(--dn-space-3);
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
      gap: var(--dn-space-1);
      color: #626873;
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-meta);
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta > span + span::before { content: '·'; }

    .dn-vehicle-card--listing .dn-vehicle-card__name {
      display: -webkit-box;
      min-width: 0;
      font-size: var(--dn-text-lead);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-control);
      white-space: normal;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
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
