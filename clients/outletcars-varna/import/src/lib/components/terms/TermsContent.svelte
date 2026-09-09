<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	let { sections, title }: { sections: AuxeroTermsSection[]; title: string } = $props();
</script>

<section class="daynight-terms" data-daynight-terms-page>
	<div class="bc-container">
		<header class="daynight-terms__header">
			<h1 class="daynight-terms__title">{title}</h1>
			<p class="daynight-terms__intro">
				Кратко и ясно: как OUTLETCARS.BG — Варна представя информация, организира огледи и обработва запитвания.
			</p>
		</header>
		<div class="term-page" id="scrollContainer" data-daynight-terms>
			<nav class="term-page--nav-container" aria-label="Раздели в условията">
				<ul class="term-page--nav" id="sidebarSticky">
					{#each sections as section (section.id)}
						<li><a href={resolve(`/terms#${section.id}`)}>{section.title}</a></li>
					{/each}
				</ul>
			</nav>
			<div class="content">
				{#each sections as section (section.id)}
					<div class="section" id={section.id}>
						<p class="h4 daynight-terms__section-title">{section.title}</p>
						{#each section.body as paragraph (paragraph)}
							<p class="daynight-terms__paragraph">{paragraph}</p>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.daynight-terms {
		background: var(--bc-bg);
		padding: 52px 0 104px;
	}

	.daynight-terms__header {
		max-width: 760px;
		margin-bottom: 42px;
	}

	.daynight-terms__title {
		margin: 0;
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-h2);
		font-weight: 600;
		letter-spacing: 0;
		line-height: var(--bc-leading-h2);
		text-transform: none;
	}

	.daynight-terms__intro {
		max-width: 660px;
		margin: 14px 0 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		font-weight: 400;
		line-height: var(--bc-leading-body-lg);
	}

	.daynight-terms :global(.term-page) {
		display: grid;
		grid-template-columns: minmax(260px, 320px) minmax(0, 760px);
		gap: clamp(32px, 5vw, 78px);
		align-items: start;
		justify-content: start;
	}

	.daynight-terms :global(.term-page .term-page--nav-container) {
		position: relative;
		width: auto;
		min-width: 0;
	}

	.daynight-terms :global(.term-page .term-page--nav) {
		position: relative;
		display: flex;
		width: 100%;
		height: fit-content;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: color-mix(in srgb, var(--bc-accent) 7%, #fff);
		padding: 10px;
	}

	.daynight-terms :global(.term-page .term-page--nav.menuFixed) {
		position: fixed !important;
		z-index: 10;
		top: 94px;
		width: min(320px, calc(100vw - 32px));
	}

	.daynight-terms :global(.term-page .term-page--nav.menuSticky) {
		position: absolute !important;
		top: auto;
		bottom: 0;
	}

	.daynight-terms :global(.term-page .term-page--nav li a) {
		position: relative;
		display: block;
		border-radius: 8px;
		padding: 11px 13px;
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.35;
		text-decoration: none;
		transition:
			background-color var(--bc-motion-standard),
			color var(--bc-motion-standard);
	}

	.daynight-terms :global(.term-page .term-page--nav li a:hover),
	.daynight-terms :global(.term-page .term-page--nav li a.active) {
		background: #fff;
		color: var(--bc-accent);
	}

	.daynight-terms :global(.term-page .content) {
		width: 100%;
		min-width: 0;
		max-width: 760px;
	}

	.daynight-terms :global(.term-page .section:not(:first-child)) {
		margin-top: 30px;
		border-top: 1px solid var(--bc-border);
		padding-top: 30px;
	}

	.daynight-terms__section-title {
		margin: 0 0 10px;
		color: var(--bc-ink);
		font-size: 24px;
		font-weight: 600;
		line-height: 1.25;
		text-transform: none;
	}

	.daynight-terms__paragraph {
		margin: 0 0 11px;
		color: var(--bc-copy);
		font-size: 17px;
		font-weight: 400;
		line-height: 1.7;
	}

	@media (max-width: 767.98px) {
		.daynight-terms {
			padding: 28px 0 86px;
		}

		.daynight-terms__header {
			margin-bottom: 22px;
		}

		.daynight-terms__title {
			font-size: 27px;
			line-height: 1.15;
		}

		.daynight-terms__intro {
			margin-top: 10px;
			font-size: 15px;
			line-height: 1.55;
		}

		.daynight-terms :global(.term-page) {
			display: block;
		}

		.daynight-terms :global(.term-page .content),
		.daynight-terms :global(.term-page .term-page--nav-container),
		.daynight-terms :global(.term-page .term-page--nav) {
			width: 100%;
		}

		.daynight-terms :global(.term-page .term-page--nav-container) {
			overflow-x: auto;
			margin: 0 -15px 26px;
			padding: 0 15px 4px;
			scrollbar-width: none;
		}

		.daynight-terms :global(.term-page .term-page--nav-container::-webkit-scrollbar) {
			display: none;
		}

		.daynight-terms :global(.term-page .term-page--nav) {
			display: inline-flex;
			width: max-content;
			max-width: none;
			flex-direction: row;
			gap: 8px;
			border: 0;
			background: transparent;
			padding: 0;
		}

		.daynight-terms :global(.term-page .term-page--nav.menuFixed),
		.daynight-terms :global(.term-page .term-page--nav.menuSticky) {
			position: relative !important;
			top: auto;
			bottom: auto;
			width: max-content;
		}

		.daynight-terms :global(.term-page .term-page--nav a) {
			display: flex;
			min-height: 40px;
			align-items: center;
			border: 1px solid var(--bc-border);
			border-radius: 999px;
			background: color-mix(in srgb, var(--bc-accent) 7%, #fff);
			padding: 9px 13px;
			font-size: 14px;
			line-height: 1.25;
			white-space: nowrap;
		}

		.daynight-terms :global(.term-page .section:not(:first-child)) {
			margin-top: 24px;
			padding-top: 24px;
		}

		.daynight-terms__section-title {
			font-size: 22px;
			line-height: 1.25;
		}

		.daynight-terms__paragraph {
			font-size: 16px;
			line-height: 1.6;
		}
	}

	@media (min-width: 768px) and (max-width: 1199.98px) {
		.daynight-terms :global(.term-page) {
			grid-template-columns: minmax(230px, 280px) minmax(0, 1fr);
			gap: 36px;
		}
	}
</style>
