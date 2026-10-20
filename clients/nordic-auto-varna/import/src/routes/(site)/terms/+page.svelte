<script lang="ts">
	import type { PageProps } from './$types';
	import PolicyPage from '$lib/components/terms/PolicyPage.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>{data.policy.title} — {data.site.identity.name}</title><meta
		name="description"
		content={data.policy.intro}
	/></svelte:head
>
<PolicyPage policy={data.policy} />
