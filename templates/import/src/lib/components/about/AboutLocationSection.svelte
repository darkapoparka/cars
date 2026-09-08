<script lang="ts">
	import type { AuxeroAboutOffice } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { office }: { office: AuxeroAboutOffice } = $props();

	const externalHref = (href: string) => ({ href });
	const showSecondaryPhone = $derived(
		office.secondaryPhoneHref !== office.phoneHref || office.secondaryPhone !== office.phone
	);
</script>

<section class="daynight-about-location">
	<div class="container">
		<AboutSectionHeader heading={office.heading} description={office.description} />
		<div class="daynight-about-location__shell">
			<div class="daynight-about-location__content wow fadeInLeft" data-wow-delay="0.1s">
				<div class="daynight-about-location__cards">
					<div class="daynight-about-location__panel-head">
						<span>Шоурум Day Night Auto</span>
						<strong>Огледи с предварителна уговорка</strong>
					</div>
					<article class="daynight-about-location-card">
						<span><img src="/assets/icons/MapPin.svg" alt="" /></span>
						<div>
							<h3>Адрес</h3>
							<p>{office.address}</p>
						</div>
					</article>
					<article class="daynight-about-location-card">
						<span><img src="/assets/icons/PhoneCall.svg" alt="" /></span>
						<div>
							<h3>Телефон</h3>
							<a {...externalHref(office.phoneHref)}>{office.phone}</a>
							{#if showSecondaryPhone}
								<a {...externalHref(office.secondaryPhoneHref)}>{office.secondaryPhone}</a>
							{/if}
						</div>
					</article>
					<article class="daynight-about-location-card">
						<span><img src="/assets/icons/Alarm.svg" alt="" /></span>
						<div>
							<h3>Работно време</h3>
							<p>{office.hours}</p>
							<p>{office.appointment}</p>
							<a {...externalHref(office.emailHref)}>{office.email}</a>
						</div>
					</article>
					<div class="daynight-about-location__actions">
						<a class="daynight-about-location__action" {...externalHref(office.phoneHref)}>
							Позвъни
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z"
								/>
							</svg>
						</a>
						<a class="daynight-about-location__action" {...externalHref(office.emailHref)}>
							Имейл
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
								<rect x="2" y="4" width="20" height="16" rx="2" />
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div class="daynight-about-location__map wow fadeInRight" data-wow-delay="0.1s">
				<iframe
					src={office.mapEmbedUrl}
					width="100%"
					height="100%"
					style="border:0;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Day Night Auto Plovdiv map"
				></iframe>

				<div class="daynight-about-location__map-info">
					<span class="daynight-about-location__map-pin">
						<img src="/assets/icons/MapPin.svg" alt="" />
					</span>
					<div>
						<strong>Day Night Auto</strong>
						<small>{office.address}</small>
					</div>
				</div>

				<a
					class="daynight-about-location__map-link"
					{...externalHref(office.mapHref)}
					target="_blank"
					rel="noreferrer"
				>
					Отвори карта
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ffffff"
						stroke-width="2.4"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M7 17L17 7" />
						<path d="M8 7h9v9" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.daynight-about-location {
		background: var(--bc-bg);
		padding: 50px 0 72px;
	}

	.daynight-about-location__shell {
		display: grid;
		gap: 24px;
		grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr);
		align-items: stretch;
	}

	.daynight-about-location__content {
		display: flex;
		min-width: 0;
		flex-direction: column;
		grid-column: 2;
	}

	.daynight-about-location__cards {
		display: flex;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f2f6ef;
		padding: 14px;
		box-shadow: 0 12px 30px rgb(22 36 14 / 0.08);
		flex-direction: column;
		gap: 10px;
	}

	.daynight-about-location__panel-head {
		border-radius: 8px;
		background: #101010;
		padding: 18px 18px 16px;
		color: #ffffff;
	}

	.daynight-about-location__panel-head span {
		display: block;
		margin-bottom: 4px;
		color: #ffffff;
		font-size: 12px;
		font-weight: 800;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.daynight-about-location__panel-head strong {
		display: block;
		color: #ffffff;
		font-size: 19px;
		font-weight: 800;
		line-height: 1.18;
	}

	.daynight-about-location-card {
		display: flex;
		min-height: 0;
		border: 1px solid #e0e8da;
		border-radius: 8px;
		background: #ffffff;
		padding: 16px 18px;
		gap: 14px;
		align-items: center;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-about-location-card:hover {
			border-color: var(--bc-accent);
			background: #f4f4f4;
		}
	}

	.daynight-about-location-card span {
		flex: 0 0 auto;
		display: inline-flex;
		width: 42px;
		height: 42px;
		border: 1px solid #dde0e4;
		border-radius: 8px;
		background: #f3f4f6;
		align-items: center;
		justify-content: center;
	}

	.daynight-about-location-card img {
		width: 19px;
		height: 19px;
		opacity: 0.82;
		filter: brightness(0) saturate(100%);
	}

	.daynight-about-location-card div {
		min-width: 0;
		flex: 1 1 auto;
	}

	.daynight-about-location-card h3 {
		margin-bottom: 5px;
		color: #111111;
		font-size: 15px;
		font-weight: 800;
		line-height: 1.2;
	}

	.daynight-about-location-card p,
	.daynight-about-location-card a {
		display: block;
		margin: 0 0 3px;
		color: #696665;
		font-size: 14px;
		line-height: 1.38;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-about-location-card a:hover {
			color: #b9161c;
		}
	}

	.daynight-about-location__actions {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.daynight-about-location__action {
		display: inline-flex;
		min-height: 42px;
		border-radius: 8px;
		background: #1c1c1c;
		padding: 0 16px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 800;
		line-height: 1;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.daynight-about-location__action:focus-visible {
		background: var(--bc-accent);
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-about-location__action:hover {
			background: var(--bc-accent);
			color: #ffffff;
		}
	}

	.daynight-about-location__map {
		position: relative;
		min-height: 430px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f3f4f6;
		grid-column: 1;
		grid-row: 1;
		isolation: isolate;
	}

	.daynight-about-location__map iframe {
		position: absolute;
		z-index: 0;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.daynight-about-location__map-info {
		position: absolute;
		z-index: 2;
		top: 18px;
		left: 18px;
		display: flex;
		max-width: min(320px, calc(100% - 36px));
		border: 1px solid rgb(255 255 255 / 0.7);
		border-radius: 8px;
		background: rgb(255 255 255 / 0.92);
		padding: 11px 14px;
		gap: 12px;
		align-items: center;
		box-shadow: 0 8px 22px rgb(17 24 39 / 0.16);
		backdrop-filter: blur(10px);
	}

	.daynight-about-location__map-pin {
		flex: 0 0 auto;
		display: inline-flex;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(150deg, #101010, #1c1c1c);
		align-items: center;
		justify-content: center;
		box-shadow: 0 6px 16px rgb(17 24 39 / 0.3);
	}

	.daynight-about-location__map-pin img {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
	}

	.daynight-about-location__map-info strong {
		display: block;
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
	}

	.daynight-about-location__map-info small {
		display: block;
		margin-top: 2px;
		color: #5a6356;
		font-size: 13.5px;
		line-height: 1.35;
	}

	.daynight-about-location__map-link {
		position: absolute;
		z-index: 2;
		right: 16px;
		bottom: 16px;
		display: inline-flex;
		min-height: 42px;
		align-items: center;
		gap: 9px;
		border-radius: 8px;
		background: #1c1c1c;
		padding: 0 18px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		box-shadow: 0 6px 18px rgb(17 24 39 / 0.24);
		transition: background-color 0.18s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-about-location__map-link:hover {
			color: #ffffff;
			background: #20330f;
		}
	}

	@media (max-width: 991px) {
		.daynight-about-location__shell {
			grid-template-columns: 1fr;
		}

		.daynight-about-location__content,
		.daynight-about-location__map {
			grid-column: auto;
			grid-row: auto;
		}

		.daynight-about-location__cards {
			min-height: 0;
			grid-template-rows: auto;
		}

		.daynight-about-location__map {
			min-height: 340px;
		}
	}

	@media (max-width: 767px) {
		.daynight-about-location {
			padding: 38px 0 54px;
		}

		.daynight-about-location__cards {
			margin-top: 18px;
		}

		.daynight-about-location__map {
			min-height: 300px;
		}

		.daynight-about-location__map-info {
			top: 14px;
			left: 14px;
			padding: 10px 13px;
		}

		.daynight-about-location__map-link {
			right: 14px;
			bottom: 14px;
			min-height: 44px;
		}

		/* Mobile typography: align with the even scale + weight cap, larger tap targets. */
		.daynight-about-location__panel-head span {
			font-weight: 600;
		}

		.daynight-about-location__panel-head strong {
			font-size: 18px;
			font-weight: 700;
		}

		.daynight-about-location-card h3 {
			font-size: 16px;
			font-weight: 700;
		}

		.daynight-about-location-card a {
			display: inline-flex;
			width: fit-content;
			min-height: 44px;
			align-items: center;
		}

		.daynight-about-location__action {
			min-height: 44px;
			font-weight: 700;
		}

		.daynight-about-location__map-info small {
			font-size: 12px;
		}
	}
</style>
