<script lang="ts">
  // Lucide navigation glyphs; source and ISC license in provenance/lucide-icons.md.
  let { name, size = 22 }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu' | 'location' | 'phone' | 'search' | 'filters' | 'sort' | 'close'; size?: number } = $props();
</script>

<svg class="dn-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  {#if name === 'home'}
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  {:else if name === 'cars'}
    <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
      <path d="M7 14h.01" />
      <path d="M17 14h.01" />
      <rect width="18" height="8" x="3" y="10" rx="2" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
  {:else if name === 'sell'}
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  {:else if name === 'import'}
    <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
  {:else if name === 'menu'}
    <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
  {:else if name === 'location'}
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
  {:else if name === 'phone'}
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
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
