<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroPageBanner } from '$lib/auxero/page-banner';
	import { Search } from '@lucide/svelte';
	import './hero-search.css';
	import HeroSearchDialog from './HeroSearchDialog.svelte';

	type PageBannerCta = {
		className?: string;
		href: string;
		label: string;
	};
	type PageBannerCutout = {
		alt?: string;
		mirror?: boolean;
		src: string;
		variant: 'fleet' | 'portrait' | 'service' | 'vehicle';
	};
	type PageBannerSearch = {
		ariaLabel: string;
		onInput: (value: string) => void;
		onSubmit: () => void;
		placeholder: string;
		submitLabel: string;
		value: string;
		quickSearches?: string[];
	};

	let {
		banner,
		compactDesktop = false,
		showDescription = false,
		desktopTitle,
		cta,
		cutout,
		leftCutout,
		search,
		sectionLinks = []
	}: {
		banner: AuxeroPageBanner;
		compactDesktop?: boolean;
		showDescription?: boolean;
		desktopTitle?: string;
		cta?: PageBannerCta;
		cutout?: PageBannerCutout;
		leftCutout?: PageBannerCutout;
		search?: PageBannerSearch;
		sectionLinks?: { href: `#${string}`; label: string }[];
	} = $props();
	const sectionHref = (href: `#${string}`) => ({ href });
</script>

<section
	class={[
		'eliqauto-inventory-banner eliqauto-page-banner',
		compactDesktop && 'eliqauto-page-banner--compact-desktop',
		showDescription && 'eliqauto-page-banner--description',
		(cutout || leftCutout) && 'eliqauto-page-banner--cutout',
		search && 'eliqauto-page-banner--search eliqauto-search-hero'
	]}
	style:--page-banner-image={`url("${banner.image}")`}
