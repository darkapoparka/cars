<script lang="ts">
  import MobileNavIcon from './MobileActionIcon.svelte';

  // Official Material Symbols Sharp, shared with mobile actions and the menu.
  let { name, size = 24, active = false }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu'; size?: number; active?: boolean } = $props();
</script>

<MobileNavIcon {name} {size} filled={active} />
