<script lang="ts">
	import { tick } from 'svelte';
	import { ArrowUpRight, Play, X } from '@lucide/svelte';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import { eliqYouTubeChannel, eliqYouTubeVideos } from '$lib/data/eliqauto-media';

	let { compact = false, english = false }: { compact?: boolean; english?: boolean } = $props();
	const id = $props.id();
	const videos = $derived(eliqYouTubeVideos.slice(0, compact ? 2 : 3));
	let activeVideo = $state<string | null>(null);
	let player = $state<HTMLIFrameElement>();
	const triggers: Record<string, HTMLButtonElement> = {};
	const externalHref = (href: string) => ({ href });

	async function play(videoId: string) {
		activeVideo = videoId;
		await tick();
		player?.focus({ preventScroll: true });
	}

	async function stop(videoId: string) {
		activeVideo = null;
		await tick();
		triggers[videoId]?.focus({ preventScroll: true });
	}
</script>

<section
	class="eliqauto-videos"
	class:eliqauto-videos--compact={compact}
	aria-labelledby={`${id}-title`}
>
	<div class="container">
		<div class="video-heading">
			<div>
				<h2 id={`${id}-title`} class="video-brand-heading">
					<img
						class="video-dealer-logo"
						src={eliqautoAssets.logoLight}
						alt="ELIQ AUTO"
						width="1487"
						height="203"
						loading="lazy"
					/>
					<span>{english ? 'on' : 'в'}</span>
					<img
						class="video-youtube-logo"
						src="/assets/eliqauto/brand/youtube-logo-fullcolor.png"
						alt="YouTube"
						width="1705"
						height="573"
						loading="lazy"
					/>
				</h2>
				<p>
					{english ? 'Inside the showroom and behind the wheel.' : 'От шоурума до първото каране.'}
				</p>
			</div>
			<a
				{...externalHref(eliqYouTubeChannel)}
				target="_blank"
				rel="noreferrer"
				class="channel-link"
			>
				{english ? 'View channel' : 'Отвори канала'}
				<ArrowUpRight size={18} aria-hidden="true" />
			</a>
		</div>
		<div class="video-grid">
			{#each videos as video (video.id)}
				{@const title = english ? video.titleEn : video.title}
				<article class="video-card">
					{#if activeVideo === video.id}
						<iframe
							bind:this={player}
							class="video-media"
							src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
							{title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						></iframe>
					{:else}
						<button
							bind:this={triggers[video.id]}
							class="video-media video-poster"
							type="button"
							aria-label={`${english ? 'Play' : 'Пусни'}: ${title}`}
							onclick={() => play(video.id)}
						>
							<img
								src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
								alt=""
								width="480"
								height="360"
								loading="lazy"
								decoding="async"
							/>
							<span class="play-icon"
								><Play size={24} fill="currentColor" aria-hidden="true" /></span
							>
							<span class="duration">{video.duration}</span>
						</button>
					{/if}
					<h3>{title}</h3>
					<div class="video-actions">
						<a
							{...externalHref(`https://www.youtube.com/watch?v=${video.id}`)}
							target="_blank"
							rel="noreferrer"
							aria-label={`${english ? 'Watch on YouTube' : 'Гледай в YouTube'}: ${title}`}
						>
							{english ? 'Watch on YouTube' : 'Гледай в YouTube'}<ArrowUpRight
								size={16}
								aria-hidden="true"
							/>
						</a>
						{#if activeVideo === video.id}
							<button
								type="button"
								onclick={() => stop(video.id)}
								aria-label={`${english ? 'Close video' : 'Затвори видеото'}: ${title}`}
							>
								<X size={18} aria-hidden="true" />{english ? 'Close' : 'Затвори'}
							</button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.eliqauto-videos {
		padding-block: 32px;
		background: var(--bc-bg);
	}
	.video-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 24px;
	}
	.video-brand-heading {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: -8px 0;
		color: var(--bc-copy);
		font-size: 18px;
		font-weight: 400;
		line-height: 1;
	}
	.video-brand-heading img {
		display: block;
		height: auto;
		flex-shrink: 0;
	}
	.video-dealer-logo {
		width: 184px;
	}
	.video-youtube-logo {
		width: 164px;
	}
	.video-heading p {
		margin: 8px 0 0;
		color: var(--bc-copy);
		font-size: 16px;
		line-height: 1.5;
	}
	.channel-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 10px 16px;
		gap: 8px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}
	.video-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.eliqauto-videos--compact .video-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.video-card {
		min-width: 0;
	}
	.video-media {
		display: block;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		padding: 0;
		border: 0;
		border-radius: 8px;
		overflow: hidden;
		background: #18181b;
	}
	.video-poster {
		cursor: pointer;
	}
	.video-poster img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.play-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		display: grid;
		place-items: center;
		width: 56px;
		height: 40px;
		transform: translate(-50%, -50%);
		border-radius: 8px;
		background: #ff0033;
		color: white;
	}
	.duration {
		position: absolute;
		right: 8px;
		bottom: 8px;
		padding: 3px 6px;
		border-radius: 4px;
		background: #18181b;
		color: #fff;
		font-size: 14px;
		line-height: 1.3;
	}
	h3 {
		margin: 16px 0 0;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--bc-ink);
	}
	.video-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.video-actions a,
	.video-actions button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 4px 0;
		background: none;
		border: 0;
		color: var(--bc-copy);
		font: inherit;
		font-size: 14px;
		cursor: pointer;
	}
	a:focus-visible,
	button:focus-visible,
	iframe:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 4px;
	}
	@media (hover: hover) {
		.channel-link:hover {
			border-color: var(--bc-ink);
		}
		.video-actions a:hover,
		.video-actions button:hover {
			color: var(--bc-accent);
		}
		.video-poster:hover .play-icon {
			background: #d9002b;
		}
	}
	@media (max-width: 767px) {
		.eliqauto-videos {
			padding-block: 24px;
			background: #fff;
		}
		.video-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 16px;
		}
		.video-brand-heading {
			gap: 8px;
			font-size: 14px;
			margin-block: -4px;
		}
		.video-dealer-logo {
			width: 132px;
		}
		.video-youtube-logo {
			width: 124px;
		}
		.video-heading p {
			font-size: 14px;
		}
		.video-grid,
		.eliqauto-videos--compact .video-grid {
			display: flex;
			gap: 16px;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			padding: 4px 4px 12px;
			margin: -4px -4px 0;
		}
		.video-card {
			flex: 0 0 86%;
			scroll-snap-align: start;
		}
		h3 {
			margin-top: 12px;
			font-size: 17px;
		}
	}
</style>
