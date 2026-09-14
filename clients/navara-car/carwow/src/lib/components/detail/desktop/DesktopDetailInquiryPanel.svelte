<script lang="ts">
	import { resolve } from '$app/paths';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	type LeadSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let inquirySubmitState = $state<LeadSubmitState>('idle');
	let inquirySubmitMessage = $state('');

	const inquiryErrorMessage = `Не успяхме да изпратим запитването. Моля, опитайте отново или се свържете по телефон/Viber на ${daynightSite.phoneLabel}.`;

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
			`Автомобил: ${vehicle.title}`,
			`Референтен номер: ${vehicle.lot}`,
			`Тема: ${subject}`,
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
	<p class="h5 mb-16 capitalize">Запитване за автомобила</p>

	<form
		action="#"
		class="send-inquiry"
		onsubmit={handleInquirySubmit}
		aria-busy={inquirySubmitState === 'submitting'}
		data-daynight-live-lead="true"
	>
		<div class="mb-8 grid grid-cols-1 gap-18">
			<div>
				<label class="mb-8" for="SendInquiryname">Име</label>
				<input
					class="active input-large"
					id="SendInquiryname"
					name="SendInquiryname"
					type="text"
					value=""
					placeholder="Вашето име"
					required
					aria-label="Вашето име"
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryemail">Имейл</label>
				<input
					class="input-large"
					name="SendInquiryemail"
					id="SendInquiryemail"
					type="email"
					value=""
					placeholder="Вашият имейл"
					required
					aria-label="Имейл"
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryphone">Телефон</label>
				<input
					placeholder="Телефон (по избор)"
					class="input-large"
					name="SendInquiryphone"
					id="SendInquiryphone"
					type="tel"
					value=""
					aria-label="Телефон"
				/>
			</div>

			<div>
				<label class="mb-8" for="SendInquirysubject">Тема</label>
				<select id="SendInquirysubject" name="SendInquirysubject">
					<option>Наличност на автомобила</option>
					<option>Цена и оглед</option>
					<option>Финансиране</option>
				</select>
			</div>

			<div class="padding-0">
				<label class="mb-6" for="message">Съобщение</label>
				<textarea
					placeholder="Вашето съобщение"
					rows="3"
					name="message"
					class="message"
					id="message"
					required
					aria-label="Съобщение"
				></textarea>
			</div>
		</div>
		<button
			type="submit"
			class="mb-18 sa-cta w-full sa-cta-primary"
			disabled={inquirySubmitState === 'submitting'}
		>
			{inquirySubmitState === 'submitting' ? 'Изпращаме...' : 'Изпрати запитване'}
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
				{inquirySubmitMessage}
			</p>
		{/if}
		<label class="filter-checkbox style-2 mb-6">
			<input type="checkbox" name="price_updates" value="yes" />
			<span class="text-sm"
				>Да, искам да получавам известия за цената и полезна информация за този автомобил.</span
			>
		</label>

		<p class="text-secondary text-xs">
			Използвайки услугата, приемате нашето
			<a href={resolve('/terms')} class="text-underline text-highlight text-xs">
				Споразумение с потребителите.
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
