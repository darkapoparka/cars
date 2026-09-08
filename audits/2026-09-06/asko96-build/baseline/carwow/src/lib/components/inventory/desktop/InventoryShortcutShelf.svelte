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
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill) {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		height: 34px !important;
		min-height: 34px !important;
		width: auto !important;
		padding: 0 12px !important;
		border: 1px solid #d9dde1 !important;
		border-radius: 999px !important;
		background: #fff !important;
		color: #24292e !important;
		font: 500 14px/1.2 var(--sa-font) !important;
		box-shadow: none !important;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill svg) {
		display: none !important;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill span) {
		font: inherit !important;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill.is-active) {
		background: #d50028 !important;
		color: #fff !important;
		border-color: #d50028 !important;
	}
	:global(.inventory-refined .inventory-results-shortcuts .daynight-inventory-type-pill:hover) {
		border-color: #9da4ac !important;
	}
</style>
