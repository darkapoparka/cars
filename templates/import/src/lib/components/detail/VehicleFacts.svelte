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
</script>

<section class="site-panel vehicle-facts">
	<h2>{english ? 'Vehicle details' : 'Основни данни'}</h2>
	<dl>
		{#each items as item (item.label)}
			{@const Icon = icons[item.icon as keyof typeof icons] ?? Cog}
			<div>
				<dt><Icon size={18} strokeWidth={1.6} aria-hidden="true" /><span>{item.label}</span></dt>
				<dd>{item.value || '—'}</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	dl {
		display: grid;
		margin: 0;
	}
	dl > div {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.2fr);
		align-items: baseline;
		gap: var(--bc-space-3);
		padding-block: var(--bc-space-3);
		border-bottom: 1px solid var(--bc-border);
	}
	dl > div:first-child {
		padding-top: 0;
	}
	dl > div:last-child {
		padding-bottom: 0;
		border: 0;
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
		align-self: flex-start;
		margin-top: 2px;
	}
	dd {
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-text-label);
		font-weight: var(--bc-weight-heading);
		overflow-wrap: anywhere;
	}
</style>
