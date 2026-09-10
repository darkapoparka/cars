<script lang="ts">
	// Native 1:1 rebuild of the localized /compare (compare.html) main content:
	// breadcrumb + heading + the vehicle comparison table. The compare LOGIC and data
	// (garage-or-default trio, spec rows) are preserved verbatim — only the styling
	// layer changed. The look that used to come from app.css + StorefrontTemplateContent's
	// :global stylesheet is now reproduced as a SELF-CONTAINED scoped style block below,
	// confirmed against getComputedStyle at 1440px. Svelte scopes it to this component's
	// markup, so no legacy template CSS is needed. Brand colours route through tokens
	// (--sa-*); template neutrals stay literal for an exact visual match. The legacy
	// /assets chevron img is replaced with @lucide/svelte's ChevronRight, like FaqContent.

	import { resolve } from '$lib/utils/preview-paths';
	import { ChevronRight, GitCompare } from '@lucide/svelte';
	import { getDayNightVehicleBySlug, type Car } from '$lib/data/daynight-vehicles';
	import { daynightSite } from '$lib/data/daynight-site';
	import { getGarageContext } from '$lib/state/garage.svelte';

	type AssetHref = `/variant-3/assets/${string}`;

	const garage = getGarageContext();

	const garageVehicles = $derived(
		garage.compare
			.map((slug) => getDayNightVehicleBySlug(slug))
			.filter((vehicle): vehicle is Car => Boolean(vehicle))
	);
	const vehicles = $derived(garageVehicles);

	function vehicleHref(slug: string): `/inventory/${string}` {
		return `/inventory/${slug}`;
	}

	function icon(name: string): AssetHref {
		return `/variant-3/assets/icons/${name}.svg`;
	}

	const specRows: { icon: string; label: string; value: (vehicle: Car) => string }[] = [
		{ icon: 'mileage', label: 'Пробег', value: (vehicle) => vehicle.mileage },
		{ icon: 'years', label: 'Година', value: (vehicle) => String(vehicle.year) },
		{ icon: 'fuel', label: 'Гориво', value: (vehicle) => vehicle.fuel },
		{ icon: 'transmission', label: 'Скоростна кутия', value: (vehicle) => vehicle.transmission },
		{ icon: 'auto', label: 'Каросерия', value: (vehicle) => vehicle.body },
		{ icon: 'engine', label: 'Двигател', value: (vehicle) => vehicle.engine },
		{ icon: 'icon-gauge', label: 'Мощност', value: (vehicle) => vehicle.power },
		{ icon: 'color', label: 'Цвят', value: (vehicle) => vehicle.color },
		{ icon: 'location', label: 'Локация', value: () => daynightSite.location },
		{ icon: 'QrCode', label: 'Реф. номер', value: (vehicle) => vehicle.lot }
	];
</script>

