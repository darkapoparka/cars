<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy } from '$lib/auxero/services';
	import { eliqautoContact } from '$lib/data/eliqauto';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';
	import {
		ArrowRight,
		BadgeCheck,
		CarFront,
		CircleDollarSign,
		Link2,
		MessageCircle,
		PhoneCall,
		Route,
		X
	} from '@lucide/svelte';

	let { form }: { form: AuxeroServiceFormData } = $props();
	let formOpen = $state(false);
	let infoOpen = $state(false);
	let quickVehicle = $state('');
	let formInstance = $state(0);

	const inputOrder = [
		['name', 'eliqauto-import-mobile-form__half'],
		['phone', 'eliqauto-import-mobile-form__half'],
		['email', 'eliqauto-import-mobile-form__wide'],
		['date', 'eliqauto-import-mobile-form__half']
	] as const;

	const fields: InquiryFormField[] = $derived([
		...inputOrder.flatMap(([name, wrapperClass]) => {
			const field = form.fields.find((candidate) => candidate.name === name);
			return field ? [{ ...field, kind: 'input' as const, wrapperClass }] : [];
		}),
		{
			className: 'eliqauto-import-mobile-form__select',
			kind: 'select' as const,
			label: form.serviceLabel,
			name: form.serviceName,
			options: form.serviceOptions,
			wrapperClass: 'eliqauto-import-mobile-form__half'
		},
		{
			...form.vehicleField,
			kind: 'input' as const,
			value: quickVehicle,
			wrapperClass: 'eliqauto-import-mobile-form__wide'
		}
	]);

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});

	const closeForm = () => {
		formOpen = false;
	};

	const openForm = (vehicle = quickVehicle) => {
		quickVehicle = vehicle.trim();
		formInstance += 1;
		formOpen = true;
	};

	const handleQuickStart = (event: SubmitEvent) => {
		event.preventDefault();
		openForm();
	};

	const closeInfo = () => {
		infoOpen = false;
	};

	const openFormFromInfo = () => {
		infoOpen = false;
		openForm();
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;
		if (formOpen) closeForm();
		else if (infoOpen) closeInfo();
	};

	$effect(() => {
		if (!formOpen && !infoOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="eliqauto-import-mobile" data-eliqauto-import-mobile>
	<MobileAppbar>
		<a
			{...hrefAttributes(eliqautoContact.primaryPhoneHref)}
			aria-label={eliqautoContact.primaryPhoneLabel}
		>
			<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
		<a {...hrefAttributes(eliqautoContact.viberHref)} aria-label="Пиши на Eliq Auto">
			<MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
	</MobileAppbar>

	<main class="eliqauto-import-mobile__main">
		<section class="eliqauto-import-mobile__hero" aria-labelledby="import-mobile-title">
			<img
				class="eliqauto-import-mobile__hero-image"
				src="/assets/eliqauto/cta/import-canada-banner-v2.webp"
				alt=""
				width="1600"
				height="1067"
				aria-hidden="true"
			/>
			<header class="eliqauto-import-mobile__hero-copy">
				<h1 id="import-mobile-title">{importRequestMobileCopy.title}</h1>
				<p>Изпрати линк към обява или VIN — проверяваме преди да поемеш ангажимент.</p>
			</header>

			<form
				class="eliqauto-import-mobile__identifier"
				aria-label="Начало на заявката за проверка"
				onsubmit={handleQuickStart}
			>
				<label for="import-mobile-identifier">
					<span class="eliqauto-import-mobile__sr-only">Линк към обява или VIN</span>
					<Link2 size={19} strokeWidth={2.2} aria-hidden="true" />
					<input
						id="import-mobile-identifier"
						type="text"
						name="vehicle-link"
						inputmode="url"
						placeholder="Линк към обява или VIN..."
						autocomplete="url"
						minlength="5"
						required
						bind:value={quickVehicle}
					/>
				</label>
				<button type="submit" aria-label="Продължи към проверката">
					<ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
				</button>
			</form>

			<div class="eliqauto-import-mobile__entry-meta">
				<span>Линкът се използва само за проверката.</span>
				<button type="button" onclick={() => openForm('')}>Нямам линк или VIN</button>
			</div>
		</section>

		<div class="eliqauto-import-mobile__continuation">
			<section class="eliqauto-import-mobile__assurance" aria-labelledby="import-assurance-title">
				<button
					type="button"
					class="eliqauto-import-mobile__assurance-trigger"
					aria-labelledby="import-assurance-title"
					aria-describedby="import-assurance-description"
					onclick={() => (infoOpen = true)}
				></button>
				<div>
					<h2 id="import-assurance-title">Преди да купиш</h2>
					<p id="import-assurance-description">
						Проверяваме историята, щетите и реалните разходи до България.
					</p>
					<span class="eliqauto-import-mobile__assurance-more">
						Какво проверяваме
						<ArrowRight size={17} strokeWidth={2.35} aria-hidden="true" />
					</span>
				</div>
				<img
					src="/assets/eliqauto/hero/home-hero-runway-car-white-v1.webp"
					alt=""
					width="1536"
					height="1024"
					loading="lazy"
					decoding="async"
				/>
			</section>
		</div>
	</main>

	{#if infoOpen}
		<div class="eliqauto-import-drawer" role="presentation" data-eliqauto-import-info-drawer>
			<button
				type="button"
				class="eliqauto-import-drawer__backdrop"
				aria-label="Затвори информацията"
				onclick={closeInfo}
			></button>
			<div
				class="eliqauto-import-drawer__sheet eliqauto-import-drawer__sheet--info"
				role="dialog"
				aria-modal="true"
				aria-labelledby="eliqauto-import-info-title"
			>
				<span class="eliqauto-import-drawer__handle" aria-hidden="true"></span>
				<div class="eliqauto-import-drawer__scroll eliqauto-import-info">
					<header class="eliqauto-import-drawer__header">
						<div>
							<h2 id="eliqauto-import-info-title">Какво проверяваме</h2>
							<p>Най-важното преди да поемеш ангажимент.</p>
						</div>
						<button type="button" aria-label="Затвори информацията" onclick={closeInfo}>
							<X size={20} strokeWidth={2.35} aria-hidden="true" />
						</button>
					</header>

					<ul class="eliqauto-import-info__list">
						<li>
							<span><BadgeCheck size={21} strokeWidth={2.15} aria-hidden="true" /></span>
							<div>
								<h3>История и щети</h3>
								<p>Наличните записи за инциденти и сервизна история.</p>
							</div>
						</li>
						<li>
							<span><CarFront size={21} strokeWidth={2.15} aria-hidden="true" /></span>
							<div>
								<h3>Пробег и обява</h3>
								<p>Сверяваме VIN, пробега и данните от обявата.</p>
							</div>
						</li>
						<li>
							<span><CircleDollarSign size={21} strokeWidth={2.15} aria-hidden="true" /></span>
							<div>
								<h3>Разходи до България</h3>
								<p>Ориентировъчна крайна цена според избраната услуга.</p>
							</div>
						</li>
						<li>
							<span><Route size={21} strokeWidth={2.15} aria-hidden="true" /></span>
							<div>
								<h3>Следваща стъпка</h3>
								<p>Ясен отговор преди оглед, покупка или внос.</p>
							</div>
						</li>
					</ul>

					<button type="button" class="eliqauto-import-info__cta" onclick={openFormFromInfo}>
						Провери автомобил
						<ArrowRight size={19} strokeWidth={2.35} aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if formOpen}
		<div class="eliqauto-import-drawer" role="presentation">
			<button
				type="button"
				class="eliqauto-import-drawer__backdrop"
				aria-label="Затвори формата"
				onclick={closeForm}
			></button>
			<div
				class="eliqauto-import-drawer__sheet"
				role="dialog"
				aria-modal="true"
				aria-labelledby="eliqauto-import-drawer-title"
			>
				<span class="eliqauto-import-drawer__handle" aria-hidden="true"></span>
				<div class="eliqauto-import-drawer__scroll">
					<header class="eliqauto-import-drawer__header">
						<div>
							<h2 id="eliqauto-import-drawer-title">{form.title}</h2>
							<p>Име, телефон и линк или VIN на автомобила.</p>
						</div>
						<button type="button" aria-label="Затвори формата" onclick={closeForm}>
							<X size={20} strokeWidth={2.35} aria-hidden="true" />
						</button>
					</header>
					{#key formInstance}
						<InquiryForm
							{fields}
							buttonClass="eliqauto-import-mobile-form__submit"
							formClass="eliqauto-import-mobile-form"
							gridClass="eliqauto-import-mobile-form__grid"
							novalidate
							showEmptyStatus={false}
							statusClass="eliqauto-import-mobile-form__status"
							statusMessage="Заявката е изпратена. Eliq Auto ще върне проверка и следваща стъпка."
							submitLabel={form.submitLabel}
						/>
					{/key}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.eliqauto-import-mobile {
		position: relative;
		min-height: 100vh;
		background: #ffffff;
		color: var(--bc-ink);
	}

	.eliqauto-import-mobile__main {
		position: relative;
		display: grid;
		overflow: hidden;
		background: #ffffff;
		padding-bottom: calc(84px + env(safe-area-inset-bottom));
	}

	.eliqauto-import-mobile__hero {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 14px;
		min-height: 338px;
		overflow: hidden;
		background: #090a0c;
		color: #ffffff;
		padding: calc(88px + env(safe-area-inset-top)) 16px 34px;
	}

	.eliqauto-import-mobile__hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgba(6, 7, 9, 0.68) 0%, rgba(6, 7, 9, 0.93) 72%),
			linear-gradient(90deg, rgba(181, 18, 27, 0.18), transparent 56%);
		content: '';
	}

	.eliqauto-import-mobile__hero-image {
		position: absolute;
		inset: 0;
		z-index: -2;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% center;
	}

	.eliqauto-import-mobile__hero-copy {
		display: grid;
		gap: 6px;
		max-width: 340px;
		min-width: 0;
	}

	.eliqauto-import-mobile__hero-copy h1,
	.eliqauto-import-mobile__hero-copy p {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-import-mobile__hero-copy h1 {
		color: #ffffff;
		font-size: 28px;
		font-weight: 750;
		line-height: 32px;
	}

	.eliqauto-import-mobile__hero-copy p {
		max-width: 320px;
		color: rgba(255, 255, 255, 0.84);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}

	.eliqauto-import-mobile__identifier {
		display: flex;
		width: 100%;
		min-height: 58px;
		align-items: center;
		box-sizing: border-box;
		gap: 8px;
		margin: 0;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
		padding: 5px 5px 5px 15px;
	}

	.eliqauto-import-mobile__identifier:focus-within {
		box-shadow:
			0 0 0 2px var(--bc-accent),
			0 12px 30px rgba(0, 0, 0, 0.28);
	}

	.eliqauto-import-mobile__identifier label {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		flex: 1 1 auto;
		align-items: center;
		gap: 8px;
		min-width: 0;
		min-height: 48px;
		color: #626d7c;
	}

	.eliqauto-import-mobile__identifier input {
		width: 100%;
		min-width: 0;
		height: 48px;
		border: 0;
		background: transparent;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 650;
		line-height: 22px;
		outline: 0;
		padding: 0;
	}

	.eliqauto-import-mobile__identifier input::placeholder {
		color: #626d7c;
		font-weight: 600;
		opacity: 1;
	}

	.eliqauto-import-mobile__identifier button {
		display: flex;
		width: 48px;
		height: 48px;
		flex: 0 0 48px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-import-mobile__identifier button :global(svg),
	.eliqauto-import-mobile__identifier button :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-import-mobile__identifier button:focus-visible,
	.eliqauto-import-mobile__entry-meta button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}

	.eliqauto-import-mobile__entry-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.eliqauto-import-mobile__entry-meta span {
		color: rgba(255, 255, 255, 0.66);
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 15px;
	}

	.eliqauto-import-mobile__entry-meta button {
		min-height: 44px;
		flex: 0 0 auto;
		border: 0;
		background: transparent;
		color: #ffffff;
		cursor: pointer;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 16px;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.eliqauto-import-mobile__sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.eliqauto-import-mobile__continuation {
		position: relative;
		z-index: 2;
		margin-top: -18px;
		border-radius: 20px 20px 0 0;
		background: #ffffff;
		padding: 26px 14px 22px;
	}

	.eliqauto-import-mobile__assurance {
		position: relative;
		isolation: isolate;
		min-height: 184px;
		overflow: hidden;
		border-radius: 16px;
		background: var(--bc-surface);
		padding: 20px 22px;
	}

	.eliqauto-import-mobile__assurance-trigger {
		position: absolute;
		inset: 0;
		z-index: 4;
		border: 0;
		border-radius: inherit;
		background: transparent;
		cursor: pointer;
		padding: 0;
		touch-action: manipulation;
	}

	.eliqauto-import-mobile__assurance-trigger:focus-visible {
		outline: 3px solid rgba(181, 18, 27, 0.28);
		outline-offset: -3px;
	}

	.eliqauto-import-mobile__assurance > div {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 9px;
		width: 100%;
	}

	.eliqauto-import-mobile__assurance h2,
	.eliqauto-import-mobile__assurance p {
		margin: 0;
	}

	.eliqauto-import-mobile__assurance h2 {
		color: var(--bc-ink);
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 28px;
		white-space: nowrap;
	}

	.eliqauto-import-mobile__assurance p {
		width: 55%;
		color: var(--bc-copy);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}

	.eliqauto-import-mobile__assurance-more {
		display: flex;
		align-items: center;
		justify-content: center;
		width: max-content;
		min-height: 32px;
		gap: 6px;
		border-radius: 999px;
		background: var(--bc-accent);
		color: #ffffff;
		padding: 6px 11px;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-import-mobile__assurance-more :global(svg),
	.eliqauto-import-mobile__assurance-more :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-import-mobile__assurance img {
		position: absolute;
		z-index: 1;
		right: -132px;
		bottom: -16px;
		display: block;
		width: 324px;
		height: auto;
		max-width: none;
		filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.2));
	}

	.eliqauto-import-drawer {
		position: fixed;
		inset: 0;
		z-index: 1200;
	}

	.eliqauto-import-drawer__backdrop {
		position: fixed;
		inset: 0;
		z-index: 0;
		border: 0;
		background: rgba(17, 17, 17, 0.42);
		cursor: pointer;
		padding: 0;
		animation: eliqauto-import-backdrop-in 160ms ease-out both;
	}

	.eliqauto-import-drawer__sheet {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		gap: 4px;
		height: min(92dvh, 760px);
		overflow: hidden;
		border-radius: 20px 20px 0 0;
		background: #ffffff;
		outline: 0;
		padding: 10px 14px max(16px, env(safe-area-inset-bottom));
		animation: eliqauto-import-sheet-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.eliqauto-import-drawer__sheet--info {
		height: auto;
		max-height: min(88dvh, 700px);
	}

	.eliqauto-import-drawer__handle {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	.eliqauto-import-drawer__handle::after {
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

	@keyframes eliqauto-import-backdrop-in {
		from {
			opacity: 0;
		}
	}

	@keyframes eliqauto-import-sheet-in {
		from {
			transform: translateY(32px);
			opacity: 0;
		}
	}

	.eliqauto-import-drawer__scroll {
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	.eliqauto-import-drawer__scroll::-webkit-scrollbar {
		display: none;
	}

	.eliqauto-import-drawer__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 14px;
		padding: 2px 2px 12px;
	}

	.eliqauto-import-drawer__header > div {
		display: grid;
		gap: 4px;
	}

	.eliqauto-import-drawer__header h2,
	.eliqauto-import-drawer__header p {
		margin: 0;
	}

	.eliqauto-import-drawer__header h2 {
		color: var(--bc-ink);
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 29px;
	}

	.eliqauto-import-drawer__header p {
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 500;
		line-height: 19px;
	}

	.eliqauto-import-drawer__header button {
		display: flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: var(--bc-ink);
		cursor: pointer;
		padding: 0;
	}

	.eliqauto-import-drawer__header button :global(svg),
	.eliqauto-import-drawer__header button :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-import-info {
		display: grid;
		align-content: start;
		padding-bottom: 0;
	}

	.eliqauto-import-info__list {
		display: grid;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.eliqauto-import-info__list li {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		align-items: center;
		gap: 11px;
		padding: 7px 2px;
	}

	.eliqauto-import-info__list li > span {
		display: flex;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: var(--bc-surface);
		color: var(--bc-accent);
	}

	.eliqauto-import-info__list li > span :global(svg),
	.eliqauto-import-info__list li > span :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-import-info__list h3,
	.eliqauto-import-info__list p {
		margin: 0;
	}

	.eliqauto-import-info__list h3 {
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 700;
		line-height: 21px;
	}

	.eliqauto-import-info__list p {
		margin-top: 2px;
		color: var(--bc-copy);
		font-size: 14px;
		font-weight: 500;
		line-height: 19px;
	}

	.eliqauto-import-info__cta {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 8px;
		border: 0;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
		padding: 0 14px;
	}

	.eliqauto-import-info__cta :global(svg),
	.eliqauto-import-info__cta :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form) {
		display: grid;
		gap: 12px;
		min-width: 0;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px 10px;
		min-width: 0;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__half),
	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__wide) {
		min-width: 0;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__wide) {
		grid-column: 1 / -1;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form p) {
		margin: 0 0 6px;
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form input),
	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form select) {
		display: block;
		width: 100%;
		height: 48px;
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: var(--bc-surface-soft);
		box-shadow: none;
		color: var(--bc-ink);
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
		outline: 0;
		padding: 0 12px;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form select) {
		appearance: auto;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form input::placeholder) {
		color: #8b929c;
		opacity: 1;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form input:focus),
	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form select:focus) {
		border-color: rgba(181, 18, 27, 0.58);
		background: #ffffff;
		box-shadow: 0 0 0 3px rgba(181, 18, 27, 0.12);
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 12px;
		background: var(--bc-accent);
		color: #ffffff;
		cursor: pointer;
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__submit:disabled) {
		cursor: wait;
		opacity: 0.68;
	}

	.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__status) {
		margin: -4px 0 0;
		color: var(--bc-copy);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
	}

	.eliqauto-import-drawer__scroll
		:global(.eliqauto-import-mobile-form__status[data-status='error']) {
		color: var(--bc-accent);
	}

	@media (max-width: 359px) {
		.eliqauto-import-mobile__hero-copy h1 {
			font-size: 25px;
			line-height: 29px;
		}

		.eliqauto-import-mobile__assurance {
			min-height: 194px;
			padding-inline: 18px;
		}

		.eliqauto-import-mobile__assurance p {
			width: 58%;
		}

		.eliqauto-import-mobile__assurance-more {
			gap: 4px;
			font-size: 13px;
			white-space: nowrap;
		}

		.eliqauto-import-mobile__assurance img {
			right: -158px;
			bottom: -8px;
			width: 278px;
		}

		.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__grid) {
			grid-template-columns: 1fr;
		}

		.eliqauto-import-drawer__scroll :global(.eliqauto-import-mobile-form__wide) {
			grid-column: auto;
		}
	}
</style>
