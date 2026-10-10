<script lang="ts">
	import AccountListingFormTemplatePage from '$lib/components/account/AccountListingFormTemplatePage.svelte';

	let { data } = $props();
</script>

<AccountListingFormTemplatePage
	afterFormHtml={data.afterFormHtml}
	beforeFormHtml={data.beforeFormHtml}
	form={data.form}
	formHtml={data.formHtml}
	pageDocument={data.pageDocument}
/>
