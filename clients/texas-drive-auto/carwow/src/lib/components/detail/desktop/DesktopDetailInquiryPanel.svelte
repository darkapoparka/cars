<script lang="ts">
	import { resolve } from '$app/paths';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	type LeadSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let inquirySubmitState = $state<LeadSubmitState>('idle');
	let inquirySubmitMessage = $state('');

	const inquiryErrorMessage = `Your inquiry was not sent. Try again or call/message on Viber at ${daynightSite.phoneLabel}.`;

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
			`Vehicle: ${vehicle.title}`,
			`Reference number: ${vehicle.lot}`,
			`Subject: ${subject}`,
			message,
			wantsPriceUpdates ? 'The customer requests price alerts.' : ''
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
			inquirySubmitMessage = 'Draft only — not sent';
			form.reset();
			return;
		}

		inquirySubmitState = 'error';
		inquirySubmitMessage = inquiryErrorMessage;
	}
</script>

<div class="listing-details--sidebar-box">
	<p class="h5 mb-16 capitalize">Vehicle inquiry</p>

	<form
		action="#"
		class="send-inquiry"
		onsubmit={handleInquirySubmit}
		aria-busy={inquirySubmitState === 'submitting'}
		data-daynight-live-lead="true"
	>
		<div class="mb-8 grid grid-cols-1 gap-18">
			<div>
				<label class="mb-8" for="SendInquiryname">Name</label>
				<input
					class="active input-large"
					id="SendInquiryname"
					name="SendInquiryname"
					type="text"
					value=""
					placeholder="Your name"
					required
					aria-label="Your name"
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryemail">Email</label>
				<input
					class="input-large"
					name="SendInquiryemail"
					id="SendInquiryemail"
					type="email"
					value=""
					placeholder="Your email"
					required
					aria-label="Email"
				/>
			</div>
			<div>
				<label class="mb-8" for="SendInquiryphone">Phone</label>
				<input
					placeholder="Phone (optional)"
					class="input-large"
					name="SendInquiryphone"
					id="SendInquiryphone"
					type="tel"
					value=""
					aria-label="Phone"
				/>
			</div>

			<div>
				<label class="mb-8" for="SendInquirysubject">Subject</label>
				<select id="SendInquirysubject" name="SendInquirysubject">
					<option>Vehicle availability</option>
					<option>Price and viewing</option>
					<option>Buyer-arranged funding</option>
				</select>
			</div>

			<div class="padding-0">
				<label class="mb-6" for="message">Message</label>
				<textarea
					placeholder="Your message"
					rows="3"
					name="message"
					class="message"
					id="message"
					required
					aria-label="Message"
				></textarea>
			</div>
		</div>
		<button
			type="submit"
			class="sa-cta sa-cta-primary mb-18 w-full"
			disabled={inquirySubmitState === 'submitting'}
		>
			{inquirySubmitState === 'submitting' ? 'Sending...' : 'Send inquiry'}
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
				>Yes, I’d like price alerts and useful information about this vehicle.</span
			>
		</label>

		<p class="text-secondary text-xs">
			By using this service, you accept our
			<a href={resolve('/terms')} class="text-underline text-highlight text-xs">
				User Agreement.
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
