<script lang="ts">
	import { resolve } from '$app/paths';
	import { Mail, MapPin, MessageCircle, Navigation, PhoneCall, Plus, X } from '@lucide/svelte';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import { eliqautoAssets, eliqautoContact } from '$lib/data/eliqauto';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form, info }: { form: AuxeroContactFormData; info: AuxeroContactPageInfo } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const,
			required: field.name === 'Firstname' || field.name === 'SendInquiryphone',
			wrapperClass: 'eliqauto-contact-mobile-form__field'
		})),
		{
			className: 'eliqauto-contact-mobile-form__message',
			id: 'contact-mobile-message',
			kind: 'textarea' as const,
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: false,
			rows: 3,
			wrapperClass: 'eliqauto-contact-mobile-form__field'
		}
	]);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		eliqautoContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
</script>

<div class="eliqauto-contact-mobile" data-eliqauto-contact-mobile>
	<input
		id="contact-mobile-form-toggle"
		class="eliqauto-contact-mobile__sheet-toggle"
		type="checkbox"
		autocomplete="off"
		tabindex="-1"
		aria-hidden="true"
	/>

	<header class="eliqauto-contact-mobile__appbar">
		<a class="eliqauto-contact-mobile__brand" href={resolve('/')} aria-label="Eliqauto начало">
			<img src={eliqautoAssets.logoLight} alt="Eliqauto" width="180" height="33" />
		</a>

		<div class="eliqauto-contact-mobile__app-actions" aria-label="Контакт">
			<a
				class="eliqauto-contact-mobile__icon-action"
				{...hrefAttributes(info.phoneHref)}
				aria-label={info.phoneLabel}
			>
				<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<a
				class="eliqauto-contact-mobile__icon-action"
				{...hrefAttributes(mapHref)}
				target="_blank"
				rel="noreferrer"
				aria-label={info.officeLabel}
			>
				<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<label
				for="contact-mobile-form-toggle"
				class="eliqauto-contact-mobile__icon-action eliqauto-contact-mobile__icon-action--primary"
				aria-label={form.submitLabel}
				aria-controls="contact-mobile-form-sheet"
				aria-haspopup="dialog"
			>
				<Plus size={20} strokeWidth={2.5} aria-hidden="true" />
			</label>
		</div>
	</header>

	<main class="eliqauto-contact-mobile__main">
		<section class="eliqauto-contact-mobile__hero" aria-labelledby="contact-mobile-title">
			<div>
				<p>{info.eyebrow}</p>
				<h1 id="contact-mobile-title">{info.title}</h1>
				<span>{info.description}</span>
			</div>
		</section>

		<nav class="eliqauto-contact-mobile__actions" aria-label="Бърз контакт">
			<a {...hrefAttributes(info.phoneHref)}>
				<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
				Обади се
			</a>
			<a {...hrefAttributes(eliqautoContact.viberHref)}>
				<MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
				Пиши ни
			</a>
			<label
				for="contact-mobile-form-toggle"
				aria-label={form.submitLabel}
				aria-controls="contact-mobile-form-sheet"
				aria-haspopup="dialog"
			>
				<Plus size={18} strokeWidth={2.35} aria-hidden="true" />
				Форма
			</label>
		</nav>

		<section class="eliqauto-contact-mobile__info" aria-label="Данни за контакт">
			<article>
				<span><MapPin size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{info.officeLabel}</p>
					<strong>{eliqautoContact.addressLabel}</strong>
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
					<p>Имейл</p>
					<a {...hrefAttributes(info.emailHref)}>{info.emailLabel}</a>
				</div>
			</article>
		</section>

		<section class="eliqauto-contact-mobile__map-card" aria-label="Локация">
			<div class="eliqauto-contact-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.45} /></span>
			</div>
			<div>
				<p>Огледи с уговорка</p>
				<strong>{eliqautoContact.addressLabel}</strong>
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					Отвори карта
					<Navigation size={17} strokeWidth={2.3} aria-hidden="true" />
				</a>
			</div>
		</section>
	</main>

	<div
		id="contact-mobile-form-sheet"
		class="eliqauto-contact-mobile-sheet"
		role="dialog"
		aria-modal="true"
		aria-labelledby="contact-mobile-form-title"
	>
		<label
			for="contact-mobile-form-toggle"
			class="eliqauto-contact-mobile-sheet__backdrop"
			aria-label="Затвори формата"
		></label>

		<div class="eliqauto-contact-mobile-sheet__panel">
			<span class="eliqauto-contact-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="eliqauto-contact-mobile-sheet__header">
				<div>
					<p>Eliqauto</p>
					<h2 id="contact-mobile-form-title">{form.title}</h2>
				</div>
				<label for="contact-mobile-form-toggle" aria-label="Затвори">
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</label>
			</header>

			<div class="eliqauto-contact-mobile-sheet__body">
				<InquiryForm
					{fields}
					buttonClass="eliqauto-contact-mobile-form__submit"
					formClass="eliqauto-contact-mobile-form"
					gridClass="eliqauto-contact-mobile-form__grid"
					novalidate
					showEmptyStatus={false}
					statusClass="eliqauto-contact-mobile-form__status"
					statusMessage="Съобщението е изпратено. Eliqauto ще се свърже с вас скоро."
					submitLabel={form.submitLabel}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.eliqauto-contact-mobile {
		position: relative;
		min-height: 100svh;
		overflow-x: hidden;
		background: var(--bc-bg);
		color: #111111;
	}

	.eliqauto-contact-mobile__sheet-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.eliqauto-contact-mobile__appbar {
		display: flex;
		min-height: 66px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border-bottom: 1px solid var(--bc-border);
		background: rgba(251, 252, 250, 0.96);
		padding: max(10px, env(safe-area-inset-top)) 14px 8px;
		backdrop-filter: blur(12px);
	}

	.eliqauto-contact-mobile__brand {
		display: flex;
		min-width: 0;
		align-items: center;
		text-decoration: none;
	}

	.eliqauto-contact-mobile__brand img {
		display: block;
		width: 144px;
		max-width: calc(100vw - 154px);
		height: auto;
		object-fit: contain;
	}

	.eliqauto-contact-mobile__app-actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 7px;
	}

	.eliqauto-contact-mobile__icon-action {
		display: flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: #1c1c1c;
		cursor: pointer;
		padding: 0;
		text-decoration: none;
	}

	.eliqauto-contact-mobile__icon-action--primary {
		background: #1c1c1c;
		color: #ffffff;
	}

	.eliqauto-contact-mobile__icon-action:focus-visible {
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-contact-mobile__icon-action:hover {
			background: var(--bc-accent-bright-soft);
			color: #2a0c0c;
			outline: 0;
		}
	}

	.eliqauto-contact-mobile__icon-action :global(svg),
	.eliqauto-contact-mobile__icon-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-contact-mobile__main {
		display: grid;
		gap: 10px;
		padding: 12px 14px 92px;
	}

	.eliqauto-contact-mobile__hero {
		position: relative;
		display: grid;
		min-height: 164px;
		align-content: end;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.95), rgba(23, 31, 19, 0.72)),
			url('/assets/eliqauto/proof-studio-import-handoff.webp') 58% center / cover;
		color: #ffffff;
		padding: 18px;
	}

	.eliqauto-contact-mobile__hero div {
		display: grid;
		gap: 5px;
		max-width: 310px;
	}

	.eliqauto-contact-mobile__hero p,
	.eliqauto-contact-mobile__hero h1,
	.eliqauto-contact-mobile__hero span {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-contact-mobile__hero p {
		color: var(--bc-accent-on-dark);
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 15px;
		text-transform: uppercase;
	}

	.eliqauto-contact-mobile__hero h1 {
		color: #ffffff;
		font-size: 30px;
		font-weight: 800;
		line-height: 34px;
	}

	.eliqauto-contact-mobile__hero span {
		color: rgba(255, 255, 255, 0.82);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
	}

	.eliqauto-contact-mobile__actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.eliqauto-contact-mobile__actions a,
	.eliqauto-contact-mobile__actions label {
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
		text-decoration: none;
		white-space: nowrap;
	}

	.eliqauto-contact-mobile__actions a:first-child {
		background: var(--bc-accent-bright-soft);
		color: #2a0c0c;
	}

	.eliqauto-contact-mobile__actions label:focus-visible,
	.eliqauto-contact-mobile__actions a:focus-visible {
		background: var(--bc-surface-hover);
		color: #111111;
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-contact-mobile__actions label:hover,
		.eliqauto-contact-mobile__actions a:hover {
			background: var(--bc-surface-hover);
			color: #111111;
			outline: 0;
		}
	}

	.eliqauto-contact-mobile__info {
		display: grid;
		gap: 8px;
	}

	.eliqauto-contact-mobile__info article {
		display: flex;
		min-width: 0;
		align-items: flex-start;
		gap: 12px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 13px;
	}

	.eliqauto-contact-mobile__info article > span {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 38px;
		border-radius: 8px;
		background: var(--bc-surface);
		color: var(--bc-ink);
	}

	.eliqauto-contact-mobile__info div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.eliqauto-contact-mobile__info p,
	.eliqauto-contact-mobile__info strong,
	.eliqauto-contact-mobile__info small,
	.eliqauto-contact-mobile__info a {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-contact-mobile__info p {
		color: #637184;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-contact-mobile__info strong,
	.eliqauto-contact-mobile__info a {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
		overflow-wrap: anywhere;
		text-decoration: none;
	}

	.eliqauto-contact-mobile__info small {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.eliqauto-contact-mobile__map-card {
		display: grid;
		grid-template-columns: 118px minmax(0, 1fr);
		gap: 12px;
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 10px;
	}

	.eliqauto-contact-mobile__map-card > div:last-child {
		display: grid;
		align-content: center;
		gap: 4px;
		min-width: 0;
	}

	.eliqauto-contact-mobile__map-card p,
	.eliqauto-contact-mobile__map-card strong {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-contact-mobile__map-card p {
		color: var(--bc-accent);
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-contact-mobile__map-card strong {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
	}

	.eliqauto-contact-mobile__map-card a {
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
		text-decoration: none;
	}

	.eliqauto-contact-mobile__map-preview {
		position: relative;
		min-height: 118px;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(165, 23, 23, 0.12), rgba(255, 255, 255, 0.86)), var(--bc-surface);
	}

	.eliqauto-contact-mobile__map-preview::before,
	.eliqauto-contact-mobile__map-preview::after {
		position: absolute;
		inset: 16px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.eliqauto-contact-mobile__map-preview::after {
		inset: 42px -22px auto 26px;
		height: 42px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-8deg);
	}

	.eliqauto-contact-mobile__map-preview .road {
		position: absolute;
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.12);
	}

	.eliqauto-contact-mobile__map-preview .road-a {
		top: 25px;
		left: -20px;
		width: 76%;
		height: 8px;
		transform: rotate(13deg);
	}

	.eliqauto-contact-mobile__map-preview .road-b {
		right: -10px;
		bottom: 28px;
		width: 74%;
		height: 8px;
		transform: rotate(-20deg);
	}

	.eliqauto-contact-mobile__map-preview .road-c {
		top: 7px;
		left: 48%;
		width: 8px;
		height: 118px;
		transform: rotate(20deg);
	}

	.eliqauto-contact-mobile__map-preview .pin {
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

	.eliqauto-contact-mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 1200;
		visibility: hidden;
		pointer-events: none;
	}

	#contact-mobile-form-toggle:checked ~ .eliqauto-contact-mobile-sheet {
		visibility: visible;
		pointer-events: auto;
	}

	.eliqauto-contact-mobile-sheet__backdrop {
		position: absolute;
		inset: 0;
		display: block;
		border: 0;
		background: rgba(28, 28, 28, 0.36);
		cursor: pointer;
		opacity: 0;
		padding: 0;
		transition: opacity 180ms ease;
	}

	#contact-mobile-form-toggle:checked
		~ .eliqauto-contact-mobile-sheet
		.eliqauto-contact-mobile-sheet__backdrop {
		opacity: 1;
	}

	.eliqauto-contact-mobile-sheet__panel {
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

	#contact-mobile-form-toggle:checked
		~ .eliqauto-contact-mobile-sheet
		.eliqauto-contact-mobile-sheet__panel {
		transform: translateY(0);
	}

	:global(body:has(#contact-mobile-form-toggle:checked)) {
		overflow: hidden;
	}

	.eliqauto-contact-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.eliqauto-contact-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
	}

	.eliqauto-contact-mobile-sheet__header div {
		min-width: 0;
	}

	.eliqauto-contact-mobile-sheet__header p,
	.eliqauto-contact-mobile-sheet__header h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-contact-mobile-sheet__header p {
		margin-bottom: 2px;
		color: var(--bc-accent);
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-contact-mobile-sheet__header h2 {
		color: #111111;
		font-size: 21px;
		font-weight: 800;
		line-height: 26px;
	}

	.eliqauto-contact-mobile-sheet__header label {
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
		padding: 0;
	}

	.eliqauto-contact-mobile-sheet__body {
		min-height: 0;
		overflow-y: auto;
		padding-right: 1px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.eliqauto-contact-mobile-sheet__body::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form) {
		display: grid;
		gap: 13px;
		min-width: 0;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form__grid) {
		display: grid;
		gap: 9px;
		min-width: 0;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form__field) {
		min-width: 0;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form p) {
		margin: 0 0 6px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form input),
	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
		outline: 0;
		padding: 0 13px;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form input) {
		height: 48px;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form textarea) {
		min-height: 98px;
		padding-top: 12px;
		resize: vertical;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form input::placeholder),
	.eliqauto-contact-mobile-sheet__body
		:global(.eliqauto-contact-mobile-form textarea::placeholder) {
		color: #9ba0a5;
		opacity: 1;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form input:focus),
	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form textarea:focus) {
		border-color: #a51717;
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		cursor: pointer;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
	}

	.eliqauto-contact-mobile-sheet__body
		:global(.eliqauto-contact-mobile-form__submit:focus-visible) {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		outline: 0;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form__submit:hover) {
			background: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
			outline: 0;
		}
	}

	.eliqauto-contact-mobile-sheet__body :global(.eliqauto-contact-mobile-form__status) {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	@media (max-width: 359px) {
		.eliqauto-contact-mobile__hero h1 {
			font-size: 27px;
			line-height: 31px;
		}

		.eliqauto-contact-mobile__map-card {
			grid-template-columns: 1fr;
		}
	}
</style>
