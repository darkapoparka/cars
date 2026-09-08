<script lang="ts">
	import { resolve } from '$app/paths';
	import { homeTwoDealCards, type HomeTwoDealCard } from '$lib/auxero/home-two';
	import { CheckCircle2, ChevronRight, MapPin, Zap } from '@lucide/svelte';
</script>

<section class="home2-deals" aria-labelledby="home2-deals-title">
	<div class="home2-deals__inner">
		<div class="home2-section-title">
			<Zap size={54} fill="currentColor" strokeWidth={2.4} />
			<div>
				<h2 id="home2-deals-title">Премиум изборът е актуален</h2>
				<p>Популярни Day Night Auto предложения, готови за сравнение и оглед.</p>
			</div>
		</div>

		<div class="home2-deals__rail">
			{#snippet cardContent(card: HomeTwoDealCard)}
				<span class="home2-deal-card__top">
					<span>
						<strong>{card.title}</strong>
						<span class="home2-deal-card__description">{card.description}</span>
						<small>{card.meta}</small>
					</span>
					<span class="home2-deal-card__badge">{card.badge}</span>
				</span>

				<span class="home2-deal-card__saving">
					<CheckCircle2 size={15} strokeWidth={3} />
					{card.saving}
				</span>

				<span class="home2-deal-card__stock">
					<MapPin size={14} strokeWidth={2.8} />
					{card.stock}
				</span>

				<span class="home2-deal-card__image">
					<img
						src={card.image}
						alt=""
						loading="lazy"
						class={card.flip ? 'home2-deal-card__image--flip' : undefined}
					/>
				</span>

				<span class="home2-deal-card__footer">
					<span class="home2-deal-card__offer">
						<span class="home2-deal-card__price">
							<small>{card.priceLabel}</small>
							<b>{card.price}</b>
						</span>
						<span class="home2-deal-card__monthly">{card.monthly}</span>
					</span>
					<span class="home2-deal-card__arrow" aria-hidden="true">
						<ChevronRight size={22} strokeWidth={3} />
					</span>
				</span>
			{/snippet}

			{#each homeTwoDealCards as card (card.title)}
				{#if card.kind === 'vehicle'}
					<a
						href={resolve('/inventory/[slug]', { slug: card.slug })}
						class="home2-deal-card"
						style:--image-max={card.imageMax}
					>
						{@render cardContent(card)}
					</a>
				{:else}
					<a
						href={resolve('/import')}
						class="home2-deal-card home2-deal-card--service"
						style:--image-max={card.imageMax}
					>
						{@render cardContent(card)}
					</a>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.home2-deals {
		background: #f3f4f6;
		padding: 0 39px 66px;
	}

	.home2-deals__inner {
		margin: 0 auto;
		max-width: 1298px;
	}

	.home2-section-title {
		align-items: center;
		color: #E3062F;
		display: flex;
		gap: 14px;
		margin-bottom: 31px;
	}

	.home2-section-title :global(svg) {
		color: #E3062F !important;
		fill: #E3062F !important;
		stroke: #E3062F !important;
	}

	.home2-section-title h2 {
		color: #121214;
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-size: clamp(29px, 3vw, 42px);
		font-weight: 1000;
		letter-spacing: 0;
		line-height: 1.05;
		margin: 0;
	}

	.home2-section-title p {
		color: #3f3f46;
		font-size: 18px;
		font-weight: 600;
		margin: 8px 0 0;
	}

	.home2-deals__rail {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-deal-card {
		background: #dddbd7;
		border-radius: 8px;
		color: #121214;
		display: grid;
		grid-template-rows: auto auto auto 1fr auto;
		min-height: 398px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}

	.home2-deal-card::before {
		background: linear-gradient(180deg, rgb(255 255 255 / 0.44), rgb(255 255 255 / 0));
		content: '';
		height: 96px;
		inset: 0 0 auto;
		pointer-events: none;
		position: absolute;
	}

	.home2-deal-card--service {
		background: #dce4d6;
	}

	.home2-deal-card:hover {
		background: #d4d8d0;
		box-shadow: none;
		color: #121214;
		transform: none;
	}

	.home2-deal-card__top {
		align-items: flex-start;
		display: flex;
		gap: 12px;
		justify-content: space-between;
		min-height: 104px;
		position: relative;
		z-index: 1;
	}

	.home2-deal-card__top strong {
		color: #0f1115;
		display: -webkit-box;
		font-size: clamp(21px, 1.72vw, 25px);
		font-weight: 1000;
		line-clamp: 2;
		line-height: 1.02;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.home2-deal-card__description {
		color: #17181d;
		display: block;
		font-size: 14px;
		font-weight: 720;
		line-height: 1.22;
		margin-top: 8px;
		max-width: 300px;
	}

	.home2-deal-card__top small {
		color: #44464c;
		display: block;
		font-size: 12px;
		font-weight: 820;
		line-height: 1.2;
		margin-top: 7px;
	}

	.home2-deal-card__badge {
		background: #E3062F;
		border-radius: 5px;
		color: #111513;
		flex: 0 0 auto;
		font-size: 11px;
		font-weight: 1000;
		min-width: 82px;
		padding: 8px 9px;
		text-align: center;
		text-transform: uppercase;
	}

	.home2-deal-card__saving {
		align-items: center;
		background: #121316;
		border-radius: 4px;
		color: #ffffff;
		display: inline-flex;
		font-size: 13px;
		font-weight: 950;
		gap: 6px;
		line-height: 1.05;
		margin-top: 10px;
		max-width: calc(100% - 42px);
		padding: 5px 8px;
		position: relative;
		width: fit-content;
		z-index: 1;
	}

	.home2-deal-card__saving :global(svg) {
		color: #E3062F;
		stroke: currentColor !important;
	}

	.home2-deal-card__stock {
		align-items: center;
		color: #343840;
		display: inline-flex;
		font-size: 12px;
		font-weight: 800;
		gap: 5px;
		line-height: 1.1;
		margin-top: 8px;
		position: relative;
		width: fit-content;
		z-index: 1;
	}

	.home2-deal-card__stock :global(svg) {
		color: #E3062F;
		stroke: currentColor !important;
	}

	.home2-deal-card__image {
		align-items: flex-end;
		display: flex;
		justify-content: center;
		min-height: 150px;
		overflow: visible;
		padding: 5px 0 2px;
		position: relative;
	}

	.home2-deal-card__image::after {
		background: radial-gradient(ellipse at center, rgb(18 23 21 / 0.18), rgb(18 23 21 / 0) 68%);
		bottom: 14px;
		content: '';
		height: 18px;
		left: 15%;
		position: absolute;
		right: 15%;
	}

	.home2-deal-card__image img {
		filter: drop-shadow(0 13px 10px rgb(0 0 0 / 0.18));
		max-height: 158px;
		max-width: var(--image-max);
		object-fit: contain;
		position: relative;
		transform: none !important;
		z-index: 1;
	}

	.home2-deal-card__image img.home2-deal-card__image--flip {
		transform: scaleX(-1) !important;
	}

	.home2-deal-card__footer {
		align-items: end;
		display: grid;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) 50px;
		position: relative;
		z-index: 1;
	}

	.home2-deal-card__offer {
		display: grid;
		gap: 6px;
		justify-items: start;
		min-width: 0;
	}

	.home2-deal-card__price,
	.home2-deal-card__monthly {
		align-items: baseline;
		background: #ffffff;
		border-radius: 4px;
		color: #101115;
		display: inline-flex;
		font-size: 14px;
		font-weight: 760;
		gap: 5px;
		line-height: 1;
		min-height: 24px;
		padding: 0 9px;
		white-space: nowrap;
		width: fit-content;
	}

	.home2-deal-card__price small {
		color: #66706a;
		font-size: 12px;
		font-weight: 800;
	}

	.home2-deal-card__price b {
		color: #111318;
		font-size: 14px;
		font-weight: 1000;
	}

	.home2-deal-card__monthly {
		font-size: 13px;
		font-weight: 800;
	}

	.home2-deal-card__arrow {
		align-items: center;
		background: #121214;
		border-radius: 50%;
		color: #ffffff;
		display: inline-flex;
		height: 50px;
		justify-content: center;
		width: 50px;
	}

	.home2-deal-card__arrow :global(svg),
	.home2-deal-card__arrow :global(svg *) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	.home2-deal-card:hover .home2-deal-card__arrow {
		background: #E3062F;
		color: #121214;
	}

	.home2-deal-card:hover .home2-deal-card__arrow :global(svg),
	.home2-deal-card:hover .home2-deal-card__arrow :global(svg *) {
		color: #121214 !important;
		stroke: #121214 !important;
	}

	@media (max-width: 1100px) {
		.home2-deals__rail {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.home2-deals {
			padding-inline: 16px;
		}

		.home2-section-title {
			align-items: flex-start;
		}

		.home2-section-title h2 {
			font-size: 31px;
		}

		.home2-deals__rail {
			grid-template-columns: 1fr;
		}
	}
</style>
