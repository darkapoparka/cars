<script lang="ts">
	// Native 1:1 rebuild of the localized /team (sale-agents.html) desktop content:
	// breadcrumb + title + the consultant card grid (photo with social overlay +
	// name/role/contact row). Self-contained scoped styles reproduce the effective
	// app.css + daynight-template-head.css + StorefrontTemplateContent :global blend,
	// measured via getComputedStyle at 1440px on the prod build. Brand blue routes
	// through --sa-blue; template neutrals stay literal. Runes-only, no :global except
	// the lucide breadcrumb chevron sizing.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import { daynightTeam, type DayNightTeamMember } from '$lib/data/daynight-team';

	type AssetHref = `/assets/${string}`;

	const teamMembers = daynightTeam.slice(0, 4);

	function asset(path: AssetHref): AssetHref {
		return path;
	}

	function teamHref(slug: string): `/team/${string}` {
		return `/team/${slug}`;
	}
</script>

{#snippet phoneIcon(size: number)}
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet mailIcon(size: number)}
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M3.75 7.5L10.94 12.2933C11.5667 12.7111 12.4333 12.7111 13.06 12.2933L20.25 7.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 5.25H19.5C20.3284 5.25 21 5.92157 21 6.75V17.25C21 18.0784 20.3284 18.75 19.5 18.75H4.5C3.67157 18.75 3 18.0784 3 17.25V6.75C3 5.92157 3.67157 5.25 4.5 5.25Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet profileIcon()}
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M12 12.75C14.0711 12.75 15.75 11.0711 15.75 9C15.75 6.92893 14.0711 5.25 12 5.25C9.92893 5.25 8.25 6.92893 8.25 9C8.25 11.0711 9.92893 12.75 12 12.75Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 20.25C5.37804 17.2645 8.23025 15 12 15C15.7698 15 18.622 17.2645 19.5 20.25"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet teamHoverActions(member: DayNightTeamMember)}
	<ul class="sale-agent-social flex gap-8">
		<li>
			<a href={`tel:${member.phone}`} title="Обади се за оглед" aria-label="Обади се за оглед">
				{@render phoneIcon(20)}
			</a>
		</li>
		{#if member.email}
			<li>
				<a
					href={`mailto:${member.email}`}
					title={`Имейл към ${member.name}`}
					aria-label={`Имейл към ${member.name}`}
				>
					{@render mailIcon(20)}
				</a>
			</li>
		{/if}
		<li>
			<a href={resolve(teamHref(member.slug))} title="Виж профила" aria-label="Виж профила">
				{@render profileIcon()}
			</a>
		</li>
	</ul>
{/snippet}

{#snippet teamContactActions(member: DayNightTeamMember)}
	<ul class="contact">
		<li>
			<a href={`tel:${member.phone}`} title="Обади се за оглед" aria-label="Обади се за оглед">
				{@render phoneIcon(24)}
			</a>
		</li>
		{#if member.email}
			<li>
				<a
					href={`mailto:${member.email}`}
					title="Имейл към Аутолайф"
					aria-label="Имейл към Аутолайф"
				>
					{@render mailIcon(24)}
				</a>
				</li>
		{/if}
	</ul>
{/snippet}

{#snippet teamCard(member: DayNightTeamMember)}
	<div class="sale-agent-box">
		<div class="card-top mb-20">
			<a
				class="flex w-full"
				href={resolve(teamHref(member.slug))}
				aria-label={`Виж профила на ${member.name}`}
			>
				<img class="w-full" src={asset(member.image as AssetHref)} alt={member.name} />
			</a>
			{@render teamHoverActions(member)}
		</div>
		<div class="card-bottom flex items-center justify-between gap-16">
			<div class="content">
				<a class="h5 font-weight-600 sale-agent-title" href={resolve(teamHref(member.slug))}>
					{member.name}
				</a>
				<p class="text-secondary text-sm">{member.role}</p>
			</div>
			{@render teamContactActions(member)}
		</div>
	</div>
{/snippet}

<div class="team-page">
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li>
					<a href={resolve('/')}>Начало</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<a href={resolve('/')}>Още</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Екипът на Аутолайф</span>
				</li>
			</ul>
		</div>
	</section>

	<section class="pb-100">
		<div class="container">
			<h1>Екипът на Аутолайф</h1>
		</div>
		<div class="tf-spacing-style3"></div>

		<div class="container mb-40">
			<div class="sm-grid-cols-1 lg-grid-cols-2 xl-gap-16 grid grid-cols-4 gap-30">
				{#each teamMembers as member (member.slug)}
					{@render teamCard(member)}
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.team-page,
	.team-page * {
		box-sizing: border-box;
	}

	/* Reproduce app.css's universal `* { margin: 0 }` reset (the legacy rhythm depends
	   on it; without it default heading/list margins drift the layout). */
	.team-page * {
		margin: 0;
	}

	.team-page {
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
	}

	.team-page a {
		color: inherit;
		text-decoration: none;
	}

	.team-page img,
	.team-page svg {
		display: block;
		max-width: 100%;
	}

	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	/* Section title (verified #111827, clamp 32-48 -> 46.08 at 1440, weight 700). */
	.team-page h1 {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		line-height: 1.08;
	}

	/* Utilities */
	.flex {
		display: flex;
	}

	.grid {
		display: grid;
	}

	.grid-cols-4 {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.gap-30 {
		gap: 30px;
	}

	.gap-16 {
		gap: 16px;
	}

	.gap-8 {
		gap: 8px;
	}

	.w-full {
		width: 100%;
	}

	.items-center {
		align-items: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.mb-20 {
		margin-bottom: 20px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.font-weight-600 {
		font-weight: 600;
	}

	.text-secondary {
		color: #667085;
	}

	.text-sm {
		font-size: 16px;
		line-height: 1.45;
	}

	.h5 {
		font-size: 20px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	.background-light {
		background: #f5f7fb;
	}

	.pb-100 {
		padding-bottom: 100px;
	}

	.tf-spacing-style3 {
		height: 34px;
	}

	/* Breadcrumb (verified: min-height 76, gap 10, ul 14/700 #5f6877, a #1c1c1c 14/400,
	   icon 14px). The /assets/right.svg chevrons become @lucide ChevronRight. */
	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		margin: 0;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
		list-style: none;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
		color: #5f6877;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
	}

	/* Team grid: verified 4 cols of 300px, gap 30 at 1440. */
	.sm-grid-cols-1.lg-grid-cols-2.gap-30.grid.grid-cols-4 {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 30px;
	}

	/* Consultant card (same family as /about; verified border #e4e8ef, radius 12,
	   soft shadow; photo card-top radius 16 mb 20 aspect 1.05). */
	.sale-agent-box {
		overflow: hidden;
		border: 1px solid #e4e8ef;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
	}

	.sale-agent-box .card-top {
		position: relative;
		display: flex;
		justify-content: center;
		overflow: hidden;
		border-radius: 16px;
	}

	.sale-agent-box .card-top img {
		width: 100%;
		aspect-ratio: 1.05;
		object-fit: cover;
	}

	/* Social overlay icons — VISIBLE on /team (verified), dark translucent pills over
	   the photo bottom-right. */
	.sale-agent-social {
		position: absolute;
		right: 14px;
		bottom: 14px;
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sale-agent-social a {
		display: inline-grid;
		min-width: 44px;
		min-height: 44px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.42);
		border-radius: 999px;
		background: rgba(17, 24, 39, 0.34);
		color: #fff;
		box-shadow: 0 14px 28px rgba(15, 23, 42, 0.2);
	}

	/* Card bottom row: name/role left, contact icons right (verified flex, gap 16,
	   space-between, padding 20). */
	.sale-agent-box .card-bottom {
		padding: 20px;
	}

	.sale-agent-title {
		display: inline-block;
		margin-bottom: 4px;
		color: #1c1c1c;
	}

	.contact {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.contact a {
		display: inline-grid;
		min-width: 44px;
		min-height: 44px;
		place-items: center;
		border: 1px solid #e7e7e7;
		border-radius: 50%;
		background: #fff;
		color: #111827;
	}

	/* This desktop component renders narrow on phones (no MobileTeamPage). */
	@media (max-width: 1199.98px) {
		.sm-grid-cols-1.lg-grid-cols-2.gap-30.grid.grid-cols-4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.sm-grid-cols-1.lg-grid-cols-2.gap-30.grid.grid-cols-4 {
			grid-template-columns: 1fr;
		}
	}
</style>
