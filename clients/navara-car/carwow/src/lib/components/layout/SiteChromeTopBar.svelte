<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import LocaleSettingsMenu from './LocaleSettingsMenu.svelte';
	import SiteChromeIcon from './SiteChromeIcon.svelte';

	const locationShort = daynightSite.locationShort;

	const socialLinkBase =
		'site-chrome-topbar__social-link inline-grid size-9 place-items-center text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-80 focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sa-surface/70 [&_img]:size-[22px] [&_svg]:size-[22px]';
	const mapLinkProps = {
		href: daynightSite.mapUrl,
		target: '_blank',
		rel: 'noopener'
	} as const;
	const phoneHref = daynightSite.phoneHref;
</script>

<div
	class="site-chrome-topbar relative z-[940] h-11 border-b border-sa-red-strong/70 bg-sa-red text-sa-surface max-[1199px]:hidden"
>
	<div class="mx-auto flex h-full w-full max-w-none items-center justify-between px-6">
		<div class="site-chrome-topbar__contact flex min-w-0 items-center">
			<a
				class="site-chrome-topbar__inventory mr-4 shrink-0 border-r border-sa-surface/25 pr-4 leading-none text-sa-surface no-underline hover:text-sa-surface/90"
				href={i18n.href(resolve('/inventory'))}>{i18n.text(daynightSite.primaryCta)}</a
			>
			<a
				{...mapLinkProps}
				class="site-chrome-topbar__location flex min-w-0 items-center gap-1.5 leading-none text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-4 [&_svg]:fill-current"
				aria-label={i18n.t('pattern.f84866edd710', { v0: i18n.dealer('address') })}
			>
				<SiteChromeIcon name="location" />
				<span class="truncate">{locationShort}</span>
			</a>
			<span class="site-chrome-topbar__dot" aria-hidden="true">·</span>
			<a
				href={i18n.href(phoneHref)}
				class="site-chrome-topbar__phone flex shrink-0 items-center gap-1.5 leading-none text-sa-surface no-underline transition-opacity duration-150 ease-sa hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sa-surface/70 [&_svg]:size-4 [&_svg]:fill-current"
				aria-label={i18n.t('pattern.ab13c281dac3', { v0: daynightSite.phoneLabel })}
			>
				<SiteChromeIcon name="phone" />
				<span>{daynightSite.phoneLabel}</span>
			</a>
		</div>
		<div class="flex shrink-0 items-center gap-2.5">
			{#if daynightSite.socialLinks.facebook || daynightSite.socialLinks.instagram}
				<ul
					class="m-0 flex list-none items-center gap-1.5 p-0"
					aria-label={i18n.t('copy.47c4dea54022')}
				>
					{#if daynightSite.socialLinks.facebook}
						<li><a href={daynightSite.socialLinks.facebook} aria-label={i18n.t('copy.d41f5b4977ee')} target="_blank" rel="noopener" class={socialLinkBase + ' site-chrome-topbar__social-link--facebook'}><SiteChromeIcon name="facebook" /></a></li>
					{/if}
					{#if daynightSite.socialLinks.instagram}
						<li><a href={daynightSite.socialLinks.instagram} aria-label={i18n.t('copy.bad57ef7837c')} target="_blank" rel="noopener" class={socialLinkBase + ' site-chrome-topbar__social-link--instagram'}><SiteChromeIcon name="instagram" /></a></li>
					{/if}
				</ul>
			{/if}
			<LocaleSettingsMenu />
		</div>
	</div>
</div>

<style>
	.site-chrome-topbar__inventory {
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-strong);
		letter-spacing: -0.01em;
	}

	.site-chrome-topbar__location,
	.site-chrome-topbar__phone {
		color: #fff;
		letter-spacing: 0;
	}

	.site-chrome-topbar__location {
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-medium);
		opacity: 1;
	}

	.site-chrome-topbar__phone {
		font-size: var(--sa-text-caption);
		font-variant-numeric: tabular-nums;
		font-weight: var(--sa-weight-strong);
		letter-spacing: 0.02em;
	}

	.site-chrome-topbar__dot {
		color: #fff;
		flex: none;
		font-size: var(--sa-text-base);
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

	@media (min-width: 1200px) {
		.site-chrome-topbar__social-link {
			height: 28px !important;
			width: 28px !important;
		}
		.site-chrome-topbar__social-link :global(img) {
			height: 18px !important;
			width: 18px !important;
		}
	}
</style>
