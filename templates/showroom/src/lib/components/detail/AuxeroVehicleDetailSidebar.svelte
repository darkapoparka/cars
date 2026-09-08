<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import AuxeroVehicleOverview from './AuxeroVehicleOverview.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	let inquiryStatus = $state('');
	let inquiryStatusType = $state<'success' | 'error' | ''>('');
	let inquirySubmitting = $state(false);
	let paymentMode = $state<'cash' | 'finance'>('cash');
	let buyboxTablistEl = $state<HTMLUListElement>();
	let inquiryFormEl = $state<HTMLFormElement>();

	const buyboxModes = ['cash', 'finance'] as const;
	const inquiryErrorMessage = 'Провери името и добави телефон или валиден имейл.';

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
		paymentMode = buyboxModes[next];
		await tick();
		buyboxTablistEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	};
	const showMarketplacePhone = $derived(
		detail.contact.marketplacePhoneHref !== detail.contact.primaryPhoneHref ||
			detail.contact.marketplacePhoneLabel !== detail.contact.primaryPhoneLabel
	);
	const directHref = (href: string) => ({ href });
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
		inquiryStatus = 'Моля попълни име, валиден телефон и кратък коментар.';
		inquiryStatusType = 'error';
		invalidField.focus();
		return true;
	};

	const prepareInquiry = async (subject: string) => {
		inquiryStatus = '';
		inquiryStatusType = '';
		await tick();
		inquiryFormEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		const subjectField = inquiryFormEl?.elements.namedItem('SendInquirysubject');
		if (subjectField instanceof HTMLSelectElement) subjectField.value = subject;

		inquiryFormEl
			?.querySelector<HTMLInputElement>('input[name="SendInquiryname"]')
			?.focus({ preventScroll: true });
	};

	const handleInquirySubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		event.stopImmediatePropagation();

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
					source: 'vehicle-detail',
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
		} catch {
			inquiryStatus = inquiryErrorMessage;
			inquiryStatusType = 'error';
		} finally {
			inquirySubmitting = false;
		}
	};
</script>

