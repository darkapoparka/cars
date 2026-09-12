<script lang="ts">
	import { localPath } from '$lib/utils/preview-paths';
	import { onMount } from 'svelte';

	onMount(() => {
		if (localPath(window.location.pathname).replace(/\/+$/, '') !== '/dashboard') {
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
