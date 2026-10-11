<script lang="ts">
	import Gauge from '@lucide/svelte/icons/gauge';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Fuel from '@lucide/svelte/icons/fuel';
	import Palette from '@lucide/svelte/icons/palette';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Armchair from '@lucide/svelte/icons/armchair';
	import Cog from '@lucide/svelte/icons/cog';
	import Settings from '@lucide/svelte/icons/settings';
	import QrCode from '@lucide/svelte/icons/qr-code';
	import type { AuxeroVehicleDetailOverviewItem } from '$lib/server/vehicle-detail';
	import { vehicleInformationCopy } from '$lib/content/vehicle-information';
	import VehicleInformationSection from './VehicleInformationSection.svelte';
	let { items, english = false }: { items: AuxeroVehicleDetailOverviewItem[]; english?: boolean } =
		$props();
	const copy = $derived(vehicleInformationCopy[english ? 'en' : 'bg']);
	const icons = {
		'icon-gauge.svg': Gauge,
		'calendar.svg': Calendar,
		'gaspump.svg': Fuel,
		'palette.svg': Palette,
		'MapPin.svg': MapPin,
		'Seatbelt.svg': Armchair,
		'Frame.svg': Cog,
		'transmission-2.svg': Settings,
		'QrCode.svg': QrCode
	};
	const primaryIcons = new Set([
		'icon-gauge.svg',
		'calendar.svg',
		'gaspump.svg',
		'Frame.svg',
		'transmission-2.svg'
	]);
	const groups = $derived(
		[
			{
				id: 'primary',
				title: copy.factsTitle,
				items: items.filter((item) => primaryIcons.has(item.icon))
			},
			{
				id: 'additional',
				title: copy.detailsTitle,
				items: items.filter((item) => !primaryIcons.has(item.icon))
			}
		].filter((group) => group.items.length)
	);
</script>

<div class="vehicle-facts">
	<div class="vehicle-facts__panels">
		{#each groups as group (group.id)}
			<VehicleInformationSection title={group.title} variant="specifications">
				<dl>
					{#each group.items as item (item.label)}
						{@const Icon = icons[item.icon as keyof typeof icons] ?? Cog}
						<div>
							<dt>
								<Icon size={16} strokeWidth={1.6} aria-hidden="true" /><span>{item.label}</span>
							</dt>
							<dd>{item.value || '—'}</dd>
						</div>
					{/each}
				</dl>
			</VehicleInformationSection>
		{/each}
	</div>
</div>

<style>
	.vehicle-facts {
		container: vehicle-facts / inline-size;
	}
	.vehicle-facts__panels {
		display: grid;
		align-items: start;
		gap: var(--bc-space-6);
	}
	dl {
		display: grid;
		margin: 0;
	}
	dl > div {
		display: grid;
		grid-template-columns: minmax(max-content, 1fr) minmax(0, max-content);
		align-items: center;
		gap: var(--bc-space-3);
		padding: var(--bc-space-2);
		border-radius: var(--bc-radius-sm);
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-h7);
	}
	dl > div:nth-child(odd) {
		background: var(--bc-surface);
	}
	dt {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
	}
	dt :global(svg) {
		flex-shrink: 0;
	}
	dd {
		min-width: 0;
		margin: 0;
		color: var(--bc-ink);
		font-weight: var(--bc-weight-heading);
		font-variant-numeric: tabular-nums;
		text-align: right;
		overflow-wrap: anywhere;
	}
	@container vehicle-facts (min-width: 40rem) {
		.vehicle-facts__panels {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: stretch;
		}
	}
</style>
