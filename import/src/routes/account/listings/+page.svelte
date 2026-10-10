<script lang="ts">
	import AccountListingsTemplatePage from '$lib/components/account/AccountListingsTemplatePage.svelte';

	let { data } = $props();
</script>

<AccountListingsTemplatePage
	afterListingsHtml={data.afterListingsHtml}
	beforeListingsHtml={data.beforeListingsHtml}
	listings={data.listings}
	listingsHtml={data.listingsHtml}
	pageDocument={data.pageDocument}
/>
