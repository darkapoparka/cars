<script lang="ts">
	import VehicleDetailTemplatePage from '$lib/components/detail/VehicleDetailTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<VehicleDetailTemplatePage
	detail={data.detail}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
