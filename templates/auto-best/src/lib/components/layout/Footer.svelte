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
      <a class="dn-footer__logo" href={i18n.href(resolve('/'))}>
        <span>{brand.name}</span>
      </a>
      <span class="dn-footer__tagline">{i18n.t("m_5cf2001dbaf7")}</span>
      <p>{i18n.t("m_9785a63caa9d")}</p>
    </div>
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
    <nav class="dn-footer__vehicles" aria-label={i18n.t("m_9e499e4cdaf4")}>
      <strong>{i18n.t("m_9e499e4cdaf4")}</strong>
      <a href={i18n.href(resolve('/listing-grid'))}>{i18n.t('footer.inventory.all')}</a>
      <a href={i18n.href(resolve('/listing-grid?condition=used'))}>{i18n.t('footer.inventory.used')}</a>
      <a href={i18n.href(resolve('/listing-grid?sort=newest'))}>{i18n.t('footer.inventory.latest')}</a>
    </nav>
    <nav class="dn-footer__company" aria-label={i18n.t("m_de4743c87973")}>
      <strong>{i18n.t("m_de4743c87973")}</strong>
      <a href={i18n.href(resolve('/about-us'))}>{i18n.t("m_b4b580a9ad8c")}</a>
      <a href={i18n.href(resolve('/blog'))}>{i18n.t("m_572cd72feb9a")}</a>
      <a href={i18n.href(resolve('/contact'))}>{i18n.t("m_2b5c3d26721a")}</a>
    </nav>
  </div>
  <div class="container dn-footer__bottom"><span class="dn-footer__copyright">© {new Date().getFullYear()} {brand.name}</span><span class="dn-footer__descriptor">{i18n.t("m_5cf2001dbaf7")}</span></div>
</footer>

