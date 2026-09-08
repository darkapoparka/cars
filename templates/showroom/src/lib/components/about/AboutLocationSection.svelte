<script lang="ts">
	import { ArrowUpRight, Clock, Mail, MapPin, Phone } from '@lucide/svelte';
	import type { AuxeroAboutOffice } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	import { eliqAboutCompany } from '$lib/data/eliqauto-about';
	let { office }: { office: AuxeroAboutOffice } = $props();
	let showMap = $state(false);
	const hrefAttrs = (href: string) => ({ href });
	const showSecondaryPhone = $derived(
		office.secondaryPhoneHref !== office.phoneHref || office.secondaryPhone !== office.phone
	);
</script>

<section class="about-visit" aria-label="Посетете ELIQ AUTO">
	<div class="container">
		<AboutSectionHeader
			heading="Посетете ELIQ AUTO"
			description="Уговорете оглед, за да отделим време за вас и избрания автомобил."
		/>
		<div class="about-visit__layout">
			<div class="about-visit__photo">
				{#if showMap}
					<iframe
						src={office.mapEmbedUrl}
						title="Карта на шоурума на ELIQ AUTO в Пазарджик"
						referrerpolicy="no-referrer"
						allowfullscreen
					></iframe>
				{:else}
					<img
						src="/assets/eliqauto/about/entrance-official.webp"
						alt="Входът на шоурума на ELIQ AUTO в Пазарджик"
						width="1280"
						height="960"
						loading="lazy"
					/>
				{/if}
				<button
					type="button"
					class="about-visit__map-toggle"
					aria-pressed={showMap}
					onclick={() => (showMap = !showMap)}
					>{showMap ? 'Покажи снимката' : 'Покажи карта'}</button
				>
				<a class="about-visit__map" {...hrefAttrs(office.mapHref)} target="_blank" rel="noreferrer"
					>Упътване до шоурума <ArrowUpRight size={18} aria-hidden="true" /></a
				>
			</div>
			<div class="about-visit__content">
				<h3>Очакваме ви в Пазарджик</h3>
				<div class="about-visit__detail">
					<MapPin size={20} aria-hidden="true" />
					<div>
						<h4>Адрес</h4>
						<p>{office.address}</p>
						<p>{eliqAboutCompany.locationNote}</p>
					</div>
				</div>
				<div class="about-visit__detail">
					<Phone size={20} aria-hidden="true" />
					<div>
						<h4>Телефон</h4>
						<div class="about-visit__phones">
							<a {...hrefAttrs(office.phoneHref)}>{office.phone}</a>{#if showSecondaryPhone}<a
									{...hrefAttrs(office.secondaryPhoneHref)}>{office.secondaryPhone}</a
								>{/if}
						</div>
						<a {...hrefAttrs(eliqAboutCompany.thirdPhoneHref)}>{eliqAboutCompany.thirdPhone}</a>
					</div>
				</div>
				<div class="about-visit__detail">
					<Clock size={20} aria-hidden="true" />
					<div>
						<h4>Работно време</h4>
						{#each eliqAboutCompany.hours as hours (hours)}<p>{hours}</p>{/each}
						<a {...hrefAttrs(office.emailHref)}>{office.email}</a>
					</div>
				</div>
				<div class="about-visit__actions">
					<a {...hrefAttrs(office.phoneHref)}>Позвъни <Phone size={16} aria-hidden="true" /></a>
					<a {...hrefAttrs(office.emailHref)}>Имейл <Mail size={16} aria-hidden="true" /></a>
				</div>
				<a class="about-visit__viber" {...hrefAttrs(eliqAboutCompany.viberHref)}
					>Пишете ни във Viber <ArrowUpRight size={16} aria-hidden="true" /></a
				>
			</div>
		</div>
		<details class="about-company">
			<summary>Фирмени данни · {eliqAboutCompany.name}</summary>
			<dl>
				<div>
					<dt>Наименование</dt>
					<dd>{eliqAboutCompany.name}</dd>
				</div>
				<div>
					<dt>ЕИК / ДДС номер</dt>
					<dd>{eliqAboutCompany.eik} / {eliqAboutCompany.vat}</dd>
				</div>
				<div>
					<dt>Седалище и адрес на управление</dt>
					<dd>{eliqAboutCompany.registeredAddress}</dd>
				</div>
				<div>
					<dt>Управител</dt>
					<dd>{eliqAboutCompany.manager}</dd>
				</div>
			</dl>
		</details>
	</div>
</section>

<style>
	.about-visit {
		padding-block: 36px 56px;
	}
	.about-visit__layout {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 24px;
		align-items: stretch;
	}
	.about-visit__photo {
		position: relative;
		min-width: 0;
		min-height: 420px;
		border-radius: 12px;
		overflow: hidden;
		background: #f5f5f6;
	}
	.about-visit__photo img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.about-visit__photo iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.about-visit__map-toggle {
		position: absolute;
		left: 20px;
		bottom: 20px;
		min-height: 44px;
		padding: 10px 16px;
		border: 0;
		border-radius: 8px;
		background: #fff;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.about-visit__map-toggle:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.about-visit__viber {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		font-size: 14px;
		color: var(--bc-ink);
		font-weight: 600;
	}
	.about-company {
		margin-top: 24px;
		border-top: 1px solid #e4e4e7;
	}
	.about-company summary {
		padding-block: 18px;
		min-height: 44px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.about-company summary:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	.about-company dl {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		padding: 0 0 16px;
		margin: 0;
	}
	.about-company dt {
		font-size: 13px;
		color: #62626b;
		margin-bottom: 6px;
	}
	.about-company dd {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
	}
	.about-visit__map {
		position: absolute;
		bottom: 20px;
		right: 20px;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 10px 16px;
		border-radius: 8px;
		background: #fff;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 600;
	}
	.about-visit__content {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		background: #f5f5f6;
		min-width: 0;
	}
	.about-visit h3 {
		margin: 0 0 4px;
		font-size: 20px;
		line-height: 1.4;
		font-weight: 600;
		color: var(--bc-ink);
	}
	.about-visit__detail {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 16px;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		background: #fff;
	}
	.about-visit__detail > :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
		color: #62626b;
	}
	.about-visit__detail > div {
		min-width: 0;
	}
	.about-visit h4 {
		margin: 0 0 4px;
		font-size: 14px;
		line-height: 1.5;
		font-weight: 600;
		color: var(--bc-ink);
	}
	.about-visit__detail p {
		margin: 0;
		color: #62626b;
		font-size: 14px;
		line-height: 1.6;
	}
	.about-visit__detail a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		color: var(--bc-ink);
		font-size: 14px;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.about-visit__phones {
		display: flex;
		flex-wrap: wrap;
		gap: 0 16px;
	}
	.about-visit__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: auto;
	}
	.about-visit__actions a {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		gap: 10px;
		padding: 10px;
		border-radius: 8px;
		background: var(--bc-ink);
		color: #fff;
		font-size: 14px;
		font-weight: 600;
	}
	.about-visit__actions a:first-child {
		background: var(--bc-accent);
	}
	.about-visit__actions a:hover {
		background: var(--bc-accent-hover);
	}
	.about-visit__map:hover {
		background: #f5f5f6;
	}
	.about-visit__detail a:hover {
		color: var(--bc-accent);
	}
	.about-visit a:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	@media (max-width: 1023px) {
		.about-visit__map-toggle {
			top: 16px;
			bottom: auto;
		}
		.about-visit__layout {
			grid-template-columns: 1fr 1fr;
			gap: 16px;
		}
		.about-visit__content {
			padding: 16px;
		}
	}
	@media (max-width: 767px) {
		.about-company dl {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		.about-visit__map-toggle {
			left: 12px;
			top: 12px;
			padding: 10px;
			font-size: 12px;
		}
		.about-visit__map {
			padding: 10px;
			font-size: 12px;
		}
		.about-visit {
			padding-block: 28px 36px;
		}
		.about-visit__layout {
			grid-template-columns: 1fr;
		}
		.about-visit__photo {
			min-height: 0;
			aspect-ratio: 3 / 2;
		}
		.about-visit__map {
			bottom: 12px;
			right: 12px;
		}
		.about-visit h3 {
			font-size: 18px;
		}
		.about-visit__detail {
			padding: 12px;
		}
	}
</style>
