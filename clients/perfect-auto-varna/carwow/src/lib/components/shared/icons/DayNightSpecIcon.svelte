<script module lang="ts">
	export type DayNightSpecIconName =
		| 'body'
		| 'engine'
		| 'fuel'
		| 'mileage'
		| 'transmission'
		| 'year';
</script>

<script lang="ts">
	const iconPaths: Record<DayNightSpecIconName, string> = {
		body: '/assets/icons/auto.svg',
		engine: '/assets/icons/engine.svg',
		fuel: '/assets/icons/gaspump.svg',
		mileage: '/assets/icons/icon-gauge.svg',
		transmission: '/assets/icons/manual.svg',
		year: '/assets/icons/calendar.svg'
	};

	let { name, size = 14 }: { name: DayNightSpecIconName; size?: number } = $props();

	const path = $derived(iconPaths[name]);
</script>

<span
	class="daynight-spec-icon"
	aria-hidden="true"
	style:--daynight-spec-icon-size={`${size}px`}
	style:--daynight-spec-icon-url={`url("${path}")`}
></span>

<style>
	.daynight-spec-icon {
		display: inline-block;
		width: var(--daynight-spec-icon-size);
		height: var(--daynight-spec-icon-size);
		flex: 0 0 auto;
		background: currentColor;
		-webkit-mask: var(--daynight-spec-icon-url) center / contain no-repeat;
		mask: var(--daynight-spec-icon-url) center / contain no-repeat;
	}
</style>
