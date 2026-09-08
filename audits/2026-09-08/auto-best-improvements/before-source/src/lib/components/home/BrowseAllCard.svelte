<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  let { href = '/listing-grid', label = 'Виж всички', detail = '', action = 'Виж всички', compact = false, image }: {
    href?: '/listing-grid' | '/blog'; label?: string; detail?: string; action?: string; compact?: boolean; image?: string;
  } = $props();
</script>

<a class="dn-browse-all" class:compact href={resolve(href)}>
  {#if image}<img src={image} alt="" width="180" height="90" loading="lazy" />
  {:else}<span class="mark"><Icon name="arrow-right" size={compact ? 24 : 28} /></span>{/if}
  <strong>{label}</strong>
  {#if detail}<span class="detail">{detail}</span>{/if}
  {#if !compact}<span class="action">{action}<Icon name="arrow-right" size={18} /></span>{/if}
</a>

<style>
  .dn-browse-all { display: none; }
  @media (max-width: 767px) {
    .dn-browse-all { position: relative; display: flex; min-width: 0; min-height: 260px; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px 16px; border: 1px solid #dce0e5; border-radius: 14px; background: #fff; color: #202329; text-align: center; scroll-snap-align: start; }
    .mark { display: grid; flex-shrink: 0; width: 48px; height: 48px; place-items: center; border-radius: 50%; background: #f1f2f4; color: #202329; }
    strong { font-size: 20px; font-weight: 650; line-height: 1.3; }
    .detail { color: #626a75; font-size: 14px; line-height: 1.4; }
    .action { display: flex; min-height: 44px; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; padding: 8px 18px; border-radius: var(--dn-pill); background: var(--dn-red); color: #fff; font-size: 14px; font-weight: 600; }
    .compact { min-height: 108px; gap: 8px; padding: 10px 6px; border: 0; }
    .compact strong { font-size: 13px; }
    .compact:has(img) { align-items: flex-start; padding: 8px 12px 12px; text-align: left; }
    .compact:has(img) strong { font-size: 15px; font-weight: 700; }
    img { width: min(176px, 92%); height: 78px; object-fit: contain; }
    a:hover { background: #fafafa; }
    a:focus-visible { outline: 2px solid var(--dn-red); outline-offset: -2px; }
  }
</style>