<div class="compare-page">
	<!-- breadcrumb -->
	<section class="background-light">
		<div class="container">
			<ul class="breadcrumb">
				<li>
					<a href={resolve('/')}>Начало</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Още</span>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Сравнение</span>
				</li>
			</ul>
		</div>
	</section>
	<!-- breadcrumb -->

	<!-- New Cars -->
	<section class="pb-100">
		<div class="tf-spacing-style3"></div>

		<div class="container">
			<h1 class="mb-12 text-center capitalize">Сравнение на автомобили</h1>
			<p class="text-secondary h7 line-height-28 mb-40 text-center">
				Сравнете пробег, гориво, оборудване и цена преди оглед.
			</p>

			{#if vehicles.length}
				<ul class="compare-selection" aria-label="Управление на избраните автомобили">
					{#each vehicles as vehicle (vehicle.slug)}
						<li>
							<a href={resolve(vehicleHref(vehicle.slug))}>{vehicle.shortTitle}</a>
							<div>
								<button
									type="button"
									aria-label={`Премахни ${vehicle.shortTitle}`}
									onclick={() => garage.toggleCompare(vehicle.slug)}>Премахни</button
								>
								<a
									href={resolve('/inventory')}
									onclick={() => garage.toggleCompare(vehicle.slug)}
									aria-label={`Замени ${vehicle.shortTitle}`}>Замени</a
								>
							</div>
						</li>
					{/each}
				</ul>
				<p class="compare-scroll-hint" id="compare-scroll-hint">
					Плъзнете таблицата наляво и надясно, за да видите всички автомобили.
				</p>
				{#if vehicles.length < 3}<a class="compare-add" href={resolve('/inventory')}
						>Добави автомобил за сравнение</a
					>{/if}
				<!-- Keyboard users must be able to focus and scroll this overflow region. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="card-details"
					role="region"
					aria-label="Таблица за сравнение"
					aria-describedby="compare-scroll-hint"
					tabindex="0"
				>
					<table class="card-details--table" style:--vehicle-count={vehicles.length}>
						<caption class="sr-only">Характеристики на избраните автомобили</caption>
						<tbody>
							<tr>
								<td></td>
								{#each vehicles as vehicle (vehicle.slug)}
									<td>
										<div class="top relative">
											<a
												href={resolve(vehicleHref(vehicle.slug))}
												aria-label={`Виж ${vehicle.shortTitle}`}
											>
												<img
													class="radius-16 image mb-10"
													src={vehicle.image}
													alt={vehicle.shortTitle}
													loading="lazy"
												/>
											</a>
											<p class="h4 text-center">
												<a href={resolve(vehicleHref(vehicle.slug))}>{vehicle.shortTitle}</a>
											</p>
											<p class="text-secondary text-center">{vehicle.priceEur}</p>
										</div>
									</td>
								{/each}
							</tr>
							{#each specRows as row (row.label)}
								<tr>
									<td>
										<div class={['gap-8', 'flex', 'items-center']}>
											<img src={icon(row.icon)} alt="" aria-hidden="true" />
											<span>{row.label}:</span>
										</div>
									</td>
									{#each vehicles as vehicle (vehicle.slug)}
										<td>{row.value(vehicle)}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="compare-empty" role="status">
					<div class="compare-empty__mark" aria-hidden="true"><GitCompare size={26} /></div>
					<h3>Няма избрани автомобили</h3>
					<p>Добавете до 3 автомобила от наличността, за да сравните параметрите им.</p>
					<a class="compare-empty__cta sa-cta sa-cta-primary" href={resolve('/inventory')}
						>Разгледай автомобилите</a
					>
				</div>
			{/if}
		</div>
	</section>
	<!-- New Cars -->
</div>

<style>
	/* Self-contained scoped styles for /compare. These reproduce the exact rules the
	   legacy app.css + StorefrontTemplateContent :global stylesheet provided for the
	   verbatim class strings used above, confirmed against getComputedStyle at 1440px.
	   Svelte scopes them to this component's markup, so no :global wrapper is required.
	   Brand colours route through tokens (--sa-*); template neutrals stay literal for an
	   exact visual match. */
	.compare-page,
	.compare-page * {
		box-sizing: border-box;
	}

	/* The legacy look came from app.css's universal `* { color: #1C1C1C }` reset, so
	   default text is the template neutral #1c1c1c (NOT --sa-ink #0f1417). Kept as a
	   literal for an exact baseline match; elements with their own colour (h2,
	   sub-paragraph, price, breadcrumb spans) override it below. */
	.compare-page {
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		letter-spacing: 0;
	}

	.compare-page a {
		color: inherit;
		text-decoration: none;
	}

	.compare-page img {
		display: block;
		max-width: 100%;
	}

	.compare-page p,
	.compare-page h1,
	.compare-page ul {
		margin-top: 0;
	}

	/* Layout container. The legacy `.container` was a blend of app.css
	   (`max-width:1440px; padding:0 15px`) and StorefrontTemplateContent
	   (`width:min(100% - 48px, 1320px)`). The explicit `max-width:1440px` is also
	   required to defeat Tailwind's built-in `.container` utility (max-width:1280px at
	   xl), which storefront.css would otherwise clamp this element to. Verified width
	   1320px / max 1440px / padding 0 15px via getComputedStyle. */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.background-light {
		background: #f5f7fb;
	}

	/* Spacing utilities */
	.pb-100 {
		padding-bottom: 100px;
	}

	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.tf-spacing-style3 {
		height: 34px;
	}

	/* Flex utilities */
	.flex {
		display: flex;
	}

	.items-center {
		align-items: center;
	}

	.gap-8 {
		gap: 8px;
	}

	/* Text utilities */
	.capitalize {
		text-transform: none;
	}

	.text-center {
		text-align: center;
	}

	.text-secondary {
		color: #667085;
	}

	.radius-16 {
		border-radius: 16px;
	}

	/* `.line-height-28` is declared BEFORE `.h7` to preserve the template's source
	   order: at equal specificity the later `.h7` rule wins on line-height (1.6),
	   matching the committed baseline. */
	.line-height-28 {
		line-height: 28px;
	}

	/* app.css applied `font-weight: 600` to the whole `.h4…h7,h1…h6` group, and
	   StorefrontTemplateContent's `.h7` declared no weight — so the legacy sub-paragraph
	   text rendered at 600 (verified: font-weight 600, line-height 1.6). */
	.h7 {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.6;
	}

	/* Heading — app.css + StorefrontTemplateContent both supply the h2 styling; the
	   effective computed result at 1440px is colour #111827, the clamp font size
	   (46.08px at 1440), weight 700, line-height 1.08, text-align center (the
	   `.text-center` class on the element). margin-bottom is intentionally NOT set
	   here: in the legacy blend STC's `h2 { margin-bottom: 0 }` (element specificity)
	   lost to the `.mb-12` utility (class specificity), so the heading carried a 12px
	   bottom margin. Leaving it off lets `.mb-12` win and reproduces that 12px gap. */
	.compare-page h1 {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
		list-style: none;
	}

	/* app.css's universal `*` reset dropped a/span back to font-weight 400 in the
	   legacy baseline (the bold 700 lives on the .breadcrumb ul only). The a/span
	   line-height 22px comes from app.css's `.breadcrumb a, .breadcrumb span`. */
	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.72;
	}

	/* Comparison table shell — StorefrontTemplateContent owned the card chrome
	   (border/radius/shadow + overflow-x scroll); reproduced as the effective computed
	   result. */
	.card-details {
		overflow-x: auto;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: none;
	}

	.compare-selection {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding: 0;
		list-style: none;
	}
	.compare-selection li {
		flex: 1 1 200px;
		min-width: 0;
		padding: 12px;
		border: 1px solid var(--sa-line);
		border-radius: 8px;
	}
	.compare-selection li > a {
		font-weight: 650;
	}
	.compare-selection li > div {
		display: flex;
		gap: 16px;
	}
	.compare-selection button,
	.compare-selection li > div a,
	.compare-add {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		background: transparent;
		border: 0;
		padding: 0;
		color: var(--sa-ink);
		font: inherit;
		text-decoration: underline;
		cursor: pointer;
	}
	.compare-scroll-hint {
		display: none;
	}
	.compare-page :is(a, button, [tabindex]):focus-visible {
		outline: 2px solid var(--sa-ink);
		outline-offset: 3px;
	}

	.compare-empty {
		display: grid;
		max-width: 520px;
		justify-items: center;
		gap: 10px;
		margin: 0 auto;
		border: 1px solid #e0e7ef;
		border-radius: 18px;
		background: #f8fafc;
		padding: 34px 24px;
		text-align: center;
	}

	.compare-empty__mark {
		display: grid;
		width: 52px;
		height: 52px;
		place-items: center;
		border-radius: 50%;
		background: #e8eef7;
		color: var(--sa-blue);
	}

	.compare-empty h3 {
		margin: 0;
		color: #111827;
		font-size: 22px;
		font-weight: 750;
		line-height: 1.2;
	}

	.compare-empty p {
		max-width: 390px;
		margin: 0;
		color: #667085;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.5;
	}

	.compare-empty__cta {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--sa-red);
		padding: 0 18px;
		color: #fff !important;
		font-size: 14px;
		font-weight: 800;
	}

	.compare-empty__cta:focus-visible {
		outline: 3px solid rgba(47, 122, 255, 0.4);
		outline-offset: 3px;
	}

	/* The table itself was a blend: StorefrontTemplateContent supplied
	   `border-collapse: collapse` and min-width 820px; app.css supplied
	   `table-layout: fixed` and the 8px radius. Verified collapse + fixed + min-width
	   820px via getComputedStyle. */
	.card-details--table {
		width: 100%;
		min-width: 820px;
		table-layout: fixed;
		border-collapse: collapse;
		border-radius: 8px;
		text-indent: 0;
	}

	/* Data cells (app.css `.card-details .card-details--table tr td` won the cascade,
	   3-class specificity): centered, 18px/500, 18px padding (StorefrontTemplateContent's
	   18px padding won over app.css's 15px 32px — verified padding 18px all round), full
	   #E7E7E7 borders that collapse with neighbours. */
	.card-details--table td {
		width: 100%;
		padding: 18px;
		border: 1px solid #e7e7e7;
		color: #1c1c1c;
		font-size: 18px;
		font-weight: 500;
		text-align: center;
		vertical-align: top;
	}

	/* First (label) column: left-aligned, 210px wide, light fill, bold 700 (the
	   StorefrontTemplateContent `td:first-child` 700 won over app.css's 500 here —
	   verified 210px / #f8fafc / 700). */
	.card-details--table td:nth-child(1) {
		width: 210px;
		background: #f8fafc;
		font-weight: 700;
		text-align: left;
	}

	/* Collapsed-border bookkeeping (app.css): no inner right borders, no inner bottom
	   borders, the image row carries no borders at all, and the body corners are
	   rounded 20px. */
	.card-details--table td:not(:last-child) {
		border-right: 0;
	}

	.card-details--table tr:not(:last-child) td {
		border-bottom: 0;
	}

	.card-details--table tr:first-child td {
		border: none;
		background: transparent;
		font-weight: 500;
		text-align: center;
	}

	/* The image row's first (empty) cell still keeps the light fill + 210px width from
	   the label column, but no border (verified bg #f8fafc, width 210px, no border). */
	.card-details--table tr:first-child td:nth-child(1) {
		width: 210px;
		background: #f8fafc;
	}

	.card-details--table tr:nth-child(2) td:first-child {
		border-top-left-radius: 20px;
	}

	.card-details--table tr:nth-child(2) td:last-child {
		border-top-right-radius: 20px;
	}

	.card-details--table tr:last-child td:first-child {
		border-bottom-left-radius: 20px;
	}

	.card-details--table tr:last-child td:last-child {
		border-bottom-right-radius: 20px;
	}

	/* Vehicle header block (app.css `.card-details ... .top`): centered, max 350px wide. */
	.card-details--table .top {
		position: relative;
		max-width: 350px;
		margin: auto;
	}

	/* The header image uses app.css's fixed 230px height (it won over
	   StorefrontTemplateContent's aspect-ratio: 1.55) — verified height 230px. */
	.card-details--table .top img,
	.card-details--table .image {
		width: 100%;
		height: 230px;
		margin-bottom: 10px;
		border-radius: 16px;
		object-fit: cover;
	}

	/* Vehicle title (.h4): 22px / 650 / 1.25, neutral #1c1c1c, centered, no margin. */
	.h4 {
		margin: 0;
		font-size: 22px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.25;
	}

	/* Vehicle price paragraph: app.css's universal `*` reset dropped it to 400; colour
	   #667085 from `.text-secondary`; line-height 26px from the body/`*` default
	   (verified 16px / 400 / 26px / #667085). */
	.card-details--table .top p.text-secondary {
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
	}

	/* Label cell icon (the legacy spec icons render at their natural 28px) — verified
	   28x28. */
	.card-details--table td:nth-child(1) img {
		width: 28px;
		height: 28px;
	}

	/* Label cell text: 18px / 500 / #1c1c1c, line-height 26px — the legacy baseline
	   pinned every label to app.css's universal 26px line box (verified 26px). The
	   wrapping "Локация" rows depend on this 26px to land at the baseline row height. */
	.card-details--table td:nth-child(1) span {
		font-size: 18px;
		font-weight: 500;
		line-height: 26px;
	}

	@media (max-width: 991px) {
		.container {
			width: calc(100% - 32px);
			padding: 0;
		}
		.compare-selection {
			gap: 8px;
		}
		.compare-selection li {
			flex-basis: 100%;
			padding: 8px 12px;
		}
		.compare-scroll-hint {
			display: block;
			font-size: 14px;
		}
		.card-details--table {
			min-width: calc(96px + var(--vehicle-count) * 190px);
		}
		.card-details--table td {
			padding: 10px;
			font-size: 14px;
			overflow-wrap: anywhere;
		}
		.card-details--table td:nth-child(1),
		.card-details--table tr:first-child td:nth-child(1) {
			width: 96px;
			position: sticky;
			left: 0;
			background: #f8fafc;
			z-index: 1;
		}
		.card-details--table td:nth-child(1) span {
			font-size: 13px;
			line-height: 1.35;
		}
		.card-details--table td:nth-child(1) img {
			display: none;
		}
		.card-details--table .top img,
		.card-details--table .image {
			height: 110px;
			border-radius: 8px;
		}
		.h4 {
			font-size: 16px;
		}

		.pb-100 {
			padding-bottom: 56px;
		}
	}
</style>
