<script lang="ts">
	import { resolve } from '$app/paths';
	import { Clock, Mail, MapPin, Navigation, PhoneCall, Search, X } from '@lucide/svelte';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import { eliqautoAssets } from '$lib/data/eliqauto';

	let { about }: { about: AuxeroAboutContent } = $props();

	const hrefAttrs = (href: string) => ({ href });
	const showSecondaryPhone = $derived(
		about.office.secondaryPhoneHref !== about.office.phoneHref ||
			about.office.secondaryPhone !== about.office.phone
	);
</script>

<input
	id="eliqauto-about-mobile-contact-toggle"
	class="eliqauto-about-mobile__toggle"
	type="checkbox"
	aria-label="Покажи локация и контакти"
	aria-controls="eliqauto-about-mobile-contact-drawer"
/>

<section class="eliqauto-about-mobile" aria-label="Eliqauto мобилен преглед">
	<header class="eliqauto-about-mobile__header">
		<a class="eliqauto-about-mobile__logo" href={resolve('/')} aria-label="Eliqauto начало">
			<img src={eliqautoAssets.logoLight} alt="Eliqauto" />
		</a>

		<div class="eliqauto-about-mobile__actions">
			<a
				class="eliqauto-about-mobile__icon-button"
				{...hrefAttrs(about.contact.primaryPhoneHref)}
				aria-label={`Обади се на ${about.contact.primaryPhoneLabel}`}
			>
				<PhoneCall size={19} strokeWidth={2.25} aria-hidden="true" />
			</a>
			<label
				class="eliqauto-about-mobile__icon-button"
				for="eliqauto-about-mobile-contact-toggle"
				aria-label="Покажи локация и контакти"
				aria-controls="eliqauto-about-mobile-contact-drawer"
			>
				<MapPin size={20} strokeWidth={2.25} aria-hidden="true" />
			</label>
		</div>
	</header>

	<a class="eliqauto-about-mobile__search" href={resolve('/inventory')}>
		<Search size={19} strokeWidth={2.2} aria-hidden="true" />
		<span>Търси автомобил, марка...</span>
	</a>

	<nav class="eliqauto-about-mobile__pills" aria-label="Бързи секции">
		<a {...hrefAttrs('#about-team')}>За нас</a>
		<a {...hrefAttrs('#about-gallery')}>Галерия</a>
		<label
			for="eliqauto-about-mobile-contact-toggle"
			aria-controls="eliqauto-about-mobile-contact-drawer"
		>
			Локация
		</label>
		<label
			for="eliqauto-about-mobile-contact-toggle"
			aria-controls="eliqauto-about-mobile-contact-drawer"
		>
			Контакти
		</label>
		<a {...hrefAttrs('#about-brands')}>Марки</a>
		<a {...hrefAttrs('#about-services')}>Услуги</a>
	</nav>
</section>

<div
	id="eliqauto-about-mobile-contact-drawer"
	class="eliqauto-about-mobile-drawer"
	role="dialog"
	aria-modal="true"
	aria-labelledby="eliqauto-about-mobile-contact-title"
