<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
</script>

<section class="home-videos" aria-label="Видео и представяне">
	<div class="daynight-home-container">
		<DesktopSectionHeading title="Видео и представяне" href={youtubeChannelUrl || undefined} label="Всички видеа">
			{#snippet titleContent()}
				<span class="home-videos__title">Видео и представяне</span>
			{/snippet}
		</DesktopSectionHeading>
		<div class="home-videos__grid">
      {#if homeVideos.length === 0}<article class="home-video"><p>Потвърден видео канал не е включен. Реалните снимки са в галериите на автомобилите.</p><a href="/inventory">Разгледай автомобилите</a></article>{/if}
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
	.home-videos__title img { display: block; width: 186px; height: 62px; margin-block: -9px; object-fit: contain; }
	.home-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.home-video { border-radius: 12px; overflow: hidden; }
	.home-video__image { aspect-ratio: 16 / 9; min-height: 200px; background: #24282c; }
	.home-video__image iframe { display: block; width: 100%; height: 100%; min-height: 200px; border: 0; }
</style>
