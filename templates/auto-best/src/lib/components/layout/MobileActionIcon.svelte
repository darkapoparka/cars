<script lang="ts">
  import { materialSymbolsMobile, type MobileIconName } from './material-symbols-mobile';
  let { name, size = 24, filled = false }: { name: MobileIconName; size?: number; filled?: boolean } = $props();
  const icon = $derived(materialSymbolsMobile[name]);
</script>

<svg class="dn-icon" data-icon-family="material-symbols-sharp" data-icon-name={icon.symbol} data-icon-state={filled ? 'filled' : 'outlined'} width={size} height={size} viewBox={icon.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
  {#each filled ? icon.filled : icon.outlined as d}
    <path {d} />
  {/each}
</svg>

<style>
  .dn-icon { display: block; flex: 0 0 auto; fill: currentColor; stroke: none; }
</style>
