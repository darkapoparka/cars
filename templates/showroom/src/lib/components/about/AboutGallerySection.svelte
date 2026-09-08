<script lang="ts">
	import { asset } from '$app/paths';
	import {
		ChevronLeft,
		ChevronRight,
		Coffee,
		Gamepad2,
		Images,
		Utensils,
		Wifi,
		X
	} from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { eliqAboutAmenities, eliqAboutGallery as photos } from '$lib/data/eliqauto-about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';
	const icons = { food: Utensils, coffee: Coffee, game: Gamepad2, wifi: Wifi };
	let open = $state(false);
	let selected = $state(0);
	let failed = $state(false);
	let trigger: HTMLElement;
	let closeButton: HTMLButtonElement;
	let touchX = 0;
	let touchY = 0;
	const current = $derived(photos[selected]);
	function select(index: number) {
		selected = (index + photos.length) % photos.length;
		failed = false;
	}
	function show(index: number, source: HTMLElement) {
		trigger = source;
		select(index);
		open = true;
	}
	function keydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			select(selected + (event.key === 'ArrowRight' ? 1 : -1));
		}
	}
</script>

<section class="about-gallery" aria-label="Галерия и клиентска зона">
	<div class="container">
		<AboutSectionHeader
			heading="Разгледайте нашия шоурум"
			description="Автомобилите, изложбената зала и клиентската зона в Пазарджик."
		/>
		<div class="gallery-preview">
			{#each photos.slice(0, 5) as photo, index (photo.id)}
				<button
					class="gallery-preview__photo"
					type="button"
					onclick={(event) => show(index, event.currentTarget)}
					aria-label={`Отвори снимка ${index + 1}: ${photo.caption}`}
				>
					<img src={photo.thumbnail} alt={photo.caption} width="640" height="480" loading="lazy" />
				</button>
			{/each}
			<button
				class="gallery-preview__open"
				type="button"
				aria-label="Отвори галерията"
				onclick={(event) => show(0, event.currentTarget)}
				><Images size={18} aria-hidden="true" />Всички {photos.length} снимки</button
			>
		</div>
		<div class="about-amenities">
			{#each eliqAboutAmenities as amenity (amenity.title)}
				{@const Icon = icons[amenity.icon]}
				<div class="about-amenity">
					<Icon size={24} strokeWidth={1.7} aria-hidden="true" />
					<div>
						<h3>{amenity.title}</h3>
						<p>{amenity.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<Dialog.Root bind:open>
	<Dialog.Content
		class="eliq-about-gallery-dialog"
		overlayClass="eliq-about-gallery-overlay"
		showCloseButton={false}
		onkeydown={keydown}
		onOpenAutoFocus={(event) => {
			event.preventDefault();
			closeButton?.focus();
		}}
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			trigger?.focus({ preventScroll: true });
		}}
	>
		<div class="gallery-dialog__heading">
			<div>
				<Dialog.Title class="eliq-about-gallery-title">Галерия на ELIQ AUTO</Dialog.Title
				><Dialog.Description class="eliq-about-gallery-description"
					>{photos.length} снимки от шоурума в Пазарджик</Dialog.Description
				>
			</div>
			<button
				bind:this={closeButton}
				type="button"
				class="gallery-dialog__close"
				aria-label="Затвори галерията"
				onclick={() => (open = false)}><X size={24} aria-hidden="true" /></button
			>
		</div>
		<div
			class="gallery-dialog__stage"
			role="presentation"
			ontouchstart={(event) => {
				touchX = event.touches[0].clientX;
				touchY = event.touches[0].clientY;
			}}
			ontouchend={(event) => {
				const dx = event.changedTouches[0].clientX - touchX;
				const dy = event.changedTouches[0].clientY - touchY;
				if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) select(selected + (dx < 0 ? 1 : -1));
			}}
		>
			{#if failed}<p class="gallery-dialog__error" role="status">
					Снимката не се зареди. <a href={asset(current.src)} target="_blank" rel="noreferrer"
						>Отвори снимката отделно</a
					>
				</p>{:else}<img
					class="gallery-dialog__image"
					src={current.src}
					alt={current.caption}
					width="1280"
					height="960"
					onerror={() => (failed = true)}
				/>{/if}
			<button
				type="button"
				class="gallery-dialog__previous"
				aria-label="Предишна снимка"
				onclick={() => select(selected - 1)}><ChevronLeft size={26} aria-hidden="true" /></button
			>
			<button
				type="button"
				class="gallery-dialog__next"
				aria-label="Следваща снимка"
				onclick={() => select(selected + 1)}><ChevronRight size={26} aria-hidden="true" /></button
			>
		</div>
		<p class="gallery-dialog__caption" aria-live="polite" aria-atomic="true">
			{current.caption}<span>{selected + 1} / {photos.length}</span>
		</p>
		<div class="gallery-dialog__thumbnails" aria-label="Избери снимка">
			{#each photos as photo, index (photo.id)}<button
					type="button"
					aria-label={`Снимка ${index + 1}: ${photo.caption}`}
					aria-current={selected === index ? 'true' : undefined}
					onclick={() => select(index)}
					><img src={photo.thumbnail} alt="" width="80" height="60" loading="lazy" /></button
				>{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.about-gallery {
		padding-block: 48px 32px;
	}
	.gallery-preview {
		position: relative;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 12px;
		aspect-ratio: 3 / 1;
	}
	.gallery-preview__photo {
		position: relative;
		min-width: 0;
		min-height: 0;
		padding: 0;
		border: 0;
		border-radius: 10px;
		overflow: hidden;
		background: #f5f5f6;
		cursor: pointer;
	}
	.gallery-preview__photo:first-child {
		grid-row: span 2;
	}
	.gallery-preview__photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.gallery-preview__open {
		position: absolute;
		bottom: 12px;
		right: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		background: #fff;
		color: #18181b;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		min-height: 44px;
		border: 1px solid #e4e4e7;
		cursor: pointer;
	}
	.gallery-preview__open:hover {
		background: #f5f5f6;
	}
	.about-amenities {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 16px;
	}
	.about-amenity {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 20px;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		background: #f5f5f6;
	}
	.about-amenity > :global(svg) {
		flex-shrink: 0;
		color: var(--bc-accent);
		margin-top: 2px;
	}
	.about-amenity h3 {
		font-size: 16px;
		line-height: 1.4;
		font-weight: 600;
		margin: 0 0 6px;
	}
	.about-amenity p {
		font-size: 14px;
		line-height: 1.6;
		color: #62626b;
		margin: 0;
	}
	.about-gallery button:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}
	:global(.eliq-about-gallery-overlay) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		background: rgb(0 0 0 / 0.8);
		backdrop-filter: none;
		animation: none;
	}
	:global(.eliq-about-gallery-dialog) {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		translate: none;
		margin: 0;
		z-index: 1201;
		width: min(1120px, calc(100vw - 32px));
		max-width: none;
		max-height: calc(100dvh - 32px);
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 20px;
		background: #18181b;
		color: #fff;
		border-radius: 12px;
		border: 1px solid #3f3f46;
		overflow-y: auto;
		box-shadow: none;
		animation: none;
		font-family: var(--bc-font-body);
	}
	.gallery-dialog__heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 16px;
	}
	:global(.eliq-about-gallery-title) {
		margin: 0;
		font-size: 20px;
		font-weight: 600;
		color: #fff;
	}
	:global(.eliq-about-gallery-description) {
		margin: 4px 0 0;
		font-size: 14px;
		color: #d4d4d8;
	}
	.gallery-dialog__close,
	.gallery-dialog__previous,
	.gallery-dialog__next {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		padding: 0;
		border: 1px solid #52525b;
		border-radius: 8px;
		background: #18181b;
		color: #fff;
		cursor: pointer;
	}
	.gallery-dialog__stage {
		position: relative;
		display: grid;
		place-items: center;
		height: min(58dvh, 640px);
		min-height: 150px;
		flex-shrink: 0;
		background: #09090b;
		border-radius: 8px;
		overflow: hidden;
	}
	.gallery-dialog__image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		min-height: 0;
	}
	.gallery-dialog__previous,
	.gallery-dialog__next {
		position: absolute;
		top: calc(50% - 22px);
	}
	.gallery-dialog__previous {
		left: 12px;
	}
	.gallery-dialog__next {
		right: 12px;
	}
	.gallery-dialog__caption {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 14px;
		line-height: 1.5;
		color: #fff;
		margin: 14px 0;
	}
	.gallery-dialog__caption span {
		white-space: nowrap;
		color: #d4d4d8;
	}
	.gallery-dialog__thumbnails {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding: 3px 3px 10px;
	}
	.gallery-dialog__thumbnails button {
		flex: 0 0 72px;
		padding: 2px;
		border: 2px solid transparent;
		background: none;
		border-radius: 6px;
		cursor: pointer;
	}
	.gallery-dialog__thumbnails button[aria-current='true'] {
		border-color: #fff;
	}
	.gallery-dialog__thumbnails img {
		display: block;
		width: 100%;
		height: 48px;
		object-fit: cover;
		border-radius: 3px;
	}
	.gallery-dialog__error {
		max-width: 65%;
		padding: 16px;
		color: #fff;
	}
	.gallery-dialog__error a {
		color: #fff;
		text-decoration: underline;
	}
	:global(.eliq-about-gallery-dialog) button:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}
	@media (max-width: 1023px) {
		.about-amenities {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767px) {
		.about-gallery {
			padding-block: 28px;
		}
		.gallery-preview {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: 190px 105px;
			aspect-ratio: auto;
			gap: 8px;
		}
		.gallery-preview__photo:first-child {
			grid-column: span 2;
			grid-row: auto;
		}
		.gallery-preview__photo:nth-child(n + 4) {
			display: none;
		}
		.about-amenities {
			gap: 8px;
			margin-top: 12px;
		}
		.about-amenity {
			flex-direction: column;
			gap: 8px;
			padding: 16px;
		}
		:global(.eliq-about-gallery-dialog) {
			width: calc(100vw - 16px);
			max-height: calc(100dvh - 16px);
			padding: 12px;
		}
		:global(.eliq-about-gallery-title) {
			font-size: 18px;
		}
		.gallery-dialog__stage {
			height: min(52dvh, 460px);
		}
		.gallery-dialog__previous {
			left: 6px;
		}
		.gallery-dialog__next {
			right: 6px;
		}
	}
</style>
