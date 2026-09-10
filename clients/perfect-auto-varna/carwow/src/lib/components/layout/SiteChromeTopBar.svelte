<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import SiteChromeIcon from './SiteChromeIcon.svelte';

	let {
		languageOpen = false,
		onLanguageToggle
	}: {
		languageOpen?: boolean;
		onLanguageToggle: () => void;
	} = $props();

	const locationShort = 'Победа, Варна';

	const socialLinkBase =
		'site-chrome-topbar__social-link inline-grid size-9 place-items-center text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-80 focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sa-surface/70 [&_img]:size-[22px] [&_svg]:size-[22px]';
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
	const phoneHref = `tel:${daynightSite.phone}`;
</script>

<div
	class="site-chrome-topbar relative z-[940] h-11 border-b border-sa-red-strong/70 bg-sa-red text-sa-surface max-[1199px]:hidden"
>
	<div class="mx-auto flex h-full w-full max-w-none items-center justify-between px-6">
		<div class="site-chrome-topbar__contact flex min-w-0 items-center">
				<a
					class="site-chrome-topbar__inventory mr-4 shrink-0 border-r border-sa-surface/25 pr-4 leading-none text-sa-surface no-underline hover:text-sa-surface/90"
					href={resolve('/inventory')}>{daynightSite.primaryCta}</a
				>
			<a
				{...mapLinkProps}
				class="site-chrome-topbar__location flex min-w-0 items-center gap-1.5 leading-none text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-4 [&_svg]:fill-current"
				aria-label={`Отвори в Google Maps: ${daynightSite.location}`}
			>
				<SiteChromeIcon name="location" />
				<span class="truncate">{locationShort}</span>
			</a>
			<span class="site-chrome-topbar__dot" aria-hidden="true">·</span>
			<a
				href={phoneHref}
				class="site-chrome-topbar__phone flex shrink-0 items-center gap-1.5 leading-none text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-4 [&_svg]:fill-current"
				aria-label={`Обади се на ${daynightSite.phoneLabel}`}
			>
				<SiteChromeIcon name="phone" />
				<span>{daynightSite.phoneLabel}</span>
			</a>
		</div>
		<div class="flex shrink-0 items-center gap-2.5">
			<ul class="m-0 flex list-none items-center gap-1.5 p-0" aria-label="Социални канали">
				<li>
					<a
						href="https://www.facebook.com/61566304063141/"
						aria-label="Facebook"
						target="_blank"
						rel="noopener"
						class={`${socialLinkBase} site-chrome-topbar__social-link--facebook`}
					>
						<SiteChromeIcon name="facebook" />
					</a>
				</li>
				<li>
					<a
						href="https://www.instagram.com/daynight.auto.plovdiv/"
						aria-label="Instagram"
						target="_blank"
						rel="noopener"
						class={`${socialLinkBase} site-chrome-topbar__social-link--instagram`}
					>
						<SiteChromeIcon name="instagram" />
					</a>
				</li>
			</ul>
			<div class="relative border-l border-sa-surface/25 pl-3" id="language-select">
				<button
					class="site-chrome-topbar__language inline-flex h-8 min-w-0 cursor-pointer items-center justify-center gap-1 border-0 bg-transparent px-1 leading-none text-sa-surface transition-opacity duration-150 ease-sa hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_span]:text-white [&_svg]:size-3.5 [&_svg_path]:stroke-current"
					type="button"
					aria-label="Език: Български"
					aria-haspopup="listbox"
					aria-controls="headerLanguageMenu"
					aria-expanded={languageOpen}
					onclick={onLanguageToggle}
				>
					<span>БГ</span>
					<SiteChromeIcon name="chevron-down" class="text-sa-surface" />
				</button>
				<div
					class={[
						'pointer-events-none invisible absolute top-[calc(100%+8px)] right-0 min-w-[170px] translate-y-[-4px] rounded-sa-sm border border-sa-line bg-sa-surface p-2 text-sa-ink opacity-0 shadow-sa-md transition duration-150 ease-sa',
						languageOpen && 'pointer-events-auto visible translate-y-0 opacity-100'
					]}
					id="headerLanguageMenu"
				>
					<ul class="m-0 list-none p-0" role="listbox" aria-label="Избор на език">
						<li
							class="rounded-sa-xs bg-sa-muted px-2.5 py-2 text-sa-base leading-6 font-medium text-sa-ink"
							role="option"
							aria-selected="true"
						>
							Български (активен)
						</li>
						<li
							class="text-sa-muted-foreground rounded-sa-xs px-2.5 py-2 text-sa-base leading-6"
							role="option"
							aria-selected="false"
							aria-disabled="true"
						>
							English (скоро)
						</li>
						<li
							class="text-sa-muted-foreground rounded-sa-xs px-2.5 py-2 text-sa-base leading-6"
							role="option"
							aria-selected="false"
							aria-disabled="true"
						>
							Други езици (скоро)
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.site-chrome-topbar__inventory {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.site-chrome-topbar__location,
	.site-chrome-topbar__phone {
		color: #fff;
		letter-spacing: 0;
	}

	.site-chrome-topbar__location {
		font-size: 13px;
		font-weight: 500;
		opacity: 1;
	}

	.site-chrome-topbar__phone {
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.site-chrome-topbar__dot {
		color: #fff;
		flex: none;
		font-size: 15px;
		line-height: 1;
		opacity: 0.4;
		padding: 0 10px;
	}

	.site-chrome-topbar__location span,
	.site-chrome-topbar__phone span {
		color: inherit;
		font: inherit;
	}

	.site-chrome-topbar__location :global(svg),
	.site-chrome-topbar__phone :global(svg) {
		color: currentColor;
		fill: currentColor;
		flex: none;
	}

	.site-chrome-topbar__social-link {
		background: transparent;
	}

	.site-chrome-topbar__social-link--facebook :global(img),
	.site-chrome-topbar__social-link--instagram :global(img) {
		display: block;
		height: 22px;
		object-fit: contain;
		width: 22px;
	}

	.site-chrome-topbar__language {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0 !important;
	}
	.site-chrome-topbar__language span {
		font: inherit;
	}
	@media (min-width: 1200px) {
		.site-chrome-topbar__social-link {
			height: 28px !important;
			width: 28px !important;
		}
		.site-chrome-topbar__social-link :global(img) {
			height: 18px !important;
			width: 18px !important;
		}
		.site-chrome-topbar__language {
			height: 28px !important;
		}
	}
</style>
