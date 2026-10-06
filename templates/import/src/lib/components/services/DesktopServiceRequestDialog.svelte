<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { serviceRequestCopy } from '$lib/content/service-requests';
	import {
		serviceRequestKinds,
		serviceRequestSchema,
		type ServiceRequestKind
	} from '$lib/domain/service-request';
	import { receiptMessage, type InquiryReceipt } from '$lib/domain/inquiry';
	import { submitIntake } from '$lib/browser/submit-intake';
	import { linkHref } from '$lib/utils/links';

	let {
		open = $bindable(false),
		kind,
		entry,
		onCloseAutoFocus
	}: {
		open?: boolean;
		kind: ServiceRequestKind;
		entry?: { kind: ServiceRequestKind; reference: string; sequence: number };
		onCloseAutoFocus: (event: Event) => void;
	} = $props();
	const id = $props.id();
	const copy = $derived(serviceRequestCopy[page.data.locale === 'en' ? 'en' : 'bg']);
	const detail = $derived(copy.fields[kind]);
	type Field = 'name' | 'phone' | 'reference' | 'message' | 'preferredDate';
	type FormState = {
		values: Record<Field, string>;
		errors: Partial<Record<Field, string>>;
		pending: boolean;
		failed: boolean;
		receipt: InquiryReceipt | null;
	};
	function empty(): FormState {
		return {
			values: { name: '', phone: '', reference: '', message: '', preferredDate: '' },
			errors: {},
			pending: false,
			failed: false,
			receipt: null
		};
	}
	let forms = $state<Record<ServiceRequestKind, FormState>>(
		Object.fromEntries(serviceRequestKinds.map((service) => [service, empty()])) as Record<
			ServiceRequestKind,
			FormState
		>
	);
	const current = $derived(forms[kind]);
	let formElement = $state<HTMLFormElement>();
	let appliedEntry = 0;
	$effect(() => {
		if (!entry || entry.sequence === appliedEntry) return;
		appliedEntry = entry.sequence;
		const form = forms[entry.kind];
		form.values.reference = entry.reference;
		form.errors = {};
		form.failed = false;
		form.receipt = null;
	});

	function focusFirstField(event: Event) {
		const input = formElement?.querySelector<HTMLElement>(
			entry?.kind === kind && current.values.reference ? '[name="name"]' : 'input, textarea'
		);
		if (input) {
			event.preventDefault();
			input.focus({ preventScroll: true });
		}
	}
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const submittedKind = kind;
		const form = forms[submittedKind];
		if (form.pending) return;
		form.errors = {};
		form.failed = false;
		const result = serviceRequestSchema.safeParse({
			kind,
			...form.values,
			routePath: page.url.pathname
		});
		if (!result.success) {
			for (const issue of result.error.issues) {
				const field = issue.path[0] as Field;
				if (field in copy.errors)
					form.errors[field] =
						kind === 'viewing' && field === 'reference'
							? copy.viewingReferenceError
							: copy.errors[field];
			}
			await tick();
			formElement?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			return;
		}
		form.pending = true;
		try {
			form.receipt = await submitIntake('/api/inquiries', {
				source: 'service-request',
				...result.data
			});
		} catch {
			form.failed = true;
		} finally {
			form.pending = false;
		}
	}
</script>

<Modal
	bind:open
	title={detail.title}
	description={detail.description}
	class="desktop-service-request"
	onOpenAutoFocus={focusFirstField}
	{onCloseAutoFocus}
