<script lang="ts">
	import AccountFavoritesTemplatePage from '$lib/components/account/AccountFavoritesTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<AccountFavoritesTemplatePage
	afterFavoritesHtml={data.afterFavoritesHtml}
	beforeFavoritesHtml={data.beforeFavoritesHtml}
	cards={data.cards}
	pageDocument={data.pageDocument}
/>
