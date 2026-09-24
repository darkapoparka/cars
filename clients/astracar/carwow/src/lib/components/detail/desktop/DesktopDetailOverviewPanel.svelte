<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const overviewItems = $derived([
		{
			id: 'mileage',
			icon: '/assets/icons/icon-gauge.svg',
			label: i18n.t('copy.2021a1495278'),
			value: vehicle.mileage
		},
		{
			id: 'year',
			icon: '/assets/icons/calendar.svg',
			label: i18n.t('copy.57e6f8c23e21'),
			value: `${vehicle.year}`
		},
		{
			id: 'fuel',
			icon: '/assets/icons/gaspump.svg',
			label: i18n.t('copy.8096fa23b6f8'),
			value: vehicle.fuel
		},
		{
			id: 'color',
			icon: '/assets/icons/palette.svg',
			label: i18n.t('copy.7778df8e5cc9'),
			value: vehicle.color
		},
		{
			id: 'location',
			icon: '/assets/icons/MapPin.svg',
			label: i18n.t('copy.6092b6809109'),
			value: `${i18n.dealer('city')}`
		},
		{
			id: 'interior',
			icon: '/assets/icons/Seatbelt.svg',
			label: i18n.t('copy.5c008e16ba23'),
			value: 'Тъмен салон'
		},
		{
			id: 'engine',
			icon: '/assets/icons/Frame.svg',
			label: i18n.t('copy.4d840750b997'),
			value: vehicle.engine
		},
		{
			id: 'transmission',
			icon: '/assets/icons/transmission-2.svg',
			label: i18n.t('copy.5434ba182ef3'),
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
			label: i18n.t('copy.487ba2ac5c9a'),
			value: vehicle.lot
		}
	]);
</script>

<div class="listing-details--sidebar-box mb-40">
	<p class="h5 mb-4 capitalize">{i18n.t('copy.c9e07c462cb9')}</p>
	<ul class="car-overview-list-style2">
		{#each overviewItems as item (item.id)}
			<li class="grid grid-cols-2">
				<p class="flex items-center gap-8">
					<img
						class="h-28 w-28"
						src={i18n.asset(item.icon)}
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					<span class="h7 text-secondary">{i18n.spec(item.label)}</span>
				</p>
				<span class="h7 font-weight-500 pl-28">{i18n.stock(item.value)}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.car-overview-list-style2 :global(.h7) {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		line-height: 1.45;
	}

	.car-overview-list-style2 > li > span {
		font-weight: var(--sa-weight-semibold);
	}
</style>
