<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroMessageBubble, AuxeroMessageThreadData } from '$lib/auxero/messages';
	import { daynightAssets } from '$lib/data/daynight';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import { ArrowLeft, CheckCheck, PhoneCall, Send } from '@lucide/svelte';

	let { thread }: { thread: AuxeroMessageThreadData } = $props();

	let draft = $state('');
	let sentMessages = $state.raw<AuxeroMessageBubble[]>([]);

	const visibleMessages = $derived([...thread.messages, ...sentMessages]);

	const sendMessage = (event: SubmitEvent) => {
		event.preventDefault();
		const text = draft.trim();

		if (!text) return;

		sentMessages = [
			...sentMessages,
			{
				id: `local-${Date.now()}`,
				sent: true,
				text,
				time: 'Току-що'
			}
		];
		draft = '';
	};
</script>

<div class="daynight-messages-mobile">
	<header class="daynight-messages-mobile__appbar">
		<a
			class="daynight-messages-mobile__back"
			href={resolve('/account')}
			aria-label="Назад към профила"
		>
			<ArrowLeft size={20} strokeWidth={2.3} aria-hidden="true" />
		</a>
		<a
			class="daynight-messages-mobile__brand"
			href={resolve('/')}
			aria-label="OUTLETCARS.BG — Варна начало"
		>
			<img src={daynightAssets.logoLight} alt="OUTLETCARS.BG — Варна" width="1285" height="235" />
		</a>
		<a
			class="daynight-messages-mobile__call"
			href="tel:+359898921010"
			aria-label="Обади се на OUTLETCARS.BG — Варна"
		>
			<PhoneCall size={19} strokeWidth={2.2} aria-hidden="true" />
		</a>
	</header>

	<main class="daynight-messages-mobile__main" aria-labelledby="messages-mobile-title">
		<header class="daynight-messages-mobile__titlebar">
			<div>
				<p>Профил</p>
				<h1 id="messages-mobile-title">Съобщения</h1>
			</div>
			<span>{thread.contacts.length} {thread.contacts.length === 1 ? 'разговор' : 'разговора'}</span
			>
		</header>

		<section class="daynight-messages-mobile__conversation" aria-label={thread.activeContact.name}>
			<header class="daynight-messages-mobile__contact">
				<div class="daynight-messages-mobile__mark" aria-hidden="true">D&amp;N</div>
				<div>
					<strong>{thread.activeContact.name}</strong>
					<span><i></i> Обикновено отговаряме същия ден</span>
				</div>
			</header>

			<div class="daynight-messages-mobile__thread" aria-live="polite">
				<p class="daynight-messages-mobile__date">Разговор с OUTLETCARS.BG — Варна</p>
				{#each visibleMessages as message (message.id)}
					<div class={['daynight-messages-mobile__message', message.sent && 'is-sent']}>
						<p>{message.text}</p>
						<span>
							{message.time}
							{#if message.sent}
								<CheckCheck size={14} strokeWidth={2.1} aria-label="Изпратено" />
							{/if}
						</span>
					</div>
				{/each}
			</div>

			<form class="daynight-messages-mobile__composer" onsubmit={sendMessage}>
				<label>
					<span class="sr-only">Напиши съобщение</span>
					<input bind:value={draft} type="text" placeholder="Напиши съобщение..." />
				</label>
				<button type="submit" aria-label="Изпрати съобщението" disabled={!draft.trim()}>
					<Send size={18} strokeWidth={2.3} aria-hidden="true" />
				</button>
			</form>
		</section>
	</main>

	<MobileBottomNav pathname="/account/messages" />
</div>

<style>
	.daynight-messages-mobile {
		display: none;
	}

	@media (max-width: 767.98px) {
		.daynight-messages-mobile {
			display: grid;
			min-height: calc(100dvh - 70px - env(safe-area-inset-bottom));
			grid-template-rows: auto 1fr;
			background: #f4f5f6;
			color: #17191b;
			font-family: var(--bc-font-body);
		}

		.daynight-messages-mobile__appbar {
			position: sticky;
			top: 0;
			z-index: 20;
			display: grid;
			height: calc(58px + env(safe-area-inset-top));
			grid-template-columns: 40px 1fr 40px;
			align-items: center;
			gap: 10px;
			background: #0c0c0c;
			padding: env(safe-area-inset-top) 12px 0;
		}

		.daynight-messages-mobile__back,
		.daynight-messages-mobile__call {
			display: grid;
			width: 40px;
			height: 40px;
			place-items: center;
			border: 1px solid rgba(255, 255, 255, 0.25);
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.08);
			color: #ffffff;
			text-decoration: none;
		}

		.daynight-messages-mobile__brand {
			display: flex;
			min-width: 0;
			justify-content: center;
		}

		.daynight-messages-mobile__brand img {
			display: block;
			width: min(156px, 100%);
			height: auto;
			object-fit: contain;
		}

		.daynight-messages-mobile__main {
			display: grid;
			min-height: 0;
			grid-template-rows: auto 1fr;
			padding: 18px 14px 12px;
		}

		.daynight-messages-mobile__titlebar {
			display: flex;
			align-items: end;
			justify-content: space-between;
			gap: 12px;
			padding: 0 2px 14px;
		}

		.daynight-messages-mobile__titlebar p,
		.daynight-messages-mobile__titlebar h1 {
			margin: 0;
		}

		.daynight-messages-mobile__titlebar p {
			color: var(--bc-accent);
			font-size: 11px;
			font-weight: 800;
			letter-spacing: 0.06em;
			line-height: 14px;
			text-transform: uppercase;
		}

		.daynight-messages-mobile__titlebar h1 {
			font-size: 26px;
			font-weight: 850;
			letter-spacing: -0.03em;
			line-height: 31px;
		}

		.daynight-messages-mobile__titlebar > span {
			color: #68727c;
			font-size: 12px;
			font-weight: 700;
			line-height: 18px;
		}

		.daynight-messages-mobile__conversation {
			display: grid;
			min-height: 0;
			grid-template-rows: auto minmax(250px, 1fr) auto;
			overflow: hidden;
			border: 1px solid #dde1e5;
			border-radius: 14px;
			background: #ffffff;
			box-shadow: 0 8px 24px rgba(17, 17, 17, 0.06);
		}

		.daynight-messages-mobile__contact {
			display: flex;
			min-height: 64px;
			align-items: center;
			gap: 10px;
			border-bottom: 1px solid #e5e7ea;
			padding: 10px 12px;
		}

		.daynight-messages-mobile__mark {
			display: grid;
			width: 40px;
			height: 40px;
			flex: 0 0 40px;
			place-items: center;
			border-radius: 50%;
			background: #17191b;
			color: #ffffff;
			font-size: 11px;
			font-weight: 900;
			letter-spacing: -0.03em;
		}

		.daynight-messages-mobile__contact > div:last-child {
			display: grid;
			min-width: 0;
			gap: 2px;
		}

		.daynight-messages-mobile__contact strong {
			font-size: 15px;
			font-weight: 850;
			line-height: 19px;
		}

		.daynight-messages-mobile__contact span {
			display: flex;
			align-items: center;
			gap: 5px;
			color: #68727c;
			font-size: 11px;
			font-weight: 650;
			line-height: 15px;
		}

		.daynight-messages-mobile__contact i {
			width: 7px;
			height: 7px;
			border-radius: 50%;
			background: #3ba55d;
		}

		.daynight-messages-mobile__thread {
			display: flex;
			min-height: 0;
			flex-direction: column;
			gap: 9px;
			overflow-y: auto;
			background: linear-gradient(#fafbfb, #ffffff);
			padding: 12px;
			scrollbar-width: none;
		}

		.daynight-messages-mobile__thread::-webkit-scrollbar {
			display: none;
		}

		.daynight-messages-mobile__date {
			align-self: center;
			margin: 0 0 2px;
			color: #84909a;
			font-size: 10px;
			font-weight: 700;
			line-height: 14px;
		}

		.daynight-messages-mobile__message {
			display: grid;
			max-width: 82%;
			align-self: flex-start;
			gap: 5px;
			border-radius: 4px 14px 14px;
			background: #edf0f2;
			padding: 9px 11px 7px;
		}

		.daynight-messages-mobile__message.is-sent {
			align-self: flex-end;
			border-radius: 14px 4px 14px 14px;
			background: #1c1c1c;
			color: #ffffff;
		}

		.daynight-messages-mobile__message p,
		.daynight-messages-mobile__message span {
			margin: 0;
		}

		.daynight-messages-mobile__message p {
			font-size: 13px;
			font-weight: 600;
			line-height: 19px;
		}

		.daynight-messages-mobile__message span {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 4px;
			color: #7b858e;
			font-size: 10px;
			font-weight: 650;
			line-height: 13px;
		}

		.daynight-messages-mobile__message.is-sent span {
			color: rgba(255, 255, 255, 0.68);
		}

		.daynight-messages-mobile__composer {
			display: grid;
			grid-template-columns: 1fr 42px;
			align-items: center;
			gap: 8px;
			border-top: 1px solid #e5e7ea;
			background: #ffffff;
			padding: 9px 10px;
		}

		.daynight-messages-mobile__composer label {
			display: block;
			min-width: 0;
		}

		.daynight-messages-mobile__composer input {
			box-sizing: border-box;
			width: 100%;
			height: 42px;
			border: 1px solid #dfe3e6;
			border-radius: 999px;
			background: #f5f6f7;
			color: #17191b;
			padding: 0 14px;
			font: inherit;
			font-size: 13px;
			font-weight: 600;
			outline: 0;
		}

		.daynight-messages-mobile__composer input:focus {
			border-color: var(--bc-accent);
			background: #ffffff;
		}

		.daynight-messages-mobile__composer button {
			display: grid;
			width: 42px;
			height: 42px;
			place-items: center;
			border: 0;
			border-radius: 50%;
			background: var(--bc-accent);
			color: #ffffff;
			cursor: pointer;
			padding: 0;
		}

		.daynight-messages-mobile__composer button:disabled {
			background: #c7ccd0;
			cursor: default;
		}

		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}
	}

	@media (max-width: 350px) {
		.daynight-messages-mobile__main {
			padding-right: 10px;
			padding-left: 10px;
		}

		.daynight-messages-mobile__brand img {
			width: 138px;
		}
	}
</style>
