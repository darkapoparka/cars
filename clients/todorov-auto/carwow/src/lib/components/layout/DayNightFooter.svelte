<script lang="ts">
	import DesktopDealerFooter from './DesktopDealerFooter.svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightFooterBottomLinks, daynightFooterLinkGroups } from './daynight-footer-data';
	import DayNightFooterIcon from './DayNightFooterIcon.svelte';

	const phoneHref = `tel:${daynightSite.phone}`;
	const contactHref = '/contact';
	const facebookLinkProps = {
		href: '',
		target: '_blank',
		rel: 'noopener'
	} as const;
	const instagramLinkProps = {
		href: '',
		target: '_blank',
		rel: 'noopener'
	} as const;
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
	const sourceInventoryLinkProps = {
		href: daynightSite.sourceInventory,
		target: '_blank',
		rel: 'noopener'
	} as const;

	const containerClasses = 'mx-auto w-full max-w-[1440px] px-[15px] max-[767px]:px-4';
	const footerLinkClasses =
		'relative inline-block !text-[16px] font-medium !leading-6 text-sa-surface/68 no-underline transition duration-150 ease-sa hover:text-sa-surface focus-visible:text-sa-surface';
	const socialLinkClasses =
		'flex size-11 items-center justify-center rounded-sa-pill border border-sa-surface/20 text-sa-surface/70 no-underline transition duration-150 ease-sa hover:border-sa-surface hover:bg-sa-surface hover:text-sa-ink focus-visible:border-sa-surface focus-visible:bg-sa-surface focus-visible:text-sa-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue [&_svg]:size-5 [&_svg_circle]:stroke-current [&_svg_path]:stroke-current';
</script>

<DesktopDealerFooter />

<footer
	class="daynight-legacy-footer relative bg-sa-dark font-sa leading-[26px] tracking-normal text-sa-surface"
	data-daynight-footer
