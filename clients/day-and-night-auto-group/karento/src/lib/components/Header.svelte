<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import MobileCloseButton from "./mobile/MobileCloseButton.svelte";
  const locale = useLocale();
  import { usePreview } from "#lib/preview.svelte.ts";
  import { drawerFocus } from "#lib/attachments.svelte.ts";
  import { page } from "$app/state";
  import { resolveRoute, canonicalRoutes } from "#lib/routes.ts";
  import { afterNavigate, goto } from "$app/navigation";
  import { dealer } from "#lib/content.ts";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const wide = new MediaQuery("(min-width:1200px)");
  const preview = usePreview();
  const activePath = $derived(
    "/" +
      (Object.entries(canonicalRoutes).find(
        ([, source]) => source === resolveRoute(page.params.path ?? ""),
      )?.[0] ?? "__no-active-route"),
  );
  const buyActive = $derived(
    activePath === "/vehicles" ||
      activePath === "/vehicle" ||
      (activePath === "/contact" && page.url.searchParams.has("vehicleId")),
  );
  let scrollY = $state(0);
  const sticky = $derived(scrollY >= 200);
  import { scrollbar } from "#lib/vendor.ts";
  afterNavigate(() => {
    preview.drawer = false;
    preview.mobile = false;
  });
</script>

