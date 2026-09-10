<script lang="ts">
	import type { InventoryListVehicle } from '$lib/types/inventory';

	let { vehicle, styleClass }: { vehicle: InventoryListVehicle; styleClass: string } = $props();
</script>

<ul class="tag {styleClass}">
	<li>
		<img src="/variant-3/assets/icons/icon-gauge.svg" alt="" aria-hidden="true" /><span
			>{vehicle.mileage}</span
		>
	</li>
	<li>
		<img src="/variant-3/assets/icons/calendar.svg" alt="" aria-hidden="true" /><span>{vehicle.year}</span>
	</li>
	<li>
		<img src="/variant-3/assets/icons/gaspump.svg" alt="" aria-hidden="true" /><span>{vehicle.fuel}</span>
	</li>
</ul>

<style>
	.tag.style2 {
		align-items: center;
		flex-wrap: nowrap;
		gap: 6px;
		justify-content: flex-start;
		min-height: 28px;
		overflow: hidden;
	}

	.tag.style2 li {
		align-items: center;
		background: #f6f8fb;
		border: 1px solid #e4e8ef;
		border-radius: 7px;
		color: #344054;
		display: inline-flex;
		flex: 0 1 auto;
		height: 28px;
		min-width: 0;
		padding: 0 6px;
	}

	.tag.style2 li img {
		flex: 0 0 auto;
		height: 13px;
		margin-right: 4px;
		opacity: 0.72;
		width: 13px;
	}

	.tag.style2 li span {
		font-size: 14px;
		line-height: 20px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (min-width: 992px) {
		.tag.style2 {
			gap: 6px;
			min-height: 30px;
		}

		.tag.style2 li {
			height: 30px;
			padding: 0 7px;
		}

		.tag.style2 li img {
			height: 13px;
			margin-right: 4px;
			width: 13px;
		}

		.tag.style2 li span {
			font-size: 14px;
			line-height: 20px;
		}
	}

	:global(
		.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .tag.style2
	) {
		flex-wrap: nowrap !important;
		overflow: hidden;
	}

	:global(
		.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .tag.style2 li
	) {
		flex: 0 1 auto;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.tag.style2
			li
			span
	) {
		min-width: 0;
	}
</style>
