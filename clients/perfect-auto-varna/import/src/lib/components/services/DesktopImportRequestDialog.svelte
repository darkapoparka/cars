<script lang="ts">
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import { routeParts } from '$lib/locale/core';
	import { importCriteriaFromParams } from '$lib/data/import-criteria';
	import { importEntryFromParams } from '$lib/domain/import-entry';
	import ImportRequestWizard from './ImportRequestWizard.svelte';

	const desktop = new MediaQuery('(min-width: 768px)', false);
	let open = $state(false);
	let entry = $state<{
		key: string;
		intent: 'listing' | 'source';
		step: 0 | 1;
		vehicle: string;
		criteria: ReturnType<typeof importCriteriaFromParams>;
	}>();
	let session = $state(0);
	let completed = false;
	let trigger: HTMLElement | null = null;

	function isImportEntry(url: URL) {
		const destination = routeParts(url.pathname);
		return (
			desktop.current &&
			url.origin === page.url.origin &&
			destination.path === '/import' &&
			(!destination.locale || destination.locale === page.data.locale) &&
			routeParts(page.url.pathname).path !== '/import'
		);
	}

	function showRequest(url: URL, opener: HTMLElement | null) {
		if (completed) {
			session += 1;
			completed = false;
		}
		trigger = opener;
		entry = {
			...importEntryFromParams(url.searchParams),
			vehicle: (url.searchParams.get('vehicle') ?? '').trim().slice(0, 2000),
			criteria: importCriteriaFromParams(url.searchParams)
		};
		open = true;
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
		const url = new URL(link.href, page.url);
		if (!isImportEntry(url)) return;
		trigger = link;
	}

	function rememberSubmit(event: SubmitEvent) {
		if (event.defaultPrevented || !(event.target instanceof HTMLFormElement)) return;
		const form = event.target;
		if (form.method.toLowerCase() !== 'get' || (form.target && form.target !== '_self')) return;
		const url = new URL(form.action, page.url);
		if (!isImportEntry(url)) return;
		trigger = (event.submitter as HTMLElement | null) ?? form.querySelector('button');
	}
	beforeNavigate((navigation) => {
		if (
			(navigation.type !== 'link' && navigation.type !== 'form') ||
			!navigation.to ||
			!isImportEntry(navigation.to.url)
		)
			return;
		navigation.cancel();
		showRequest(navigation.to.url, trigger);
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

<!-- Native links and GET forms remain the fallback; their own validation runs first. -->
<svelte:document onclickcapture={rememberLink} onsubmitcapture={rememberSubmit} />

{#if desktop.current && entry}
	{#key entry.key + session}
		<ImportRequestWizard
			initialIntent={entry.intent}
			initialVehicle={entry.vehicle}
			initialCriteria={entry.criteria}
			initialStep={entry.step}
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
