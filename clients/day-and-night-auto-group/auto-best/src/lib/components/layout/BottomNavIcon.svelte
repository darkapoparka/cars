<script lang="ts">
  import MobileNavIcon from './MobileActionIcon.svelte';

  // Official Hugeicons Stroke Rounded, shared with mobile actions and the menu.
  let { name, size = 24 }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu'; size?: number } = $props();
</script>

<MobileNavIcon {name} {size} />
