<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  import { drawerFocus } from "#lib/interactions.ts";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolveRoute, canonicalRoutes } from "#lib/routes.ts";
  import { goto } from "$app/navigation";
  import { dealer } from "#lib/content.ts";
  const preview = usePreview();
  const activePath = $derived(
    "/" +
      (Object.entries(canonicalRoutes).find(
        ([, source]) => source === resolveRoute(page.url.pathname),
      )?.[0] ?? "__no-active-route"),
  );
  let sticky = $state(false);
  onMount(() => {
    const scroll = () => (sticky = window.scrollY >= 200);
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => window.removeEventListener("scroll", scroll);
  });
  import { scrollbar } from "#lib/vendor.ts";
  let mobileExpanded0 = $state(false);
</script>

<header
  class={"header sticky-bar header-home-2 border-0" + (sticky ? " stick" : "")}
  data-header-source="index-3"
>
  <div class="container-fluid background-body">
    <div class="main-header">
      <div class="header-left">
        <div class="header-logo">
          <a
            class="d-flex"
            href="/"
            aria-current={activePath === "/" ? "page" : undefined}
            aria-label={`${dealer.name} home`}
          >
            <img
              class="light-mode"
              alt={dealer.logo.alt}
              src={dealer.logo.light}
            />
            <img
              class="dark-mode"
              alt={dealer.logo.alt}
              src={dealer.logo.archivedDark}
            />
          </a>
        </div>
        <div class="header-nav">
          <nav class="nav-main-menu">
            <ul class="main-menu" data-site-navigation="karento-best"
              ><li class="menu-item"
                ><a
                  href="/"
                  aria-current={activePath === "/" ? "page" : undefined}
                  aria-label="Home">Home</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/vehicles"
                  aria-current={activePath === "/vehicles" ? "page" : undefined}
                  aria-label="Vehicles">Vehicles</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/services"
                  aria-current={activePath === "/services" ? "page" : undefined}
                  aria-label="Services">Services</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/shop"
                  aria-current={activePath === "/shop" ? "page" : undefined}
                  aria-label="Shop">Shop</a
                ></li
              ><li class="has-children"
                ><a
                  href="#!"
                  role="button"
                  aria-haspopup="true"
                  aria-label="Explore">Explore</a
                ><ul class="sub-menu"
                  ><li class="menu-item"
                    ><a
                      href="/about"
                      aria-current={activePath === "/about"
                        ? "page"
                        : undefined}
                      aria-label="About Us">About Us</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/import"
                      aria-current={activePath === "/import"
                        ? "page"
                        : undefined}
                      aria-label="Import">Import</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/news"
                      aria-current={activePath === "/news" ? "page" : undefined}
                      aria-label="News">News</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/calculator"
                      aria-current={activePath === "/calculator"
                        ? "page"
                        : undefined}
                      aria-label="Car Calculator">Car Calculator</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/faq"
                      aria-current={activePath === "/faq" ? "page" : undefined}
                      aria-label="FAQ">FAQ</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/terms"
                      aria-current={activePath === "/terms"
                        ? "page"
                        : undefined}
                      aria-label="Terms">Terms</a
                    ></li
                  ></ul
                ></li
              ><li class="menu-item"
                ><a
                  href="/membership"
                  aria-current={activePath === "/membership"
                    ? "page"
                    : undefined}
                  aria-label="Plans">Plans</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/contact"
                  aria-current={activePath === "/contact" ? "page" : undefined}
                  aria-label="Contact">Contact</a
                ></li
              ></ul
            >
          </nav>
        </div>
        <div class="header-right">
          <div
            class="d-none d-xxl-inline-block align-middle mr-15 karento-header-actions"
            ><a
              class="btn btn-primary karento-header-cta"
              href={preview.accountHref}
              data-demo-account-link=""
              data-demo-fixed-label=""
              aria-label="Account"
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
              ><span>Account</span></a
            ></div
          >
          <button
            class={"burger-icon-2 karento-menu-toggle" +
              (preview.drawer ? " burger-2-close" : "")}
            onclick={() => (preview.drawer = !preview.drawer)}
            type="button"
            aria-label="Open menu"
            aria-expanded={preview.drawer}
            aria-controls="karento-account-drawer"
          >
            <img
              src="/assets/imgs/template/icons/menu.svg"
              alt=""
              width="18"
              height="18"
            />
          </button>
          <div
            role="button"
            tabindex="0"
            aria-label="Open mobile navigation"
            onkeydown={(event) => {
              if (event.key === "Enter" || event.key === " ")
                preview.mobile = !preview.mobile;
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
  use:drawerFocus={preview.mobile}
  inert={!preview.mobile}
  aria-hidden={!preview.mobile}
  class={"mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2" +
    (preview.mobile ? " sidebar-visible" : "")}
>
  <div class="mobile-header-wrapper-inner" use:scrollbar>
    <div class="mobile-header-logo">
      <a
        class="d-flex"
        href="/"
        aria-current={activePath === "/" ? "page" : undefined}
        aria-label={`${dealer.name} home`}
        ><img
          class="light-mode"
          alt={dealer.logo.alt}
          src={dealer.logo.light}
        /><img
          class="dark-mode"
          alt={dealer.logo.alt}
          src={dealer.logo.archivedDark}
        /></a
      >
      <div
        class="burger-icon burger-icon-white"
        role="button"
        tabindex="0"
        aria-label="Close mobile navigation"
        onclick={() => (preview.mobile = false)}
        onkeydown={(event) => {
          if (event.key === "Enter" || event.key === " ")
            preview.mobile = false;
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
                  href="/"
                  aria-current={activePath === "/" ? "page" : undefined}
                  aria-label="Home">Home</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/vehicles"
                  aria-current={activePath === "/vehicles" ? "page" : undefined}
                  aria-label="Vehicles">Vehicles</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/services"
                  aria-current={activePath === "/services" ? "page" : undefined}
                  aria-label="Services">Services</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/shop"
                  aria-current={activePath === "/shop" ? "page" : undefined}
                  aria-label="Shop">Shop</a
                ></li
              ><li class="has-children"
                ><a
                  href="#!"
                  role="button"
                  aria-haspopup="true"
                  aria-label="Explore"
                  aria-expanded={mobileExpanded0}
                  onclick={(event) => {
                    event.preventDefault();
                    mobileExpanded0 = !mobileExpanded0;
                  }}>Explore</a
                ><ul
                  class="sub-menu"
                  style:display={mobileExpanded0 ? "block" : "none"}
                  ><li class="menu-item"
                    ><a
                      href="/about"
                      aria-current={activePath === "/about"
                        ? "page"
                        : undefined}
                      aria-label="About Us">About Us</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/import"
                      aria-current={activePath === "/import"
                        ? "page"
                        : undefined}
                      aria-label="Import">Import</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/news"
                      aria-current={activePath === "/news" ? "page" : undefined}
                      aria-label="News">News</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/calculator"
                      aria-current={activePath === "/calculator"
                        ? "page"
                        : undefined}
                      aria-label="Car Calculator">Car Calculator</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/faq"
                      aria-current={activePath === "/faq" ? "page" : undefined}
                      aria-label="FAQ">FAQ</a
                    ></li
                  ><li class="menu-item"
                    ><a
                      href="/terms"
                      aria-current={activePath === "/terms"
                        ? "page"
                        : undefined}
                      aria-label="Terms">Terms</a
                    ></li
                  ></ul
                ></li
              ><li class="menu-item"
                ><a
                  href="/membership"
                  aria-current={activePath === "/membership"
                    ? "page"
                    : undefined}
                  aria-label="Plans">Plans</a
                ></li
              ><li class="menu-item"
                ><a
                  href="/contact"
                  aria-current={activePath === "/contact" ? "page" : undefined}
                  aria-label="Contact">Contact</a
                ></li
              ></ul
            ><div class="karento-mobile-account">
              <a
                href={preview.accountHref}
                data-demo-account-link="true"
                aria-label="Sign in">Sign in</a
              >
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div><div
  use:drawerFocus={preview.drawer}
  class={"sidebar-canvas-wrapper perfect-scrollbar button-bg-2 karento-account-drawer" +
    (preview.drawer ? " sidebar-canvas-visible" : "")}
  id="karento-account-drawer"
  role="dialog"
  aria-label="Menu and account"
  aria-modal="true"
  aria-hidden={!preview.drawer}
  inert={!preview.drawer}
  ><div class="sidebar-canvas-container" use:scrollbar>
    <div class="sidebar-canvas-head"
      ><div class="sidebar-canvas-logo">
        <a
          class="d-flex"
          href="/"
          aria-current={activePath === "/" ? "page" : undefined}
          aria-label={`${dealer.name} home`}
        >
          <img
            class="light-mode"
            alt={dealer.logo.alt}
            src={dealer.logo.light}
          />
          <img
            class="dark-mode"
            alt={dealer.logo.alt}
            src={dealer.logo.archivedDark}
          />
        </a>
      </div>
      <button
        class="close-canvas"
        onclick={() => (preview.drawer = false)}
        type="button"
        aria-label="Close menu"
        ><img
          src="/assets/imgs/template/icons/close.png"
          alt=""
          width="16"
          height="16"
        /></button
      >
    </div>
    <div class="sidebar-canvas-content">
      <nav class="karento-drawer-account" aria-label="Account">
        <p class="karento-account-heading" data-demo-account-heading=""
          >{preview.role === "guest"
            ? "Your account"
            : preview.role === "owner"
              ? "Dealership owner"
              : "Member account"}</p
        >
        <a
          href={preview.accountHref}
          data-demo-account-link=""
          data-demo-drawer-account=""
          aria-label={preview.role === "guest" ? "Sign in" : "View account"}
          >{preview.role === "guest" ? "Sign in" : "View account"}</a
        >
        <a
          href="/register"
          aria-current={activePath === "/register" ? "page" : undefined}
          data-demo-register-link=""
          hidden={preview.role !== "guest"}
          aria-label="Create an account">Create an account</a
        >
        <a
          href={preview.role === "owner"
            ? "/dashboard/settings"
            : "/account/settings"}
          data-demo-settings-link=""
          hidden={preview.role === "guest"}
          aria-label="Account settings">Account settings</a
        >
        <button
          class="karento-demo-signout"
          type="button"
          hidden={preview.role === "guest"}
          onclick={() => {
            preview.setRole("guest");
            preview.drawer = false;
            void goto("/login");
          }}
          aria-label="Sign out">Sign out</button
        >
      </nav>
      <nav
        class="karento-drawer-navigation"
        aria-label="Website"
        data-site-navigation="karento-best"
      >
        <ul
          ><li class="menu-item"
            ><a
              href="/"
              aria-current={activePath === "/" ? "page" : undefined}
              aria-label="Home">Home</a
            ></li
          ><li class="menu-item"
            ><a
              href="/vehicles"
              aria-current={activePath === "/vehicles" ? "page" : undefined}
              aria-label="Vehicles">Vehicles</a
            ></li
          ><li class="menu-item"
            ><a
              href="/services"
              aria-current={activePath === "/services" ? "page" : undefined}
              aria-label="Services">Services</a
            ></li
          ><li class="menu-item"
            ><a
              href="/shop"
              aria-current={activePath === "/shop" ? "page" : undefined}
              aria-label="Shop">Shop</a
            ></li
          ><li class="menu-item"
            ><a
              href="/membership"
              aria-current={activePath === "/membership" ? "page" : undefined}
              aria-label="Plans">Plans</a
            ></li
          ><li class="menu-item"
            ><a
              href="/contact"
              aria-current={activePath === "/contact" ? "page" : undefined}
              aria-label="Contact">Contact</a
            ></li
          ></ul
        >
        <details class="karento-drawer-explore"
          ><summary>Explore</summary><ul
            ><li class="menu-item"
              ><a
                href="/about"
                aria-current={activePath === "/about" ? "page" : undefined}
                aria-label="About Us">About Us</a
              ></li
            ><li class="menu-item"
              ><a
                href="/import"
                aria-current={activePath === "/import" ? "page" : undefined}
                aria-label="Import">Import</a
              ></li
            ><li class="menu-item"
              ><a
                href="/news"
                aria-current={activePath === "/news" ? "page" : undefined}
                aria-label="News">News</a
              ></li
            ><li class="menu-item"
              ><a
                href="/calculator"
                aria-current={activePath === "/calculator" ? "page" : undefined}
                aria-label="Car Calculator">Car Calculator</a
              ></li
            ><li class="menu-item"
              ><a
                href="/faq"
                aria-current={activePath === "/faq" ? "page" : undefined}
                aria-label="FAQ">FAQ</a
              ></li
            ><li class="menu-item"
              ><a
                href="/terms"
                aria-current={activePath === "/terms" ? "page" : undefined}
                aria-label="Terms">Terms</a
              ></li
            ></ul
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
      if (event.key === "Enter") {
        preview.drawer = false;
        preview.mobile = false;
      }
    }}
    aria-label="Close menu overlay"
    onclick={() => {
      preview.drawer = false;
      preview.mobile = false;
    }}
  ></div>{/if}
<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") {
      preview.drawer = false;
      preview.mobile = false;
    }
  }}
/>
