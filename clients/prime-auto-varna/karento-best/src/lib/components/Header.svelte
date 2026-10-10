<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import MobileCloseButton from "./mobile/MobileCloseButton.svelte";
  import MobileIconButton from "./mobile/MobileIconButton.svelte";
  const locale = useLocale();
  import { usePreview } from "#lib/preview.svelte.ts";
  import { drawerFocus } from "#lib/attachments.svelte.ts";
  import { page } from "$app/state";
  import { resolveRoute, canonicalRoutes } from "#lib/routes.ts";
  import { afterNavigate, goto } from "$app/navigation";
  import { dealer } from "#lib/content.ts";
  import { MediaQuery } from "svelte/reactivity";
  import type { Attachment } from "svelte/attachments";
  const phone = new MediaQuery("(max-width: 767.98px)");
  // Keep the comparison page's existing header controls.
  const phoneControls = $derived(phone.current && page.route.id !== "/2");
  const heroHeader = $derived(
    phone.current &&
      [
        "index-3",
        "cars-list-1",
        "cars-list-2",
        "cars-list-3",
        "cars-list-4",
        "shop-list",
        "services",
        "contact",
        "about-us",
        "pricing",
        "dealer-listing",
        "dealer-details",
        "term",
        "blog-details",
      ].includes(resolveRoute(page.params.path ?? "") ?? ""),
  );
  const preview = usePreview();
  const activePath = $derived(
    "/" +
      (Object.entries(canonicalRoutes).find(
        ([, source]) => source === resolveRoute(page.params.path ?? ""),
      )?.[0] ?? "__no-active-route"),
  );
  let scrollY = $state(0);
  const heroLogo = $derived(heroHeader && scrollY <= 20);
  const sticky = $derived(scrollY >= 200);
  import { scrollbar } from "#lib/vendor.ts";
  let mobileExpanded0 = $state(false);
  let desktopExploreOpen = $state(false);
  const desktopExploreId = $props.id();
  let desktopExploreNode: HTMLLIElement | undefined;
  const ownDesktopExplore: Attachment<HTMLLIElement> = (node) => {
    desktopExploreNode = node;
    return () => {
      desktopExploreNode = undefined;
    };
  };
  function closeDesktopExplore(restoreFocus = false) {
    desktopExploreOpen = false;
    if (restoreFocus)
      desktopExploreNode
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus({ preventScroll: true });
  }
  function dismissDesktopExplore(event: PointerEvent) {
    if (
      desktopExploreOpen &&
      event.target instanceof Node &&
      !desktopExploreNode?.contains(event.target)
    )
      closeDesktopExplore();
  }
  afterNavigate(() => {
    mobileExpanded0 = false;
    closeDesktopExplore();
  });
</script>

<header
  class={"header sticky-bar header-home-2 border-0" +
    (sticky ? " stick" : "") +
    (heroHeader ? " mobile-hero-header" : "") +
    (phone.current && scrollY > 20 ? " mobile-header-scrolled" : "")}
  data-header-source="index-3"