>
	<div class="container">
		{#if leftCutout}
			<img
				class={[
					'eliqauto-page-banner__cutout',
					'eliqauto-page-banner__cutout--left',
					`eliqauto-page-banner__cutout--${leftCutout.variant}`,
					leftCutout.mirror && 'eliqauto-page-banner__cutout--mirrored'
				]}
				src={leftCutout.src}
				alt={leftCutout.alt ?? ''}
				width="1536"
				height="1024"
				loading="eager"
				decoding="async"
				aria-hidden={leftCutout.alt ? undefined : 'true'}
			/>
		{/if}
		{#if cutout}
			<img
				class={[
					'eliqauto-page-banner__cutout',
					'eliqauto-page-banner__cutout--right',
					`eliqauto-page-banner__cutout--${cutout.variant}`,
					cutout.mirror && 'eliqauto-page-banner__cutout--mirrored'
				]}
				src={cutout.src}
				alt={cutout.alt ?? ''}
				width="1536"
				height="1024"
				loading="eager"
				decoding="async"
				aria-hidden={cutout.alt ? undefined : 'true'}
			/>
		{/if}
		<div class="eliqauto-inventory-banner__content eliqauto-page-banner__content">
			<h1>
				{#if desktopTitle}
					<span class="eliqauto-page-banner__desktop-title">{desktopTitle}</span>
					<span class="eliqauto-page-banner__original-title">{banner.title}</span>
				{:else}{banner.title}{/if}
			</h1>
			<p>{banner.description}</p>
			{#if !search && banner.actions?.length}
				<div class="eliqauto-page-banner__actions">
					{#each banner.actions as action (action.href)}
						<a
							href={resolve(action.href as '/')}
							class={[
								'btn btn-large font-weight-600',
								action.variant === 'secondary'
									? 'btn-line-style-2 eliqauto-page-banner__secondary'
									: 'btn-primary'
							]}
						>
							{action.label}
						</a>
					{/each}
				</div>
			{:else if !search && cta}
				<div class="eliqauto-page-banner__actions">
					<a
						href={resolve(cta.href as '/')}
						class={cta.className ?? 'btn btn-primary btn-large font-weight-600 max-w-min'}
						>{cta.label}</a
					>
				</div>
			{/if}
			{#if sectionLinks.length}
				<nav class="eliqauto-search-shortcuts" aria-label="Секции на страницата">
					{#each sectionLinks as link (link.href)}
						<a {...sectionHref(link.href)}>{link.label}</a>
					{/each}
				</nav>
			{/if}
		</div>
		{#if search}
			<div class="eliqauto-page-banner__search-group">
				<div class="eliqauto-page-banner__desktop-search">
					<HeroSearchDialog
						title={banner.title}
						description="Търси услуга по име или ключова дума."
						placeholder={search.placeholder}
						value={search.value}
						suggestions={search.quickSearches}
						onSearch={search.onInput}
						onComplete={search.onSubmit}
					>
						{#snippet children(openSearch)}
							<div class="eliqauto-page-banner__search">
								<button
									class="eliqauto-page-banner__search-trigger"
									type="button"
									aria-label={search.ariaLabel}
									aria-haspopup="dialog"
									onclick={(event) => openSearch(event.currentTarget)}
								>
									<Search size={18} strokeWidth={2} aria-hidden="true" />
									<span>{search.value || search.placeholder}</span>
								</button>
								<button
									type="button"
									aria-haspopup="dialog"
									onclick={(event) => openSearch(event.currentTarget)}
									><Search size={18} aria-hidden="true" /><span>{search.submitLabel}</span></button
								>
							</div>
						{/snippet}
					</HeroSearchDialog>
				</div>
				<form
					class="eliqauto-page-banner__search eliqauto-page-banner__inline-search"
					role="search"
					aria-label={search.ariaLabel}
					onsubmit={(event) => {
						event.preventDefault();
						search.onSubmit();
					}}
				>
					<label class="eliqauto-page-banner__search-field">
						<span class="eliqauto-page-banner__search-label">{search.ariaLabel}</span>
						<Search aria-hidden="true" size={21} strokeWidth={2} />
						<input
							type="search"
							value={search.value}
							placeholder={search.placeholder}
							autocomplete="off"
							oninput={(event) => search.onInput(event.currentTarget.value)}
						/>
					</label>
					<button type="submit">
						<Search aria-hidden="true" size={20} strokeWidth={2.2} />
						<span>{search.submitLabel}</span>
					</button>
				</form>
				{#if search.quickSearches?.length}
					<div class="eliqauto-search-shortcuts" role="group" aria-label="Бързо търсене на услуги">
						{#each search.quickSearches as term (term)}
							<button
								type="button"
								aria-pressed={search.value === term}
								onclick={() => search.onInput(search.value === term ? '' : term)}>{term}</button
							>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.eliqauto-page-banner__desktop-title {
		display: none;
	}
	.eliqauto-page-banner h1 span {
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
	}
	.eliqauto-page-banner {
		display: flex;
		min-height: 300px;
		align-items: center;
		background-image:
			linear-gradient(rgb(9 10 10 / 0.62), rgb(9 10 10 / 0.62)), var(--page-banner-image);
		background-position: center;
		background-size: cover;
	}

	.eliqauto-page-banner--cutout {
		min-height: 360px;
		overflow: hidden;
		background: #b5121b;
		background-color: #b5121b;
		background-image: none;
	}

	.eliqauto-page-banner--cutout.eliqauto-page-banner--search {
		min-height: 340px;
	}

	.eliqauto-page-banner > .container {
		display: grid;
		place-items: center;
	}

	.eliqauto-page-banner--cutout > .container {
		position: relative;
		display: grid;
		min-height: 360px;
		place-items: center;
	}

	.eliqauto-page-banner--search > .container {
		min-height: var(--hero-search-height, 340px);
		align-items: start;
		padding-top: var(--hero-search-copy-top, 80px);
		padding-bottom: 24px;
	}

	.eliqauto-page-banner__content {
		width: min(820px, 100%);
		max-width: none;
		padding: 48px 0;
		text-align: center;
	}

	.eliqauto-page-banner--cutout .eliqauto-page-banner__content {
		position: relative;
		z-index: 2;
		width: min(680px, 52%);
		padding: 52px 0 56px;
		text-align: center;
	}

	.eliqauto-page-banner--search .eliqauto-page-banner__content {
		width: min(680px, 54%);
		padding: 0;
	}

	.eliqauto-page-banner__cutout {
		position: absolute;
		bottom: 0;
		z-index: 1;
		display: none;
		max-width: none;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}

	.eliqauto-page-banner__cutout--left {
		left: clamp(-112px, -5vw, -52px);
		object-position: left bottom;
	}

	.eliqauto-page-banner__cutout--right {
		right: clamp(-112px, -5vw, -52px);
		object-position: right bottom;
	}

	.eliqauto-page-banner__cutout--vehicle {
		width: 32%;
		height: 68%;
	}

	.eliqauto-page-banner__cutout--portrait {
		right: clamp(-24px, -1vw, -8px);
		bottom: -16%;
		width: 24%;
		height: 116%;
	}

	.eliqauto-page-banner__cutout--service {
		right: clamp(-82px, -4vw, -38px);
		bottom: -4%;
		width: 37%;
		height: 94%;
	}

	.eliqauto-page-banner__cutout--mirrored {
		transform: scaleX(-1);
	}

	.eliqauto-page-banner h1 {
		margin: 0 0 12px;
		color: #fff;
		font-size: 48px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.eliqauto-page-banner p {
		max-width: 720px;
		margin: 0 auto;
		color: rgb(255 255 255 / 0.82);
		font-size: 17px;
		line-height: 26px;
	}

	.eliqauto-page-banner__actions {
		display: flex;
		justify-content: center;
		margin-top: 22px;
		gap: 12px;
		flex-wrap: wrap;
	}

	.eliqauto-page-banner__search-group {
		position: relative;
		z-index: 5;
		width: min(var(--hero-search-width, 100%), 100%);
		margin-top: auto;
	}
	.eliqauto-page-banner__desktop-search {
		display: none;
	}

	.eliqauto-page-banner__search {
		position: relative;
		z-index: 5;
		display: flex;
		width: 100%;
		min-height: var(--hero-search-control-height, 52px);
		margin-top: auto;
		padding: var(--hero-search-padding, 14px) var(--hero-search-padding, 16px);
		border: 0;
		border-radius: 12px;
		background: #ffffff;
		gap: 8px;
	}

	.eliqauto-page-banner__search-field {
		display: flex;
		min-width: 0;
		flex: 1;
		align-items: center;
		padding: 0 16px;
		border: 1px solid #d9dbe0;
		border-radius: 8px;
		color: #62646a;
		gap: 10px;
	}

	.eliqauto-page-banner__search-field :global(svg) {
		flex: 0 0 auto;
	}

	.eliqauto-page-banner__search-label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.eliqauto-page-banner__search input {
		width: 100%;
		min-width: 0;
		border: 0;
		border-radius: 0;
		outline: 0;
		background: transparent;
		box-shadow: none;
		color: #18181b;
		font: inherit;
		font-size: 16px;
	}

	.eliqauto-page-banner__search input::placeholder {
		color: #777a81;
		opacity: 1;
	}

	.eliqauto-page-banner__search:focus-within {
		outline: 3px solid rgb(255 255 255 / 0.46);
		outline-offset: 3px;
	}

	.eliqauto-page-banner__search button {
		display: inline-flex;
		min-width: 118px;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		border: 1px solid #18181b;
		border-radius: 8px;
		background: #18181b;
		color: #ffffff;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		gap: 8px;
	}

	.eliqauto-page-banner__search button:focus-visible {
		outline: 3px solid #ffffff;
		outline-offset: 2px;
	}

	.eliqauto-page-banner__actions :global(.btn) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	.eliqauto-page-banner__actions :global(.btn::before),
	.eliqauto-page-banner__actions :global(.btn::after) {
		display: none;
		content: none;
		transform: none;
		transition: none;
	}

	.eliqauto-page-banner__actions :global(.btn.btn-primary) {
		border-color: #ffffff;
		background: #ffffff;
		color: #18181b;
	}

	.eliqauto-page-banner__actions :global(.btn.btn-primary:focus-visible) {
		border-color: #f0d7a8;
		background: #f0d7a8;
		color: #5c140f;
	}

	.eliqauto-page-banner__secondary {
		border-color: rgb(255 255 255 / 0.72);
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-page-banner__search button:hover {
			border-color: #303035;
			background: #303035;
		}

		.eliqauto-page-banner__actions :global(.btn.btn-primary:hover) {
			border-color: #f0d7a8;
			background: #f0d7a8;
			color: #5c140f;
		}

		.eliqauto-page-banner__secondary:hover {
			border-color: #ffffff;
			background: #ffffff;
			color: #1c1c1c;
		}
	}

	@media (min-width: 1024px) {
		.eliqauto-page-banner__desktop-search {
			display: block;
		}
		.eliqauto-page-banner__inline-search {
			display: none;
		}
		.eliqauto-page-banner__search button.eliqauto-page-banner__search-trigger {
			flex: 1;
			min-width: 0;
			justify-content: flex-start;
			gap: 10px;
			padding: 0 16px;
			border: 1px solid var(--bc-border);
			background: #fff;
			color: var(--bc-copy);
			font-weight: 400;
			text-align: left;
		}
		.eliqauto-page-banner__search-trigger span {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.eliqauto-page-banner__search-trigger :global(svg) {
			flex: 0 0 auto;
		}
		.eliqauto-page-banner__search button.eliqauto-page-banner__search-trigger:hover {
			border-color: var(--bc-ink);
		}
		.eliqauto-page-banner__search button.eliqauto-page-banner__search-trigger:focus-visible {
			outline: 2px solid var(--bc-ink);
			outline-offset: 2px;
			box-shadow: none;
			background: #fff;
		}
		.eliqauto-page-banner__search:focus-within {
			outline: none;
		}
		.eliqauto-page-banner--search > .container {
			grid-template-rows: 1fr auto;
			row-gap: 32px;
		}

		.eliqauto-page-banner__search-field,
		.eliqauto-page-banner__search button {
			height: var(--hero-search-control-height);
			min-height: var(--hero-search-control-height);
		}

		.eliqauto-page-banner__search-field {
			border-color: var(--bc-border);
		}

		.eliqauto-page-banner__search-field :global(svg) {
			width: 18px;
			height: 18px;
		}

		.eliqauto-page-banner__search input {
			padding: 0;
			line-height: var(--bc-leading-control, 1.32);
		}

		.eliqauto-page-banner__search input::placeholder {
			color: var(--bc-muted);
		}

		.eliqauto-page-banner__search button {
			min-width: 120px;
			background: var(--bc-accent);
			border-color: var(--bc-accent);
		}

		.eliqauto-page-banner__search button:hover {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
		}

		.eliqauto-page-banner__cutout {
			display: block;
		}

		.eliqauto-page-banner--search .eliqauto-page-banner__cutout {
			top: auto;
			bottom: 64px;
			width: var(--hero-search-cutout-width);
			height: 190px;
		}

		.eliqauto-page-banner--search .eliqauto-page-banner__cutout--left {
			left: clamp(0px, 1vw, 16px);
		}

		.eliqauto-page-banner--search .eliqauto-page-banner__cutout--service {
			right: clamp(0px, 1vw, 16px);
			bottom: 64px;
			width: var(--hero-search-cutout-width);
			height: 190px;
		}
	}

	@media (min-width: 1024px) {
		.eliqauto-page-banner.eliqauto-page-banner--compact-desktop {
			--hero-search-height: 300px;
			--hero-search-copy-top: 40px;
			min-height: 300px;
		}
		.eliqauto-page-banner--compact-desktop > .container {
			min-height: 300px;
		}
		.eliqauto-page-banner--compact-desktop.eliqauto-page-banner--search > .container {
			row-gap: 24px;
		}
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__content {
			align-self: end;
		}
		.eliqauto-page-banner--compact-desktop:not(.eliqauto-page-banner--search)
			.eliqauto-page-banner__content {
			align-self: start;
			padding: 80px 0 24px;
		}
		.eliqauto-page-banner--compact-desktop h1 {
			margin: 0;
			font-size: 46px;
			font-weight: var(--bc-weight-semibold);
			letter-spacing: -0.03em;
			line-height: 1.05;
		}
		.eliqauto-page-banner--compact-desktop p,
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__original-title {
			display: none;
		}
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__desktop-title {
			display: inline;
		}
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__actions {
			margin-top: 24px;
		}
		.eliqauto-page-banner--compact-desktop.eliqauto-page-banner--description:not(
				.eliqauto-page-banner--search
			)
			.eliqauto-page-banner__content {
			align-self: center;
			padding: 28px 0;
		}
		.eliqauto-page-banner--compact-desktop.eliqauto-page-banner--description p {
			display: block;
			max-width: 520px;
			margin-top: 12px;
			font-size: 16px;
			line-height: 24px;
			text-wrap: balance;
		}
		.eliqauto-page-banner--compact-desktop.eliqauto-page-banner--description
			.eliqauto-page-banner__actions {
			margin-top: 16px;
		}
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__cutout--left {
			left: clamp(0px, 1vw, 16px);
			bottom: 64px;
			width: 22%;
			height: 190px;
		}
		.eliqauto-page-banner--compact-desktop .eliqauto-page-banner__cutout--fleet {
			bottom: 64px;
			width: 22%;
			height: 190px;
			object-position: center bottom;
		}
		.eliqauto-page-banner__cutout--fleet.eliqauto-page-banner__cutout--right {
			right: clamp(0px, 1vw, 16px);
		}
	}

	@media (max-width: 767px) {
		.eliqauto-page-banner--description,
		.eliqauto-page-banner--description > .container {
			min-height: 240px;
		}

		.eliqauto-page-banner {
			min-height: 220px;
		}

		.eliqauto-page-banner__content {
			padding: 34px 0;
		}

		.eliqauto-page-banner h1 {
			font-size: 32px;
		}

		.eliqauto-page-banner p {
			font-size: 14px;
			line-height: 22px;
		}

		.eliqauto-page-banner--cutout .eliqauto-page-banner__content {
			width: 100%;
			padding: 34px 0;
		}

		.eliqauto-page-banner--search > .container {
			min-height: 360px;
			padding-top: 34px;
			padding-bottom: 24px;
		}

		.eliqauto-page-banner--search .eliqauto-page-banner__content {
			width: 100%;
			padding: 0;
		}

		.eliqauto-page-banner--cutout .eliqauto-page-banner__actions :global(.btn) {
			min-width: 0;
			padding-inline: 16px;
			white-space: nowrap;
		}

		.eliqauto-page-banner__search {
			min-height: 62px;
			margin-top: auto;
			padding: 6px;
			border-radius: 10px;
		}

		.eliqauto-page-banner__search-field {
			padding: 0 10px;
			gap: 8px;
		}

		.eliqauto-page-banner__search input {
			font-size: 16px;
		}

		.eliqauto-page-banner__search button {
			min-width: 48px;
			min-height: 46px;
			padding: 0 13px;
		}

		.eliqauto-page-banner__search button span {
			display: none;
		}
	}
</style>
