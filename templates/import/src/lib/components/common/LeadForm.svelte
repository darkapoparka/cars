<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/state';
	import { onDestroy, tick } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { InquiryReceipt } from '$lib/domain/inquiry';
	import { receiptMessage } from '$lib/domain/inquiry';
	import { linkHref } from '$lib/utils/links';
	import Action from './Action.svelte';
	type FormResult = {
		receipt?: InquiryReceipt;
		errors?: Record<string, unknown>;
		values?: Record<string, string | undefined>;
	};
	let {
		english = false,
		source = 'contact',
		vehicleSlug,
		result = null,
		mobile = false,
		formId,
		submitInFooter = false,
		pending = $bindable(false),
		completed = $bindable(false)
	}: {
		english?: boolean;
		source?: string;
		vehicleSlug?: string;
		result?: FormResult | null;
		mobile?: boolean;
		formId?: string;
		submitInFooter?: boolean;
		pending?: boolean;
		completed?: boolean;
	} = $props();
	const id = $props.id();
	let localResult = $state<FormResult | null>(null);
	let formElement = $state<HTMLFormElement>();
	let destroyed = false;
	onDestroy(() => {
		destroyed = true;
	});
	const current = $derived(localResult ?? result);
	const submit: SubmitFunction = ({ cancel }) => {
		if (pending) {
			cancel();
			return;
		}
		pending = true;
		return async ({ result }) => {
			if (destroyed) return;
			pending = false;
			if (result.type === 'success' || result.type === 'failure') {
				localResult = result.data as FormResult;
				completed = Boolean(localResult.receipt);
				if (localResult.errors) {
					await tick();
					formElement?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
				}
			} else await applyAction(result);
		};
	};
</script>

{#if current?.receipt}
	<div role="status" class="site-stack">
		<p>{receiptMessage(current.receipt, english)}</p>
		<Action
			type="button"
			variant="secondary"
			onclick={() => {
				localResult = {};
				completed = false;
				formElement?.reset();
			}}>{english ? 'New request' : 'Нова заявка'}</Action
		>
	</div>
{:else}
	<form
		id={formId}
		class="site-form"
		class:site-form--mobile={mobile}
		method="POST"
		action={linkHref('/contact' + (source === 'trade-in' ? '?topic=trade-in' : ''))}
		use:enhance={submit}
		bind:this={formElement}
		aria-busy={pending}
	>
		<input type="hidden" name="source" value={source} /><input
			type="hidden"
			name="routePath"
			value={page.url.pathname}
		/>{#if vehicleSlug}<input type="hidden" name="vehicleSlug" value={vehicleSlug} />{/if}
		<div class="site-fields">
			<label class="site-field" for={id + '-name'}
				><span>{english ? 'Name' : 'Име'} *</span><input
					id={id + '-name'}
					name="name"
					autocomplete="name"
					required
					minlength="2"
					maxlength="160"
					value={result?.values?.name ?? ''}
					aria-invalid={Boolean(current?.errors?.name)}
					aria-describedby={current?.errors?.name ? id + '-name-error' : undefined}
				/>{#if current?.errors?.name}<small id={id + '-name-error'} class="site-form-error"
						>{english ? 'Enter your name.' : 'Въведи име.'}</small
					>{/if}</label
			>
			<label class="site-field" for={id + '-phone'}
				><span>{english ? 'Phone' : 'Телефон'} *</span><input
					id={id + '-phone'}
					type="tel"
					inputmode="tel"
					name="phone"
					autocomplete="tel"
					required
					minlength="5"
					maxlength="60"
					value={result?.values?.phone ?? ''}
					aria-invalid={Boolean(current?.errors?.phone)}
					aria-describedby={current?.errors?.phone ? id + '-phone-error' : undefined}
				/>{#if current?.errors?.phone}<small id={id + '-phone-error'} class="site-form-error"
						>{english ? 'Enter a phone number.' : 'Въведи телефон.'}</small
					>{/if}</label
			>
			<label class="site-field site-field--wide" for={id + '-email'}
				><span>{english ? 'Email (optional)' : 'Имейл (по желание)'}</span><input
					id={id + '-email'}
					type="email"
					name="email"
					autocomplete="email"
					maxlength="254"
					value={result?.values?.email ?? ''}
					aria-invalid={Boolean(current?.errors?.email)}
				/>{#if current?.errors?.email}<small class="site-form-error"
						>{english ? 'Check the email address.' : 'Провери имейл адреса.'}</small
					>{/if}</label
			>
			<label class="site-field site-field--wide" for={id + '-message'}
				><span>{english ? 'Message' : 'Съобщение'}</span><textarea
					id={id + '-message'}
					name="message"
					rows={mobile ? 3 : 4}
					maxlength="5000"
					value={result?.values?.message ?? ''}
					aria-invalid={Boolean(current?.errors?.message)}
				></textarea></label
			>
		</div>
		<label class="site-form-trap" aria-hidden="true"
			>{english ? 'Website' : 'Уебсайт'}<input
				name="website"
				tabindex="-1"
				autocomplete="off"
			/></label
		>
		{#if current?.errors}<p class="site-form-error" role="alert">
				{english
					? 'The request was not saved. Check the fields or try again.'
					: 'Заявката не е запазена. Провери полетата или опитай отново.'}
			</p>{/if}
		<p class="site-form-note">
			{page.data.preview !== false
				? english
					? 'Demo request: use sample data.'
					: 'Демонстрационна заявка — използвай примерни данни.'
				: english
					? 'Saving is separate from notification. Contact the dealer directly for a response.'
					: 'Запазването е отделно от известяването. Свържи се с търговеца за отговор.'}
			<a href={linkHref('/privacy')}>{english ? 'Privacy' : 'Поверителност'}</a>
		</p>
		{#if !submitInFooter && !completed}
			<Action type="submit" size="primary" disabled={pending}
				>{pending
					? english
						? 'Saving…'
						: 'Запазване…'
					: english
						? 'Send request'
						: 'Изпрати запитване'}</Action
			>
		{/if}
	</form>
{/if}

<style>
	.site-form--mobile,
	.site-form--mobile .site-fields {
		gap: var(--bc-space-3);
	}
	.site-form--mobile .site-fields {
		grid-template-columns: minmax(0, 1fr);
	}
	.site-form--mobile .site-field {
		gap: 5px;
	}
	.site-form--mobile .site-field > span {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-label-leading);
	}
	.site-form--mobile .site-field input,
	.site-form--mobile .site-field textarea {
		border: 0;
		border-radius: 10px;
		background: var(--bc-white);
		font-weight: var(--bc-weight-body);
		padding: 10px 11px;
	}
	.site-form--mobile .site-field input {
		height: var(--bc-control-height-standard);
		min-height: var(--bc-control-height-standard);
		padding-block: 0;
	}
	.site-form--mobile .site-field textarea {
		min-height: 104px;
		resize: none;
	}
	.site-form--mobile .site-field :is(input, textarea):focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.site-form--mobile .site-field [aria-invalid='true'] {
		box-shadow: inset 0 0 0 1px var(--bc-danger);
	}
	.site-form-trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>
