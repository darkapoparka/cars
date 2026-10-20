<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { AuxeroAccountListingFormData } from '$lib/auxero/account-listing-form';
	import { assetHref } from '$lib/utils/assets';
	import { localizedValidation } from '$lib/browser/localized-validation';
	import Action from '$lib/components/common/Action.svelte';
	import MobileAccountVehicleFields from './MobileAccountVehicleFields.svelte';
	import { tick, untrack } from 'svelte';

	let { form }: { form: AuxeroAccountListingFormData } = $props();
	const english = $derived(page.data.locale === 'en');
	const submission = $derived(form.submission);
	const images = $derived(
		Array.from(
			new Set(
				[submission?.previewImage, ...(submission?.galleryImages ?? [])].filter(
					(src): src is string => Boolean(src)
				)
			)
		)
	);
	const result = $derived(
		page.form as {
			error?: string;
			saved?: boolean;
			status?: string;
			values?: {
				title: string;
				expectedPrice: string;
				mileage: string;
				vin: string;
				message: string;
			};
		} | null
	);
	const fields = $state(
		untrack(() => ({
			title: result?.values?.title ?? form.submission?.title ?? '',
			expectedPrice: result?.values?.expectedPrice ?? form.submission?.expectedPrice ?? '',
			mileage: result?.values?.mileage ?? form.submission?.mileage ?? '',
			vin: result?.values?.vin ?? form.submission?.vin ?? '',
			message: result?.values?.message ?? form.submission?.message ?? ''
		}))
	);
	let busy = $state(false);
	let vehicleFields = $state<MobileAccountVehicleFields>();
	let saveError = $state('');
	let noticeEl = $state<HTMLParagraphElement | null>(null);
	const save: SubmitFunction = ({ cancel, formElement }) => {
		if (vehicleFields && !vehicleFields.validate()) {
			cancel();
			return;
		}
		if (busy) {
			cancel();
			return;
		}
		busy = true;
		saveError = '';
		return async ({ result, update }) => {
			try {
				if (result.type === 'error') {
					saveError = english
						? 'Could not save. Try again.'
						: 'Неуспешно запазване. Опитай отново.';
					return;
				}
				await update({ reset: false });
				if (result.type === 'success') {
					// Keep edited text, but avoid appending the same selected uploads again
					// when the saved draft is subsequently submitted.
					for (const input of formElement.querySelectorAll<HTMLInputElement>('input[type="file"]'))
						input.value = '';
				}
			} finally {
				busy = false;
				await tick();
				if (noticeEl?.isConnected) noticeEl.scrollIntoView({ block: 'center' });
			}
		};
	};
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	class="mobile-listing-form"
	data-mobile-listing-form
	aria-busy={busy}
	use:enhance={save}
	use:localizedValidation={() => (english ? 'en' : 'bg')}
