<script lang="ts">
  import { brand } from "../data/brand";
  import { route } from "../lib/router.svelte";
  import { selections } from "../lib/state.svelte";
  import { showDialog } from "../lib/dialog";
  import Icon from "./Icon.svelte";
  let { home = 0 }: { home?: number } = $props();
  let drawer: HTMLDialogElement;
  const lightHomes = [1, 2, 3, 4, 8, 9];
  let light = $derived(lightHomes.includes(home));
  let minimal = $derived([3, 6, 10].includes(home));
  let centered = $derived(home === 7);
  function closeDropdowns() {
    document
      .querySelectorAll<HTMLDetailsElement>("header details[open]")
      .forEach((el) => (el.open = false));
  }
  function escape(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    const open = document.querySelector<HTMLDetailsElement>(
      "header details[open]",
    );
    if (open) {
      open.open = false;
      open.querySelector("summary")?.focus();
    }
  }
  function backdrop(event: PointerEvent) {
    if (event.target === drawer) {
      const r = drawer.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        drawer.close();
    }
  }
  $effect(() => {
    route.path;
    route.search;
    drawer?.close();
    closeDropdowns();
  });
</script>

<svelte:window
  onkeydown={escape}
  onclick={(event) => {
    if (!(event.target as Element)?.closest("header details")) closeDropdowns();
  }}
/>
<header
  class="site-header"
  class:light
  class:minimal
  class:centered
  class:over-hero={light || home === 6}
>
  <div class="header-inner">
    {#if minimal || centered}<button
        class="menu-trigger"
        aria-label="Open menu"
        onclick={(event) => showDialog(drawer, event)}
      >
        <Icon name="menu" size={22} />
        <span>Menu</span>
      </button>{/if}
    <a class="logo" href="/" aria-label={`${brand.name} home`}>
      <img
        src={light ? brand.logoLight : brand.logoDark}
        alt={brand.name}
        width="108"
        height="28"
      />
    </a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/inventory/">Cars</a>
      <a href="/about/">About us</a>
      <a href="/blog/">Buying advice</a>
      <a href="/contact/">Contact</a>
    </nav>
    <div class="header-actions">
      <a
        class="saved-link"
        href="/favorites/"
        aria-label={`Saved cars (${selections.favorites.length})`}
      >
        <Icon name="bookmark" size={16} />
        <span>
          Saved{selections.favorites.length
            ? ` (${selections.favorites.length})`
            : ""}
        </span>
      </a>
      <a class="header-cta" href="/contact/?intent=sell">
        Sell your car <Icon name="arrow" size={13} />
      </a>
      <button
        class="mobile-menu menu-trigger"
        aria-label="Open menu"
        onclick={(event) => showDialog(drawer, event)}
      >
        <Icon name="menu" size={24} />
      </button>
    </div>
  </div>
</header>
<dialog
  class="nav-drawer"
  bind:this={drawer}
  onpointerdown={backdrop}
  aria-labelledby="menu-title"
>
  <div class="drawer-top">
    <h2 id="menu-title">Explore {brand.name}</h2>
    <button
      class="icon-button"
      aria-label="Close menu"
      onclick={() => drawer.close()}
    >
      <Icon name="close" />
    </button>
  </div>
  <nav aria-label="Mobile navigation">
    <a href="/">Home</a>
    <a href="/inventory/">Browse cars <Icon name="arrow" /></a>
    <a href="/favorites/">Saved cars ({selections.favorites.length})</a>
    <a href="/compare/">Compare cars ({selections.compare.length})</a>
    <a href="/calculator/">Loan calculator</a>
    <a href="/about/">About us</a>
    <a href="/blog/">Journal</a>
    <a href="/faq/">FAQs</a>
    <a href="/contact/">Get in touch</a>
  </nav>
</dialog>
