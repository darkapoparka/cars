<script lang="ts">
	import { page } from '$app/state';
	import { dealer } from '$lib/data/dealer';

	const DEFAULT_TITLE = `${dealer.name} · ${dealer.city}`;
	const DEFAULT_DESCRIPTION = `${dealer.name} — ${dealer.stockNotice}`;
	const DEFAULT_OG_IMAGE = dealer.logo;

	let {
		title = DEFAULT_TITLE,
		description = DEFAULT_DESCRIPTION,
		ogImage = DEFAULT_OG_IMAGE
	}: {
		title?: string;
		description?: string;
		ogImage?: string;
	} = $props();

	const metaTitle = $derived(title || DEFAULT_TITLE);
	const metaDescription = $derived(description || DEFAULT_DESCRIPTION);
	const imagePath = $derived(ogImage || DEFAULT_OG_IMAGE);
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
		return url ? new URL(imagePath, url.origin).href : imagePath;
	});
	const imageType = $derived.by(() => {
		const extension = imagePath.split(/[?#]/)[0].split('.').pop()?.toLowerCase();
		return extension === 'svg' ? 'image/svg+xml'
			: extension === 'png' ? 'image/png'
			: extension === 'webp' ? 'image/webp'
			: extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : undefined;
	});
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="robots" content="noindex, nofollow" />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={DEFAULT_TITLE} />
	<meta property="og:locale" content="bg_BG" />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:image" content={absoluteImage} />
	{#if imageType}
		<meta property="og:image:type" content={imageType} />
	{/if}
	<meta property="og:image:alt" content={DEFAULT_TITLE} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
