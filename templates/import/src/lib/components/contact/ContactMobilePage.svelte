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
		requestAnimationFrame(() => {
			document.querySelector<HTMLElement>('.daynight-contact-mobile-form input')?.focus();
		});
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
				aria-label={form.submitLabel}
				aria-controls="contact-mobile-form-sheet"
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
					statusMessage="Съобщението е подготвено локално за Day Night Auto."
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
		background: var(--bc-bg);
		color: #111111;
	}

	.daynight-contact-mobile__main {
		display: grid;
		gap: 10px;
		padding: 12px 14px 92px;
	}

	.daynight-contact-mobile__hero {
		position: relative;
		display: grid;
		min-height: 164px;
		align-content: end;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.95), rgba(23, 31, 19, 0.72)),
			url('/assets/daynight/proof-studio-import-handoff.webp') 58% center / cover;
		color: #ffffff;
		padding: 18px;
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
		color: #fee2e2;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		text-transform: uppercase;
	}

	.daynight-contact-mobile__hero h1 {
		color: #ffffff;
		font-size: 30px;
		font-weight: 800;
		line-height: 34px;
	}

	.daynight-contact-mobile__hero span {
		color: rgba(255, 255, 255, 0.82);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
	}

	.daynight-contact-mobile__actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.daynight-contact-mobile__actions a,
	.daynight-contact-mobile__actions button {
		display: flex;
		min-height: 48px;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 7px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 0 8px;
		text-decoration: none !important;
		white-space: nowrap;
	}

	.daynight-contact-mobile__actions a:first-child {
		background: var(--bc-accent-bright-soft);
		color: #1c1c1c;
	}

	.daynight-contact-mobile__actions button:focus-visible,
	.daynight-contact-mobile__actions a:focus-visible {
		background: var(--bc-surface-hover);
		color: #111111;
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-mobile__actions button:hover,
		.daynight-contact-mobile__actions a:hover {
			background: var(--bc-surface-hover);
			color: #111111;
			outline: 0;
		}
	}

	.daynight-contact-mobile__info {
		display: grid;
		gap: 8px;
	}

	.daynight-contact-mobile__info article {
		display: flex;
		min-width: 0;
		align-items: flex-start;
		gap: 12px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 13px;
	}

	.daynight-contact-mobile__info article > span {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 38px;
		border-radius: 8px;
		background: var(--bc-surface);
		color: #1c1c1c;
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
		color: #637184;
		font-size: 12px;
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-contact-mobile__info strong,
	.daynight-contact-mobile__info a {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
		overflow-wrap: anywhere;
		text-decoration: none !important;
	}

	.daynight-contact-mobile__info small {
		color: #5f6b58;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.daynight-contact-mobile__map-card {
		display: grid;
		grid-template-columns: 118px minmax(0, 1fr);
		gap: 12px;
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 10px;
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
		color: #b9161c;
		font-size: 12px;
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-contact-mobile__map-card strong {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
	}

	.daynight-contact-mobile__map-card a {
		display: inline-flex;
		width: fit-content;
		min-height: 38px;
		align-items: center;
		gap: 7px;
		margin-top: 4px;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 13px;
		font-weight: 800;
		line-height: 16px;
		padding: 0 13px;
		text-decoration: none !important;
	}

	.daynight-contact-mobile__map-preview {
		position: relative;
		min-height: 118px;
		overflow: hidden;
		border-radius: 8px;
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
		border-radius: 999px;
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
		border: 4px solid #ffffff;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #111111;
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
		gap: 13px;
		grid-template-rows: max-content max-content minmax(0, 1fr);
		overflow: hidden;
		border-top: 1px solid var(--bc-border);
		border-radius: 22px 22px 0 0;
		background: var(--bc-bg);
		color: #111111;
		padding: 10px 16px max(20px, env(safe-area-inset-bottom));
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
		border-radius: 999px;
		background: var(--bc-border);
	}

	.daynight-contact-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
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
		color: #b9161c;
		font-size: 12px;
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-contact-mobile-sheet__header h2 {
		color: #111111;
		font-size: 21px;
		font-weight: 800;
		line-height: 26px;
	}

	.daynight-contact-mobile-sheet__header button {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: #111111;
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
		gap: 13px;
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__grid) {
		display: grid;
		gap: 9px;
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__field) {
		min-width: 0;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form p) {
		margin: 0 0 6px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input),
	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px !important;
		font-weight: 500;
		line-height: 22px !important;
		outline: 0;
		padding: 0 13px !important;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input) {
		height: 48px !important;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea) {
		min-height: 98px !important;
		padding-top: 12px !important;
		resize: vertical;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input::placeholder),
	.daynight-contact-mobile-sheet__body
		:global(.daynight-contact-mobile-form textarea::placeholder) {
		color: #9ba0a5;
		opacity: 1;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form input:focus),
	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form textarea:focus) {
		border-color: var(--bc-accent) !important;
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 8px;
		background: #b9161c !important;
		color: #ffffff !important;
		cursor: pointer;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
	}

	.daynight-contact-mobile-sheet__body
		:global(.daynight-contact-mobile-form__submit:focus-visible) {
		background: #fee2e2 !important;
		color: #111111 !important;
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__submit:hover) {
			background: #fee2e2 !important;
			color: #111111 !important;
			outline: 0;
		}
	}

	.daynight-contact-mobile-sheet__body :global(.daynight-contact-mobile-form__status) {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	@media (max-width: 359px) {
		.daynight-contact-mobile__hero h1 {
			font-size: 27px;
			line-height: 31px;
		}
		.daynight-contact-mobile__map-card {
			grid-template-columns: 1fr;
		}
	}
</style>
