<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData, AuxeroVehicleDetailDrawerTabId } from '$lib/auxero/detail';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { ArrowLeft, Check, GitCompare, Heart, PhoneCall, Send, Share2, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();

	const compareHref = resolve('/compare');
	const externalHref = (href: string) => ({ href });
	const garage = getGarageContext();
	const drawerRestingSnapPoint = 0.66;
	const drawerExpandedSnapPoint = 0.92;
	const drawerSnapPoints = [drawerRestingSnapPoint, drawerExpandedSnapPoint];

	let activeTab = $state<AuxeroVehicleDetailDrawerTabId>('info');
	let activeDrawerSnapPoint = $state<number | string | null>(drawerSnapPoints[0]);
	let drawerOpen = $state(true);
	let drawerContentEl = $state<HTMLElement | null>(null);
	let selectedImageIndex = $state(0);
	let shareStatus = $state('');
	let viewerOpen = $state(false);
	let inquiryOpen = $state(false);
	let inquiryStatus = $state('');
	let inquiryStatusType = $state<'success' | 'error' | ''>('');
	let inquirySubmitting = $state(false);
	let inquirySubject = $state('');
	let viewerDialogEl = $state<HTMLDialogElement | null>(null);
	let viewerCloseEl = $state<HTMLButtonElement | null>(null);
	let viewerReturnFocusEl: HTMLElement | null = null;

	const heroGalleryImages = $derived(Array.from(new Set(detail.galleryImages)));
	const heroImage = $derived(heroGalleryImages[selectedImageIndex] ?? detail.image);
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
	let isSaved = $derived(garage.isFavorite(detail.slug));
	let isCompared = $derived(garage.isCompared(detail.slug));
	let favoriteActionLabel = $derived(
		`${isSaved ? (detail.copy.savePrefix === 'Save' ? 'Remove' : 'Премахни') : detail.copy.savePrefix} ${detail.title}`
	);

	const addToCompare = async () => {
		garage.addCompare(detail.slug);
		await goto(compareHref);
	};

	const toggleFavorite = () => {
		garage.toggleFavorite(detail.slug);
	};

	// vaul only updates `activeDrawerSnapPoint` once a drag *settles*, so the snap-based
	// bottom padding (which keeps the scroll panel flush with the visible fold) lags behind
	// the live drag — exposing the sheet's empty padding as a white strip that only fills in
	// on release. While the sheet is being dragged or is animating to its snap point, mirror
	// its real on-screen position into the padding var each frame so content tracks the drag.
	// On settle we drop the inline override and let the reactive `drawerSnapOffset` govern again.
	$effect(() => {
		const el = drawerContentEl;
		if (!el || !browser) return;

		const offsetVar = '--eliqauto-mobile-pdp-snap-offset';
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

		if (image.src !== detail.imageFallback) {
			image.src = detail.imageFallback;
		}
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

	const inquiryErrorMessage = 'Провери името и добави телефон или валиден имейл.';

	const openInquiry = (subject = detail.copy.subjectViewing) => {
		// Start each inquiry session clean so a previous success message doesn't linger
		// under a fresh, empty form when the drawer is reopened.
		inquiryStatus = '';
		inquiryStatusType = '';
		inquirySubject = subject;
		inquirySubmitting = false;
		inquiryOpen = true;
	};

	const closeInquiry = () => {
		inquiryOpen = false;
	};
	const clearInvalidState = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			event.currentTarget.removeAttribute('aria-invalid');
		}
	};
	const focusFirstInvalidField = (form: HTMLFormElement) => {
		const fields = Array.from(
			form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
				'input, select, textarea'
			)
		);
		for (const field of fields) field.removeAttribute('aria-invalid');
		const invalidField = fields.find((field) => !field.checkValidity());

		if (!invalidField) return false;
		invalidField.setAttribute('aria-invalid', 'true');
		inquiryStatus = 'Моля въведи име и валиден телефон.';
		inquiryStatusType = 'error';
		invalidField.focus();
		return true;
	};

	const submitInquiry = async (event: SubmitEvent) => {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		if (focusFirstInvalidField(form)) return;
		const payload = Object.fromEntries(new FormData(form).entries());

		inquirySubmitting = true;
		inquiryStatus = '';
		inquiryStatusType = '';

		try {
			const response = await fetch('/api/inquiries', {
				body: JSON.stringify({
					...payload,
					source: 'vehicle-detail-mobile',
					vehicleSlug: detail.slug
				}),
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			});

			if (!response.ok) {
				inquiryStatus = inquiryErrorMessage;
				inquiryStatusType = 'error';
				return;
			}

			inquiryStatus = detail.copy.inquirySuccess;
			inquiryStatusType = 'success';
			form.reset();
			inquirySubject = detail.copy.subjectViewing;
		} catch {
			inquiryStatus = inquiryErrorMessage;
			inquiryStatusType = 'error';
		} finally {
			inquirySubmitting = false;
		}
	};

	const openImageViewer = (index: number) => {
		viewerReturnFocusEl =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selectedImageIndex = index;
		drawerOpen = false;
		viewerOpen = true;
		requestAnimationFrame(() => viewerCloseEl?.focus());
	};

	const closeImageViewer = () => {
		viewerOpen = false;
		drawerOpen = true;
		requestAnimationFrame(() => viewerReturnFocusEl?.focus());
	};
	const activateModalDialog = (node: HTMLDialogElement) => {
		if (!node.open) node.showModal();

		return {
			destroy() {
				if (node.open) node.close();
			}
		};
	};
	const handleViewerKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab' || !viewerDialogEl) return;
		const focusable = Array.from(viewerDialogEl.querySelectorAll<HTMLElement>('button, a[href]'));
		if (!focusable.length) return;
		const first = focusable[0];
		const last = focusable.at(-1) ?? first;

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
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
				background: #111111;
				height: 100dvh;
				overflow: hidden;
				padding-bottom: 0;
				scrollbar-width: none;
				width: 100%;
			}

			html::-webkit-scrollbar,
			body::-webkit-scrollbar {
				display: none;
			}

			body header,
			body.auxero-template-listing-details-3-html header,
			body.auxero-template-listing-details-3-html .header,
			body.auxero-template-listing-details-3-html .header-style-3,
			body .mobile-bottom-nav,
			body .progress-wrap,
			body section.mb-22.background-light,
			body .tf-spacing-style4 {
				display: none;
			}

			body section.pb-100 {
				padding-bottom: 0;
			}
		}
	</style>
