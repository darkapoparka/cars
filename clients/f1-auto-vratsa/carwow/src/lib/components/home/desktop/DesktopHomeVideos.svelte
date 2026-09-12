<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
</script>

<section class="home-videos" aria-label="Снимки от обявите">
	<div class="daynight-home-container">
		<DesktopSectionHeading title="Снимки от обявите" href={youtubeChannelUrl} label="Всички автомобили">
			{#snippet titleContent()}
				<span class="home-videos__title">Снимки от обявите</span>
			{/snippet}
		</DesktopSectionHeading>
		<div class="home-videos__grid">
			{#each homeVideos as video (video.id)}
				<article class="home-video">
					<div class="home-video__image">
						<a href={video.url} aria-label={`Снимки и данни за ${video.title}`}><img src={video.thumbnail} alt={video.title} width="480" height="270" loading="lazy" /></a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
.home-video__image a{display:block;width:100%;height:100%}.home-video__image img{display:block;width:100%;height:100%;object-fit:cover}
	.home-videos { background: #f5f6f7; padding: 40px 0; }
	.home-videos__title { display: inline-flex; align-items: center; gap: 12px; font: inherit !important; color: inherit !important; }
	.home-videos__title img { display: block; width: 186px; height: 62px; margin-block: -9px; object-fit: contain; }
	.home-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.home-video { border-radius: 12px; overflow: hidden; }
	.home-video__image { aspect-ratio: 16 / 9; min-height: 200px; background: #24282c; }
	.home-video__image iframe { display: block; width: 100%; height: 100%; min-height: 200px; border: 0; }
</style>
