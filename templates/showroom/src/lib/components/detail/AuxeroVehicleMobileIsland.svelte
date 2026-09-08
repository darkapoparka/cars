<script lang="ts">
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import { onMount } from 'svelte';
	import AuxeroVehicleMobilePdp from './AuxeroVehicleMobilePdp.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();

	let showMobilePdp = $state(false);

	onMount(() => {
		const media = window.matchMedia('(max-width: 767.98px)');
		const syncMobilePdp = () => {
			showMobilePdp = media.matches;
		};

		syncMobilePdp();
		media.addEventListener('change', syncMobilePdp);

		return () => {
			media.removeEventListener('change', syncMobilePdp);
		};
	});
</script>

{#if showMobilePdp}
	<div class="eliqauto-pdp-mobile">
		{#key detail.slug}
			<AuxeroVehicleMobilePdp {detail} />
		{/key}
	</div>
{/if}

<style>
	.eliqauto-pdp-mobile {
		display: none;
	}

	@media (max-width: 767.98px) {
		.eliqauto-pdp-mobile {
			display: block;
		}
	}
</style>
