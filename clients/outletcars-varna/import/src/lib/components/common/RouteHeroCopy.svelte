<script lang="ts">
	let {
		labelledby,
		title,
		mobileTitle = title,
		mobileDescription
	}: {
		labelledby: string;
		title: string;
		mobileTitle?: string;
		mobileDescription?: string;
	} = $props();
</script>

<div class="daynight-route-hero-copy">
	<h1 id={labelledby}>
		<span class="desktop-title">{title}</span><span class="mobile-title">{mobileTitle}</span>
	</h1>
	{#if mobileDescription}<p class="mobile-description">{mobileDescription}</p>{/if}
</div>

<style>
	.daynight-route-hero-copy {
		text-align: center;
	}
	.daynight-route-hero-copy h1 {
		margin: 0;
		color: var(--daynight-route-hero-heading, #fff);
		font-family: var(--bc-font-heading);
		font-size: 40px;
		font-weight: 700;
		line-height: 48px;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.mobile-title,
	.mobile-description {
		display: none;
	}
	@media (max-width: 767px) {
		.desktop-title {
			display: none;
		}
		.mobile-title {
			display: inline;
		}
		.mobile-description {
			display: block;
			max-width: 34rem;
			margin: 16px auto 0;
			font-size: 15px;
			line-height: 22px;
			font-weight: 500;
		}
		.daynight-route-hero-copy h1 {
			max-width: 320px;
			margin-inline: auto;
			font-size: clamp(32px, 9vw, 38px);
			line-height: 1.05;
		}
	}
</style>
