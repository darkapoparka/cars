<script lang="ts">
  import { fluentMobile, type MobileIconName, type MobileIconDefinition } from './fluent-mobile';
  let { name, size = 24, active = false }: { name: MobileIconName; size?: number; active?: boolean } = $props();
  const icon: MobileIconDefinition = $derived(fluentMobile[name]);
</script>

<svg class="dn-icon" data-icon-family="fluent-system-regular" data-icon-name={icon.symbol} data-icon-state="regular" data-icon-active={active} width={size} height={size} viewBox={icon.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
  {#each icon.paths as path}
    <path d={path.d} fill-rule={path.fillRule} clip-rule={path.clipRule} />
  {/each}
</svg>

<style>
  .dn-icon { display: block; flex: 0 0 auto; fill: currentColor; stroke: none; }
</style>
