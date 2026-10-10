<script lang="ts">
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import { routeParts } from '$lib/locale/core';
	import SellCarWizard from '$lib/components/sell-your-car/SellCarWizard.svelte';

	const desktop = new MediaQuery('(min-width: 768px)', false);
	let open = $state(false);
	let entry = $state<{ key: string; vin: string; manual: boolean }>();
	let session = $state(0);
	let completed = false;
	let trigger: HTMLElement | null = null;

	function isSellEntry(url: URL) {
		const destination = routeParts(url.pathname);
		return (
			desktop.current &&
			url.origin === page.url.origin &&
			destination.path === '/sell-your-car' &&
			(!destination.locale || destination.locale === page.data.locale) &&
			routeParts(page.url.pathname).path !== '/sell-your-car'
		);
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
		if (isSellEntry(new URL(link.href, page.url))) trigger = link;
	}

	function rememberSubmit(event: SubmitEvent) {
		if (event.defaultPrevented || !(event.target instanceof HTMLFormElement)) return;
		const form = event.target;
		if (form.method.toLowerCase() !== 'get' || (form.target && form.target !== '_self')) return;
		if (isSellEntry(new URL(form.action, page.url)))
			trigger = (event.submitter as HTMLElement | null) ?? form.querySelector('button');
	}

	beforeNavigate((navigation) => {
		if (
			(navigation.type !== 'link' && navigation.type !== 'form') ||
			!navigation.to ||
			!isSellEntry(navigation.to.url)
		)
			return;
		navigation.cancel();
		if (completed) {
			session += 1;
			completed = false;
		}
		const params = navigation.to.url.searchParams;
		const vin = (params.get('vin') ?? '').trim().slice(0, 17);
		const manual = params.get('mode') === 'manual';
		entry = { key: JSON.stringify({ vin, manual }), vin, manual };
		open = true;
	});

	function restoreFocus(event: Event) {
		event.preventDefault();
		if (desktop.current && trigger?.isConnected) trigger.focus({ preventScroll: true });
	}
	$effect(() => {
		if (!desktop.current) open = false;
	});
	$effect(() => {
		void page.url.href;
		open = false;
	});
</script>

<!-- Preserve native links and GET validation; enhance only the desktop handoff. -->
<svelte:document onclickcapture={rememberLink} onsubmitcapture={rememberSubmit} />

{#if desktop.current && entry}
	{#key entry.key + session}
		<SellCarWizard
			initial={{ vin: entry.vin }}
			manualEntry={entry.manual}
			embedded
			dialog
			bind:open
			onCloseAutoFocus={restoreFocus}
			onclose={() => {
				completed = true;
				open = false;
			}}
		/>
	{/key}
{/if}
