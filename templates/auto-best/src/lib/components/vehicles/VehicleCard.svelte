<script lang="ts">
  import { specificationLabel, formatMileage, compactSpecificationLabel } from '$lib/i18n/presentation';


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { withListReturn } from '$data/journeys';
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { formatVehiclePriceLabel, type Vehicle } from '$data/inventory';
  import { imageSrcset } from '$data/responsive-images';

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
  const cardBrand = $derived(vehicle.cardBrand ?? vehicle.make);
  const mobileModelTitle = $derived(vehicle.title.startsWith(`${cardBrand} `)
    ? vehicle.title.slice(cardBrand.length + 1)
    : modelTitle);
  const priceLabel = $derived(formatVehiclePriceLabel(vehicle.priceEur, i18n.locale));
  const equipmentHighlight = $derived(vehicle.equipment.find(feature => feature === 'Панорамен покрив') ?? vehicle.equipment[0]);
  const cardNote = $derived(vehicle.cardNote?.[i18n.locale]?.trim() ||
    (equipmentHighlight ? specificationLabel(equipmentHighlight, i18n.locale) : ''));
  const specifications = $derived([
    { icon: 'fuel' as const, value: vehicle.fuel },
    { icon: 'transmission' as const, value: vehicle.transmission }
  ].map(spec => ({
    ...spec,
    label: specificationLabel(spec.value, i18n.locale),
    compactLabel: compactSpecificationLabel(spec.value, i18n.locale)
  })));
</script>

