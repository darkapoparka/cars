<script lang="ts">
  import { lockPageScroll } from '$lib/ui/overlay';
  import { afterNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { onDestroy, tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import Icon from '$components/ui/Icon.svelte';
  import NavigationFeatureCard from './NavigationFeatureCard.svelte';
  import ActionLink from '$components/ui/ActionLink.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import MobileNavIcon from './MobileNavIcon.svelte';
  import { vehicleContactHref, selectedVehicle } from '$data/journeys';
  import { brand } from '$config/brand';
  import { navigation, type InternalNavigationHref, type MegaMenu, type NavigationHref, type NavigationItem } from '$data/navigation';

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
  const compactDetailHeader = $derived(
    page.url.pathname.startsWith('/blog-detail/') || page.url.pathname.startsWith('/listing-detail-v1/')
  );
  const detailVehicle = $derived(page.status === 200 && page.url.pathname.startsWith('/listing-detail-v1/') ? selectedVehicle(page.params.id ?? null) : null);
  const vehicleDetailHeader = $derived(Boolean(detailVehicle));
  const mobileSurfaceHeader = $derived(page.url.pathname === '/');
  const listingHeader = $derived(page.url.pathname === '/listing-grid');
  const homeOverlayHeader = $derived(page.url.pathname === '/');
  const mobileTopic = $derived(page.url.searchParams.get('topic'));
  const mobileMenuSection = $derived(
    page.url.pathname.startsWith('/about-us') ||
    page.url.pathname.startsWith('/blog') ||
    (page.url.pathname.startsWith('/contact') && mobileTopic !== 'trade-in' && mobileTopic !== 'import')
  );

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

  const isActive = (item: NavigationItem) => {
    const path = page.url.pathname;
    if (item.href === '/') return path === '/';
    if (item.href === '/listing-grid') return path.startsWith('/listing');
    if (item.href === '/blog') return path.startsWith('/blog');
    return path === item.href || path.startsWith(`${item.href}/`);
  };

  const isExactDestination = (item: NavigationItem) => {
    const destination = new URL(resolve(item.href), page.url);
    return (
      destination.pathname === page.url.pathname &&
      destination.search === page.url.search &&
      destination.hash === page.url.hash
    );
  };

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
  <button class="dn-mega-backdrop" tabindex="-1" aria-label="Затворете навигацията" onclick={closeMega}></button>
{/if}

<div
  class="dn-header-fixed"
  class:dn-header-fixed--compact={compactDetailHeader}
  class:dn-header-fixed--mobile-surface={mobileSurfaceHeader}
  class:dn-header-fixed--home-overlay={homeOverlayHeader}
  class:dn-header-fixed--contact-overlay={page.url.pathname === '/contact'}
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
          <li><Icon name="map-pin" size={18} strokeWidth={1.75} /><span>{brand.address}</span></li>
          <li><Icon name="phone" size={18} strokeWidth={1.75} /><a {...phoneLinkAttributes}>{brand.phone}</a></li>
          <li><Icon name="clock" size={18} strokeWidth={1.75} /><span>{brand.appointment}</span></li>
        </ul>
      </div>
    </div>

    <div class="dn-header__lower" {@attach attachMegaDismissBoundary}>
      <div class="container">
        <div class="dn-header__inner">
          <div class="dn-logo-box">
            <a class="dn-logo" href={resolve('/')} aria-label={`${brand.name} — начало`}>
              <img src={brand.logo} alt={brand.name} width="220" height="58" fetchpriority="high" />
            </a>
          </div>

          <nav class="dn-nav" aria-label="Основна навигация">
            <ul class="dn-nav__list">
              {#each navigation as item (item.id)}
                <li class:dn-nav__item--current={isActive(item)}>
                  <a
                    class:dn-nav__link--disclosure={Boolean(item.menu)}
                    id={item.menu ? `dn-nav-trigger-${item.id}` : undefined}
                    href={resolve(item.href)}
                    aria-current={isExactDestination(item) ? 'page' : undefined}
                    aria-expanded={item.menu ? megaItemId === item.id : undefined}
                    aria-controls={item.menu ? `dn-mega-${item.id}` : undefined}
                    onmouseenter={(event) => openMega(item, event.currentTarget)}
                    onfocus={() => handleMegaTriggerFocus(item)}
                    onclick={(event) => handleMegaTriggerClick(event, item)}
                    onkeydown={(event) => handleMegaTriggerKeydown(event, item)}
                  >{item.label}</a>

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
                        <nav class="dn-mega__groups" aria-label={mega.title}>
                          {#each mega.groups as group (group.id)}
                            <div class="dn-mega__group">
                              <strong>{group.title}</strong>
                              {#each group.links as link (link.id)}
                                {#if isInternalHref(link.href)}
                                  <a href={resolve(link.href)}>{link.label}</a>
                                {:else}
                                  <a {...{ href: link.href }}>{link.label}</a>
                                {/if}
                              {/each}
                            </div>
                          {/each}
                        </nav>
                        <div class="dn-mega__side-action">
                          <ActionLink href={mega.cta.href}>{mega.cta.label}</ActionLink>
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
              <span>Запитване</span>
            </ActionLink>
            <ActionLink class="dn-header-action dn-header-action--primary" href={detailVehicle ? vehicleContactHref(detailVehicle.id) : '/contact?topic=inspection'}>
              <Icon name="calendar" size={17} strokeWidth={1.8} />
              <span>Запазете оглед</span>
            </ActionLink>
          </div>

          <div class="dn-mobile-controls">
            <a class="dn-mobile-control" href={resolve('/contact')} aria-label="Локация и контакти">
              <MobileNavIcon name="location" size={20} />
            </a>
            <a
              class="dn-mobile-control dn-mobile-control--call"
              {...phoneLinkAttributes}
              aria-label={`Обадете се на ${brand.phone}`}
            >
              <MobileNavIcon name="phone" size={20} />
            </a>
            {#if vehicleDetailHeader}
            <button
              class="dn-mobile-toggle"
              type="button"
              {@attach attachMobileToggle}
              aria-expanded={mobileOpen}
              aria-controls="dn-mobile-menu"
              aria-label={mobileOpen ? 'Затворете менюто' : 'Отворете менюто'}
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
      <MobileMenu {closeMobile} {attachMobileMenu} {attachMobileCloseButton} {listingHeader} />
    {/if}
  </header>

  <div hidden={mobileOpen}>
    {#if vehicleDetailHeader}
      <nav class="dn-mobile-detail-bar" aria-label="Действия за автомобила">
        <a class="dn-mobile-detail-bar__secondary" href={resolve(detailVehicle ? vehicleContactHref(detailVehicle.id) : '/contact?topic=inspection')}>Заявете оглед</a>
        <a class="dn-mobile-detail-bar__primary" {...phoneLinkAttributes}>
          <MobileNavIcon name="phone" size={20} />
          Обадете се
        </a>
      </nav>
    {:else}
      <nav class="dn-mobile-bottom-nav" aria-label="Основни действия">
        <a
          class:active={page.url.pathname === '/'}
          href={resolve('/')}
          aria-current={page.url.pathname === '/' ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="home" /></span>
          <span>Начало</span>
        </a>
        <a
          class:active={page.url.pathname.startsWith('/listing')}
          href={resolve('/listing-grid')}
          aria-current={page.url.pathname.startsWith('/listing') ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="cars" /></span>
          <span>Коли</span>
        </a>
        <a
          class:active={page.url.pathname === '/contact' && mobileTopic === 'trade-in'}
          href={resolve('/contact?topic=trade-in')}
          aria-current={page.url.pathname === '/contact' && mobileTopic === 'trade-in' ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="sell" /></span>
          <span>Продай</span>
        </a>
        <a
          class:active={page.url.pathname === '/contact' && mobileTopic === 'import'}
          href={resolve('/contact?topic=import')}
          aria-current={page.url.pathname === '/contact' && mobileTopic === 'import' ? 'page' : undefined}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="import" /></span>
          <span>Внос</span>
        </a>
        <button
          class:active={mobileMenuSection}
          type="button"
          aria-controls="dn-mobile-menu"
          aria-expanded={mobileOpen}
          onclick={openMobile}
        >
          <span class="dn-mobile-bottom-nav__icon"><MobileNavIcon name="menu" /></span>
          <span>Меню</span>
        </button>
      </nav>
    {/if}
  </div>
</div>

<style>
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
    }

    .dn-mobile-bottom-nav a,
    .dn-mobile-bottom-nav button {
      position: relative;
      display: grid;
      min-width: 0;
      min-height: 52px;
      place-items: center;
      align-content: center;
      grid-template-rows: 26px 16px;
      gap: 2px;
      padding: 4px 1px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #4f5662;
      font: inherit;
      font-size: 12px;
      font-weight: 650;
      line-height: 1.15;
      cursor: pointer;
    }

    .dn-mobile-bottom-nav a.active,
    .dn-mobile-bottom-nav button.active {
      color: var(--dn-red);
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
      min-height: 50px;
      align-items: center;
      justify-content: center;
      gap: 7px;
      border-radius: var(--dn-radius-button);
      font-size: 15px;
      font-weight: 700;
      text-align: center;
    }

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
