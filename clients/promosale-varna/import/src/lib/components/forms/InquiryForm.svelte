<script lang="ts">
	import type { InquiryFormField, InquiryInputField } from './types';
	import { resolve } from '$app/paths';
	import { templateInquiryCopy } from '$lib/data/template-settings';

	type Props = {
		buttonClass?: string;
		fields: InquiryFormField[];
		formClass: string;
		gridClass: string;
		idPrefix?: string;
		novalidate?: boolean;
		showEmptyStatus?: boolean;
		statusClass?: string;
		statusMessage?: string;
		endpoint?: '/api/inquiries' | '/api/inventory/submissions';
		submitLabel: string;
	};

	let {
		buttonClass = 'btn btn-primary btn-large font-weight-600 w-full',
		fields,
		formClass,
		gridClass,
		idPrefix = '',
		novalidate = false,
		showEmptyStatus = true,
		statusClass = 'auxero-form-status text-highlight font-weight-600 mt-12',
		statusMessage = templateInquiryCopy.success,
		endpoint = '/api/inquiries',
		submitLabel
	}: Props = $props();

	let status = $state('');
	let submitting = $state(false);

	const inputClass = (field: InquiryInputField) => `${field.active ? 'active ' : ''}input-large`;
	const fieldId = (id: string | undefined) => (id && idPrefix ? `${idPrefix}-${id}` : id);

	const inputModeFor = (field: InquiryInputField) => {
		if (field.type === 'tel') return 'tel' as const;
		if (field.type === 'number') return 'numeric' as const;
		if (field.type === 'email') return 'email' as const;
		return undefined;
	};

	async function submitInquiry(event: SubmitEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (submitting) return;
		const form = event.currentTarget as HTMLFormElement;
		submitting = true;
		status = '';
		try {
			const response = await fetch(resolve(endpoint), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					...Object.fromEntries(new FormData(form)),
					source: formClass.includes('service')
						? 'service-request'
						: formClass.includes('sell')
							? 'sell-your-car'
							: 'contact',
					routePath: window.location.pathname
				})
			});
			const result = await response.json();
			if (!response.ok || !result.ok || !(result.data?.inquiry?.id || result.data?.submission?.id))
				throw new Error('Not saved');
			status = statusMessage;
		} catch {
			status = 'Заявката не е запазена. Провери данните и опитай отново.';
		} finally {
			submitting = false;
		}
	}
</script>

<form action="#" class={formClass} data-managed-inquiry {novalidate} onsubmit={submitInquiry}>
	<div class={gridClass}>
		{#each fields as field (`${field.kind}-${field.name}-${field.id ?? field.label}`)}
			<div class={field.wrapperClass}>
				<p class="mb-8">{field.label}</p>

				{#if field.kind === 'input'}
					<input
						aria-label={field.label}
						class={inputClass(field)}
						id={fieldId(field.id)}
						name={field.name}
						placeholder={field.placeholder}
						required={field.required}
						type={field.type}
						inputmode={inputModeFor(field)}
						value={field.value ?? ''}
					/>
				{:else if field.kind === 'select'}
					<select
						aria-label={field.label}
						class={field.className}
						id={fieldId(field.id)}
						name={field.name}
						required={field.required}
					>
						{#each field.options as option (option)}
							<option>{option}</option>
						{/each}
					</select>
				{:else}
					<textarea
						aria-label={field.label}
						class={field.className}
						id={fieldId(field.id)}
						name={field.name}
						placeholder={field.placeholder}
						required={field.required}
						rows={field.rows ?? 3}
					></textarea>
				{/if}
			</div>
		{/each}
	</div>

	<p>{templateInquiryCopy.notice}</p>
	<button type="submit" class={buttonClass} disabled={submitting}>
		{submitLabel}
	</button>

	{#if showEmptyStatus || status}
		<p class={statusClass} aria-live="polite">{status}</p>
	{/if}
</form>
