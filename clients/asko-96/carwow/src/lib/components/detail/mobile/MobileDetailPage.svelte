<script lang="ts">
	import { ChevronLeft, GitCompare, Heart, MapPin, PhoneCall, Share } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import DayNightSpecIcon, {
		type DayNightSpecIconName
	} from '$lib/components/shared/icons/DayNightSpecIcon.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import {
		enhanceDayNightImageFallbacks,
		daynightImageFallback
	} from '$lib/utils/daynight-image-fallback';
	import { onMount, tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { Drawer } from 'vaul-svelte';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const garage = getGarageContext();
	const isSaved = $derived(garage.isFavorite(vehicle.slug));
	const isCompared = $derived(garage.isCompared(vehicle.slug));

	onMount(() => {
		enhanceDayNightImageFallbacks();
		syncViewportSnapPoints();
		detailDrawerOpen = true;
	});

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const viberHref = `viber://chat?number=%2B359${daynightSite.phone.slice(1)}`;
	let activePhoto = $state(0);
	const photos = $derived(vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.image]);
	const activePhotoSrc = $derived(photos[activePhoto] ?? photos[0] ?? vehicle.image);
	const visiblePhotos = $derived(photos.slice(0, 6));
	const specs = $derived<{ icon: DayNightSpecIconName; label: string; value: string }[]>([
		{ icon: 'year', label: 'Година', value: String(vehicle.year) },
		{ icon: 'mileage', label: 'Пробег', value: vehicle.mileage },
		{ icon: 'fuel', label: 'Гориво', value: vehicle.fuel },
		{ icon: 'transmission', label: 'Скорости', value: vehicle.transmission }
	]);
	const detailSpecs = $derived([
		['Каросерия', vehicle.body],
		['Двигател', vehicle.engine],
		['Мощност', vehicle.power],
		['Цвят', vehicle.color],
		['Лот', vehicle.lot]
	]);
	const tabs = [
		{ key: 'info', label: 'Инфо' },
		{ key: 'data', label: 'Данни' },
		{ key: 'extras', label: 'Екстри' }
	] as const;
	const COLLAPSED_SNAP_RATIO = 0.58;
	const FULL_SNAP_OFFSET = 52;
	type DetailSnapPoint = string;

	// Vaul captures the snap points when Drawer.Root first mounts, so they must
	// be correct at component init — the onMount sync arrives too late and a
	// stale default (tuned for an ~844px viewport) leaves the collapsed sheet
	// covering the gallery thumbnails on shorter phones. SSR keeps the static
	// fallbacks; the client recomputes from the real viewport before first paint.
	const initialSnapPoints =
		typeof window === 'undefined' ? { collapsed: '490px', full: '792px' } : getViewportSnapPoints();

	let activeTab = $state<(typeof tabs)[number]['key']>('info');
	let mediaHeightPx = $state<number | null>(
		typeof window === 'undefined'
			? null
			: window.innerHeight - Math.round(window.innerHeight * COLLAPSED_SNAP_RATIO)
	);
	let activeSnapPoint = $state<DetailSnapPoint | null>(null);
	let collapsedSnapPoint = $state<DetailSnapPoint>(initialSnapPoints.collapsed);
	let contentRef = $state<HTMLElement | null>(null);
	let detailDrawerOpen = $state(false);
	let fullSnapPoint = $state<DetailSnapPoint>(initialSnapPoints.full);
	let shareState = $state('');
	// Two resting positions only: a collapsed peek (sheet edge meets the hero
	// photo, never below it) and full. No middle stop — drag settles to whichever
	// is closer, and a flick jumps straight to the far one (see snapToSequentialPoint
	// removed on Drawer.Root below) so the handle feels free, not sticky.
	const detailSnapPoints = $derived<DetailSnapPoint[]>([collapsedSnapPoint, fullSnapPoint]);
	const sheetExpanded = $derived(
		activeSnapPoint !== null && activeSnapPoint !== collapsedSnapPoint
	);
	const sheetFull = $derived(activeSnapPoint === fullSnapPoint);

	function getViewportSnapPoints() {
		const viewportHeight = window.innerHeight;

		return {
			collapsed: `${Math.round(viewportHeight * COLLAPSED_SNAP_RATIO)}px`,
			full: `${Math.max(1, Math.round(viewportHeight - FULL_SNAP_OFFSET))}px`
		};
	}

	function syncViewportSnapPoints() {
		const wasFullSnap = activeSnapPoint === fullSnapPoint;
		const next = getViewportSnapPoints();

		collapsedSnapPoint = next.collapsed;
		fullSnapPoint = next.full;
		activeSnapPoint = wasFullSnap ? next.full : next.collapsed;
		// The media block must end exactly at the collapsed sheet edge. CSS svh
		// and vaul's window.innerHeight disagree whenever the mobile URL bar is
		// collapsed, which painted a strip of grey page background between the
		// photo and the drawer — so the px height comes from the same number the
		// snap points use.
		mediaHeightPx = window.innerHeight - Math.round(window.innerHeight * COLLAPSED_SNAP_RATIO);
	}

	const contentPanel: Attachment<HTMLElement> = (node) => {
		contentRef = node;
		return () => {
			if (contentRef === node) contentRef = null;
		};
	};

	async function selectTab(tab: (typeof tabs)[number]['key']) {
		activeTab = tab;
		activeSnapPoint = null;
		await tick();
		activeSnapPoint = tab === 'info' ? collapsedSnapPoint : fullSnapPoint;
		await tick();
		contentRef?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	}

	function handleActiveSnapPointChange(snapPoint: number | string | null) {
		activeSnapPoint = typeof snapPoint === 'string' ? snapPoint : null;
	}

	let touchStartX = 0;
	let touchStartY = 0;

	function handleMediaTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
	}

	function handleMediaTouchEnd(event: TouchEvent) {
		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;
		// Horizontal-dominant swipes only, so vertical pans over the photo and
		// plain taps (thumbs, top bar buttons) never change the photo.
		if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;
		const next = activePhoto + (deltaX < 0 ? 1 : -1);
		activePhoto = Math.min(photos.length - 1, Math.max(0, next));
	}

	async function shareVehicle() {
		const url = globalThis.location?.href ?? resolve(`/inventory/${vehicle.slug}`);
		const title = `${vehicle.shortTitle} - ${vehicle.priceEur}`;

		try {
			if (navigator.share) {
				await navigator.share({ title, text: vehicle.conditionLine, url });
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(url);
				shareState = 'Копирано';
				setTimeout(() => (shareState = ''), 1600);
			}
		} catch {
			shareState = '';
		}
	}