>
	{#if current.receipt}
		<div class="service-request-receipt" role="status">
			<p>{receiptMessage(current.receipt, page.data.locale === 'en')}</p>
		</div>
	{:else}
		<form
			{id}
			class="site-form service-request-form"
			bind:this={formElement}
			onsubmit={submit}
			aria-busy={current.pending}
			novalidate
		>
			<div class="site-fields">
				{#if kind === 'registration'}
					<label class="site-field site-field--wide" for={id + '-message'}>
						<span>{detail.label} *</span>
						<textarea
							id={id + '-message'}
							name="message"
							rows="3"
							required
							minlength="5"
							maxlength="2000"
							placeholder={detail.placeholder}
							bind:value={current.values.message}
							aria-invalid={Boolean(current.errors.message)}
							aria-describedby={current.errors.message ? id + '-message-error' : undefined}
						></textarea>
						{#if current.errors.message}<small class="site-form-error" id={id + '-message-error'}
								>{current.errors.message}</small
							>{/if}
					</label>
				{:else}
					<label class="site-field site-field--wide" for={id + '-reference'}>
						<span>{detail.label} *</span>
						<input
							id={id + '-reference'}
							name="reference"
							required
							maxlength="2000"
							placeholder={detail.placeholder}
							bind:value={current.values.reference}
							aria-invalid={Boolean(current.errors.reference)}
							aria-describedby={current.errors.reference ? id + '-reference-error' : undefined}
						/>
						{#if current.errors.reference}<small
								class="site-form-error"
								id={id + '-reference-error'}>{current.errors.reference}</small
							>{/if}
					</label>
				{/if}
				{#if kind === 'viewing'}
					<label class="site-field site-field--wide" for={id + '-date'}>
						<span>{copy.preferredDate}</span>
						<input
							id={id + '-date'}
							name="preferredDate"
							type="datetime-local"
							bind:value={current.values.preferredDate}
							aria-invalid={Boolean(current.errors.preferredDate)}
							aria-describedby={id + '-date-note'}
						/>
						<small class="site-form-note" id={id + '-date-note'}
							>{current.errors.preferredDate ?? copy.viewingNote}</small
						>
					</label>
				{/if}
				<label class="site-field" for={id + '-name'}>
					<span>{copy.name} *</span>
					<input
						id={id + '-name'}
						name="name"
						autocomplete="name"
						required
						minlength="2"
						maxlength="160"
						bind:value={current.values.name}
						aria-invalid={Boolean(current.errors.name)}
						aria-describedby={current.errors.name ? id + '-name-error' : undefined}
					/>
					{#if current.errors.name}<small class="site-form-error" id={id + '-name-error'}
							>{current.errors.name}</small
						>{/if}
				</label>
				<label class="site-field" for={id + '-phone'}>
					<span>{copy.phone} *</span>
					<input
						id={id + '-phone'}
						name="phone"
						type="tel"
						inputmode="tel"
						autocomplete="tel"
						required
						minlength="5"
						maxlength="60"
						bind:value={current.values.phone}
						aria-invalid={Boolean(current.errors.phone)}
						aria-describedby={current.errors.phone ? id + '-phone-error' : undefined}
					/>
					{#if current.errors.phone}<small class="site-form-error" id={id + '-phone-error'}
							>{current.errors.phone}</small
						>{/if}
				</label>
			</div>
			{#if current.failed}<p class="site-form-error" role="alert">{copy.error}</p>{/if}
			<p class="site-form-note">
				{page.data.preview !== false ? copy.demoNote : copy.liveNote}
				<a href={linkHref('/privacy')}>{copy.privacy}</a>
			</p>
		</form>
	{/if}
	{#snippet footer()}
		<div class="service-request-actions">
			{#if current.receipt}
				<Action variant="strong" size="primary" onclick={() => (open = false)}>{copy.done}</Action>
			{:else}
				<Action type="submit" form={id} variant="strong" size="primary" disabled={current.pending}
					>{current.pending ? copy.pending : detail.submit}</Action
				>
			{/if}
		</div>
	{/snippet}
</Modal>

<style>
	.service-request-form {
		--bc-form-gap: var(--bc-space-5);
	}
	.service-request-form .site-field :is(input, textarea) {
		background: var(--bc-control);
	}
	.service-request-form .site-field :is(input, textarea):hover {
		background: var(--bc-control-hover);
	}
	.service-request-form .site-field [aria-invalid='true'] {
		outline: 2px solid var(--bc-danger);
		outline-offset: 2px;
	}
	.service-request-actions {
		display: flex;
		justify-content: flex-end;
	}
	.service-request-form .site-form-note a {
		color: var(--bc-copy);
		text-underline-offset: 3px;
	}
	.service-request-form .site-form-note a:hover {
		color: var(--bc-ink);
	}
	.service-request-receipt p {
		margin: 0;
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
</style>
