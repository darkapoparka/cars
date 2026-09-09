<script lang="ts">
	import { page } from '$app/state';
	import { dealer } from '$lib/data/dealer';

	const DEFAULT_DESCRIPTION = dealer.stockNotice;
	const DEFAULT_OG_IMAGE = '/brand/logo.png';

	let {
		title,
		description = DEFAULT_DESCRIPTION,
		ogImage = DEFAULT_OG_IMAGE,
		ogType = 'website'
	}: {
		title: string;
		description?: string;
		ogImage?: string;
		ogType?: string;
	} = $props();

	const metaDescription = $derived(description || DEFAULT_DESCRIPTION);

	const currentUrl = () => {
		try {
			return page.url ?? null;
		} catch {
			return null;
		}
	};

	const canonical = $derived.by(() => {
		const url = currentUrl();
		return url ? url.origin + url.pathname : '';
	});

	const absoluteImage = $derived.by(() => {
		const url = currentUrl();
		return url ? new URL(ogImage, url.origin).href : ogImage;
	});

	const isDefaultOg = $derived(ogImage === DEFAULT_OG_IMAGE);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={metaDescription} />
	<meta name="robots" content="noindex, nofollow" />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={`${dealer.name} · ${dealer.city}`} />
	<meta property="og:locale" content="bg_BG" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={metaDescription} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:image" content={absoluteImage} />
	{#if isDefaultOg}
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:alt" content={`Лого концепция за демонстрацията на ${dealer.name}`} />
	{/if}

	<meta name="twitter:card" content={isDefaultOg ? 'summary' : 'summary_large_image'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
