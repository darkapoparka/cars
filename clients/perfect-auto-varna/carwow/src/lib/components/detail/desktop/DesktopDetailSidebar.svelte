<script lang="ts">
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import DesktopDetailDealerPanel from './DesktopDetailDealerPanel.svelte';
	import DesktopDetailInquiryPanel from './DesktopDetailInquiryPanel.svelte';
	import DesktopDetailOverviewPanel from './DesktopDetailOverviewPanel.svelte';
	import DesktopDetailPaymentPanel from './DesktopDetailPaymentPanel.svelte';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();
</script>

<div class="listing-details--sidebar">
	<DesktopDetailPaymentPanel {vehicle} />
	<DesktopDetailOverviewPanel {vehicle} />
	<DesktopDetailDealerPanel />
	<DesktopDetailInquiryPanel {vehicle} />
</div>
