<script lang="ts">
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { consultants }: { consultants: AuxeroAgentCardData[] } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<section class="daynight-consultants">
	<div class="container">
		<AboutSectionHeader
			heading="Хората зад Day Night Auto"
			description="Личен контакт от първия въпрос до предаването на автомобила."
		/>

		<div class="daynight-consultants__grid">
			{#each consultants as consultant (consultant.slug)}
				<div class="daynight-consultants__item">
					<article class="bc-team-card">
						<div class="bc-team-card__media">
							<div
								class="bc-team-card__portrait"
								class:bc-team-card__portrait--kristian={consultant.slug === 'kristiyan-kirilov'}
							>
								{#if consultant.image}
									<img src={consultant.image} alt={consultant.name} loading="lazy" />
								{:else}
									<span class="bc-team-card__initials" aria-hidden="true"
										>{consultant.name
											.split(' ')
											.map((part) => part[0])
											.join('')}</span
									>
								{/if}
							</div>
							<div class="bc-team-card__actions">
								<a
									class="bc-team-card__chip"
									{...externalHref(consultant.phoneHref)}
									aria-label="Обади се на Day Night Auto"
								>
									<img src="/assets/icons/PhoneCall.svg" alt="" />
								</a>
								<a
									class="bc-team-card__chip"
									{...externalHref(consultant.emailHref)}
									aria-label="Имейл до Day Night Auto"
								>
									<img src="/assets/icons/input-telegram.svg" alt="" />
								</a>
								{#each consultant.socials.slice(0, 2) as social (social.label)}
									<a
										class="bc-team-card__chip"
										{...externalHref(social.href)}
										target="_blank"
										rel="noreferrer"
										aria-label={social.label}
									>
										<img src={`/assets/icons/${social.icon}`} alt="" />
									</a>
								{/each}
							</div>
						</div>
						<div class="bc-team-card__body">
							<h3 class="bc-team-card__name">{consultant.name}</h3>
							<p class="bc-team-card__role">{consultant.title}</p>
						</div>
					</article>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.daynight-consultants {
		background: var(--bc-bg);
		padding: 54px 0 62px;
	}

	.daynight-consultants__grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.daynight-consultants__item {
		min-width: 0;
	}

	.bc-team-card {
		display: flex;
		min-width: 0;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: var(--bc-surface);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-team-card:hover {
			border-color: #aeb5be;
			background: #ffffff;
		}
	}

	.bc-team-card__media {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 4 / 3;
		background: var(--bc-surface);
	}

	.bc-team-card__media::after {
		position: absolute;
		inset: auto 0 0;
		z-index: 1;
		height: 42%;
		background: linear-gradient(180deg, rgb(13 20 10 / 0), rgb(13 20 10 / 0.72));
		content: '';
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.16s ease;
	}

	.bc-team-card:focus-within .bc-team-card__media::after {
		opacity: 1;
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-team-card:hover .bc-team-card__media::after {
			opacity: 1;
		}
	}

	@media (hover: none) {
		.bc-team-card__media::after {
			opacity: 1;
		}
	}

	.bc-team-card__portrait {
		display: block;
		width: 100%;
		height: 100%;
	}

	.bc-team-card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 18%;
	}

	.bc-team-card__portrait--kristian img {
		position: absolute;
		width: 165%;
		height: 165%;
		max-width: none;
		left: -48%;
		top: 0;
		object-position: 60% top;
	}

	.bc-team-card__body {
		display: flex;
		min-width: 0;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 18px 16px 20px;
		text-align: center;
	}

	.bc-team-card__name {
		margin: 0;
		color: #1c1c1c;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.25;
		text-decoration: none !important;
		transition: color 0.2s ease;
	}

	.bc-team-card__name:focus-visible {
		color: #b9161c;
		text-decoration: none !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-team-card__name:hover {
			color: #b9161c;
			text-decoration: none !important;
		}
	}

	.bc-team-card__role {
		margin: 6px 0 0;
		color: #696665;
		font-size: 14px;
		line-height: 1.5;
	}

	.bc-team-card__actions {
		position: absolute;
		z-index: 2;
		right: 16px;
		bottom: 16px;
		left: 16px;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
		opacity: 0;
		pointer-events: none;
		transform: translateY(8px);
		transition:
			opacity 0.16s ease,
			transform 0.16s ease;
	}

	.bc-team-card:focus-within .bc-team-card__actions {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-team-card:hover .bc-team-card__actions {
			opacity: 1;
			pointer-events: auto;
			transform: translateY(0);
		}
	}

	@media (hover: none) {
		.bc-team-card__actions {
			opacity: 1;
			pointer-events: auto;
			transform: none;
		}
	}

	.bc-team-card__chip {
		display: inline-flex;
		width: 44px;
		height: 44px;
		border: 1px solid rgb(255 255 255 / 0.65);
		border-radius: 50%;
		background: rgb(255 255 255 / 0.82);
		backdrop-filter: blur(12px);
		align-items: center;
		justify-content: center;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.bc-team-card__chip img {
		width: 18px;
		height: 18px;
		opacity: 0.78;
		filter: brightness(0) saturate(100%);
		transition: opacity 0.2s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-team-card__chip:hover {
			border-color: #b9161c;
			background: #fff;
		}

		.bc-team-card__chip:hover img {
			opacity: 1;
		}
	}

	@media (max-width: 991px) {
		.daynight-consultants__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.daynight-consultants {
			padding: 38px 0 50px;
		}

		.daynight-consultants__grid {
			gap: 18px;
			grid-template-columns: 1fr;
			max-width: 460px;
		}

		.bc-team-card__actions {
			right: 14px;
			bottom: 14px;
			left: 14px;
			justify-content: center;
			opacity: 1;
			pointer-events: auto;
			transform: none;
		}

		.bc-team-card__media::after {
			opacity: 1;
		}
	}
	.bc-team-card__chip:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}
	@media (min-width: 768px) {
		.bc-team-card__media {
			height: 240px;
			aspect-ratio: auto;
		}
		.daynight-consultants {
			padding: 40px 0 32px;
		}
		.daynight-consultants__grid {
			max-width: none;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 24px;
		}
	}
	.daynight-consultants__grid {
		grid-template-columns: repeat(auto-fit, minmax(0, 320px));
		justify-content: center;
		margin-inline: auto;
	}
	.bc-team-card__portrait {
		display: grid;
		place-items: center;
		background: #e8e9eb;
	}
	.bc-team-card__initials {
		display: grid;
		place-items: center;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: #fff;
		color: #30343a;
		font-size: 40px;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		.bc-team-card__actions,
		.bc-team-card__media::after,
		.bc-team-card__chip {
			transition: none;
		}
	}
</style>
