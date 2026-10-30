<script lang="ts">
  import "../app.css";
  import { site } from "#lib/config/site.ts";
  import Footer from "#lib/components/Footer.svelte";
  import Header from "#lib/components/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <meta name="theme-color" content="#0b0b0b" />
</svelte:head>

<div class="site" style:--accent={site.accent}>
  <a class="skip visually-hidden" href="#main">Skip to content</a>
  <Header />
  <main id="main">
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  .skip:focus {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 100;
    width: auto;
    height: auto;
    clip-path: none;
    padding: 0.75rem 1rem;
    background: var(--invert-bg);
    color: var(--invert-text);
  }
</style>