{#snippet amount()}
  {#if showPrice}
    <div class="dn-vehicle-card__amount">{priceLabel}</div>
  {/if}
{/snippet}

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
        srcset={imageSrcset(vehicle.image)}
        sizes={layout === 'listing' ? '(max-width: 767px) 156px, (max-width: 991px) 50vw, (max-width: 1279px) 33vw, 25vw' : '(max-width: 767px) 250px, (max-width: 991px) 50vw, 25vw'}
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
        <p class="dn-vehicle-card__make">
          {#if layout === 'listing'}
            <span class="dn-vehicle-card__make-title">{vehicle.make}</span><span class="dn-vehicle-card__mobile-make">{cardBrand}</span>
          {:else}
            {vehicle.make}
          {/if}
        </p>
        {#if layout === 'listing'}
          <h2 class="dn-vehicle-card__name" title={vehicle.title}>
            <span class="dn-vehicle-card__model-title">{modelTitle}</span><span class="dn-vehicle-card__mobile-title">{mobileModelTitle}</span>
          </h2>
          {#if cardNote}
            <p class="dn-vehicle-card__note" title={cardNote}>{cardNote}</p>
          {/if}
        {:else}
          <h3 class="dn-vehicle-card__name" title={vehicle.title}>{modelTitle}</h3>
        {/if}
      </div>
      {#if layout === 'listing'}
        {@render amount()}
      {/if}
      {#if layout === 'showcase'}
        <p class="dn-vehicle-card__summary">{vehicle.year} · {specificationLabel(vehicle.fuel, i18n.locale)}</p>
      {/if}
      {#if layout !== 'showcase'}
      <div class="dn-vehicle-card__specs" aria-label={i18n.t("m_148a9be6e575")}>
        {#each specifications as spec (spec.icon)}
          <span class="dn-vehicle-card__spec" class:dn-vehicle-card__spec--transmission={spec.icon === 'transmission'} title={spec.label}>
            <Icon name={spec.icon} size={15} strokeWidth={1.7} />
            <span class="dn-vehicle-card__spec-full" aria-hidden="true">{spec.label}</span>
            <span class="dn-vehicle-card__spec-compact" aria-hidden="true">{spec.compactLabel}</span>
            <span class="dn-sr-only">{spec.label}</span>
          </span>
        {/each}
      </div>
      {/if}

      {#if layout !== 'listing'}
        {@render amount()}
      {/if}
    </div>
    {#if layout !== 'showcase'}
      <ul class="dn-vehicle-card__mobile-meta" aria-label={i18n.t("m_148a9be6e575")}>
        <li class="dn-vehicle-card__fact"><span>{vehicle.year}</span></li>
        <li class="dn-vehicle-card__fact" title={formatMileage(vehicle.mileageKm, i18n.locale)}><span>{formatMileage(vehicle.mileageKm, i18n.locale)}</span></li>
        {#each specifications.filter(spec => layout === 'listing' || spec.icon === 'fuel') as spec (spec.icon)}
          <li class="dn-vehicle-card__fact dn-vehicle-card__fact--spec" class:dn-vehicle-card__fact--transmission={spec.icon === 'transmission'} title={spec.label}><span aria-hidden="true">{spec.compactLabel}</span><span class="dn-sr-only">{spec.label}</span></li>
        {/each}
        {#if layout === 'listing'}
          <li class="dn-vehicle-card__fact dn-vehicle-card__fact--body" title={specificationLabel(vehicle.body, i18n.locale)}><span>{specificationLabel(vehicle.body, i18n.locale)}</span></li>
        {/if}
      </ul>
    {/if}
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
  .dn-vehicle-card__note { display: none; }
  .dn-vehicle-card__mobile-meta { display: none; }
  .dn-vehicle-card__mobile-title,
  .dn-vehicle-card__mobile-make { display: none; }
  .dn-vehicle-card__spec-compact { display: none; }
  .dn-vehicle-card {
    container-type: inline-size;
    display: flex;
    width: 100%;
    min-width: 0;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    border: 0;
    border-radius: var(--dn-radius-card);
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
    flex-wrap: wrap;
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
    flex-wrap: wrap;
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
    border-radius: var(--dn-radius-media);
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

  .dn-vehicle-card--listing .dn-vehicle-card__amount { order: 1; }

  @media (min-width: 992px) {
    .dn-vehicle-card {
      box-shadow: var(--dn-card-shadow);
      transition: box-shadow 120ms ease-out, transform 180ms ease-out;
    }

    .dn-vehicle-card--listing {
      --dn-vehicle-card-title-lines: 1;
      border-radius: var(--dn-radius-lg);
    }

    @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
      .dn-vehicle-card--listing:hover { transform: translateY(-2px); }
      .dn-vehicle-card--listing:hover .dn-vehicle-card__image img { transform: scale(1.025); }
    }

    .dn-vehicle-card__content { padding: var(--dn-space-4); }
    .dn-vehicle-card--showcase .dn-vehicle-card__content { padding: var(--dn-space-3) var(--dn-space-4); }
    .dn-vehicle-card__name { font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-card); }
    .dn-vehicle-card__badges { inset: 12px 12px auto; }
    .dn-vehicle-card__badge { padding: 5px 10px; font-size: var(--dn-text-meta); font-variant-numeric: tabular-nums; }
    .dn-vehicle-card__specs { margin-top: auto; padding-top: var(--dn-space-2); }
    .dn-vehicle-card__amount { margin-top: 0; padding-top: var(--dn-space-2); }
    .dn-vehicle-card--listing .dn-vehicle-card__content { padding: var(--dn-space-4); }
    .dn-vehicle-card--listing .dn-vehicle-card__specs { margin-top: var(--dn-space-2); padding-top: 0; }
    .dn-vehicle-card--listing .dn-vehicle-card__amount { padding-top: var(--dn-space-2); }

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
      font-size: var(--dn-text-caption);
      line-height: var(--dn-leading-meta);
    }

    .dn-vehicle-card__badge--year {
      background: var(--dn-white);
      color: var(--dn-ink);
    }

    .dn-vehicle-card__badges,
    .dn-vehicle-card__specs { display: none; }

    .dn-vehicle-card__mobile-meta {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      order: 2;
      gap: var(--dn-space-half);
      margin: 0 var(--dn-space-3) var(--dn-space-3);
      padding: 0;
      list-style: none;
    }

    .dn-vehicle-card__content {
      order: 1;
      padding: var(--dn-space-3) var(--dn-space-3) var(--dn-space-2);
    }

    .dn-vehicle-card__make {
      font: var(--dn-mobile-card-meta-font);
    }

    .dn-vehicle-card__name {
      font: var(--dn-mobile-card-title-font);
      letter-spacing: var(--dn-tracking-normal);
    }

    .dn-vehicle-card__spec {
      min-height: 28px;
      gap: var(--dn-space-1);
      padding-inline: var(--dn-vehicle-card-spec-padding, var(--dn-space-2));
      font: var(--dn-mobile-card-spec-font);
    }
    .dn-vehicle-card__spec-full { display: none; }
    .dn-vehicle-card__spec-compact,
    .dn-vehicle-card__spec--transmission .dn-vehicle-card__spec-full {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dn-vehicle-card__spec--transmission .dn-vehicle-card__spec-compact { display: none; }
    .dn-vehicle-card__spec :global(svg) { flex: 0 0 auto; }
    .dn-vehicle-card__amount {
      margin-top: var(--dn-space-2);
      padding-top: 0;
      font: var(--dn-mobile-card-price-font);
    }

    .dn-vehicle-card--listing {
      display: flex;
      height: auto;
      min-height: 0;
      border-radius: var(--dn-radius-card);
      box-shadow: var(--dn-card-shadow);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__link {
      display: grid;
      min-height: 0;
      grid-template-columns: minmax(0, min(45%, var(--dn-mobile-listing-photo-max-width))) minmax(0, 1fr);
      grid-template-rows: auto auto;
      grid-template-areas: "visual content" "facts facts";
      column-gap: var(--dn-space-3);
      row-gap: var(--dn-space-2);
      padding: var(--dn-space-2);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__visual {
      height: auto;
      min-height: var(--dn-mobile-listing-photo-min-height);
      width: 100%;
      grid-area: visual;
      align-self: stretch;
      aspect-ratio: auto;
      border-radius: var(--dn-radius-sm);
    }

    .dn-vehicle-card--listing .dn-vehicle-card__image {
      position: absolute;
      inset: 0;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__content {
      display: grid;
      min-width: 0;
      grid-area: content;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto 1fr;
      grid-template-areas: "identity" "price";
      align-content: stretch;
      gap: var(--dn-space-2);
      padding: var(--dn-space-half) 0;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__identity {
      grid-area: identity;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__note {
      display: block;
      min-width: 0;
      margin: var(--dn-space-half) 0 0;
      overflow: hidden;
      color: var(--dn-muted);
      font: var(--dn-mobile-card-meta-font);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__make {
      display: block;
      color: var(--dn-muted);
      overflow-wrap: anywhere;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__model-title { display: none; }
    .dn-vehicle-card--listing .dn-vehicle-card__make-title { display: none; }
    .dn-vehicle-card--listing .dn-vehicle-card__mobile-title,
    .dn-vehicle-card--listing .dn-vehicle-card__mobile-make { display: inline; }

    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta {
      grid-area: facts;
      flex-wrap: wrap;
      gap: var(--dn-space-1);
      margin: 0;
    }

    .dn-vehicle-card__fact {
      display: inline-flex;
      flex: 1 1 auto;
      min-width: 0;
      max-width: 100%;
      align-items: center;
      justify-content: center;
      padding: var(--dn-space-1) var(--dn-space-half);
      overflow: hidden;
      border: 0;
      border-radius: var(--dn-radius-xs);
      background: var(--dn-surface-panel);
      color: var(--dn-ink-hover);
      font: var(--dn-mobile-card-spec-font);
      font-variant-numeric: tabular-nums;
      text-align: center;
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__fact {
      flex: 0 1 auto;
      padding-inline: var(--dn-space-2);
    }

    .dn-vehicle-card__fact > span:not(.dn-sr-only) {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__name {
      display: -webkit-box;
      min-width: 0;
      white-space: normal;
      overflow-wrap: normal;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__specs {
      display: none;
    }

    .dn-vehicle-card--listing .dn-vehicle-card__amount {
      grid-area: price;
      justify-self: start;
      align-self: end;
      margin-top: 0;
      padding: 0;
      color: var(--dn-ink);
      font: var(--dn-mobile-card-price-compact-font);
      letter-spacing: var(--dn-tracking-normal);
      text-align: start;
      overflow-wrap: anywhere;
    }

    /* Keep four useful overview facts when the card itself is narrow. */
    @container (max-width: 24rem) {
      .dn-vehicle-card--listing .dn-vehicle-card__fact--body { display: none; }
    }

    /* Enlarged text needs a full-width identity and price instead of a tight side column. */
    @container (max-width: 12rem) {
      .dn-vehicle-card--listing .dn-vehicle-card__link {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto auto auto;
        grid-template-areas: "visual" "content" "facts";
      }
      .dn-vehicle-card--listing .dn-vehicle-card__visual { aspect-ratio: 3 / 2; }
      .dn-vehicle-card--listing .dn-vehicle-card__content {
        grid-template-rows: auto auto;
        padding: 0;
      }
      .dn-vehicle-card--listing .dn-vehicle-card__note {
        white-space: normal;
        overflow-wrap: anywhere;
      }
    }
  }

  /* Preserve the desktop narrow-card reflow independently of mobile title limits. */
  @media (min-width: 768px) {
  @container (max-width: 15rem) {
    .dn-vehicle-card--listing .dn-vehicle-card__mobile-meta {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-vehicle-card__name,
    .dn-vehicle-card--listing .dn-vehicle-card__name {
      display: block;
      overflow: visible;
      white-space: normal;
      overflow-wrap: anywhere;
      line-clamp: none;
      -webkit-line-clamp: unset;
    }
    .dn-vehicle-card__make { overflow-wrap: anywhere; }
  }
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
