<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	type LeadSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let inquirySubmitState = $state<LeadSubmitState>('idle');
	let inquirySubmitMessage = $state('');

	const inquiryErrorMessage = i18n.t('pattern.46349c35d9b3', { v0: daynightSite.phoneLabel });

	function readFormValue(formData: FormData, name: string) {
		const value = formData.get(name);
		return typeof value === 'string' ? value.trim() : '';
	}

	async function handleInquirySubmit(event: SubmitEvent) {
		event.preventDefault();

		if (inquirySubmitState === 'submitting') {
			return;
		}

		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(form);
		const customerName = readFormValue(formData, 'SendInquiryname');
		const email = readFormValue(formData, 'SendInquiryemail');
		const phone = readFormValue(formData, 'SendInquiryphone');
		const subject = readFormValue(formData, 'SendInquirysubject');
		const message = readFormValue(formData, 'message');
		const wantsPriceUpdates = formData.get('price_updates') === 'yes';
		const fullMessage = [
			i18n.t('pattern.b3d5d0ee75f3', { v0: vehicle.title }),
			i18n.t('pattern.89371a38f8f7', { v0: vehicle.lot }),
			i18n.t('pattern.18c57a42d0c1', { v0: subject }),
			message,
			wantsPriceUpdates ? 'Клиентът иска известия за цената.' : ''
		]
			.filter(Boolean)
			.join('\n\n');

		inquirySubmitState = 'submitting';
		inquirySubmitMessage = '';

		const result = await submitLead({
			customerName,
			contact: phone || email,
			email: email || null,
			phone: phone || null,
			source: 'vehicle-detail-sidebar',
			message: fullMessage,
			value: vehicle.price
		});

		if (result.ok) {
			inquirySubmitState = 'success';
			inquirySubmitMessage = 'Благодарим! Ще се свържем с вас за този автомобил.';
			form.reset();
			return;
		}

		inquirySubmitState = 'error';
		inquirySubmitMessage = inquiryErrorMessage;
	}
</script>

<div class="listing-details--sidebar-box">
	<p class="h5 mb-16 capitalize">{i18n.t('copy.f90249ddd169')}</p>

	<form
		action="#"
		class="send-inquiry"
		onsubmit={handleInquirySubmit}
		aria-busy={inquirySubmitState === 'submitting'}
		data-daynight-live-lead="true"
	>
		<div class="mb-8 grid grid-cols-1 gap-18">
			<div>
				<label class="mb-8" for="SendInquiryname">{i18n.t('copy.7848bd195104')}</label>
				<input
					{@attach i18n.validation}
					class="active input-large"
					id="SendInquiryname"
					name="SendInquiryname"
					type="text"
					value=""
					placeholder={i18n.t('copy.62170ed5140f')}
					required
					aria-label={i18n.t('copy.62170ed5140f')}
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryemail">{i18n.t('copy.de9f803f65b3')}</label>
				<input
					{@attach i18n.validation}
					class="input-large"
					name="SendInquiryemail"
					id="SendInquiryemail"
					type="email"
					value=""
					placeholder={i18n.t('copy.75b14640a4f5')}
					required
					aria-label={i18n.t('copy.de9f803f65b3')}
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryphone">{i18n.t('copy.822f9fd9ba2d')}</label>
				<input
					{@attach i18n.validation}
					placeholder={i18n.t('copy.9b514468f1cc')}
					class="input-large"
					name="SendInquiryphone"
					id="SendInquiryphone"
					type="tel"
					value=""
					aria-label={i18n.t('copy.822f9fd9ba2d')}
				/>
			</div>

			<div>
				<label class="mb-8" for="SendInquirysubject">{i18n.t('copy.682f961a0751')}</label>
				<select {@attach i18n.validation} id="SendInquirysubject" name="SendInquirysubject">
					<option>{i18n.t('copy.b0353fe35224')}</option>
					<option>{i18n.t('copy.5e56aa9e8586')}</option>
					<option>{i18n.t('copy.6e55eeb12cce')}</option>
				</select>
			</div>

			<div class="padding-0">
				<label class="mb-6" for="message">{i18n.t('copy.5afae14709c7')}</label>
				<textarea
					{@attach i18n.validation}
					placeholder={i18n.t('copy.e5de35a7b139')}
					rows="3"
					name="message"
					class="message"
					id="message"
					required
					aria-label={i18n.t('copy.5afae14709c7')}
				></textarea>
			</div>
		</div>
		<button
			type="submit"
			class="mb-18 sa-cta w-full sa-cta-primary"
			disabled={inquirySubmitState === 'submitting'}
		>
			{inquirySubmitState === 'submitting'
				? i18n.t('copy.acfcd771108c')
				: i18n.t('copy.8d4343e23a1b')}
		</button>
		{#if inquirySubmitMessage}
			<p
				class={[
					'daynight-form-status font-weight-600 mb-18',
					inquirySubmitState === 'success' && 'text-highlight',
					inquirySubmitState === 'error' && 'daynight-form-status--error'
				]}
				role={inquirySubmitState === 'error' ? 'alert' : 'status'}
				aria-live="polite"
			>
				{i18n.text(inquirySubmitMessage)}
			</p>
		{/if}
		<label class="filter-checkbox style-2 mb-6">
			<input {@attach i18n.validation} type="checkbox" name="price_updates" value="yes" />
			<span class="text-sm">{i18n.t('copy.c751b521a267')}</span>
		</label>

		<p class="text-secondary text-xs">
			{i18n.t('copy.9f1e68c1e08e')}
			<a href={i18n.href(resolve('/terms'))} class="text-underline text-highlight text-xs">
				{i18n.t('copy.3ed43348ee8d')}
			</a>
		</p>
	</form>
</div>

<style>
	.send-inquiry button:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.daynight-form-status--error {
		color: #b91c1c;
	}
</style>
