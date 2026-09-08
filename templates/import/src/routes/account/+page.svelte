<script lang="ts">
	import DashboardRecentTemplatePage from '$lib/components/account/DashboardRecentTemplatePage.svelte';

	let { data } = $props();
</script>

<DashboardRecentTemplatePage
	afterRecentHtml={data.afterRecentHtml}
	beforeRecentHtml={data.beforeRecentHtml}
	dashboard={data.dashboard}
	pageDocument={data.pageDocument}
/>
