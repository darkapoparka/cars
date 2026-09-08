<script lang="ts">
	let { heading, description }: { heading: string; description?: string } = $props();
</script>

<header class="about-section-heading">
	<h2>{heading}</h2>
	{#if description}<p>{description}</p>{/if}
</header>

<style>
	.about-section-heading {
		margin: 0 auto 28px;
		text-align: center;
		max-width: 780px;
	}
	.about-section-heading h2 {
		margin: 0;
		color: var(--bc-ink);
		font-size: clamp(26px, 2.4vw, 34px);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.about-section-heading p {
		max-width: 72ch;
		margin: 12px auto 0;
		color: #62626b;
		font-size: 16px;
		line-height: 1.6;
	}
	@media (max-width: 767px) {
		.about-section-heading {
			margin-bottom: 20px;
		}
		.about-section-heading h2 {
			font-size: 24px;
		}
	}
</style>
