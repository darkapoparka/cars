<script lang="ts">
	import { homeTwoReviews } from '$lib/auxero/home-two';
	import { CheckCircle2, Star, StarHalf } from '@lucide/svelte';

	const starIndexes = [0, 1, 2, 3, 4] as const;
</script>

<section class="home2-reviews" aria-labelledby="home2-reviews-title">
	<div class="home2-reviews__inner">
		<div class="home2-reviews__head">
			<div class="home2-section-title">
				<Star size={48} fill="currentColor" strokeWidth={1.8} />
				<div>
					<span>Отзиви от клиенти</span>
					<h2 id="home2-reviews-title">Какво оценяват клиентите</h2>
					<p>Проверка, документи, оглед и финансиране, обяснени преди следващата стъпка.</p>
				</div>
			</div>

			<div class="home2-review-score" aria-label="Оценка 4.9 от 5">
				<strong>4.9</strong>
				<span>
					<Star size={15} fill="currentColor" strokeWidth={2} />
					<Star size={15} fill="currentColor" strokeWidth={2} />
					<Star size={15} fill="currentColor" strokeWidth={2} />
					<Star size={15} fill="currentColor" strokeWidth={2} />
					<StarHalf size={15} fill="currentColor" strokeWidth={2} />
				</span>
				<small>средна оценка от локални отзиви</small>
			</div>
		</div>

		<div class="home2-review-grid">
			{#each homeTwoReviews as review (review.title)}
				<article class="home2-review">
					<div class="home2-review__stars" aria-label="5 звезди">
						{#each starIndexes as star (`${review.title}-${star}`)}
							<span>★</span>
						{/each}
						<small><CheckCircle2 size={13} /> Проверен</small>
					</div>
					<h3>{review.title}</h3>
					<p>{review.body}</p>
					<footer>{review.author}</footer>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.home2-reviews {
		background: #f3f4f6;
		padding: 0 39px 66px;
	}

	.home2-reviews__inner {
		margin: 0 auto;
		max-width: 1298px;
	}

	.home2-reviews__head {
		align-items: center;
		display: flex;
		gap: 28px;
		justify-content: space-between;
		margin-bottom: 26px;
	}

	.home2-section-title {
		align-items: center;
		color: #a51717;
		display: flex;
		gap: 14px;
		min-width: 0;
	}

	.home2-section-title :global(svg) {
		color: #a51717;
		fill: #a51717;
		stroke: #a51717;
	}

	.home2-section-title span {
		color: var(--bc-accent);
		display: block;
		font-size: 13px;
		font-weight: 1000;
		line-height: 1;
		margin-bottom: 9px;
		text-transform: uppercase;
	}

	.home2-section-title h2 {
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-weight: 1000;
		letter-spacing: 0;
		line-height: 1.05;
		margin: 0;
	}

	.home2-section-title h2 {
		color: #121214;
		font-size: clamp(30px, 2.75vw, 40px);
	}

	.home2-section-title p {
		color: #3f3f46;
		font-size: 17px;
		font-weight: 600;
		margin: 8px 0 0;
		max-width: 760px;
	}

	.home2-review-score {
		background: #ffffff;
		border: 1px solid #e3e6ea;
		border-radius: 8px;
		color: #121214;
		display: grid;
		flex: 0 0 224px;
		gap: 4px;
		padding: 15px 18px;
	}

	.home2-review-score strong {
		font-size: 30px;
		font-weight: 1000;
		line-height: 0.95;
	}

	.home2-review-score span {
		color: #02b67a;
		display: flex;
		gap: 2px;
	}

	.home2-review-score span :global(svg) {
		stroke: currentColor;
	}

	.home2-review-score small {
		color: #5b5a61;
		font-size: var(--bc-text-micro);
		font-weight: 800;
	}

	.home2-review-grid {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-review {
		background: #ffffff;
		border: 1px solid #e7e9ee;
		border-radius: 8px;
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		min-height: 194px;
		padding: 16px 17px;
	}

	.home2-review__stars {
		align-items: center;
		color: #ffffff;
		display: flex;
		gap: 2px;
	}

	.home2-review__stars span {
		background: #02b67a;
		display: grid;
		font-size: var(--bc-text-micro);
		height: 18px;
		line-height: 1;
		place-items: center;
		width: 18px;
	}

	.home2-review__stars small {
		align-items: center;
		color: #55545a;
		display: inline-flex;
		font-size: var(--bc-text-micro);
		gap: 3px;
		margin-left: 5px;
	}

	.home2-review__stars small :global(svg) {
		color: #02b67a;
		stroke: currentColor;
	}

	.home2-review h3 {
		color: #121214;
		font-size: 16px;
		font-weight: 950;
		margin: 13px 0 7px;
	}

	.home2-review p {
		color: #24242a;
		font-size: 14px;
		line-height: 1.35;
		margin: 0;
	}

	.home2-review footer {
		color: #59585f;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		margin-top: 20px;
	}

	@media (max-width: 1100px) {
		.home2-reviews__head {
			align-items: flex-start;
			flex-direction: column;
		}

		.home2-review-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home2-review-score {
			width: min(100%, 260px);
		}
	}

	@media (max-width: 760px) {
		.home2-reviews {
			padding-inline: 16px;
		}

		.home2-section-title {
			align-items: flex-start;
		}

		.home2-section-title h2 {
			font-size: 31px;
		}

		.home2-review-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
