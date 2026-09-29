<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
</script>

<section
	class="home-videos"
	aria-label={i18n.t('pattern.a68a6b88cee2', { v0: daynightSite.shortName })}
>
	<div class="daynight-home-container">
		<DesktopSectionHeading
			title={i18n.t('pattern.a68a6b88cee2', { v0: daynightSite.shortName })}
			href={i18n.href(youtubeChannelUrl)}
			label={i18n.t('copy.48ed41283c9d')}
		>
			{#snippet titleContent()}
				<span class="home-videos__title"
					>{daynightSite.shortName}
					{i18n.t('copy.b8012cb642c8')}
					<img
						src={i18n.asset('/assets/brands/youtube-logo.png')}
						alt={i18n.t('copy.fb7accfff8c6')}
						width="186"
						height="62"
					/></span
				>
			{/snippet}
		</DesktopSectionHeading>
		<div class="home-videos__grid">
			{#each homeVideos as video (video.id)}
				<article class="home-video">
					<div class="home-video__image">
						<iframe
							src={i18n.asset(
								`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0&hl=bg`
							)}
							title={i18n.text(video.title)}
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
	.home-videos {
		background: #f5f6f7;
		padding: 40px 0;
	}
	.home-videos__title {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: inherit !important;
		color: inherit !important;
	}
	.home-videos__title img {
		display: block;
		width: 186px;
		height: 62px;
		margin-block: -9px;
		object-fit: contain;
	}
	.home-videos__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.home-video {
		border-radius: 12px;
		overflow: hidden;
	}
	.home-video__image {
		aspect-ratio: 16 / 9;
		min-height: 200px;
		background: #24282c;
	}
	.home-video__image iframe {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 200px;
		border: 0;
	}
</style>
