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
		formClass="send-inquiry eliqauto-service-form"
		gridClass="lg-grid-cols-1 mb-22 grid grid-cols-2 gap-x-12 gap-y-24"
		novalidate
		statusMessage="Заявката за услуга е изпратена. Eliqauto ще подготви следващата стъпка."
		submitLabel={form.submitLabel}
	/>
</div>

<style>
	.services-center-form {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--bc-border);
		background: var(--bc-surface);
	}

	.services-center-form :global(input),
	.services-center-form :global(select),
	.services-center-form :global(textarea) {
		border-color: var(--bc-border);
		background: #ffffff;
		box-shadow: none;
	}

	@media (max-width: 767.98px) {
		.services-center-form {
			border-radius: 8px;
			padding: 17px;
		}

		.services-center-form > :global(.h4) {
			margin-bottom: 14px;
			font-size: 22px;
			font-weight: 700;
			line-height: 28px;
		}

		.services-center-form :global(.eliqauto-service-form > div) {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
			margin-bottom: 16px;
		}

		.services-center-form :global(.eliqauto-service-form > div > div) {
			min-width: 0;
		}

		.services-center-form :global(.eliqauto-service-form p) {
			color: var(--bc-muted);
			margin-bottom: 6px;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
		}

		.services-center-form :global(input),
		.services-center-form :global(select) {
			width: 100%;
			height: 48px;
			border-radius: 8px;
			font-size: 16px;
			line-height: 22px;
			padding: 0 13px;
		}

		.services-center-form :global(.eliqauto-service-form button) {
			min-height: 50px;
			border-color: var(--bc-accent-bright-soft);
			border-radius: 8px;
			background: var(--bc-accent-bright-soft);
			color: var(--bc-ink);
		}
	}
</style>
