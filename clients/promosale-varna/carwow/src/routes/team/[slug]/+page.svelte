<script lang="ts">
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DesktopTeamMemberPage from '$lib/components/team/DesktopTeamMemberPage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} ogImage={data.member.image} />

<PublicStorefrontRoute mainContentAnchor>
	<DesktopTeamMemberPage member={data.member} members={data.members} />
</PublicStorefrontRoute>
