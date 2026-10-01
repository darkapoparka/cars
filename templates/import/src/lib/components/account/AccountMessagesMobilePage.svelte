<script lang="ts">
	import { linkHref as resolve } from '$lib/utils/links';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import MobilePageHero from '$lib/components/common/MobilePageHero.svelte';
	import type { AuxeroMessageBubble, AuxeroMessageThreadData } from '$lib/auxero/messages';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import Send from '@lucide/svelte/icons/send';

	let { thread }: { thread: AuxeroMessageThreadData } = $props();

	const english = $derived(page.data.locale === 'en');
	let draft = $state('');
	let sentMessages = $state.raw<AuxeroMessageBubble[]>([]);
	let threadElement = $state<HTMLDivElement | null>(null);

	const visibleMessages = $derived([...thread.messages, ...sentMessages]);
	$effect(() => {
		if (sentMessages.length) {
			void tick().then(() => threadElement?.scrollTo({ top: threadElement.scrollHeight }));
		}
	});

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
				time: english ? 'Preview' : 'Преглед'
			}
		];
		draft = '';
	};
</script>

<div class="daynight-messages-mobile">
	<MobilePageHero
		title={english ? 'Messages' : 'Съобщения'}
		titleId="messages-mobile-title"
		description={thread.contacts.length +
			(english
				? ' conversation' + (thread.contacts.length === 1 ? '' : 's')
				: thread.contacts.length === 1
					? ' разговор'
					: ' разговора')}
	>
		{#snippet actions()}<a
				class="messages-account-link"
				href={resolve('/account' + (english ? '?lang=en' : ''))}
				><ArrowLeft size={20} aria-hidden="true" />{english ? 'Your account' : 'Твоят профил'}</a
			>{/snippet}
	</MobilePageHero>

	<main class="daynight-messages-mobile__main" aria-labelledby="messages-mobile-title">
		<section class="daynight-messages-mobile__conversation" aria-label={thread.activeContact.name}>
			<header class="daynight-messages-mobile__contact">
				<div class="daynight-messages-mobile__mark" aria-hidden="true">D&amp;N</div>
				<div>
					<strong>{thread.activeContact.name}</strong>
					<span
						>{english
							? 'Demo conversation · messages are not delivered'
							: 'Демо разговор · съобщенията не се изпращат'}</span
					>
				</div>
			</header>

			<div bind:this={threadElement} class="daynight-messages-mobile__thread" aria-live="polite">
				<p class="daynight-messages-mobile__date">
					{english ? 'Conversation with Day Night Auto' : 'Разговор с Day Night Auto'}
				</p>
				{#each visibleMessages as message (message.id)}
					<div class={['daynight-messages-mobile__message', message.sent && 'is-sent']}>
						<p>{message.text}</p>
						<span>
							{message.time}
							{#if message.sent && !message.id.startsWith('local-')}
								<CheckCheck size={14} strokeWidth={2.1} aria-hidden="true" />
							{/if}
						</span>
					</div>
				{/each}
			</div>

			<form class="daynight-messages-mobile__composer" onsubmit={sendMessage}>
				<label>
					<span class="sr-only">{english ? 'Write a message' : 'Напиши съобщение'}</span>
					<input
						bind:value={draft}
						type="text"
						placeholder={english ? 'Write a message...' : 'Напиши съобщение...'}
					/>
				</label>
				<button
					type="submit"
					aria-label={english ? 'Preview message' : 'Преглед на съобщението'}
					disabled={!draft.trim()}
				>
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
			height: calc(100dvh - var(--bc-mobile-nav-height) - env(safe-area-inset-bottom));
			min-height: 0;
			grid-template-rows: auto minmax(0, 1fr);
			background: var(--bc-bg-strong);
			color: #17191b;
			font-family: var(--bc-font-body);
		}

		.daynight-messages-mobile__main {
			display: grid;
			min-height: 0;
			grid-template-rows: 1fr;
			padding: 0 var(--bc-mobile-gutter) var(--bc-space-3);
		}

		.daynight-messages-mobile__conversation {
			display: grid;
			min-height: 0;
			grid-template-rows: auto minmax(0, 1fr) auto;
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
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-leading-control);
		}

		.daynight-messages-mobile__contact span {
			display: flex;
			align-items: center;
			gap: 5px;
			color: #68727c;
			font-size: var(--bc-text-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-meta);
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
			font-size: var(--bc-text-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-meta);
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
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-mobile-body-leading);
			overflow-wrap: anywhere;
		}

		.daynight-messages-mobile__message span {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 4px;
			color: #7b858e;
			font-size: var(--bc-text-meta);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-meta);
		}

		.daynight-messages-mobile__message.is-sent span {
			color: rgba(255, 255, 255, 0.68);
		}

		.daynight-messages-mobile__composer {
			display: grid;
			grid-template-columns: minmax(0, 1fr) var(--bc-control-height-standard);
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
			height: var(--bc-control-height-standard);
			border: 1px solid #dfe3e6;
			border-radius: 999px;
			background: #f5f6f7;
			color: #17191b;
			padding: 0 14px;
			font: inherit;
			font-size: var(--bc-mobile-body);
			font-weight: var(--bc-weight-body);
			outline: 0;
		}

		.daynight-messages-mobile__composer input:focus {
			border-color: var(--bc-accent);
			background: #ffffff;
		}

		.daynight-messages-mobile__composer button {
			display: grid;
			width: var(--bc-control-height-standard);
			height: var(--bc-control-height-standard);
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
	}

	.messages-account-link {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		width: fit-content;
		min-height: var(--bc-control-height-standard);
		color: var(--bc-white);
		text-decoration: none;
		font: var(--bc-weight-action) var(--bc-text-control)/1.2 var(--bc-font-body);
	}
</style>