>
  <div class="container-fluid background-body">
    <div class="main-header">
      <div class="header-left">
        <div class="header-logo">
          <a
            class="d-flex"
            href={locale.href("/")}
            aria-current={activePath === "/" ? "page" : undefined}
            aria-label={`${dealer.name} ${locale.t("navigation.home")}`}
          >
            <img
              class="light-mode"
              alt={dealer.logo.alt}
              src={heroLogo ? dealer.logo.archivedDark : dealer.logo.light}
              width="168"
              height="76"
              style:object-fit="contain"
              style:filter={heroLogo
                ? dealer.logo.monochromeOnDark
                  ? "brightness(0) invert(1)"
                  : "none"
                : undefined}
            />
            <img
              class="dark-mode"
              alt={dealer.logo.alt}
              src={dealer.logo.archivedDark}
              width="168"
              height="76"
              style:object-fit="contain"
              style:filter={dealer.logo.monochromeOnDark
                ? "brightness(0) invert(1)"
                : undefined}
            />
          </a>
        </div>
        <div class="header-nav">
          <nav class="nav-main-menu">
            <ul class="main-menu" data-site-navigation="karento-best"
              ><li class="menu-item"
                ><a
                  href={locale.href("/")}
                  aria-current={activePath === "/" ? "page" : undefined}
                  aria-label={locale.t("ui.header.home")}
                  >{locale.t("ui.header.home")}</a
                ></li
              ><li class="menu-item"
                ><a
                  href={locale.href("/vehicles")}
                  aria-current={activePath === "/vehicles" ? "page" : undefined}
                  aria-label={locale.t("ui.header.vehicles")}
                  >{locale.t("ui.header.vehicles")}</a
                ></li
              >{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/services")}
                    aria-current={activePath === "/services"
                      ? "page"
                      : undefined}
                    aria-label={locale.t("ui.header.services")}
                    >{locale.t("ui.header.services")}</a
                  ></li
                >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/shop")}
                    aria-current={activePath === "/shop" ? "page" : undefined}
                    aria-label={locale.t("ui.header.shop")}
                    >{locale.t("ui.header.shop")}</a
                  ></li
                >{/if}<li
                class="has-children"
                {@attach ownDesktopExplore}
                onfocusout={(event) => {
                  if (
                    !(event.relatedTarget instanceof Node) ||
                    !event.currentTarget.contains(event.relatedTarget)
                  )
                    closeDesktopExplore();
                }}
                ><button
                  class="desktop-explore-toggle desktop-type-nav"
                  type="button"
                  aria-expanded={desktopExploreOpen}
                  aria-controls={desktopExploreId}
                  onclick={() => (desktopExploreOpen = !desktopExploreOpen)}
                  aria-label={locale.t("ui.header.explore")}
                  >{locale.t("ui.header.explore")}</button
                ><ul
                  id={desktopExploreId}
                  class="sub-menu"
                  hidden={!desktopExploreOpen}
                  ><li class="menu-item"
                    ><a
                      href={locale.href("/about")}
                      aria-current={activePath === "/about"
                        ? "page"
                        : undefined}
                      aria-label={locale.t("ui.header.about-us")}
                      >{locale.t("ui.header.about-us")}</a
                    ></li
                  >{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/import")}
                        aria-current={activePath === "/import"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.import")}
                        >{locale.t("ui.header.import")}</a
                      ></li
                    >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/news")}
                        aria-current={activePath === "/news"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.news")}
                        >{locale.t("ui.header.news")}</a
                      ></li
                    >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/calculator")}
                        aria-current={activePath === "/calculator"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.car-calculator")}
                        >{locale.t("ui.header.car-calculator")}</a
                      ></li
                    >{/if}<li class="menu-item"
                    ><a
                      href={locale.href("/faq")}
                      aria-current={activePath === "/faq" ? "page" : undefined}
                      aria-label={locale.t("ui.header.faq")}
                      >{locale.t("ui.header.faq")}</a
                    ></li
                  >{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/terms")}
                        aria-current={activePath === "/terms"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.terms")}
                        >{locale.t("ui.header.terms")}</a
                      ></li
                    >{/if}</ul
                ></li
              >{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/membership")}
                    aria-current={activePath === "/membership"
                      ? "page"
                      : undefined}
                    aria-label={locale.t("ui.header.plans")}
                    >{locale.t("ui.header.plans")}</a
                  ></li
                >{/if}<li class="menu-item"
                ><a
                  href={locale.href("/contact")}
                  aria-current={activePath === "/contact" ? "page" : undefined}
                  aria-label={locale.t("ui.header.contact")}
                  >{locale.t("ui.header.contact")}</a
                ></li
              ></ul
            >
          </nav>
        </div>
        <div class="header-right">
          <div
            class="d-none d-xxl-inline-block align-middle mr-15 karento-header-actions"
            >{#if phoneControls}<MobileIconButton
                label={locale.t("ui.header.account")}
                icon="account"
                href={locale.href(preview.accountHref)}
                surface="circle"
                onMedia={heroLogo}
              />{:else}<a
                class="btn btn-primary karento-header-cta"
                href={locale.href(preview.accountHref)}
                data-demo-account-link=""
                data-demo-fixed-label=""
                aria-label={locale.t("ui.header.account")}
                ><svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                  ><circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                  ></circle><path
                    d="M5 21v-2a7 7 0 0 1 14 0v2"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  ></path></svg
                ><span>{locale.t("ui.header.account")}</span></a
              >{/if}</div
          >
          {#if phoneControls}<MobileIconButton
              label={locale.t("ui.header.open-menu")}
              icon="menu"
              surface="circle"
              onMedia={heroLogo}
              expanded={preview.drawer}
              controls="karento-account-drawer"
              onclick={() => (preview.drawer = !preview.drawer)}
            />{:else}<button
              class={"burger-icon-2 karento-menu-toggle" +
                (preview.drawer ? " burger-2-close" : "")}
              onclick={() => (preview.drawer = !preview.drawer)}
              type="button"
              aria-label={locale.t("ui.header.open-menu")}
              aria-expanded={preview.drawer}
              aria-controls="karento-account-drawer"
            >
              <img
                src="/assets/imgs/template/icons/menu.svg"
                alt=""
                width="18"
                height="18"
              />
            </button>{/if}
          <div
            role="button"
            tabindex="0"
            aria-label={locale.t("ui.header.open-mobile-navigation")}
            onkeydown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                preview.mobile = !preview.mobile;
              }
            }}
            onclick={() => (preview.mobile = !preview.mobile)}
            class={"burger-icon burger-icon-white" +
              (preview.mobile ? " burger-close" : "")}
          >
            <span class="burger-icon-top"></span>
            <span class="burger-icon-mid"> </span>
            <span class="burger-icon-bottom"> </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</header><div
  {@attach drawerFocus(() => preview.mobile)}
  inert={!preview.mobile}
  aria-hidden={!preview.mobile}
  class={"mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2" +
    (preview.mobile ? " sidebar-visible" : "")}
>
  <div class="mobile-header-wrapper-inner" {@attach scrollbar}>
    <div class="mobile-header-logo">
      <a
        class="d-flex"
        href={locale.href("/")}
        aria-current={activePath === "/" ? "page" : undefined}
        aria-label={`${dealer.name} home`}
        ><img
          class="light-mode"
          alt={dealer.logo.alt}
          src={dealer.logo.light}
          width="168"
          height="76"
          style:object-fit="contain"
        /><img
          class="dark-mode"
          alt={dealer.logo.alt}
          src={dealer.logo.archivedDark}
          width="168"
          height="76"
          style:object-fit="contain"
          style:filter={dealer.logo.monochromeOnDark
            ? "brightness(0) invert(1)"
            : undefined}
        /></a
      >
      <div
        class="burger-icon burger-icon-white"
        role="button"
        tabindex="0"
        aria-label={locale.t("ui.header.close-mobile-navigation")}
        onclick={() => (preview.mobile = false)}
        onkeydown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            preview.mobile = false;
          }
        }}
      ></div>
    </div>

    <div class="mobile-header-content-area">
      <div class="perfect-scroll">
        <div class="mobile-menu-wrap mobile-header-border">
          <nav>
            <ul
              class="mobile-menu font-heading"
              data-site-navigation="karento-best"
              ><li class="menu-item"
                ><a
                  href={locale.href("/")}
                  aria-current={activePath === "/" ? "page" : undefined}
                  aria-label={locale.t("ui.header.home")}
                  >{locale.t("ui.header.home")}</a
                ></li
              ><li class="menu-item"
                ><a
                  href={locale.href("/vehicles")}
                  aria-current={activePath === "/vehicles" ? "page" : undefined}
                  aria-label={locale.t("ui.header.vehicles")}
                  >{locale.t("ui.header.vehicles")}</a
                ></li
              >{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/services")}
                    aria-current={activePath === "/services"
                      ? "page"
                      : undefined}
                    aria-label={locale.t("ui.header.services")}
                    >{locale.t("ui.header.services")}</a
                  ></li
                >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/shop")}
                    aria-current={activePath === "/shop" ? "page" : undefined}
                    aria-label={locale.t("ui.header.shop")}
                    >{locale.t("ui.header.shop")}</a
                  ></li
                >{/if}<li class="has-children"
                ><a
                  href="#!"
                  role="button"
                  aria-haspopup="true"
                  aria-label={locale.t("ui.header.explore")}
                  aria-expanded={mobileExpanded0}
                  onclick={(event) => {
                    event.preventDefault();
                    mobileExpanded0 = !mobileExpanded0;
                  }}>{locale.t("ui.header.explore")}</a
                ><ul
                  class="sub-menu"
                  style:display={mobileExpanded0 ? "block" : "none"}
                  ><li class="menu-item"
                    ><a
                      href={locale.href("/about")}
                      aria-current={activePath === "/about"
                        ? "page"
                        : undefined}
                      aria-label={locale.t("ui.header.about-us")}
                      >{locale.t("ui.header.about-us")}</a
                    ></li
                  >{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/import")}
                        aria-current={activePath === "/import"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.import")}
                        >{locale.t("ui.header.import")}</a
                      ></li
                    >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/news")}
                        aria-current={activePath === "/news"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.news")}
                        >{locale.t("ui.header.news")}</a
                      ></li
                    >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/calculator")}
                        aria-current={activePath === "/calculator"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.car-calculator")}
                        >{locale.t("ui.header.car-calculator")}</a
                      ></li
                    >{/if}<li class="menu-item"
                    ><a
                      href={locale.href("/faq")}
                      aria-current={activePath === "/faq" ? "page" : undefined}
                      aria-label={locale.t("ui.header.faq")}
                      >{locale.t("ui.header.faq")}</a
                    ></li
                  >{#if !dealer.businessPreview}<li class="menu-item"
                      ><a
                        href={locale.href("/terms")}
                        aria-current={activePath === "/terms"
                          ? "page"
                          : undefined}
                        aria-label={locale.t("ui.header.terms")}
                        >{locale.t("ui.header.terms")}</a
                      ></li
                    >{/if}</ul
                ></li
              >{#if !dealer.businessPreview}<li class="menu-item"
                  ><a
                    href={locale.href("/membership")}
                    aria-current={activePath === "/membership"
                      ? "page"
                      : undefined}
                    aria-label={locale.t("ui.header.plans")}
                    >{locale.t("ui.header.plans")}</a
                  ></li
                >{/if}<li class="menu-item"
                ><a
                  href={locale.href("/contact")}
                  aria-current={activePath === "/contact" ? "page" : undefined}
                  aria-label={locale.t("ui.header.contact")}
                  >{locale.t("ui.header.contact")}</a
                ></li
              ></ul
            ><div class="karento-mobile-account">
              <a
                href={locale.href(preview.accountHref)}
                data-demo-account-link="true"
                aria-label={locale.t("ui.header.sign-in")}
                >{locale.t("ui.header.sign-in")}</a
              >
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div><div
  {@attach drawerFocus(() => preview.drawer)}
  class={"sidebar-canvas-wrapper perfect-scrollbar button-bg-2 karento-account-drawer" +
    (preview.drawer ? " sidebar-canvas-visible" : "")}
  id="karento-account-drawer"
  role="dialog"
  aria-label={locale.t("ui.header.menu-and-account")}
  aria-modal="true"
  aria-hidden={!preview.drawer}
  inert={!preview.drawer}
  ><div class="sidebar-canvas-container" {@attach scrollbar}>
    <div class="sidebar-canvas-head"
      ><div class="sidebar-canvas-logo">
        <a
          class="d-flex"
          href={locale.href("/")}
          aria-current={activePath === "/" ? "page" : undefined}
          aria-label={`${dealer.name} home`}
        >
          <img
            class="light-mode"
            alt={dealer.logo.alt}
            src={dealer.logo.light}
            width="168"
            height="76"
            style:object-fit="contain"
          />
          <img
            class="dark-mode"
            alt={dealer.logo.alt}
            src={dealer.logo.archivedDark}
            width="168"
            height="76"
            style:object-fit="contain"
            style:filter={dealer.logo.monochromeOnDark
              ? "brightness(0) invert(1)"
              : undefined}
          />
        </a>
      </div>
      {#if phone.current}<MobileCloseButton
          class="close-canvas"
          label={locale.t("ui.header.close-menu")}
          onclick={() => (preview.drawer = false)}
        />{:else}<button
          class="close-canvas"
          onclick={() => (preview.drawer = false)}
          type="button"
          aria-label={locale.t("ui.header.close-menu")}
          ><img
            src="/assets/imgs/template/icons/close.png"
            alt=""
            width="16"
            height="16"
          /></button
        >{/if}
    </div>
    <div class="sidebar-canvas-content">
      <nav
        class="karento-drawer-account"
        aria-label={locale.t("ui.header.account")}
      >
        <p class="karento-account-heading" data-demo-account-heading=""
          >{preview.role === "guest"
            ? locale.t("ui.header.your-account")
            : preview.role === "owner"
              ? locale.t("ui.header.dealership-owner")
              : locale.t("ui.header.member-account")}</p
        >
        <a
          href={locale.href(preview.accountHref)}
          data-demo-account-link=""
          data-demo-drawer-account=""
          aria-label={preview.role === "guest"
            ? locale.t("account.signIn")
            : locale.t("account.view")}
          >{preview.role === "guest"
            ? locale.t("ui.header.sign-in")
            : locale.t("ui.header.view-account")}</a
        >
        <a
          href={locale.href("/register")}
          aria-current={activePath === "/register" ? "page" : undefined}
          data-demo-register-link=""
          hidden={preview.role !== "guest"}
          aria-label={locale.t("ui.header.create-an-account")}
          >{locale.t("ui.header.create-an-account")}</a
        >
        <a
          href={locale.href(
            preview.role === "owner"
              ? "/dashboard/settings"
              : "/account/settings",
          )}
          data-demo-settings-link=""
          hidden={preview.role === "guest"}
          aria-label={locale.t("ui.header.account-settings")}
          >{locale.t("ui.header.account-settings")}</a
        >
        <button
          class="karento-demo-signout"
          type="button"
          hidden={preview.role === "guest"}
          onclick={() => {
            preview.setRole("guest");
            preview.drawer = false;
            void goto(locale.href("/login"));
          }}
          aria-label={locale.t("ui.header.sign-out")}
          >{locale.t("ui.header.sign-out")}</button
        >
      </nav>
      <LanguageSwitcher />
      <nav
        class="karento-drawer-navigation"
        aria-label={locale.t("ui.header.website")}
        data-site-navigation="karento-best"
      >
        <ul
          ><li class="menu-item"
            ><a
              href={locale.href("/")}
              aria-current={activePath === "/" ? "page" : undefined}
              aria-label={locale.t("ui.header.home")}
              >{locale.t("ui.header.home")}</a
            ></li
          ><li class="menu-item"
            ><a
              href={locale.href("/vehicles")}
              aria-current={activePath === "/vehicles" ? "page" : undefined}
              aria-label={locale.t("ui.header.vehicles")}
              >{locale.t("ui.header.vehicles")}</a
            ></li
          >{#if !dealer.businessPreview}<li class="menu-item"
              ><a
                href={locale.href("/services")}
                aria-current={activePath === "/services" ? "page" : undefined}
                aria-label={locale.t("ui.header.services")}
                >{locale.t("ui.header.services")}</a
              ></li
            >{/if}{#if !dealer.businessPreview}<li class="menu-item"
              ><a
                href={locale.href("/shop")}
                aria-current={activePath === "/shop" ? "page" : undefined}
                aria-label={locale.t("ui.header.shop")}
                >{locale.t("ui.header.shop")}</a
              ></li
            >{/if}{#if !dealer.businessPreview}<li class="menu-item"
              ><a
                href={locale.href("/membership")}
                aria-current={activePath === "/membership" ? "page" : undefined}
                aria-label={locale.t("ui.header.plans")}
                >{locale.t("ui.header.plans")}</a
              ></li
            >{/if}<li class="menu-item"
            ><a
              href={locale.href("/contact")}
              aria-current={activePath === "/contact" ? "page" : undefined}
              aria-label={locale.t("ui.header.contact")}
              >{locale.t("ui.header.contact")}</a
            ></li
          ></ul
        >
        <details class="karento-drawer-explore"
          ><summary>{locale.t("ui.header.explore")}</summary><ul
            ><li class="menu-item"
              ><a
                href={locale.href("/about")}
                aria-current={activePath === "/about" ? "page" : undefined}
                aria-label={locale.t("ui.header.about-us")}
                >{locale.t("ui.header.about-us")}</a
              ></li
            >{#if !dealer.businessPreview}<li class="menu-item"
                ><a
                  href={locale.href("/import")}
                  aria-current={activePath === "/import" ? "page" : undefined}
                  aria-label={locale.t("ui.header.import")}
                  >{locale.t("ui.header.import")}</a
                ></li
              >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                ><a
                  href={locale.href("/news")}
                  aria-current={activePath === "/news" ? "page" : undefined}
                  aria-label={locale.t("ui.header.news")}
                  >{locale.t("ui.header.news")}</a
                ></li
              >{/if}{#if !dealer.businessPreview}<li class="menu-item"
                ><a
                  href={locale.href("/calculator")}
                  aria-current={activePath === "/calculator"
                    ? "page"
                    : undefined}
                  aria-label={locale.t("ui.header.car-calculator")}
                  >{locale.t("ui.header.car-calculator")}</a
                ></li
              >{/if}<li class="menu-item"
              ><a
                href={locale.href("/faq")}
                aria-current={activePath === "/faq" ? "page" : undefined}
                aria-label={locale.t("ui.header.faq")}
                >{locale.t("ui.header.faq")}</a
              ></li
            >{#if !dealer.businessPreview}<li class="menu-item"
                ><a
                  href={locale.href("/terms")}
                  aria-current={activePath === "/terms" ? "page" : undefined}
                  aria-label={locale.t("ui.header.terms")}
                  >{locale.t("ui.header.terms")}</a
                ></li
              >{/if}</ul
          ></details
        >
      </nav>
    </div>
  </div></div
>{#if preview.drawer || preview.mobile}<div
    class="body-overlay-1"
    role="button"
    tabindex="0"
    onkeydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        preview.drawer = false;
        preview.mobile = false;
      }
    }}
    aria-label={locale.t("ui.header.close-menu-overlay")}
    onclick={() => {
      preview.drawer = false;
      preview.mobile = false;
    }}
  ></div>{/if}
<svelte:window
  bind:scrollY
  onpointerdown={dismissDesktopExplore}
  onresize={() => {
    if (window.innerWidth < 1200) closeDesktopExplore();
  }}
  onkeydown={(event) => {
    if (event.key === "Escape") {
      if (desktopExploreOpen) {
        event.preventDefault();
        closeDesktopExplore(true);
      }
      preview.drawer = false;
      preview.mobile = false;
    }
  }}
/>

<style>
  @media (max-width: 767.98px) {
    .header .main-header .header-left .header-logo {
      width: 144px;
      max-width: 144px;
      flex-basis: 144px;
    }
    .header .header-logo img {
      width: 144px;
    }
    .header :is(.karento-header-cta, .karento-menu-toggle) {
      display: grid;
      place-items: center;
      line-height: 0 !important;
    }
    .header .karento-header-cta svg,
    .header .karento-menu-toggle img {
      display: block;
    }
  }
  @media (min-width: 992px) {
    .header .container-fluid {
      max-width: 960px;
      margin-inline: auto;
      padding-inline: 12px;
    }
  }
  @media (min-width: 1200px) {
    .header .container-fluid {
      max-width: 1140px;
    }
  }
  @media (min-width: 1400px) {
    .header .container-fluid {
      max-width: 1248px;
    }
  }
</style>
