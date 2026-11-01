<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let {
    value = $bindable<"buy" | "rent">("buy"),
    onchange,
    standalone = false,
  }: {
    value?: "buy" | "rent";
    onchange?: () => void;
    standalone?: boolean;
  } = $props();
</script>

<div
  class={["search-purpose", { standalone }]}
  role="group"
  aria-label={locale.locale === "bg" ? "Купуване или наем" : "Buy or rent"}
>
  {#each ["buy", "rent"] as purpose (purpose)}
    <button
      type="button"
      aria-pressed={value === purpose}
      onclick={() => {
        value = purpose as "buy" | "rent";
        onchange?.();
      }}
      >{locale.locale === "bg"
        ? purpose === "buy"
          ? "Купи"
          : "Наеми"
        : purpose === "buy"
          ? "Buy"
          : "Rent"}</button
    >
  {/each}
</div>

<style>
  .search-purpose {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 2px;
  }
  .search-purpose.standalone {
    width: fit-content;
    height: var(--search-purpose-row-height, 36px);
    gap: 20px;
    color: var(--search-purpose-foreground, var(--bs-neutral-1000));
  }
  button {
    position: relative;
    isolation: isolate;
    min-width: 44px;
    min-height: 44px;
    padding: 0 10px;
    border: 0;
    border-radius: var(--karento-radius-pill, 999px);
    background: transparent;
    color: var(--bs-neutral-500);
    font: inherit;
    font-size: var(--karento-type-control-size, 13px);
    font-weight: 600;
    cursor: pointer;
  }
  button::before {
    content: "";
    position: absolute;
    inset: 5px 0;
    border-radius: inherit;
    z-index: -1;
  }
  button[aria-pressed="true"] {
    color: var(--bs-neutral-0);
  }
  button[aria-pressed="true"]::before {
    background: var(--bs-neutral-1000);
  }
  .standalone button {
    min-width: 44px;
    padding-inline: 0;
    border-radius: 0;
    color: inherit;
    font-size: 14px;
    font-weight: 500;
  }
  .standalone button::before {
    display: none;
  }
  .standalone button[aria-pressed="true"] {
    font-weight: 600;
  }
  .standalone button[aria-pressed="true"]::after {
    content: "";
    position: absolute;
    inset: auto 0 5px;
    height: 2px;
    background: currentColor;
  }
  @media (hover: hover) {
    button:hover:not([aria-pressed="true"])::before {
      background: var(--bs-neutral-100);
    }
  }
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: -2px;
  }
  .standalone button:focus-visible {
    outline-color: currentColor;
    outline-offset: 2px;
  }
</style>
