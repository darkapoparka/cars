<script lang="ts">
	import { resolve } from '$app/paths';
	import { Mail, MapPin, MessageCircle, Navigation, PhoneCall, Plus, X } from '@lucide/svelte';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import { daynightContact } from '$lib/data/daynight';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form, info }: { form: AuxeroContactFormData; info: AuxeroContactPageInfo } = $props();
	let formOpen = $state(false);
	let formTrigger: HTMLButtonElement | null = null;

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const,
			required: true,
			wrapperClass: 'daynight-contact-mobile-form__field'
		})),
		{
			className: 'daynight-contact-mobile-form__message',
			id: 'contact-mobile-message',
			kind: 'textarea' as const,
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: true,
			rows: 3,
			wrapperClass: 'daynight-contact-mobile-form__field'
		}
	]);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		daynightContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const focusableSelector =
		'button, input:not([type="hidden"]), textarea, select, a[href], [tabindex]:not([tabindex="-1"])';

	function openForm(event: MouseEvent) {
		if (event.currentTarget instanceof HTMLButtonElement) formTrigger = event.currentTarget;
		formOpen = true;
		setTimeout(() => {
			document
				.querySelector<HTMLInputElement>('.daynight-contact-mobile-form input')
				?.focus({ preventScroll: true });
		}, 40);
	}

	function closeForm() {
		formOpen = false;
		requestAnimationFrame(() => formTrigger?.focus());
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (!formOpen) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			closeForm();
			return;
		}
		if (event.key !== 'Tab') return;

		const panel = document.querySelector<HTMLElement>('.daynight-contact-mobile-sheet__panel');
		const focusable = panel
			? [...panel.querySelectorAll<HTMLElement>(focusableSelector)].filter(
					(element) => !element.hasAttribute('disabled')
				)
			: [];
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
	class="daynight-contact-mobile"
	data-daynight-contact-mobile
	data-form-open={formOpen ? 'true' : 'false'}
