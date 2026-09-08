<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroPageBanner } from '$lib/auxero/page-banner';

	type PageBannerCta = {
		className?: string;
		href: string;
		label: string;
	};

	let { banner, cta }: { banner: AuxeroPageBanner; cta?: PageBannerCta } = $props();
</script>

<section
	class="daynight-inventory-banner daynight-page-banner"
	style:--page-banner-image={`url("${banner.image}")`}
>
	<div class="container">
		<div class="daynight-inventory-banner__content daynight-page-banner__content">
			<p class="daynight-inventory-banner__eyebrow daynight-page-banner__eyebrow">
				{banner.eyebrow}
			</p>
			<h1>{banner.title}</h1>
			<p>{banner.description}</p>
			{#if banner.actions?.length}
				<div class="daynight-page-banner__actions">
					{#each banner.actions as action (action.href)}
						<a
							href={resolve(action.href as '/')}
							class={[
								'btn btn-large font-weight-600',
								action.variant === 'secondary'
									? 'btn-line-style-2 daynight-page-banner__secondary'
									: 'btn-primary'
							]}
						>
							{action.label}
						</a>
					{/each}
				</div>
			{:else if cta}
				<div class="daynight-page-banner__actions">
					<a
						href={resolve(cta.href as '/')}
						class={cta.className ?? 'btn btn-primary btn-large font-weight-600 max-w-min'}
						>{cta.label}</a
					>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.daynight-page-banner {
		display: flex;
		min-height: 218px;
		align-items: center;
		background-image:
			linear-gradient(
				90deg,
				rgb(9 10 10 / 0.7) 0%,
				rgb(9 10 10 / 0.36) 44%,
				rgb(9 10 10 / 0.06) 78%
			),
			var(--page-banner-image);
		background-position: center right;
		background-size: cover;
	}

	.daynight-page-banner__content {
		max-width: 640px;
		padding: 34px 0;
	}

	.daynight-page-banner__eyebrow {
		margin-bottom: 8px;
		color: #ffffff;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.daynight-page-banner h1 {
		margin: 0 0 8px;
		color: #fff;
		font-size: 44px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.daynight-page-banner p:not(.daynight-page-banner__eyebrow) {
		max-width: 620px;
		margin: 0;
		color: rgb(255 255 255 / 0.82);
		font-size: 16px;
		line-height: 24px;
	}

	.daynight-page-banner__actions {
		display: flex;
		margin-top: 22px;
		gap: 12px;
		flex-wrap: wrap;
	}

	.daynight-page-banner__actions :global(.btn) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease !important;
	}

	.daynight-page-banner__actions :global(.btn::before),
	.daynight-page-banner__actions :global(.btn::after) {
		display: none !important;
		content: none !important;
		transform: none !important;
		transition: none !important;
	}

	.daynight-page-banner__actions :global(.btn.btn-primary) {
		border-color: var(--bc-accent) !important;
		background: var(--bc-accent) !important;
		color: #ffffff !important;
	}

	.daynight-page-banner__actions :global(.btn.btn-primary:focus-visible) {
		border-color: #ffffff !important;
		background: #ffffff !important;
		color: #1c1c1c !important;
	}

	.daynight-page-banner__secondary {
		border-color: rgb(255 255 255 / 0.72) !important;
		color: #ffffff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-page-banner__actions :global(.btn.btn-primary:hover) {
			border-color: #ffffff !important;
			background: #ffffff !important;
			color: #1c1c1c !important;
		}

		.daynight-page-banner__secondary:hover {
			border-color: #ffffff !important;
			background: #ffffff !important;
			color: #1c1c1c !important;
		}
	}

	@media (max-width: 767px) {
		.daynight-page-banner {
			min-height: 164px;
			background-position: 62% center;
		}

		.daynight-page-banner__content {
			padding: 26px 0;
		}

		.daynight-page-banner h1 {
			font-size: 32px;
		}

		.daynight-page-banner p:not(.daynight-page-banner__eyebrow) {
			font-size: 14px;
			line-height: 22px;
		}

		.daynight-page-banner__eyebrow {
			font-size: 12px;
			letter-spacing: 0.04em;
		}
	}
</style>
