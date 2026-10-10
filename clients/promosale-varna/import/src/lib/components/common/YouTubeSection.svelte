<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import { assetHref } from '$lib/utils/assets';
	import { localizedCopy } from '$lib/content/localized';
	import { site } from '$lib/config/site';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Play from '@lucide/svelte/icons/play';
	import type { AboutVideo } from '$lib/data/about-videos';

	let {
		videos,
		english = false,
		channelHref = '',
		mobileHomeTitle = ''
	}: {
		videos: AboutVideo[];
		english?: boolean;
		channelHref?: string;
		mobileHomeTitle?: string;
	} = $props();
	let activeVideo = $state<string | null>(null);
	const focusPlayer = (element: HTMLIFrameElement) => element.focus();
	const selectedVideos = $derived(
		localizedCopy(videos, english ? 'en' : 'bg')
			.filter((video) => /^[\w-]{11}$/.test(video.id))
			.slice(0, 3)
	);
</script>

{#if selectedVideos.length}
	<section
		class="daynight-youtube"
		class:daynight-youtube--home={Boolean(mobileHomeTitle)}
		aria-label={site.identity.name + (english ? ' on YouTube' : ' в YouTube')}
	>
		<div class="site-container">
			<div class="daynight-youtube__heading">
				{#if mobileHomeTitle}
					<h2 class="youtube-home-title">
						{mobileHomeTitle}<span
							><svg width="36" height="25" viewBox="0 0 36 25" aria-hidden="true"
								><rect width="36" height="25" rx="7" fill="#ff0033" /><path
									d="m15 7 10 5.5L15 18Z"
									fill="white"
								/></svg
							>YouTube</span
						>
					</h2>
				{/if}
				<h2>
					<span class="youtube-dealer">{site.identity.name}</span><span class="youtube-preposition"
						>{english ? 'on' : 'в'}</span
					>
					<span
						><svg width="36" height="25" viewBox="0 0 36 25" aria-hidden="true"
							><rect width="36" height="25" rx="7" fill="#ff0033" /><path
								d="m15 7 10 5.5L15 18Z"
								fill="white"
							/></svg
						>YouTube</span
					>
				</h2>
			</div>
			<div class="daynight-youtube__grid">
				{#each selectedVideos as video (video.id)}
					<div class="daynight-youtube__video">
						{#if activeVideo === video.id}
							<iframe
								{@attach focusPlayer}
								src={assetHref(
									`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
								)}
								title={video.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
								referrerpolicy="strict-origin-when-cross-origin"
							></iframe>
						{:else}
							<a
								class="daynight-youtube__poster"
								href={linkHref(`https://www.youtube.com/watch?v=${video.id}`)}
								target="_blank"
								rel="noopener noreferrer"
								onclick={(event) => {
									if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
									event.preventDefault();
									activeVideo = video.id;
								}}
							>
								<img
									src={assetHref(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)}
									alt=""
									width="480"
									height="360"
									loading="lazy"
								/>
								<span class="daynight-youtube__title">{video.title}</span>
								<span class="daynight-youtube__play"
									><Play size={25} fill="currentColor" aria-hidden="true" /></span
								>
								<span class="daynight-youtube__watch"
									>{english ? 'Watch on' : 'Гледай в'} YouTube <ArrowRight
										size={16}
										aria-hidden="true"
									/></span
								>
							</a>
						{/if}
					</div>
				{/each}
				{#if channelHref}
					<a
						class="daynight-youtube__channel"
						href={linkHref(channelHref)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Play size={28} aria-hidden="true" />
						<strong>{english ? 'View channel' : 'Виж канала'}</strong>
						<ArrowRight size={20} aria-hidden="true" />
					</a>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	.youtube-home-title {
		display: none;
	}
	.daynight-youtube__channel {
		display: none;
	}
	.daynight-youtube {
		padding-block: 32px;
		background: var(--bc-bg);
	}
	.daynight-youtube__heading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		margin-bottom: 24px;
	}
	h2 {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-desktop-section-title);
		line-height: 1.2;
		font-weight: var(--bc-weight-heading);
		letter-spacing: -0.025em;
	}
	h2 span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.daynight-youtube__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.daynight-youtube__video {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 12px;
		background: #1c1c1c;
	}
	.daynight-youtube__poster {
		position: absolute;
		inset: 0;
		display: block;
		color: #fff;
	}
	.daynight-youtube__poster img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.daynight-youtube__poster::after {
		position: absolute;
		inset: 0;
		content: '';
		background: linear-gradient(
			180deg,
			rgb(0 0 0 / 0.6),
			transparent 35%,
			transparent 60%,
			rgb(0 0 0 / 0.65)
		);
	}
	.daynight-youtube__title {
		position: absolute;
		z-index: 1;
		top: 12px;
		left: 14px;
		right: 14px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 16px;
		font-weight: 600;
	}
	.daynight-youtube__play {
		position: absolute;
		z-index: 1;
		inset: 0;
		display: grid;
		place-items: center;
		width: 64px;
		height: 44px;
		margin: auto;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #fff;
	}
	.daynight-youtube__watch {
		position: absolute;
		z-index: 1;
		bottom: 12px;
		right: 14px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 600;
	}
	iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	a:focus-visible {
		outline: 3px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.daynight-youtube__poster:focus-visible {
		outline-color: #fff;
		outline-offset: -4px;
	}
	.daynight-youtube__poster:hover .daynight-youtube__play {
		background: var(--bc-accent-hover);
	}
	@media (min-width: 768px) {
		h2 {
			font-family: var(--bc-font-body);
			font-weight: var(--bc-desktop-title-weight);
			line-height: var(--bc-desktop-section-leading);
		}
	}
	@media (max-width: 767px) {
		.daynight-youtube {
			padding-block: 12px;
		}

		.daynight-youtube > .site-container {
			background: var(--bc-surface-raised);
			border: 1px solid var(--bc-border);
			border-radius: 20px;
			padding: 20px 14px;
		}
		h2 .youtube-dealer {
			max-width: 100%;
			font-size: 0.875rem;
			color: var(--bc-ink);
		}
		h2 {
			gap: 6px;
		}
		h2 .youtube-preposition {
			font-size: 0.875rem;
		}
		.daynight-youtube__heading {
			gap: 12px;
			justify-content: flex-start;
			flex-wrap: wrap;
			margin-bottom: 16px;
		}
		h2 {
			font-size: 1.125rem;
		}
		h2 span {
			gap: 4px;
		}
		h2 svg {
			width: 24px;
			height: 17px;
		}
		.daynight-youtube__grid {
			grid-template-columns: none;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			padding-bottom: 8px;
			scrollbar-width: thin;
			scrollbar-color: var(--bc-border-strong) transparent;
			gap: 16px;
		}
		.daynight-youtube__video {
			scroll-snap-align: start;
		}
		.daynight-youtube__channel {
			display: flex;
			min-width: 0;
			aspect-ratio: 16 / 9;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 12px;
			border: 1px solid var(--bc-border);
			border-radius: 12px;
			background: var(--bc-surface-raised);
			padding: 16px;
			color: var(--bc-ink);
			font-size: 1rem;
			line-height: 1.375;
			text-align: center;
			text-decoration: none;
			scroll-snap-align: start;
		}
		.daynight-youtube__channel strong {
			overflow-wrap: anywhere;
		}
		.daynight-youtube__channel :global(svg) {
			flex: 0 0 auto;
		}
	}
	@media (max-width: 767.98px) {
		.daynight-youtube--home {
			padding-block: var(--bc-space-6) var(--bc-space-2);
		}
		.daynight-youtube--home > .site-container {
			background: transparent;
			border: 0;
			border-radius: 0;
			padding-block: 0;
			padding-inline: 0;
		}
		.daynight-youtube--home .daynight-youtube__heading {
			justify-content: space-between;
			flex-wrap: nowrap;
			margin-bottom: var(--bc-space-3);
		}
		.daynight-youtube--home h2:not(.youtube-home-title),
		.daynight-youtube--home .daynight-youtube__watch {
			display: none;
		}
		.daynight-youtube--home .youtube-home-title {
			display: flex;
			gap: var(--bc-space-2);
			font: var(--bc-mobile-home-section-font);
			letter-spacing: var(--bc-tracking-tight);
		}
		.daynight-youtube--home .youtube-home-title svg {
			width: 29px;
			height: 20px;
		}
		.daynight-youtube--home .youtube-home-title span {
			gap: 6px;
		}
		.daynight-youtube--home .daynight-youtube__grid {
			gap: var(--bc-space-3);
			scrollbar-width: none;
		}
		.daynight-youtube--home .daynight-youtube__video {
			aspect-ratio: auto;
			background: var(--bc-surface-raised);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-panel);
		}
		.daynight-youtube--home .daynight-youtube__poster {
			position: relative;
			color: var(--bc-ink);
			text-decoration: none;
		}
		.daynight-youtube--home .daynight-youtube__poster img {
			height: auto;
			aspect-ratio: 16 / 9;
		}
		.daynight-youtube--home .daynight-youtube__poster::after {
			display: none;
		}
		.daynight-youtube--home .daynight-youtube__title {
			position: static;
			display: block;
			padding: var(--bc-space-4);
			white-space: normal;
			font: var(--bc-weight-heading) var(--bc-mobile-label)/var(--bc-mobile-label-leading)
				var(--bc-font-body);
		}
		.daynight-youtube--home .daynight-youtube__play {
			top: 0;
			bottom: auto;
			height: var(--bc-control-height-standard);
			margin-top: calc((100cqw * 9 / 16 - var(--bc-control-height-standard)) / 2);
		}
		.daynight-youtube--home .daynight-youtube__play :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
		}
		.daynight-youtube--home .daynight-youtube__poster {
			container-type: inline-size;
		}
		.daynight-youtube--home iframe {
			aspect-ratio: 16 / 9;
			height: auto;
		}
	}
</style>
