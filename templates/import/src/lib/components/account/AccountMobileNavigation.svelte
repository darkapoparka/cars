<script lang="ts">
	import { page } from '$app/state';
	import MobileModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import { routeParts } from '$lib/locale/core';
	import { linkHref } from '$lib/utils/links';

	const accountPath = $derived(routeParts(page.url.pathname).path);
	const english = $derived(page.data.locale === 'en');
	const activeSection = $derived.by(() => {
		if (accountPath.startsWith('/account/messages')) return '/account/messages';
		if (accountPath.startsWith('/account/profile') || accountPath === '/account/password')
			return '/account/profile';
		if (
			accountPath.startsWith('/account/listings') ||
			accountPath.startsWith('/account/vehicles/') ||
			accountPath === '/account/compare'
		)
			return '/account/listings';
		return '/account';
	});
	const options = $derived(
		[
			{ value: '/account', label: english ? 'Overview' : 'Табло' },
			{ value: '/account/profile', label: english ? 'Profile' : 'Профил' },
			{ value: '/account/listings', label: english ? 'Cars' : 'Обяви' },
			{ value: '/account/messages', label: english ? 'Messages' : 'Съобщения' }
		].map((item) => ({ ...item, href: linkHref(item.value + (english ? '?lang=en' : '')) }))
	);
</script>

<div class="account-mobile-navigation">
	<MobileModeTabs
		navigation
		layout="scrollable"
		value={activeSection}
		{options}
		label={english ? 'Account pages' : 'Страници на профила'}
	/>
</div>

<style>
	.account-mobile-navigation {
		--bc-text-mode-tab: var(--bc-mobile-tab-nav-text);
		min-width: 0;
	}
</style>
