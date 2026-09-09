<script lang="ts">
	let { heading, description }: { heading: string; description?: string } = $props();
</script>

<div class="daynight-about-heading">
	<h2>{heading}</h2>
	{#if description}<p>{description}</p>{/if}
</div>

<style>
	.daynight-about-heading {
		margin-bottom: 24px;
		text-align: center;
	}
	.daynight-about-heading h2 {
		margin: 0;
		color: var(--bc-ink);
		font-size: 30px;
		font-weight: 650;
		line-height: 1.2;
	}
	.daynight-about-heading p {
		margin: 10px auto 0;
		max-width: 760px;
		color: #59616b;
		font-size: 16px;
		line-height: 1.5;
	}
	@media (max-width: 767px) {
		.daynight-about-heading h2 {
			font-size: 24px;
		}
		.daynight-about-heading p {
			font-size: 15px;
		}
	}
</style>
