<script lang="ts">
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form }: { form: AuxeroServiceFormData } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const
		})),
		{
			className: 'select-style-2',
			kind: 'select',
			label: form.serviceLabel,
			name: form.serviceName,
			options: form.serviceOptions
		},
		{
			...form.vehicleField,
			kind: 'input' as const
		}
	]);
</script>

<div class="radius-20 services-center-form bg-white">
	<p class="h4 mb-16">{form.title}</p>
	<InquiryForm
		{fields}
		formClass="send-inquiry daynight-service-form"
		gridClass="lg-grid-cols-1 mb-22 grid grid-cols-2 gap-x-12 gap-y-24"
		novalidate
		statusMessage="Заявката за услуга е подготвена локално за Day Night Auto"
		submitLabel={form.submitLabel}
	/>
</div>

<style>
	.services-center-form {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--bc-border);
		background: var(--bc-surface) !important;
	}

	.services-center-form :global(input),
	.services-center-form :global(select),
	.services-center-form :global(textarea) {
		border-color: var(--bc-border) !important;
		background: #ffffff !important;
		box-shadow: none !important;
	}

	@media (max-width: 767.98px) {
		.services-center-form {
			border-radius: 8px;
			padding: 17px !important;
		}

		.services-center-form > :global(.h4) {
			margin-bottom: 14px !important;
			font-size: 22px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
		}

		.services-center-form :global(.daynight-service-form > div) {
			grid-template-columns: minmax(0, 1fr) !important;
			gap: 12px !important;
			margin-bottom: 16px !important;
		}

		.services-center-form :global(.daynight-service-form > div > div) {
			min-width: 0;
		}

		.services-center-form :global(.daynight-service-form p) {
			color: var(--bc-muted) !important;
			margin-bottom: 6px !important;
			font-size: 14px !important;
			font-weight: 600 !important;
			line-height: 18px !important;
		}

		.services-center-form :global(input),
		.services-center-form :global(select) {
			width: 100%;
			height: 48px !important;
			border-radius: 8px !important;
			font-size: 16px !important;
			line-height: 22px !important;
			padding: 0 13px !important;
		}

		.services-center-form :global(.daynight-service-form button) {
			min-height: 50px;
			border-color: var(--bc-accent-bright-soft) !important;
			border-radius: var(--bc-radius-control) !important;
			background: var(--bc-accent-bright-soft) !important;
			color: var(--bc-ink) !important;
		}
	}
</style>
