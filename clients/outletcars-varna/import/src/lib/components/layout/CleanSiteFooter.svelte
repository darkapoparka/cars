<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveFooterData, HomeFiveFooterSocial } from '$lib/auxero/home-five';

	// Clean Svelte 5 + Tailwind v4 footer — 1:1 with the themed HomeFiveFooter,
	// but no Auxero theme classes / no app.css. Values sampled from the live footer.
	let { footer }: { footer: HomeFiveFooterData } = $props();

	const externalHref = (href: string) => ({ href });
	const linkGroups = $derived([
		{ title: footer.labels.quickLinks, links: footer.quickLinks },
		{ title: footer.labels.buyingSelling, links: footer.buyingLinks }
	]);
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

<footer class="bg-bc-ink font-bc-body text-white">
	<div class="mx-auto w-full max-w-[1440px] px-4 pt-20 pb-[72px]">
		<div class="grid gap-10 lg:grid-cols-3">
			<!-- Brand + newsletter -->
			<div>
				<a href={resolve(footer.logo.href as '/')} class="inline-block">
					<img src={footer.logo.src} alt={footer.logo.alt} class="h-[54px] w-auto" />
				</a>
				<p class="mt-6 mb-2 text-xs font-medium text-[#9fa1a4] uppercase">
					{footer.labels.openingHours}
				</p>
				<p class="mb-7 leading-6 text-white">
					{footer.hours[0]}<br />{footer.hours[1]}
				</p>
				<form class="relative max-w-[340px]" action="#">
					<input
						type="text"
						name="footer-email"
						placeholder={footer.labels.emailPlaceholder}
						class="focus:shadow-[0_0_0_3px_rgba(227, 6, 47, 0.35)] h-14 w-full rounded-full border border-[#9fa1a4] bg-white/10 pr-16 pl-5 text-sm text-white transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-[#9fa1a4] hover:border-white/60 focus:border-bc-accent"
						required
					/>
					<button
						type="submit"
						aria-label={footer.labels.subscribe}
						class="absolute top-1 right-1 flex h-12 w-12 items-center justify-center rounded-full bg-white transition-colors duration-200 hover:bg-bc-accent"
					>
						{@render submitArrow()}
					</button>
				</form>
			</div>

			<!-- Link columns -->
			<div class="flex justify-between gap-8 lg:justify-start lg:gap-16">
				{#each linkGroups as group (group.title)}
					<div>
						<p class="mb-3.5 text-base font-semibold text-white">{group.title}</p>
						<ul class="flex flex-col gap-2.5">
							{#each group.links as link (link.href)}
								<li>
									<a
										href={resolve(link.href as '/')}
										class="text-sm leading-[22px] text-[#9fa1a4] transition-colors hover:text-white"
									>
										{link.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<!-- Contact + social -->
			<div>
				<p class="mb-2">
					<a {...externalHref(footer.contact.phoneHref)} class="text-lg font-medium text-white">
						{footer.contact.phoneLabel}
					</a>
				</p>
				<a href={resolve('/contact')} class="mb-5 block text-lg font-medium text-white">
					{footer.contact.address}
				</a>
				<ul class="flex gap-3">
					{#each footer.socialLinks as social (social.label)}
						<li>
							<a
								{...externalHref(social.href)}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.label}
								class="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors duration-200 hover:border-white hover:bg-white hover:[&_path]:fill-[#1c1c1c]"
							>
								{@render socialIcon(social.icon)}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<div class="h-px bg-white/10"></div>

	<div class="mx-auto w-full max-w-[1440px] px-4 py-6">
		<div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
			<p class="text-sm text-[#9fa1a4]">{footer.copyright}</p>
			<ul class="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
				{#each footer.legalLinks as link (link.label)}
					<li>
						<a
							href={resolve(link.href as '/')}
							class="text-sm text-[#9fa1a4] transition-colors hover:text-white"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</footer>
