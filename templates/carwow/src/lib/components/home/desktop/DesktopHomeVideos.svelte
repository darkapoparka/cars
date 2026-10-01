<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
	import Play from '@lucide/svelte/icons/play';
	import X from '@lucide/svelte/icons/x';
	import { tick } from 'svelte';
	const sectionTitle = $derived(i18n.t('pattern.a68a6b88cee2', { v0: daynightSite.shortName }));
	let activeVideo = $state<string | null>(null);
	let triggerCard: HTMLElement | null = null;
	async function stop() {
		activeVideo = null;
		await tick();
		triggerCard?.querySelector<HTMLButtonElement>('.home-video__play')?.focus();
	}
</script>

<section class="home-videos daynight-home-section" aria-label={sectionTitle}>
	<div class="daynight-home-container home-videos__panel">
		<DesktopSectionHeading
			title={sectionTitle}
			href={i18n.href(youtubeChannelUrl)}
			label={i18n.t('copy.48ed41283c9d')}
		>
			{#snippet titleContent()}
				<span class="home-videos__title"
					>{sectionTitle.replace(/\s+YouTube$/, '')}
					<img
						src={i18n.asset('/assets/brands/youtube-logo.png')}
						alt={i18n.t('copy.fb7accfff8c6')}
						width="138"
						height="46"
					/></span
				>
			{/snippet}
		</DesktopSectionHeading>
		<div class="home-videos__grid">
			{#each homeVideos as video (video.id)}
				<article class="home-video">
					<div class="home-video__image">
						{#if activeVideo === video.id}
							<iframe
								src={i18n.asset(
									`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&hl=bg`
								)}
								title={i18n.text(video.title)}
								width="480"
								height="270"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin"
								allowfullscreen
							></iframe>
							<button
								type="button"
								class="home-video__close"
								onclick={stop}
								aria-label={i18n.t('pattern.a582794b4e06', { v0: i18n.text(video.title) })}
								><X size={20} /></button
							>
						{:else}
							<button
								type="button"
								class="home-video__play"
								onclick={(event) => {
									triggerCard = event.currentTarget.closest('.home-video');
									activeVideo = video.id;
								}}
								aria-label={i18n.t('pattern.23e9e4cc63e8', { v0: i18n.text(video.title) })}
							>
								<img
									src={i18n.asset(video.thumbnail)}
									alt=""
									width="480"
									height="270"
									loading="lazy"
									decoding="async"
								/>
								<span class="home-video__playmark" aria-hidden="true"
									><Play size={24} fill="currentColor" /></span
								>
								<span class="home-video__duration">{video.duration}</span>
							</button>
						{/if}
					</div>
					<h3>{i18n.text(video.title)}</h3>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.home-videos {
		padding: 0 0 48px;
	}
	.home-videos__panel {
		padding: 28px;
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		background: #fff;
	}
	.home-videos__title {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font: inherit;
		color: inherit;
	}
	.home-videos__title img {
		display: block;
		width: 138px;
		height: 46px;
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
		background: #24282c;
		position: relative;
	}
	.home-video h3 {
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.4 var(--sa-font);
		padding: 14px 0 0;
		color: var(--sa-ink);
		margin: 0;
	}
	.home-video__play {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		cursor: pointer;
		color: #fff;
		background: #171b1e;
	}
	.home-video__play img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.home-video__playmark {
		color: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #171b1e;
	}
	.home-video__playmark :global(svg),
	.home-video__playmark :global(svg *) {
		color: inherit;
		stroke: currentColor;
	}
	.home-video__play:hover .home-video__playmark {
		background: var(--sa-red);
	}
	.home-video__duration {
		color: #fff;
		position: absolute;
		right: 12px;
		bottom: 12px;
		padding: 4px 8px;
		border-radius: 6px;
		background: #171b1e;
		font: var(--sa-weight-medium) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.home-video__close {
		position: absolute;
		right: 12px;
		top: 12px;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 50%;
		background: #fff;
		color: #171b1e;
		cursor: pointer;
	}
	.home-video__image iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
