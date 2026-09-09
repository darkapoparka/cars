<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehiclePill } from '$lib/auxero/home-five';
	import type { HomeTwoBudgetTile } from '$lib/auxero/home-two';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import {
		ArrowRight,
		BadgeEuro,
		Car,
		CheckCircle2,
		Euro,
		HeartHandshake,
		ShieldCheck,
		Sparkles,
		Truck,
		Zap
	} from '@lucide/svelte';

	let {
		budgetTiles,
		copy,
		pills
	}: {
		budgetTiles: HomeTwoBudgetTile[];
		copy: HomePageCopy;
		pills: HomeFiveVehiclePill[];
	} = $props();

	const primaryPills = $derived(pills.slice(0, 9));
	const pillIcons = [
		Car,
		HeartHandshake,
		BadgeEuro,
		ShieldCheck,
		Truck,
		Sparkles,
		Zap,
		Euro,
		CheckCircle2
	];

	const actionCards = $derived([
		{
			body: copy.actionBand.importBody,
			cta: copy.actionBand.importCta,
			href: '/services' as const,
			image: '/assets/daynight/home2/home2-action-import.webp',
			title: copy.actionBand.importTitle,
			tone: 'import'
		},
		{
			body: copy.actionBand.buyBody,
			cta: copy.actionBand.buyCta,
			href: '/contact' as const,
			image: '/assets/daynight/home2/home2-action-consultant.webp',
			title: copy.actionBand.buyTitle,
			tone: 'consultation'
		}
	]);
</script>

