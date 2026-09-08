<script lang="ts">
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const overviewItems = $derived([
		{
			id: 'mileage',
			icon: '/assets/icons/icon-gauge.svg',
			label: 'Пробег:',
			value: vehicle.mileage
		},
		{
			id: 'year',
			icon: '/assets/icons/calendar.svg',
			label: 'Година:',
			value: `${vehicle.year}`
		},
		{
			id: 'fuel',
			icon: '/assets/icons/gaspump.svg',
			label: 'Гориво:',
			value: vehicle.fuel
		},
		{
			id: 'color',
			icon: '/assets/icons/palette.svg',
			label: 'Цвят:',
			value: vehicle.color
		},
		{
			id: 'location',
			icon: '/assets/icons/MapPin.svg',
			label: 'Локация:',
			value: 'Варна'
		},
		{
			id: 'interior',
			icon: '/assets/icons/Seatbelt.svg',
			label: 'Интериор:',
			value: 'Тъмен салон'
		},
		{
			id: 'engine',
			icon: '/assets/icons/Frame.svg',
			label: 'Двигател:',
			value: vehicle.engine
		},
		{
			id: 'transmission',
			icon: '/assets/icons/transmission-2.svg',
			label: 'Скоростна кутия:',
			value: vehicle.transmission
		},
		{
			id: 'vin',
			icon: '/assets/icons/Barcode.svg',
			label: 'VIN:',
			value: 'предоставя се при оглед'
		},
		{
			id: 'lot',
			icon: '/assets/icons/QrCode.svg',
			label: 'Референтен №:',
			value: vehicle.lot
		}
	]);
</script>

<div class="listing-details--sidebar-box mb-40">
	<p class="h5 mb-4 capitalize">Преглед на автомобила</p>
	<ul class="car-overview-list-style2">
		{#each overviewItems as item (item.id)}
			<li class="grid grid-cols-2">
				<p class="flex items-center gap-8">
					<img
						class="h-28 w-28"
						src={item.icon}
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					<span class="h7 text-secondary">{item.label}</span>
				</p>
				<span class="h7 font-weight-500 pl-28">{item.value}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.car-overview-list-style2 :global(.h7) {
		font-size: 16px;
		font-weight: 500;
		line-height: 1.45;
	}

	.car-overview-list-style2 > li > span {
		font-weight: 600;
	}
</style>