<style>
  .dn-footer-actions { padding-block: var(--dn-space-6); background: var(--dn-surface); color: var(--dn-ink); }
  .dn-footer-actions__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--dn-space-4); }
  .dn-footer-actions__grid > a { display: grid; min-width: 0; min-height: 112px; grid-template-columns: 48px minmax(0, 1fr); align-items: center; gap: var(--dn-space-3); padding: var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius); background: var(--dn-white); color: var(--dn-ink); text-decoration: none; }
  .dn-footer-actions__icon { display: grid; width: 48px; height: 48px; place-items: center; color: var(--dn-red); }
  .dn-footer-actions__icon :global(svg) { display: block; width: 44px; height: 44px; }
  .dn-footer-actions strong { display: block; margin-bottom: var(--dn-space-1); font-size: var(--dn-text-body); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-body); }
  .dn-footer-actions small { display: block; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-footer-actions a:hover strong { color: var(--dn-red); }
  .dn-footer-actions a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 3px; border-radius: var(--dn-radius); }
  @media (min-width: 768px) and (hover: hover) {
    .dn-footer-actions__grid > a { transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease; }
    .dn-footer-actions__grid > a:hover { transform: translateY(-2px); border-color: var(--dn-line-strong); box-shadow: var(--dn-card-hover-shadow); }
  }

  .dn-footer {
    margin-top: var(--dn-space-4);
    padding-block: 40px var(--dn-space-6);
    border-top: 1px solid var(--dn-line);
    border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    background: var(--dn-white);
    color: var(--dn-ink);
  }
  .dn-footer__grid { display: grid; grid-template-columns: 1.2fr .8fr .65fr 1.3fr; grid-template-areas: 'intro vehicles company contact'; align-items: start; gap: 40px; }
  .dn-footer__intro { grid-area: intro; }
  .dn-footer__contact { grid-area: contact; }
  .dn-footer__vehicles { grid-area: vehicles; }
  .dn-footer__company { grid-area: company; }
  .dn-footer__grid > * { min-width: 0; }
  .dn-footer__logo { display: inline-flex; min-height: var(--dn-control-hit-height); align-items: center; color: inherit; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
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

  @media (min-width: 768px) {
    .dn-footer {
      margin-top: var(--dn-space-8);
      padding-block: 64px var(--dn-space-6);
      border: 0;
      border-radius: 40px 40px 0 0;
      background:
        radial-gradient(ellipse at 87% 0%, rgb(var(--dn-theme-accent-rgb) / 18%), transparent 38%),
        var(--dn-ink-deep);
      color: var(--dn-white);
    }
    .dn-footer__grid { gap: 48px; }
    .dn-footer__tagline, .dn-footer__intro p, .dn-footer__appointment { color: var(--dn-muted-on-ink); }
    .dn-footer nav strong, .dn-footer__contact h2 { color: var(--dn-white); }
    .dn-footer nav a { color: var(--dn-muted-on-ink); }
    .dn-footer nav a:hover { color: var(--dn-white); text-decoration: underline; text-underline-offset: 4px; }
    .dn-footer .dn-footer__contact-link { color: var(--dn-text-on-ink); }
    .dn-footer .dn-footer__contact-link:hover { color: var(--dn-white); }
    .dn-footer__contact-arrow { color: var(--dn-white); transition: transform 180ms ease; }
    .dn-footer__contact-link:hover .dn-footer__contact-arrow { transform: translate(3px, -3px) rotate(-45deg); }
    .dn-footer__call { transition: background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease; }
    .dn-footer .dn-footer__call:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgb(0 0 0 / 24%); }
    .dn-footer__bottom { margin-top: 44px; padding-top: var(--dn-space-5); border-color: rgb(255 255 255 / 14%); color: var(--dn-muted-on-ink); }
    .dn-footer a:focus-visible { outline-color: var(--dn-white); }
  }

  @media (min-width: 768px) and (max-width: 1100px) {
    .dn-footer-actions__grid, .dn-footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dn-footer__grid { grid-template-areas: 'intro contact' 'vehicles company'; }
  }
  @media (max-width: 767px) {
    .dn-footer-actions, .dn-footer--mobile-hidden { display: none; }
    .dn-footer {
      margin-top: var(--dn-space-8);
      padding-block: var(--dn-space-6) max(var(--dn-space-6), env(safe-area-inset-bottom));
      border: 0;
      border-radius: var(--dn-space-6) var(--dn-space-6) 0 0;
      background: var(--dn-ink-deep);
      color: var(--dn-white);
    }
    .dn-footer > .container { width: calc(100% - 40px); }
    .dn-footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: 'intro intro' 'contact contact' 'vehicles company'; gap: var(--dn-space-4); }
    .dn-footer__tagline, .dn-footer__intro p, .dn-footer nav strong, .dn-footer__contact h2 { display: none; }
    .dn-footer nav { padding-top: var(--dn-space-3); border-top: 1px solid rgb(255 255 255 / 14%); }
    .dn-footer nav a { color: var(--dn-muted-on-ink); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-regular); }
    .dn-footer a:hover { color: var(--dn-white); }
    .dn-footer a:focus-visible { outline-color: var(--dn-white); }
    .dn-footer__call { min-height: var(--dn-control-hit-height); padding: 0; border-radius: var(--dn-radius-sm); background: transparent; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-body); }
    .dn-footer__call :global(svg), .dn-footer__contact-link > :global(svg), .dn-footer__contact-arrow { display: none; }
    .dn-footer .dn-footer__call:hover { background: transparent; }
    .dn-footer__contact-link { display: flex; margin-top: 0; padding-block: var(--dn-space-1); color: var(--dn-text-on-ink); font: var(--dn-body-font); }
    .dn-footer__contact-link:hover { text-decoration: underline; text-underline-offset: var(--dn-space-1); }
    .dn-footer__appointment { margin-top: var(--dn-space-2); color: var(--dn-muted-on-ink); }
    .dn-footer__bottom { flex-direction: column; gap: var(--dn-space-2); margin-top: var(--dn-space-4); padding-top: var(--dn-space-4); border-color: rgb(255 255 255 / 14%); color: var(--dn-muted-on-ink); }
    .dn-footer__copyright { color: var(--dn-text-on-ink); }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-footer-actions__grid > a { transition: none; }
    .dn-footer-actions__grid > a:hover { transform: none; }
    .dn-footer__call, .dn-footer__contact-arrow { transition: none; }
    .dn-footer .dn-footer__call:hover { transform: none; }
    .dn-footer__contact-link:hover .dn-footer__contact-arrow { transform: rotate(-45deg); }
  }
</style>
