<script lang="ts">
  import { site } from "#lib/config/site.ts";
  import { t } from "#lib/i18n/index.ts";

  const m = $derived(t());
  let theme = $state<"night" | "day">(site.defaultTheme);

  $effect(() => {
    theme = document.documentElement.dataset.theme === "day" ? "day" : "night";
  });

  function toggle() {
    theme = theme === "night" ? "day" : "night";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("noir-theme", theme);
    } catch {
      // Storage can be unavailable; the theme still applies for this page view.
    }
  }
</script>

<button
  class="toggle"
  onclick={toggle}
  aria-label={m.nav.theme.label}
  title={m.nav.theme.label}
>
  <span class="dot" class:day={theme === "day"} aria-hidden="true"></span>
  <span class="text"
    >{theme === "night" ? m.nav.theme.night : m.nav.theme.day}</span
  >
</button>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.75rem;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.78;
    transition: opacity var(--fast) ease;
  }

  .toggle:hover {
    opacity: 1;
  }

  /* A crescent at night, a full disc by day. */
  .dot {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    box-shadow: inset -0.25rem -0.125rem 0 0 currentColor;
    transition: box-shadow var(--fast) var(--ease);
  }

  .dot.day {
    box-shadow: inset 0 0 0 0.4375rem currentColor;
  }

  @media (max-width: 30rem) {
    .text {
      display: none;
    }
  }
</style>
