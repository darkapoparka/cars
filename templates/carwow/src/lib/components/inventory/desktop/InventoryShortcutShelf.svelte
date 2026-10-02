<script lang="ts">
	import InventoryTypePills from './InventoryTypePills.svelte';
</script>

<div class="inventory-results-shortcuts"><InventoryTypePills /></div>

<style>
	.inventory-results-shortcuts {
		margin: 12px 0 0;
		padding: 0;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pills) {
		display: grid !important;
		gap: 8px !important;
		padding: 0 !important;
		margin: 0 !important;
	}
</style>
