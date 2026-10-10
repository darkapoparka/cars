<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { CatalogText } from "#lib/i18n/text.ts";
  import type { DashboardDropdownConfig } from "#lib/data/dashboard.ts";
  import { dropdownNavigation } from "#lib/attachments.svelte.ts";
  let { config }: { config: DashboardDropdownConfig } = $props();
  let open = $state(false);
  let selection = $state<CatalogText>();
  const label = $derived(locale.text(selection ?? config.initial));
</script>

<div class="dropdown" {@attach dropdownNavigation((value) => (open = value))}>
  <a
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
  >
  <ul class={config.menuClass + (open ? "show" : "")}>
    {#each config.options as option (option)}
      <li
        ><a
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
        </a></li
      >
    {/each}
  </ul>
</div>
