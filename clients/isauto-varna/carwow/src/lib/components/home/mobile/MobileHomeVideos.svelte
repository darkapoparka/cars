<script lang="ts">
	import { mobileImageSrc } from '$lib/data/mobile-media';
	import { daynightSite } from '$lib/data/daynight-site';
	import { ArrowUpRight, Play, X } from '@lucide/svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
	import { tick } from 'svelte';

	let activeVideo = $state<string | null>(null);
	let trigger: HTMLButtonElement | undefined;

	function play(id: string, event: MouseEvent) {
		trigger = event.currentTarget as HTMLButtonElement;
		activeVideo = id;
	}

	async function stop() {
		const previous = trigger;
		activeVideo = null;
		await tick();
		previous?.focus();
	}
</script>

<section class="mobile-home-videos" aria-labelledby="mobile-home-videos-title">
	<header class="mobile-home-videos__head">
		<div>
			<span class="mobile-home-videos__eyebrow">
				<img src="/assets/brands/youtube-mark.png" alt="" aria-hidden="true" />
				<span>YouTube</span>
			</span>
			<h2 id="mobile-home-videos-title">Гледай {daynightSite.shortName}</h2>
		</div>
		<a
			href={youtubeChannelUrl}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Всички видеа в YouTube"
		>
			<ArrowUpRight size={20} strokeWidth={2.4} />
		</a>
	</header>

	<div class="mobile-home-videos__rail">
		{#each homeVideos as video (video.id)}
			<article class="mobile-video-card">
				<div class="mobile-video-card__media">
					{#if activeVideo === video.id}
						<iframe
							src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&hl=bg`}
							title={video.title}
							allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
							allowfullscreen
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
						<button
							class="mobile-video-card__close"
							type="button"
							onclick={stop}
							aria-label={`Затвори видеото: ${video.title}`}
						>
							<X size={18} strokeWidth={2.5} />
						</button>
					{:else}
						<button
							class="mobile-video-card__play"
							type="button"
							onclick={(event) => play(video.id, event)}
							aria-label={`Пусни видеото: ${video.title}`}
						>
							<img
								src={mobileImageSrc(video.thumbnail)}
								alt=""
								width="720"
								height="404"
								loading="lazy"
								decoding="async"
							/>
							<span class="mobile-video-card__shade" aria-hidden="true"></span>
							<span class="mobile-video-card__playmark" aria-hidden="true"
								><Play size={20} fill="currentColor" /></span
							>
							<span class="mobile-video-card__duration">{video.duration}</span>
							<strong>{video.title}</strong>
						</button>
					{/if}
				</div>
			</article>
		{/each}

		<a
			class="mobile-video-card mobile-video-card--all"
			href={youtubeChannelUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="mobile-video-card--all__icon"><Play size={27} fill="currentColor" /></span>
			<strong>Всички видеа</strong>
			<span>Към канала <ArrowUpRight size={16} strokeWidth={2.4} /></span>
		</a>
	</div>
</section>

<style>
	.mobile-home-videos {
		display: grid;
		gap: 12px;
		margin-inline: var(--sa-mobile-gutter);
		border-radius: 16px;
		background: #111315;
		padding: 14px;
		color: #fff;
		overflow: hidden;
	}

	.mobile-home-videos__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 0 2px;
		color: #fff;
	}

	.mobile-home-videos__head > div {
		display: grid;
		gap: 4px;
	}

	.mobile-home-videos__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #ff3152 !important;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		text-transform: none;
	}

	.mobile-home-videos__eyebrow img {
		display: block;
		width: 28px;
		height: 21px;
		object-fit: contain;
	}

	.mobile-home-videos__eyebrow span {
		color: #fff !important;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-strong);
		letter-spacing: -0.01em;
	}

	.mobile-home-videos__head h2 {
		margin: 0;
		color: #fff !important;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mobile-home-videos__head > a {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 50%;
		color: #fff !important;
	}

	.mobile-home-videos__head > a :global(svg),
	.mobile-home-videos__head > a :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-home-videos__rail {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: calc(100% - 28px);
		gap: 10px;
		overflow-x: auto;
		margin-inline: 0;
		padding: 0 0 4px;
		scroll-padding-inline: 0;
		overscroll-behavior-inline: contain;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}

	.mobile-home-videos__rail::-webkit-scrollbar {
		display: none;
	}

	.mobile-video-card {
		display: block;
		min-width: 0;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 11px;
		background: #070809;
		scroll-snap-align: start;
	}

	.mobile-video-card__media {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #111315;
	}

	.mobile-video-card iframe,
	.mobile-video-card__play,
	.mobile-video-card__play img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.mobile-video-card iframe {
		border: 0;
	}

	.mobile-video-card__play {
		position: relative;
		border: 0;
		background: #111315;
		padding: 0;
		color: #fff;
		cursor: pointer;
		text-align: left;
	}

	.mobile-video-card__play img {
		object-fit: cover;
	}

	.mobile-video-card__shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 28%, rgba(0, 0, 0, 0.84) 100%);
	}

	.mobile-video-card__play strong {
		color: #fff !important;
		position: absolute;
		right: 12px;
		bottom: 11px;
		left: 12px;
		display: -webkit-box;
		overflow: hidden;
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-heading);
		line-height: 1.3;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.mobile-video-card__playmark {
		position: absolute;
		top: calc(50% - 22px);
		left: calc(50% - 28px);
		display: grid;
		width: 56px;
		height: 44px;
		place-items: center;
		border-radius: 12px;
		background: #e11d2e;
		color: #fff;
	}

	.mobile-video-card__playmark :global(svg),
	.mobile-video-card__playmark :global(svg *) {
		color: #fff !important;
		fill: #fff !important;
		stroke: #fff !important;
	}

	.mobile-video-card__duration {
		color: #fff !important;
		position: absolute;
		top: 10px;
		right: 10px;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.78);
		padding: 3px 6px;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}

	.mobile-video-card__close {
		position: absolute;
		top: 8px;
		right: 8px;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.34);
		border-radius: 50%;
		background: rgba(17, 19, 21, 0.92);
		color: #fff;
		cursor: pointer;
	}

	.mobile-video-card--all {
		display: flex;
		min-height: 178px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: #1a1d20;
		padding: 14px;
		color: #fff !important;
		text-align: center;
		text-decoration: none;
	}

	.mobile-video-card--all__icon {
		color: #e11d2e;
	}
	.mobile-video-card--all strong {
		color: #fff !important;
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-heading);
	}
	.mobile-video-card--all > span:last-child {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 6px;
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
	}

	.mobile-home-videos a:focus-visible,
	.mobile-home-videos button:focus-visible,
	.mobile-home-videos iframe:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 2px;
	}

	@media (max-width: 370px) {
		.mobile-home-videos {
			margin-inline: 12px;
			padding: 12px;
		}
		.mobile-home-videos__rail {
			margin-inline: 0;
			padding-inline: 0;
			scroll-padding-inline: 0;
		}
	}
</style>
