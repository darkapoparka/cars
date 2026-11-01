<svelte:options runes={true} />

<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import MobileIcon, { type MobileIconName } from "./MobileIcon.svelte";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";

  let {
    label,
    icon,
    href,
    onclick,
    expanded,
    controls,
    surface = "plain",
    onMedia = false,
    demo = false,
    getFeedbackContainer,
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
    demo?: boolean;
    getFeedbackContainer?: () => HTMLElement | null | undefined;
    class?: string;
  } = $props();
  const classes = $derived(
    "mobile-icon-button" +
      (surface === "circle" ? " mobile-icon-button-circle" : "") +
      (surface === "square" ? " mobile-icon-button-square" : "") +
      (onMedia ? " mobile-icon-button-on-media" : "") +
      (className ? " " + className : ""),
  );
</script>

{#snippet contents()}
  <span class="mobile-icon-button-surface">
    <MobileIcon name={icon} size="action" />
  </span>
{/snippet}

{#if href && demo}
  <DemoActionLink
    class={classes}
    data-mobile-icon-button=""
    {href}
    aria-label={label}
    {getFeedbackContainer}
  >
    {@render contents()}
  </DemoActionLink>
{:else if href}
  <a class={classes} data-mobile-icon-button="" {href} aria-label={label}>
    {@render contents()}
  </a>
{:else}
  <button
    type="button"
    class={classes}
    data-mobile-icon-button=""
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
    :global(:is(a, button).mobile-icon-button[data-mobile-icon-button]) {
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

    :global(:is(a, button).mobile-icon-button[data-mobile-icon-button]:hover) {
      background: transparent;
    }

    :global(:is(a, button).mobile-icon-button-circle[data-mobile-icon-button]) {
      border-radius: var(--karento-radius-pill);
    }

    .mobile-icon-button-surface {
      display: grid;
      place-items: center;
      width: var(--karento-control-selector);
      height: var(--karento-control-selector);
      border-radius: var(--karento-radius-pill);
    }

    :global(.mobile-icon-button-circle) .mobile-icon-button-surface {
      border: 1px solid var(--bs-border-color);
      background: var(--bs-background-card);
      color: var(--bs-neutral-1000);
    }

    :global(.mobile-icon-button-square) .mobile-icon-button-surface {
      border-radius: var(--karento-radius-media);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
    }

    :global(
      :is(a, button).mobile-icon-button-on-media[data-mobile-icon-button]
    ) {
      color: white;
    }

    :global(.mobile-icon-button-on-media) .mobile-icon-button-surface {
      border-color: rgb(255 255 255 / 28%);
      background: rgb(255 255 255 / 14%);
      color: inherit;
      backdrop-filter: blur(12px);
    }

    :global(
      :is(a, button).mobile-icon-button[data-mobile-icon-button]:focus-visible
    ) {
      outline: var(--karento-focus-width) solid currentColor !important;
      outline-offset: var(--karento-focus-offset);
    }
  }
</style>