>
	<div class="pt-20 pb-[76px] max-[767px]:pt-11 max-[767px]:pb-[42px]">
		<div class={containerClasses}>
			<div class="grid grid-cols-3 gap-[30px] max-[1199px]:grid-cols-1">
				<div class="min-w-0">
					<div
						class="grid -translate-x-[15px] -translate-y-[5px] gap-0 max-[1199px]:translate-x-0 max-[1199px]:translate-y-0 max-[1199px]:grid-cols-2 max-[1199px]:gap-[30px] max-[767px]:mb-0 max-[767px]:grid-cols-1 max-[767px]:gap-[21px]"
					>
						<div>
							<a
								href={resolve('/')}
								class="inline-block no-underline"
								aria-label="Автосалон Тодоров начална страница"
							>
								<img
									class="mb-[22px] block h-[54px] w-[190px] object-contain"
									src={daynightSite.logoLight}
									alt={daynightSite.shortName}
								/>
							</a>
							<p class="m-0 mb-2 text-sa-sm leading-5 font-medium text-sa-surface/60 uppercase">
								Огледи и консултация
							</p>
							<p class="m-0 mb-7 text-sa-surface/75">
								Огледи с предварителна уговорка.<br />Наличност, финансиране, бартер и съдействие по
								документи.
							</p>
						</div>
						<form
							class="relative mt-6 w-[min(100%,380px)] max-[1199px]:mt-5 max-[1199px]:ml-auto max-[1199px]:w-full max-[1199px]:max-w-full max-[767px]:mt-0 max-[767px]:ml-0"
							action={resolve('/contact')}
							method="get"
							title="Запиши се за нови оферти"
						>
							<label class="sr-only" for="footer-email">Имейл за нови оферти</label>
							<input
								type="email"
								placeholder="Имейл за нови оферти"
								name="email"
								id="footer-email"
								autocomplete="email"
								required
								class="h-14 w-full rounded-sa-pill border-0 bg-sa-surface/10 py-2 pr-16 pl-5 font-sa text-sa-base text-sa-surface shadow-none ring-1 ring-sa-surface/20 outline-0 placeholder:text-sa-surface/55 placeholder:opacity-100 focus:ring-sa-blue"
							/>
							<button
								type="submit"
								class="absolute top-1 right-1 flex size-12 cursor-pointer items-center justify-center rounded-sa-pill border-0 bg-sa-surface text-sa-ink transition duration-150 ease-sa hover:bg-sa-blue hover:text-sa-surface focus-visible:bg-sa-blue focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue [&_svg]:size-6 [&_svg_path]:stroke-current"
								aria-label="Изпрати интерес към нови оферти"
							>
								<DayNightFooterIcon name="search" />
							</button>
						</form>
					</div>
				</div>
				<div class="min-w-0">
					<div
						class="flex justify-between gap-2 pr-1.5 max-[1199px]:mt-6 max-[1199px]:mb-6 max-[1199px]:justify-start max-[1199px]:gap-[30px] max-[1199px]:p-0 max-[991px]:gap-4 max-[767px]:flex-col xl:-translate-x-[3px] xl:gap-0.5"
					>
						{#each daynightFooterLinkGroups as group (group.title)}
							<details class="footer-link-group min-w-0 max-[1199px]:w-1/2 max-[767px]:w-full">
								<summary
									class="m-0 mb-3.5 flex items-center justify-between font-semibold text-sa-surface max-[767px]:mb-0"
									data-breakpoint="mobile"
								>
									{group.title}
								</summary>
								<ul class="m-0 grid list-none gap-[7px] p-0">
									{#each group.links as link (link.href)}
										<li class="mb-1 last:mb-0">
											<a class={footerLinkClasses} href={resolve(link.href)}>{link.label}</a>
										</li>
									{/each}
								</ul>
							</details>
						{/each}
					</div>
				</div>
				<div class="min-w-0">
					<div
						class="grid translate-x-3 gap-[22px] pl-[55px] max-[1199px]:mt-7 max-[1199px]:flex max-[1199px]:translate-x-0 max-[1199px]:gap-[30px] max-[1199px]:pl-0 max-[767px]:mt-0 max-[767px]:block"
					>
						<div>
							<p class="m-0 mb-2">
								<a
									href={phoneHref}
									class="block text-sa-lg leading-[1.44] font-medium text-sa-surface no-underline max-[767px]:font-semibold"
									>{daynightSite.phoneLabel}</a
								>
							</p>
							<a
								{...mapLinkProps}
								class="mb-5 block text-sa-lg leading-[1.44] font-medium text-sa-surface/70 no-underline max-[767px]:mb-[29px] max-[767px]:font-semibold"
							>
								{daynightSite.location}
							</a>
							<p class="m-0 mb-4 text-sa-sm leading-[22px] text-sa-surface/60">
								Автосалон Тодоров предлага актуална дигитална витрина с наличност, запитвания и ясни
								следващи стъпки.
							</p>
							<ul class="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
								<li>
									
								</li>
								<li>
									
								</li>
								<li>
									<a
										href={phoneHref}
										title={`Свържете се с ${daynightSite.shortName} по телефон или Viber.`}
										aria-label={`Свържете се с ${daynightSite.shortName} по телефон или Viber.`}
										class={socialLinkClasses}
									>
										<DayNightFooterIcon name="phone" />
									</a>
								</li>
								<li>
									<a
										{...sourceInventoryLinkProps}
										title="Виж наличните автомобили в mobile.bg"
										aria-label="Виж наличните автомобили в mobile.bg"
										class={socialLinkClasses}
									>
										<DayNightFooterIcon name="car-lot" />
									</a>
								</li>
								<li>
									<a
										{...mapLinkProps}
										title="Отвори локацията на Автосалон Тодоров в Google Maps"
										aria-label="Отвори локацията на Автосалон Тодоров в Google Maps"
										class={socialLinkClasses}
									>
										<DayNightFooterIcon name="location" />
									</a>
								</li>
							</ul>
						</div>
						<div
							class="max-[1199px]:w-1/2 max-[767px]:mt-[18px] max-[767px]:w-full xl:translate-y-1"
						>
							<p class="m-0 mb-2 text-sa-sm leading-[22px] font-semibold text-sa-surface">
								Имате въпрос?
							</p>
							<div class="flex items-center gap-3">
								<a
									href={resolve(contactHref)}
									class="inline-flex min-h-11 items-center justify-center rounded-sa-xs border border-sa-surface/20 px-3.5 text-sa-base leading-none font-semibold text-sa-surface/75 no-underline transition duration-150 ease-sa hover:border-sa-blue hover:bg-sa-blue hover:text-sa-surface focus-visible:border-sa-blue focus-visible:bg-sa-blue focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-blue"
									title="Свържете се със Автосалон Тодоров."
								>
									Свържете се
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="h-px w-full bg-sa-surface/10"></div>
	<div class="py-[17px]">
		<div class={containerClasses}>
			<div
				class="flex items-center justify-start gap-5 max-[767px]:flex-col max-[767px]:items-start max-[767px]:text-left"
			>
				<p class="m-0 text-sa-sm leading-[22px] text-sa-surface/60">
					©2026 <a
						class="text-sa-sm leading-[22px] text-sa-surface no-underline"
						href={resolve('/')}>Автосалон Тодоров</a
					>. Демонстрационна концепция. Не е официалният сайт.
				</p>
				<ul
					class="m-0 flex list-none flex-wrap items-center p-0 max-[767px]:w-full max-[767px]:justify-start"
				>
					{#each daynightFooterBottomLinks as link, index (link.label)}
						<li class="flex items-center">
							{#if index > 0}
								<span class="mx-2 block h-3 w-0.5 bg-sa-surface/20" aria-hidden="true"></span>
							{/if}
							<a
								class="inline-block text-sa-sm leading-[22px] font-medium text-sa-surface/60 no-underline transition duration-150 ease-sa hover:text-sa-surface focus-visible:text-sa-surface"
								href={resolve(link.href)}
								title={link.title}>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer-link-group summary {
		min-height: 44px;
		cursor: pointer;
		list-style: none;
	}
	.footer-link-group summary::after {
		content: '+';
		margin-left: 12px;
	}
	.footer-link-group[open] summary::after {
		content: '−';
	}
	.footer-link-group summary:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
	.footer-link-group a {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}

	@media (min-width: 992px) {
		.daynight-legacy-footer {
			display: none;
		}
	}
</style>