<section class="home2-market">
	<div class="home2-market__inner">
		<nav class="home2-shortcuts" aria-label="Популярни търсения">
			{#each primaryPills as pill, index (pill.href)}
				{@const ShortcutIcon = pillIcons[index] ?? Car}
				<a href={resolve(pill.href)} class="home2-shortcut">
					<ShortcutIcon size={19} strokeWidth={2.8} />
					<span>{pill.label}</span>
				</a>
			{/each}
		</nav>

		<div class="home2-action-grid" aria-label={copy.actionBand.importTitle}>
			{#each actionCards as card (card.href)}
				<a class={`home2-action-card home2-action-card--${card.tone}`} href={resolve(card.href)}>
					<span class="home2-action-card__copy">
						<strong>{card.title}</strong>
						<span>{card.body}</span>
						<em>
							{card.cta}
							<ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
						</em>
					</span>
					<img src={card.image} alt="" loading="lazy" aria-hidden="true" />
				</a>
			{/each}
		</div>

		<section class="home2-budget" aria-labelledby="home2-budget-title">
			<h2 id="home2-budget-title">Разгледай по бюджет</h2>
			<div class="home2-budget__grid">
				{#each budgetTiles as tile (tile.href)}
					<a class={`home2-budget-tile home2-budget-tile--${tile.tone}`} href={resolve(tile.href)}>
						<img src={tile.image} alt="" loading="lazy" aria-hidden="true" />
						<span>{tile.label}</span>
						<small>{tile.count}</small>
						<em>{tile.meta}</em>
					</a>
				{/each}
			</div>
		</section>
	</div>
</section>

<style>
	.home2-market {
		background: #f3f4f6;
		padding: 32px 39px 58px;
	}

	.home2-market__inner {
		margin: 0 auto;
		max-width: 1320px;
	}

	.home2-shortcuts {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		justify-content: center;
		margin-bottom: 18px;
		scrollbar-width: none;
	}

	.home2-shortcuts::-webkit-scrollbar {
		display: none;
	}

	.home2-shortcut {
		align-items: center;
		background: #ffffff;
		border-radius: 8px;
		box-shadow:
			0 12px 28px rgb(15 23 42 / 0.06),
			inset 0 -1px 0 rgb(0 0 0 / 0.04);
		color: #121214;
		display: inline-flex;
		font-size: 16px;
		font-weight: 800;
		gap: 8px;
		min-height: 45px;
		padding: 0 17px;
	}

	.home2-shortcut:hover {
		background: #e7ece4;
		color: #121214;
		transform: none;
	}

	.home2-shortcut :global(svg) {
		color: #101514;
		stroke: currentColor !important;
	}

	.home2-budget h2 {
		color: #121214;
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-weight: 1000;
		letter-spacing: 0;
		margin: 0;
		text-transform: uppercase;
	}

	.home2-action-grid {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin: 0 auto;
	}

	.home2-action-card {
		align-items: stretch;
		border-radius: 8px;
		color: #121214;
		display: grid;
		isolation: isolate;
		min-height: 198px;
		overflow: hidden;
		padding: 29px 32px;
		position: relative;
	}

	.home2-action-card:hover {
		box-shadow: none;
		transform: none;
	}

	.home2-action-card--import {
		background: #E3062F;
		color: #1C1C1C !important;
	}

	.home2-action-card--import:hover {
		background: #B9161C;
		color: #1C1C1C !important;
	}

	.home2-action-card--consultation {
		background: #1C1C1C;
		color: #ffffff !important;
	}

	.home2-action-card--consultation:hover {
		background: #1C1C1C;
		color: #ffffff !important;
	}

	.home2-action-card__copy {
		color: inherit !important;
		display: grid;
		gap: 10px;
		max-width: 56%;
		position: relative;
		z-index: 2;
	}

	.home2-action-card--consultation .home2-action-card__copy {
		max-width: 64%;
	}

	.home2-action-card__copy strong {
		color: inherit !important;
		font-size: clamp(24px, 2vw, 32px);
		font-weight: 950;
		line-height: 1.08;
	}

	.home2-action-card__copy > span {
		color: inherit !important;
		font-size: 15px;
		font-weight: 650;
		line-height: 1.42;
		opacity: 0.82;
	}

	.home2-action-card__copy em {
		align-items: center;
		border-radius: 999px;
		display: inline-flex;
		font-size: 14px;
		font-style: normal;
		font-weight: 800;
		gap: 8px;
		height: 40px;
		justify-content: center;
		line-height: 1;
		margin-top: 10px;
		padding: 0 18px;
		width: fit-content;
	}

	.home2-action-card--import .home2-action-card__copy em {
		background: #1C1C1C;
		color: #ffffff;
	}

	.home2-action-card--consultation .home2-action-card__copy em {
		background: #fee2e2;
		color: #1C1C1C;
	}

	.home2-action-card__copy em :global(svg),
	.home2-action-card__copy em :global(svg *) {
		stroke: currentColor !important;
	}

	.home2-action-card img {
		bottom: -45px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -76px;
		transform: none !important;
		width: 525px;
		z-index: 1;
	}

	.home2-action-card--consultation img {
		bottom: auto;
		right: -8px;
		top: -4px;
		width: 188px;
	}

	.home2-budget {
		margin: 35px auto 0;
	}

	.home2-budget h2 {
		font-size: clamp(40px, 4vw, 60px);
		line-height: 1;
		text-align: center;
	}

	.home2-budget__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		margin-top: 24px;
	}

	.home2-budget-tile {
		background: #e5e7eb;
		border-radius: 8px;
		color: #121214;
		display: grid;
		grid-template-rows: 1fr auto auto auto;
		min-height: 256px;
		overflow: hidden;
		padding: 0 12px 22px;
		position: relative;
		text-align: center;
	}

	.home2-budget-tile:hover {
		background: #dfe5ea;
		color: #121214;
		transform: none;
	}

	.home2-budget-tile--entry {
		background: #edf1ea;
	}

	.home2-budget-tile--mid {
		background: #e6ecef;
	}

	.home2-budget-tile--premium {
		background: #ece8dc;
	}

	.home2-budget-tile--luxury {
		background: #e2e5e8;
	}

	.home2-budget-tile--suv {
		background: #e8eee2;
	}

	.home2-budget-tile--open {
		background: #e9ecdf;
	}

	.home2-budget-tile img {
		align-self: end;
		height: 151px;
		margin-left: -25%;
		max-width: none;
		object-fit: contain;
		object-position: center bottom;
		transform: none !important;
		width: 150%;
	}

	.home2-budget-tile span {
		color: inherit;
		font-size: 16px;
		font-weight: 950;
		line-height: 1.1;
	}

	.home2-budget-tile small {
		color: #5d5b61;
		font-size: 13px;
		font-weight: 800;
		margin-top: 6px;
	}

	.home2-budget-tile em {
		color: #55585d;
		font-size: 12px;
		font-style: normal;
		font-weight: 750;
		line-height: 1.2;
		margin-top: 6px;
	}

	@media (max-width: 1100px) {
		.home2-action-grid {
			grid-template-columns: 1fr;
		}

		.home2-action-card__copy,
		.home2-action-card--consultation .home2-action-card__copy {
			max-width: 62%;
		}

		.home2-budget__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.home2-market {
			padding-inline: 16px;
		}

		.home2-shortcuts {
			flex-wrap: nowrap;
			justify-content: flex-start;
			overflow-x: auto;
			padding-bottom: 5px;
		}

		.home2-shortcut {
			white-space: nowrap;
		}

		.home2-action-grid {
			gap: 14px;
		}

		.home2-action-card {
			min-height: 184px;
			padding: 20px 22px;
		}

		.home2-action-card__copy,
		.home2-action-card--consultation .home2-action-card__copy {
			max-width: 100%;
		}

		.home2-action-card__copy > span {
			max-width: 52%;
			font-size: 13.5px;
		}

		.home2-action-card img {
			bottom: -24px;
			right: -90px;
			width: 340px;
		}

		.home2-action-card--consultation img {
			right: -16px;
			top: 15px;
			width: 172px;
		}

		.home2-budget h2 {
			font-size: 39px;
		}

		.home2-budget__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
