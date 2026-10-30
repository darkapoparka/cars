<script lang="ts">
  import { page } from "$app/state";
  import { site } from "#lib/config/site.ts";
  import { currentLocale, localized, paths, t } from "#lib/i18n/index.ts";
  import ThemeToggle from "./ThemeToggle.svelte";
  import Wordmark from "./Wordmark.svelte";

  const locale = $derived(currentLocale());
  const m = $derived(t());
  const onHome = $derived(page.route.id === "/[[lang=lang]]");

  let scrolled = $state(false);
  let open = $state(false);

  const links = $derived([
    { href: paths.collection(locale), label: m.nav.collection },
    { href: `${paths.home(locale)}#services`, label: m.nav.services },
    { href: `${paths.home(locale)}#sell`, label: m.nav.sell },
    { href: paths.contact(locale), label: m.nav.contact },
  ]);

  $effect(() => {
    // Close the menu after any navigation.
    void page.url.pathname;
    open = false;
  });

  $effect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  });
</script>

<svelte:window
  onscroll={() => (scrolled = window.scrollY > 24)}
  onkeydown={(e) => e.key === "Escape" && (open = false)}
/>

<header
  class="header"
  class:solid={scrolled || !onHome || open}
  class:over-hero={onHome && !scrolled && !open}
>
  <div class="container bar">
    <a class="brand" href={paths.home(locale)} aria-label={site.name}>
      <Wordmark />
    </a>

    <nav class="primary" aria-label="Main">
      {#each links as link (link.href)}
        <a
          href={link.href}
          aria-current={page.url.pathname === link.href ? "page" : undefined}
          >{link.label}</a
        >
      {/each}
    </nav>

    <div class="tools">
      <div class="langs" role="group" aria-label={m.nav.language}>
        {#each site.locales as code (code)}
          <a
            href={localized(code)}
            hreflang={code}
            aria-current={code === locale ? "true" : undefined}
            >{code.toUpperCase()}</a
          >
        {/each}
      </div>
      <ThemeToggle />
      <a class="button book" href={paths.contact(locale)}>{m.nav.book}</a>
      <button
        class="menu-button"
        aria-expanded={open}
        aria-controls="site-menu"
        onclick={() => (open = !open)}
      >
        <span class="visually-hidden">{open ? m.nav.close : m.nav.menu}</span>
        <span class="bars" class:open aria-hidden="true"></span>
      </button>
    </div>
  </div>
</header>

<!-- Outside the header: its backdrop-filter would otherwise contain this fixed overlay. -->
<div id="site-menu" class="menu" class:open inert={!open}>
  <nav class="container" aria-label="Mobile">
    {#each links as link, i (link.href)}
      <a href={link.href} style:--i={i} onclick={() => (open = false)}>
        <span class="label">0{i + 1}</span>
        <span class="display">{link.label}</span>
      </a>
    {/each}
    <div class="menu-foot">
      <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
      <a class="button button--solid" href={paths.contact(locale)}
        >{m.nav.book}</a
      >
    </div>
  </nav>
</div>

<style>
  .header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    transition:
      background-color var(--fast) ease,
      border-color var(--fast) ease;
    border-bottom: 1px solid transparent;
  }

  .header.solid {
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: blur(18px) saturate(1.4);
    border-bottom-color: var(--line);
  }

  /* The hero is always dark, so the bar uses light ink over it in both themes. */
  .header.over-hero {
    color: #f4f3ef;
    --line-strong: rgb(255 255 255 / 0.3);
    --text: #f4f3ef;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 2rem;
    height: var(--header);
  }

  .brand {
    flex: none;
  }

  .primary {
    display: flex;
    gap: 2.25rem;
    margin-inline: auto;
  }

  .primary a,
  .langs a {
    position: relative;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.78;
    transition: opacity var(--fast) ease;
  }

  .primary a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.4rem;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--fast) var(--ease);
  }

  .primary a:hover,
  .primary a[aria-current="page"],
  .langs a:hover,
  .langs a[aria-current="true"] {
    opacity: 1;
  }

  .primary a:hover::after,
  .primary a[aria-current="page"]::after {
    transform: scaleX(1);
  }

  .tools {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .langs {
    display: flex;
    gap: 0.75rem;
  }

  .langs a[aria-current="true"] {
    color: var(--accent);
  }

  .book {
    min-height: 2.5rem;
    padding-inline: 1.125rem;
  }

  .menu-button {
    display: none;
    width: 2.75rem;
    height: 2.75rem;
    border: 0;
    background: none;
    cursor: pointer;
    position: relative;
  }

  .bars,
  .bars::before {
    position: absolute;
    left: 0.625rem;
    width: 1.5rem;
    height: 1px;
    background: currentColor;
    transition: transform var(--fast) var(--ease);
  }

  .bars {
    top: 1.125rem;
  }

  .bars::before {
    content: "";
    left: 0;
    top: 0.5rem;
  }

  .bars.open {
    transform: translateY(0.25rem) rotate(45deg);
  }

  .bars.open::before {
    transform: translateY(-0.5rem) rotate(-90deg);
  }

  .menu {
    position: fixed;
    inset: var(--header) 0 0;
    z-index: 49;
    background: var(--bg);
    color: var(--text);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--fast) ease,
      visibility var(--fast);
    overflow-y: auto;
  }

  .menu.open {
    opacity: 1;
    visibility: visible;
  }

  .menu nav {
    display: flex;
    flex-direction: column;
    padding-block: 2rem 3rem;
  }

  .menu nav > a {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    padding-block: 1.125rem;
    border-bottom: 1px solid var(--line);
    font-size: var(--step-2);
    transform: translateY(12px);
    opacity: 0;
    transition:
      transform var(--slow) var(--ease),
      opacity var(--slow) var(--ease);
    transition-delay: calc(var(--i) * 50ms);
  }

  .menu.open nav > a {
    transform: none;
    opacity: 1;
  }

  .menu-foot {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 2.5rem;
  }

  .menu-foot > a:first-child {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: var(--step-1);
  }

  @media (max-width: 68rem) {
    .primary,
    .book {
      display: none;
    }

    .menu-button {
      display: block;
    }

    .tools {
      margin-left: auto;
      gap: 0.75rem;
    }
  }

  @media (min-width: 68.0625rem) {
    .menu {
      display: none;
    }
  }
</style>