>
	<label
		class="eliqauto-about-mobile-drawer__backdrop"
		for="eliqauto-about-mobile-contact-toggle"
		aria-label="Затвори контактите"
	></label>

	<div class="eliqauto-about-mobile-drawer__sheet">
		<span class="eliqauto-about-mobile-drawer__handle" aria-hidden="true"></span>

		<header>
			<div>
				<p>Eliqauto</p>
				<h2 id="eliqauto-about-mobile-contact-title">Контакти и локация</h2>
			</div>
			<label
				for="eliqauto-about-mobile-contact-toggle"
				class="eliqauto-about-mobile-drawer__close"
				aria-label="Затвори контактите"
			>
				<X size={20} strokeWidth={2.25} aria-hidden="true" />
			</label>
		</header>

		<p class="eliqauto-about-mobile-drawer__description">
			{about.office.address}. {about.office.appointment}
		</p>

		<div class="eliqauto-about-mobile-drawer__body">
			<article>
				<span><MapPin size={18} strokeWidth={2.2} aria-hidden="true" /></span>
				<div>
					<h3>Адрес</h3>
					<p>{about.office.address}</p>
				</div>
			</article>

			<article>
				<span><PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" /></span>
				<div>
					<h3>Телефон</h3>
					<a {...hrefAttrs(about.office.phoneHref)}>{about.office.phone}</a>
					{#if showSecondaryPhone}
						<a {...hrefAttrs(about.office.secondaryPhoneHref)}>{about.office.secondaryPhone}</a>
					{/if}
				</div>
			</article>

			<article>
				<span><Clock size={18} strokeWidth={2.2} aria-hidden="true" /></span>
				<div>
					<h3>Работно време</h3>
					<p>{about.office.hours}</p>
					<p>{about.office.appointment}</p>
				</div>
			</article>

			<article>
				<span><Mail size={18} strokeWidth={2.2} aria-hidden="true" /></span>
				<div>
					<h3>Имейл</h3>
					<a {...hrefAttrs(about.office.emailHref)}>{about.office.email}</a>
				</div>
			</article>
		</div>

		<div class="eliqauto-about-mobile-drawer__actions">
			<a {...hrefAttrs(about.office.phoneHref)}>
				<PhoneCall size={17} strokeWidth={2.25} aria-hidden="true" />
				Позвъни
			</a>
			<a {...hrefAttrs(about.office.emailHref)}>
				<Mail size={17} strokeWidth={2.25} aria-hidden="true" />
				Имейл
			</a>
			<a {...hrefAttrs(about.office.mapHref)} target="_blank" rel="noreferrer">
				<Navigation size={17} strokeWidth={2.25} aria-hidden="true" />
				Карта
			</a>
		</div>
	</div>
</div>

<style>
	.eliqauto-about-mobile,
	.eliqauto-about-mobile__toggle,
	.eliqauto-about-mobile-drawer {
		display: none;
	}

	@media (max-width: 767.98px) {
		.eliqauto-about-mobile,
		.eliqauto-about-mobile *,
		.eliqauto-about-mobile-drawer,
		.eliqauto-about-mobile-drawer * {
			box-sizing: border-box;
		}

		:global(body.auxero-template-about-us-html) {
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		:global(body.auxero-template-about-us-html .header-wrapper-style-4) {
			display: none;
		}

		:global(body:has(#eliqauto-about-mobile-contact-toggle:checked)) {
			overflow: hidden;
		}

		.eliqauto-about-mobile__toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.eliqauto-about-mobile {
			position: sticky;
			top: 0;
			z-index: 30;
			display: grid;
			width: 100%;
			max-width: 100vw;
			gap: 10px;
			border-bottom: 1px solid var(--bc-border);
			background: rgba(250, 252, 247, 0.96);
			padding: max(12px, env(safe-area-inset-top)) 14px 10px;
			backdrop-filter: blur(12px);
		}

		.eliqauto-about-mobile a {
			color: inherit;
			text-decoration: none;
		}

		.eliqauto-about-mobile__header {
			display: flex;
			min-width: 0;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.eliqauto-about-mobile__logo {
			display: inline-flex;
			min-width: 0;
			align-items: center;
		}

		.eliqauto-about-mobile__logo img {
			display: block;
			width: 148px;
			max-width: min(148px, 48vw);
			height: auto;
		}

		.eliqauto-about-mobile__actions {
			display: flex;
			align-items: center;
			gap: 8px;
			flex: 0 0 auto;
		}

		.eliqauto-about-mobile__icon-button {
			display: inline-flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 50%;
			background: var(--bc-surface-soft);
			color: var(--bc-ink);
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-about-mobile__icon-button:focus-visible,
		.eliqauto-about-mobile__pills a:focus-visible,
		.eliqauto-about-mobile__pills label:focus-visible {
			background: var(--bc-accent-soft);
			color: var(--bc-ink);
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-about-mobile__icon-button:hover,
			.eliqauto-about-mobile__pills a:hover,
			.eliqauto-about-mobile__pills label:hover {
				background: var(--bc-accent-soft);
				color: var(--bc-ink);
			}
		}

		.eliqauto-about-mobile__icon-button:focus-visible,
		.eliqauto-about-mobile__search:focus-visible,
		.eliqauto-about-mobile__pills a:focus-visible,
		.eliqauto-about-mobile__pills label:focus-visible,
		.eliqauto-about-mobile-drawer__actions a:focus-visible {
			outline: 2px solid #1c1c1c;
			outline-offset: 2px;
		}

		.eliqauto-about-mobile__search {
			display: flex;
			min-height: 48px;
			align-items: center;
			gap: 10px;
			border-radius: 999px;
			background: var(--bc-surface-soft);
			color: var(--bc-muted);
			font-size: 15px;
			font-weight: 700;
			line-height: 20px;
			padding: 0 15px;
		}

		.eliqauto-about-mobile__search span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-about-mobile__pills {
			display: flex;
			min-width: 0;
			gap: 8px;
			overflow-x: auto;
			padding-bottom: 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
			-webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
			mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
		}

		.eliqauto-about-mobile__pills::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-about-mobile__pills a,
		.eliqauto-about-mobile__pills label {
			display: inline-flex;
			min-width: max-content;
			min-height: 42px;
			align-items: center;
			justify-content: center;
			flex: 0 0 auto;
			border: 0;
			border-radius: 10px;
			background: var(--bc-surface-soft);
			color: #1c1c1c;
			cursor: pointer;
			font-size: 14px;
			font-weight: 750;
			line-height: 18px;
			padding: 0 13px;
			white-space: nowrap;
		}

		.eliqauto-about-mobile-drawer {
			position: fixed;
			inset: 0;
			z-index: 70;
			display: block;
			visibility: hidden;
			pointer-events: none;
		}

		#eliqauto-about-mobile-contact-toggle:checked ~ .eliqauto-about-mobile-drawer {
			visibility: visible;
			pointer-events: auto;
		}

		.eliqauto-about-mobile-drawer__backdrop {
			position: absolute;
			inset: 0;
			display: block;
			background: rgba(0, 0, 0, 0.36);
			cursor: pointer;
		}

		.eliqauto-about-mobile-drawer__sheet {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			max-height: min(82svh, 680px);
			gap: 14px;
			border-radius: 22px 22px 0 0;
			background: var(--bc-bg);
			color: #111111;
			padding: 10px 16px max(18px, env(safe-area-inset-bottom));
			box-shadow: 0 -18px 34px rgba(17, 24, 39, 0.18);
			transform: translateY(100%);
			transition: transform 0.18s ease;
		}

		#eliqauto-about-mobile-contact-toggle:checked
			~ .eliqauto-about-mobile-drawer
			.eliqauto-about-mobile-drawer__sheet {
			transform: translateY(0);
		}

		.eliqauto-about-mobile-drawer__handle {
			justify-self: center;
			width: 42px;
			height: 5px;
			border-radius: 999px;
			background: var(--bc-surface-hover);
		}

		.eliqauto-about-mobile-drawer header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
		}

		.eliqauto-about-mobile-drawer header div {
			min-width: 0;
		}

		.eliqauto-about-mobile-drawer header p {
			margin: 0 0 2px;
			color: var(--bc-accent);
			font-size: var(--bc-text-micro);
			font-weight: 800;
			line-height: 14px;
			text-transform: uppercase;
		}

		.eliqauto-about-mobile-drawer h2 {
			margin: 0;
			color: #111111;
			font-size: 22px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 28px;
		}

		.eliqauto-about-mobile-drawer__description {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.eliqauto-about-mobile-drawer__close {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 50%;
			background: var(--bc-surface-soft);
			color: #111111;
			cursor: pointer;
			padding: 0;
		}

		.eliqauto-about-mobile-drawer__body {
			display: grid;
			min-height: 0;
			max-height: 45svh;
			overflow-y: auto;
			gap: 9px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.eliqauto-about-mobile-drawer__body::-webkit-scrollbar {
			display: none;
		}

		.eliqauto-about-mobile-drawer__body article {
			display: flex;
			min-width: 0;
			align-items: flex-start;
			gap: 12px;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: #ffffff;
			padding: 13px;
		}

		.eliqauto-about-mobile-drawer__body article > span {
			display: inline-flex;
			width: 38px;
			height: 38px;
			align-items: center;
			justify-content: center;
			flex: 0 0 38px;
			border-radius: 8px;
			background: var(--bc-accent-soft);
			color: var(--bc-ink);
		}

		.eliqauto-about-mobile-drawer__body div {
			min-width: 0;
		}

		.eliqauto-about-mobile-drawer__body h3 {
			margin: 0 0 4px;
			color: #111111;
			font-size: 15px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 19px;
		}

		.eliqauto-about-mobile-drawer__body p,
		.eliqauto-about-mobile-drawer__body a {
			display: block;
			margin: 0 0 3px;
			color: var(--bc-muted);
			font-size: 14px;
			font-weight: 600;
			line-height: 19px;
			overflow-wrap: anywhere;
		}

		.eliqauto-about-mobile-drawer__body a {
			width: fit-content;
			color: #1c1c1c;
		}

		.eliqauto-about-mobile-drawer__actions {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 8px;
		}

		.eliqauto-about-mobile-drawer__actions a {
			display: inline-flex;
			min-height: 46px;
			align-items: center;
			justify-content: center;
			gap: 7px;
			border-radius: 8px;
			background: var(--bc-ink);
			color: #ffffff;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
			text-decoration: none;
		}

		.eliqauto-about-mobile-drawer__actions a:focus-visible {
			background: #a51717;
			color: #2a0c0c;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-about-mobile-drawer__actions a:hover {
				background: #a51717;
				color: #2a0c0c;
			}
		}
	}
</style>
