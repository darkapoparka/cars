<script lang="ts">
  // Simple 24px navigation glyphs share one optical size and stroke weight.
  let { name, size = 22 }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu' | 'location' | 'phone' | 'search' | 'filters' | 'sort' | 'close'; size?: number } = $props();
</script>

<svg class="dn-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  {#if name === 'home'}
    <path d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9" />
  {:else if name === 'cars'}
    <path d="M3 15v-3l3-1 3-5h6l4 5 2 1v5h-2M5 17H3m6 0h6M6 11h13M12 6v5" />
    <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
  {:else if name === 'sell'}
    <path d="M20 4h-7L3.6 13.4a2 2 0 0 0 0 2.8l4.2 4.2a2 2 0 0 0 2.8 0L20 11V4Z" />
    <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
  {:else if name === 'import'}
    <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
  {:else if name === 'menu'}
    <path d="M4 6h16M4 12h16M4 18h16" />
  {:else if name === 'location'}
    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" />
  {:else if name === 'phone'}
    <path d="m8 3 2 5-3 2a15 15 0 0 0 7 7l2-3 5 2v3a2 2 0 0 1-2 2C10.2 21 3 13.8 3 5a2 2 0 0 1 2-2h3Z" />
  {:else if name === 'search'}
    <circle cx="10.5" cy="10.5" r="7.5" /><path d="m16 16 5 5" />
  {:else if name === 'filters'}
    <path d="M3 7h4m4 0h10M3 17h10m4 0h4" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="17" r="2" />
  {:else if name === 'sort'}
    <path d="M7 20V4m-3 3 3-3 3 3m7-3v16m-3-3 3 3 3-3" />
  {:else if name === 'close'}
    <path d="m6 6 12 12M6 18 18 6" />
  {/if}
</svg>

<style>
  .dn-icon { display: block; flex: 0 0 auto; }
</style>
