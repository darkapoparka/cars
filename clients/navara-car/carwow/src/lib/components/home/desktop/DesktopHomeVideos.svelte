<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
</script>

<section class="home-videos" aria-label="Видеа на автокъщата">
	<div class="daynight-home-container">
		<DesktopSectionHeading title="Видеа на автокъщата" href={youtubeChannelUrl} label="Публикуван профил">
			{#snippet titleContent()}
				<span class="home-videos__title">Видеа на автокъщата</span>
			{/snippet}
		</DesktopSectionHeading>
		<p>Не е потвърден собствен видео канал на Навара кар в този преглед.</p>
		<div class="home-videos__grid">
			{#each homeVideos as video (video.id)}
				<article class="home-video">
					<div class="home-video__image">
						<iframe
							src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0&hl=bg`}
							title={video.title}
							width="480"
							height="270"
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						></iframe>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.home-videos { background: #f5f6f7; padding: 40px 0; }
	.home-videos__title { display: inline-flex; align-items: center; gap: 12px; font: inherit !important; color: inherit !important; }
	.home-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.home-video { border-radius: 12px; overflow: hidden; }
	.home-video__image { aspect-ratio: 16 / 9; min-height: 200px; background: #24282c; }
	.home-video__image iframe { display: block; width: 100%; height: 100%; min-height: 200px; border: 0; }
</style>
