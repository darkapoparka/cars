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
	let { items, english = false }: { items: AuxeroVehicleDetailOverviewItem[]; english?: boolean } =
		$props();
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
				title: english ? 'Vehicle details' : 'Основни данни',
				items: items.filter((item) => primaryIcons.has(item.icon))
			},
			{
				id: 'additional',
				title: english ? 'Details' : 'Детайли',
				items: items.filter((item) => !primaryIcons.has(item.icon))
			}
		].filter((group) => group.items.length)
	);
</script>

<div class="vehicle-facts">
	<div class="vehicle-facts__panels">
		{#each groups as group (group.id)}
			<section class="site-panel vehicle-facts__panel">
				<h2>{group.title}</h2>
				<dl>
					{#each group.items as item (item.label)}
						{@const Icon = icons[item.icon as keyof typeof icons] ?? Cog}
						<div class:vehicle-facts__row--reference={item.icon === 'QrCode.svg'}>
							<dt>
								<Icon size={16} strokeWidth={1.6} aria-hidden="true" /><span>{item.label}</span>
							</dt>
							<dd>{item.value || '—'}</dd>
						</div>
					{/each}
				</dl>
			</section>
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
	.vehicle-facts__panel {
		border: 0;
	}
	.vehicle-facts__panel > h2 {
		margin-bottom: var(--bc-space-5);
		font: var(--bc-weight-heading) var(--bc-text-h5) / var(--bc-leading-h5) var(--bc-font-body);
	}
	dl {
		display: grid;
		gap: var(--bc-space-4);
		margin: 0;
	}
	dl > div {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.2fr);
		align-items: center;
		gap: var(--bc-space-3);
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-h7);
	}
	dt {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		color: var(--bc-muted);
	}
	dt :global(svg) {
		flex-shrink: 0;
	}
	dd {
		margin: 0;
		color: var(--bc-ink);
		font-weight: var(--bc-weight-heading);
		font-variant-numeric: tabular-nums;
		text-align: end;
		overflow-wrap: anywhere;
	}
	.vehicle-facts__row--reference dd {
		color: var(--bc-copy);
		font-size: var(--bc-text-meta);
		font-weight: var(--bc-weight-body);
	}
	@container vehicle-facts (min-width: 40rem) {
		.vehicle-facts__panels {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
