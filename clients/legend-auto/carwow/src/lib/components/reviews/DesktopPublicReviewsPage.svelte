<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightReviews, type DayNightReview } from '$lib/data/daynight-reviews';

	type AssetHref = DayNightReview['avatar'];

	const reviews = daynightReviews;

	const starIndexes: number[] = [];

	function asset(path: AssetHref): AssetHref {
		return path;
	}
</script>

{#snippet starRow()}
	<div class="mb-16 flex items-center gap-4">
		{#each starIndexes as star (star)}
			<img src={asset('/assets/icons/star-6.svg')} alt="testimonior" />
		{/each}
	</div>
{/snippet}

{#snippet reviewCard(review: DayNightReview)}
	<div class="testimonior-box">
		{@render starRow()}
		<p class="testimonior-box--desc mb-16">
			{review.text}
		</p>
		<div class="testimonior-box--user">
			<img class="testimonior--img" src={asset(review.avatar)} alt="avatar" />
			<div class="testimonior-box--user-content">
				<p class="h5 title">{review.name}</p>
				<p class="desc">{review.label}</p>
			</div>
		</div>
	</div>
{/snippet}

<section class="background-light mb-32">
	<div class="container">
		<ul class="breadcrumb">
			<li>
				<a href={resolve('/')}>Начало</a>
			</li>
			<li>
				<img src={asset('/assets/icons/right.svg')} alt="chevron-right" />
			</li>
			<li>
				<span>Още</span>
			</li>
			<li>
				<img src={asset('/assets/icons/right.svg')} alt="chevron-right" />
			</li>
			<li>
				<span>Информация за покупката</span>
			</li>
		</ul>
	</div>
</section>

<section class="pb-100">
	<div class="container">
		<h2>Информация за покупката</h2>
		<div class="tf-spacing-style3"></div>

		<div class="lg-grid-cols-2 md-grid-cols-1 mb-40 grid grid-cols-3 gap-x-30 gap-y-38">
			{#each reviews as review (review.id)}
				{@render reviewCard(review)}
			{/each}
		</div>
	</div>
</section>
