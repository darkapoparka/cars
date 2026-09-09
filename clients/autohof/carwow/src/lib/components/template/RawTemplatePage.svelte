<script lang="ts">
	import type { RawTemplatePageData } from '$lib/types/template-page';
	import TrustedTemplateHtml from '$lib/components/trusted-html/TrustedTemplateHtml.svelte';
	import TemplateAssets from './TemplateAssets.svelte';
	import TemplateLocalBehaviors from './TemplateLocalBehaviors.svelte';

	let { page }: { page: RawTemplatePageData } = $props();
</script>

<TemplateAssets
	title={page.title}
	styles={page.headStyles}
	scriptSrcs={page.scriptSrcs}
	description={page.description}
/>
<TemplateLocalBehaviors />

<div id="wrapper" class="daynight-raw-template-shell">
	<TrustedTemplateHtml html={page.headerHtml} />
	<TrustedTemplateHtml html={page.mainHtml} />
	<TrustedTemplateHtml html={page.footerHtml} />
</div>

<TrustedTemplateHtml html={page.trailingHtml} />
