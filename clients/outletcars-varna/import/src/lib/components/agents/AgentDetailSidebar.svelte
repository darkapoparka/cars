<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAgentDetailSidebar } from '$lib/auxero/agent-detail';

	let { sidebar }: { sidebar: AuxeroAgentDetailSidebar } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class="innerpage__sidebar">
	<div class="listing-details--sidebar-box mb-40">
		<div class="listing-details--contact">
			<p class="h4 mb-16">Локация</p>

			<div class="widget-gg-map radius-8 mb-28 flex overflow-hidden">
				<iframe
					src={sidebar.mapSrc}
					height="234"
					style="border:0;width: 100%;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="OUTLETCARS.BG — Варна location map"
				></iframe>
			</div>

			<ul class="contact-info mb-20">
				<li>
					<p class="icon"><img src="/assets/icons/MapPin.svg" alt="phone" /></p>
					<div class="flex flex-col gap-4">
						<a href={resolve('/contact')}>{sidebar.address}</a>
						<a href={resolve('/contact')} class="text-highlight text-underline text-sm"
							>Запази час за оглед</a
						>
					</div>
				</li>
			</ul>
			<ul class="contact-info mb-28">
				<li class="items-center">
					<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone" /></p>
					<div class="flex flex-col">
						<a {...externalHref(sidebar.callHref)}>{sidebar.phone}</a>
					</div>
				</li>
			</ul>

			<a
				{...externalHref(sidebar.callHref)}
				class="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
			>
				<img src="/assets/icons/PhoneCall-2.svg" alt="phone" />
				{sidebar.callLabel}
			</a>

			<a
				{...externalHref(sidebar.viberHref)}
				class="btn btn-medium btn-primary-4 font-weight-600 gap-5"
			>
				<img src="/assets/icons/ChatCircleDots.svg" alt="phone" />
				{sidebar.viberLabel}
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16">{sidebar.formTitle}</p>

		<form action="#" class="send-inquiry">
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">Име</p>
					<input
						class="active input-large"
						id="SendInquiryname"
						name="SendInquiryname"
						type="text"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">Имейл</p>
					<input
						class="input-large"
						name="SendInquiryemail"
						id="SendInquiryemail"
						type="text"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">Телефон</p>
					<input
						placeholder="Телефон (по избор)"
						class="input-large"
						name="SendInquiryphone"
						id="SendInquiryphone"
						type="number"
						value=""
						required
					/>
				</div>

				<div>
					<p class="mb-8">Тема</p>
					<select>
						{#each sidebar.subjectOptions as option (option)}
							<option>{option}</option>
						{/each}
					</select>
				</div>

				<div class="padding-0">
					<p class="mb-6">Съобщение</p>
					<textarea
						placeholder={sidebar.messagePlaceholder}
						rows="3"
						name="message2"
						class="message"
						id="message2"
						required
					></textarea>
				</div>
			</div>
			<button class="btn btn-primary btn-large font-weight-600 mb-18 w-full">
				{sidebar.submitLabel}
			</button>
			<label class="filter-checkbox style-2 mb-6">
				<input type="checkbox" name="features" value="touch-screen" />
				<span class="text-sm">{sidebar.consentLabel}</span>
			</label>

			<p class="text-secondary text-xs">
				Използвайки тази услуга, приемате нашите
				<a href={resolve('/terms')} class="text-highlight text-underline text-xs"
					>{sidebar.termsLabel}</a
				>
			</p>
		</form>
	</div>
</div>

<style>
	/* Scoped to the agent-detail sidebar only — the vehicle PDP uses the same
	   legacy class but has its own token-compliant override, so we must not
	   touch the global rule. Match the flat-card language: 1px border + surface. */
	.listing-details--sidebar-box {
		border-width: 1px;
		background: var(--bc-surface);
	}
</style>
