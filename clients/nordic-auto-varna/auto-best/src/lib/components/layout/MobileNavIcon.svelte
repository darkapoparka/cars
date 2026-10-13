<script lang="ts">
  import { materialSymbols } from './material-symbols';
  let { name, size = 22 }: { name: keyof typeof materialSymbols; size?: number } = $props();
</script>

<svg class="dn-icon" data-icon-family="material-symbols-rounded" width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false">
  {#each materialSymbols[name] as d}<path {d} />{/each}
</svg>

<style>
  .dn-icon { display: block; flex: 0 0 auto; }
</style>
