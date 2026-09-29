<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { mobileImageSrc } from '$lib/data/mobile-media';
	import MobileActionCardContent from '$lib/components/shared/mobile/MobileActionCardContent.svelte';
	import { resolve } from '$app/paths';

	type PromoKind = 'sell' | 'import' | 'all';
	let { kind = 'all' }: { kind?: PromoKind } = $props();

	const promos = [
		{
			kind: 'sell',
			title: i18n.t('copy.1fdf9944227c'),
			cta: i18n.t('copy.d915896778d0'),
			href: '/sell-your-car' as const,
			tone: 'dark',
			image:
				'/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/bmw-x5-dark-grey-left-hero-1400.webp'
		},
		{
			kind: 'import',
			title: i18n.t('copy.f78f182894b4'),
			cta: i18n.t('copy.ee4d0f651884'),
			href: '/contact?intent=import' as const,
			tone: 'red',
			image:
				'/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/audi-q5-silver-left-hero-1200.webp'
		}
	] as const;

	const visiblePromos = $derived(
		kind === 'all' ? promos : promos.filter((promo) => promo.kind === kind)
	);
	const sectionLabel = $derived(
		kind === 'sell'
			? 'Продай или замени автомобил'
			: kind === 'import'
				? 'Внос от Европа'
				: 'Продажба и внос'
	);
</script>

<section class="mobile-home-promos" aria-label={i18n.text(sectionLabel)}>
	{#each visiblePromos as promo (promo.href)}
		<a class="mobile-home-promo" href={i18n.href(resolve(promo.href))}>
			<MobileActionCardContent
				title={promo.title}
				image={mobileImageSrc(resolve(promo.image))}
				action={promo.cta}
				tone={promo.tone}
				artwork="cutout"
			/>
		</a>
	{/each}
</section>

<style>
	.mobile-home-promos {
		display: grid;
		gap: 10px;
		padding: 0 var(--sa-mobile-gutter);
	}
	.mobile-home-promo {
		display: block;
		border-radius: 14px;
		color: inherit;
		text-decoration: none;
	}
	.mobile-home-promo:active {
		opacity: 0.9;
	}
	.mobile-home-promo:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 3px;
	}
	@media (max-width: 370px) {
		.mobile-home-promos {
			padding-inline: 12px;
		}
	}
</style>
