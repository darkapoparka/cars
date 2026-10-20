<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  let { href = '/cars', label = i18n.t("m_5701bc5c6a95"), detail = '', action = i18n.t("m_5701bc5c6a95"), compact = false, image }: {
    href?: '/cars' | '/blog'; label?: string; detail?: string; action?: string; compact?: boolean; image?: string;
  } = $props();
</script>

<a class="dn-browse-all" class:compact class:dn-browse-all--with-image={Boolean(image)} href={i18n.href(resolve(href))}>
  {#if image}<img src={image} alt="" width="180" height="90" loading="lazy" />
  {:else}<span class="mark"><Icon name="arrow-right" size={compact ? 24 : 28} /></span>{/if}
  <strong>{label}</strong>
  {#if detail}<span class="detail">{detail}</span>{/if}
  {#if !compact}<span class="action">{action}<Icon name="arrow-right" size={18} /></span>{/if}
</a>

<style>
  .dn-browse-all { display: none; }
  @media (max-width: 767px) {
    .dn-browse-all { position: relative; display: flex; min-width: 0; min-height: 0; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: var(--dn-space-2); padding: var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-card); background: var(--dn-white); color: var(--dn-ink); text-align: center; scroll-snap-align: start; }
    .mark { display: grid; flex-shrink: 0; width: var(--dn-control-height-compact); height: var(--dn-control-height-compact); place-items: center; border-radius: var(--dn-pill); background: var(--dn-surface-panel); color: var(--dn-ink); }
    strong { max-width: 100%; overflow-wrap: anywhere; font: var(--dn-mobile-card-title-font); }
    .detail { color: #626a75; font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
    .action { display: flex; max-width: 100%; min-height: var(--dn-control-height-default); align-items: center; justify-content: center; gap: var(--dn-space-2); margin-top: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-4); border-radius: var(--dn-pill); background: var(--dn-red); color: var(--dn-white); font: var(--dn-control-font); overflow-wrap: anywhere; }
    .action :global(svg) { flex-shrink: 0; }
    .compact { min-height: 108px; gap: 8px; padding: 10px 6px; border: 0; }
    .compact strong { font-size: var(--dn-text-meta); }
    .compact.dn-browse-all--with-image { align-items: flex-start; padding: 8px 12px 12px; text-align: left; }
    .compact.dn-browse-all--with-image strong { font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
    img { width: min(176px, 92%); height: 78px; object-fit: contain; }
    @media (hover: hover) and (pointer: fine) {
      a:hover { background: var(--dn-surface-subtle); }
    }
    a:focus-visible { outline: 2px solid var(--dn-red); outline-offset: -2px; }
  }
</style>
