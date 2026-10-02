<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Mail, Phone } from '@lucide/svelte';
	import { getI18n } from '$lib/locale/context';
	import type { DayNightTeamMember } from '$lib/data/daynight-team';

	const i18n = getI18n();
	let { member }: { member: DayNightTeamMember } = $props();
	const profileHref = $derived(i18n.href(resolve(`/team/${member.slug}`)));
</script>

<article class="desktop-team-card" aria-labelledby={`team-card-${member.slug}`}>
	<a class="desktop-team-card__image" href={profileHref}>
		<img
			src={i18n.asset(resolve(member.image as `/assets/${string}`))}
			alt={i18n.t('pattern.141e9e4edaa0', { v0: i18n.text(member.name) })}
			width="500"
			height="500"
			loading="lazy"
			decoding="async"
		/>
	</a>
	<div class="desktop-team-card__body">
		<h3 id={`team-card-${member.slug}`}>
			<a href={profileHref} title={i18n.text(member.name)}>{i18n.text(member.name)}</a>
		</h3>
		<p class="desktop-team-card__role">{i18n.text(member.role)}</p>
		<div class="desktop-team-card__actions">
			<a class="desktop-team-card__profile" href={profileHref}>
				<span>{i18n.t('copy.a7e7e1b8dd3b')}</span><ArrowRight size={18} aria-hidden="true" />
			</a>
			<a
				class="desktop-team-card__utility"
				href={i18n.href(`tel:${member.phone}`)}
				aria-label={i18n.t('pattern.83d5aea4691e', { v0: i18n.text(member.role) })}
				title={i18n.t('copy.30ebf6dff086')}><Phone size={18} aria-hidden="true" /></a
			>
			{#if member.email}
				<a
					class="desktop-team-card__utility"
					href={i18n.href(`mailto:${member.email}`)}
					aria-label={i18n.t('pattern.38be24678d5c', { v0: i18n.text(member.name) })}
					title={member.email}><Mail size={18} aria-hidden="true" /></a
				>
			{/if}
		</div>
	</div>
</article>

<style>
	.desktop-team-card {
		min-width: 0;
		background: var(--desktop-panel);
		border: 1px solid var(--desktop-control-border);
		border-radius: 12px;
		overflow: hidden;
		transition: border-color 140ms ease;
	}
	.desktop-team-card:is(:hover, :focus-within) {
		border-color: var(--desktop-action);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.desktop-team-card__image {
		display: block;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center top;
	}
	.desktop-team-card__body {
		padding: 16px;
	}
	h3 {
		margin: 0;
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.3 var(--sa-font);
		color: var(--sa-ink);
	}
	h3 a {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	h3 a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.desktop-team-card__role {
		margin: 6px 0 0;
		min-height: calc(var(--sa-text-caption) * 1.45 * 2);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.45 var(--sa-font);
		color: var(--sa-muted);
	}
	.desktop-team-card__actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
	}
	.desktop-team-card__actions a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		padding: 0 12px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-caption)/1.3 var(--sa-font);
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}
	.desktop-team-card__profile {
		flex: 1;
		min-width: 0;
		background: var(--desktop-field);
	}
	.desktop-team-card__actions .desktop-team-card__utility {
		flex: 0 0 44px;
		width: 44px;
		padding: 0;
		background: var(--desktop-panel);
	}
	.desktop-team-card__actions a:hover {
		border-color: var(--sa-yellow);
		background: var(--sa-yellow);
	}
	a:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.desktop-team-card__image:focus-visible {
		outline-offset: -4px;
	}
	@media (prefers-reduced-motion: reduce) {
		.desktop-team-card,
		.desktop-team-card__actions a {
			transition: none;
		}
	}
</style>
