<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let { showActions = true, showMobileFooter = false, observeFooter }: { showActions?: boolean; showMobileFooter?: boolean; observeFooter: Attachment<HTMLElement> } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const actions = $derived([
    {
      title: i18n.t("m_dce64d6d5cf9"),
      description: i18n.t("m_26c39003300b"),
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: i18n.t("m_a760c609372f", { p0: i18n.dealer('city') }),
      description: i18n.t("m_e27d6b64cb71"),
      href: '/contact?topic=inspection',
      icon: 'contact'
    },
    {
      title: i18n.t("m_73322af42813"),
      description: i18n.t("m_83f82e8f7941"),
      href: '/contact?topic=leasing',
      icon: 'finance'
    },
    {
      title: i18n.t("m_fc333acc2c86"),
      description: i18n.t("m_505d84ec9e70"),
      href: '/contact?topic=import',
      icon: 'value'
    }
  ] as const);
</script>

{#if showActions}
  <section class="dn-footer-actions" aria-label={i18n.t("m_920d4a55469d")}>
    <div class="container dn-footer-actions__grid">
      {#each actions as action (action.href)}
        <a href={i18n.href(resolve(action.href))}>
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
      <a class="dn-footer__logo" href={i18n.href(resolve('/'))}><img src={brand.logoOnDark} alt={brand.name} width="220" height="58" /></a>
      <span class="dn-footer__tagline">{i18n.t("m_5cf2001dbaf7")}</span>
      <p>{i18n.t("m_9785a63caa9d")}</p>
    </div>
    <nav class="dn-footer__vehicles" aria-label={i18n.t("m_9e499e4cdaf4")}>
      <strong>{i18n.t("m_9e499e4cdaf4")}</strong>
      <a href={i18n.href(resolve('/listing-grid'))}>{i18n.t("m_13b5d43d1176")}</a>
      <a href={i18n.href(resolve('/listing-grid?condition=used'))}>{i18n.t("m_2b705510e73a")}</a>
      <a href={i18n.href(resolve('/listing-grid?sort=newest'))}>{i18n.t("m_615eaa5f897b")}</a>
    </nav>
    <nav class="dn-footer__company" aria-label={i18n.t("m_de4743c87973")}>
      <strong>{i18n.t("m_de4743c87973")}</strong>
      <a href={i18n.href(resolve('/about-us'))}>{i18n.t("m_b4b580a9ad8c")}</a>
      <a href={i18n.href(resolve('/blog'))}>{i18n.t("m_572cd72feb9a")}</a>
      <a href={i18n.href(resolve('/contact'))}>{i18n.t("m_2b5c3d26721a")}</a>
    </nav>
    <div class="dn-footer__contact" aria-label={i18n.t("m_fa39abdd21f5")}>
      <h2>{i18n.t("m_822db82e0dc3")}</h2>
      <a {...phoneLinkAttributes} class="dn-footer__call">
        <Icon name="phone" size={18} />
        <span>{brand.phone}</span>
      </a>
      <a href={i18n.href(resolve('/contact'))} class="dn-footer__contact-link">
        <Icon name="map-pin" size={18} />
        <span>{i18n.dealer('address')}</span>
        <span class="dn-footer__contact-arrow"><Icon name="arrow-right" size={16} /></span>
      </a>
      <p class="dn-footer__appointment">{i18n.dealer('appointment')}</p>
    </div>
  </div>
  <div class="container dn-footer__bottom"><span class="dn-footer__copyright">© {new Date().getFullYear()} {brand.name}</span><span class="dn-footer__descriptor">{i18n.t("m_5cf2001dbaf7")}</span></div>
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
