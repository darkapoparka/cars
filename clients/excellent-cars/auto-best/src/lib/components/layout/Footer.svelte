<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let { showActions = true, showMobileFooter = false, observeFooter }: { showActions?: boolean; showMobileFooter?: boolean; observeFooter: Attachment<HTMLElement> } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const actions = [
    {
      title: 'Подбрани автомобили',
      description: 'Разгледайте актуалната селекция',
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: `Оглед в ${brand.city}`,
      description: 'С предварителна уговорка',
      href: '/contact?topic=inspection',
      icon: 'contact'
    },
    {
      title: 'Собствен лизинг',
      description: 'Попитайте за актуалните условия',
      href: '/contact?topic=leasing',
      icon: 'finance'
    },
    {
      title: 'Внос по заявка',
      description: 'Уточнете критериите с екипа',
      href: '/contact?topic=import',
      icon: 'value'
    }
  ] as const;
</script>

{#if showActions}
  <section class="dn-footer-actions" aria-label="Следващи стъпки">
    <div class="container dn-footer-actions__grid">
      {#each actions as action (action.href)}
        <a href={resolve(action.href)}>
          <span class="dn-footer-actions__icon" aria-hidden="true">
            <OriginalActionIcon name={action.icon} />
          </span>
          <span>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </span>
        </a>
      {/each}
    </div>
  </section>
{/if}

<footer id="dn-site-footer" {@attach observeFooter} class={['dn-footer', { 'dn-footer--mobile-hidden': !showMobileFooter }]}>
  <div class="container dn-footer__grid">
    <div class="dn-footer__intro">
      <a class="dn-footer__logo" href={resolve('/')}><img src={brand.logoOnDark} alt={brand.name} width="220" height="58" /></a>
      <span class="dn-footer__tagline">Автомобили · Внос · Лизинг</span>
      <p>Подбрани премиум автомобили, внос и собствен лизинг с директен контакт с екипа.</p>
    </div>
    <nav class="dn-footer__vehicles" aria-label="Автомобили">
      <strong>Автомобили</strong>
      <a href={resolve('/listing-grid')}>Всички автомобили</a>
      <a href={resolve('/listing-grid?condition=used')}>Употребявани</a>
      <a href={resolve('/listing-grid?sort=newest')}>Най-нови предложения</a>
    </nav>
    <nav class="dn-footer__company" aria-label="Компания">
      <strong>Компания</strong>
      <a href={resolve('/about-us')}>За нас</a>
      <a href={resolve('/blog')}>Полезно</a>
      <a href={resolve('/contact')}>Контакти</a>
    </nav>
    <div class="dn-footer__contact" aria-label="Контакт с екипа">
      <h2>Имате въпроси?</h2>
      <a {...phoneLinkAttributes} class="dn-footer__call">
        <Icon name="phone" size={18} />
        <span>{brand.phone}</span>
      </a>
      <a href={resolve('/contact')} class="dn-footer__contact-link">
        <Icon name="map-pin" size={18} />
        <span>{brand.address}</span>
        <span class="dn-footer__contact-arrow"><Icon name="arrow-right" size={16} /></span>
      </a>
      <p class="dn-footer__appointment">{brand.appointment}</p>
    </div>
  </div>
  <div class="container dn-footer__bottom"><span class="dn-footer__copyright">© {new Date().getFullYear()} {brand.name}</span><span class="dn-footer__descriptor">Автомобили · Внос · Лизинг</span></div>
</footer>

<style>
  .dn-footer-actions { padding-block: var(--dn-space-6); background: var(--dn-surface); color: var(--dn-ink); }
  .dn-footer-actions__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--dn-space-6); }
  .dn-footer-actions__grid > a { display: grid; min-width: 0; grid-template-columns: 48px minmax(0, 1fr); align-items: center; gap: var(--dn-space-3); padding-block: var(--dn-space-2); }
  .dn-footer-actions__icon { display: grid; width: 48px; height: 48px; place-items: center; color: var(--dn-red); }
  .dn-footer-actions__icon :global(svg) { display: block; width: 44px; height: 44px; }
  .dn-footer-actions strong { display: block; margin-bottom: var(--dn-space-1); font-size: var(--dn-text-body); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-body); }
  .dn-footer-actions small { display: block; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-footer-actions a:hover strong { color: var(--dn-red); }
  .dn-footer-actions a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 4px; border-radius: var(--dn-radius-sm); }

  .dn-footer {
    margin-top: var(--dn-space-4);
    padding-block: 40px var(--dn-space-6);
    border-top: 1px solid var(--dn-line);
    border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    background: var(--dn-white);
    color: var(--dn-ink);
  }
  .dn-footer__grid { display: grid; grid-template-columns: 1.2fr .8fr .65fr 1.3fr; align-items: start; gap: 40px; }
  .dn-footer__grid > * { min-width: 0; }
  .dn-footer__logo { display: inline-flex; min-height: var(--dn-control-hit-height); align-items: center; }
  .dn-footer__logo img { width: 190px; height: 50px; object-fit: contain; }
  .dn-footer__tagline { display: block; margin-top: var(--dn-space-2); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-footer__intro p { max-width: 300px; margin: var(--dn-space-4) 0 0; color: var(--dn-muted); font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-footer nav strong { display: block; margin-bottom: var(--dn-space-3); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-body); }
  .dn-footer nav a { display: flex; min-height: var(--dn-control-hit-height); align-items: center; color: var(--dn-muted); font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-footer a { text-decoration: none; }
  .dn-footer a:hover { color: var(--dn-red); }
  .dn-footer a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 4px; }
  .dn-footer__contact h2 { margin: 0 0 var(--dn-space-4); font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-footer__call { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: var(--dn-space-2); padding: var(--dn-space-3) var(--dn-space-6); border-radius: var(--dn-radius-button); background: var(--dn-red); color: var(--dn-white); font: var(--dn-cta-font); }
  .dn-footer .dn-footer__call:hover { background: var(--dn-red-hover); color: var(--dn-white); }
  .dn-footer__contact-link { display: grid; grid-template-columns: 18px minmax(0, 1fr) 24px; min-height: var(--dn-control-hit-height); align-items: center; gap: var(--dn-space-3); margin-top: var(--dn-space-3); padding-block: var(--dn-space-2); color: var(--dn-ink); font: var(--dn-control-font); }
  .dn-footer__contact-arrow { display: grid; justify-self: center; place-items: center; transform: rotate(-45deg); color: var(--dn-muted); }
  .dn-footer__appointment { margin: var(--dn-space-1) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-footer__bottom { display: flex; justify-content: space-between; gap: var(--dn-space-4); margin-top: 32px; padding-top: var(--dn-space-4); border-top: 1px solid var(--dn-line); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }

  @media (min-width: 768px) and (max-width: 1100px) {
    .dn-footer-actions__grid, .dn-footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 767px) {
    .dn-footer-actions, .dn-footer--mobile-hidden { display: none; }
    .dn-footer { padding-block: var(--dn-space-5) max(var(--dn-space-4), env(safe-area-inset-bottom)); }
    .dn-footer > .container { width: calc(100% - 40px); }
    .dn-footer__grid { grid-template-columns: minmax(0, 1fr); gap: var(--dn-space-3); }
    .dn-footer__logo img { width: 160px; height: 42px; }
    .dn-footer__tagline { margin-top: 0; }
    .dn-footer__intro p, .dn-footer__vehicles, .dn-footer nav strong { display: none; }
    .dn-footer__contact h2 { max-width: 300px; margin-bottom: var(--dn-space-3); }
    .dn-footer__call { width: 100%; }
    .dn-footer__contact-link { margin-top: var(--dn-space-2); padding-block: var(--dn-space-1); }
    .dn-footer__appointment { margin-top: 0; }
    .dn-footer__company { display: flex; flex-wrap: wrap; gap: var(--dn-space-1) var(--dn-space-6); }
    .dn-footer__company a { color: var(--dn-ink); }
    .dn-footer__bottom { margin-top: var(--dn-space-2); padding-top: var(--dn-space-3); }
    .dn-footer__descriptor { display: none; }
  }
</style>
