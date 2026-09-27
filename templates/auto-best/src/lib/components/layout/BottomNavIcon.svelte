<script lang="ts">
  import MobileNavIcon from './MobileNavIcon.svelte';
  let { name }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu' } = $props();
</script>

<MobileNavIcon {name} size={24} />
