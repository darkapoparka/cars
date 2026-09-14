<script lang="ts">
	import type { AuxeroSellCarFormData } from '$lib/auxero/sell-your-car';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form }: { form: AuxeroSellCarFormData } = $props();

	const fields: InquiryFormField[] = $derived(
		form.fields.map((field) => ({
			...field,
			kind: 'input' as const
		}))
	);
</script>

<InquiryForm
	{fields}
	formClass="calculate-form daynight-sell-form"
	gridClass="mb-28 grid grid-cols-1 gap-15"
	novalidate
	showEmptyStatus={false}
	endpoint="/api/inventory/submissions"
	statusMessage="Демо заявката е запазена временно. Не е изпратено съобщение до търговец."
	submitLabel={form.submitLabel}
/>
