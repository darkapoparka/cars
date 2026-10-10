<script lang="ts">


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import { trapDialogTab } from '$lib/ui/overlay';
  import { brand } from '$config/brand';
  import { canPreviewHomeBanners } from '$lib/ui/home-banner';
  import HomeBannerPicker from './HomeBannerPicker.svelte';
  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';
  import MobileNavIcon from './MobileActionIcon.svelte';
  import type { HeaderPresentation } from '$data/shell';
  let { closeMobile, attachMobileMenu, attachMobileCloseButton, active }: {
    closeMobile: (restoreFocus?: boolean) => Promise<void | HTMLElement>;
    attachMobileMenu: Attachment<HTMLDialogElement>;
    attachMobileCloseButton: Attachment<HTMLButtonElement>;
    active: HeaderPresentation['mobileMenu'];
  } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
      <dialog
        class="dn-mobile-menu"
        id="dn-mobile-menu"
        aria-labelledby="dn-mobile-menu-title"
        tabindex="-1"
        {@attach attachMobileMenu}
        onkeydown={trapDialogTab}
        oncancel={(event) => { event.preventDefault(); void closeMobile(); }}
        onclick={(event) => { if (event.target === event.currentTarget) void closeMobile(); }}
      >
        <h2 class="dn-sr-only" id="dn-mobile-menu-title">{i18n.t("m_123e2803c10b")}</h2>
        <div class="dn-mobile-menu__header">
          <a class="dn-mobile-menu__brand" href={i18n.href(resolve('/'))} aria-label={i18n.t("m_d007ba60d7c9", { p0: brand.name })} onclick={() => void closeMobile(false)}>
            <img src={brand.logo} alt={brand.name} width="160" height="44" />
          </a>
        <button
          class="dn-mobile-menu__close dn-icon-button"
          type="button"
          {@attach attachMobileCloseButton}
          aria-label={i18n.t("m_434b5049f81b")}
          onclick={() => closeMobile()}
        ><MobileNavIcon name="close" size={18} /></button>
        </div>
        <div class="dn-mobile-menu__contact">
          <a class="dn-mobile-menu__call dn-compact-control dn-compact-primary" {...phoneLinkAttributes} aria-label={`${i18n.t("action.callShort")} — ${brand.phone}`} title={brand.phone}><MobileNavIcon name="phone" size={20} /><span>{i18n.t("action.callShort")}</span></a>
          <a class="dn-mobile-menu__location dn-compact-control" href={i18n.href(resolve('/contact#contact-location-title'))} onclick={() => void closeMobile(false)} aria-label={`${i18n.t("action.locationShort")} — ${i18n.dealer('address')}`}><MobileNavIcon name="location" size={20} /><span>{i18n.t("action.locationShort")}</span></a>
        </div>
        <LocaleTrigger fullLabel beforeOpen={() => closeMobile(false)}>
          {#snippet children()}
            <MobileNavIcon name="language" size={22} />
            <span class="dn-mobile-menu__locale-label">{i18n.t('locale.title')}</span>
            <MobileNavIcon name="arrow" size={18} />
          {/snippet}
        </LocaleTrigger>
        <nav aria-label={i18n.t("m_7b624fe4f7ac")}>
          <a href={i18n.href(resolve('/cars'))} aria-current={active.listing ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="cars" size={22} /><span>{i18n.t("m_13b5d43d1176")}</span><MobileNavIcon name="arrow" size={18} /></a>
          <a href={i18n.href(resolve('/blog'))} aria-current={active.blog ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="article" size={22} /><span>{i18n.t("m_5b0e082dcfae")}</span><MobileNavIcon name="arrow" size={18} /></a>
          <a href={i18n.href(resolve('/about-us'))} aria-current={active.about ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="company" size={22} /><span>{i18n.t("m_b4b580a9ad8c")}</span><MobileNavIcon name="arrow" size={18} /></a>
          <a href={i18n.href(resolve('/contact'))} aria-current={active.contact ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="location" size={22} /><span>{i18n.t("m_d58d4100d4e6")}</span><MobileNavIcon name="arrow" size={18} /></a>
        </nav>
        {#if canPreviewHomeBanners}
          <HomeBannerPicker {closeMobile} />
        {/if}
        {#if brand.instagramUrl || brand.youtubeUrl || brand.facebookUrl}
        <div class="dn-mobile-menu__social" role="group" aria-label={i18n.t("m_b16446d4331a")}>
          {#if brand.instagramUrl}<a {...{ href: brand.instagramUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="instagram" /><span>{i18n.t("m_bad57ef7837c")}</span></a>{/if}
          {#if brand.youtubeUrl}<a {...{ href: brand.youtubeUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="youtube" /><span>{i18n.t("m_fb7accfff8c6")}</span></a>{/if}
          {#if brand.facebookUrl}<a {...{ href: brand.facebookUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="facebook" /><span>{i18n.t("m_d41f5b4977ee")}</span></a>{/if}
        </div>
        {/if}
        <p class="dn-mobile-menu__address">{i18n.dealer('addressLine')}</p>
      </dialog>
<style>
  @media (max-width: 767px) {
    .dn-mobile-menu { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); }
  }
  .dn-mobile-menu { position: fixed; inset: auto 0 0; width: 100%; max-width: none; max-height: calc(100dvh - 68px); margin: 0; padding: var(--dn-space-4) var(--dn-space-5) calc(var(--dn-space-5) + env(safe-area-inset-bottom)); overflow-y: auto; border: 0; border-radius: var(--dn-space-6) var(--dn-space-6) 0 0; background: var(--dn-white); color: var(--dn-ink); }
  .dn-mobile-menu[open] { display: flex; flex-direction: column; }
  .dn-mobile-menu::backdrop { background: rgb(10 13 18 / .54); }
  .dn-mobile-menu::before { content: ''; width: 36px; height: var(--dn-space-1); flex-shrink: 0; margin: 0 auto var(--dn-space-3); border-radius: var(--dn-pill); background: var(--dn-line); }
  .dn-mobile-menu__header { position: relative; display: flex; flex-shrink: 0; align-items: center; justify-content: center; min-height: var(--dn-control-hit-height); }
  .dn-mobile-menu__brand { display: inline-flex; align-items: center; min-height: var(--dn-control-hit-height); }
  .dn-mobile-menu__brand img { display: block; width: 160px; height: 44px; object-fit: contain; }
  .dn-mobile-menu__close { position: absolute; right: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); }
  .dn-mobile-menu__contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); margin-top: var(--dn-space-5); }
  .dn-mobile-menu__contact a { min-width: 0; padding: 0 var(--dn-space-2); text-align: center; white-space: normal; }
  .dn-mobile-menu__contact a span { min-width: 0; overflow-wrap: anywhere; }
  .dn-mobile-menu__contact :global(svg) { flex-shrink: 0; }
  .dn-mobile-menu__location { --dn-compact-control-surface: var(--dn-home-panel); }
  .dn-mobile-menu__location:is(:hover, :focus-visible) { --dn-compact-control-surface: var(--dn-surface-hover); }
  .dn-mobile-menu :global(.cars-locale-trigger) { gap: var(--dn-space-3); min-height: var(--dn-entry-height); margin-top: var(--dn-space-5); padding: var(--dn-space-3) var(--dn-space-4); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-home-panel); font: var(--dn-control-font); }
  .dn-mobile-menu__locale-label { flex: 1; }
  nav { display: grid; gap: var(--dn-space-1); margin-top: var(--dn-space-2); }
  nav a { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-entry-height); padding: var(--dn-space-3); border-radius: var(--dn-radius); color: var(--dn-ink); font: var(--dn-control-font); }
  nav a span { flex: 1; }
  nav a[aria-current='page'] { background: var(--dn-mobile-selection-surface); color: var(--dn-ink-deep); }
  a { text-decoration: none; }
  nav a:not([aria-current='page']):hover, .dn-mobile-menu__social a:hover { background: var(--dn-home-panel); }
  :is(a, button):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-mobile-menu__social { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  .dn-mobile-menu__social a { display: grid; justify-items: center; align-content: center; gap: var(--dn-space-1); min-height: var(--dn-control-hit-height); padding: var(--dn-space-2) var(--dn-space-half); border-radius: var(--dn-radius-sm); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-mobile-menu__address { margin: var(--dn-space-4) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); text-align: center; }
</style>
