<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from './AuxeroPageShell.svelte';
	import '$lib/components/account/dashlite-dashboard.css';

	type Props = {
		afterHtml: string;
		beforeHtml: string;
		children: Snippet;
		pageDocument: AuxeroPageDocument;
		preserveDetailsPrefix?: boolean;
		title?: string;
	};

	let {
		afterHtml,
		beforeHtml,
		children,
		pageDocument,
		preserveDetailsPrefix = true,
		title
	}: Props = $props();

	const containerOpenTag = '<div class="dashboard-container">';
	const contentOpenTag = '<div class="dashboard-content">';
	const innerOpenTag = '<div class="dashboard-content--inner">';
	const detailsOpenTag = '<div class="dashboard-content--details">';

	let dashboardShell = $derived.by(() => {
		const containerStart = beforeHtml.lastIndexOf(containerOpenTag);

		if (containerStart < 0) return undefined;

		const contentStart = beforeHtml.indexOf(contentOpenTag, containerStart);

		if (contentStart < 0) return undefined;

		const innerStart = beforeHtml.indexOf(innerOpenTag, contentStart);
		const headerStart = contentStart + contentOpenTag.length;
		const headerEnd = innerStart < 0 ? beforeHtml.length : innerStart;
		const detailsStart = innerStart < 0 ? -1 : beforeHtml.indexOf(detailsOpenTag, innerStart);
		const innerPrefixStart = innerStart < 0 ? -1 : innerStart + innerOpenTag.length;
		const innerPrefixEnd = detailsStart < 0 ? beforeHtml.length : detailsStart;
		const detailsPrefixStart = detailsStart < 0 ? -1 : detailsStart + detailsOpenTag.length;
		const innerPrefixHtml =
			innerPrefixStart < 0 ? '' : beforeHtml.slice(innerPrefixStart, innerPrefixEnd);

		return {
			afterHtml: afterHtml.replace(/^(?:\s*<\/div>){1,4}/, ''),
			beforeHtml: beforeHtml.slice(0, containerStart),
			detailsPrefixHtml:
				preserveDetailsPrefix && detailsPrefixStart >= 0
					? beforeHtml.slice(detailsPrefixStart)
					: '',
			headerHtml: beforeHtml.slice(headerStart, headerEnd),
			hasInnerPrefix: innerPrefixHtml.trim().length > 0,
			innerPrefixHtml,
			sidebarHtml: beforeHtml.slice(containerStart + containerOpenTag.length, contentStart)
		};
	});
</script>

{#if dashboardShell}
	<AuxeroPageShell
		{pageDocument}
		beforeHtml={dashboardShell.beforeHtml}
		afterHtml={dashboardShell.afterHtml}
	>
		<div class="dashboard-container">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html dashboardShell.sidebarHtml}
			<div class="dashboard-content">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html dashboardShell.headerHtml}
				<div class="dashboard-content--inner">
					{#if dashboardShell.hasInnerPrefix}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html dashboardShell.innerPrefixHtml}
					{:else if title}
						<p class="h3 mb-30">{title}</p>
					{/if}
					<div class="dashboard-content--details" data-eliqauto-dashboard>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html dashboardShell.detailsPrefixHtml}
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	</AuxeroPageShell>
{:else}
	<AuxeroPageShell {pageDocument} {beforeHtml} {afterHtml}>
		{@render children()}
	</AuxeroPageShell>
{/if}
