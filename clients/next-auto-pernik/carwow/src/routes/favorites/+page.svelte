<script lang="ts">
	import DesktopFavoritesPage from '$lib/components/favorites/desktop/DesktopFavoritesPage.svelte';
	import MobileFavoritesPage from '$lib/components/favorites/mobile/MobileFavoritesPage.svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { isDesktopOrServerViewport, isPhoneViewport } from '$lib/hooks/is-mobile.svelte';

	const showMobileShell = $derived(isPhoneViewport());
	const showDesktopShell = $derived(isDesktopOrServerViewport());
</script>

<RouteSeo
	title="Запазени автомобили · NEXT AUTO"
	description="Запазени автомобили от наличността на NEXT AUTO Перник."
/>

{#if showDesktopShell}
	<RouteImageBehavior />
{/if}

{#if showMobileShell}
	<MobileFavoritesPage />
{/if}

{#if showDesktopShell}
	<StorefrontShell mobileReplaced>
		<SiteChrome />
		<DesktopFavoritesPage />
		<DayNightFooter />
	</StorefrontShell>

	<DesktopHomeTrailingChrome />
{/if}