{#snippet priceInfo(popId: string)}
	<span class="eliqauto-price-info">
		<button
			type="button"
			class="eliqauto-price-info__trigger"
			aria-label={detail.copy.priceInBgnAria}
			aria-describedby={popId}
		>
			<img src="/assets/icons/Info.svg" alt="" aria-hidden="true" />
			<span class="text-underline text-highlight">{detail.priceBgn}</span>
		</button>
		<span class="eliqauto-price-info__pop" id={popId} role="tooltip">
			<span class="eliqauto-price-info__label">{detail.copy.priceInBgn}</span>
			<span class="eliqauto-price-info__amount">{detail.priceBgn}</span>
			<span class="eliqauto-price-info__note">{detail.copy.bgnRateNote}</span>
		</span>
	</span>
{/snippet}

<div class="listing-details--sidebar">
	<div class="listing-details--sidebar-box mb-40">
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
							class="eliqauto-buybox-mode"
							role="tab"
							id="eliqauto-buybox-cash-tab"
							aria-controls="eliqauto-buybox-cash-panel"
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
							class="eliqauto-buybox-mode"
							role="tab"
							id="eliqauto-buybox-finance-tab"
							aria-controls="eliqauto-buybox-finance-panel"
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
					id="eliqauto-buybox-cash-panel"
					role="tabpanel"
					aria-labelledby="eliqauto-buybox-cash-tab"
				>
					<p class="h5 mb-4">{detail.copy.price}</p>
					<p class="h4 mb-4">{detail.priceLabel}</p>
					<p class="text-secondary mb-16">
						{detail.copy.priceIntro}
					</p>

					{@render priceInfo('eliqauto-buybox-bgn-cash')}

					<div class="eliqauto-buybox-actions">
						<button
							type="button"
							class="btn btn-primary btn-medium font-weight-600 eliqauto-buybox-action"
							onclick={() => prepareInquiry(detail.copy.subjectViewing)}
						>
							{detail.copy.subjectViewing}
						</button>
						<a
							{...directHref(detail.contact.primaryPhoneHref)}
							class="btn btn-primary btn-medium font-weight-600 eliqauto-buybox-action"
						>
							{detail.copy.callCta}
						</a>
					</div>
				</div>

				<div
					class={['content-inner', paymentMode === 'finance' && 'active']}
					id="eliqauto-buybox-finance-panel"
					role="tabpanel"
					aria-labelledby="eliqauto-buybox-finance-tab"
				>
					<p class="h5 mb-4">{detail.copy.monthlyTitle}</p>
					<p class="h4 mb-4">{detail.monthlyLabel}</p>
					<p class="text-secondary mb-4">
						{detail.copy.financeIntro}
					</p>
					<p class="text-secondary mb-16">{detail.copy.financeTerms}</p>

					{@render priceInfo('eliqauto-buybox-bgn-finance')}

					<div class="eliqauto-buybox-actions">
						<button
							type="button"
							class="btn btn-primary btn-medium font-weight-600 eliqauto-buybox-action"
							onclick={() => prepareInquiry(detail.copy.finance)}
						>
							{detail.copy.finance}
						</button>
						<a
							{...directHref(detail.contact.primaryPhoneHref)}
							class="btn btn-primary btn-medium font-weight-600 eliqauto-buybox-action"
						>
							{detail.copy.callCta}
						</a>
					</div>
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
			<div class="listing-details--contact-dealer eliqauto-seller-identity mb-28">
				<div class="eliqauto-seller-identity__brand" aria-hidden="true">
					<img
						src={eliqautoAssets.logoLight}
						alt=""
						width="1487"
						height="203"
						loading="lazy"
						decoding="async"
					/>
				</div>

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
						<a {...directHref(detail.contact.primaryPhoneHref)}>
							{detail.contact.primaryPhoneLabel}
						</a>
						{#if showMarketplacePhone}
							<a {...directHref(detail.contact.marketplacePhoneHref)}>
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
				{detail.copy.callEliqauto}
			</a>

			<a
				{...directHref(detail.contact.viberHref)}
				class="btn btn-medium btn-primary-4 font-weight-600 gap-5"
				rel="noreferrer"
			>
				<img src="/assets/icons/ChatCircleDots.svg" alt="" aria-hidden="true" />
				{detail.copy.chatOnViber}
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16">{detail.copy.inquiryTitle}</p>

		<form
			action="#"
			class="send-inquiry"
			id="vehicle-inquiry"
			novalidate
			onsubmit={handleInquirySubmit}
			bind:this={inquiryFormEl}
		>
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">{detail.copy.name}</p>
					<input
						aria-label={detail.copy.name}
						autocomplete="name"
						class="active input-large"
						id="SendInquiryname"
						name="SendInquiryname"
						type="text"
						value=""
						required
						oninput={clearInvalidState}
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
						oninput={clearInvalidState}
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
						pattern={'[+0-9][0-9 ()-]{6,}'}
						value=""
						required
						oninput={clearInvalidState}
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
						<option>{detail.copy.finance}</option>
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
						oninput={clearInvalidState}
					></textarea>
				</div>
			</div>
			<button
				type="submit"
				class="btn btn-primary btn-large font-weight-600 mb-18 w-full"
				disabled={inquirySubmitting}
				>{inquirySubmitting ? 'Изпращане...' : detail.copy.sendInquiry}</button
			>
			{#if inquiryStatus}
				<p
					id="vehicle-inquiry-status"
					class={[
						'auxero-form-status font-weight-600 mt-12',
						inquiryStatusType === 'error' ? 'text-danger' : 'text-highlight'
					]}
					aria-live="polite"
				>
					{inquiryStatus}
				</p>
			{/if}
			<label class="filter-checkbox style-2 mb-6">
				<input type="checkbox" name="marketingConsent" value="yes" />
				<span class="text-sm">
					{detail.copy.formConsent}
				</span>
			</label>

			<p class="text-secondary text-sm">
				{detail.copy.formTerms}
				<a href={resolve('/terms')} class="text-underline text-highlight text-sm">
					{detail.copy.formTermsLink}
				</a>
			</p>
		</form>
	</div>
</div>

<style>
	.eliqauto-seller-identity {
		align-items: flex-start;
		flex-direction: column;
		gap: 12px;
	}

	.eliqauto-seller-identity__brand {
		display: flex;
		flex: 0 0 auto;
		width: 124px;
		min-height: 0;
		align-items: flex-start;
		justify-content: center;
		padding-top: 0;
	}

	.eliqauto-seller-identity__brand img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 20px;
		border-radius: 0;
		object-fit: contain;
		object-position: center;
	}

	.eliqauto-seller-identity .content {
		min-width: 0;
		width: 100%;
	}

	.eliqauto-buybox-actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		margin-top: 18px;
	}

	.eliqauto-buybox-action {
		min-height: 44px;
		padding-inline: 18px;
	}

	.eliqauto-buybox-actions .eliqauto-buybox-action:first-child {
		border-color: #a51717;
		background: #a51717;
		color: #ffffff;
	}

	.eliqauto-buybox-actions .eliqauto-buybox-action:last-child {
		border: 1px solid var(--bc-border);
		background: #ffffff;
		color: #1c1c1c;
	}

	@media (max-width: 1199px) {
		.eliqauto-buybox-actions {
			grid-template-columns: 1fr;
		}
	}

	/* Accessible price-in-BGN tooltip. CSS-only (hover + focus-within) so it works
	   for mouse, keyboard and touch, and needs no JS / hydration to function. */
	.eliqauto-price-info {
		position: relative;
		display: inline-flex;
	}

	.eliqauto-price-info__trigger {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.eliqauto-price-info__trigger:focus-visible {
		outline: 2px solid #a51717;
		outline-offset: 3px;
		border-radius: 6px;
	}

	.eliqauto-price-info__pop {
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
		background: #2a0c0c;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 12px 30px rgba(20, 33, 15, 0.28);
		opacity: 0;
		visibility: hidden;
		transform: translateY(4px);
		transition:
			opacity 140ms ease,
			transform 140ms ease,
			visibility 140ms;
		pointer-events: none;
	}

	.eliqauto-price-info:focus-within .eliqauto-price-info__pop {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		pointer-events: auto;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-price-info:hover .eliqauto-price-info__pop {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
			pointer-events: auto;
		}
	}

	.eliqauto-price-info__pop::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 18px;
		border: 6px solid transparent;
		border-top-color: #2a0c0c;
	}

	/* The global `* { color: #1c1c1c }` reset would paint these invisible on the
	   dark popover, so set ink explicitly (matches the pattern used elsewhere). */
	.eliqauto-price-info__label {
		color: rgba(255, 255, 255, 0.66);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 19px;
		text-transform: uppercase;
	}

	.eliqauto-price-info__amount {
		color: #ffffff;
		font-size: 18px;
		font-weight: 700;
	}

	.eliqauto-price-info__note {
		color: rgba(255, 255, 255, 0.74);
		font-size: 14px;
		line-height: 20px;
	}

	@media (prefers-reduced-motion: reduce) {
		.eliqauto-price-info__pop {
			transition: none;
			transform: none;
		}
	}
</style>
