<script lang="ts">
  import { hugeiconsMobile, type MobileIconName } from './hugeicons-mobile';
  let { name, size = 24, strokeWidth = 1.8 }: { name: MobileIconName; size?: number; strokeWidth?: number } = $props();
</script>

<svg class="dn-icon" data-icon-family="hugeicons-rounded" style:--dn-icon-stroke={strokeWidth} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
  {#each hugeiconsMobile[name] as [tag, attributes]}
    <svelte:element this={tag} {...attributes} />
  {/each}
</svg>

<style>
  .dn-icon { display: block; flex: 0 0 auto; }
  .dn-icon :global(*) { stroke-width: var(--dn-icon-stroke); }
</style>
