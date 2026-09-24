<script lang="ts">


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
  import { lockPageScroll } from '$lib/ui/overlay';
  import { afterNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { onDestroy, tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import Icon from '$components/ui/Icon.svelte';
  import NavigationFeatureCard from './NavigationFeatureCard.svelte';
  import ActionLink from '$components/ui/ActionLink.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import MobileNavIcon from './MobileNavIcon.svelte';
  import { vehicleContactHref } from '$data/journeys';
  import { brand } from '$config/brand';
  import { navigation, type InternalNavigationHref, type MegaMenu, type NavigationHref, type NavigationItem } from '$data/navigation';
  import type { HeaderPresentation } from '$data/shell';

  let { presentation, mobileFooterVisible = false }: { presentation: HeaderPresentation; mobileFooterVisible?: boolean } = $props();

  let mega = $state<MegaMenu | null>(null);
  let megaItemId = $state('');
  let mobileOpen = $state(false);
  let mobileMenu = $state<HTMLDialogElement>();
  let mobileToggle = $state<HTMLButtonElement>();
  let mobileCloseButton = $state<HTMLButtonElement>();
  let mobileReturnFocus = $state<HTMLButtonElement>();
  let megaPanel: HTMLDivElement | undefined;
  let megaTrigger: HTMLAnchorElement | undefined;
  let releaseScroll: (() => void) | undefined;
  const compactDetailHeader = $derived(presentation.compactDetailHeader);
  const detailVehicle = $derived(presentation.detailVehicle);
  const vehicleDetailHeader = $derived(presentation.vehicleDetailHeader);
  const mobileSurfaceHeader = $derived(presentation.mobileSurfaceHeader);
  const listingHeader = $derived(presentation.listingHeader);
  const homeOverlayHeader = $derived(presentation.homeOverlayHeader);
  const contactOverlayHeader = $derived(presentation.contactOverlayHeader);

  const isInternalHref = (href: NavigationHref): href is InternalNavigationHref => href.startsWith('/');
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const attachMobileMenu: Attachment<HTMLDialogElement> = (node) => {
    mobileMenu = node;
    return () => {
      if (mobileMenu === node) mobileMenu = undefined;
    };
  };

  const attachMobileToggle: Attachment<HTMLButtonElement> = (node) => {
    mobileToggle = node;
    return () => {
      if (mobileToggle === node) mobileToggle = undefined;
    };
  };

  const attachMobileCloseButton: Attachment<HTMLButtonElement> = (node) => {
    mobileCloseButton = node;
    return () => {
      if (mobileCloseButton === node) mobileCloseButton = undefined;
    };
  };

  const attachMegaPanel: Attachment<HTMLDivElement> = (node) => {
    megaPanel = node;
    return () => {
      if (megaPanel === node) megaPanel = undefined;
    };
  };

  const attachMegaDismissBoundary: Attachment<HTMLDivElement> = (node) => {
    const queueDismiss = () => {
      queueMicrotask(() => {
        if (node.isConnected && !node.contains(document.activeElement)) closeMega();
      });
    };
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') closeMega();
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !node.contains(event.relatedTarget)) queueDismiss();
    };

    node.addEventListener('pointerleave', handlePointerLeave);
    node.addEventListener('focusout', handleFocusOut);
    return () => {
      node.removeEventListener('pointerleave', handlePointerLeave);
      node.removeEventListener('focusout', handleFocusOut);
    };
  };

  const isActive = (item: NavigationItem) => presentation.navigation[item.id]?.active ?? false;
  const isExactDestination = (item: NavigationItem) => presentation.navigation[item.id]?.current ?? false;

  const openMega = (item: NavigationItem, trigger?: HTMLAnchorElement) => {
    mega = item.menu ?? null;
    megaItemId = item.menu ? item.id : '';
    megaTrigger = item.menu ? trigger : undefined;
  };

  const closeMega = () => {
    mega = null;
    megaItemId = '';
    megaTrigger = undefined;
  };

  const handleMegaTriggerFocus = (item: NavigationItem) => {
    if (megaItemId && megaItemId !== item.id) closeMega();
  };

  const handleMegaTriggerClick = (event: MouseEvent, item: NavigationItem) => {
    if (!item.menu) {
      closeMega();
      return;
    }

    if (megaItemId !== item.id) {
      event.preventDefault();
      openMega(item, event.currentTarget as HTMLAnchorElement);
    }
  };

  const handleMegaTriggerKeydown = async (event: KeyboardEvent, item: NavigationItem) => {
    if (!item.menu) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMega(item, event.currentTarget as HTMLAnchorElement);
      await tick();
      megaPanel?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      if (megaItemId === item.id) closeMega();
      else openMega(item, event.currentTarget as HTMLAnchorElement);
    }
  };

  const openMobile = async (event?: MouseEvent) => {
    if (mobileOpen) return;
    releaseScroll = lockPageScroll();
    mobileReturnFocus = event?.currentTarget instanceof HTMLButtonElement ? event.currentTarget : mobileToggle;
    mobileOpen = true;
    await tick();
    mobileMenu?.showModal();
    mobileCloseButton?.focus();
  };

  const closeMobile = async (restoreFocus = true) => {
    if (!mobileOpen) return;
    mobileMenu?.close();
    mobileOpen = false;
    releaseScroll?.();
    if (restoreFocus) {
      await tick();
      mobileReturnFocus?.focus();
    }
  };

  const handleWindowKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (mobileOpen) {
      event.preventDefault();
      void closeMobile();
      return;
    }
    if (mega) {
      event.preventDefault();
      const returnFocus = megaPanel?.contains(document.activeElement) ? megaTrigger : undefined;
      closeMega();
      returnFocus?.focus();
    }
  };


  onDestroy(() => {
    releaseScroll?.();
  });

  afterNavigate(() => {
    closeMega();
    if (mobileOpen) void closeMobile(false);
  });
