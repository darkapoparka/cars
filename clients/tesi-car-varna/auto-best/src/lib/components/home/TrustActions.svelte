<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleCutout from '$components/ui/VehicleCutout.svelte';
  import ArtworkRegion from '$components/ui/ArtworkRegion.svelte';
  import { serviceArtwork } from '$data/service-artwork';
  import { featureArtwork } from '$data/feature-artwork';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  let { group, variant = 'banners' }: { group: 'browse' | 'ownership' | 'all'; variant?: 'banners' | 'cards' } = $props();

  const actions = [
    {
      title: 'Вижте колекцията',
      artwork: { src: '/assets/images/lead/day-night-collection-banner-v2.webp', width: 1200, height: 668, bounds: [21, 122, 1172, 552], view: 'front-pair' },
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
      title: 'Регистрация и транзитни номера',
      artwork: { src: '/assets/images/lead/day-night-sell-banner-v2.webp', width: 1200, height: 675, bounds: [21, 79, 1180, 583], view: 'three-quarter' },
      vehicle: 'gclass',
      tone: 'red',
      mobileTitle: 'Регистрация',
      mobileCta: 'Попитай',
      description: 'Попитайте за съдействие при регистрация или транзитни номера.',
      bannerDescription: ['Съдействие', 'при регистрация и транзитни номера.'],
      cta: 'Попитайте за съдействие',
      href: '/contact?topic=trade-in',
      icon: 'value'
    },
    {
      title: 'Внос по заявка',
      vehicle: 'gclass',
      tone: 'red',
      mobileTitle: 'Внос по заявка',
      mobileCta: 'Заяви внос',
      description: 'Споделете модел и бюджет за внос по заявка.',
      bannerDescription: ['Споделете своя бюджет', 'и модел за внос.'],
      cta: 'Заявете внос',
      href: '/contact?topic=import',
      icon: 'contact'
    },
    {
      title: 'Лизинг по обявите',
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
        <div class="dn-services-heading dn-home-section-heading dn-home-section-heading--branded dn-home-section-heading--red dn-home-banner-frame dn-home-banner-copy">
          <h2 class="dn-home-section-title">Как можем да помогнем</h2>
          
          <a class="dn-home-section-action" href={resolve('/contact')}>Свържете се с нас</a>
        </div>
      {/if}
      <div class="dn-trust-actions__grid" aria-label="Следващи стъпки">
        {#each visibleActions as action (action.href)}
          <article class={variant === 'cards' ? 'dn-service-card' : 'dn-trust-card'} class:dn-trust-card--ownership={variant === 'banners' && group === 'ownership'} class:dn-trust-card--illustrated={variant === 'banners' && group === 'browse'} class:dn-trust-card--red={variant === 'banners' && action.tone === 'red'} class:dn-trust-card--campaign={variant === 'banners' && 'artwork' in action}>
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
            {#if variant === 'banners' && group === 'browse'}
              <div class="dn-trust-card__mobile-art" aria-hidden="true">
                <ArtworkRegion artwork={serviceArtwork[action.icon]} />
              </div>
            {/if}
            {#if variant === 'banners' && group === 'ownership'}
              <div class="dn-trust-card__ownership-art" aria-hidden="true"><ArtworkRegion artwork={action.icon === 'contact' ? featureArtwork.import : featureArtwork.finance} /></div>
            {/if}
            {#if variant === 'cards'}
              {@const art = serviceArtwork[action.icon]}
              <div class="dn-service-card__art" aria-hidden="true" style:--service-art-width={`${art.crop[2] / art.crop[3] * 88}px`}><ArtworkRegion artwork={art} /></div>
            {/if}
            <div class="dn-trust-card__icon" aria-hidden="true">
              <OriginalActionIcon name={action.icon} />
            </div>

            <div class="dn-trust-card__content">
              <h3 id={`trust-${variant}-${action.icon}`}>
                {#if variant === 'banners'}
                  <a class="desktop-copy" href={resolve(action.href)}>{action.title}</a><span class="mobile-copy">{action.mobileTitle}</span>
                {:else}
                  <a href={resolve(action.href)}><span class="desktop-copy">{action.title}</span><span class="mobile-copy">{action.icon === 'finance' ? 'Лизинг' : action.icon === 'contact' ? 'Внос' : action.icon === 'value' ? 'Регистрация' : action.mobileTitle}</span></a>
                {/if}
              </h3>
              <p>{#if variant === 'banners'}{#each action.bannerDescription as line (line)}<span class="dn-trust-card__description-line">{`${line} `}</span>{/each}{:else}{action.description}{/if}</p>
              <a class="dn-trust-card__action" href={resolve(action.href)} aria-labelledby={`trust-${variant}-${action.icon} trust-action-${variant}-${action.icon}`}>
                <span id={`trust-action-${variant}-${action.icon}`}><span class="desktop-copy">{action.cta}</span><span class="mobile-copy">{variant === 'cards' && action.icon === 'value' ? 'Съдействие' : variant === 'cards' && action.icon === 'finance' ? 'Условия' : action.mobileCta}</span></span>
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
  .dn-service-card__art, .mobile-copy, .dn-trust-card__icon, .dn-trust-card__mobile-art, .dn-trust-card__ownership-art { display: none; }
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
    .dn-trust-card { min-height: var(--dn-home-banner-height); padding: var(--dn-home-banner-padding); }
    .dn-trust-card__content { justify-content: flex-start; }
    .dn-trust-card h3 { margin: 0; }
    .dn-trust-card p { margin: var(--dn-home-copy-gap) 0 0; }
    .dn-trust-card .dn-trust-card__action { margin-top: var(--dn-home-cta-gap); }
    .dn-trust-card--campaign { container-type: inline-size; }
    .dn-trust-card--campaign .dn-trust-card__content { width: 100%; }
    .dn-trust-card--campaign p { width: calc(40% - var(--dn-home-copy-gap)); }
    .dn-trust-card--campaign .dn-trust-card__action { width: max-content; white-space: nowrap; }
    .dn-trust-card__vehicle--campaign {
      --car-height: min(144px, calc((100cqw + 64px) * .55 / 2.676744));
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
  .dn-trust-card__action { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 9px; align-self: flex-start; margin-top: auto; padding: 10px 14px; border-radius: var(--dn-radius-button); background: #fff; color: #202329; font: var(--dn-cta-font); letter-spacing: var(--dn-cta-tracking); }
  .dn-trust-card__action:hover { background: #eceef1; }
  .dn-trust-card a:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
  .dn-home-services { padding: 32px 0 64px; background: #fff; }
  .dn-home-services .dn-trust-actions__panel { padding: 32px; border-radius: 20px; background: #f1f3f5; }
  .dn-services-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; margin-bottom: 24px; }
  
  .dn-services-heading > a { grid-column: 2; }
  .dn-home-services .dn-trust-actions__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (min-width: 992px) {
    .dn-home-services .dn-trust-actions__panel { padding: 0; background: var(--dn-home-panel); }
    .dn-services-heading { margin-bottom: 0; }
    .dn-home-services .dn-trust-actions__grid { position: relative; margin-top: calc(-1 * var(--dn-home-banner-overlap)); padding: 24px; border-radius: var(--dn-radius); background: var(--dn-home-panel); }
    .dn-home-services .dn-service-card .dn-trust-card__action { background: var(--dn-red); color: var(--dn-white); }
    .dn-home-services .dn-service-card .dn-trust-card__action:hover { background: var(--dn-red-hover); color: var(--dn-white); }
    .dn-trust-card__action :global(svg) { width: 18px; height: 18px; stroke-width: 2; flex-shrink: 0; }
  }
  .dn-service-card { display: flex; flex-direction: column; min-width: 0; min-height: 272px; padding: 24px; border-radius: 16px; background: #fff; }
  .dn-service-card .dn-trust-card__icon { display: block; width: 60px; height: 60px; margin-bottom: 20px; color: var(--dn-red); }
  .dn-service-card .dn-trust-card__content { width: 100%; }
  .dn-service-card h3 { margin: 0 0 12px; color: #24272c; font-size: 20px; line-height: 1.25; }
  .dn-service-card h3 a { color: inherit; }
  .dn-service-card p { margin: 0 0 24px; color: #696665; font-size: 16px; line-height: 1.5; }
  .dn-service-card .dn-trust-card__action { width: 100%; padding-inline: 10px; border: 1px solid var(--dn-red); color: var(--dn-red); font: var(--dn-cta-font); }
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
  @media (max-width: 767px) {
    .dn-services-heading > a { display: none; }
    .dn-service-card { position: relative; min-height: 144px; padding: 12px 10px 16px; align-items: center; justify-content: center; text-align: center; }
    .dn-service-card .dn-trust-card__icon, .dn-service-card .dn-trust-card__icon :global(svg) { width: 48px; height: 48px; }
    .dn-service-card .dn-trust-card__icon { display: none; }
    .dn-service-card__art { display: flex; align-items: center; justify-content: center; height: 88px; width: 100%; margin-bottom: 4px; pointer-events: none; }
    .dn-service-card__art :global(.dn-artwork-region) { width: min(100%, var(--service-art-width)); }
    .dn-service-card h3 { margin: 0; font-size: 18px; line-height: 1.22; white-space: normal; }
    .dn-service-card .dn-trust-card__action { display: none; }
    .dn-service-card .dn-trust-card__content { position: static; flex: none; }
    .dn-service-card h3 a::after { position: absolute; inset: 0; border-radius: inherit; content: ''; }
    .dn-service-card:has(a:focus-visible) { outline: 2px solid var(--dn-red); outline-offset: 3px; }
    .dn-service-card a:focus-visible { outline: none; }
    .dn-service-card:hover { background: var(--dn-surface); }
    .dn-trust-actions[data-banner-group="ownership"] .dn-trust-actions__grid { grid-template-columns: minmax(0, 1fr); }
    .dn-trust-card--ownership { min-height: 156px; padding: 20px; align-items: flex-start; background: #18191c; color: #fff; text-align: left; }
    .dn-trust-card--ownership.dn-trust-card--red { background: #b80024; }
    .dn-trust-card--ownership .dn-trust-card__icon { display: none; }
    .dn-trust-card--ownership .dn-trust-card__content { width: 58%; }
    .dn-trust-card--ownership h3 { font-size: 20px; text-wrap: initial; line-height: 1.2; }
    .dn-trust-card--ownership .dn-trust-card__action { align-self: flex-start; min-height: 44px; margin-top: auto; color: #fff; font-size: 15px; font-weight: 600; }
    .dn-trust-card--ownership .dn-trust-card__action :global(svg) { display: none; }
    .dn-trust-card--ownership .dn-trust-card__action:hover { color: #fff; }
    .dn-trust-card--ownership .dn-trust-card__ownership-art { display: flex; position: absolute; right: -18px; top: 0; bottom: 0; width: 56%; align-items: center; pointer-events: none; mask-image: linear-gradient(to right, transparent, #000 32%); }

    .dn-trust-card--illustrated {
      min-height: 188px;
      padding: 12px 8px;
      background: var(--dn-mobile-surface);
      display: grid;
      grid-template-rows: 44px 108px;
      align-content: start;
    }
    .dn-trust-card--illustrated .dn-trust-card__icon { display: none; }
    .dn-trust-card--illustrated .dn-trust-card__content { display: contents; }
    .dn-trust-card--illustrated h3 {
      grid-row: 1;
      display: flex;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      margin: 0;
      font-size: 18px;
      line-height: 1.2;
      font-weight: 700;
      text-align: center;
    }
    .dn-trust-card--illustrated .dn-trust-card__mobile-art {
      grid-row: 2;
      display: flex;
      height: 108px;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    .dn-trust-card--illustrated .dn-trust-card__action {
      position: static;
      min-height: 0;
      margin: 0;
    }
    .dn-trust-card--illustrated .dn-trust-card__action > span {
      position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);
    }
    .dn-trust-card--illustrated .dn-trust-card__action :global(svg) {
      display: none;
    }
  }
</style>