</script>

<svelte:window onresize={syncViewportSnapPoints} />

<main
	id="main-content"
	tabindex="-1"
	class="mobile-detail"
	aria-label="Детайли за автомобил"
	style={mediaHeightPx === null ? undefined : `--pdp-media-h: ${mediaHeightPx}px`}
>
	<section
		class="mobile-detail__media"
		aria-label="Основна снимка"
		ontouchstart={handleMediaTouchStart}
		ontouchend={handleMediaTouchEnd}
	>
		<img
			class="mobile-detail__media-photo"
			src={activePhotoSrc}
			alt={vehicle.shortTitle}
			decoding="async"
			data-daynight-image-fallback
			use:daynightImageFallback
		/>
		<div class="mobile-detail__shade"></div>

		<div class="mobile-detail__topbar">
			<a
				class="mobile-detail__nav-button mobile-detail__nav-button--back"
				href={resolve('/inventory')}
				aria-label="Назад към автомобили"
			>
				<ChevronLeft size={22} strokeWidth={2.35} />
			</a>
			<div class="mobile-detail__topbar-right">
				<button
					class="mobile-detail__nav-button mobile-detail__nav-button--save"
					class:is-saved={isSaved}
					type="button"
					aria-pressed={isSaved}
					aria-label={isSaved ? 'Премахни от запазени' : 'Запази'}
					onclick={() => garage.toggleFavorite(vehicle.slug)}
				>
					<Heart size={19} strokeWidth={2.15} />
				</button>
				<button
					class="mobile-detail__nav-button mobile-detail__nav-button--compare"
					class:is-saved={isCompared}
					type="button"
					aria-pressed={isCompared}
					aria-label={isCompared ? 'Премахни от сравнение' : 'Добави за сравнение'}
					onclick={() => garage.toggleCompare(vehicle.slug)}
				>
					<GitCompare size={19} strokeWidth={2.15} />
				</button>
				<button
					class="mobile-detail__nav-button mobile-detail__nav-button--share"
					type="button"
					aria-label="Сподели"
					onclick={shareVehicle}
				>
					<Share size={19} strokeWidth={2.15} />
				</button>
			</div>
		</div>

		{#if photos.length > 1}
			<div class="mobile-detail__thumbs" aria-label="Снимки">
				{#each visiblePhotos as photo, index (photo)}
					<button
						type="button"
						class:is-active={index === activePhoto}
						aria-label={`Снимка ${index + 1}`}
						aria-pressed={index === activePhoto}
						onclick={() => (activePhoto = index)}
					>
						<img
							src={photo}
							alt=""
							loading="lazy"
							decoding="async"
							data-daynight-image-fallback
							use:daynightImageFallback
						/>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<Drawer.Root
		bind:open={detailDrawerOpen}
		{activeSnapPoint}
		onActiveSnapPointChange={handleActiveSnapPointChange}
		snapPoints={detailSnapPoints}
		direction="bottom"
		dismissible={false}
		modal={false}
		noBodyStyles
		fixed
		repositionInputs={false}
		scrollLockTimeout={260}
		shouldScaleBackground={false}
	>
		<Drawer.Content
			class="mobile-detail-sheet"
			aria-label="Информация за автомобила"
			data-expanded={sheetExpanded}
			data-full={sheetFull}
		>
			<div class="mobile-detail-sheet__handle-zone">
				<Drawer.Handle class="mobile-detail-sheet__handle" preventCycle />
			</div>

			<header class="mobile-detail-sheet__head">
				<span class="mobile-detail-sheet__brand">{vehicle.brand}</span>
				<small class="mobile-detail-sheet__price-monthly">{vehicle.monthly}</small>
				<h1 class="mobile-detail-sheet__title">{vehicle.shortTitle}</h1>
				<div class="mobile-detail-sheet__price">
					<strong class="mobile-detail-sheet__price-eur">{vehicle.priceEur}</strong>
					<span class="mobile-detail-sheet__price-bgn">{vehicle.priceBgn}</span>
				</div>
			</header>

			<div class="mobile-detail-sheet__actions">
				<a class="is-primary" href={phoneHref}>
					<PhoneCall size={18} strokeWidth={2.4} />
					Обади се
				</a>
				<a class="is-viber" href={viberHref}>
					<svg
						class="mobile-detail-sheet__viber-mark"
						viewBox="0 0 72.215 76.207"
						aria-hidden="true"
					>
						<g transform="translate(-429.267 -345.047)">
							<path
								d="m493.4 352.5c-1.9-1.7-9.5-7.3-26.6-7.4 0 0-20.1-1.2-29.9 7.8-5.5 5.5-7.4 13.4-7.6 23.3-.2 9.9-.5 28.4 17.4 33.5v7.7s-.1 3.1 1.9 3.7c2.5.8 3.9-1.6 6.3-4.1 1.3-1.4 3.1-3.4 4.4-5 12.2 1 21.6-1.3 22.7-1.7 2.5-.8 16.4-2.6 18.7-21.1 2.4-19.2-1-31.3-7.3-36.7zm2.1 35.2c-1.9 15.5-13.2 16.5-15.3 17.1-.9.3-9.1 2.3-19.5 1.7 0 0-7.7 9.3-10.2 11.8-.4.4-.8.5-1.1.5-.4-.1-.5-.6-.5-1.3 0-1 .1-12.8.1-12.8-15.1-4.2-14.2-20-14.1-28.3.2-8.3 1.7-15 6.3-19.6 8.3-7.5 25.4-6.4 25.4-6.4 14.4.1 21.3 4.4 22.9 5.9 5.2 4.6 7.9 15.5 6 31.4z"
							/>
							<path
								d="m473.8 375.8c-.2-3.8-2.1-5.8-5.8-6"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.927"
							/>
							<path
								d="m478.8 377.4c.1-3.5-1-6.5-3.1-8.8-2.2-2.4-5.2-3.7-9-4"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.927"
							/>
							<path
								d="m483.8 379.4c0-6.1-1.9-10.9-5.5-14.4-3.6-3.5-8.1-5.3-13.5-5.3"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.927"
							/>
							<path
								d="m468.2 388.7s1.4.1 2.1-.8l1.4-1.8c.7-.9 2.3-1.5 4-.6.9.5 2.5 1.5 3.5 2.3 1.1.8 3.3 2.6 3.3 2.6 1.1.9 1.3 2.2.6 3.6-.7 1.3-1.7 2.5-3 3.6-1 .9-2 1.3-3 1.5h-.4c-.4 0-.9-.1-1.3-.2-1.5-.4-4-1.5-8.3-3.8-2.7-1.5-5-3.1-6.9-4.6-1-.8-2.1-1.7-3.1-2.8l-.4-.4c-1.1-1.1-2-2.1-2.8-3.1-1.5-1.9-3.1-4.2-4.6-6.9-2.3-4.2-3.4-6.7-3.8-8.3-.1-.4-.2-.8-.2-1.3v-.4c.1-1 .6-2 1.5-3 1.1-1.2 2.3-2.2 3.6-3 1.4-.7 2.7-.5 3.6.6 0 0 1.8 2.2 2.6 3.3.7 1 1.7 2.6 2.3 3.5.9 1.6.3 3.3-.5 4l-1.8 1.4c-.9.7-.8 2.1-.8 2.1s2.5 9.9 12.4 12.5z"
							/>
						</g>
					</svg>
					Viber
				</a>
			</div>

			<div
				class="mobile-detail-tabs"
				role="tablist"
				aria-label="Детайли"
				data-active-tab={activeTab}
			>
				{#each tabs as tab (tab.key)}
					<button
						id={`mobile-detail-tab-${tab.key}`}
						type="button"
						class={activeTab === tab.key ? 'is-active' : ''}
						role="tab"
						aria-controls="mobile-detail-panel"
						aria-selected={activeTab === tab.key}
						onclick={() => selectTab(tab.key)}
					>
						<span class="mobile-detail-tabs__label">{tab.label}</span>
					</button>
				{/each}
			</div>

			<div
				id="mobile-detail-panel"
				class="mobile-detail-sheet__content"
				{@attach contentPanel}
				role="tabpanel"
				aria-labelledby={`mobile-detail-tab-${activeTab}`}
				tabindex="0"
			>
				{#if activeTab === 'info'}
					<section class="mobile-detail__section">
						<h2>Описание</h2>
						<p class="mobile-detail__section-lead">{vehicle.conditionLine}</p>
						<p>{vehicle.description}</p>
					</section>
				{:else if activeTab === 'data'}
					<div class="mobile-detail__spec-grid" aria-label="Основни данни">
						{#each specs as spec (spec.label)}
							<div>
								<span class="mobile-detail__spec-icon">
									<DayNightSpecIcon name={spec.icon} size={18} />
								</span>
								<span>{spec.label}</span>
								<strong>{spec.value}</strong>
							</div>
						{/each}
					</div>

					<section class="mobile-detail__section">
						<h2>Детайли</h2>
						<dl>
							{#each detailSpecs as [label, value] (label)}
								<div>
									<dt>{label}</dt>
									<dd>{value}</dd>
								</div>
							{/each}
						</dl>
					</section>
				{:else if activeTab === 'extras'}
					<section class="mobile-detail__section">
						<h2>Екстри</h2>
						<ul>
							{#each vehicle.features as feature (feature)}
								<li>{feature}</li>
							{/each}
						</ul>
					</section>
				{/if}

				<div class="mobile-detail-sheet__offer">
					<strong>АСКО 96 предлага</strong>
					<ul class="mobile-detail-sheet__offer-list">
						<li>Финансиране и лизинг</li>
						<li>Бартер и замяна</li>
						<li>Съдействие с документите</li>
						<li>Оглед в София</li>
					</ul>
				</div>

				<a class="mobile-detail-sheet__dealer" href={resolve('/contact')}>
					<MapPin size={17} strokeWidth={2.3} />
					<div>
						<strong>{daynightSite.shortName}</strong>
						<span>{daynightSite.mapLabel}</span>
					</div>
				</a>
			</div>
		</Drawer.Content>
	</Drawer.Root>

	{#if shareState}
		<div class="mobile-detail__toast">{shareState}</div>
	{/if}
</main>

<style>
	.mobile-detail {
		position: relative;
		display: none;
		height: 100svh;
		overflow: hidden;
		background: #dfe5eb;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	@media (max-width: 991px) {
		.mobile-detail {
			display: block;
		}
	}

	.mobile-detail__media {
		position: absolute;
		z-index: 1;
		inset: 0 0 auto;
		/* --pdp-media-h = viewport - collapsed snap, set from the same JS numbers
		   vaul uses, so the photo ends exactly at the resting sheet edge (svh and
		   innerHeight disagree when the mobile URL bar collapses). The extra 24px
		   bleeds the photo under the sheet so rounding or URL-bar shifts can never
		   expose a strip of grey page background; the thumbs offset compensates. */
		height: calc(var(--pdp-media-h, 42svh) + 24px);
		overflow: hidden;
		background: #dfe5eb;
	}

	.mobile-detail__media > img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.mobile-detail__media-photo {
		position: relative;
		z-index: 1;
		object-fit: cover;
		object-position: center top;
	}

	.mobile-detail__media > :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		padding: 34px;
		background: #f1f4f9;
		object-fit: contain;
	}

	.mobile-detail__shade {
		position: absolute;
		inset: 0;
		/* Top scrim: the photo sliver that stays visible above the fully expanded
		   sheet (it keeps back/save/share reachable) reads as a deliberate dimmed
		   gallery edge instead of a washed-out band of sky. */
		background:
			linear-gradient(180deg, rgba(6, 7, 8, 0.42), rgba(6, 7, 8, 0) 132px),
			linear-gradient(0deg, rgba(6, 7, 8, 0.13), rgba(6, 7, 8, 0) 38%);
		pointer-events: none;
	}

	.mobile-detail__topbar {
		position: absolute;
		z-index: 6;
		top: calc(12px + env(safe-area-inset-top));
		right: var(--sa-mobile-gutter);
		left: var(--sa-mobile-gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
		pointer-events: none;
	}

	.mobile-detail__topbar-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.mobile-detail__nav-button--save.is-saved {
		color: var(--sa-red) !important;
	}

	.mobile-detail__nav-button--compare.is-saved {
		color: var(--sa-red) !important;
	}

	.mobile-detail__nav-button--save.is-saved :global(svg) {
		fill: currentColor;
	}

	.mobile-detail__nav-button {
		display: grid;
		box-sizing: border-box;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.97);
		padding: 0;
		color: #111315 !important;
		font-size: 0;
		line-height: 0;
		text-decoration: none;
		appearance: none;
		backdrop-filter: saturate(1.15) blur(10px);
		box-shadow:
			0 7px 18px rgba(15, 23, 42, 0.16),
			inset 0 0 0 1px rgba(255, 255, 255, 0.72);
		margin: 0;
		cursor: pointer;
		pointer-events: auto;
		-webkit-appearance: none;
		-webkit-tap-highlight-color: transparent;
	}

	.mobile-detail__nav-button:active {
		transform: translateY(1px);
	}

	.mobile-detail__nav-button:focus-visible {
		outline: 3px solid rgba(47, 122, 255, 0.36);
		outline-offset: 2px;
	}

	.mobile-detail__nav-button :global(svg) {
		display: block;
		width: 19px;
		height: 19px;
		flex: 0 0 auto;
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.mobile-detail__nav-button--back :global(svg) {
		width: 22px;
		height: 22px;
		transform: translateX(-0.5px);
	}

	.mobile-detail__nav-button--share :global(svg) {
		width: 18px;
		height: 18px;
		transform: translateY(-0.5px);
	}

	.mobile-detail__nav-button :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.mobile-detail :global(svg),
	.mobile-detail :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-detail__thumbs {
		position: absolute;
		z-index: 6;
		right: var(--sa-mobile-gutter);
		/* 14px above the sheet edge: media bottom carries a 24px under-sheet bleed. */
		bottom: 38px;
		left: var(--sa-mobile-gutter);
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding: 2px 1px;
		scrollbar-width: none;
	}

	.mobile-detail__thumbs::-webkit-scrollbar {
		display: none;
	}

	.mobile-detail__thumbs button {
		display: block;
		flex: 0 0 58px;
		width: 58px;
		height: 44px;
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.88);
		border-radius: 9px;
		background: rgba(255, 255, 255, 0.9);
		padding: 0;
		box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
		cursor: pointer;
	}

	.mobile-detail__thumbs button.is-active {
		border-color: var(--sa-red);
	}

	.mobile-detail__thumbs img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mobile-detail__thumbs :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		padding: 6px;
		background: #f1f4f9;
		object-fit: contain;
	}

	:global(.mobile-detail-sheet) {
		position: fixed;
		z-index: 8;
		top: 0;
		right: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: calc(100svh - 52px - env(safe-area-inset-top));
		min-height: 0;
		overflow: hidden;
		border-radius: 22px 22px 0 0;
		background: var(--sa-surface);
		padding: 0 var(--sa-mobile-gutter) calc(12px + env(safe-area-inset-bottom));
		color: var(--sa-ink);
		font-family: var(--sa-font);
		outline: none;
		box-shadow: 0 -24px 64px rgba(15, 23, 42, 0.22);
		transform: translate3d(0, 42svh, 0);
	}

	/* Snappier settle. vaul ships a 0.5s transform transition (its default) and
	   re-asserts it inline on every snap release — slower than native sheets
	   (Material ~300ms, iOS ~400ms). Shorten it, scoped to :not(.vaul-dragging)
	   and flagged !important so it beats vaul's inline 0.5s on the release WITHOUT
	   touching the inline `transition: none` vaul sets during the drag itself, so
	   the handle still tracks the finger 1:1 — only the let-go animation is quicker. */
	:global(.mobile-detail-sheet:not(.vaul-dragging)) {
		transition: transform 0.36s cubic-bezier(0.32, 0.72, 0, 1) !important;
	}

	.mobile-detail-sheet__handle-zone {
		display: grid;
		flex: 0 0 auto;
		min-height: 24px;
		place-items: start stretch;
		padding-top: 8px;
		touch-action: none;
	}

	.mobile-detail-sheet__head,
	.mobile-detail-sheet__actions,
	.mobile-detail-tabs {
		touch-action: none;
	}

	:global(.mobile-detail-sheet__handle[data-vaul-handle]) {
		position: relative;
		width: 100% !important;
		height: 18px !important;
		margin: 0;
		border-radius: 0;
		background: transparent !important;
	}

	:global(.mobile-detail-sheet__handle[data-vaul-handle]::before) {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: var(--sa-mobile-drawer-handle-w);
		height: 5px;
		border-radius: 999px;
		background: #cfd7df;
		transform: translateX(-50%);
	}

	.mobile-detail-sheet__head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) max-content;
		grid-template-areas:
			'brand monthly'
			'title price';
		align-items: center;
		gap: 4px 12px;
		flex: 0 0 auto;
		padding: 0 0 6px;
	}

	.mobile-detail-sheet__brand {
		grid-area: brand;
		color: var(--sa-faint);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		letter-spacing: 0.075em;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-detail-sheet__title {
		grid-area: title;
		display: -webkit-box;
		overflow: hidden;
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.11;
		padding: 1px 0 2px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.mobile-detail-sheet__price {
		grid-area: price;
		display: grid;
		gap: 2px;
		justify-items: end;
		align-self: center;
		text-align: right;
	}

	.mobile-detail-sheet__price-monthly {
		grid-area: monthly;
		justify-self: end;
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
	}

	.mobile-detail-sheet__price-eur {
		color: var(--sa-price);
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1;
		white-space: nowrap;
	}

	.mobile-detail-sheet__price-bgn {
		/* was #7a838d (3.85:1 on white — fails WCAG-AA for 14px text);
		   --sa-muted #6a7480 lifts it to 4.75:1 while staying a quiet sub-line. */
		color: var(--sa-muted);
		font-size: var(--sa-text-sm);
		font-weight: 600;
		line-height: 1;
		text-transform: none;
		white-space: nowrap;
	}

	.mobile-detail-sheet__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		flex: 0 0 auto;
		padding-bottom: 7px;
	}

	.mobile-detail-sheet__actions a {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 13px;
		background: #eef1f6;
		color: var(--sa-ink) !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		min-width: 0;
		padding: 0 10px;
		white-space: nowrap;
		cursor: pointer;
	}

	.mobile-detail-sheet__actions a.is-primary {
		background: var(--sa-red);
		color: #fff !important;
		font-weight: 800;
	}

	.mobile-detail-sheet__actions a.is-viber {
		/* Viber purple, nudged from #7360f2 (4.48:1 white text — just under AA)
		   to #6e5ce8 (4.82:1) so the label clears WCAG-AA while staying on-brand. */
		background: #6e5ce8;
		color: #fff !important;
		font-weight: 800;
	}

	.mobile-detail-sheet__actions a :global(svg),
	.mobile-detail-sheet__actions a :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.mobile-detail-sheet__actions a.is-viber .mobile-detail-sheet__viber-mark,
	.mobile-detail-sheet__actions a.is-viber .mobile-detail-sheet__viber-mark * {
		width: 18px;
		height: 19px;
		color: #fff !important;
		fill: currentColor !important;
		stroke: currentColor !important;
	}

	.mobile-detail-sheet__actions a.is-viber .mobile-detail-sheet__viber-mark [fill='none'] {
		fill: none !important;
	}

	.mobile-detail-tabs {
		display: grid;
		position: relative;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		flex: 0 0 auto;
		min-height: 44px;
		margin: 1px 0 4px;
		/* Tabs span the full width in equal thirds (original positioning). The active
		   underline sits 8px in from each tab edge on a hairline divider — rounded,
		   2px, native underline-tab look (geometry from the pawtreon inline-tabs).
		   This switcher no longer competes with the filled CTA pills above it. */
		border-bottom: 1px solid #e8ecf2;
	}

	.mobile-detail-tabs button {
		display: inline-flex;
		position: relative;
		min-width: 0;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		color: #667281;
		font-size: var(--sa-text-sm);
		font-weight: 700;
		letter-spacing: 0;
		padding: 0 8px;
		outline: none;
		cursor: pointer;
		transition: color 0.16s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.mobile-detail-tabs button::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		height: 3px;
		/* Spans the full tab width (each equal third), on the divider line (-1px
		   overlaps the 1px border), 3px tall, rounded caps — native underline tab. */
		border-radius: 999px;
		background: var(--sa-blue);
		opacity: 0;
		transition: opacity 0.16s ease;
	}

	.mobile-detail-tabs__label {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		padding: 0 2px;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* The sheet is portaled to <body>, so the template's global span color
		   reaches it and would paint dark text on the active blue segment. */
		color: inherit !important;
	}

	.mobile-detail-tabs button:focus {
		outline: none !important;
		box-shadow: none !important;
	}

	.mobile-detail-tabs button:focus-visible:not(.is-active) {
		border-radius: 10px;
		outline: 3px solid rgba(47, 122, 255, 0.32) !important;
		outline-offset: -3px;
	}

	.mobile-detail-tabs button.is-active {
		color: #8a0000;
		font-weight: 800;
	}

	.mobile-detail-tabs button.is-active::after {
		opacity: 1;
	}

	.mobile-detail-sheet__content {
		display: grid;
		flex: 1 1 auto;
		gap: 12px;
		align-content: start;
		min-height: 0;
		overflow-y: hidden;
		padding: 10px 0 18px;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		scrollbar-width: none;
		touch-action: none;
	}

	:global(.mobile-detail-sheet[data-expanded='false']) .mobile-detail-sheet__content {
		overflow-y: hidden;
		touch-action: none;
	}

	:global(.mobile-detail-sheet[data-full='true']) .mobile-detail-sheet__content {
		overflow-y: auto;
		padding-bottom: 8px;
		touch-action: pan-y;
	}

	.mobile-detail-sheet__content::-webkit-scrollbar {
		display: none;
	}

	.mobile-detail__spec-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mobile-detail__spec-grid div {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		grid-template-rows: auto auto;
		gap: 2px 6px;
		align-items: center;
		min-height: 58px;
		border: 1px solid #e2e8ef;
		border-radius: 10px;
		background: #f7f9fb;
		padding: 9px 10px;
	}

	.mobile-detail__spec-icon {
		grid-row: span 2;
		display: grid;
		width: 30px;
		height: 30px;
		place-items: center;
		border-radius: 9px;
		background: #fff;
		color: #8b6811;
		box-shadow: inset 0 0 0 1px rgba(176, 0, 0, 0.12);
	}

	.mobile-detail__spec-icon :global(.daynight-spec-icon) {
		color: currentColor;
	}

	.mobile-detail__spec-grid span {
		color: #7a838d;
		font-size: var(--sa-text-xs);
		font-weight: 600;
		line-height: 1;
		text-transform: none;
	}

	.mobile-detail__spec-grid strong {
		min-width: 0;
		overflow: hidden;
		color: #111315;
		font-size: var(--sa-text-base);
		font-weight: 700;
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-detail__section {
		display: grid;
		gap: 8px;
	}

	.mobile-detail__section h2 {
		margin: 0;
		color: #111315;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.15;
	}

	.mobile-detail__section p {
		margin: 0;
		color: #626c76;
		font-size: var(--sa-text-sm);
		font-weight: 500;
		line-height: 1.48;
	}

	.mobile-detail__section .mobile-detail__section-lead {
		color: #4f5a65;
		font-weight: 600;
		line-height: 1.38;
	}

	.mobile-detail__section dl,
	.mobile-detail__section ul {
		display: grid;
		gap: 7px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-detail__section dl div,
	.mobile-detail__section li {
		display: flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 1px solid #e2e8ef;
		border-radius: 9px;
		background: #f7f9fb;
		padding: 0 10px;
	}

	.mobile-detail__section dt {
		color: #7a838d;
		font-size: var(--sa-text-xs);
		font-weight: 600;
	}

	.mobile-detail__section dd,
	.mobile-detail__section li {
		color: #111315;
		font-size: var(--sa-text-sm);
		font-weight: 600;
	}

	.mobile-detail__section dd {
		margin: 0;
		text-align: right;
	}

	.mobile-detail-sheet__dealer {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 58px;
		border: 1px solid #e1e9f1;
		border-radius: 11px;
		background: var(--sa-fill);
		padding: 9px 11px;
		color: inherit;
		text-decoration: none;
	}

	.mobile-detail-sheet__dealer :global(svg) {
		box-sizing: border-box;
		width: 32px;
		height: 32px;
		flex: 0 0 32px;
		border-radius: 10px;
		background: #fff;
		padding: 7px;
		color: #8b6811;
		box-shadow: inset 0 0 0 1px rgba(176, 0, 0, 0.11);
	}

	.mobile-detail-sheet__dealer div {
		display: grid;
		gap: 1px;
		min-width: 0;
	}

	.mobile-detail-sheet__dealer strong {
		color: #111315;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.18;
	}

	.mobile-detail-sheet__dealer span {
		overflow: hidden;
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 600;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: none;
	}

	.mobile-detail-sheet__offer {
		display: grid;
		gap: 8px;
		border: 1px solid #e2e8ef;
		border-radius: 11px;
		background: var(--sa-fill);
		padding: 10px 11px;
	}

	.mobile-detail-sheet__offer > strong {
		color: #111315;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-detail-sheet__offer-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 7px 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-detail-sheet__offer-list li {
		position: relative;
		padding-left: 15px;
		color: #4f5a65;
		font-size: var(--sa-text-xs);
		font-weight: 600;
		line-height: 1.25;
	}

	.mobile-detail-sheet__offer-list li::before {
		content: '';
		position: absolute;
		top: 0.46em;
		left: 1px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--sa-blue);
	}

	.mobile-detail__toast {
		position: fixed;
		z-index: 75;
		top: calc(16px + env(safe-area-inset-top));
		left: 50%;
		border-radius: 999px;
		background: rgba(17, 19, 21, 0.92);
		padding: 8px 12px;
		color: #fff;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		transform: translateX(-50%);
	}
</style>
