<script lang="ts">
	import CompareTemplatePage from '$lib/components/compare/CompareTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CompareTemplatePage
	allVehicles={data.allVehicles}
	locale={data.locale}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
	vehicles={data.vehicles}
/>
