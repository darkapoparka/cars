<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { CatalogText } from "#lib/i18n/text.ts";
  import type { DashboardDropdownConfig } from "#lib/data/dashboard.ts";
  import { dropdownNavigation } from "#lib/attachments.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)", false);
  let {
    config,
    selection = $bindable<CatalogText>(),
  }: { config: DashboardDropdownConfig; selection?: CatalogText } = $props();
  let open = $state(false);
  const label = $derived(locale.text(selection ?? config.initial));
</script>

<div class="dropdown" {@attach dropdownNavigation((value) => (open = value))}>
  {#if phone.current}
    <button
      type="button"
      class={[config.toggleClass, "mobile-dashboard-toggle"]}
      data-bs-toggle="dropdown"
      aria-label={locale.text(config.toggleLabel)}
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <MobileIcon
        name={config.iconClass.includes("steering-wheel") ? "vehicles" : "sort"}
      />{label}<MobileIcon name="chevron-down" />
    </button>
  {:else}<a
      href="#!"
      class={config.toggleClass}
      data-bs-toggle="dropdown"
      aria-label={locale.text(config.toggleLabel)}
      onclick={(event) => {
        event.preventDefault();
        open = !open;
      }}
      aria-expanded={open}
    >
      <i class={config.iconClass}></i>{label}</a
    >{/if}
  <ul class={config.menuClass + (open ? "show" : "")}>
    {#each config.options as option (option)}
      <li
        >{#if phone.current}<button
            type="button"
            class="dropdown-item rounded-1"
            onclick={(event) => {
              event.preventDefault();
              open = false;
              selection = option;
            }}>{locale.text(option)}</button
          >{:else}<a
            href="#!"
            class="dropdown-item rounded-1"
            aria-label={locale.text(option)}
            onclick={(event) => {
              event.preventDefault();
              open = false;
              selection = option;
            }}
          >
            <i class="ti ti-point-filled me-1"></i>{locale.text(option)}
          </a>{/if}</li
      >
    {/each}
  </ul>
</div>

<style>
  @media (max-width: 767.98px) {
    .mobile-dashboard-toggle::after {
      display: none;
    }

    .mobile-dashboard-toggle[aria-expanded="true"] :global(svg:last-child) {
      transform: rotate(180deg);
    }

    button.dropdown-item {
      width: 100%;
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-2) var(--karento-control-inset);
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
    }

    button.dropdown-item:focus-visible {
      outline: var(--karento-focus-width) solid currentColor;
      outline-offset: calc(var(--karento-focus-offset) * -1);
    }
  }
</style>
