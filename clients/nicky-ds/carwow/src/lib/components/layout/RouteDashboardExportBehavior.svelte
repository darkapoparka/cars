<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.location.pathname.replace(/\/+$/, '') !== '/dashboard') {
			return () => {};
		}

		let disposed = false;
		let cleanup = () => {};

		void import('$lib/components/admin/dashboard/template-dashboard-export')
			.then(({ setupDashboardExportPanel }) => {
				if (disposed) {
					return;
				}
				cleanup = setupDashboardExportPanel();
			})
			.catch((error) => {
				console.error('Could not load DayNight dashboard export behavior:', error);
			});

		return () => {
			disposed = true;
			cleanup();
		};
	});
</script>