<header
  class={"header sticky-bar header-home-2 border-0" +
    (sticky ? " stick" : "") +
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
        <div class="header-nav">
          <nav class="nav-main-menu">
            <ul class="main-menu" data-site-navigation="karento-best">
              <li class="menu-item">
                <a
                  href={locale.href("/vehicles")}
                  aria-current={buyActive ? "page" : undefined}
                  aria-label={locale.t("navigation.buy")}
                  >{locale.t("navigation.buy")}</a
                >
              </li>
              <li class="menu-item">
                <a
                  href={locale.href("/rent")}
                  aria-current={activePath === "/rent" ? "page" : undefined}
                  aria-label={locale.t("navigation.rent")}
                  >{locale.t("navigation.rent")}</a
                >
              </li>
              <li class="menu-item">
                <a
                  href={locale.href("/services")}
                  aria-current={activePath === "/services" ? "page" : undefined}
                  aria-label={locale.t("ui.header.services")}
                  >{locale.t("ui.header.services")}</a
                >
              </li>
              <li class="menu-item">
                <a
                  href={locale.href("/shop")}
                  aria-current={activePath === "/shop" ? "page" : undefined}
                  aria-label={locale.t("ui.header.shop")}
                  >{locale.t("ui.header.shop")}</a
                >
              </li>
              <li class="menu-item">
                <button
                  class="desktop-menu-trigger"
                  type="button"
                  aria-label={locale.t("navigation.menu")}
                  aria-expanded={preview.drawer}
                  aria-controls="karento-account-drawer"
                  onclick={() => {
                    preview.mobile = false;
                    preview.drawer = !preview.drawer;
                  }}>{locale.t("navigation.menu")}</button
                >
              </li>
            </ul>
          </nav>
        </div>
        <div class="header-right">
          <div
            class="d-none d-xxl-inline-block align-middle mr-15 karento-header-actions"
          >
            <a
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
            >
          </div>
          {#if !wide.current}<button
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
        </div>
      </div>
    </div>
  </div>
</header>
<div
  {@attach drawerFocus(() => preview.drawer)}
  class={"sidebar-canvas-wrapper perfect-scrollbar button-bg-2 karento-account-drawer" +
    (preview.drawer ? " sidebar-canvas-visible" : "")}
  id="karento-account-drawer"
  role="dialog"
  aria-label={locale.t("ui.header.menu-and-account")}
  aria-modal="true"
  aria-hidden={!preview.drawer}
  inert={!preview.drawer}
>
  <div class="sidebar-canvas-container" {@attach scrollbar}>
    <div class="sidebar-canvas-head">
      <div class="sidebar-canvas-logo">
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
        <p class="karento-account-heading" data-demo-account-heading="">
          {preview.role === "guest"
            ? locale.t("ui.header.your-account")
            : preview.role === "owner"
              ? locale.t("ui.header.dealership-owner")
              : locale.t("ui.header.member-account")}
        </p>
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
        <ul>
          <li class="menu-item">
            <a
              href={locale.href("/")}
              aria-current={activePath === "/" ? "page" : undefined}
              aria-label={locale.t("ui.header.home")}
              >{locale.t("ui.header.home")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/vehicles")}
              aria-current={buyActive ? "page" : undefined}
              aria-label={locale.t("navigation.buy")}
              >{locale.t("navigation.buy")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/rent")}
              aria-current={activePath === "/rent" ? "page" : undefined}
              >{locale.t("navigation.rent")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/services")}
              aria-current={activePath === "/services" ? "page" : undefined}
              aria-label={locale.t("ui.header.services")}
              >{locale.t("ui.header.services")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/shop")}
              aria-current={activePath === "/shop" ? "page" : undefined}
              aria-label={locale.t("ui.header.shop")}
              >{locale.t("ui.header.shop")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/membership")}
              aria-current={activePath === "/membership" ? "page" : undefined}
              aria-label={locale.t("ui.header.plans")}
              >{locale.t("ui.header.plans")}</a
            >
          </li>
          <li class="menu-item">
            <a
              href={locale.href("/contact")}
              aria-current={activePath === "/contact" ? "page" : undefined}
              aria-label={locale.t("ui.header.contact")}
              >{locale.t("ui.header.contact")}</a
            >
          </li>
        </ul>
        <section
          class="karento-drawer-information"
          aria-label={locale.locale === "bg" ? "Информация" : "Information"}
        >
          <p>{locale.locale === "bg" ? "Информация" : "Information"}</p>
          <ul>
            <li class="menu-item">
              <a
                href={locale.href("/about")}
                aria-current={activePath === "/about" ? "page" : undefined}
                aria-label={locale.t("ui.header.about-us")}
                >{locale.t("ui.header.about-us")}</a
              >
            </li>
            <li class="menu-item">
              <a
                href={locale.href("/import")}
                aria-current={activePath === "/import" ? "page" : undefined}
                aria-label={locale.t("ui.header.import")}
                >{locale.t("ui.header.import")}</a
              >
            </li>
            <li class="menu-item">
              <a
                href={locale.href("/news")}
                aria-current={activePath === "/news" ? "page" : undefined}
                aria-label={locale.t("ui.header.news")}
                >{locale.t("ui.header.news")}</a
              >
            </li>
            <li class="menu-item">
              <a
                href={locale.href("/calculator")}
                aria-current={activePath === "/calculator" ? "page" : undefined}
                aria-label={locale.t("ui.header.car-calculator")}
                >{locale.t("ui.header.car-calculator")}</a
              >
            </li>
            <li class="menu-item">
              <a
                href={locale.href("/faq")}
                aria-current={activePath === "/faq" ? "page" : undefined}
                aria-label={locale.t("ui.header.faq")}
                >{locale.t("ui.header.faq")}</a
              >
            </li>
            <li class="menu-item">
              <a
                href={locale.href("/terms")}
                aria-current={activePath === "/terms" ? "page" : undefined}
                aria-label={locale.t("ui.header.terms")}
                >{locale.t("ui.header.terms")}</a
              >
            </li>
          </ul>
        </section>
      </nav>
    </div>
  </div>
</div>
{#if preview.drawer || preview.mobile}<div
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
  onkeydown={(event) => {
    if (event.key === "Escape") {
      preview.drawer = false;
      preview.mobile = false;
    }
  }}
/>

<style>
  .karento-account-drawer .sidebar-canvas-container {
    padding-top: 0;
  }
  .karento-account-drawer .sidebar-canvas-head {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--bs-neutral-0);
    padding-top: 16px;
  }
  .karento-drawer-information {
    margin-top: 16px;
  }
  .karento-drawer-information p {
    margin: 0 0 8px;
    color: var(--bs-neutral-500);
    font-size: 13px;
  }
  .karento-drawer-information ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .karento-drawer-information a {
    display: flex;
    align-items: center;
    min-height: 44px;
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  @media (max-width: 767.98px) {
    :global(body:has(.discovery-home, .vehicle-landing-hero)) .header {
      box-shadow: none;
    }
    .header .main-header .header-left .header-logo {
      width: 144px;
      max-width: 144px;
      flex-basis: 144px;
    }
    .header .header-logo img {
      width: 144px;
    }
    .header :is(.karento-header-cta, .karento-menu-toggle) {
      --discovery-header-surface: var(--bs-neutral-100);
      --discovery-header-border: var(--bs-neutral-200);
      --discovery-header-blur: none;
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      padding: 0;
      border: 0 !important;
      border-radius: var(--karento-radius-pill);
      background: transparent !important;
      color: var(--bs-neutral-1000) !important;
      box-shadow: none;
      backdrop-filter: none !important;
      line-height: 1;
    }
    .header :is(.karento-header-cta, .karento-menu-toggle)::before {
      content: "";
      position: absolute;
      z-index: -1;
      inset: var(--karento-space-1);
      box-sizing: border-box;
      border: 1px solid var(--discovery-header-border);
      border-radius: inherit;
      background: var(--discovery-header-surface);
      backdrop-filter: var(--discovery-header-blur);
      pointer-events: none;
    }
    .header :is(.karento-header-cta, .karento-menu-toggle) :is(svg, img) {
      display: block;
      width: 18px;
      height: 18px;
      margin: 0;
    }
    .header .karento-header-cta svg {
      /* Balance the profile artwork's lower shoulder strokes. */
      transform: translateY(-0.5px);
    }
    .header :is(.karento-header-cta, .karento-menu-toggle):focus-visible {
      outline: 2px solid currentColor !important;
      outline-offset: 0;
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
