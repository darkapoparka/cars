<script lang="ts">
	import type { AboutVideo } from '$lib/data/about-videos';
	import YouTubeSection from '$lib/components/common/YouTubeSection.svelte';
	let { videos }: { videos: AboutVideo[] } = $props();
</script>

<YouTubeSection {videos} />