</script>

<svelte:window onkeydown={handleWindowKeydown} onresize={() => { if (window.innerWidth >= 992 && mobileOpen) void closeMobile(false); if (window.innerWidth < 992) closeMega(); }} />

{#if mega}
  <button class="dn-mega-backdrop" tabindex="-1" aria-label={i18n.t("m_985463e3d2e1")} onclick={closeMega}></button>
{/if}

<div
  class="dn-header-fixed"
  class:dn-header-fixed--compact={compactDetailHeader}
  class:dn-header-fixed--vehicle-detail={vehicleDetailHeader}
  class:dn-header-fixed--mobile-surface={mobileSurfaceHeader}
  class:dn-header-fixed--home-overlay={homeOverlayHeader}
  class:dn-header-fixed--contact-overlay={contactOverlayHeader}
  class:dn-header-fixed--listing={listingHeader}
>
  <header
    class:dn-header--mega-open={Boolean(mega)}
    class:dn-header--compact={compactDetailHeader}
    class:dn-header--mobile-surface={mobileSurfaceHeader}
    class="dn-header"
  >
    <div class="dn-topbar">
      <div class="container dn-topbar__inner">
        <ul class="dn-topbar__list">
          <li><Icon name="map-pin" size={18} strokeWidth={1.75} /><span>{i18n.dealer('address')}</span></li>
          <li><Icon name="phone" size={18} strokeWidth={1.75} /><a {...phoneLinkAttributes}>{brand.phone}</a></li>
          <li class="dn-topbar__item--appointment"><Icon name="clock" size={18} strokeWidth={1.75} /><span>{i18n.dealer('appointment')}</span></li>
          <li class="dn-topbar__settings"><LocaleTrigger /></li>
        </ul>
      </div>
    </div>

    <div class="dn-header__lower" {@attach attachMegaDismissBoundary}>
      <div class="container">
        <div class="dn-header__inner">
          <div class="dn-logo-box">
            <a class="dn-logo" href={i18n.href(resolve('/'))} aria-label={i18n.t("m_d007ba60d7c9", { p0: brand.name })}>
              <picture>
                {#if mobileSurfaceHeader || contactOverlayHeader}
                  <source media="(max-width: 991px)" srcset={brand.logoOnDark} />
                {/if}
                <img src={brand.logo} alt={brand.name} width="220" height="58" fetchpriority="high" />
              </picture>
            </a>
          </div>

          <nav class="dn-nav" aria-label={i18n.t("m_123e2803c10b")}>
            <ul class="dn-nav__list">
              {#each navigation as item (item.id)}
                <li class:dn-nav__item--current={isActive(item)}>
                  <a
                    class:dn-nav__link--disclosure={Boolean(item.menu)}
                    id={item.menu ? `dn-nav-trigger-${item.id}` : undefined}
                    href={i18n.href(resolve(item.href))}
                    aria-current={isExactDestination(item) ? 'page' : undefined}
                    aria-expanded={item.menu ? megaItemId === item.id : undefined}
                    aria-controls={item.menu ? `dn-mega-${item.id}` : undefined}
                    onmouseenter={(event) => openMega(item, event.currentTarget)}
                    onfocus={() => handleMegaTriggerFocus(item)}
                    onclick={(event) => handleMegaTriggerClick(event, item)}
                    onkeydown={(event) => handleMegaTriggerKeydown(event, item)}
                  >{i18n.text(item.label)}</a>

                  {#if item.menu && megaItemId === item.id && mega}
                    <div
                      class="dn-mega"
                      id={`dn-mega-${item.id}`}
                      role="region"
                      aria-labelledby={`dn-nav-trigger-${item.id}`}
                      {@attach attachMegaPanel}
                    >
                      <div class="dn-mega__feature-panel">
                        <div class="dn-mega__features">
                          {#each mega.features as feature (feature.id)}
                            <NavigationFeatureCard {feature} />
                          {/each}
                        </div>
                      </div>
                      <div class="dn-mega__side">
                        <nav class="dn-mega__groups" aria-label={mega.title === brand.name ? brand.name : i18n.text(mega.title)}>
                          {#each mega.groups as group (group.id)}
                            <div class="dn-mega__group">
                              <strong>{i18n.text(group.title)}</strong>
                              {#each group.links as link (link.id)}
                                {#if isInternalHref(link.href)}
                                  <a href={i18n.href(resolve(link.href))}>{link.id === 'about-company-overview' ? i18n.t("m_76e1b210c1a4", { p0: brand.shortName }) : i18n.text(link.label)}</a>
                                {:else}
                                  <a {...{ href: link.href }}>{link.href.startsWith('tel:') ? link.label : i18n.text(link.label)}</a>
                                {/if}
                              {/each}
                            </div>
                          {/each}
                        </nav>
                        <div class="dn-mega__side-action">
                          <ActionLink class="dn-mega__cta" href={mega.cta.href}>{i18n.text(mega.cta.label)}</ActionLink>
                        </div>
                      </div>
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </nav>

          <div class="dn-header-actions">
            <ActionLink class="dn-header-action dn-header-action--secondary" href="/contact">
              <Icon name="mail" size={17} strokeWidth={1.8} />
              <span>{i18n.t("m_0e3416f5f251")}</span>
            </ActionLink>
            <ActionLink class="dn-header-action dn-header-action--primary" href={detailVehicle ? vehicleContactHref(detailVehicle.id) : '/contact?topic=inspection'}>
              <Icon name="calendar" size={17} strokeWidth={1.8} />
              <span>{i18n.t('action.viewingShort')}</span>
            </ActionLink>
          </div>

          <div class="dn-mobile-controls">
            <a class="dn-mobile-control" href={i18n.href(resolve('/contact'))} aria-label={i18n.t("m_8dc51841d515")}>
              <MobileNavIcon name="location" size={20} />
            </a>
            <a
              class="dn-mobile-control dn-mobile-control--call"
              {...phoneLinkAttributes}
              aria-label={i18n.t("m_772c70f449af", { p0: brand.phone })}
            >
              <MobileNavIcon name="phone" size={20} />
            </a>
            {#if vehicleDetailHeader}
            <button
              class="dn-mobile-toggle"
              type="button"
              {@attach attachMobileToggle}
              aria-expanded={mobileOpen}
              {@attach i18n.registerFocusTarget} aria-controls="dn-mobile-menu"
              aria-label={mobileOpen ? i18n.t("m_434b5049f81b") : i18n.t("m_adeff71e51a4")}
              onclick={openMobile}
            >
              <MobileNavIcon name="menu" size={20} />
            </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    {#if mobileOpen}
      <MobileMenu {closeMobile} {attachMobileMenu} {attachMobileCloseButton} active={presentation.mobileMenu} />
    {/if}
  </header>

  <div hidden={mobileOpen}>
    {#if vehicleDetailHeader}
      <nav class="dn-mobile-detail-bar" aria-label={i18n.t("m_4c09f960cece")}>
        <a class="dn-mobile-detail-bar__secondary" href={i18n.href(resolve(detailVehicle ? vehicleContactHref(detailVehicle.id) : '/contact?topic=inspection'))} title={i18n.t("m_be4b2e6f02d6")}>{i18n.t("action.viewingShort")}</a>
        <a class="dn-mobile-detail-bar__primary" {...phoneLinkAttributes} aria-label={`${i18n.t("action.callShort")} — ${brand.phone}`}>
          <MobileNavIcon name="phone" size={20} />
          {i18n.t("action.callShort")}
        </a>
      </nav>
    {:else}
      <nav class="dn-mobile-bottom-nav" class:dn-mobile-bottom-nav--footer-visible={mobileFooterVisible} aria-label={i18n.t("m_a690e455afe4")}>
        <a
          class:active={presentation.mobileNavigation.home}
          href={i18n.href(resolve('/'))}
          aria-current={presentation.mobileNavigation.home ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="home" /></span>
          <span>{i18n.t("m_3a78695388b3")}</span>
        </a>
        <a
          class:active={presentation.mobileNavigation.listing}
          href={i18n.href(resolve('/listing-grid'))}
          aria-current={presentation.mobileNavigation.listing ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="cars" /></span>
          <span>{i18n.t("nav.carsCompact")}</span>
        </a>
        <a
          class:active={presentation.mobileNavigation.tradeIn}
          href={i18n.href(resolve('/contact?topic=trade-in'))}
          aria-current={presentation.mobileNavigation.tradeIn ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="sell" /></span>
          <span>{i18n.t("nav.sellCompact")}</span>
        </a>
        <a
          class:active={presentation.mobileNavigation.import}
          href={i18n.href(resolve('/contact?topic=import'))}
          aria-current={presentation.mobileNavigation.import ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="import" /></span>
          <span>{i18n.t("m_2cff9baabf56")}</span>
        </a>
        <button
          class:active={presentation.mobileNavigation.menu}
          type="button"
          {@attach i18n.registerFocusTarget} aria-controls="dn-mobile-menu"
          aria-expanded={mobileOpen}
          onclick={openMobile}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="menu" /></span>
          <span>{i18n.t("m_99af6606ff9d")}</span>
        </button>
      </nav>
    {/if}
  </div>
</div>

<style>
  .dn-header-fixed { position: relative; z-index: 1000; background: #fff; }
  .dn-header { position: relative; background: #fff; }
  .dn-topbar { min-height: 54px; display: flex; align-items: center; background: #fff; color: #30343a; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-topbar__inner { display: flex; align-items: center; }
  .dn-topbar__list { width: 100%; display: flex; align-items: center; justify-content: flex-start; gap: 28px; margin: 0; padding: 0; list-style: none; }
  .dn-topbar__item--appointment { margin-left: auto; }
  .dn-topbar__list li { display: inline-flex; align-items: center; gap: 8px; }
  .dn-topbar__list li :global(.dn-icon) { color: #666c74; }
  .dn-topbar__list a { display: inline-flex; min-height: 44px; align-items: center; color: #30343a; font-weight: var(--dn-control-weight); }
  .dn-topbar__list a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-header__lower { background: #fff; border-top: 1px solid rgba(20,23,29,.06); border-bottom: 1px solid rgba(20,23,29,.06); }
  .dn-header__inner { min-height: 94px; display: grid; grid-template-columns: minmax(160px, 1fr) auto minmax(160px, 1fr); align-items: center; gap: 20px; }
  .dn-logo { display: inline-flex; min-height: 44px; align-items: center; }
  .dn-logo picture { display: flex; align-items: center; }
  .dn-logo img { width: auto; max-width: 230px; height: 64px; object-fit: contain; }
  .dn-nav { display: flex; justify-content: center; }
  .dn-nav__list { display: flex; align-items: center; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .dn-nav__list > li > a { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 11px 16px; border-radius: var(--dn-radius-control); color: #24272c; font-size: var(--dn-text-lead); font-weight: var(--dn-control-weight); letter-spacing: var(--dn-tracking-heading); line-height: var(--dn-leading-body); transition: background-color 160ms ease, color 160ms ease; }
  .dn-nav__list > li.dn-nav__item--current > a, .dn-nav__list > li > a:hover { background: #f2f3f5; }
  .dn-header-actions { display: flex; align-items: center; gap: 10px; }
  .dn-header-actions :global(.dn-header-action) { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 0 16px; border-radius: var(--dn-radius-button); }
  .dn-header-actions :global(.dn-header-action svg) { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .dn-header-actions :global(.dn-header-action--secondary) { background: #202329; color: #fff; }
  .dn-header-actions :global(.dn-header-action--primary) { background: var(--dn-red); color: #fff; }
  .dn-header-actions :global(.dn-header-action--primary:hover) { background: var(--dn-red-hover); color: #fff; }
  .dn-mobile-toggle { display: none; width: 44px; height: 44px; border: 0; border-radius: var(--dn-radius-button); background: #f2f3f5; }
  .dn-mobile-toggle > :global(svg) { display: block; margin: auto; }

  .dn-mega-backdrop { position: fixed; inset: 0; z-index: 999; border: 0; padding: 0; background: var(--dn-menu-backdrop); cursor: default; }
  .dn-header .dn-mega { position: absolute; top: 100%; left: 0; right: 0; z-index: 30; display: grid; min-height: var(--dn-menu-panel-height); grid-template-columns: minmax(0,2.25fr) minmax(300px,.95fr); gap: 32px; padding: 16px max(32px, calc((100% - var(--dn-menu-content)) / 2)) 24px; border-radius: 0 0 16px 16px; background: var(--dn-white); }
  .dn-mega__feature-panel { min-width: 0; }
  .dn-mega__features { display: grid; height: 100%; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; }
  .dn-mega__side { min-width: 0; display: flex; flex-direction: column; }
  .dn-nav__list > li > a:focus-visible,
  .dn-header :global(.dn-mega a:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 3px; }
  .dn-nav__list > li > a[aria-expanded='true'] { background: var(--dn-surface); }
  .dn-mega__groups { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px 24px; }
  .dn-mega__group strong { display: block; margin-bottom: 8px; font-size: var(--dn-text-lead); font-weight: var(--dn-menu-heading-weight); }
  .dn-mega__group a { display: block; padding: 4px 0; color: var(--dn-muted); font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-mega__group a:hover { color: var(--dn-red); }
  .dn-mega__side-action { margin-top: auto; padding-top: 12px; }
  .dn-mega__side-action > :global(.dn-mega__cta) { width: 100%; min-height: 42px; display: inline-flex; align-items: center; justify-content: center; padding: 11px 16px; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; }

  @media (min-width: 992px) {
    .dn-header-actions { justify-self: end; white-space: nowrap; }
    .dn-topbar__list { gap: var(--dn-space-4); font-size: var(--dn-text-meta); }
    .dn-topbar__settings { flex-shrink: 0; }
    .dn-topbar__settings :global(.cars-locale-trigger) { border-color: transparent; border-radius: var(--dn-radius-control); font-size: var(--dn-text-meta); }
    .dn-topbar__settings :global(.cars-locale-trigger:hover) { background: var(--dn-surface); opacity: 1; }
    .dn-header:not(.dn-header--compact) .dn-header__inner { min-height: 84px; }
    .dn-topbar, .dn-topbar__inner { min-height: 44px; }
    .dn-header:not(.dn-header--compact) .dn-logo img { height: 56px; }
  }

  @media (min-width: 992px) and (max-width: 1359px) {
    .dn-header__inner { gap: 12px; }
    .dn-logo img { max-width: 190px; }
    .dn-nav__list { gap: 2px; }
    .dn-nav__list > li > a { padding-inline: 8px; font-size: var(--dn-text-body); white-space: nowrap; }
    .dn-header-actions :global(.dn-header-action) { padding-inline: 14px; white-space: nowrap; }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-mega__features { gap: 12px; }
  }

  @media (max-width: 1199px) {
    .dn-header__inner { gap: var(--dn-space-2); }
    .dn-logo img { max-width: 160px; }
    .dn-nav { min-width: 0; }
    .dn-nav__list > li > a { padding-inline: var(--dn-space-2); font-size: var(--dn-text-body); }
    .dn-header-actions :global(.dn-header-action--secondary) { display: none; }
    .dn-header .dn-mega { padding-inline: 32px; }
  }

  @media (max-width: 991px) {
    .dn-topbar, .dn-nav, .dn-header-actions { display: none; }
    .dn-header__lower { background: #fff; border-top: 1px solid rgba(20,23,29,.06); border-bottom: 1px solid rgba(20,23,29,.06); }
    .dn-header__inner { min-height: 68px; display: flex; justify-content: space-between; gap: 12px; }
    .dn-logo img { height: 42px; max-width: 148px; }
    .dn-mobile-toggle { display: block; }
    .dn-mega-backdrop, .dn-header .dn-mega { display: none; }
  }

  @media (min-width: 992px) {
    .dn-nav__link--disclosure::after {
      width: 7px;
      height: 7px;
      margin-left: 9px;
      border-right: 1.5px solid currentColor;
      border-bottom: 1.5px solid currentColor;
      content: '';
      opacity: 0.52;
      transform: translateY(-2px) rotate(45deg);
    }

    .dn-topbar__inner,
    .dn-header__lower > .container {
      width: calc(100% - 32px);
    }

    .dn-header-fixed {
      position: relative;
      z-index: 1000;
      height: 0;
      background: transparent;
    }

    .dn-header {
      position: absolute;
      top: 10px;
      right: 10px;
      left: 10px;
      width: auto;
      margin: 0;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.078);
    }

    .dn-topbar {
      border-radius: 16px 16px 0 0;
    }

    .dn-header__lower {
      border-bottom: 0;
      border-radius: 0 0 16px 16px;
    }

    .dn-header.dn-header--mega-open {
      border-radius: 16px 16px 0 0;
      box-shadow: none;
    }

    .dn-header.dn-header--mega-open .dn-header__lower {
      border-radius: 0;
    }

    .dn-mega {
      border-radius: 0 0 16px 16px;
    }

    .dn-header-fixed--compact {
      height: 94px;
      background: #fff;
    }

    .dn-header-fixed--compact .dn-header {
      position: relative;
      inset: auto;
      width: 100%;
      border-radius: 0;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    }

    .dn-header--compact .dn-topbar {
      display: none;
    }

    .dn-header--compact .dn-header__lower {
      border-top: 0;
      border-bottom: 0;
      border-radius: 0;
    }
  }

  @media (max-width: 991px) {
    .dn-header-fixed--contact-overlay {
      position: absolute;
      inset: 0 0 auto;
      background: transparent;
    }
    .dn-header-fixed--contact-overlay .dn-header,
    .dn-header-fixed--contact-overlay .dn-header__lower { background: transparent; border: 0; }
    .dn-header-fixed--contact-overlay .dn-mobile-control,
    .dn-header-fixed--contact-overlay .dn-mobile-toggle { background: rgba(15,17,20,.7); color: #fff; border: 1px solid rgba(255,255,255,.3); }
    .dn-header-fixed--contact-overlay .dn-mobile-control--call { border-color: var(--dn-ink); background: var(--dn-ink); }

    .dn-header-fixed--compact .dn-header__inner {
      min-height: 68px;
    }

    .dn-mobile-controls {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .dn-mobile-control {
      display: inline-grid;
      width: 44px;
      height: 44px;
      place-items: center;
      border-radius: 50%;
      background: #f0f2f4;
      color: #202329;
    }

    .dn-mobile-control--call {
      background: var(--dn-ink);
      color: #fff;
    }

    .dn-mobile-bottom-nav,
    .dn-mobile-detail-bar {
      position: fixed;
      z-index: 1900;
      right: 0;
      bottom: 0;
      left: 0;
      padding-bottom: env(safe-area-inset-bottom);
      border-top: 1px solid #e0e3e7;
      background: #fff;
    }

    .dn-mobile-bottom-nav {
      display: grid;
      height: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom));
      grid-template-columns: repeat(5, minmax(0, 1fr));
      padding-inline: max(8px, env(safe-area-inset-left)) max(8px, env(safe-area-inset-right));
      padding-top: 3px;
      transition: transform 180ms ease, opacity 150ms ease;
    }

    .dn-mobile-bottom-nav--footer-visible {
      opacity: 0;
      pointer-events: none;
      transform: translateY(100%);
    }

    .dn-mobile-bottom-nav a,
    .dn-mobile-bottom-nav button {
      position: relative;
      display: grid;
      min-width: 0;
      min-height: 52px;
      place-items: center;
      align-content: center;
      grid-template-rows: 26px auto;
      gap: 2px;
      padding: 4px 1px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #4f5662;
      font: inherit;
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-control);
      cursor: pointer;
    }

    .dn-mobile-bottom-nav a.active,
    .dn-mobile-bottom-nav button.active {
      color: var(--dn-ink);
      font-weight: var(--dn-weight-semibold);
    }

    .dn-mobile-bottom-nav :is(a.active, button.active) :global(.dn-icon *) {
      stroke-width: 2;
    }

    .dn-mobile-bottom-nav__icon {
      display: grid;
      width: 48px;
      height: 26px;
      place-items: center;
      border-radius: var(--dn-radius-button);
    }

    .dn-mobile-bottom-nav :global(.dn-icon) {
      width: 22px;
      height: 22px;
    }

    .dn-mobile-bottom-nav a:active,
    .dn-mobile-bottom-nav button:active {
      background: #f2f3f5;
    }

    .dn-mobile-bottom-nav a:focus-visible,
    .dn-mobile-bottom-nav button:focus-visible {
      outline: 2px solid #202329;
      outline-offset: -2px;
    }

    .dn-mobile-detail-bar {
      display: grid;
      height: calc(var(--dn-mobile-detail-bar-height) + env(safe-area-inset-bottom));
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
      gap: 8px;
      padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
    }

    .dn-mobile-detail-bar a {
      display: inline-flex;
      min-width: 0;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border-radius: var(--dn-radius-button);
      font-size: var(--dn-text-body);
      font-weight: var(--dn-control-weight);
      text-align: center;
    }

    .dn-mobile-detail-bar :global(svg) { flex-shrink: 0; }

    .dn-mobile-detail-bar__secondary {
      background: var(--dn-red);
      color: #fff;
    }

    .dn-mobile-detail-bar__primary {
      background: var(--dn-ink);
      color: #fff;
    }
  }

  @media (max-width: 767px) {
    .dn-header-fixed:is(.dn-header-fixed--home-overlay, .dn-header-fixed--contact-overlay) .dn-header__lower { border: 0; }
    .dn-header-fixed:is(.dn-header-fixed--home-overlay, .dn-header-fixed--contact-overlay) .dn-header__inner { min-height: 66px; }
    .dn-header-fixed--listing,
    .dn-header-fixed--listing .dn-header {
      height: 0;
      min-height: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    .dn-header-fixed--listing .dn-topbar,
    .dn-header-fixed--listing .dn-header__lower {
      display: none;
    }

    .dn-header-fixed--vehicle-detail {
      height: 0;
      min-height: 0;
      background: transparent;
    }

    .dn-header-fixed--vehicle-detail .dn-header {
      display: none;
    }

    .dn-header-fixed--mobile-surface,
    .dn-header--mobile-surface,
    .dn-header--mobile-surface .dn-header__lower {
      background: #090a0b;
    }

    .dn-header--mobile-surface .dn-header__lower {
      border-color: transparent;
    }

    .dn-header--mobile-surface .dn-header__inner {
      min-height: 64px;
    }

    .dn-header--mobile-surface .dn-logo img {
      width: 142px;
      max-width: 142px;
      height: 40px;
    }

    .dn-header--mobile-surface .dn-mobile-control,
    .dn-header--mobile-surface .dn-mobile-toggle {
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    .dn-header--mobile-surface .dn-mobile-control--call {
      border-color: var(--dn-ink);
      background: var(--dn-ink);
    }


    .dn-header-fixed--home-overlay {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      background: linear-gradient(180deg, rgba(5, 7, 10, 0.76) 0%, rgba(5, 7, 10, 0.38) 72%, transparent 100%);
    }

    .dn-header-fixed--home-overlay .dn-header--mobile-surface,
    .dn-header-fixed--home-overlay .dn-header--mobile-surface .dn-header__lower {
      background: transparent;
    }

    .dn-header-fixed--home-overlay .dn-mobile-control,
    .dn-header-fixed--home-overlay .dn-mobile-toggle {
      border-color: rgba(255, 255, 255, 0.28);
      background: rgba(8, 10, 13, 0.48);
      color: #fff;
    }

    .dn-header-fixed--home-overlay .dn-mobile-control--call {
      border-color: var(--dn-ink);
      background: var(--dn-ink);
    }
  }

  @media (max-width: 991px) {
    .dn-header-fixed .dn-header .dn-mobile-controls :is(.dn-mobile-control, .dn-mobile-toggle) {
      border: 1px solid #e0e3e7;
      background: #f1f2f4;
      color: #202329;
    }
    .dn-header-fixed:is(.dn-header-fixed--home-overlay, .dn-header-fixed--contact-overlay) .dn-header .dn-mobile-controls :is(.dn-mobile-control, .dn-mobile-toggle) {
      border-color: rgba(255, 255, 255, .35);
      background: transparent;
      color: #fff;
    }
    .dn-header-fixed .dn-header .dn-mobile-controls :is(a, button):focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 3px;
    }
    .dn-header .dn-logo img { width: 142px; max-width: 142px; height: 40px; }
    .dn-header-fixed--home-overlay { background: transparent; }
  }
  @media (max-width: 359px) {
    .dn-header .dn-logo img { width: 132px; max-width: 132px; height: 40px; }
    .dn-mobile-controls { gap: 6px; }
  }

  @media (min-width: 992px) {
    .dn-mobile-controls,
    .dn-mobile-bottom-nav,
    .dn-mobile-detail-bar {
      display: none;
    }
  }
</style>
