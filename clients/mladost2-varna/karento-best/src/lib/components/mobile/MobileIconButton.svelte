<svelte:options runes={true} />

<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import MobileIcon, { type MobileIconName } from "./MobileIcon.svelte";

  let {
    label,
    icon,
    href,
    onclick,
    expanded,
    controls,
    surface = "plain",
    onMedia = false,
    class: className = "",
  }: {
    label: string;
    icon: MobileIconName;
    href?: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    expanded?: boolean;
    controls?: string;
    surface?: "plain" | "circle" | "square";
    onMedia?: boolean;
    class?: string;
  } = $props();
</script>

{#snippet contents()}
  <span class="mobile-icon-button-surface">
    <MobileIcon name={icon} size="action" />
  </span>
{/snippet}

{#if href}
  <a
    class={[
      "mobile-icon-button",
      {
        "mobile-icon-button-circle": surface === "circle",
        "mobile-icon-button-square": surface === "square",
        "mobile-icon-button-on-media": onMedia,
      },
      className,
    ]}
    {href}
    aria-label={label}
  >
    {@render contents()}
  </a>
{:else}
  <button
    type="button"
    class={[
      "mobile-icon-button",
      {
        "mobile-icon-button-circle": surface === "circle",
        "mobile-icon-button-square": surface === "square",
        "mobile-icon-button-on-media": onMedia,
      },
      className,
    ]}
    aria-label={label}
    aria-expanded={expanded}
    aria-controls={controls}
    {onclick}
  >
    {@render contents()}
  </button>
{/if}

<style>
  @media (max-width: 767.98px) {
    :is(a, button).mobile-icon-button {
      display: grid;
      place-items: center;
      flex: 0 0 var(--karento-touch-target);
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: var(--karento-radius-media);
      background: transparent;
      color: inherit;
      line-height: 0;
      text-decoration: none;
      cursor: pointer;
    }

    :is(a, button).mobile-icon-button:hover {
      background: transparent;
    }

    :is(a, button).mobile-icon-button-circle {
      border-radius: var(--karento-radius-pill);
    }

    .mobile-icon-button-surface {
      display: grid;
      place-items: center;
      width: var(--karento-control-selector);
      height: var(--karento-control-selector);
      border-radius: var(--karento-radius-pill);
    }

    .mobile-icon-button-circle .mobile-icon-button-surface {
      border: 1px solid var(--bs-border-color);
      background: var(--bs-background-card);
      color: var(--bs-neutral-1000);
    }

    .mobile-icon-button-square .mobile-icon-button-surface {
      border-radius: var(--karento-radius-media);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
    }

    :is(a, button).mobile-icon-button-on-media {
      color: white;
    }

    .mobile-icon-button-on-media .mobile-icon-button-surface {
      border-color: rgb(255 255 255 / 28%);
      background: rgb(255 255 255 / 14%);
      color: inherit;
      backdrop-filter: blur(12px);
    }

    :is(a, button).mobile-icon-button:focus-visible {
      outline: var(--karento-focus-width) solid currentColor !important;
      outline-offset: var(--karento-focus-offset);
    }
  }
</style>
