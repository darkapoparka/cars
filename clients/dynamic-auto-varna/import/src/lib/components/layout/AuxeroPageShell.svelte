<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroHead from '$lib/components/layout/AuxeroHead.svelte';
	import AuxeroRuntimeScripts from '$lib/components/layout/AuxeroRuntimeScripts.svelte';

	type Props = {
		afterHtml: string;
		beforeHtml: string;
		children: Snippet;
		pageDocument: AuxeroPageDocument;
		title?: string;
	};

	type WrapperShell = {
		afterChildrenHtml: string;
		afterWrapperHtml: string;
		beforeChildrenHtml: string;
		beforeWrapperHtml: string;
	};

	let { afterHtml, beforeHtml, children, pageDocument, title }: Props = $props();

	const wrapperOpenTag = '<div id="wrapper">';
	const resolvedTitle = $derived(
		title ?? pageDocument.headHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
	);
	const bodyClassScript = $derived(
		`document.body.className = ${JSON.stringify(pageDocument.bodyClass)};`
	);
	const scriptSourceHtml = $derived(`${beforeHtml}\n${afterHtml}`);

	const findWrapperCloseIndex = (html: string) => {
		// Local regex (not module-shared) so the derived has no shared mutable lastIndex state.
		const divTagPattern = /<\/?div\b[^>]*>/gi;

		let depth = 1;
		let match: RegExpExecArray | null;

		while ((match = divTagPattern.exec(html))) {
			depth += match[0].startsWith('</') ? -1 : 1;

			if (depth === 0) return match.index;
		}

		return -1;
	};

	let wrapperShell: WrapperShell | undefined = $derived.by(() => {
		const wrapperStart = beforeHtml.lastIndexOf(wrapperOpenTag);

		if (wrapperStart < 0) return undefined;

		const closeStart = findWrapperCloseIndex(afterHtml);

		if (closeStart < 0) return undefined;

		return {
			afterChildrenHtml: afterHtml.slice(0, closeStart),
			afterWrapperHtml: afterHtml.slice(closeStart + '</div>'.length),
			beforeChildrenHtml: beforeHtml.slice(wrapperStart + wrapperOpenTag.length),
			beforeWrapperHtml: beforeHtml.slice(0, wrapperStart)
		};
	});

	$effect(() => {
		document.body.className = pageDocument.bodyClass;
		if (resolvedTitle) {
			document.title = resolvedTitle;
		}
	});

	onMount(() => {
		window.dispatchEvent(new Event('daynight:svelte-mounted'));
	});
</script>

<AuxeroHead assets={pageDocument.headAssets} title={resolvedTitle} />
<svelte:element this={'script'}>
	{bodyClassScript}
</svelte:element>
{#if wrapperShell}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html wrapperShell.beforeWrapperHtml}
	<div id="wrapper">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html wrapperShell.beforeChildrenHtml}
		{@render children()}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html wrapperShell.afterChildrenHtml}
	</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html wrapperShell.afterWrapperHtml}
{:else}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html beforeHtml}
	{@render children()}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterHtml}
{/if}
<AuxeroRuntimeScripts html={scriptSourceHtml} pageKey={pageDocument.bodyClass} />
