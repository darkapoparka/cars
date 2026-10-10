<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { contentText } from '$lib/content/localized';
	const english = $derived(page.data.locale === 'en');
	import { assetHref } from '$lib/utils/assets';
	import { getGarageContext } from '$lib/state/garage.svelte';
	const garage = getGarageContext();
	import { submitIntake } from '$lib/browser/submit-intake';
	import { receiptMessage } from '$lib/domain/inquiry';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { linkHref as resolve } from '$lib/utils/links';
	import type { AuxeroVehicleDetailData, AuxeroVehicleDetailDrawerTabId } from '$lib/auxero/detail';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import GitCompare from '@lucide/svelte/icons/git-compare';
	import Heart from '@lucide/svelte/icons/heart';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import Send from '@lucide/svelte/icons/send';
	import Share2 from '@lucide/svelte/icons/share-2';
	import X from '@lucide/svelte/icons/x';
	import { Drawer } from 'vaul-svelte';
	import { templateInquiryCopy } from '$lib/data/template-settings';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import MobileIconAction from '$lib/components/common/MobileIconAction.svelte';
	import { trackKeyboardInset } from '$lib/utils/keyboard-inset';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();

	const compareHref = $derived(resolve('/compare'));
	const externalHref = (href: string) => ({ href });
	const drawerRestingSnapPoint = 0.66;
	const drawerExpandedSnapPoint = 0.92;
	const drawerSnapPoints = [drawerRestingSnapPoint, drawerExpandedSnapPoint];

	let activeTab = $state<AuxeroVehicleDetailDrawerTabId>('info');
	let activeDrawerSnapPoint = $state<number | string | null>(drawerSnapPoints[0]);
	let drawerOpen = $state(true);
	let drawerContentEl = $state<HTMLElement | null>(null);
	let selectedImageIndex = $state(0);
	let galleryPointerId = $state<number | null>(null);
	let galleryStartX = $state(0);
	let galleryStartY = $state(0);
	let gallerySwiped = $state(false);
	let shareStatus = $state('');
	let viewerOpen = $state(false);
	const inquiryFormId = $props.id();
	let inquiryOpen = $state(false);
	$effect(() => {
		if (!inquiryOpen) return;
		return trackKeyboardInset();
	});
	let inquiryStatus = $state('');
	let inquirySubmitting = $state(false);
	let inquirySaved = $state(false);
	let inquirySession = 0;

	const heroGalleryImages = $derived(Array.from(new Set(detail.galleryImages)));
	const heroImage = $derived(heroGalleryImages[selectedImageIndex] ?? detail.image);

	$effect(() => {
		if (!browser || heroGalleryImages.length < 2) return;
		const adjacent = [
			(selectedImageIndex - 1 + heroGalleryImages.length) % heroGalleryImages.length,
			(selectedImageIndex + 1) % heroGalleryImages.length
		];
		for (const index of adjacent) {
			const src = heroGalleryImages[index];
			if (!src || src === heroImage) continue;
			const image = new Image();
			image.decoding = 'async';
			image.src = assetHref(src);
		}
	});
	const primaryFacts = $derived(detail.overviewItems.slice(0, 4));
	const specItems = $derived(detail.overviewItems.slice(0, 10));
	const featureGroups = $derived(detail.featureTabs.filter((tab) => tab.items.length > 0));
	const contentTabs = $derived(
		detail.mobileDrawer.tabs.filter((tab) => ['info', 'specs', 'features'].includes(tab.id))
	);
	const drawerSnapOffset = $derived.by(() => {
		const snap =
			typeof activeDrawerSnapPoint === 'number' ? activeDrawerSnapPoint : drawerRestingSnapPoint;
		return `${Math.round((1 - snap) * 100)}dvh`;
	});

	// vaul only updates `activeDrawerSnapPoint` once a drag *settles*, so the snap-based
	// bottom padding (which keeps the scroll panel flush with the visible fold) lags behind
	// the live drag — exposing the sheet's empty padding as a white strip that only fills in
	// on release. While the sheet is being dragged or is animating to its snap point, mirror
	// its real on-screen position into the padding var each frame so content tracks the drag.
	// On settle we drop the inline override and let the reactive `drawerSnapOffset` govern again.
	$effect(() => {
		const el = drawerContentEl;
		if (!el || !browser) return;

		const offsetVar = '--daynight-mobile-pdp-snap-offset';
		let rafId = 0;
		let settleTimer = 0;
		let running = false;

		const syncOffset = () => {
			const offset = Math.max(0, el.getBoundingClientRect().bottom - window.innerHeight);
			el.style.setProperty(offsetVar, `${offset}px`);
		};

		const tick = () => {
			syncOffset();
			if (running) rafId = requestAnimationFrame(tick);
		};

		const start = () => {
			window.clearTimeout(settleTimer);
			if (running) return;
			running = true;
			rafId = requestAnimationFrame(tick);
		};

		const stop = () => {
			running = false;
			cancelAnimationFrame(rafId);
			// Hand control back to the reactive (settled) value.
			el.style.removeProperty(offsetVar);
		};

		const endAfterSettle = () => {
			window.clearTimeout(settleTimer);
			// Keep mirroring through vaul's snap animation (~0.5s) before releasing.
			settleTimer = window.setTimeout(stop, 600);
		};

		el.addEventListener('pointerdown', start);
		window.addEventListener('pointerup', endAfterSettle);
		window.addEventListener('pointercancel', endAfterSettle);

		return () => {
			el.removeEventListener('pointerdown', start);
			window.removeEventListener('pointerup', endAfterSettle);
			window.removeEventListener('pointercancel', endAfterSettle);
			window.clearTimeout(settleTimer);
			cancelAnimationFrame(rafId);
		};
	});

	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (image.getAttribute('src') !== assetHref(detail.imageFallback)) {
			image.src = assetHref(detail.imageFallback);
		}
	};

	const beginGallerySwipe = (event: PointerEvent) => {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		galleryPointerId = event.pointerId;
		galleryStartX = event.clientX;
		galleryStartY = event.clientY;
		gallerySwiped = false;
		try {
			(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		} catch {
			// Pointer capture is optional on older mobile WebKit versions.
		}
	};

	const finishGallerySwipe = (event: PointerEvent) => {
		if (galleryPointerId !== event.pointerId) return;
		const deltaX = event.clientX - galleryStartX;
		const deltaY = event.clientY - galleryStartY;
		galleryPointerId = null;
		if (
			heroGalleryImages.length > 1 &&
			Math.abs(deltaX) >= 48 &&
			Math.abs(deltaX) > Math.abs(deltaY) * 1.2
		) {
			gallerySwiped = true;
			const direction = deltaX < 0 ? 1 : -1;
			selectedImageIndex =
				(selectedImageIndex + direction + heroGalleryImages.length) % heroGalleryImages.length;
		}
	};

	const cancelGallerySwipe = () => {
		galleryPointerId = null;
	};

	const activateHeroImage = () => {
		if (gallerySwiped) {
			gallerySwiped = false;
			return;
		}
		openImageViewer(selectedImageIndex);
	};

	const goBack = () => {
		if (browser && window.history.length > 1) {
			window.history.back();
			return;
		}

		goto(resolve('/inventory'));
	};

	const shareVehicle = async () => {
		if (!browser) return;

		const url = window.location.href;

		try {
			if (navigator.share) {
				await navigator.share({
					text: detail.description,
					title: detail.title,
					url
				});
				return;
			}

			await navigator.clipboard?.writeText(url);
			shareStatus = detail.mobileDrawer.copiedLabel;
			window.setTimeout(() => {
				shareStatus = '';
			}, 1800);
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
		}
	};

	const openInquiry = () => {
		inquirySession += 1;
		// Start each inquiry session clean so a previous success message doesn't linger
		// under a fresh, empty form when the drawer is reopened.
		inquiryStatus = '';
		inquirySaved = false;
		inquirySubmitting = false;
		inquiryOpen = true;
	};

	const closeInquiry = () => {
		inquirySession += 1;
		inquiryOpen = false;
	};

	const submitInquiry = async (event: SubmitEvent) => {
		event.preventDefault();
		if (inquirySubmitting) return;
		inquirySaved = false;
		inquiryStatus = '';

		const form = event.currentTarget as HTMLFormElement;
		const session = inquirySession;
		const payload = Object.fromEntries(new FormData(form).entries());

		inquirySubmitting = true;

		try {
			const receipt = await submitIntake('/api/inquiries', {
				...payload,
				source: 'vehicle-detail-mobile',
				vehicleSlug: detail.slug
			});
			if (!inquiryOpen || session !== inquirySession) return;
			inquirySaved = true;
			inquiryStatus = receiptMessage(receipt, english);
			form.reset();
		} catch {
			if (!inquiryOpen || session !== inquirySession) return;
			inquiryStatus = english
				? 'The request was not saved. Check the details and try again.'
				: 'Заявката не е запазена. Провери данните и опитай отново.';
		} finally {
			if (inquiryOpen && session === inquirySession) {
				inquirySubmitting = false;
				await tick();
				form.querySelector<HTMLElement>('[aria-live]')?.scrollIntoView({ block: 'nearest' });
			}
		}
	};

	const openImageViewer = (index: number) => {
		selectedImageIndex = index;
		viewerOpen = true;
	};

	const closeImageViewer = () => {
		viewerOpen = false;
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;

		if (viewerOpen) {
			closeImageViewer();
		} else if (inquiryOpen) {
			closeInquiry();
		}
	};
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<svelte:head>
	<style>
		@media (max-width: 767.98px) {
			html,
			body {
				background: #111111 !important;
				height: 100dvh !important;
				overflow: hidden !important;
				padding-bottom: 0 !important;
				scrollbar-width: none !important;
				width: 100% !important;
			}

			html::-webkit-scrollbar,
			body::-webkit-scrollbar {
				display: none !important;
			}

			body section.pb-100 {
				padding-bottom: 0 !important;
			}
		}
	</style>
</svelte:head>

<section
	class="daynight-mobile-pdp"
	data-mobile-pdp-root
	aria-label={detail.title}
	style:--daynight-mobile-pdp-snap-offset={drawerSnapOffset}
>
	<div class="daynight-mobile-pdp__hero" data-mobile-pdp-hero>
		<button
			type="button"
			class="daynight-mobile-pdp__image-button"
			aria-label={`${detail.mobileDrawer.photoLabel} ${selectedImageIndex + 1}`}
			onpointerdown={beginGallerySwipe}
			onpointerup={finishGallerySwipe}
			onpointercancel={cancelGallerySwipe}
			onclick={activateHeroImage}
		>
			<img
				class="daynight-mobile-pdp__image"
				src={assetHref(heroImage)}
				alt={detail.title}
				width="900"
				height="1200"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				onerror={useFallbackImage}
			/>
		</button>
		<div class="daynight-mobile-pdp__shade"></div>
		{#if heroGalleryImages.length > 1}
			<p class="daynight-mobile-pdp__photo-count" aria-live="polite">
				{selectedImageIndex + 1} / {heroGalleryImages.length}
			</p>
		{/if}

		<div class="daynight-mobile-pdp__topbar" data-mobile-pdp-topbar>
			<MobileIconAction label={detail.mobileDrawer.backLabel} appearance="overlay" onclick={goBack}>
				<ArrowLeft size={20} strokeWidth={2} aria-hidden="true" />
			</MobileIconAction>

			<div class="daynight-mobile-pdp__topbar-actions">
				<MobileIconAction href={compareHref} label={detail.copy.compare} appearance="overlay">
					<GitCompare size={20} strokeWidth={2} aria-hidden="true" />
				</MobileIconAction>
				<MobileIconAction
					label={detail.copy.savePrefix}
					pressed={garage.isFavorite(detail.slug)}
					appearance="overlay"
					onclick={() => garage.toggleFavorite(detail.slug)}
				>
					<Heart size={20} strokeWidth={2} aria-hidden="true" />
				</MobileIconAction>
				<MobileIconAction
					label={detail.mobileDrawer.shareLabel}
					appearance="overlay"
					onclick={shareVehicle}
				>
					<Share2 size={20} strokeWidth={2} aria-hidden="true" />
				</MobileIconAction>
			</div>
		</div>

		{#if shareStatus}
			<p class="daynight-mobile-pdp__toast" aria-live="polite">
				<Check size={16} strokeWidth={2.4} aria-hidden="true" />
				{shareStatus}
			</p>
		{/if}
	</div>

	<Drawer.Root
		bind:open={drawerOpen}
		bind:activeSnapPoint={activeDrawerSnapPoint}
		direction="bottom"
		dismissible={false}
		modal={false}
		snapPoints={drawerSnapPoints}
		snapToSequentialPoint={true}
	>
		<Drawer.Content
			class="daynight-mobile-pdp__drawer"
			data-mobile-pdp-drawer
			bind:ref={drawerContentEl}
			trapFocus={false}
		>
			<Drawer.Handle class="daynight-mobile-pdp__handle" preventCycle={true} />

			<div class="daynight-mobile-pdp__drawer-heading">
				<Drawer.Title level={1} class="daynight-mobile-pdp__heading-title">
					<span class="daynight-mobile-pdp__drawer-title" title={detail.title}>{detail.title}</span>
				</Drawer.Title>
				<div class="daynight-mobile-pdp__price-row">
					<p>{detail.priceLabel}</p>
					<span>{detail.monthlyLabel}</span>
				</div>
			</div>

			<div class="daynight-mobile-pdp__actions" aria-label={detail.copy.inquiryTitle}>
				<button
					type="button"
					class="daynight-mobile-pdp__cta daynight-mobile-pdp__cta--primary"
					onclick={openInquiry}
				>
					<Send size={16} strokeWidth={2} aria-hidden="true" />
					{detail.copy.inquiryCta}
				</button>
				<a
					class="daynight-mobile-pdp__cta daynight-mobile-pdp__cta--call"
					{...externalHref(detail.contact.primaryPhoneHref)}
				>
					<PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
					{detail.copy.callCta}
				</a>
			</div>

			<Drawer.Description>
				<span class="daynight-mobile-pdp__drawer-description">{detail.description}</span>
			</Drawer.Description>

			<div class="daynight-mobile-pdp__tabs" aria-label={detail.copy.getToKnow} role="tablist">
				{#each contentTabs as tab (tab.id)}
					<button
						type="button"
						role="tab"
						data-mobile-pdp-tab
						class={['daynight-mobile-pdp__tab', activeTab === tab.id && 'active']}
						aria-selected={activeTab === tab.id}
						onclick={() => {
							activeTab = tab.id;
						}}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<div class="daynight-mobile-pdp__panel" role="tabpanel" tabindex="0" data-vaul-no-drag>
				{#if activeTab === 'info'}
					<div class="daynight-mobile-pdp__section">
						<div class="daynight-mobile-pdp__facts" aria-label={detail.copy.carOverview}>
							{#each primaryFacts as item (item.label)}
								<div>
									<img src={assetHref(`/assets/icons/${item.icon}`)} alt="" aria-hidden="true" />
									<span>{item.value}</span>
								</div>
							{/each}
						</div>

						<div class="daynight-mobile-pdp__description">
							<p class="daynight-mobile-pdp__eyebrow">{detail.copy.description}</p>
							<p class="daynight-mobile-pdp__body-copy">{detail.description}</p>
						</div>

						<div class="daynight-mobile-pdp__finance">
							<div>
								<span>{detail.copy.cash}</span>
								<strong>{detail.priceLabel}</strong>
								<small>{detail.copy.priceIntro}</small>
							</div>
							<div>
								<span>{detail.copy.finance}</span>
								<strong>{detail.monthlyLabel}</strong>
								<small>{detail.copy.financeTerms}</small>
							</div>
						</div>
					</div>
				{:else if activeTab === 'specs'}
					<ul class="daynight-mobile-pdp__spec-list">
						{#each specItems as item (item.label)}
							<li>
								<span>
									<img src={assetHref(`/assets/icons/${item.icon}`)} alt="" aria-hidden="true" />
									{item.label}
								</span>
								<strong>{item.value}</strong>
							</li>
						{/each}
					</ul>
				{:else if activeTab === 'features'}
					<div class="daynight-mobile-pdp__feature-groups">
						{#each featureGroups as group (group.label)}
							<section>
								<h2>{group.label}</h2>
								<ul>
									{#each group.items as feature, featureIndex (`${group.label}-${featureIndex}`)}
										<li>
											<Check size={16} strokeWidth={2.4} aria-hidden="true" />
											{feature}
										</li>
									{/each}
								</ul>
							</section>
						{/each}
					</div>
				{/if}
			</div>
		</Drawer.Content>
	</Drawer.Root>

	<MobileSheet
		bind:open={inquiryOpen}
		title={detail.copy.inquiryTitle}
		description={detail.title}
		contentClass="daynight-mobile-pdp__inquiry"
		onclose={closeInquiry}
	>
		<p class="daynight-mobile-pdp__inquiry-intro">
			{contentText(english ? 'en' : 'bg', templateInquiryCopy.notice)}
		</p>
		<form
			id={inquiryFormId}
			class="daynight-mobile-pdp__inquiry-form"
			onsubmit={submitInquiry}
			aria-busy={inquirySubmitting}
		>
			<label>
				<span>{detail.copy.name}</span>
				<input name="name" type="text" autocomplete="name" required />
			</label>
			<label>
				<span>{detail.copy.phone}</span>
				<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required />
			</label>
			<label>
				<span>{detail.copy.subject}</span>
				<select name="subject">
					<option>{detail.copy.subjectViewing}</option>
					<option>{detail.copy.subjectAvailability}</option>
					<option>{detail.copy.subjectDocuments}</option>
				</select>
			</label>
			<label>
				<span>{detail.copy.message}</span>
				<textarea name="message" rows="3" placeholder={detail.copy.messagePlaceholder}></textarea>
			</label>

			<p class="daynight-mobile-pdp__inquiry-status" aria-live="polite">
				{#if inquirySaved}
					<Check size={16} strokeWidth={2.4} aria-hidden="true" />
				{/if}
				{inquiryStatus}
			</p>
		</form>

		<a class="daynight-mobile-pdp__inquiry-call" {...externalHref(detail.contact.primaryPhoneHref)}>
			<PhoneCall size={18} strokeWidth={2.3} aria-hidden="true" />
			{detail.contact.primaryPhoneLabel}
		</a>
		{#snippet footer()}
			{#if inquirySaved}
				<button type="button" class="daynight-mobile-pdp__inquiry-submit" onclick={closeInquiry}>
					{detail.mobileDrawer.closeLabel}
				</button>
			{:else}
				<button
					type="submit"
					form={inquiryFormId}
					class="daynight-mobile-pdp__inquiry-submit"
					disabled={inquirySubmitting}
				>
					<Send size={18} strokeWidth={2.3} aria-hidden="true" />
					{inquirySubmitting ? (english ? 'Saving…' : 'Запазване…') : detail.copy.sendInquiry}
				</button>
			{/if}
		{/snippet}
	</MobileSheet>

	<MobileSheet
		bind:open={viewerOpen}
		title={detail.mobileDrawer.photoLabel}
		mode="full"
		showHeader={false}
		showHandle={false}
		contentClass="daynight-mobile-pdp__viewer-sheet"
	>
		<div class="daynight-mobile-pdp__viewer" data-mobile-pdp-viewer>
			<MobileIconAction
				class="daynight-mobile-pdp__viewer-close"
				label={detail.mobileDrawer.closeLabel}
				appearance="overlay"
				onclick={closeImageViewer}
			>
				<X size={20} strokeWidth={2} aria-hidden="true" />
			</MobileIconAction>

			<p class="daynight-mobile-pdp__viewer-count">
				{selectedImageIndex + 1} / {heroGalleryImages.length}
			</p>

			<div class="daynight-mobile-pdp__viewer-stage">
				<img
					src={assetHref(heroImage)}
					alt={detail.title}
					width="900"
					height="1200"
					loading="lazy"
					decoding="async"
					onerror={useFallbackImage}
				/>
			</div>

			<div class="daynight-mobile-pdp__viewer-thumbs" aria-label={detail.mobileDrawer.photoLabel}>
				{#each heroGalleryImages as image, index (image)}
					<button
						type="button"
						class={selectedImageIndex === index ? 'active' : ''}
						aria-current={selectedImageIndex === index ? 'true' : undefined}
						aria-label={`${detail.mobileDrawer.photoLabel} ${index + 1}`}
						onclick={() => {
							selectedImageIndex = index;
						}}
					>
						<img
							src={assetHref(image)}
							alt=""
							width="96"
							height="72"
							loading="lazy"
							decoding="async"
							onerror={useFallbackImage}
						/>
					</button>
				{/each}
			</div>
		</div>
	</MobileSheet>
</section>

<style>
	.daynight-mobile-pdp {
		display: none;
	}

	@media (max-width: 767.98px) {
		.daynight-mobile-pdp {
			position: fixed;
			inset: 0;
			z-index: 1000;
			display: block;
			width: 100%;
			height: 100dvh;
			max-height: 100dvh;
			margin-left: 0;
			overflow: hidden;
			overscroll-behavior: none;
			background: var(--bc-bg);
			color: #ffffff;
			touch-action: manipulation;
		}

		.daynight-mobile-pdp__hero {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 1001;
			height: 58dvh;
			min-height: 400px;
			overflow: hidden;
			background: #111111;
		}

		.daynight-mobile-pdp__image {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}

		.daynight-mobile-pdp__image-button {
			display: block;
			width: 100%;
			height: 100%;
			border: 0;
			background: #111111;
			cursor: zoom-in;
			padding: 0;
			touch-action: pan-y;
		}

		.daynight-mobile-pdp__shade {
			position: absolute;
			inset: 0;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0) 18%);
			pointer-events: none;
		}

		.daynight-mobile-pdp__topbar,
		.daynight-mobile-pdp__toast {
			position: absolute;
			z-index: 1004;
		}

		.daynight-mobile-pdp__topbar {
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			left: 14px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.daynight-mobile-pdp__topbar-actions {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.daynight-mobile-pdp__photo-count {
			position: absolute;
			top: calc(70px + env(safe-area-inset-top));
			left: 14px;
			z-index: 1003;
			margin: 0;
			border-radius: var(--bc-radius-pill);
			background: rgb(9 10 11 / 0.72);
			color: var(--bc-white);
			font-size: var(--bc-mobile-meta);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-meta-leading);
			padding: 7px 10px;
			font-variant-numeric: tabular-nums;
		}

		.daynight-mobile-pdp__facts {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 7px;
			padding: 0;
		}

		.daynight-mobile-pdp__facts div {
			display: flex;
			min-width: 0;
			min-height: 40px;
			align-items: center;
			gap: 7px;
			border-radius: 8px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 7px 10px;
		}

		.daynight-mobile-pdp__facts img {
			width: 17px;
			height: 17px;
			flex: 0 0 17px;
			object-fit: contain;
		}

		.daynight-mobile-pdp__facts span {
			min-width: 0;
			max-width: 100%;
			overflow: hidden;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-control);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-pdp__toast {
			right: 16px;
			top: calc(66px + env(safe-area-inset-top));
			display: inline-flex;
			align-items: center;
			gap: 6px;
			margin: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.92);
			color: #1c1c1c;
			padding: 8px 11px;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__drawer[data-vaul-drawer]) {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1002;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			height: 100dvh;
			overflow: hidden;
			border: 0;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			color: #1c1c1c;
			box-shadow: 0 -20px 46px rgba(0, 0, 0, 0.22);
			/* Match the resting snap before Vaul has measured the viewport. Dragging
			   and settled snap points use Vaul's inline transform after hydration. */
			transform: translateY(34dvh);
			outline: 0;
			padding: 7px 14px
				calc(var(--daynight-mobile-pdp-snap-offset, 40dvh) + 12px + env(safe-area-inset-bottom));
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__handle[data-vaul-handle]) {
			position: relative;
			display: block;
			width: 56px;
			height: 22px;
			min-height: 22px;
			align-items: center;
			justify-content: center;
			align-self: center;
			flex: 0 0 22px;
			border-radius: 0;
			background: transparent;
			opacity: 1;
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__handle[data-vaul-handle])::after {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 34px;
			height: 3px;
			transform: translate(-50%, -50%);
			border-radius: 999px;
			background: var(--bc-border);
			content: '';
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__handle [data-vaul-handle-hitarea]) {
			position: absolute;
			inset: 0;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
			background: transparent;
			transform: none;
		}

		.daynight-mobile-pdp__drawer-heading {
			display: grid;
			min-width: 0;
			flex: 0 0 auto;
			gap: 4px;
			padding: 4px 0 8px;
		}

		.daynight-mobile-pdp__drawer-heading :global(.daynight-mobile-pdp__heading-title) {
			min-width: 0;
			margin: 0;
			font: inherit;
		}

		.daynight-mobile-pdp__price-row {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: 12px;
		}

		.daynight-mobile-pdp__drawer-heading p,
		.daynight-mobile-pdp__drawer-title {
			margin: 0;
			letter-spacing: 0;
		}

		.daynight-mobile-pdp__drawer-heading p {
			color: var(--bc-accent);
			font-size: var(--bc-mobile-card-title);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-card-title-leading);
			white-space: nowrap;
		}

		.daynight-mobile-pdp__drawer-title {
			display: block;
			max-width: 100%;
			overflow: hidden;
			color: #1c1c1c;
			font-size: var(--bc-mobile-section-title);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-section-title-leading);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.daynight-mobile-pdp__price-row > span {
			flex: 0 0 auto;
			color: var(--bc-muted);
			font-size: var(--bc-mobile-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-meta-leading);
			white-space: nowrap;
		}

		.daynight-mobile-pdp__drawer-description {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.daynight-mobile-pdp__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: center;
			flex: 0 0 auto;
			gap: 0;
			overflow: visible;
			border-bottom: 1px solid var(--bc-border);
			padding: 4px 0 0;
		}

		.daynight-mobile-pdp__tab {
			position: relative;
			display: inline-flex;
			width: 100%;
			min-width: 0;
			min-height: 44px;
			align-items: flex-end;
			justify-content: center;
			border: 0;
			border-radius: 8px 8px 0 0;
			background: transparent;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0 4px 8px;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-control);
			line-height: var(--bc-leading-control);
			white-space: nowrap;
		}

		.daynight-mobile-pdp__tab.active {
			background: transparent;
			color: #1c1c1c;
			font-weight: var(--bc-weight-heading);
		}

		.daynight-mobile-pdp__tab:focus-visible {
			outline: 2px solid var(--bc-focus);
			outline-offset: -4px;
		}

		.daynight-mobile-pdp__tab::after {
			position: absolute;
			right: 0;
			bottom: -1px;
			left: 0;
			height: 3px;
			border-radius: 999px 999px 0 0;
			background: transparent;
			content: '';
		}

		.daynight-mobile-pdp__tab.active::after {
			background: var(--bc-accent);
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-mobile-pdp__tab:not(.active):hover {
				background: var(--bc-surface-soft);
				color: #1c1c1c;
			}
		}

		.daynight-mobile-pdp__panel {
			flex: 1 1 auto;
			min-height: 0;
			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: contain;
			padding: 12px 0 12px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.daynight-mobile-pdp__panel::-webkit-scrollbar {
			display: none;
		}

		.daynight-mobile-pdp__section,
		.daynight-mobile-pdp__feature-groups {
			display: grid;
			gap: 13px;
		}

		.daynight-mobile-pdp__eyebrow {
			margin: 0;
			color: #728093;
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
			text-transform: uppercase;
		}

		.daynight-mobile-pdp__description {
			display: grid;
			gap: 10px;
		}

		.daynight-mobile-pdp__body-copy {
			margin: 0;
			color: #343b43;
			white-space: pre-line;
			overflow-wrap: anywhere;
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
			font-weight: var(--bc-weight-body);
		}

		.daynight-mobile-pdp__finance {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.daynight-mobile-pdp__finance div {
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
		}

		.daynight-mobile-pdp__finance span,
		.daynight-mobile-pdp__finance strong,
		.daynight-mobile-pdp__finance small {
			display: block;
			min-width: 0;
		}

		.daynight-mobile-pdp__finance span {
			color: #728093;
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
		}

		.daynight-mobile-pdp__finance strong {
			margin: 3px 0 5px;
			font-size: var(--bc-mobile-card-title);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-card-title-leading);
		}

		.daynight-mobile-pdp__finance small {
			color: #5f6871;
			font-size: var(--bc-mobile-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-meta-leading);
		}

		.daynight-mobile-pdp__spec-list,
		.daynight-mobile-pdp__feature-groups ul {
			display: grid;
			gap: 8px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.daynight-mobile-pdp__description,
		.daynight-mobile-pdp__spec-list,
		.daynight-mobile-pdp__feature-groups section {
			border: 1px solid #e4e7eb;
			border-radius: var(--bc-radius-card);
			background: var(--bc-white);
			padding: var(--bc-space-3);
		}

		.daynight-mobile-pdp__spec-list li {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(96px, auto);
			gap: 12px;
			align-items: center;
			border-bottom: 1px solid var(--bc-border);
			padding: 10px 0;
		}

		.daynight-mobile-pdp__spec-list li:first-child {
			padding-top: 0;
		}

		.daynight-mobile-pdp__spec-list li:last-child {
			border-bottom: 0;
			padding-bottom: 0;
		}

		.daynight-mobile-pdp__spec-list span {
			display: flex;
			min-width: 0;
			align-items: center;
			gap: 8px;
			color: #68727a;
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
		}

		.daynight-mobile-pdp__spec-list img {
			width: 23px;
			height: 23px;
			object-fit: contain;
		}

		.daynight-mobile-pdp__spec-list strong {
			min-width: 0;
			overflow-wrap: anywhere;
			text-align: right;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-control);
		}

		.daynight-mobile-pdp__feature-groups h2 {
			margin: 0 0 9px;
			color: #1c1c1c;
			font-size: var(--bc-mobile-card-title);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-card-title-leading);
		}

		.daynight-mobile-pdp__feature-groups li {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			color: #4c565f;
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
		}

		.daynight-mobile-pdp__feature-groups li :global(svg) {
			flex: 0 0 auto;
			color: var(--bc-accent);
			margin-top: 2px;
		}

		.daynight-mobile-pdp__actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			flex: 0 0 auto;
			gap: 7px;
			padding: 0 0 2px;
		}

		.daynight-mobile-pdp__cta {
			display: inline-flex;
			min-width: 0;
			min-height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			gap: 6px;
			border: 0;
			border-radius: var(--bc-radius-control);
			padding: 6px var(--bc-space-3);
			font-size: var(--bc-text-cta);
			font-weight: var(--bc-weight-action);
			line-height: var(--bc-leading-cta);
			white-space: nowrap;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			transition:
				background-color 0.18s ease,
				color 0.18s ease,
				transform 0.12s ease;
		}

		/* Lucide paths use currentColor, so keep the icon and label in sync. */
		.daynight-mobile-pdp__cta :global(svg),
		.daynight-mobile-pdp__cta :global(svg *) {
			color: inherit;
		}

		.daynight-mobile-pdp__cta :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
			flex-shrink: 0;
		}
		.daynight-mobile-pdp__inquiry-call :global(svg),
		.daynight-mobile-pdp__inquiry-submit :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
			flex-shrink: 0;
		}

		.daynight-mobile-pdp__cta--primary {
			background: var(--bc-accent);
			color: #ffffff;
		}

		.daynight-mobile-pdp__cta--primary:focus-visible {
			background: var(--bc-accent-hover);
		}

		.daynight-mobile-pdp__cta--call {
			background: var(--bc-surface);
			color: var(--bc-ink);
		}

		.daynight-mobile-pdp__cta--call:focus-visible {
			background: var(--bc-surface-hover);
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-mobile-pdp__cta--primary:hover {
				background: var(--bc-accent-hover);
			}

			.daynight-mobile-pdp__cta--call:hover {
				background: var(--bc-surface-hover);
			}
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__inquiry.bc-mobile-sheet__content) {
			width: min(100%, 520px);
			max-height: min(calc(92dvh - var(--bc-kb-inset, 0px)), 780px);
			background: var(--bc-bg-strong);
			color: var(--bc-ink);
		}

		.daynight-mobile-pdp :global(.daynight-mobile-pdp__inquiry .bc-mobile-sheet__body) {
			display: grid;
			gap: var(--bc-space-3);
			padding: var(--bc-space-1) 0 var(--bc-space-2);
		}

		.daynight-mobile-pdp__inquiry-intro {
			display: block;
			margin: -2px 0 2px;
			color: #5f6871;
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
		}

		.daynight-mobile-pdp__inquiry-form {
			display: grid;
			gap: 10px;
		}

		.daynight-mobile-pdp__inquiry-form label {
			display: grid;
			gap: 5px;
		}

		.daynight-mobile-pdp__inquiry-form label span {
			color: #1c1c1c;
			font-size: var(--bc-mobile-label);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-label-leading);
		}

		.daynight-mobile-pdp__inquiry-form input,
		.daynight-mobile-pdp__inquiry-form select,
		.daynight-mobile-pdp__inquiry-form textarea {
			width: 100%;
			min-width: 0;
			border: 0;
			border-radius: 10px;
			background: var(--bc-white);
			color: var(--bc-ink);
			padding: 10px 11px;
			font: inherit;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-control);
		}
		.daynight-mobile-pdp__inquiry-form input,
		.daynight-mobile-pdp__inquiry-form select {
			height: var(--bc-control-height-standard);
			padding-block: 0;
		}
		.daynight-mobile-pdp__inquiry-form select {
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.daynight-mobile-pdp__inquiry-form textarea {
			min-height: 104px;
			resize: none;
		}
		.daynight-mobile-pdp__inquiry-form :is(input, select, textarea):focus-visible {
			outline: 2px solid var(--bc-accent);
			outline-offset: 2px;
		}

		.daynight-mobile-pdp__inquiry-submit {
			display: inline-flex;
			width: 100%;
			min-height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			gap: 8px;
			margin-top: 0;
			border: 0;
			border-radius: 10px;
			background: var(--bc-ink);
			color: var(--bc-white);
			cursor: pointer;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-control);
			transition: background-color 0.18s ease;
		}

		.daynight-mobile-pdp__inquiry-submit:focus-visible {
			background: var(--bc-dark-hover);
			outline: 3px solid var(--bc-focus);
			outline-offset: 2px;
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-mobile-pdp__inquiry-submit:hover {
				background: var(--bc-dark-hover);
			}
		}

		.daynight-mobile-pdp__inquiry-submit:disabled {
			opacity: 0.65;
			cursor: progress;
		}

		.daynight-mobile-pdp__inquiry-status {
			display: flex;
			align-items: center;
			gap: 6px;
			min-height: 18px;
			margin: 0;
			color: #4c5a14;
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
		}

		.daynight-mobile-pdp__inquiry-status :global(svg) {
			color: var(--bc-accent);
		}

		.daynight-mobile-pdp__inquiry-call {
			display: inline-flex;
			min-height: var(--bc-control-height-standard);
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 1px solid var(--bc-border);
			border-radius: 10px;
			background: #ffffff;
			color: #1c1c1c;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-control);
			text-decoration: none;
		}

		.daynight-mobile-pdp__inquiry-call:focus-visible {
			border-color: #1c1c1c;
			outline: 0;
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-mobile-pdp__inquiry-call:hover {
				border-color: #1c1c1c;
				outline: 0;
			}
		}

		.daynight-mobile-pdp__viewer {
			position: relative;
			width: 100%;
			height: 100%;
			display: grid;
			grid-template-rows: auto minmax(0, 1fr) auto;
			background: #050505;
			color: #ffffff;
			padding: calc(14px + env(safe-area-inset-top)) 14px calc(16px + env(safe-area-inset-bottom));
		}

		:global(.daynight-mobile-pdp__viewer-sheet.bc-mobile-sheet__content) {
			padding: 0;
			background: #050505;
		}

		.daynight-mobile-pdp__viewer :global(.daynight-mobile-pdp__viewer-close) {
			position: absolute;
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			z-index: 2;
		}

		.daynight-mobile-pdp__viewer-count {
			align-self: start;
			justify-self: start;
			margin: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.13);
			color: #ffffff;
			padding: 10px 13px;
			font-size: var(--bc-mobile-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-meta-leading);
		}

		.daynight-mobile-pdp__viewer-stage {
			display: flex;
			min-height: 0;
			align-items: center;
			justify-content: center;
			overflow: auto;
			touch-action: pinch-zoom;
			overscroll-behavior: contain;
			padding: 54px 0 20px;
		}

		.daynight-mobile-pdp__viewer-stage img {
			display: block;
			width: 100%;
			max-height: 100%;
			object-fit: contain;
			touch-action: pinch-zoom;
		}

		.daynight-mobile-pdp__viewer-thumbs {
			display: flex;
			gap: 9px;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 4px 0 0;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.daynight-mobile-pdp__viewer-thumbs::-webkit-scrollbar {
			display: none;
		}

		.daynight-mobile-pdp__viewer-thumbs button {
			flex: 0 0 66px;
			width: 66px;
			height: 50px;
			overflow: hidden;
			border: 2px solid rgba(255, 255, 255, 0.28);
			border-radius: 8px;
			background: #111111;
			cursor: pointer;
			padding: 0;
		}

		.daynight-mobile-pdp__viewer-thumbs button.active,
		.daynight-mobile-pdp__viewer-thumbs button:focus-visible {
			border-color: #fee2e2;
			outline: 0;
		}

		.daynight-mobile-pdp__viewer-thumbs img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media (max-width: 380px) {
		.daynight-mobile-pdp__facts {
			gap: 4px;
		}

		.daynight-mobile-pdp__spec-list li {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		}

		.daynight-mobile-pdp__tabs {
			gap: 0;
		}

		.daynight-mobile-pdp__tab {
			font-size: var(--bc-text-control);
			line-height: var(--bc-leading-control);
			font-weight: var(--bc-weight-control);
		}
	}
</style>
