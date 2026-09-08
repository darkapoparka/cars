<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	// Clean Svelte 5 + Tailwind v4 rebuild of the two promo cards under the hero:
	//   • Import card  — green (#a51717 = bc-accent), dark ink, large car cutout
	//     anchored bottom-right (object-contain), dark CTA pill that flips to white.
	//   • Consultation card — dark-green brand panel (#181414, no exact bc token),
	//     white text, consultant photo top-right, bright-soft CTA pill (bc-accent-
	//     Eliq red accent) that flips to white.
	// Flat card language: 8px radius (rounded-bc-md), no shadow, no hover transform.
	// Data is built from `copy.actionBand`; rendered through a keyed {#each}.
	let { copy }: { copy: HomePageCopy } = $props();

	type ActionCard = {
		key: 'import' | 'consultation';
		href: '/services' | '/contact';
		title: string;
		body: string;
		cta: string;
		image: string;
		imageAlt: string;
		imageWidth: number;
		imageHeight: number;
	};

	const cards = $derived<ActionCard[]>([
		{
			key: 'import',
			href: '/services',
			title: copy.actionBand.importTitle,
			body: copy.actionBand.importBody,
			cta: copy.actionBand.importCta,
			image: '/assets/eliqauto/home2/home2-action-import.webp',
			imageAlt: '',
			imageWidth: 560,
			imageHeight: 360
		},
		{
			key: 'consultation',
			href: '/contact',
			title: copy.actionBand.buyTitle,
			body: copy.actionBand.buyBody,
			cta: copy.actionBand.buyCta,
			image: '/assets/eliqauto/home2/home2-action-consultant.webp',
			imageAlt: '',
			imageWidth: 560,
			imageHeight: 360
		}
	]);
</script>

<section class="bg-bc-bg pt-[38px] pb-[30px] font-bc-body" aria-label={copy.actionBand.importTitle}>
	<div class="bc-container">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{#each cards as card (card.key)}
				<a
					href={resolve(card.href)}
					class={[
						'group relative isolate flex min-h-[188px] flex-col justify-center overflow-hidden rounded-bc-md p-[30px_22px] transition-colors sm:p-[30px_34px]',
						card.key === 'import'
							? 'bg-bc-accent text-bc-accent-contrast'
							: // dark neutral companion panel
								'bg-[#181414] text-white'
					]}
				>
					<span
						class={[
							'relative z-[2] flex flex-col gap-2.5',
							card.key === 'import' ? 'max-w-[58%]' : 'w-[min(68%,440px)]'
						]}
					>
						<strong class="text-[clamp(24px,2vw,32px)] leading-[1.08] font-semibold">
							{card.title}
						</strong>
						<span
							class={[
								'text-[15px] leading-[1.45] font-medium opacity-[0.82]',
								card.key === 'import' ? 'sm:max-w-[min(52%,320px)]' : ''
							]}
						>
							{card.body}
						</span>
						<span
							class={[
								'mt-3 inline-flex h-11 w-[168px] items-center justify-center gap-2 rounded-bc-pill px-[18px] text-sm leading-none font-semibold whitespace-nowrap transition-colors',
								card.key === 'import'
									? 'bg-white text-bc-accent group-hover:bg-bc-surface-soft group-focus-visible:bg-bc-surface-soft'
									: 'bg-bc-accent-bright-soft text-bc-accent group-hover:bg-white group-focus-visible:bg-white'
							]}
						>
							{card.cta}
							<ArrowRight class="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} aria-hidden="true" />
						</span>
					</span>

					<img
						class={[
							'pointer-events-none absolute z-[1] h-auto max-w-none object-contain',
							card.key === 'import'
								? '-right-[70px] -bottom-[44px] w-[540px]'
								: '-top-1 -right-2 w-[188px]'
						]}
						src={card.image}
						alt={card.imageAlt}
						width={card.imageWidth}
						height={card.imageHeight}
						loading="lazy"
						decoding="async"
					/>
				</a>
			{/each}
		</div>
	</div>
</section>
