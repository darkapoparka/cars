<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let {
    value = $bindable<"buy" | "rent">("buy"),
    onchange,
    expanded = false,
  }: {
    value?: "buy" | "rent";
    onchange?: () => void;
    expanded?: boolean;
  } = $props();
</script>

<div
  class={["search-purpose", { expanded }]}
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
    gap: 4px;
    width: fit-content;
    padding: var(--search-purpose-track-padding, 4px);
    border-radius: 999px;
    background: var(--bs-neutral-100);
    color: var(--bs-neutral-1000);
  }
  .search-purpose.expanded {
    width: var(--search-purpose-expanded-width, 192px);
    max-width: 100%;
  }
  button {
    flex: 1 0 44px;
    min-width: 44px;
    min-height: 44px;
    padding: 0 var(--search-purpose-padding-inline, 12px);
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--bs-neutral-600);
    font: inherit;
    font-size: var(--karento-type-control-size, 13px);
    font-weight: 500;
    cursor: pointer;
  }
  .expanded button {
    font-size: var(--search-purpose-expanded-font, 16px);
  }
  button[aria-pressed="true"] {
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  @media (hover: hover) {
    button:hover:not([aria-pressed="true"]) {
      background: var(--bs-neutral-200);
      color: var(--bs-neutral-1000);
    }
  }
  button:focus-visible {
    outline: 2px solid var(--karento-accent, var(--bs-neutral-1000));
    outline-offset: 2px;
  }
</style>
