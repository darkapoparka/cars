<script lang="ts">
	import { ChevronRight, PhoneCall } from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileLeadImageBanner from './MobileLeadImageBanner.svelte';

	let {
		phoneHref,
		title = 'Искаш помощ?',
		copy = 'Говори директно с екипа ни.',
		image
	}: { phoneHref: string; title?: string; copy?: string; image?: string } = $props();
</script>

{#if image}
	<aside aria-label={`Контакт с ${daynightSite.shortName}`}>
		<MobileLeadImageBanner {title} {image} action="Обади се" href={phoneHref} />
	</aside>
{:else}
	<aside class="lead-contact" aria-label={`Контакт с ${daynightSite.shortName}`}>
		<span class="lead-contact__icon" aria-hidden="true">
			<PhoneCall size={19} strokeWidth={2.2} />
		</span>
		<span class="lead-contact__copy">
			<strong>{title}</strong>
			<small>{copy}</small>
		</span>
		<a href={phoneHref}>Обади се <ChevronRight size={15} strokeWidth={2.5} /></a>
	</aside>
{/if}

<style>
	.lead-contact {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		min-height: 64px;
		border: 1px solid var(--sa-line);
		border-radius: 14px;
		background: #f7f8fa;
		padding: 12px 10px;
	}

	.lead-contact__icon {
		display: grid;
		width: 32px;
		height: 32px;
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-red);
	}

	.lead-contact__copy {
		display: grid;
		gap: 2px;
		min-width: 0;
	}
	.lead-contact strong {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-leading-snug);
	}
	.lead-contact small {
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-body);
		line-height: var(--sa-mobile-leading-body);
	}
	.lead-contact a {
		display: inline-flex;
		grid-column: 2;
		justify-self: start;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0 11px;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.lead-contact a:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	@media (max-width: 359px) {
		.lead-contact {
			grid-template-columns: minmax(0, 1fr);
		}
		.lead-contact a {
			grid-column: 1;
		}
		.lead-contact__icon {
			display: none;
		}
	}
</style>