>
	{#each form.hiddenFields as field (field.name)}
		<input type="hidden" name={field.name} value={field.value} />
	{/each}
	{#if saveError || result?.error}
		<p bind:this={noticeEl} class="mobile-listing-form__status" role="alert">
			{saveError || result?.error}
		</p>
	{:else if result?.saved || (submission && ['draft', 'submitted'].includes(page.url.searchParams.get('created') ?? ''))}
		<p bind:this={noticeEl} class="mobile-listing-form__status" role="status">
			{(result?.status ?? submission?.status) === 'submitted'
				? english
					? 'Saved in the demo for review.'
					: 'Запазено в демото за преглед.'
				: english
					? 'Draft saved.'
					: 'Черновата е запазена.'}
		</p>
	{/if}
	<section class="mobile-listing-form__section" aria-labelledby="mobile-listing-details">
		<h2 id="mobile-listing-details">{english ? 'Car details' : 'Данни за автомобила'}</h2>
		<MobileAccountVehicleFields
			bind:this={vehicleFields}
			bind:title={fields.title}
			locale={english ? 'en' : 'bg'}
			options={form.intakeOptions}
			disabled={busy}
		/>
		<div class="mobile-listing-form__pair">
			<label
				><span>{english ? 'Price (EUR)' : 'Цена (EUR)'}</span><input
					name="expectedPrice"
					bind:value={fields.expectedPrice}
					inputmode="decimal"
				/></label
			>
			<label
				><span>{english ? 'Mileage (km)' : 'Пробег (км)'}</span><input
					name="mileage"
					bind:value={fields.mileage}
					inputmode="numeric"
				/></label
			>
		</div>
		<label
			><span>VIN</span><input
				name="vin"
				bind:value={fields.vin}
				autocomplete="off"
				autocapitalize="characters"
				spellcheck="false"
			/></label
		>
		<label
			><span>{english ? 'Description' : 'Описание'}</span><textarea
				name="description"
				rows="4"
				bind:value={fields.message}
				placeholder={english
					? 'Condition, equipment and service history'
					: 'Състояние, оборудване и сервизна история'}
			></textarea></label
		>
	</section>

	<details class="mobile-listing-form__section">
		<summary
			>{english ? 'Photos' : 'Снимки'}{#if images.length}<span>{images.length}</span>{/if}</summary
		>
		<div class="mobile-listing-form__expanded">
			{#if images.length}<div class="mobile-listing-form__photos">
					{#each images as src, index (src)}<img
							src={assetHref(src)}
							alt={`${english ? 'Car photo' : 'Снимка на автомобила'} ${index + 1}`}
							width="120"
							height="90"
							loading="lazy"
						/>{/each}
				</div>{/if}
			<label
				><span>{english ? 'Cover photo' : 'Основна снимка'}</span><input
					type="file"
					name="previewImage"
					accept="image/jpeg,image/png,image/webp"
				/></label
			>
			<label
				><span>{english ? 'Gallery' : 'Галерия'}</span><input
					type="file"
					name="galleryImages"
					accept="image/jpeg,image/png,image/webp"
					multiple
				/></label
			>
			<p class="mobile-listing-form__hint">JPG, PNG, WebP · {english ? 'up to' : 'до'} 8 MB</p>
		</div>
	</details>
	<details class="mobile-listing-form__section">
		<summary
			>{english ? 'Documents' : 'Документи'}{#if submission?.documents?.length}<span
					>{submission.documents.length}</span
				>{/if}</summary
		>
		<div class="mobile-listing-form__expanded">
			{#if submission?.documents?.length}<ul class="mobile-listing-form__documents">
					{#each submission.documents as document (document.id)}<li>
							<a href={assetHref(document.url)} target="_blank" rel="noopener noreferrer"
								>{document.originalName}</a
							>
						</li>{/each}
				</ul>{/if}
			<label
				><span>{english ? 'Add documents' : 'Добави документи'}</span><input
					type="file"
					name="documents"
					accept=".pdf,.doc,.docx,application/pdf"
					multiple
				/></label
			>
			<p class="mobile-listing-form__hint">PDF, DOC, DOCX · {english ? 'up to' : 'до'} 10 MB</p>
		</div>
	</details>
	<div class="mobile-listing-form__actions">
		<Action
			type="submit"
			name="listingStatus"
			value="draft"
			variant="secondary"
			size="compact"
			disabled={busy}>{english ? 'Save draft' : 'Чернова'}</Action
		>
		<Action type="submit" name="listingStatus" value="submitted" size="compact" disabled={busy}
			>{english ? 'Submit' : 'Изпрати'}</Action
		>
	</div>
</form>

<style>
	.mobile-listing-form {
		--bc-control-height-standard: var(--bc-control-height-chip);
		display: grid;
		gap: var(--bc-space-3);
		padding-bottom: 76px;
		color: var(--bc-ink);
	}
	.mobile-listing-form__section {
		display: grid;
		gap: 12px;
		min-width: 0;
		padding: var(--bc-space-4);
		border: 0;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-bg-strong);
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-mobile-card-title)/1.3 var(--bc-font-heading);
	}
	label {
		display: grid;
		min-width: 0;
		gap: 5px;
		color: var(--bc-muted);
		font: var(--bc-weight-control) var(--bc-mobile-label)/1.35 var(--bc-font-body);
	}
	input,
	textarea {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		padding: 10px 11px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-body) var(--bc-text-control)/var(--bc-leading-control) var(--bc-font-body);
		scroll-margin-block: 24px 180px;
	}
	textarea {
		resize: vertical;
	}
	.mobile-listing-form label input:not([type='file']) {
		height: var(--bc-control-height-standard) !important;
		padding-block: 0;
	}
	input::placeholder,
	textarea::placeholder {
		color: var(--bc-muted);
		opacity: 1;
	}
	.mobile-listing-form label input[type='file'] {
		height: auto !important;
		padding: var(--bc-space-2);
		font-size: var(--bc-mobile-label);
	}
	input::file-selector-button {
		min-height: var(--bc-control-height-standard);
		margin-right: var(--bc-space-2);
		padding: var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-bg-strong);
		color: var(--bc-ink);
		font: inherit;
	}
	.mobile-listing-form__pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		min-height: 44px;
		margin: calc(-1 * var(--bc-space-2));
		padding: var(--bc-space-2);
		cursor: pointer;
		list-style: none;
		font: var(--bc-weight-heading) var(--bc-mobile-body)/1.3 var(--bc-font-body);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '+';
		font-size: 24px;
		font-weight: 400;
	}
	details[open] summary::after {
		content: '−';
	}
	summary span {
		margin-left: auto;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
	}
	.mobile-listing-form__expanded {
		display: grid;
		gap: var(--bc-space-4);
		padding-top: var(--bc-space-4);
	}
	.mobile-listing-form__photos {
		display: flex;
		gap: var(--bc-space-2);
		overflow-x: auto;
	}
	.mobile-listing-form__photos img {
		flex: none;
		width: 120px;
		height: 90px;
		border-radius: var(--bc-radius-md);
		object-fit: cover;
	}
	.mobile-listing-form__documents {
		margin: 0;
		padding-left: var(--bc-space-5);
		overflow-wrap: anywhere;
	}
	.mobile-listing-form__documents a {
		color: var(--bc-ink);
	}
	.mobile-listing-form__hint {
		margin: 0;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
	}
	.mobile-listing-form__status {
		margin: 0;
		padding: var(--bc-space-3);
		border-radius: var(--bc-radius-md);
		background: var(--bc-white);
		font-size: var(--bc-mobile-body);
	}
	.mobile-listing-form__actions {
		position: fixed;
		z-index: 1000;
		right: 0;
		left: 0;
		bottom: var(--bc-mobile-nav-height);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-2);
		padding: var(--bc-space-3) var(--bc-mobile-gutter);
		border-top: 1px solid var(--bc-border);
		background: var(--bc-white);
	}
	.mobile-listing-form__actions :global(.site-action) {
		min-width: 0;
		min-height: 44px;
		padding: var(--bc-space-2);
		font-size: var(--bc-mobile-body);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mobile-listing-form__actions :global(.secondary) {
		border-color: var(--bc-border);
		background: var(--bc-white);
	}
	:is(input, textarea, summary):focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
</style>
