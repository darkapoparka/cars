<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	type LogoRole = 'header' | 'sticky';
	type LogoTone = 'dark' | 'light';

	let {
		tone = 'dark',
		role = 'header',
		containerClass,
		linkClass = '',
		imageClass = '',
		alt = daynightSite.shortName
	}: {
		tone?: LogoTone;
		role?: LogoRole;
		containerClass?: 'logo' | 'logo-mobile';
		linkClass?: string;
		imageClass?: string;
		alt?: string;
	} = $props();

	const logoSrcset = $derived(
		desktopOnlySrcset(tone === 'light' ? daynightSite.logoLight : daynightSite.logoDark, 570)
	);
	const logoSizes = desktopOnlySizes('210px');
	const containerClasses = $derived([
		containerClass === 'logo' && 'w-[212px] flex-[0_0_212px]',
		containerClass === 'logo-mobile' && 'hidden w-[198px] flex-[0_0_198px]'
	]);
	const logoLinkClasses = $derived([
		'block no-underline',
		role === 'sticky'
			? 'hidden w-[178px] group-[.is-fixed.is-custom]:absolute group-[.is-fixed.is-custom]:left-[75px] group-[.is-fixed.is-custom]:top-1/2 group-[.is-fixed.is-custom]:block group-[.is-fixed.is-custom]:-translate-y-1/2'
			: 'w-[212px]',
		linkClass
	]);
	const logoImageClasses = $derived([
		'block h-auto max-w-none object-contain',
		role === 'sticky' ? 'w-[178px]' : 'w-[212px]',
		imageClass
	]);
</script>

{#snippet logoLink()}
	<a
		href={resolve('/')}
		class={logoLinkClasses}
		aria-label={daynightSite.shortName}
		data-logo-role={role}
	>
		<img
			class={logoImageClasses}
			src={desktopOnlyImagePlaceholder}
			srcset={logoSrcset}
			sizes={logoSizes}
			{alt}
			data-logo-role={role}
		/>
	</a>
{/snippet}

{#if containerClass}
	<div class={containerClasses}>
		{@render logoLink()}
	</div>
{:else}
	{@render logoLink()}
{/if}
