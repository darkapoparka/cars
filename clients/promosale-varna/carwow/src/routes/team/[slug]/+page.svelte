<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DesktopTeamMemberPage from '$lib/components/team/DesktopTeamMemberPage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo
	title={i18n.text(data.member.name)}
	description={i18n.text(data.member.bio)}
	ogImage={data.member.image}
/>

<PublicStorefrontRoute mainContentAnchor>
	<DesktopTeamMemberPage member={data.member} members={data.members} />
</PublicStorefrontRoute>
