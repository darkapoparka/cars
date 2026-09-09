<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form }: { form: AuxeroContactFormData } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			active: false,
			kind: 'input' as const,
			required: true,
			wrapperClass: 'daynight-contact-form__field'
		})),
		{
			className: 'message daynight-contact-form__textarea',
			id: 'message',
			kind: 'textarea',
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: true,
			rows: 4,
			wrapperClass: 'daynight-contact-form__field daynight-contact-form__field--full'
		}
	]);
</script>

<div class="contact-page-form">
	<div class="contact-page-form__header">
		<h2>{form.title}</h2>
		<p>{form.subtitle}</p>
	</div>

	<InquiryForm
		{fields}
		buttonClass="btn btn-primary daynight-contact-form__submit"
		formClass="daynight-contact-form"
		gridClass="daynight-contact-form__grid"
		idPrefix="desktop-contact"
		showEmptyStatus={false}
		statusClass="daynight-contact-form__status"
		statusMessage="Съобщението е подготвено локално за Promosale Varna"
		submitLabel={form.submitLabel}
	/>
</div>

<style>
	.contact-page-form {
		width: 100%;
		min-width: 0;
		height: fit-content;
		border: 1px solid var(--bc-border);
		border-radius: 18px;
		background: #ffffff !important;
		padding: 40px;
		align-self: start;
	}

	.contact-page-form__header {
		margin-bottom: 28px;
	}

	.contact-page-form__header h2 {
		margin-top: 0;
		margin-bottom: 8px;
		color: var(--bc-text);
		font-size: 28px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.contact-page-form__header p {
		max-width: 680px;
		margin: 0;
		color: var(--bc-text-muted);
		font-size: 15px;
		line-height: 22px;
	}

	.contact-page-form :global(.daynight-contact-form__grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		column-gap: 24px;
		row-gap: 20px;
		margin-bottom: 24px;
	}

	.contact-page-form :global(.daynight-contact-form__field) {
		min-width: 0;
	}

	.contact-page-form :global(.daynight-contact-form__field--full) {
		grid-column: 1 / -1;
	}

	.contact-page-form :global(input),
	.contact-page-form :global(textarea) {
		width: 100%;
		border: 1px solid #d7d9dd !important;
		background: #ffffff !important;
		box-shadow: none !important;
		color: var(--bc-text) !important;
		font-size: 15px !important;
		line-height: 22px !important;
		transition:
			border-color 0.14s ease,
			box-shadow 0.14s ease;
	}

	.contact-page-form :global(input) {
		height: 48px;
		border-radius: 10px;
		padding: 11px 14px;
	}

	.contact-page-form :global(textarea) {
		height: 128px !important;
		min-height: 128px;
		border-radius: 10px;
		padding: 12px 14px;
		resize: vertical;
	}

	.contact-page-form :global(.daynight-contact-form p) {
		margin: 0 0 8px !important;
		color: var(--bc-text) !important;
		font-size: 14px !important;
		font-weight: 600 !important;
		line-height: 18px !important;
	}

	.contact-page-form :global(.daynight-contact-form__submit) {
		display: inline-flex;
		width: 240px;
		height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 10px;
		background: #b9161c !important;
		color: #ffffff !important;
		font-size: 15px;
		font-weight: 650;
		line-height: 20px;
	}

	@media (hover: hover) and (pointer: fine) {
		.contact-page-form :global(.daynight-contact-form__submit:hover) {
			background: #970f14 !important;
			color: #ffffff !important;
		}
	}

	.contact-page-form :global(input:focus-visible),
	.contact-page-form :global(textarea:focus-visible) {
		border-color: #b9161c !important;
		background: #ffffff !important;
		box-shadow: 0 0 0 3px rgb(185 22 28 / 0.13) !important;
		outline: none !important;
	}

	.contact-page-form :global(.daynight-contact-form__status) {
		margin: 14px 0 0 !important;
		color: #167342 !important;
		font-size: 14px !important;
		font-weight: 600 !important;
		line-height: 20px !important;
	}

	@media (max-width: 767px) {
		.contact-page-form {
			border-radius: 12px;
			padding: 24px;
		}

		.contact-page-form__header {
			margin-bottom: 22px;
		}

		.contact-page-form__header h2 {
			font-size: 24px;
			line-height: 30px;
		}

		.contact-page-form__header p {
			font-size: 14px !important;
			line-height: 22px !important;
		}

		.contact-page-form :global(.daynight-contact-form__grid) {
			grid-template-columns: minmax(0, 1fr) !important;
			gap: 16px !important;
			margin-bottom: 20px;
		}

		.contact-page-form :global(.daynight-contact-form__field--full) {
			grid-column: auto !important;
		}

		.contact-page-form :global(input),
		.contact-page-form :global(textarea) {
			width: 100%;
			font-size: 16px !important;
			line-height: 22px !important;
		}

		.contact-page-form :global(input) {
			height: 48px;
			border-radius: 8px;
		}

		.contact-page-form :global(textarea) {
			min-height: 112px;
			border-radius: 8px;
		}

		.contact-page-form :global(.daynight-contact-form__submit) {
			min-height: 50px;
			border-radius: 8px;
		}
	}
</style>
