<script lang="ts">
	import { page as appPage } from '$app/state';
	import { daynightSite } from '$lib/data/daynight-site';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontPageHead from '$lib/components/seo/StorefrontPageHead.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import type { MapInventoryTemplatePage } from '$lib/types/template-page';
	import { provideDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import MapVehicleCard from './MapVehicleCard.svelte';
	import SortDropdown from './SortDropdown.svelte';
	import CompareTray from '$lib/components/shared/CompareTray.svelte';
	// Native half-map styling: shared Auxero card/control bases + the inventory grid
	// overrides extracted from the legacy template head CSS, re-rooted onto
	// `.inventory-map-template-shell`. The half-map page layout itself is scoped below.
	import './inventory-desktop-base.css';
	import './inventory-desktop-template-head.css';

	type MapPanel = 'list' | 'grid';

	let { page }: { page: MapInventoryTemplatePage } = $props();

	// Shared reactive source of truth for the listing side (search/sort/filters),
	// hydrated from the deep-link query exactly like the grid page. Provided via
	// context so SortDropdown drives it without prop-threading; created per mount
	// (never a module singleton) so SSR never leaks filters across requests.
	const inventoryVehicles = $derived(page.vehicles);
	const inventoryQuickFilters = $derived(page.quickFilters);
	const filters = provideDesktopInventoryContext(
		() => inventoryVehicles,
		appPage.url.searchParams,
		() => inventoryQuickFilters
	);

	let activePanel = $state<MapPanel>('list');
	const isListPanelActive = $derived(activePanel === 'list');
	const isGridPanelActive = $derived(activePanel === 'grid');
	const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
		`${daynightSite.mapLabel}, ${daynightSite.location}`
	)}&output=embed`;
	const mapLinkAttributes = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;

	function showPanel(panel: MapPanel) {
		activePanel = panel;
	}
</script>

<StorefrontPageHead
	title={page.title}
	scriptSrcs={page.scriptSrcs}
	description={page.description}
/>
<div id="wrapper" class="daynight-raw-template-shell inventory-map-template-shell">
	<SiteChrome />

	<main id="main-content" tabindex="-1" aria-labelledby="inventory-map-title">
		<h1 id="inventory-map-title" class="sr-only">Карта на наличните автомобили</h1>

		<section class="inventory-map-section">
			<div class="inventory-map-grid">
				<div class="listing-halfmap">
					<div class="flat-tabs" data-custom="true">
						<div class="inventory-map-toolbar">
							<div class="inventory-map-toolbar__cell inventory-map-toolbar__cell--lead">
								<div class="flex items-center gap-[16px]">
									<button class="btn-filter" id="filterSidebarToggle">
										<svg
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3.125 6.87499H5.70312C5.84081 7.41275 6.15356 7.88939 6.59207 8.22976C7.03057 8.57014 7.56989 8.75489 8.125 8.75489C8.68011 8.75489 9.21943 8.57014 9.65793 8.22976C10.0964 7.88939 10.4092 7.41275 10.5469 6.87499H16.875C17.0408 6.87499 17.1997 6.80914 17.3169 6.69193C17.4342 6.57472 17.5 6.41575 17.5 6.24999C17.5 6.08423 17.4342 5.92526 17.3169 5.80805C17.1997 5.69084 17.0408 5.62499 16.875 5.62499H10.5469C10.4092 5.08723 10.0964 4.61059 9.65793 4.27021C9.21943 3.92984 8.68011 3.74509 8.125 3.74509C7.56989 3.74509 7.03057 3.92984 6.59207 4.27021C6.15356 4.61059 5.84081 5.08723 5.70312 5.62499H3.125C2.95924 5.62499 2.80027 5.69084 2.68306 5.80805C2.56585 5.92526 2.5 6.08423 2.5 6.24999C2.5 6.41575 2.56585 6.57472 2.68306 6.69193C2.80027 6.80914 2.95924 6.87499 3.125 6.87499ZM8.125 4.99999C8.37223 4.99999 8.6139 5.0733 8.81946 5.21065C9.02502 5.348 9.18524 5.54323 9.27985 5.77163C9.37446 6.00004 9.39921 6.25138 9.35098 6.49385C9.30275 6.73633 9.1837 6.95906 9.00888 7.13387C8.83407 7.30869 8.61134 7.42774 8.36886 7.47597C8.12639 7.5242 7.87505 7.49945 7.64665 7.40484C7.41824 7.31023 7.22301 7.15001 7.08566 6.94445C6.94831 6.73889 6.875 6.49722 6.875 6.24999C6.875 5.91847 7.0067 5.60053 7.24112 5.36611C7.47554 5.13169 7.79348 4.99999 8.125 4.99999ZM16.875 13.125H15.5469C15.4092 12.5872 15.0964 12.1106 14.6579 11.7702C14.2194 11.4298 13.6801 11.2451 13.125 11.2451C12.5699 11.2451 12.0306 11.4298 11.5921 11.7702C11.1536 12.1106 10.8408 12.5872 10.7031 13.125H3.125C2.95924 13.125 2.80027 13.1908 2.68306 13.308C2.56585 13.4253 2.5 13.5842 2.5 13.75C2.5 13.9157 2.56585 14.0747 2.68306 14.1919C2.80027 14.3091 2.95924 14.375 3.125 14.375H10.7031C10.8408 14.9127 11.1536 15.3894 11.5921 15.7298C12.0306 16.0701 12.5699 16.2549 13.125 16.2549C13.6801 16.2549 14.2194 16.0701 14.6579 15.7298C15.0964 15.3894 15.4092 14.9127 15.5469 14.375H16.875C17.0408 14.375 17.1997 14.3091 17.3169 14.1919C17.4342 14.0747 17.5 13.9157 17.5 13.75C17.5 13.5842 17.4342 13.4253 17.3169 13.308C17.1997 13.1908 17.0408 13.125 16.875 13.125ZM13.125 15C12.8778 15 12.6361 14.9267 12.4305 14.7893C12.225 14.652 12.0648 14.4568 11.9701 14.2283C11.8755 13.9999 11.8508 13.7486 11.899 13.5061C11.9472 13.2636 12.0663 13.0409 12.2411 12.8661C12.4159 12.6913 12.6387 12.5722 12.8811 12.524C13.1236 12.4758 13.3749 12.5005 13.6034 12.5951C13.8318 12.6897 14.027 12.85 14.1643 13.0555C14.3017 13.2611 14.375 13.5028 14.375 13.75C14.375 14.0815 14.2433 14.3995 14.0089 14.6339C13.7745 14.8683 13.4565 15 13.125 15Z"
												fill="#1C1C1C"
											/>
										</svg>
										Филтри</button
									>
									<p class="md-hidden">
										Карта на наличните автомобили · {filters.resultCount} автомобила
									</p>
								</div>
							</div>

							<div class="inventory-map-toolbar__cell inventory-map-toolbar__cell--tabs">
								<div
									class="listing-tabs menu-tab flex items-center justify-center gap-[12px] py-[12px]"
								>
									<button
										class={isListPanelActive ? 'item-menu active' : 'item-menu'}
										type="button"
										aria-label="Списъчен изглед"
										aria-pressed={isListPanelActive}
										onclick={() => showPanel('list')}
									>
										<svg
											class={isListPanelActive ? 'active' : ''}
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
											<rect
												x="7.5"
												y="3.5"
												width="12"
												height="5"
												rx="2.5"
												fill="white"
												stroke="#9FA1A4"
											/>
											<circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
											<rect
												x="7.5"
												y="11.5"
												width="12"
												height="5"
												rx="2.5"
												fill="white"
												stroke="#9FA1A4"
											/>
										</svg>
									</button>

									<button
										class={isGridPanelActive ? 'item-menu active' : 'item-menu'}
										type="button"
										aria-label="Картов изглед"
										aria-pressed={isGridPanelActive}
										onclick={() => showPanel('grid')}
									>
										<svg
											width="14"
											height="20"
											viewBox="0 0 14 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
											<circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
											<circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
											<circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
										</svg>
									</button>
								</div>
							</div>
							<div class="inventory-map-toolbar__cell inventory-map-toolbar__cell--sort">
								<div class="flex h-full items-center justify-end gap-[8px]">
									<p class="md-hidden">Сортиране</p>
									<SortDropdown />
								</div>
							</div>

							<div
								class="inventory-map-applied"
								id="filterResults"
								style="display: none;"
								data-show="false"
							>
								<p class="inline gap-[4px]">
									<span id="filterMatchesCount">{filters.resultCount} </span> автомобила
								</p>
								<div
									class="divider-vertical-style2 inline-block h-[16px] align-middle"
									id="filterDivider"
								></div>

								<div id="filterTags" class="inline gap-[8px]"></div>

								<button class="btn-clear-items" id="btnClearAll">
									Изчисти
									<img src="/assets/icons/X-White.svg" alt="X" />
								</button>
							</div>
						</div>

						<div class="content-tab">
							<div class={isListPanelActive ? 'content-inner active' : 'content-inner'}>
								<div class="grid grid-cols-1 gap-[20px]">
									{#each filters.sorted as vehicle, index (vehicle.slug)}
										<MapVehicleCard {vehicle} {index} />
									{/each}
								</div>
							</div>
							<div class={isGridPanelActive ? 'content-inner active' : 'content-inner'}>
								<div class="grid grid-cols-1 gap-[20px]">
									{#each filters.sorted as vehicle, index (vehicle.slug)}
										<MapVehicleCard {vehicle} {index} />
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>

				<LazyMapEmbed
					id="map"
					class="daynight-inventory-map-panel"
					iframeClass="daynight-inventory-map-panel__iframe"
					title="Карта до F1rst Motors София"
					src={mapEmbedSrc}
					width="100%"
					height="100%"
					iframeStyle="border:0;display:block;"
					loadOnViewport={false}
					rootMargin="0px"
					dataMapScroll="true"
					dataMapZoom="16"
				>
					<div class="daynight-inventory-map-panel__fallback" aria-hidden="true">
						<span
							class="daynight-inventory-map-panel__road daynight-inventory-map-panel__road--main"
						></span>
						<span
							class="daynight-inventory-map-panel__road daynight-inventory-map-panel__road--cross"
						></span>
						<span class="daynight-inventory-map-panel__pin"></span>
						<div class="daynight-inventory-map-panel__card">
							<strong>F1rst Motors София</strong>
							<span>{daynightSite.location}</span>
						</div>
					</div>
					<a class="daynight-inventory-map-panel__open" {...mapLinkAttributes}>
						Отвори в Google Maps
					</a>
				</LazyMapEmbed>
			</div>
		</section>
	</main>

	<DayNightFooter />
</div>

<DesktopHomeTrailingChrome />

<CompareTray />

<style>
	/* Half-map layout (replaces the legacy Bootstrap row/col grid). The listing card
	   shell, sort dropdown, filter button, tab panels and applied-filter chips are
	   styled by inventory-desktop-base.css + the extracted template-head rules. */
	.inventory-map-section {
		margin-inline: auto;
		max-width: 1920px;
	}

	.inventory-map-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.listing-halfmap {
		max-height: calc(100vh - 94px);
		overflow-y: auto;
		padding: 16px;
	}

	.inventory-map-toolbar {
		align-items: center;
		display: grid;
		grid-template-columns: 5fr 2fr 5fr;
		margin-bottom: 12px;
	}

	.content-tab {
		position: relative;
	}

	@media (max-width: 1399px) {
		.inventory-map-grid {
			grid-template-columns: 1fr;
		}

		.listing-halfmap {
			height: auto;
			margin-bottom: 40px;
			max-height: none;
			overflow: visible;
		}

		.inventory-map-toolbar {
			grid-template-columns: 1fr 1fr;
		}

		.inventory-map-toolbar__cell--tabs {
			display: none;
		}
	}

	.listing-tabs button.item-menu {
		appearance: none;
		background: transparent;
		border: 0;
		cursor: pointer;
		font: inherit;
		padding: 0;
	}

	:global(.daynight-inventory-map-panel) {
		background:
			linear-gradient(135deg, rgba(25, 100, 216, 0.18), rgba(12, 25, 45, 0.08)),
			linear-gradient(90deg, rgba(28, 28, 28, 0.06) 1px, transparent 1px),
			linear-gradient(0deg, rgba(28, 28, 28, 0.06) 1px, transparent 1px), #eef4fb;
		background-size:
			auto,
			64px 64px,
			64px 64px,
			auto;
		min-height: calc(100vh - 172px);
		overflow: hidden;
		position: sticky;
		top: 0;
	}

	:global(.daynight-inventory-map-panel__iframe) {
		height: 100%;
		inset: 0;
		opacity: 0.18;
		position: absolute;
		width: 100%;
		z-index: 1;
	}

	.daynight-inventory-map-panel__fallback {
		inset: 0;
		pointer-events: none;
		position: absolute;
		z-index: 2;
	}

	.daynight-inventory-map-panel__road {
		background: rgba(255, 255, 255, 0.82);
		border: 1px solid rgba(25, 100, 216, 0.15);
		border-radius: 999px;
		box-shadow: 0 14px 34px rgba(20, 34, 55, 0.12);
		position: absolute;
	}

	.daynight-inventory-map-panel__road--main {
		height: 58px;
		left: 8%;
		top: 47%;
		transform: rotate(-18deg);
		width: 92%;
	}

	.daynight-inventory-map-panel__road--cross {
		height: 48px;
		left: 42%;
		top: 10%;
		transform: rotate(62deg);
		width: 72%;
	}

	.daynight-inventory-map-panel__pin {
		background: #e60028;
		border: 6px solid #fff;
		border-radius: 999px 999px 999px 0;
		box-shadow: 0 18px 40px rgba(230, 0, 40, 0.28);
		height: 42px;
		left: 51%;
		position: absolute;
		top: 37%;
		transform: rotate(-45deg);
		width: 42px;
	}

	.daynight-inventory-map-panel__pin::after {
		background: #fff;
		border-radius: 999px;
		content: '';
		height: 12px;
		left: 9px;
		position: absolute;
		top: 9px;
		width: 12px;
	}

	.daynight-inventory-map-panel__card {
		background: rgba(255, 255, 255, 0.94);
		border: 1px solid rgba(25, 100, 216, 0.15);
		border-radius: 18px;
		box-shadow: 0 24px 60px rgba(20, 34, 55, 0.16);
		color: #111827;
		display: grid;
		gap: 7px;
		left: 50%;
		max-width: min(390px, calc(100% - 48px));
		padding: 20px 22px;
		position: absolute;
		top: calc(37% + 64px);
		transform: translateX(-50%);
	}

	.daynight-inventory-map-panel__card strong {
		font-size: 20px;
		font-weight: var(--sa-weight-semibold);
		letter-spacing: 0;
	}

	.daynight-inventory-map-panel__card span {
		color: #536176;
		font-size: 16px;
		line-height: 1.45;
	}

	.daynight-inventory-map-panel__open {
		align-items: center;
		background: #1964d8;
		border-radius: 999px;
		box-shadow: 0 16px 40px rgba(25, 100, 216, 0.22);
		color: #fff;
		display: inline-flex;
		font-size: 16px;
		font-weight: 600;
		gap: 8px;
		padding: 13px 18px;
		position: absolute;
		right: 28px;
		text-decoration: none;
		top: 28px;
		z-index: 3;
	}

	@media (max-width: 1199px) {
		:global(.daynight-inventory-map-panel) {
			min-height: 420px;
			position: relative;
		}
	}
</style>
