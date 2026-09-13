<script lang="ts">
	import { ArrowRight, Play } from '@lucide/svelte';
	import type { AboutVideo } from '$lib/data/about-videos';

	let { videos, english = false }: { videos: AboutVideo[]; english?: boolean } = $props();
	let activeVideo = $state<string | null>(null);
	const focusPlayer = (element: HTMLIFrameElement) => element.focus();
	const selectedVideos = $derived(
		videos.filter((video) => /^[\w-]{11}$/.test(video.id)).slice(0, 3)
	);
</script>

{#if selectedVideos.length}
	<section class="daynight-youtube" aria-label="Day Night Auto в YouTube">
		<div class="container">
			<div class="daynight-youtube__heading">
				<h2>
					Day Night Auto {english ? 'on' : 'в'}
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
								src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
								title={video.title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
								referrerpolicy="strict-origin-when-cross-origin"
							></iframe>
						{:else}
							<a
								class="daynight-youtube__poster"
								href={`https://www.youtube.com/watch?v=${video.id}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${english ? 'Play' : 'Пусни'}: ${video.title}`}
								onclick={(event) => {
									if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
									event.preventDefault();
									activeVideo = video.id;
								}}
							>
								<img
									src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
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
			</div>
		</div>
	</section>
{/if}

<style>
	.daynight-youtube {
		padding-block: 32px;
		background: var(--bc-bg);
	}
	.daynight-youtube__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		font-size: 30px;
		line-height: 1.2;
		font-weight: 650;
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
		background: #ff0033;
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
		background: #d9002b;
	}
	@media (max-width: 767px) {
		.daynight-youtube {
			padding-block: 24px;
		}
		.daynight-youtube__heading {
			gap: 12px;
			flex-wrap: wrap;
			margin-bottom: 16px;
		}
		h2 {
			font-size: 24px;
		}
		.daynight-youtube__grid {
			grid-template-columns: none;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			gap: 16px;
		}
		.daynight-youtube__video {
			scroll-snap-align: start;
		}
	}
</style>
