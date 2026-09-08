<script lang="ts">
	import DashboardVehicleDetail from '$lib/components/account/DashboardVehicleDetail.svelte';
	import DashliteDashboardShell from '$lib/components/account/DashliteDashboardShell.svelte';

	let { data } = $props();
</script>

<DashliteDashboardShell dashboard={data.dashboard} active="favorites">
	<DashboardVehicleDetail vehicle={data.vehicle} />
</DashliteDashboardShell>