</svelte:head>

<section
	class="eliqauto-mobile-pdp"
	data-mobile-pdp-root
	aria-label={detail.title}
	style:--eliqauto-mobile-pdp-snap-offset={drawerSnapOffset}
>
	<div class="eliqauto-mobile-pdp__hero" data-mobile-pdp-hero inert={viewerOpen ? true : undefined}>
		<button
			type="button"
			class="eliqauto-mobile-pdp__image-button"
			aria-label={`${detail.mobileDrawer.photoLabel} ${selectedImageIndex + 1}`}
			onclick={() => openImageViewer(selectedImageIndex)}
		>
			<img
				class="eliqauto-mobile-pdp__image"
				src={heroImage}
				alt={detail.title}
				width="900"
				height="1200"
				loading="eager"
				decoding="async"
				fetchpriority="high"
				onerror={useFallbackImage}
			/>
		</button>
		<div class="eliqauto-mobile-pdp__shade"></div>

		<div class="eliqauto-mobile-pdp__topbar" data-mobile-pdp-topbar>
			<button type="button" aria-label={detail.mobileDrawer.backLabel} onclick={goBack}>
				<ArrowLeft size={22} strokeWidth={2.35} aria-hidden="true" />
			</button>

			<div class="eliqauto-mobile-pdp__topbar-actions">
				<button
					type="button"
					class={isCompared ? 'is-active' : undefined}
					aria-label={`${detail.copy.compare} ${detail.title}`}
					aria-pressed={isCompared}
					onclick={addToCompare}
				>
					<GitCompare size={20} strokeWidth={2.35} aria-hidden="true" />
				</button>
				<button
					type="button"
					class={isSaved ? 'is-active' : undefined}
					aria-label={favoriteActionLabel}
					aria-pressed={isSaved}
					onclick={toggleFavorite}
				>
					<Heart
						size={20}
						strokeWidth={2.35}
						fill={isSaved ? 'currentColor' : 'none'}
						aria-hidden="true"
					/>
				</button>
				<button type="button" aria-label={detail.mobileDrawer.shareLabel} onclick={shareVehicle}>
					<Share2 size={21} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</div>
		</div>

		{#if shareStatus}
			<p class="eliqauto-mobile-pdp__toast" aria-live="polite">
				<Check size={16} strokeWidth={2.4} aria-hidden="true" />
				{shareStatus}
			</p>
		{/if}

		{#if heroGalleryImages.length > 1}
			<div
				class="eliqauto-mobile-pdp__hero-thumbs"
				role="group"
				aria-label={detail.mobileDrawer.photoLabel}
			>
				{#each heroGalleryImages as image, index (image)}
					<button
						type="button"
						class={selectedImageIndex === index ? 'active' : ''}
						data-mobile-pdp-thumb
						aria-current={selectedImageIndex === index ? 'true' : undefined}
						aria-label={`${detail.mobileDrawer.photoLabel} ${index + 1}`}
						onclick={() => {
							selectedImageIndex = index;
						}}
					>
						<img
							src={image}
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
			class="eliqauto-mobile-pdp__drawer"
			data-mobile-pdp-drawer
			bind:ref={drawerContentEl}
		>
			<Drawer.Handle class="eliqauto-mobile-pdp__handle" preventCycle={true} />

			<div class="eliqauto-mobile-pdp__drawer-heading">
				<div>
					<p>{detail.priceLabel}</p>
					<Drawer.Title level={1}>
						<span class="eliqauto-mobile-pdp__drawer-title">{detail.title}</span>
					</Drawer.Title>
				</div>
				<span>{detail.monthlyLabel}</span>
			</div>

			<div class="eliqauto-mobile-pdp__actions" role="group" aria-label={detail.copy.inquiryTitle}>
				<button
					type="button"
					class="eliqauto-mobile-pdp__cta eliqauto-mobile-pdp__cta--primary"
					onclick={() => openInquiry(detail.copy.subjectViewing)}
				>
					<Send size={17} strokeWidth={2.3} aria-hidden="true" />
					{detail.copy.inquiryCta}
				</button>
				<a
					class="eliqauto-mobile-pdp__cta eliqauto-mobile-pdp__cta--call"
					{...externalHref(detail.contact.primaryPhoneHref)}
				>
					<PhoneCall size={17} strokeWidth={2.3} aria-hidden="true" />
					{detail.copy.callCta}
				</a>
			</div>

			<Drawer.Description>
				<span class="eliqauto-mobile-pdp__drawer-description">{detail.description}</span>
			</Drawer.Description>

			<div class="eliqauto-mobile-pdp__tabs" aria-label={detail.copy.getToKnow} role="tablist">
				{#each contentTabs as tab (tab.id)}
					<button
						type="button"
						role="tab"
						data-mobile-pdp-tab
						class={['eliqauto-mobile-pdp__tab', activeTab === tab.id && 'active']}
						aria-selected={activeTab === tab.id}
						onclick={() => {
							activeTab = tab.id;
						}}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<div class="eliqauto-mobile-pdp__panel" role="tabpanel" tabindex="0" data-vaul-no-drag>
				{#if activeTab === 'info'}
					<div class="eliqauto-mobile-pdp__section">
						<div
							class="eliqauto-mobile-pdp__facts"
							role="group"
							aria-label={detail.copy.carOverview}
						>
							{#each primaryFacts as item (item.label)}
								<div>
									<img src={`/assets/icons/${item.icon}`} alt="" aria-hidden="true" />
									<span>{item.value}</span>
								</div>
							{/each}
						</div>

						<p class="eliqauto-mobile-pdp__eyebrow">{detail.copy.description}</p>
						<p class="eliqauto-mobile-pdp__body-copy">{detail.description}</p>

						<div class="eliqauto-mobile-pdp__finance">
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

						<button
							type="button"
							class="eliqauto-mobile-pdp__finance-cta"
							onclick={() => openInquiry(detail.copy.finance)}
						>
							<Send size={16} strokeWidth={2.3} aria-hidden="true" />
							{detail.copy.finance}
						</button>
					</div>
				{:else if activeTab === 'specs'}
					<ul class="eliqauto-mobile-pdp__spec-list">
						{#each specItems as item (item.label)}
							<li>
								<span>
									<img src={`/assets/icons/${item.icon}`} alt="" aria-hidden="true" />
									{item.label}
								</span>
								<strong>{item.value}</strong>
							</li>
						{/each}
					</ul>
				{:else if activeTab === 'features'}
					<div class="eliqauto-mobile-pdp__feature-groups">
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

	<Drawer.Root bind:open={inquiryOpen} direction="bottom" fixed={true} handleOnly={true}>
		<Drawer.Overlay class="eliqauto-mobile-pdp__inquiry-backdrop" onclick={closeInquiry}>
			<span>{detail.mobileDrawer.closeLabel}</span>
		</Drawer.Overlay>
		<Drawer.Content
			id="eliqautoMobilePdpInquiryDrawer"
			class="eliqauto-mobile-pdp__inquiry"
			aria-labelledby="eliqautoMobilePdpInquiryTitle"
		>
			<Drawer.Handle class="eliqauto-mobile-pdp__inquiry-handle" preventCycle={true} />

			<div class="eliqauto-mobile-pdp__inquiry-head">
				<div>
					<p>{detail.title}</p>
					<Drawer.Title
						id="eliqautoMobilePdpInquiryTitle"
						class="eliqauto-mobile-pdp__inquiry-title-shell"
						level={2}
					>
						<span class="eliqauto-mobile-pdp__inquiry-title">{detail.copy.inquiryTitle}</span>
					</Drawer.Title>
				</div>
				<button
					type="button"
					class="eliqauto-mobile-pdp__inquiry-close"
					aria-label={detail.mobileDrawer.closeLabel}
					onclick={closeInquiry}
				>
					<X size={20} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</div>

			<Drawer.Description class="eliqauto-mobile-pdp__inquiry-description">
				<span class="eliqauto-mobile-pdp__inquiry-intro">{detail.copy.inquiryIntro}</span>
			</Drawer.Description>

			<form
				class="eliqauto-mobile-pdp__inquiry-form"
				novalidate
				onsubmit={submitInquiry}
				data-vaul-no-drag
			>
				<label>
					<span>{detail.copy.name} <b aria-hidden="true">*</b></span>
					<input name="name" type="text" autocomplete="name" required oninput={clearInvalidState} />
				</label>
				<label>
					<span>{detail.copy.phone} <b aria-hidden="true">*</b></span>
					<input
						name="phone"
						type="tel"
						inputmode="tel"
						autocomplete="tel"
						pattern={'[+0-9][0-9 ()-]{6,}'}
						required
						oninput={clearInvalidState}
					/>
				</label>
				<label>
					<span>{detail.copy.subject}</span>
					<select name="subject" bind:value={inquirySubject}>
						<option>{detail.copy.subjectViewing}</option>
						<option>{detail.copy.subjectAvailability}</option>
						<option>{detail.copy.subjectDocuments}</option>
						<option>{detail.copy.finance}</option>
					</select>
				</label>
				<label>
					<span>{detail.copy.message}</span>
					<textarea name="message" rows="3" placeholder={detail.copy.messagePlaceholder}></textarea>
				</label>

				<button
					type="submit"
					class="eliqauto-mobile-pdp__inquiry-submit"
					disabled={inquirySubmitting}
				>
					<Send size={18} strokeWidth={2.3} aria-hidden="true" />
					{detail.copy.sendInquiry}
				</button>

				{#if inquiryStatus}
					<p
						class={[
							'eliqauto-mobile-pdp__inquiry-status',
							inquiryStatusType === 'error' && 'eliqauto-mobile-pdp__inquiry-status--error'
						]}
						aria-live="polite"
					>
						{#if inquiryStatusType === 'success'}
							<Check size={16} strokeWidth={2.4} aria-hidden="true" />
						{/if}
						{inquiryStatus}
					</p>
				{/if}

				<p class="eliqauto-mobile-pdp__inquiry-trust">
					{detail.copy.formTerms}
					<a href={resolve('/terms')}>{detail.copy.formTermsLink}</a>
				</p>
			</form>

			<a
				class="eliqauto-mobile-pdp__inquiry-call"
				{...externalHref(detail.contact.primaryPhoneHref)}
			>
				<PhoneCall size={18} strokeWidth={2.3} aria-hidden="true" />
				{detail.contact.primaryPhoneLabel}
			</a>
		</Drawer.Content>
	</Drawer.Root>

	{#if viewerOpen}
		<dialog
			class="eliqauto-mobile-pdp__viewer"
			data-mobile-pdp-viewer
			aria-label={detail.mobileDrawer.photoLabel}
			bind:this={viewerDialogEl}
			use:activateModalDialog
			onkeydown={handleViewerKeydown}
		>
			<button
				type="button"
				class="eliqauto-mobile-pdp__viewer-close"
				aria-label={detail.mobileDrawer.closeLabel}
				bind:this={viewerCloseEl}
				onclick={closeImageViewer}
			>
				<X size={24} strokeWidth={2.35} aria-hidden="true" />
			</button>

			<p class="eliqauto-mobile-pdp__viewer-count">
				{selectedImageIndex + 1} / {heroGalleryImages.length}
			</p>

			<div class="eliqauto-mobile-pdp__viewer-stage">
				<img
					src={heroImage}
					alt={detail.title}
					width="900"
					height="1200"
					loading="lazy"
					decoding="async"
					onerror={useFallbackImage}
				/>
			</div>

			<div class="eliqauto-mobile-pdp__viewer-thumbs" aria-label={detail.mobileDrawer.photoLabel}>
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
							src={image}
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
		</dialog>
	{/if}
</section>

<style>
	.eliqauto-mobile-pdp {
		display: none;
	}

	@media (max-width: 767.98px) {
		.eliqauto-mobile-pdp {
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

		.eliqauto-mobile-pdp__hero {
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

		.eliqauto-mobile-pdp__image {
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center;
		}

		.eliqauto-mobile-pdp__image-button {
			display: block;
			width: 100%;
			height: 100%;
			border: 0;
			background: #111111;
			cursor: zoom-in;
			padding: 0;
		}

		.eliqauto-mobile-pdp__shade {
			position: absolute;
			inset: 0;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0) 18%);
			pointer-events: none;
		}

		.eliqauto-mobile-pdp__topbar,
		.eliqauto-mobile-pdp__toast {
			position: absolute;
			z-index: 1004;
		}

		.eliqauto-mobile-pdp__topbar {
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			left: 14px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.eliqauto-mobile-pdp__topbar button {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.92);
			color: #1c1c1c;
			cursor: pointer;
			text-decoration: none;
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
		}

		.eliqauto-mobile-pdp__topbar button:focus-visible {
			background: var(--bc-accent);
			outline: 0;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-mobile-pdp__topbar button:hover {
				background: var(--bc-accent-hover);
				outline: 0;
			}
		}

		.eliqauto-mobile-pdp__topbar-actions {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.eliqauto-mobile-pdp__topbar-actions button.is-active {
			background: var(--bc-accent);
			color: #a51717;
		}

		.eliqauto-mobile-pdp__hero-thumbs {
			position: absolute;
			right: 14px;
			bottom: 24px;
			left: 14px;
			z-index: 1003;
			display: flex;
			gap: 8px;
			overflow-x: auto;
			overflow-y: hidden;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-mobile-pdp__hero-thumbs::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-mobile-pdp__hero-thumbs button {
			position: relative;
			flex: 0 0 58px;
			width: 58px;
			height: 44px;
			overflow: hidden;
			border: 2px solid rgba(255, 255, 255, 0.72);
			border-radius: 8px;
			background: #ffffff;
			cursor: pointer;
			padding: 0;
			box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
		}

		.eliqauto-mobile-pdp__hero-thumbs button.active,
		.eliqauto-mobile-pdp__hero-thumbs button:focus-visible {
			border-color: var(--bc-accent);
			outline: 0;
		}

		.eliqauto-mobile-pdp__hero-thumbs img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.eliqauto-mobile-pdp__facts {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 7px;
			padding: 0;
		}

		.eliqauto-mobile-pdp__facts div {
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

		.eliqauto-mobile-pdp__facts img {
			width: 17px;
			height: 17px;
			flex: 0 0 17px;
			object-fit: contain;
		}

		.eliqauto-mobile-pdp__facts span {
			min-width: 0;
			max-width: 100%;
			overflow: hidden;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 15px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp__toast {
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
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 16px;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__drawer[data-vaul-drawer]) {
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
			outline: 0;
			padding: 7px 14px
				calc(var(--eliqauto-mobile-pdp-snap-offset, 40dvh) + 12px + env(safe-area-inset-bottom));
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__handle[data-vaul-handle]) {
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

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__handle[data-vaul-handle])::after {
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

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__handle [data-vaul-handle-hitarea]) {
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

		.eliqauto-mobile-pdp__drawer-heading {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 14px;
			padding: 4px 0 8px;
		}

		.eliqauto-mobile-pdp__drawer-heading p,
		.eliqauto-mobile-pdp__drawer-title {
			margin: 0;
			letter-spacing: 0;
		}

		.eliqauto-mobile-pdp__drawer-heading p {
			margin-bottom: 3px;
			color: #a51717;
			font-size: 16px;
			font-weight: 800;
			line-height: 20px;
		}

		.eliqauto-mobile-pdp__drawer-title {
			display: -webkit-box;
			color: #1c1c1c;
			overflow: hidden;
			font-size: 20px;
			font-weight: 800;
			line-height: 24px;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.eliqauto-mobile-pdp__drawer-heading > span {
			display: inline-flex;
			min-height: 34px;
			align-items: center;
			flex: 0 0 auto;
			border-radius: 8px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 0 10px;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 15px;
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp__drawer-description {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: center;
			flex: 0 0 auto;
			gap: 0;
			overflow: visible;
			border-bottom: 1px solid var(--bc-border);
			padding: 4px 0 0;
		}

		.eliqauto-mobile-pdp__tab {
			position: relative;
			display: inline-flex;
			width: 100%;
			min-width: 0;
			min-height: 44px;
			align-items: flex-end;
			justify-content: center;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0 4px 8px;
			font-size: 16px;
			font-weight: 800;
			line-height: 18px;
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp__tab.active,
		.eliqauto-mobile-pdp__tab:focus-visible {
			background: transparent;
			color: #1c1c1c;
			outline: 0;
		}

		.eliqauto-mobile-pdp__tab::after {
			position: absolute;
			right: 0;
			bottom: -1px;
			left: 0;
			height: 3px;
			border-radius: 999px 999px 0 0;
			background: transparent;
			content: '';
		}

		.eliqauto-mobile-pdp__tab.active::after,
		.eliqauto-mobile-pdp__tab:focus-visible::after {
			background: #a51717;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-mobile-pdp__tab:hover {
				background: transparent;
				color: #1c1c1c;
				outline: 0;
			}

			.eliqauto-mobile-pdp__tab:hover::after {
				background: #a51717;
			}
		}

		.eliqauto-mobile-pdp__panel {
			flex: 1 1 auto;
			min-height: 0;
			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: contain;
			padding: 12px 0 12px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-mobile-pdp__panel::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-mobile-pdp__section,
		.eliqauto-mobile-pdp__feature-groups {
			display: grid;
			gap: 13px;
		}

		.eliqauto-mobile-pdp__eyebrow {
			margin: 0;
			color: #586070;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 16px;
			text-transform: uppercase;
		}

		.eliqauto-mobile-pdp__body-copy {
			margin: 0;
			color: #5f6871;
			font-size: 15px;
			line-height: 24px;
		}

		.eliqauto-mobile-pdp__finance {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.eliqauto-mobile-pdp__finance div,
		.eliqauto-mobile-pdp__feature-groups section {
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
		}

		.eliqauto-mobile-pdp__finance span,
		.eliqauto-mobile-pdp__finance strong,
		.eliqauto-mobile-pdp__finance small {
			display: block;
			min-width: 0;
		}

		.eliqauto-mobile-pdp__finance span {
			color: #586070;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 16px;
		}

		.eliqauto-mobile-pdp__finance strong {
			margin: 3px 0 5px;
			font-size: 18px;
			font-weight: 800;
			line-height: 22px;
		}

		.eliqauto-mobile-pdp__finance small {
			color: #5f6871;
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 17px;
		}

		.eliqauto-mobile-pdp__finance-cta {
			display: inline-flex;
			width: 100%;
			min-height: 46px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 0;
			border-radius: 10px;
			background: #a51717;
			color: #ffffff;
			cursor: pointer;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}

		.eliqauto-mobile-pdp__finance-cta:focus-visible {
			background: #8a1414;
			color: #ffffff;
			outline: 3px solid rgba(165, 23, 23, 0.22);
			outline-offset: 2px;
		}

		.eliqauto-mobile-pdp__spec-list,
		.eliqauto-mobile-pdp__feature-groups ul {
			display: grid;
			gap: 8px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.eliqauto-mobile-pdp__spec-list li {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(96px, auto);
			gap: 12px;
			align-items: center;
			border-bottom: 1px solid var(--bc-border);
			padding: 10px 0;
		}

		.eliqauto-mobile-pdp__spec-list span {
			display: flex;
			min-width: 0;
			align-items: center;
			gap: 8px;
			color: #68727a;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}

		.eliqauto-mobile-pdp__spec-list img {
			width: 23px;
			height: 23px;
			object-fit: contain;
		}

		.eliqauto-mobile-pdp__spec-list strong {
			min-width: 0;
			overflow-wrap: anywhere;
			text-align: right;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}

		.eliqauto-mobile-pdp__feature-groups h2 {
			margin: 0 0 9px;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 800;
			line-height: 19px;
		}

		.eliqauto-mobile-pdp__feature-groups li {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			color: #4c565f;
			font-size: 14px;
			font-weight: 750;
			line-height: 20px;
		}

		.eliqauto-mobile-pdp__feature-groups li :global(svg) {
			flex: 0 0 auto;
			color: #a51717;
			margin-top: 2px;
		}

		.eliqauto-mobile-pdp__actions {
			display: grid;
			grid-template-columns: 1.25fr 1fr;
			flex: 0 0 auto;
			gap: 8px;
			padding: 0 0 4px;
		}

		.eliqauto-mobile-pdp__cta {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			justify-content: center;
			gap: 7px;
			border: 0;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 800;
			line-height: 16px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			transition:
				background-color 0.18s ease,
				color 0.18s ease,
				transform 0.12s ease;
		}

		.eliqauto-mobile-pdp__cta:active {
			transform: translateY(1px);
		}

		/* app.css sets a global `* { color: #1c1c1c }`, which hits the lucide <svg>
		   AND every <path> directly. The icons stroke with `currentColor`, resolved
		   per-element, so each path drew itself dark — invisible on the dark call
		   button. Re-inherit the button's text color at every level so currentColor
		   resolves to white on both conversion actions. */
		.eliqauto-mobile-pdp__cta :global(svg),
		.eliqauto-mobile-pdp__cta :global(svg *) {
			color: inherit;
		}

		.eliqauto-mobile-pdp__cta--primary {
			background: #a51717;
			color: #ffffff;
		}

		.eliqauto-mobile-pdp__cta--primary:focus-visible {
			background: #8a1414;
			outline: 3px solid rgba(165, 23, 23, 0.22);
			outline-offset: 2px;
		}

		.eliqauto-mobile-pdp__cta--call {
			background: #1c1c1c;
			color: #ffffff;
		}

		.eliqauto-mobile-pdp__cta--call:focus-visible {
			background: #000000;
			outline: 0;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-mobile-pdp__cta--primary:hover {
				background: #8a1414;
				outline: 0;
			}

			.eliqauto-mobile-pdp__cta--call:hover {
				background: #000000;
				outline: 0;
			}
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry[data-vaul-drawer]) {
			box-sizing: border-box;
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1008;
			display: grid;
			gap: 12px;
			width: 100%;
			max-width: 100vw;
			max-height: 90dvh;
			overflow-y: auto;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			color: #1c1c1c;
			padding: 10px 16px calc(18px + env(safe-area-inset-bottom));
			box-shadow: 0 -22px 50px rgba(0, 0, 0, 0.3);
			outline: 0;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-mobile-pdp
			:global(.eliqauto-mobile-pdp__inquiry[data-vaul-drawer]::-webkit-scrollbar) {
			display: none;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-backdrop[data-vaul-overlay]) {
			position: fixed;
			inset: 0;
			z-index: 1007;
			border: 0;
			background: rgba(10, 12, 8, 0.5);
			appearance: none;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-backdrop span) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-handle[data-vaul-handle]) {
			position: relative;
			display: block;
			width: 56px;
			height: 22px;
			justify-self: center;
			border-radius: 0;
			background: transparent;
			opacity: 1;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-handle[data-vaul-handle])::after {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 42px;
			height: 4px;
			transform: translate(-50%, -50%);
			border-radius: 999px;
			background: var(--bc-border);
			content: '';
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-handle [data-vaul-handle-hitarea]) {
			position: absolute;
			inset: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: transparent;
			transform: none;
		}

		.eliqauto-mobile-pdp__inquiry-head {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
			min-width: 0;
		}

		.eliqauto-mobile-pdp__inquiry-head > div {
			min-width: 0;
		}

		.eliqauto-mobile-pdp__inquiry-head p {
			margin: 0 0 2px;
			overflow: hidden;
			color: #586070;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 16px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-title-shell),
		.eliqauto-mobile-pdp :global(.eliqauto-mobile-pdp__inquiry-description) {
			margin: 0;
		}

		.eliqauto-mobile-pdp__inquiry-title {
			display: block;
			color: #1c1c1c;
			font-size: 19px;
			font-weight: 800;
			line-height: 23px;
		}

		.eliqauto-mobile-pdp__inquiry-close {
			display: flex;
			width: 44px;
			height: 44px;
			flex: 0 0 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-mobile-pdp__inquiry-intro {
			display: block;
			margin: -2px 0 2px;
			color: #5f6871;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.eliqauto-mobile-pdp__inquiry-form {
			display: grid;
			gap: 10px;
		}

		.eliqauto-mobile-pdp__inquiry-form label {
			display: grid;
			gap: 6px;
		}

		.eliqauto-mobile-pdp__inquiry-form label span {
			color: #1c1c1c;
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 16px;
		}

		.eliqauto-mobile-pdp__inquiry-form label span b {
			color: #a51717;
			font: inherit;
		}

		.eliqauto-mobile-pdp__inquiry-form input,
		.eliqauto-mobile-pdp__inquiry-form select,
		.eliqauto-mobile-pdp__inquiry-form textarea {
			box-sizing: border-box;
			width: 100%;
			border: 1px solid var(--bc-border);
			border-radius: 10px;
			background: var(--bc-surface-soft);
			color: #1c1c1c;
			padding: 12px 13px;
			font: inherit;
			/* >=16px stops iOS Safari from auto-zooming on focus inside the drawer. */
			font-size: 16px;
			font-weight: 600;
			line-height: 20px;
		}

		.eliqauto-mobile-pdp__inquiry-form textarea {
			resize: none;
		}

		.eliqauto-mobile-pdp__inquiry-form input:focus,
		.eliqauto-mobile-pdp__inquiry-form select:focus,
		.eliqauto-mobile-pdp__inquiry-form textarea:focus {
			border-color: #a51717;
			background: #ffffff;
			outline: 0;
		}

		.eliqauto-mobile-pdp__inquiry-form :global([aria-invalid='true']) {
			border-color: #a51717;
			box-shadow: 0 0 0 3px rgba(165, 23, 23, 0.13);
		}

		.eliqauto-mobile-pdp__inquiry-submit {
			box-sizing: border-box;
			display: inline-flex;
			width: 100%;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			margin-top: 2px;
			border: 0;
			border-radius: 10px;
			background: #a51717;
			color: #ffffff;
			cursor: pointer;
			font-size: 15px;
			font-weight: 800;
			line-height: 19px;
			transition: background-color 0.18s ease;
		}

		.eliqauto-mobile-pdp__inquiry-submit:focus-visible {
			background: #8a1414;
			outline: 3px solid rgba(165, 23, 23, 0.22);
			outline-offset: 2px;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-mobile-pdp__inquiry-submit:hover {
				background: #8a1414;
				outline: 0;
			}
		}

		.eliqauto-mobile-pdp__inquiry-submit:disabled {
			opacity: 0.65;
			cursor: progress;
		}

		.eliqauto-mobile-pdp__inquiry-status {
			display: flex;
			align-items: center;
			gap: 6px;
			min-height: 18px;
			margin: 0;
			color: #4c5a14;
			font-size: 13px;
			font-weight: 800;
			line-height: 18px;
		}

		.eliqauto-mobile-pdp__inquiry-status :global(svg) {
			color: #6ba80f;
		}

		.eliqauto-mobile-pdp__inquiry-status--error {
			color: #a51717;
		}

		.eliqauto-mobile-pdp__inquiry-trust {
			margin: -2px 0 0;
			color: #69707a;
			font-size: var(--bc-text-micro);
			font-weight: 600;
			line-height: 17px;
		}

		.eliqauto-mobile-pdp__inquiry-trust a {
			color: #a51717;
			font: inherit;
			font-weight: 750;
			text-decoration: underline;
			text-underline-offset: 2px;
		}

		.eliqauto-mobile-pdp__inquiry-call {
			box-sizing: border-box;
			display: inline-flex;
			width: 100%;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 1px solid var(--bc-border);
			border-radius: 10px;
			background: #ffffff;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 800;
			line-height: 19px;
			text-decoration: none;
		}

		.eliqauto-mobile-pdp__inquiry-call:focus-visible {
			border-color: #1c1c1c;
			outline: 0;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-mobile-pdp__inquiry-call:hover {
				border-color: #1c1c1c;
				outline: 0;
			}
		}

		.eliqauto-mobile-pdp__viewer {
			position: fixed;
			inset: 0;
			z-index: 1010;
			display: grid;
			width: 100vw;
			max-width: none;
			height: 100dvh;
			max-height: none;
			margin: 0;
			border: 0;
			grid-template-rows: auto minmax(0, 1fr) auto;
			background: #050505;
			color: #ffffff;
			padding: calc(14px + env(safe-area-inset-top)) 14px calc(16px + env(safe-area-inset-bottom));
		}

		.eliqauto-mobile-pdp__viewer::backdrop {
			background: #050505;
		}

		.eliqauto-mobile-pdp__viewer-close {
			position: absolute;
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			z-index: 2;
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.94);
			color: #111111;
			cursor: pointer;
		}

		.eliqauto-mobile-pdp__viewer-count {
			align-self: start;
			justify-self: start;
			margin: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.13);
			color: #ffffff;
			padding: 10px 13px;
			font-size: 13px;
			font-weight: 800;
			line-height: 16px;
		}

		.eliqauto-mobile-pdp__viewer-stage {
			display: flex;
			min-height: 0;
			align-items: center;
			justify-content: center;
			padding: 54px 0 20px;
		}

		.eliqauto-mobile-pdp__viewer-stage img {
			display: block;
			width: 100%;
			max-height: 100%;
			object-fit: contain;
		}

		.eliqauto-mobile-pdp__viewer-thumbs {
			display: flex;
			gap: 9px;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 4px 0 0;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-mobile-pdp__viewer-thumbs::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-mobile-pdp__viewer-thumbs button {
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

		.eliqauto-mobile-pdp__viewer-thumbs button.active,
		.eliqauto-mobile-pdp__viewer-thumbs button:focus-visible {
			border-color: var(--bc-accent);
			outline: 0;
		}

		.eliqauto-mobile-pdp__viewer-thumbs img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media (max-width: 380px) {
		.eliqauto-mobile-pdp__facts {
			gap: 4px;
		}

		.eliqauto-mobile-pdp__drawer-heading > span {
			display: none;
		}

		.eliqauto-mobile-pdp__tabs {
			gap: 0;
		}

		.eliqauto-mobile-pdp__tab {
			font-size: 14px;
		}
	}
</style>
