<script lang="ts">
	import { FileText, ImagePlus, Save, Send } from '@lucide/svelte';
	import type {
		AuxeroAccountListingFormData,
		AuxeroListingFormDropdownField
	} from '$lib/auxero/account-listing-form';

	let { form }: { form: AuxeroAccountListingFormData } = $props();

	const isSubmissionForm = $derived(
		form.hiddenFields.some(
			(field) => field.name === 'routePath' && field.value.startsWith('account/listings')
		)
	);
	const primaryListingStatus = $derived(isSubmissionForm ? 'submitted' : 'published');
	const primaryActionLabel = $derived(isSubmissionForm ? 'Submit for Review' : 'Publish Listing');

	const selectedDropdownValue = (field: AuxeroListingFormDropdownField) =>
		field.options.find((option) => option.checked)?.value ?? '';
</script>

<form
	action=""
	method="POST"
	enctype="multipart/form-data"
	class="eliqauto-add-listing-form dash-form"
	novalidate
	data-eliqauto-admin-listing-mode={form.mode}
	data-eliqauto-listing-context={isSubmissionForm ? 'submission' : 'inventory'}
	data-eliqauto-add-listing-form
>
	{#each form.hiddenFields as field (field.name)}
		<input type="hidden" name={field.name} value={field.value} />
	{/each}
	<!-- listingStatus is carried by the submit buttons' name/value (below), so the posted
	     value is the actual button clicked — no async $state flush race on submit. -->

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Gallery</h2>
				<p class="dash-card__subtitle">Primary listing media and gallery images.</p>
			</div>
			<ImagePlus
				class="text-[var(--dash-primary)]"
				size={22}
				strokeWidth={2.1}
				aria-hidden="true"
			/>
		</div>
		<div class="dash-card__body dash-upload">
			<div class="dash-upload__preview dash-upload__preview--wide">
				<img src={form.previewImage.src} alt={form.previewImage.alt} />
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<label class="dash-secondary-button cursor-pointer" for="carPreviewInput"
					>Choose preview</label
				>
				<input
					type="file"
					id="carPreviewInput"
					name="previewImage"
					accept="image/jpeg,image/png,image/jpg,image/webp"
					class="hidden"
				/>
				<span class="text-sm font-bold text-[var(--dash-muted)]">Upload JPG or PNG</span>
			</div>

			<div class="dash-gallery">
				{#each form.galleryImages as image (image.src)}
					<div class="dash-gallery__item">
						<img src={image.src} alt={image.alt} />
					</div>
				{/each}
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<label class="dash-secondary-button cursor-pointer" for="carGalleryInput"
					>Choose gallery</label
				>
				<input
					type="file"
					id="carGalleryInput"
					name="galleryImages"
					accept="image/jpeg,image/png,image/jpg,image/webp"
					multiple
					class="hidden"
				/>
				<span class="text-sm font-bold text-[var(--dash-muted)]">Multiple JPG or PNG files</span>
			</div>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Vehicle details</h2>
				<p class="dash-card__subtitle">Core information shown across inventory and detail pages.</p>
			</div>
		</div>
		<div class="dash-card__body">
			<div class="dash-form-grid dash-form-grid--4">
				{#each form.detailFields as field (field.id)}
					{#if field.type === 'input'}
						<label class="dash-field" for={field.id}>
							<span class="dash-label">{field.label}*</span>
							<input
								class="dash-input"
								type="text"
								id={field.id}
								name={field.name}
								placeholder={field.placeholder}
								value={field.value}
								required={field.required}
							/>
						</label>
					{:else if field.type === 'textarea'}
						<label class="dash-field md:col-span-2" for={field.id}>
							<span class="dash-label">{field.label}*</span>
							<textarea
								placeholder={field.placeholder}
								rows={field.rows}
								name={field.name}
								class="dash-textarea"
								id={field.id}
								required={field.required}>{field.value}</textarea
							>
						</label>
					{:else}
						<label class="dash-field" for={field.id}>
							<span class="dash-label">{field.label}*</span>
							<select
								class="dash-select"
								id={field.id}
								name={field.name}
								value={selectedDropdownValue(field)}
							>
								<option value="">Select</option>
								{#each field.options as option (field.id + option.value + option.label)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Features</h2>
				<p class="dash-card__subtitle">Equipment, comfort, safety, and listing highlights.</p>
			</div>
		</div>
		<div class="dash-card__body grid gap-5 lg:grid-cols-3">
			{#each form.featureGroups as group (group.title)}
				<div>
					<p class="m-0 mb-3 text-sm font-black text-[var(--dash-heading)]">{group.title}</p>
					<div class="dash-checkbox-grid">
						{#each group.features as feature (feature.id)}
							<label class="dash-check" for={feature.id}>
								<input
									type="checkbox"
									id={feature.id}
									name="features"
									value={feature.label}
									checked={feature.checked}
								/>
								<span>{feature.label}</span>
							</label>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Pricing and location</h2>
				<p class="dash-card__subtitle">Commercial details and dealership location.</p>
			</div>
		</div>
		<div class="dash-card__body dash-form-grid dash-form-grid--2">
			<label class="dash-field" for="PriceListing2">
				<span class="dash-label">Price (EUR)*</span>
				<input
					class="dash-input"
					type="text"
					id="PriceListing2"
					name="PriceListing"
					placeholder={form.priceLabel}
					value={form.priceLabel}
					required
				/>
			</label>
			<label class="dash-field" for="ListingAddress">
				<span class="dash-label">Full address*</span>
				<input
					class="dash-input"
					type="text"
					id="ListingAddress"
					name="ListingAddress"
					placeholder={form.address}
					value={form.address}
					required
				/>
			</label>
			<label class="dash-field" for="SelectLocation">
				<span class="dash-label">Map location*</span>
				<select class="dash-select" id="SelectLocation" name="location">
					<option value="">Select</option>
					{#each form.locationOptions as option (option.value + option.label)}
						<option value={option.value} selected={option.checked}>{option.label}</option>
					{/each}
				</select>
			</label>
			<label class="dash-field" for="Yoururl">
				<span class="dash-label">Video URL*</span>
				<input
					class="dash-input"
					type="text"
					id="Yoururl"
					name="Yoururl"
					placeholder={form.sourceUrl}
					value={form.sourceUrl}
					required
				/>
			</label>
			<div class="dash-field md:col-span-2">
				<span class="dash-label">Map preview</span>
				<div class="dash-map">
					<iframe
						src={form.mapEmbedUrl}
						height="281"
						style="border:0;width: 100%;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Eliqauto listing location"
					></iframe>
				</div>
			</div>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Attachments</h2>
				<p class="dash-card__subtitle">Documents shown to staff during listing review.</p>
			</div>
			<FileText class="text-[var(--dash-primary)]" size={22} strokeWidth={2.1} aria-hidden="true" />
		</div>
		<div class="dash-card__body grid gap-4">
			<div class="dash-attachments">
				{#each form.attachments as attachment (attachment.type)}
					<div class="dash-attachment">
						<img class="h-7 w-7 object-contain" src={attachment.icon} alt="" />
						<div class="min-w-0">
							<p class="m-0 truncate text-sm font-black text-[var(--dash-heading)]">
								{attachment.label}
							</p>
							<p class="m-0 text-xs font-bold text-[var(--dash-muted)]">{attachment.type}</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<label class="dash-secondary-button cursor-pointer" for="attachmentsInput"
					>Choose documents</label
				>
				<input
					type="file"
					id="attachmentsInput"
					name="documents"
					accept=".pdf,.doc,.docx,application/pdf"
					multiple
					class="hidden"
				/>
				<span class="text-sm font-bold text-[var(--dash-muted)]">Upload PDF, DOC, or DOCX</span>
			</div>
		</div>
	</section>

	<div class="flex flex-wrap justify-end gap-3">
		<button type="submit" name="listingStatus" value="draft" class="dash-secondary-button">
			<Save size={17} strokeWidth={2.1} aria-hidden="true" />
			Save Draft
		</button>
		<button
			type="submit"
			name="listingStatus"
			value={primaryListingStatus}
			class="dash-primary-button"
		>
			<Send size={17} strokeWidth={2.1} aria-hidden="true" />
			{primaryActionLabel}
		</button>
	</div>
</form>