>
	<MobileAppbar surface="dark" />

	<main class="daynight-contact-mobile__main">
		<section class="daynight-contact-mobile__hero" aria-labelledby="contact-mobile-title">
			<div>
				<p>{info.eyebrow}</p>
				<h1 id="contact-mobile-title">{info.title}</h1>
				<span>{info.description}</span>
			</div>
		</section>
		<nav class="daynight-contact-mobile__actions" aria-label="Бърз контакт">
			<a {...hrefAttributes(info.phoneHref)}
				><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />Обади се</a
			>
			<a {...hrefAttributes(daynightContact.viberHref)}
				><MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />Пиши ни</a
			>
			<button
				type="button"
				onclick={openForm}
				aria-label="Отвори форма за контакт"
				aria-haspopup="dialog"
				aria-expanded={formOpen}
				><Plus size={18} strokeWidth={2.35} aria-hidden="true" />Форма</button
			>
		</nav>

		<section class="daynight-contact-mobile__info" aria-label="Данни за контакт">
			<article>
				<span><MapPin size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{info.officeLabel}</p>
					<strong>{daynightContact.addressLabel}</strong>
					<small>{info.workNote}</small>
				</div>
			</article>
			<article>
				<span><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>Телефон</p>
					<a {...hrefAttributes(info.phoneHref)}>{info.phoneLabel}</a>
					{#if info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel}
						<a {...hrefAttributes(info.secondaryPhoneHref)}>{info.secondaryPhoneLabel}</a>
					{/if}
				</div>
			</article>
			<article>
				<span><Mail size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>Онлайн запитване</p>
					<a {...hrefAttributes(info.emailHref)}>{info.emailLabel}</a>
				</div>
			</article>
		</section>

		<section class="daynight-contact-mobile__map-card" aria-label="Локация">
			<div class="daynight-contact-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.45} /></span>
			</div>
			<div>
				<p>Огледи с уговорка</p>
				<strong>{daynightContact.addressLabel}</strong>
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					Отвори карта
					<Navigation size={17} strokeWidth={2.3} aria-hidden="true" />
				</a>
			</div>
		</section>
	</main>

	<div
		id="contact-mobile-form-sheet"
		class="daynight-contact-mobile-sheet"
		role="dialog"
		aria-modal="true"
		aria-labelledby="contact-mobile-form-title"
		aria-hidden={!formOpen}
	>
		<button
			type="button"
			onclick={closeForm}
			class="daynight-contact-mobile-sheet__backdrop"
			aria-label="Затвори формата"
			tabindex="-1"
		></button>

		<div class="daynight-contact-mobile-sheet__panel">
			<span class="daynight-contact-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="daynight-contact-mobile-sheet__header">
				<div>
					<p>Day Night Auto</p>
					<h2 id="contact-mobile-form-title">{form.title}</h2>
				</div>
				<button type="button" onclick={closeForm} aria-label="Затвори">
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</button>
			</header>

			<div class="daynight-contact-mobile-sheet__body">
				<InquiryForm
					{fields}
					buttonClass="daynight-contact-mobile-form__submit"
					formClass="daynight-contact-mobile-form"
					gridClass="daynight-contact-mobile-form__grid"
					idPrefix="mobile-contact"
					showEmptyStatus={false}
					statusClass="daynight-contact-mobile-form__status"
					submitLabel={form.submitLabel}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.daynight-contact-mobile {
		position: relative;
		min-height: 100svh;
		overflow-x: hidden;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__main {
		display: grid;
		gap: var(--bc-space-3);
		padding: var(--bc-space-3) var(--bc-mobile-gutter)
			calc(var(--bc-mobile-nav-height) + var(--bc-space-6));
	}

	.daynight-contact-mobile__hero {
		position: relative;
		display: grid;
		min-height: 164px;
		align-content: end;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.95), rgba(23, 31, 19, 0.72)),
			url('/assets/daynight/proof-studio-import-handoff.webp') 58% center / cover;
		color: var(--bc-white);
		padding: var(--bc-space-4);
	}

	.daynight-contact-mobile__hero div {
		display: grid;
		gap: 5px;
		max-width: 310px;
	}

	.daynight-contact-mobile__hero p,
	.daynight-contact-mobile__hero h1,
	.daynight-contact-mobile__hero span {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__hero p {
		color: var(--bc-white);
		opacity: 0.86;
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile__hero h1 {
		color: var(--bc-white);
		font-size: var(--bc-mobile-page-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-page-title-leading);
	}

	.daynight-contact-mobile__hero span {
		color: rgba(255, 255, 255, 0.82);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-contact-mobile__actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}

	.daynight-contact-mobile__actions a,
	.daynight-contact-mobile__actions button {
		display: flex;
		min-height: var(--bc-control-height-primary);
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		cursor: pointer;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-2);
		text-decoration: none !important;
		white-space: nowrap;
	}

	.daynight-contact-mobile__actions a:first-child {
		background: var(--bc-accent-bright-soft);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__actions button:focus-visible,
	.daynight-contact-mobile__actions a:focus-visible {
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-mobile__actions button:hover,
		.daynight-contact-mobile__actions a:hover {
			background: var(--bc-surface-hover);
			color: var(--bc-ink);
			outline: 0;
		}
	}

	.daynight-contact-mobile__info {
		display: grid;
		gap: var(--bc-space-2);
	}

	.daynight-contact-mobile__info article {
		display: flex;
		min-width: 0;
		align-items: flex-start;
		gap: var(--bc-space-3);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-3);
	}

	.daynight-contact-mobile__info article > span {
		display: flex;
		width: var(--bc-control-height-compact);
		height: var(--bc-control-height-compact);
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--bc-control-height-compact);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.daynight-contact-mobile__info div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.daynight-contact-mobile__info p,
	.daynight-contact-mobile__info strong,
	.daynight-contact-mobile__info small,
	.daynight-contact-mobile__info a {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__info p {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile__info strong,
	.daynight-contact-mobile__info a {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
		overflow-wrap: anywhere;
		text-decoration: none !important;
	}

	.daynight-contact-mobile__info a {
		display: inline-flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		margin-block: -11px;
		padding-block: 11px;
	}

	.daynight-contact-mobile__info small {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	.daynight-contact-mobile__map-card {
		display: grid;
		grid-template-columns: 118px minmax(0, 1fr);
		gap: var(--bc-space-3);
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-2);
	}

	.daynight-contact-mobile__map-card > div:last-child {
		display: grid;
		align-content: center;
		gap: 4px;
		min-width: 0;
	}

	.daynight-contact-mobile__map-card p,
	.daynight-contact-mobile__map-card strong {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile__map-card p {
		color: var(--bc-accent);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile__map-card strong {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-contact-mobile__map-card a {
		display: inline-flex;
		width: fit-content;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: var(--bc-space-2);
		margin-top: var(--bc-space-1);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-3);
		text-decoration: none !important;
	}

	.daynight-contact-mobile__map-preview {
		position: relative;
		min-height: 118px;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background:
			linear-gradient(135deg, rgba(254, 226, 226, 0.28), rgba(255, 255, 255, 0.82)),
			var(--bc-surface);
	}

	.daynight-contact-mobile__map-preview::before,
	.daynight-contact-mobile__map-preview::after {
		position: absolute;
		inset: 16px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.daynight-contact-mobile__map-preview::after {
		inset: 42px -22px auto 26px;
		height: 42px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-8deg);
	}

	.daynight-contact-mobile__map-preview .road {
		position: absolute;
		border-radius: var(--bc-radius-pill);
		background: rgba(28, 28, 28, 0.12);
	}

	.daynight-contact-mobile__map-preview .road-a {
		top: 25px;
		left: -20px;
		width: 76%;
		height: 8px;
		transform: rotate(13deg);
	}

	.daynight-contact-mobile__map-preview .road-b {
		right: -10px;
		bottom: 28px;
		width: 74%;
		height: 8px;
		transform: rotate(-20deg);
	}

	.daynight-contact-mobile__map-preview .road-c {
		top: 7px;
		left: 48%;
		width: 8px;
		height: 118px;
		transform: rotate(20deg);
	}

	.daynight-contact-mobile__map-preview .pin {
		position: absolute;
		top: 39px;
		left: 50%;
		display: flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		border: 4px solid var(--bc-white);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent-bright-soft);
		color: var(--bc-ink);
		transform: translateX(-50%);
	}

	.daynight-contact-mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 1200;
		visibility: hidden;
		pointer-events: none;
	}

	.daynight-contact-mobile[data-form-open='true'] .daynight-contact-mobile-sheet {
		visibility: visible;
		pointer-events: auto;
	}

	.daynight-contact-mobile-sheet__backdrop {
		position: absolute;
		inset: 0;
		display: block;
		border: 0;
		background: rgba(28, 28, 28, 0.36);
		cursor: pointer;
		font: inherit;
		opacity: 0;
		padding: 0;
		transition: opacity 180ms ease;
	}

	.daynight-contact-mobile[data-form-open='true']
		.daynight-contact-mobile-sheet
		.daynight-contact-mobile-sheet__backdrop {
		opacity: 1;
	}

	.daynight-contact-mobile-sheet__panel {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		max-height: min(88dvh, 720px);
		gap: var(--bc-space-3);
		grid-template-rows: max-content max-content minmax(0, 1fr);
		overflow: hidden;
		border-top: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		padding: var(--bc-space-2) var(--bc-space-4) max(var(--bc-space-5), env(safe-area-inset-bottom));
		transform: translateY(100%);
		transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
		-webkit-overflow-scrolling: touch;
	}

	.daynight-contact-mobile[data-form-open='true']
		.daynight-contact-mobile-sheet
		.daynight-contact-mobile-sheet__panel {
		transform: translateY(0);
	}

	:global(body:has(.daynight-contact-mobile[data-form-open='true'])) {
		overflow: hidden;
	}

	.daynight-contact-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border);
	}

	.daynight-contact-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}

	.daynight-contact-mobile-sheet__header div {
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__header p,
	.daynight-contact-mobile-sheet__header h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.daynight-contact-mobile-sheet__header p {
		margin-bottom: 2px;
		color: var(--bc-accent);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
		text-transform: uppercase;
	}

	.daynight-contact-mobile-sheet__header h2 {
		color: var(--bc-ink);
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}

	.daynight-contact-mobile-sheet__header button {
		display: flex;
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: center;
		flex: 0 0 var(--bc-control-height-standard);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: var(--bc-ink);
		cursor: pointer;
		font: inherit;
		padding: 0;
	}

	.daynight-contact-mobile-sheet__header button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	.daynight-contact-mobile-sheet__body {
		min-height: 0;
		overflow-y: auto;
		padding-right: 1px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.daynight-contact-mobile-sheet__body::-webkit-scrollbar {
		display: none;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form) {
		display: grid;
		gap: var(--bc-space-3);
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__grid) {
		display: grid;
		gap: var(--bc-space-2);
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__field) {
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form p) {
		margin: 0 0 6px;
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-control);
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input),
	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border) !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-white) !important;
		box-shadow: none !important;
		color: var(--bc-ink);
		font-size: var(--bc-text-body) !important;
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-card-title-leading) !important;
		outline: 0;
		padding: 0 var(--bc-space-3) !important;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input) {
		height: var(--bc-control-height-primary) !important;
		font-weight: var(--bc-weight-body);
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea) {
		min-height: 98px !important;
		padding-top: var(--bc-space-3) !important;
		resize: vertical;
		font-weight: var(--bc-weight-body);
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input::placeholder),
	.daynight-contact-mobile-sheet__body
		:global(.daynight-contact-mobile-form textarea::placeholder) {
		color: var(--bc-muted-light);
		opacity: 1;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input:focus),
	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea:focus) {
		border-color: var(--bc-accent) !important;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: var(--bc-control-height-primary);
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: var(--bc-radius-card);
		background: var(--bc-accent) !important;
		color: var(--bc-white) !important;
		cursor: pointer;
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
	}

	.daynight-contact-mobile-sheet__body
		:global(.daynight-contact-mobile-form__submit:focus-visible) {
		background: var(--bc-accent-hover) !important;
		color: var(--bc-white) !important;
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__submit:hover) {
			background: var(--bc-accent-hover) !important;
			color: var(--bc-white) !important;
			outline: 0;
		}
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__status) {
		margin: -2px 0 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-body-leading);
	}

	@media (max-width: 359px) {
		.daynight-contact-mobile__hero h1 {
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
			font-weight: var(--bc-weight-heading);
		}
		.daynight-contact-mobile__map-card {
			grid-template-columns: 1fr;
		}
	}
</style>
