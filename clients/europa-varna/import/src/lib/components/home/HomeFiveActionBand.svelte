<script lang="ts">
	import { linkHref as resolve } from '$lib/utils/links';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import CommerceBanner from '$lib/components/common/CommerceBanner.svelte';
	import { site } from '$lib/config/site';
	let {
		copy,
		variant = 'guidance'
	}: { copy: HomePageCopy; variant?: 'guidance' | 'ownership' | 'selection' | 'consultation' } =
		$props();
	const ownership = $derived(variant === 'ownership');
	const english = $derived(copy.actionBand.importTitle === 'Import From Europe');
	const href = (path: string) => resolve(path + (english ? '?lang=en' : ''));
	const firstTitle = $derived(
		ownership
			? english
				? 'Sell your car'
				: 'Продай колата си'
			: english
				? 'Import from Europe'
				: 'Подбрани автомобили'
	);
	const secondTitle = $derived(
		ownership
			? english
				? 'Finance your next car'
				: 'Автомобил на лизинг'
			: english
				? 'Meet our team'
				: 'Запази консултация'
	);
</script>

<section
	class="daynight-action-band"
	class:daynight-action-band--ownership={ownership}
	class:daynight-action-band--mobile={variant === 'selection' || variant === 'consultation'}
	aria-label={ownership
		? english
			? 'Sell and finance'
			: 'Продажба и лизинг'
		: english
			? 'Our services'
			: 'Нашите услуги'}
>
	<div
		class="site-container daynight-action-grid"
		class:daynight-action-grid--single={variant === 'selection' || variant === 'consultation'}
	>
		{#if variant !== 'consultation'}
			<CommerceBanner
				logo={ownership ? site.identity.logoOnDark : undefined}
				title={firstTitle}
				body={ownership
					? english
						? 'Send us your car details for a valuation.'
						: 'Изпрати данни за автомобила за оценка.'
					: copy.actionBand.importBody}
				action={ownership
					? english
						? 'Request a valuation'
						: 'Заяви оценка'
					: copy.actionBand.importCta}
				href={href(ownership ? '/sell-your-car' : '/services')}
				image={ownership
					? '/assets/daynight/services/sell-commerce'
					: '/assets/daynight/banners/commerce-collection'}
			/>
		{/if}
		{#if variant !== 'selection'}
			<CommerceBanner
				logo={ownership ? site.identity.logoOnDark : undefined}
				title={secondTitle}
				body={ownership
					? english
						? 'Estimate a monthly payment for your next car.'
						: 'Изчисли ориентировъчна месечна вноска.'
					: copy.actionBand.buyBody}
				action={ownership
					? english
						? 'Calculate payment'
						: 'Изчисли вноска'
					: copy.actionBand.buyCta}
				href={href(ownership ? '/financing' : '/contact')}
				image={ownership
					? '/assets/daynight/banners/commerce-finance'
					: '/assets/daynight/banners/commerce-visit'}
			/>
		{/if}
	</div>
</section>

<style>
	.daynight-action-band {
		padding: 38px 0 30px;
		background: var(--bc-bg);
	}
	.daynight-action-band--mobile {
		display: none;
	}
	@media (min-width: 768px) {
		.daynight-action-band {
			padding-block: var(--bc-space-8);
		}
	}
	.daynight-action-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.daynight-action-grid--single {
		grid-template-columns: minmax(0, 1fr);
	}
	@media (min-width: 768px) and (max-width: 1179px) {
		.daynight-action-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 767px) {
		.daynight-action-band {
			padding: 0;
		}
		.daynight-action-band--mobile {
			display: block;
		}
		.daynight-action-band--ownership {
			display: none;
		}
		.daynight-action-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
		}
	}
</style>
