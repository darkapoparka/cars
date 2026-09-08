<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleCutout from '$components/ui/VehicleCutout.svelte';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  let { group, variant = 'banners' }: { group: 'browse' | 'ownership' | 'all'; variant?: 'banners' | 'cards' } = $props();

  const actions = [
    {
      title: 'Вижте колекцията',
      artwork: { src: '/assets/avangard/vehicle-08-1.webp', width: 1200, height: 668, bounds: [21, 122, 1172, 552], view: 'front-pair' },
      vehicle: 'urus',
      tone: 'black',
      mobileTitle: 'Автомобили',
      mobileCta: 'Разгледай',
      description: 'Разгледайте автомобилите с удобни филтри.',
      bannerDescription: ['Изберете автомобил', 'с удобни филтри.'],
      cta: 'Към автомобилите',
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: 'Въпрос за автомобил',
      artwork: { src: '/assets/avangard/vehicle-09-1.webp', width: 1200, height: 675, bounds: [21, 79, 1180, 583], view: 'three-quarter' },
      vehicle: 'gclass',
      tone: 'red',
      mobileTitle: 'Вашият автомобил',
      mobileCta: 'Заяви оценка',
      description: 'Попитайте за вашия автомобил.',
      bannerDescription: ['Изпратете въпрос', 'за вашия автомобил.'],
      cta: 'Поискайте оценка',
      href: '/contact?topic=trade-in',
      icon: 'value'
    },
    {
      title: 'Транспорт в България',
      vehicle: 'gclass',
      tone: 'red',
      mobileTitle: 'Транспорт в България',
      mobileCta: 'Попитай за транспорт',
      description: 'Попитайте за транспорт на избрания автомобил.',
      bannerDescription: ['Посочете автомобила', 'и адрес за доставка.'],
      cta: 'Попитайте за транспорт',
      href: '/contact?topic=import',
      icon: 'contact'
    },
    {
      title: 'Лизинг',
      vehicle: 'urus',
      tone: 'black',
      mobileTitle: 'Лизинг',
      mobileCta: 'Виж условия',
      description: 'Попитайте за първоначална вноска, срок и условия.',
      bannerDescription: ['Попитайте за вноска,', 'срок и условия.'],
      cta: 'Поискайте условия',
      href: '/contact?topic=leasing',
      icon: 'finance'
    }
  ] as const;
  const visibleActions = $derived(group === 'all' ? actions : group === 'browse' ? actions.slice(0, 2) : actions.slice(2));
</script>

