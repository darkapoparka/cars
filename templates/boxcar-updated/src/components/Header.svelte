<script lang="ts">
  import { brand } from "../data/brand";
  import { route } from "../lib/router.svelte";
  import { showDialog } from "../lib/dialog";
  import Icon from "./Icon.svelte";

  let drawer: HTMLDialogElement;
  const links = [
    { label: "Home", href: "/", paths: ["/", "/index.html"] },
    {
      label: "Cars",
      href: "/inventory/",
      paths: [
        "/inventory",
        "/listings",
        "/inventory-list-01.html",
        "/inventory-list-02.html",
      ],
    },
    {
      label: "About us",
      href: "/about/",
      paths: ["/about", "/about-us", "/about.html"],
    },
    {
      label: "Contact",
      href: "/contact/",
      paths: ["/contact", "/contact-us", "/contact.html"],
    },
  ];
  let path = $derived(route.path === "/" ? "/" : route.path.replace(/\/$/, ""));
  const isCurrent = (paths: string[]) => paths.includes(path);
  $effect(() => {
    route.path;
    route.search;
    drawer?.close();
  });

  function backdrop(event: PointerEvent) {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      drawer.close();
  }
</script>

<!-- Shared Home 10 header composition. Its styles are independent of page CSS. -->
<header class="dealer-header">
  <div class="dealer-header-inner">
    <a class="dealer-logo" href="/" aria-label={`${brand.name} home`}>
      <img src={brand.logoDark} alt={brand.name} width="108" height="26" />
    </a>
    <nav class="dealer-navigation" aria-label="Main navigation">
      {#each links as link}
        <a
          href={link.href}
          aria-current={isCurrent(link.paths) ? "page" : undefined}
        >
          {link.label}
        </a>
      {/each}
    </nav>
    <div class="dealer-actions">
      <a
        class="dealer-saved"
        href="/favorites/"
        aria-label="Saved cars"
        aria-current={path === "/favorites" ? "page" : undefined}
      >
        <Icon name="bookmark" size={18} />
        <span>Saved</span>
      </a>
      <a class="dealer-contact" href="/contact/">Contact us</a>
      <button
        class="dealer-menu-trigger"
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onclick={(event) => showDialog(drawer, event)}
      >
        <svg
          width="22"
          height="11"
          viewBox="0 0 22 11"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect width="22" height="2" />
          <rect y="9" width="22" height="2" />
        </svg>
      </button>
    </div>
  </div>
</header>
<dialog
  class="dealer-drawer"
  bind:this={drawer}
  onpointerdown={backdrop}
  aria-labelledby="dealer-menu-title"
>
  <div class="dealer-drawer-top">
    <h2 id="dealer-menu-title">Explore {brand.name}</h2>
    <button
      class="dealer-menu-close"
      type="button"
      aria-label="Close menu"
      onclick={() => drawer.close()}
    >
      <Icon name="close" size={22} />
    </button>
  </div>
  <nav class="dealer-drawer-navigation" aria-label="Mobile navigation">
    {#each links as link}
      <a
        href={link.href}
        aria-current={isCurrent(link.paths) ? "page" : undefined}
      >
        {link.label}
      </a>
    {/each}
    <a href="/favorites/">Saved cars</a>
    <a href="/compare/">Compare cars</a>
    <a href="/calculator/">Repayment calculator</a>
    <a href="/blog/">Buying advice</a>
    <a href="/faq/">FAQs</a>
  </nav>
</dialog>

<style>
  .dealer-header {
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    /* The vendor responsive sheet applies padding to every header with !important. */
    padding: 0 !important;
    background: #fff;
    color: #050b20;
    font-family: "Boxcar Dealer", Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }
  .dealer-header-inner {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 32px;
    width: 100%;
    max-width: 1440px;
    min-height: 90px;
    margin: 0 auto;
    padding: 20px 24px;
  }
  .dealer-logo {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    min-height: 48px;
    color: inherit;
    text-decoration: none;
  }
  .dealer-logo img {
    display: block;
    width: auto;
    height: auto;
    max-width: 160px;
    max-height: 34px;
    object-fit: contain;
  }
  .dealer-navigation {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .dealer-navigation a {
    display: inline-flex;
    align-items: center;
    min-height: 48px;
    padding: 0;
    color: inherit;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
  }
  .dealer-navigation a:hover,
  .dealer-navigation a[aria-current="page"],
  .dealer-saved:hover,
  .dealer-saved[aria-current="page"] {
    color: var(--accent, #405ff2);
  }
  .dealer-actions {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: 28px;
  }
  .dealer-saved {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    margin: 0;
    color: inherit;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
  }
  .dealer-contact {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 24px;
    border: 1px solid var(--accent, #405ff2);
    border-radius: 12px;
    color: #fff;
    background: var(--accent, #405ff2);
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }
  .dealer-contact:hover {
    color: #fff;
    background: #050b20;
    border-color: #050b20;
  }
  .dealer-menu-trigger,
  .dealer-menu-close {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 48px;
    min-height: 48px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .dealer-menu-trigger {
    display: none;
  }
  .dealer-header :is(a, button):focus-visible {
    outline: 2px solid #050b20;
    outline-offset: 4px;
    border-radius: 4px;
  }
  .dealer-drawer {
    box-sizing: border-box;
    position: fixed;
    inset: 0 auto 0 0;
    margin: 0 auto 0 0;
    width: min(400px, calc(100% - 28px));
    max-width: none;
    height: 100dvh;
    max-height: 100dvh;
    padding: 24px;
    border: 0;
    border-radius: 0;
    overflow: auto;
    background: #050b20;
    color: #fff;
    font-family: "Boxcar Dealer", Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
  }
  .dealer-drawer::backdrop {
    background: #050b2080;
  }
  .dealer-drawer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
  }
  .dealer-drawer-top h2 {
    margin: 0;
    padding: 0;
    color: #fff;
    font-size: 22px;
    line-height: 30px;
    font-weight: 500;
    letter-spacing: 0;
  }
  .dealer-drawer-navigation a {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    min-height: 52px;
    padding: 12px 0;
    border-bottom: 1px solid #ffffff26;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    text-decoration: none;
  }
  .dealer-drawer-navigation a:hover,
  .dealer-drawer-navigation a[aria-current="page"] {
    color: #a6b5ff;
  }
  .dealer-drawer :is(a, button):focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  @media (max-width: 1250px) {
    .dealer-header-inner,
    .dealer-navigation {
      gap: 24px;
    }
    .dealer-actions {
      gap: 20px;
    }
  }
  @media (max-width: 991px) {
    .dealer-header-inner {
      display: flex;
      justify-content: space-between;
    }
    .dealer-navigation {
      display: none;
    }
    .dealer-menu-trigger {
      display: grid;
    }
  }
  @media (max-width: 767px) {
    .dealer-header-inner {
      padding: 14px 18px;
      min-height: 76px;
    }
    .dealer-actions {
      gap: 12px;
    }
    .dealer-contact {
      display: none;
    }
    .dealer-saved {
      font-size: 14px;
    }
  }
</style>
