<script lang="ts">
	import { page } from '$app/state';
	import { beforeNavigate, preloadData, pushState } from '$app/navigation';
	import { routeParts } from '$lib/locale/core';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import CompareDialog from './CompareDialog.svelte';

	const garage = getGarageContext();
	const historyId = `bc-compare-${Math.random().toString(36).slice(2)}`;
	const open = $derived(page.state.__bcCompareDialog === historyId);
	let cards = $state<AuxeroInventoryVehicleCard[]>([]);
	let loading = $state(false);
	let failed = $state(false);
	let trigger: HTMLElement | null = null;
	let previousPageFocus: HTMLElement | null = null;
	let nativePageNavigation = false;
	let requestedURL: URL | undefined;
	let requestSequence = 0;

	function isCompareEntry(url: URL) {
		const destination = routeParts(url.pathname);
		return (
			url.origin === page.url.origin &&
			destination.path === '/compare' &&
			(!destination.locale || destination.locale === page.data.locale) &&
			routeParts(page.url.pathname).path !== '/compare'
		);
	}
	function rememberPageFocus(event: FocusEvent) {
		if (
			event.target instanceof HTMLElement &&
			event.target !== document.body &&
			event.target !== document.documentElement &&
			!event.target.closest('[role="dialog"]')
		)
			previousPageFocus = event.target;
	}
	function rememberLink(event: MouseEvent) {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			!(event.target instanceof Element)
		)
			return;
		const link = event.target.closest<HTMLAnchorElement>('a[href]');
		if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
		if (!isCompareEntry(new URL(link.href, page.url))) return;
		nativePageNavigation = link.hasAttribute('data-compare-page');
		if (!nativePageNavigation) {
			trigger =
				link.closest('[role="dialog"]') && previousPageFocus?.isConnected
					? previousPageFocus
					: link;
		}
	}
	async function loadCards() {
		if (!requestedURL) return;
		const sequence = ++requestSequence;
		loading = true;
		failed = false;
		try {
			const result = await preloadData(requestedURL.href);
			if (sequence !== requestSequence || !open) return;
			if (result.type !== 'loaded' || result.status >= 400 || !Array.isArray(result.data.cards))
				throw new Error('Comparison data unavailable');
			cards = result.data.cards as AuxeroInventoryVehicleCard[];
			const ids = requestedURL.searchParams.get('ids') ?? requestedURL.searchParams.get('compare');
			const requested = ids === null ? garage.compare : ids.split(',');
			garage.setCompare(requested.filter((slug) => cards.some((car) => car.slug === slug)));
		} catch {
			if (sequence === requestSequence && open) failed = true;
		} finally {
			if (sequence === requestSequence) loading = false;
		}
	}
	beforeNavigate((navigation) => {
		if (
			(navigation.type !== 'link' && navigation.type !== 'goto') ||
			!navigation.to ||
			!isCompareEntry(navigation.to.url)
		)
			return;
		if (nativePageNavigation) {
			nativePageNavigation = false;
			return;
		}
		navigation.cancel();
		if (!trigger?.isConnected || !trigger.getClientRects().length) {
			trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		}
		requestedURL = navigation.to.url;
		pushState('', { ...page.state, __bcCompareDialog: historyId });
		void loadCards();
	});
	function restoreFocus(event: Event) {
		event.preventDefault();
		if (trigger?.isConnected) trigger.focus({ preventScroll: true });
	}
</script>

<svelte:document onclickcapture={rememberLink} onfocusincapture={rememberPageFocus} />
<CompareDialog
	bind:open={
		() => open,
		(next) => {
			if (!next && open) history.back();
		}
	}
	{cards}
	{loading}
	{failed}
	onretry={() => void loadCards()}
	onCloseAutoFocus={restoreFocus}
/>