<section class:dn-trust-actions={variant === 'banners'} class:dn-home-services={variant === 'cards'} data-banner-group={variant === 'banners' ? group : undefined} aria-label={variant === 'cards' ? 'Как можем да помогнем' : group === 'browse' ? 'Покупка и продажба' : 'Внос и лизинг'}>
  <div class="container">
    <div class="dn-trust-actions__panel">
      {#if variant === 'cards'}
        <div class="dn-services-heading dn-home-section-heading">
          <h2 class="dn-home-section-title">Как можем да помогнем</h2>
          <p>Изберете услуга или се свържете директно с екипа.</p>
          <a class="dn-home-section-action" href={resolve('/contact')}>Свържете се с нас</a>
        </div>
      {/if}
      <div class="dn-trust-actions__grid" aria-label="Следващи стъпки">
        {#each visibleActions as action (action.href)}
          <article class={variant === 'cards' ? 'dn-service-card' : 'dn-trust-card'} class:dn-trust-card--red={variant === 'banners' && action.tone === 'red'} class:dn-trust-card--campaign={variant === 'banners' && 'artwork' in action}>
            {#if variant === 'banners'}
              {#if 'artwork' in action}
                {@const art = action.artwork}
                {@const bodyHeight = art.bounds[3] - art.bounds[1]}
                <div class="dn-trust-card__vehicle dn-trust-card__vehicle--campaign"
                  style:--art-width={art.width / bodyHeight}
                  style:--art-height={art.height / bodyHeight}
                  style:--art-bottom={art.bounds[3] / bodyHeight}
                  style:--art-right={(art.width - art.bounds[2]) / bodyHeight}>
                  <img class="dn-trust-card__lineup" data-view={art.view} src={art.src} alt="" width={art.width} height={art.height} loading="lazy" decoding="async" />
                </div>
              {:else}
                <div class="dn-trust-card__vehicle"><VehicleCutout vehicle={action.vehicle} framing="banner" /></div>
              {/if}
            {/if}
            <div class="dn-trust-card__icon" aria-hidden="true">
              <OriginalActionIcon name={action.icon} />
            </div>

            <div class="dn-trust-card__content">
              <h3 id={`trust-${variant}-${action.icon}`}>
                {#if variant === 'banners'}
                  <a class="desktop-copy" href={resolve(action.href)}>{action.title}</a><span class="mobile-copy">{action.mobileTitle}</span>
                {:else}
                  <a href={resolve(action.href)}><span class="desktop-copy">{action.title}</span><span class="mobile-copy">{action.mobileTitle}</span></a>
                {/if}
              </h3>
              <p>{#if variant === 'banners'}{#each action.bannerDescription as line (line)}<span class="dn-trust-card__description-line">{`${line} `}</span>{/each}{:else}{action.description}{/if}</p>
              <a class="dn-trust-card__action" href={resolve(action.href)} aria-labelledby={`trust-${variant}-${action.icon} trust-action-${variant}-${action.icon}`}>
                <span id={`trust-action-${variant}-${action.icon}`}><span class="desktop-copy">{action.cta}</span><span class="mobile-copy">{action.mobileCta}</span></span>
                <Icon name="arrow-right" size={16} strokeWidth={1.8} />
              </a>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .mobile-copy, .dn-trust-card__icon { display: none; }
  .dn-trust-actions { padding: 24px 0 32px; background: #fff; }
  .dn-trust-actions__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .dn-trust-card { position: relative; display: flex; flex-direction: column; min-width: 0; min-height: 234px; padding: 28px; overflow: hidden; border-radius: 16px; background: #101114; color: #fff; }
  .dn-trust-card--red { background: #b80024; }
  .dn-trust-card__content { position: relative; display: flex; flex: 1; flex-direction: column; width: 52%; }
  .dn-trust-card h3 { margin: 0 0 12px; color: inherit; font-size: 24px; font-weight: 600; line-height: 1.25; }
  .dn-trust-card h3 a { color: inherit; }
  .dn-trust-card h3 a:hover { text-decoration: underline; text-underline-offset: 4px; }
  .dn-trust-card p { margin: 0 0 20px; color: #e3e4e7; font-size: 16px; line-height: 1.5; }
  .dn-trust-card__description-line { display: block; }
  .dn-trust-card__vehicle { position: absolute; right: -32px; bottom: 4px; width: min(340px, calc(48% + 20px)); height: 226px; pointer-events: none; }
  .dn-trust-card__vehicle :global(img) { object-position: right center; }
  .dn-trust-card__lineup { display: block; width: 100%; height: 100%; object-fit: contain; }
  @media (min-width: 992px) {
    .dn-trust-card--campaign { container-type: inline-size; }
    .dn-trust-card--campaign .dn-trust-card__content { width: 100%; }
    .dn-trust-card--campaign p { width: 40%; }
    .dn-trust-card--campaign .dn-trust-card__action { width: max-content; white-space: nowrap; }
    .dn-trust-card__vehicle--campaign {
      --car-height: min(144px, calc((100cqw + 56px) * .55 / 2.676744));
      top: calc(206px - var(--car-height) * var(--art-bottom));
      right: calc(16px - var(--car-height) * var(--art-right));
      bottom: auto;
      width: calc(var(--car-height) * var(--art-width));
      height: calc(var(--car-height) * var(--art-height));
    }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-trust-card--campaign p { width: 50%; }
    .dn-trust-card__vehicle--campaign { --car-height: calc((100cqw - 192px) / 2.676744); }
  }
  .dn-trust-card__action { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 9px; align-self: flex-start; margin-top: auto; padding: 10px 14px; border-radius: var(--dn-radius-button); background: #fff; color: #202329; font-size: 15px; font-weight: 600; line-height: 1.3; }
  .dn-trust-card__action:hover { background: #eceef1; }
  .dn-trust-card a:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
  .dn-home-services { padding: 32px 0 64px; background: #fff; }
  .dn-home-services .dn-trust-actions__panel { padding: 32px; border-radius: 20px; background: #f1f3f5; }
  .dn-services-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; margin-bottom: 24px; }
  .dn-services-heading p { grid-column: 1; color: #626a75; }
  .dn-services-heading > a { grid-column: 2; }
  .dn-home-services .dn-trust-actions__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .dn-service-card { display: flex; flex-direction: column; min-width: 0; min-height: 272px; padding: 24px; border-radius: 16px; background: #fff; }
  .dn-service-card .dn-trust-card__icon { display: block; width: 60px; height: 60px; margin-bottom: 20px; color: var(--dn-red); }
  .dn-service-card .dn-trust-card__content { width: 100%; }
  .dn-service-card h3 { margin: 0 0 12px; color: #24272c; font-size: 20px; line-height: 1.25; }
  .dn-service-card h3 a { color: inherit; }
  .dn-service-card p { margin: 0 0 24px; color: #696665; font-size: 16px; line-height: 1.5; }
  .dn-service-card .dn-trust-card__action { width: 100%; padding-inline: 10px; border: 1px solid var(--dn-red); color: var(--dn-red); font-size: 14px; }
  .dn-service-card .dn-trust-card__action:hover { background: var(--dn-red); color: #fff; }
  .dn-service-card a:focus-visible { outline: 2px solid var(--dn-red); outline-offset: 3px; }
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-trust-card h3 { font-size: 20px; }
    .dn-trust-card p { font-size: 15px; }
    .dn-home-services .dn-trust-actions__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 991px) {
    .dn-home-services { padding: 24px 0 32px; background: var(--dn-mobile-canvas); }
    .dn-home-services .dn-trust-actions__panel { padding: 0; background: transparent; }
    .dn-services-heading { display: block; margin-bottom: 16px; }
    .dn-services-heading h2 { font-size: 22px; }
    .dn-services-heading p { font-size: 14px; }
    .dn-services-heading > a { display: inline-flex; align-items: center; min-height: 44px; font-size: 14px; }
    .dn-home-services .dn-trust-actions__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dn-service-card { min-height: 154px; padding: 12px; border-radius: 14px; }
    .dn-service-card .dn-trust-card__icon { width: 38px; height: 38px; margin-bottom: 10px; }
    .dn-service-card .dn-trust-card__icon :global(svg) { width: 38px; height: 38px; }
    .dn-service-card h3 { font-size: 14px; white-space: nowrap; }
    .dn-service-card p { display: none; }
    .dn-service-card .dn-trust-card__action { padding: 0; border: 0; color: #4f5661; font-size: 13px; }
    .dn-service-card .dn-trust-card__action:hover { background: transparent; color: var(--dn-red); }
    .dn-trust-actions { padding: 16px 0 24px; background: var(--dn-mobile-canvas); }
    .dn-trust-actions__grid { gap: 10px; }
    .dn-trust-card { min-height: 144px; align-items: center; padding: 16px 12px; border-radius: 14px; background: var(--dn-mobile-surface); color: var(--dn-ink); text-align: center; }
    .desktop-copy, .dn-trust-card p { display: none; }
    .dn-trust-card__vehicle { display: none; }
    .mobile-copy { display: inline; }
    .dn-trust-card__icon { display: block; width: 38px; height: 38px; margin-bottom: 10px; color: var(--dn-red); }
    .dn-trust-card__icon :global(svg) { width: 38px; height: 38px; }
    .dn-trust-card .dn-trust-card__icon { display: block; width: 32px; height: 32px; margin-bottom: 12px; }
    .dn-trust-card .dn-trust-card__icon :global(svg) { width: 32px; height: 32px; }
    .dn-trust-card__content { width: 100%; }
    .dn-trust-card .dn-trust-card__content { position: static; }
    .dn-trust-card h3 { margin-bottom: 8px; font-size: 16px; font-weight: 650; text-wrap: balance; }
    .dn-trust-card .dn-trust-card__action { min-height: 20px; justify-content: center; align-self: center; gap: 6px; padding: 0; border-radius: 0; background: transparent; color: var(--dn-muted); font-size: 14px; font-weight: 500; }
    .dn-trust-card .dn-trust-card__action::after { position: absolute; inset: 0; border-radius: inherit; content: ''; }
    .dn-trust-card .dn-trust-card__action :global(svg) { flex-shrink: 0; }
    .dn-trust-card:hover { background: var(--dn-surface); }
    .dn-trust-card .dn-trust-card__action:hover { background: transparent; color: var(--dn-ink); }
    .dn-trust-card:has(a:focus-visible) { outline: 2px solid var(--dn-red); outline-offset: 3px; }
    .dn-trust-card a:focus-visible { outline: none; }
  }
</style>
