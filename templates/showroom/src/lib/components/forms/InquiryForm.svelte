<script lang="ts">
	import type { InquiryFormField, InquiryInputField } from './types';

	type Props = {
		buttonClass?: string;
		fields: InquiryFormField[];
		formClass: string;
		gridClass: string;
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
		novalidate = false,
		showEmptyStatus = true,
		statusClass = 'auxero-form-status text-highlight font-weight-600 mt-12',
		statusMessage = 'Заявката е получена. Eliqauto ще се свърже с вас скоро.',
		submitLabel
	}: Props = $props();

	let status = $state('');
	let isSubmitting = $state(false);
	let statusTone = $state<'error' | 'success' | ''>('');

	const inputClass = (field: InquiryInputField) => `${field.active ? 'active ' : ''}input-large`;

	const inputModeFor = (field: InquiryInputField) => {
		if (field.type === 'tel') return 'tel' as const;
		if (field.type === 'number') return 'numeric' as const;
		if (field.type === 'email') return 'email' as const;
		return undefined;
	};

	const fieldValue = (formData: FormData, name: string) => {
		const value = formData.get(name);
		return typeof value === 'string' ? value.trim() : '';
	};

	const hasAnyValue = (formData: FormData, names: string[]) =>
		names.some((name) => Boolean(fieldValue(formData, name)));

	const friendlyError = (message: unknown) => {
		if (message === 'Contact name is required') return 'Моля въведете име.';
		if (message === 'Phone or email is required') return 'Моля въведете телефон или имейл.';
		if (message === 'Email address is invalid') return 'Моля въведете валиден имейл.';
		return 'Не успяхме да изпратим заявката. Моля опитайте отново или се обадете.';
	};

	const fieldSummary = (formData: FormData) =>
		fields
			.map((field) => {
				const value = fieldValue(formData, field.name);
				return value ? `${field.label}: ${value}` : '';
			})
			.filter(Boolean)
			.join(' | ');

	const prepareInquiryPayload = (formData: FormData) => {
		if (!hasAnyValue(formData, ['name', 'SendInquiryname', 'Firstname', 'first_name'])) {
			const inferredName =
				fieldValue(formData, 'Firstname') ||
				fieldValue(formData, 'phone') ||
				fieldValue(formData, 'SendInquiryphone') ||
				fieldValue(formData, 'vin') ||
				'Заявка от сайта';

			formData.set('name', inferredName);
		}

		if (!fieldValue(formData, 'message') && !fieldValue(formData, 'message2')) {
			const summary = fieldSummary(formData);
			if (summary) formData.set('message', summary);
		}

		if (!fieldValue(formData, 'source')) formData.set('source', formClass);
		if (!fieldValue(formData, 'routePath')) formData.set('routePath', window.location.pathname);

		return formData;
	};

	async function submitInquiry(event: SubmitEvent) {
		event.preventDefault();
		if (isSubmitting) return;

		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;

		isSubmitting = true;
		statusTone = '';
		status = 'Изпращаме заявката...';

		try {
			const response = await fetch('/api/inquiries', {
				body: prepareInquiryPayload(new FormData(form)),
				method: 'POST'
			});
			const result: unknown = await response.json().catch(() => undefined);

			if (!response.ok) {
				const message =
					result && typeof result === 'object' && 'message' in result ? result.message : undefined;
				throw new Error(friendlyError(message));
			}

			statusTone = 'success';
			status = statusMessage;
			form.reset();
		} catch (error) {
			statusTone = 'error';
			status = error instanceof Error ? error.message : friendlyError(undefined);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form action="#" class={formClass} {novalidate} onsubmit={submitInquiry}>
	<div class={gridClass}>
		{#each fields as field (`${field.kind}-${field.name}-${field.id ?? field.label}`)}
			<div class={field.wrapperClass}>
				<label class="mb-8" for={field.id ?? field.name}>{field.label}</label>

				{#if field.kind === 'input'}
					<input
						aria-label={field.label}
						class={inputClass(field)}
						id={field.id ?? field.name}
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
						id={field.id ?? field.name}
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
						id={field.id ?? field.name}
						name={field.name}
						placeholder={field.placeholder}
						required={field.required}
						rows={field.rows ?? 3}
					></textarea>
				{/if}
			</div>
		{/each}
	</div>

	<button type="submit" class={buttonClass} disabled={isSubmitting}>
		{isSubmitting ? 'Изпращане...' : submitLabel}
	</button>

	{#if showEmptyStatus || status}
		<p class={statusClass} data-status={statusTone} aria-live="polite">{status}</p>
	{/if}
</form>
