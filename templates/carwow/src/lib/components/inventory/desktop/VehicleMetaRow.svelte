<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import type { InventoryListVehicle } from '$lib/types/inventory';

	let { vehicle, styleClass }: { vehicle: InventoryListVehicle; styleClass: string } = $props();
</script>

<ul class="tag {styleClass}">
	<li>
		<img src={i18n.asset('/assets/icons/icon-gauge.svg')} alt="" aria-hidden="true" /><span
			>{i18n.distance(vehicle.mileage)}</span
		>
	</li>
	<li>
		<img src={i18n.asset('/assets/icons/calendar.svg')} alt="" aria-hidden="true" /><span
			>{vehicle.year}</span
		>
	</li>
	<li>
		<img src={i18n.asset('/assets/icons/gaspump.svg')} alt="" aria-hidden="true" /><span
			>{i18n.spec(vehicle.fuel)}</span
		>
	</li>
</ul>

<style>
	.tag.style2 {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 12px;
		justify-content: flex-start;
		min-height: 20px;
		padding: 0;
	}

	.tag.style2 li {
		align-items: center;
		color: #47515b;
		display: inline-flex;
		flex: 0 1 auto;
		min-height: 20px;
		min-width: 0;
		padding: 0;
	}

	.tag.style2 li img {
		flex: 0 0 auto;
		height: 16px;
		margin-right: 4px;
		width: 16px;
	}

	.tag.style2 li span {
		font-size: var(--sa-text-caption);
		line-height: 20px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (min-width: 992px) {
		.tag.style2 {
			gap: 8px 12px;
			min-height: 20px;
		}

		.tag.style2 li {
			min-height: 20px;
			padding: 0;
		}

		.tag.style2 li img {
			height: 16px;
			margin-right: 4px;
			width: 16px;
		}

		.tag.style2 li span {
			font-size: var(--sa-text-caption);
			line-height: 20px;
		}
	}
</style>
