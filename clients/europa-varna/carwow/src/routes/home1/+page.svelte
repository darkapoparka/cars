<script lang="ts">
	import HomePage from '$lib/components/home/HomePage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<HomePage
	home={data.home}
	homeBrandStrip={data.homeBrandStrip}
	desktopHome={data.desktopHome}
	mobileHome={data.mobileHome}
	initialViewport={data.initialViewport}
	heroToggle="segmented"
	desktopComposition="home1"
/>
