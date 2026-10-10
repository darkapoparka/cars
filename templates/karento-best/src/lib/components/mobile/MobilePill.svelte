<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { MouseEventHandler } from "svelte/elements";
  import MobileIcon, { type MobileIconName } from "./MobileIcon.svelte";

  let {
    label,
    href,
    leadingIcon,
    trailingIcon,
    count,
    showZeroCount = false,
    selected = false,
    variant = "default",
    pressed,
    iconOnly = false,
    ariaLabel,
    expanded,
    popup,
    onclick,
    class: className = "",
  }: {
    label: string;
    href?: string;
    leadingIcon?: MobileIconName;
    trailingIcon?: MobileIconName;
    count?: number;
    showZeroCount?: boolean;
    selected?: boolean;
    variant?: "default" | "secondary";
    pressed?: boolean;
    iconOnly?: boolean;
    ariaLabel?: string;
    expanded?: boolean;
    popup?: "dialog";
    onclick?: MouseEventHandler<HTMLButtonElement>;
    class?: string;
  } = $props();
</script>

{#snippet contents()}
  {#if leadingIcon}<MobileIcon
      name={leadingIcon}
      size={iconOnly ? 20 : 16}
    />{/if}
  <span
    class={iconOnly ? "mobile-pill-label visually-hidden" : "mobile-pill-label"}
    >{label}</span
  >
  {#if count || (showZeroCount && count === 0)}<span class="mobile-pill-count"
      >{count}</span
    >{/if}
  {#if trailingIcon}<MobileIcon
      name={trailingIcon}
      size={iconOnly ? 20 : 16}
    />{/if}
{/snippet}

{#if href}
  <a
    class={[
      "mobile-pill",
      {
        "mobile-pill-selected": selected,
        "mobile-pill-icon-only": iconOnly,
        "mobile-pill-secondary": variant === "secondary",
      },
      className,
    ]}
    href={locale.href(href)}
    aria-label={ariaLabel ?? (iconOnly ? label : undefined)}
  >
    {@render contents()}
  </a>
{:else}
  <button
    type="button"
    class={[
      "mobile-pill",
      {
        "mobile-pill-selected": selected,
        "mobile-pill-icon-only": iconOnly,
        "mobile-pill-secondary": variant === "secondary",
      },
      className,
    ]}
    {onclick}
    aria-label={ariaLabel ?? (iconOnly ? label : undefined)}
    aria-pressed={pressed}
    aria-haspopup={popup}
    aria-expanded={expanded}
  >
    {@render contents()}
  </button>
{/if}
