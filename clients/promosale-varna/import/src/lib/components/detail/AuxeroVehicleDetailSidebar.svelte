<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import AuxeroVehicleOverview from './AuxeroVehicleOverview.svelte';
	import { templateInquiryCopy } from '$lib/data/template-settings';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	let inquiryStatus = $state('');
	let inquirySubmitting = $state(false);
	let paymentMode = $state<'cash' | 'finance'>('cash');
	let buyboxTablistEl = $state<HTMLUListElement>();

	const buyboxModes = ['cash', 'finance'] as const;

	// WAI-ARIA tabs pattern: roving focus + activation via arrow/Home/End keys.
	const handleBuyboxKeydown = async (event: KeyboardEvent) => {
		const current = paymentMode === 'cash' ? 0 : 1;
		let next: number;

		if (event.key === 'ArrowRight') next = current >= 1 ? 0 : current + 1;
		else if (event.key === 'ArrowLeft') next = current <= 0 ? 1 : current - 1;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = 1;
		else return;

		event.preventDefault();
		if (inquirySubmitting) return;
		inquirySubmitting = true;
		inquiryStatus = '';
		paymentMode = buyboxModes[next];
		await tick();
		buyboxTablistEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	};
	const showMarketplacePhone = $derived(
		detail.contact.marketplacePhoneHref !== detail.contact.primaryPhoneHref ||
			detail.contact.marketplacePhoneLabel !== detail.contact.primaryPhoneLabel
	);
	const directHref = (href: string) => ({ href });

	const handleInquirySubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const payload = Object.fromEntries(new FormData(form).entries());

		try {
			const response = await fetch(resolve('/api/inquiries'), {
				body: JSON.stringify({
					...payload,
					source: 'vehicle-detail',
					vehicleSlug: detail.slug
				}),
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok || !result.ok || !result.data?.inquiry?.id) throw new Error('Not saved');
			inquiryStatus = templateInquiryCopy.success;
			form.reset();
		} catch {
			inquiryStatus = 'Заявката не е запазена. Провери данните и опитай отново.';
		} finally {
			inquirySubmitting = false;
		}
	};
</script>

