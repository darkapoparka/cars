<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRight, Mail, MapPin, Phone } from '@lucide/svelte';
	import type {
		HomeFiveFooterData,
		HomeFiveFooterLink,
		HomeFiveFooterSocial
	} from '$lib/auxero/home-five';
	import { eliqautoContact } from '$lib/data/eliqauto';

	let { footer }: { footer?: HomeFiveFooterData } = $props();

	const externalHref = (href: string) => ({ href });
	const selectLinks = (hrefs: string[], links: HomeFiveFooterLink[]) =>
		hrefs.flatMap((href) => {
			const link = links.find((item) => item.href === href);
			return link ? [link] : [];
		});
	const allFooterLinks = $derived([...(footer?.quickLinks ?? []), ...(footer?.buyingLinks ?? [])]);
	const desktopQuickLinks = $derived(
		selectLinks(['/about', '/reviews', '/faqs', '/blog', '/contact'], allFooterLinks)
	);
	const desktopBuyingLinks = $derived(
		selectLinks(
			['/inventory', '/sell-your-car', '/services', '/agents', '/calculator'],
			allFooterLinks
		)
	);
</script>

{#snippet submitArrow()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.1279 6V15.75C19.1279 16.0484 19.0094 16.3345 18.7984 16.5455C18.5874 16.7565 18.3013 16.875 18.0029 16.875C17.7045 16.875 17.4184 16.7565 17.2074 16.5455C16.9964 16.3345 16.8779 16.0484 16.8779 15.75V8.71875L6.79883 18.7959C6.58748 19.0073 6.30084 19.126 6.00195 19.126C5.70307 19.126 5.41642 19.0073 5.20508 18.7959C4.99373 18.5846 4.875 18.2979 4.875 17.9991C4.875 17.7002 4.99373 17.4135 5.20508 17.2022L15.2841 7.125H8.25289C7.95452 7.125 7.66837 7.00647 7.45739 6.7955C7.24642 6.58452 7.12789 6.29837 7.12789 6C7.12789 5.70163 7.24642 5.41548 7.45739 5.2045C7.66837 4.99353 7.95452 4.875 8.25289 4.875H18.0029C18.3013 4.875 18.5874 4.99353 18.7984 5.2045C19.0094 5.41548 19.1279 5.70163 19.1279 6Z"
			fill="#1C1C1C"
		/>
	</svg>
{/snippet}

{#snippet socialIcon(icon: HomeFiveFooterSocial['icon'])}
	{#if icon === 'facebook'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.5502 20V10.8777H14.6109L15.0701 7.32156H11.5502V5.05147C11.5502 4.0222 11.8348 3.32076 13.3125 3.32076L15.194 3.31999V0.13923C14.8686 0.0969453 13.7517 0 12.4517 0C9.73708 0 7.87861 1.65697 7.87861 4.69927V7.32156H4.80859V10.8777H7.87861V20H11.5502Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'x'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.8616 8.46864L19.147 0H17.4206L11.0947 7.3532L6.04225 0H0.214844L7.85515 11.1193L0.214844 20H1.94134L8.62162 12.2348L13.9574 20H19.7848L11.8612 8.46864H11.8616ZM9.49695 11.2173L8.72283 10.1101L2.56342 1.29967H5.21521L10.1859 8.40994L10.96 9.51718L17.4214 18.7594H14.7696L9.49695 11.2177V11.2173Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'instagram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.9996 0H4.99988C2.25019 0 0 2.25019 0 4.99988V15.0001C0 17.7491 2.25019 20 4.99988 20H14.9996C17.7493 20 19.9995 17.7491 19.9995 15.0001V4.99988C19.9995 2.25019 17.7493 0 14.9996 0ZM18.3328 15.0001C18.3328 16.8376 16.8381 18.3333 14.9996 18.3333H4.99988C3.16218 18.3333 1.66671 16.8376 1.66671 15.0001V4.99988C1.66671 3.16193 3.16218 1.66671 4.99988 1.66671H14.9996C16.8381 1.66671 18.3328 3.16193 18.3328 4.99988V15.0001Z"
				fill="white"
			/>
			<path
				d="M15.4179 5.83392C16.1083 5.83392 16.6679 5.27429 16.6679 4.58395C16.6679 3.89361 16.1083 3.33398 15.4179 3.33398C14.7276 3.33398 14.168 3.89361 14.168 4.58395C14.168 5.27429 14.7276 5.83392 15.4179 5.83392Z"
				fill="white"
			/>
			<path
				d="M9.99988 5C7.23793 5 5 7.23818 5 9.99988C5 12.7606 7.23793 15.0002 9.99988 15.0002C12.761 15.0002 14.9998 12.7606 14.9998 9.99988C14.9998 7.23818 12.761 5 9.99988 5ZM9.99988 13.3335C8.15915 13.3335 6.66671 11.8411 6.66671 9.99988C6.66671 8.15866 8.15915 6.66671 9.99988 6.66671C11.8406 6.66671 13.333 8.15866 13.333 9.99988C13.333 11.8411 11.8406 13.3335 9.99988 13.3335Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'viber'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 2C6.5 2 2 5.8 2 10.5c0 2.6 1.4 4.9 3.5 6.5-.1 1-.5 2.3-1.2 3.2 1.5-.2 3-.8 4.2-1.7 1.1.3 2.3.5 3.5.5 5.5 0 10-3.8 10-8.5S17.5 2 12 2ZM8 11.7a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
				fill="white"
			/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15.4163 11.3756L10.9163 8.37563C10.8033 8.30025 10.6719 8.25697 10.5363 8.2504C10.4006 8.24382 10.2657 8.27421 10.146 8.33831C10.0263 8.40241 9.9262 8.49783 9.85645 8.61436C9.7867 8.7309 9.74991 8.86419 9.75 9V15C9.74991 15.1358 9.7867 15.2691 9.85645 15.3856C9.9262 15.5022 10.0263 15.5976 10.146 15.6617C10.2657 15.7258 10.4006 15.7562 10.5363 15.7496C10.6719 15.743 10.8033 15.6998 10.9163 15.6244L15.4163 12.6244C15.5191 12.5559 15.6035 12.4631 15.6618 12.3542C15.7202 12.2452 15.7507 12.1236 15.7507 12C15.7507 11.8764 15.7202 11.7548 15.6618 11.6458C15.6035 11.5369 15.5191 11.4441 15.4163 11.3756Z"
				fill="white"
			/>
			<path
				d="M21.9684 6.5175C21.8801 6.17189 21.7109 5.85224 21.4747 5.58491C21.2385 5.31758 20.9421 5.11024 20.61 4.98C17.3962 3.73875 12.2812 3.75 12 3.75C11.7188 3.75 6.60375 3.73875 3.39 4.98C3.0579 5.11024 2.76153 5.31758 2.52534 5.58491C2.28915 5.85224 2.1199 6.17189 2.03156 6.5175C1.78875 7.45313 1.5 9.16313 1.5 12C1.5 14.8369 1.78875 16.5469 2.03156 17.4825C2.11977 17.8283 2.28895 18.1481 2.52515 18.4156C2.76136 18.6831 3.0578 18.8906 3.39 19.0209C6.46875 20.2088 11.2875 20.25 11.9381 20.25H12.0619C12.7125 20.25 17.5341 20.2088 20.61 19.0209C20.9422 18.8906 21.2386 18.6831 21.4748 18.4156C21.711 18.1481 21.8802 17.8283 21.9684 17.4825C22.2113 16.545 22.5 14.8369 22.5 12C22.5 9.16313 22.2113 7.45313 21.9684 6.5175Z"
				fill="white"
			/>
		</svg>
	{/if}
{/snippet}

{#snippet viberBrandIcon()}
	<!-- Viber brand glyph: simple-icons/icons/viber.svg; source: viber.com/brand-center. -->
	<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
		><path
			d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z"
		/></svg
	>
{/snippet}

{#if footer}
	<footer class="bg-primary footer">
		<div class="footer-top">
			<div class="container">
				<div class="row">
					<div class="col-lg-4">
						<div class="footer-top-inner">
							<div>
								<a href={resolve(footer.logo.href as '/')}>
									<img class="logo" src={footer.logo.src} alt={footer.logo.alt} />
								</a>

								<p class="text-muted font-weight-500 mb-8 text-xs uppercase">
									{footer.labels.openingHours}
								</p>

								<p class="mb-28 text-white">
									{footer.hours[0]} <br />
									{footer.hours[1]}
								</p>
							</div>

							<form class="form-footer relative" action="#">
								<input
									type="text"
									placeholder={footer.labels.emailPlaceholder}
									name="footer-email"
									id="footer-email"
									required
								/>
								<button type="submit" class="btn-submit" aria-label={footer.labels.subscribe}>
									{@render submitArrow()}
								</button>
							</form>
						</div>
					</div>

					<div class="col-lg-4">
						<div class="footer-links flex justify-between gap-8">
							<div class="collapse">
								<p
									class="collapse-title font-weight-600 mb-14 justify-between text-white"
									data-breakpoint="mobile"
								>
									{footer.labels.quickLinks}
									<span class="icon md-block hidden text-white">+</span>
								</p>
								<ul class="widget-links collapse-content md-hidden">
									{#each footer.quickLinks as link (link.href)}
										<li class="footer-link-legacy">
											<a href={resolve(link.href as '/')}>{link.label}</a>
										</li>
									{/each}
									{#each desktopQuickLinks as link (link.href)}
										<li class="footer-link-desktop">
											<a href={resolve(link.href as '/')}>{link.label}</a>
										</li>
									{/each}
								</ul>
							</div>
							<div class="collapse">
								<p
									class="collapse-title font-weight-600 mb-14 justify-between text-white"
									data-breakpoint="mobile"
								>
									{footer.labels.buyingSelling}
									<span class="icon md-block hidden text-white">+</span>
								</p>
								<ul class="widget-links collapse-content md-hidden">
									{#each footer.buyingLinks as link (link.href)}
										<li class="footer-link-legacy">
											<a href={resolve(link.href as '/')}>{link.label}</a>
										</li>
									{/each}
									{#each desktopBuyingLinks as link (link.href)}
										<li class="footer-link-desktop">
											<a href={resolve(link.href as '/')}>{link.label}</a>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<div class="col-lg-4">
						<div class="footer-contact">
							<div>
								<p class="font-weight-500 mb-8 text-white">
									<a {...externalHref(footer.contact.phoneHref)} class="h7 flex items-start">
										{footer.contact.phoneLabel}
									</a>
								</p>
								<a href={resolve('/contact')} class="h7 font-weight-500 mb-20 block text-white">
									{footer.contact.address}
								</a>

								<ul class="widget-socical mb-12">
									{#each footer.socialLinks as social (social.label)}
										<li>
											<a
												{...externalHref(social.href)}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={social.label}
											>
												{@render socialIcon(social.icon)}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						</div>
						<div class="footer-contact-panel">
							<a
								class="footer-contact-panel__action footer-contact-panel__phone"
								{...externalHref(eliqautoContact.primaryPhoneHref)}
							>
								<Phone size={18} strokeWidth={1.75} aria-hidden="true" />
								<span>{eliqautoContact.primaryPhoneLabel}</span>
								<ArrowUpRight class="footer-contact-panel__arrow" size={16} aria-hidden="true" />
							</a>
							<a class="footer-contact-panel__action" {...externalHref(eliqautoContact.emailHref)}>
								<Mail size={18} strokeWidth={1.75} aria-hidden="true" />
								<span>{eliqautoContact.emailLabel}</span>
								<ArrowUpRight class="footer-contact-panel__arrow" size={16} aria-hidden="true" />
							</a>
							<a
								class="footer-contact-panel__action"
								{...externalHref(eliqautoContact.mapHref)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
								<span>{footer.contact.address}</span>
								<ArrowUpRight class="footer-contact-panel__arrow" size={16} aria-hidden="true" />
							</a>
							<div class="footer-contact-panel__socials">
								<a
									{...externalHref(eliqautoContact.facebookHref)}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Facebook"
									title="Facebook"
								>
									{@render socialIcon('facebook')}
								</a>
								<a {...externalHref(eliqautoContact.viberHref)} aria-label="Viber" title="Viber">
									{@render viberBrandIcon()}
								</a>
								<a
									class="footer-contact-panel__marketplace"
									{...externalHref(eliqautoContact.youtubeHref)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span>Mobile.bg</span>
									<ArrowUpRight size={16} aria-hidden="true" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="divider divider-blur"></div>
		<div class="footer-bottom">
			<div class="container">
				<div class="md-flex-col flex justify-between">
					<p class="text-muted text-sm">{footer.copyright}</p>
					<ul class="footer-bottom-links">
						{#each footer.legalLinks as link (link.label)}
							<li><a href={resolve(link.href as '/')}>{link.label}</a></li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</footer>
{/if}

<style>
	.footer-contact-panel,
	.footer-link-desktop {
		display: none;
	}

	@media (min-width: 768px) {
		:global(body.auxero-template-home-05-html) .footer {
			width: 100%;
			margin: 24px 0 0;
			padding-inline: max(40px, calc((100% - 1300px) / 2));
			border-radius: 32px 32px 0 0;
			background: #1c1c1c;
			color: #ffffff;

			.container {
				width: 100%;
				max-width: none;
				padding: 0;
			}

			.footer-top {
				padding: 40px 0 32px;
			}

			.row {
				display: grid;
				grid-template-columns: minmax(0, 1.15fr) minmax(0, 2fr) minmax(0, 1fr);
				gap: 40px;
				margin: 0;
			}

			.col-lg-4 {
				width: auto;
				max-width: none;
				flex: none;
				padding: 0;
				min-width: 0;
			}

			.footer-top-inner,
			.footer-contact {
				margin: 0;
				padding: 0;
			}

			.footer-top-inner {
				display: block;
			}

			.footer-top-inner > div,
			.footer-links > .collapse {
				width: 100%;
			}

			.logo {
				max-width: 100%;
				margin: 0 0 32px;
			}

			.footer-top-inner p {
				font-size: 15px;
				line-height: 24px;
			}

			.footer-top-inner .text-muted {
				color: #a7a7ad;
				text-transform: none;
			}

			.footer-links {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 32px;
				padding: 0;
				margin: 0;
			}

			.collapse-title {
				display: block;
				margin: 0 0 8px;
				font-size: 16px;
				font-weight: 600;
				line-height: 24px;
				text-transform: lowercase;
			}

			.collapse-title::first-letter {
				text-transform: uppercase;
			}

			.collapse-title .icon {
				display: none;
			}

			.widget-links {
				display: block;
			}

			.widget-links li {
				margin: 0;
			}

			.footer-link-legacy {
				display: none;
			}

			.footer-link-desktop {
				display: block;
			}

			.widget-links a {
				color: #c4c4c9;
				font-size: 15px;
				line-height: 22px;
			}

			.footer-contact a.h7 {
				font-size: 18px;
				line-height: 24px;
				margin-bottom: 0;
			}

			.footer-contact p {
				margin: -10px 0 8px;
			}

			.footer-contact {
				display: none;
			}

			.footer-contact-panel {
				display: block;
				padding: 16px;
				border: 1px solid #3b3b3f;
				border-radius: 16px;
				background: #242426;
			}

			.footer-contact-panel a {
				display: flex;
				align-items: center;
				min-height: 44px;
				gap: 12px;
				color: #d2d2d6;
				font-size: 15px;
				line-height: 22px;
				text-decoration: none;
			}

			.footer-contact-panel a :global(svg) {
				flex: 0 0 auto;
			}

			.footer-contact-panel a > span {
				font: inherit;
				color: inherit;
			}

			.footer-contact-panel .footer-contact-panel__phone {
				color: #ffffff;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}

			.footer-contact-panel .footer-contact-panel__action {
				display: grid;
				grid-template-columns: 18px minmax(0, 1fr) 16px;
				gap: 8px;
				min-height: 48px;
				margin-inline: -8px;
				padding: 8px;
				border-radius: 8px;
				font-size: 16px;
				line-height: 24px;
			}

			.footer-contact-panel__action :global(.footer-contact-panel__arrow) {
				color: #a7a7ad;
			}

			.footer-contact-panel .footer-contact-panel__action:hover,
			.footer-contact-panel .footer-contact-panel__action:focus-visible {
				background: #343438;
				color: #ffffff;
			}

			.footer-contact-panel__socials {
				display: flex;
				align-items: center;
				gap: 8px;
				margin-top: 12px;
				padding-top: 12px;
				border-top: 1px solid #3b3b3f;
			}

			.footer-contact-panel__socials a {
				flex: 0 0 44px;
				justify-content: center;
				gap: 4px;
				border: 1px solid #48484d;
				border-radius: 8px;
				color: #ffffff;
			}

			.footer-contact-panel__socials .footer-contact-panel__marketplace {
				flex: 1;
				padding-inline: 8px;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
			}

			.footer-contact-panel a:hover {
				color: #ffffff;
			}

			.footer-contact-panel__socials a:hover {
				background: #38383c;
				border-color: #71717a;
			}

			.widget-socical {
				display: flex;
				gap: 8px;
				margin: 16px 0 0;
			}

			.widget-socical li {
				margin: 0;
			}

			.widget-socical a {
				width: 44px;
				height: 44px;
				border: 1px solid #48484d;
				border-radius: 8px;
				background: transparent;
			}

			.divider {
				background: #38383c;
			}

			.footer-bottom {
				padding: 16px 0;
			}

			.footer-bottom > .container > div {
				align-items: center;
				gap: 16px;
			}

			.footer-bottom p,
			.footer-bottom-links a {
				color: #a7a7ad;
				font-size: 14px;
				line-height: 22px;
			}

			.footer-bottom-links {
				gap: 24px;
			}

			.footer-bottom-links li {
				margin: 0;
				padding: 0;
			}

			.footer-bottom-links li::before {
				display: none;
			}

			a:hover {
				color: #ffffff;
			}

			a:focus-visible {
				outline: 2px solid #ffffff;
				outline-offset: 4px;
				border-radius: 4px;
			}
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		:global(body.auxero-template-home-05-html) .footer {
			padding-inline: 32px;

			.row {
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 32px;
			}

			.col-lg-4:nth-child(2) {
				grid-column: 1 / -1;
				grid-row: 2;
			}

			.footer-bottom > .container > div {
				flex-direction: column;
				gap: 0;
			}
		}
	}

	.footer :global(.widget-links a),
	.footer :global(.footer-bottom-links a),
	.footer :global(.footer-contact a.h7) {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
	}

	@media (max-width: 767px) {
		.footer :global(.footer-top) {
			padding-top: 44px;
			padding-bottom: 38px;
		}

		.footer :global(.logo) {
			height: 48px;
			margin-bottom: 24px;
		}

		.footer :global(.footer-top-inner) {
			margin-bottom: 24px;
		}

		.footer :global(.form-footer) {
			margin-top: 4px;
		}

		.footer :global(.footer-links) {
			gap: 0;
			margin-top: 20px;
			margin-bottom: 22px;
		}

		.footer :global(.footer-links .collapse) {
			border-top: 1px solid rgb(255 255 255 / 0.12);
			padding: 14px 0;
		}

		.footer :global(.footer-links .collapse:last-child) {
			border-bottom: 1px solid rgb(255 255 255 / 0.12);
		}

		.footer :global(.footer-contact) {
			margin-top: 4px;
		}

		.footer :global(.widget-socical) {
			gap: 10px;
			margin-top: 16px;
		}

		.footer :global(.widget-socical li:not(:last-child)) {
			margin-bottom: 0;
		}

		.footer :global(.widget-socical li a) {
			border-color: rgb(255 255 255 / 0.24);
			background: rgb(255 255 255 / 0.06);
		}

		.footer :global(.widget-socical li a svg) {
			width: 18px;
			height: 18px;
		}

		.footer :global(.widget-socical li a svg path) {
			fill: #ffffff;
		}

		.footer :global(.footer-bottom) {
			padding: 18px 0 22px;
		}

		.footer :global(.footer-bottom .md-flex-col) {
			gap: 8px;
		}

		.footer :global(.footer-bottom-links) {
			flex-wrap: wrap;
			justify-content: center;
			row-gap: 4px;
		}

		/* Give the legal links a comfortable touch target (was ~22px tall). */
		.footer :global(.footer-bottom-links li a) {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
