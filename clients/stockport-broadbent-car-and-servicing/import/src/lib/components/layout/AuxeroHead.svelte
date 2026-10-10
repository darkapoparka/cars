<script lang="ts">
	import type { AuxeroHeadAssets } from '$lib/auxero/page-document';

	type Props = {
		assets?: AuxeroHeadAssets;
		title?: string;
	};

	let { assets, title }: Props = $props();

	const stableStylesheetHrefs = new Set([
		'/assets/scss/swiper/swiper-bundle.min.css',
		'/assets/app.css'
	]);
	const links = $derived(
		(assets?.links ?? []).filter(
			(link) => !(link.rel.toLowerCase() === 'stylesheet' && stableStylesheetHrefs.has(link.href))
		)
	);
	const meta = $derived(assets?.meta ?? []);
	const styles = $derived(assets?.styles ?? []);
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
	{#each meta as item (item.id)}
		<meta
			name={item.name}
			property={item.property}
			http-equiv={item.httpEquiv}
			content={item.content}
		/>
	{/each}
	{#each links as link (link.id)}
		<link
			rel={link.rel}
			href={link.href}
			as={link.as}
			type={link.type}
			media={link.media}
			sizes={link.sizes}
			crossorigin={link.crossorigin}
			fetchpriority={link.fetchPriority}
			referrerpolicy={link.referrerpolicy}
		/>
	{/each}
	{#each styles as style (style.id)}
		<svelte:element this={'style'} data-auxero-head-style={style.id}>
			{style.css}
		</svelte:element>
	{/each}
</svelte:head>