{#snippet priceInfo(popId: string)}
	<span class="daynight-price-info">
		<button
			type="button"
			class="daynight-price-info__trigger"
			aria-label={detail.copy.priceInBgnAria}
			aria-describedby={popId}
		>
			<img src="/assets/icons/Info.svg" alt="" aria-hidden="true" />
			<span class="text-underline text-highlight">{detail.priceBgn}</span>
		</button>
		<span class="daynight-price-info__pop" id={popId} role="tooltip">
			<span class="daynight-price-info__label">{detail.copy.priceInBgn}</span>
			<span class="daynight-price-info__amount">{detail.priceBgn}</span>
			<span class="daynight-price-info__note">{detail.copy.bgnRateNote}</span>
		</span>
	</span>
{/snippet}

<div class="listing-details--sidebar">
	<div class="listing-details--sidebar-box daynight-buybox-card mb-40">
		<div class="flat-tabs">
			<div class="mb-15 overflow-x-auto">
				<ul
					class="menu-tab menu-tab-style5 grid-cols-2"
					role="tablist"
					aria-label={detail.copy.price}
					bind:this={buyboxTablistEl}
					onkeydown={handleBuyboxKeydown}
				>
					<li class={[paymentMode === 'cash' && 'active']} role="presentation">
						<button
							type="button"
							class="daynight-buybox-mode"
							role="tab"
							id="daynight-buybox-cash-tab"
							aria-controls="daynight-buybox-cash-panel"
							aria-selected={paymentMode === 'cash'}
							tabindex={paymentMode === 'cash' ? 0 : -1}
							onclick={() => (paymentMode = 'cash')}
						>
							{detail.copy.cash}
						</button>
					</li>
					<li class={[paymentMode === 'finance' && 'active']} role="presentation">
						<button
							type="button"
							class="daynight-buybox-mode"
							role="tab"
							id="daynight-buybox-finance-tab"
							aria-controls="daynight-buybox-finance-panel"
							aria-selected={paymentMode === 'finance'}
							tabindex={paymentMode === 'finance' ? 0 : -1}
							onclick={() => (paymentMode = 'finance')}
						>
							{detail.copy.finance}
						</button>
					</li>
				</ul>
			</div>

			<div class="content-tab visible">
				<div
					class={['content-inner', paymentMode === 'cash' && 'active']}
					id="daynight-buybox-cash-panel"
					role="tabpanel"
					aria-labelledby="daynight-buybox-cash-tab"
				>
					<p class="h5 mb-4">{detail.copy.price}</p>
					<p class="h4 mb-4">{detail.priceLabel}</p>
					<p class="text-secondary mb-16">
						{detail.copy.priceIntro}
					</p>

					{@render priceInfo('daynight-buybox-bgn-cash')}

					<div class="daynight-buybox-actions">
						<a
							href={resolve('/contact')}
							class="btn btn-primary btn-medium font-weight-600 daynight-buybox-action"
						>
							{detail.copy.subjectViewing}
						</a>
						<a
							{...directHref(detail.contact.primaryPhoneHref)}
							class="btn btn-primary btn-medium font-weight-600 daynight-buybox-action"
						>
							{detail.copy.callCta}
						</a>
					</div>
				</div>

				<div
					class={['content-inner', paymentMode === 'finance' && 'active']}
					id="daynight-buybox-finance-panel"
					role="tabpanel"
					aria-labelledby="daynight-buybox-finance-tab"
				>
					<p class="h5 mb-4">{detail.copy.monthlyTitle}</p>
					<p class="h4 mb-4">{detail.monthlyLabel}</p>
					<p class="text-secondary mb-4">
						{detail.copy.financeIntro}
					</p>
					<p class="text-secondary mb-16">{detail.copy.financeTerms}</p>

					{@render priceInfo('daynight-buybox-bgn-finance')}
				</div>
			</div>
		</div>
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<p class="h5 mb-4">{detail.copy.carOverview}</p>
		<AuxeroVehicleOverview items={detail.overviewItems} />
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<div class="listing-details--contact">
			<div class="listing-details--contact-dealer mb-28">
				<img
					src={detail.consultant.image}
					alt=""
					width="96"
					height="96"
					loading="lazy"
					decoding="async"
				/>

				<div class="content">
					<a href={resolve('/contact')} class="h4 font-weight-600 mb-8">{detail.consultant.name}</a>

					<p class="verify">
						<img src="/assets/icons/SealCheck.svg" alt="" aria-hidden="true" />
						<span class="text-highlight text-sm">{detail.copy.consultantLabel}</span>
					</p>
				</div>
			</div>

			<ul class="contact-info mb-20">
				<li>
					<p class="icon"><img src="/assets/icons/MapPin.svg" alt="" aria-hidden="true" /></p>
					<div class="flex flex-col gap-4">
						<a href={resolve('/contact')}>
							{detail.contact.address}
						</a>
						<a href={resolve('/contact')} class="text-underline text-highlight text-sm"
							>{detail.copy.directions}</a
						>
					</div>
				</li>
			</ul>
			<ul class="contact-info mb-28">
				<li class="items-center">
					<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="" aria-hidden="true" /></p>
					<div class="flex flex-col">
						<a href={resolve('/contact')}>
							{detail.contact.primaryPhoneLabel}
						</a>
						{#if showMarketplacePhone}
							<a href={resolve('/contact')}>
								{detail.contact.marketplacePhoneLabel}
							</a>
						{/if}
					</div>
				</li>
			</ul>

			<a
				{...directHref(detail.contact.primaryPhoneHref)}
				class="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
			>
				<img src="/assets/icons/PhoneCall-2.svg" alt="" aria-hidden="true" />
				{detail.copy.callDayNight}
			</a>

			<a
				{...directHref(detail.contact.viberHref)}
				class="btn btn-medium btn-primary-4 daynight-viber-action font-weight-600 gap-5"
				rel="noreferrer"
			>
				<img src="/assets/icons/ChatCircleDots.svg" alt="" aria-hidden="true" />
				{detail.copy.chatOnViber}
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16">{detail.copy.inquiryTitle}</p>

		<form action="#" class="send-inquiry" onsubmit={handleInquirySubmit}>
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">{detail.copy.name}</p>
					<input
						aria-label={detail.copy.name}
						autocomplete="name"
						class="input-large"
						id="SendInquiryname"
						name="SendInquiryname"
						type="text"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">{detail.copy.email}</p>
					<input
						aria-label={detail.copy.email}
						autocomplete="email"
						class="input-large"
						name="SendInquiryemail"
						id="SendInquiryemail"
						type="email"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">{detail.copy.phone}</p>
					<input
						aria-label={detail.copy.phone}
						placeholder={detail.copy.phone}
						class="input-large"
						name="SendInquiryphone"
						id="SendInquiryphone"
						type="tel"
						inputmode="tel"
						autocomplete="tel"
						value=""
						required
					/>
				</div>

				<div>
					<p class="mb-8">{detail.copy.subject}</p>
					<select
						aria-label={detail.copy.subject}
						id="SendInquirysubject"
						name="SendInquirysubject"
					>
						<option>{detail.copy.subjectAvailability}</option>
						<option>{detail.copy.subjectDocuments}</option>
						<option>{detail.copy.subjectViewing}</option>
					</select>
				</div>

				<div class="padding-0">
					<p class="mb-6">{detail.copy.message}</p>
					<textarea
						placeholder={detail.copy.messagePlaceholder}
						rows="3"
						name="message"
						class="message"
						id="message"
						required
					></textarea>
				</div>
			</div>
			<p class="text-secondary text-sm">{templateInquiryCopy.notice}</p>
			<button
				disabled={inquirySubmitting}
				class="btn btn-primary btn-large font-weight-600 mb-18 w-full"
				>{detail.copy.sendInquiry}</button
			>
			<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite">
				{inquiryStatus}
			</p>
			<label class="filter-checkbox style-2 mb-6">
				<input type="checkbox" name="features" value="touch-screen" />
				<span class="text-sm">
					{detail.copy.formConsent}
				</span>
			</label>

			<p class="text-secondary text-xs">
				{detail.copy.formTerms}
				<a href={resolve('/contact')} class="text-underline text-highlight text-xs">
					{detail.copy.formTermsLink}
				</a>
			</p>
		</form>
	</div>
</div>

<style>
	.daynight-buybox-actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		margin-top: 18px;
	}

	.daynight-buybox-action {
		min-height: 44px;
		padding-inline: 18px;
	}

	@media (max-width: 1199px) {
		.daynight-buybox-actions {
			grid-template-columns: 1fr;
		}
	}

	/* Accessible price-in-BGN tooltip. CSS-only (hover + focus-within) so it works
	   for mouse, keyboard and touch, and needs no JS / hydration to function. */
	.daynight-price-info {
		position: relative;
		display: inline-flex;
	}

	.daynight-price-info__trigger {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.daynight-price-info__trigger:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: 3px;
		border-radius: 6px;
	}

	.daynight-price-info__pop {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 0;
		z-index: 30;
		width: max-content;
		max-width: 280px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 14px;
		border-radius: 8px;
		background: #1c1c1c;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 12px 30px rgba(28, 28, 28, 0.28);
		opacity: 0;
		visibility: hidden;
		transform: translateY(4px);
		transition:
			opacity 140ms ease,
			transform 140ms ease,
			visibility 140ms;
		pointer-events: none;
	}

	.daynight-price-info:focus-within .daynight-price-info__pop {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		pointer-events: auto;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-price-info:hover .daynight-price-info__pop {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
			pointer-events: auto;
		}
	}

	.daynight-price-info__pop::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 18px;
		border: 6px solid transparent;
		border-top-color: #1c1c1c;
	}

	/* The global `* { color: #1c1c1c }` reset would paint these invisible on the
	   dark popover, so set ink explicitly (matches the pattern used elsewhere). */
	.daynight-price-info__label {
		color: rgba(255, 255, 255, 0.66) !important;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.daynight-price-info__amount {
		color: #ffffff !important;
		font-size: 18px;
		font-weight: 700;
	}

	.daynight-price-info__note {
		color: rgba(255, 255, 255, 0.74) !important;
		font-size: 12px;
		line-height: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.daynight-price-info__pop {
			transition: none;
			transform: none;
		}
	}
</style>
