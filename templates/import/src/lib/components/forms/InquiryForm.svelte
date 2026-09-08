<script lang="ts">
	import type { InquiryFormField, InquiryInputField } from './types';

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
		statusMessage = 'Заявката е получена. Day Night Auto ще се свърже с вас скоро.',
		submitLabel
	}: Props = $props();

	let status = $state('');

	const inputClass = (field: InquiryInputField) => `${field.active ? 'active ' : ''}input-large`;
	const fieldId = (id: string | undefined) => (id && idPrefix ? `${idPrefix}-${id}` : id);

	const inputModeFor = (field: InquiryInputField) => {
		if (field.type === 'tel') return 'tel' as const;
		if (field.type === 'number') return 'numeric' as const;
		if (field.type === 'email') return 'email' as const;
		return undefined;
	};

	function submitInquiry(event: SubmitEvent) {
		event.preventDefault();
		status = statusMessage;
	}
</script>

<form action="#" class={formClass} {novalidate} onsubmit={submitInquiry}>
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

	<button type="submit" class={buttonClass}>
		{submitLabel}
	</button>

	{#if showEmptyStatus || status}
		<p class={statusClass} aria-live="polite">{status}</p>
	{/if}
</form>
