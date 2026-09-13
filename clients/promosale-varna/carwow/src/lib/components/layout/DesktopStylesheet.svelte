<script lang="ts">
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	import { DESKTOP_SHELL_MEDIA } from '$lib/config/viewport';
	import {
		desktopStylesheetBootstrap,
		installDesktopStylesheet,
		type DesktopStylesheet
	} from '$lib/client/desktop-stylesheet';

	let {
		id,
		href,
		placement = 'append'
	}: Pick<DesktopStylesheet, 'id' | 'href'> & {
		placement?: DesktopStylesheet['placement'];
	} = $props();
	const viewport = getViewportContext();
	const options = $derived({ id, href, placement, media: DESKTOP_SHELL_MEDIA });
	const bootstrap = $derived(desktopStylesheetBootstrap(options));

	// Covers client navigation AND crossing from mobile to desktop after hydration.
	$effect(() => {
		if (!viewport.mobile) installDesktopStylesheet(options);
	});
</script>

<svelte:head>
	<svelte:element this={'script'}>{bootstrap}</svelte:element>
</svelte:head>
