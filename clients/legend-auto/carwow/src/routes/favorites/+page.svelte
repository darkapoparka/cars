<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopFavoritesPage from '$lib/components/favorites/desktop/DesktopFavoritesPage.svelte';
	import MobileFavoritesPage from '$lib/components/favorites/mobile/MobileFavoritesPage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();

	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const showMobileShell = $derived(viewport.mobile);
	const showDesktopShell = $derived(!viewport.mobile);
</script>

<RouteSeo
	title={i18n.t('pattern.fe9b1727fcae', { v0: daynightSite.shortName })}
	description={i18n.t('pattern.ef2720c0cf14', {
		v0: daynightSite.shortName,
		v1: daynightSite.city
	})}
/>

{#if showMobileShell}
	<MobileFavoritesPage catalogue={data.vehicles} />
{/if}

{#if showDesktopShell}
	<PublicStorefrontRoute mobileReplaced>
		<DesktopFavoritesPage catalogue={data.vehicles} />
	</PublicStorefrontRoute>
{/if}
