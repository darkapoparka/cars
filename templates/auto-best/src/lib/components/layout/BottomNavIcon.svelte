<script lang="ts">
  // Simple, consistently weighted navigation symbols drawn for this template.
  let { name }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu' } = $props();
</script>

<svg class="dn-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name === 'home'}
    <path d="m3 10 9-7 9 7M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M9 21v-7h6v7" />
  {:else if name === 'cars'}
    <path d="m5 9 1.5-4h11L19 9M4 16v3M20 16v3M4 9h16l1 3v4H3v-4Z" />
    <path d="M6 12h2M16 12h2" />
  {:else if name === 'sell'}
    <path d="M12 3h8a1 1 0 0 1 1 1v8l-9 9L3 12Z" />
    <circle cx="16.5" cy="7.5" r="1.5" />
  {:else if name === 'import'}
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" />
  {:else}
    <path d="M5 6h14M5 12h14M5 18h14" />
  {/if}
</svg>
