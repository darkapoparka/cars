<script lang="ts">
	import InventoryTypePills from './InventoryTypePills.svelte';
</script>

<div class="inventory-results-shortcuts"><InventoryTypePills /></div>

<style>
	.inventory-results-shortcuts {
		margin: 0;
		padding: 0 10px 10px;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pills) {
		display: flex !important;
		flex-wrap: wrap !important;
		gap: 8px !important;
		padding: 0 !important;
		margin: 0 !important;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill svg) {
		display: none !important;
	}
</style>
