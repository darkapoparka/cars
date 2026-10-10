<script lang="ts">
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';

  let { expanded, controls, ontoggle }: {
    expanded?: boolean;
    controls?: string;
    ontoggle?: () => void;
  } = $props();
  const i18n = getI18n();
</script>

{#snippet content()}
  <span class="dn-discovery-all__glyph" aria-hidden="true">
    <span></span><span></span><span></span><span></span>
  </span>
  <strong>{i18n.t(expanded ? 'm_211232676e95' : 'm_a52ace420f21')}</strong>
{/snippet}

{#if ontoggle}
  <button class="dn-discovery-toggle" type="button" aria-expanded={expanded} aria-controls={controls} onclick={ontoggle}>
    {@render content()}
  </button>
{:else}
  <a class="dn-discovery-toggle" href={i18n.href(resolve('/cars'))}>
    {@render content()}
  </a>
{/if}

<style>
  .dn-discovery-toggle { display: none; }

  @media (max-width: 767px) {
    .dn-discovery-toggle {
      display: grid;
      order: 1;
      min-width: 0;
      min-height: var(--dn-discovery-tile-height);
      grid-template-rows: var(--dn-discovery-media-height) auto;
      gap: var(--dn-space-2);
      margin: 0;
      padding: var(--dn-discovery-tile-padding);
      border: 0;
      border-radius: 14px;
      background: var(--dn-mobile-surface);
      color: var(--dn-ink);
      text-align: center;
      cursor: pointer;
    }
    .dn-discovery-all__glyph { display: grid; width: 54px; height: 54px; place-self: center; grid-template-columns: repeat(2, 1fr); gap: 7px; padding: 9px; border-radius: 16px; background: var(--dn-home-panel); }
    .dn-discovery-all__glyph span { border-radius: 50%; background: #cdd2d8; }
    strong { align-self: end; font: var(--dn-discovery-label-font); }
    .dn-discovery-toggle:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }
</style>
