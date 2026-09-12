<script lang="ts">
	import Send from '@lucide/svelte/icons/send';

	export type ChatConversation = {
		id: string;
		subject: string;
		status: string;
		lastMessageAt: string | null;
		createdAt: string;
		updatedAt: string;
	};

	export type ChatMessage = {
		id: string;
		conversationId: string;
		senderType: 'staff' | 'customer' | 'system';
		senderName: string;
		body: string;
		readAt: string | null;
		createdAt: string;
	};

	type StartPayload = {
		name: string;
		message: string;
	};

	type Props = {
		conversation: ChatConversation | null;
		messages: ChatMessage[];
		loading: boolean;
		sending: boolean;
		errorMessage: string;
		onStart: (payload: StartPayload) => Promise<boolean>;
		onSend: (message: string) => Promise<boolean>;
	};

	let { conversation, messages, loading, sending, errorMessage, onStart, onSend }: Props = $props();

	let name = $state('');
	let startMessage = $state('');
	let draft = $state('');

	const sortedMessages = $derived(
		[...messages].sort(
			(left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
		)
	);

	function formatTime(value: string) {
		return new Intl.DateTimeFormat('bg-BG', {
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(value));
	}

	async function submitStart(event: SubmitEvent) {
		event.preventDefault();
		const ok = await onStart({
			name: name.trim(),
			message: startMessage.trim()
		});

		if (ok) {
			startMessage = '';
		}
	}

	async function submitMessage(event: SubmitEvent) {
		event.preventDefault();
		const message = draft.trim();
		if (!message) return;

		const ok = await onSend(message);
		if (ok) draft = '';
	}
</script>

<section class="chat-thread" aria-live="polite">
	<header class="chat-thread__header">
		<div>
			<p class="chat-thread__eyebrow">Success Automobile</p>
			<h2 id="daynight-chat-title">Чат с екипа</h2>
		</div>
		<span class="chat-thread__status">
			{conversation?.status === 'closed' ? 'Приключен разговор' : 'Изпратете въпрос'}
		</span>
	</header>

	{#if errorMessage}
		<p class="chat-thread__error">{errorMessage}</p>
	{/if}

	{#if loading}
		<div class="chat-thread__loading">Зареждане...</div>
	{:else if !conversation}
		<form class="chat-thread__start" onsubmit={submitStart}>
			<label>
				<span>Име</span>
				<input bind:value={name} name="name" autocomplete="name" maxlength="140" />
			</label>
			<label>
				<span>Съобщение</span>
				<textarea bind:value={startMessage} name="message" rows="4" maxlength="1200" required
				></textarea>
			</label>
			<button type="submit" disabled={sending || !startMessage.trim()}>
				<Send aria-hidden="true" />
				Започни чат
			</button>
		</form>
	{:else}
		<div class="chat-thread__messages">
			{#if sortedMessages.length}
				{#each sortedMessages as message (message.id)}
					<article
						class={`chat-thread__message chat-thread__message--${message.senderType === 'staff' ? 'staff' : 'visitor'}`}
					>
						<p>{message.body}</p>
						<footer>
							<span>{message.senderType === 'staff' ? 'Success Automobile' : message.senderName}</span>
							<time datetime={message.createdAt}>{formatTime(message.createdAt)}</time>
						</footer>
					</article>
				{/each}
			{:else}
				<p class="chat-thread__empty">Изпратете въпрос и ще отговорим възможно най-скоро.</p>
			{/if}
		</div>

		<form class="chat-thread__reply" onsubmit={submitMessage}>
			<textarea
				bind:value={draft}
				name="message"
				rows="3"
				maxlength="1200"
				placeholder="Напишете съобщение"
				required
			></textarea>
			<button type="submit" disabled={sending || !draft.trim()}>
				<Send aria-hidden="true" />
				Изпрати
			</button>
		</form>
	{/if}
</section>

<style>
	.chat-thread {
		overflow: hidden;
		width: min(376px, calc(100vw - 24px));
		border: 1px solid rgba(15, 23, 42, 0.12);
		border-radius: 8px;
		background: #fff;
		color: #111827;
		box-shadow: none;
	}

	.chat-thread__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px;
		border-bottom: 1px solid rgba(15, 23, 42, 0.1);
		background: var(--sa-ink);
		color: #fff;
	}

	.chat-thread__eyebrow {
		margin: 0 0 2px;
		color: rgba(255, 255, 255, 0.68);
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
	}

	.chat-thread h2 {
		margin: 0;
		color: #fff;
		font-size: 18px;
		font-weight: 800;
		letter-spacing: 0;
	}

	.chat-thread__status {
		border-radius: 999px;
		background: transparent;
		padding: 5px 10px;
		color: #fff;
		font-size: 12px;
		font-weight: 800;
	}

	.chat-thread__error {
		margin: 12px 12px 0;
		border: 1px solid rgba(225, 29, 72, 0.24);
		border-radius: 8px;
		background: #fff1f2;
		padding: 10px 12px;
		color: #9f1239;
		font-size: 13px;
		font-weight: 700;
	}

	.chat-thread__loading,
	.chat-thread__empty {
		margin: 0;
		padding: 24px 16px;
		color: #64748b;
		text-align: center;
		font-size: 14px;
	}

	.chat-thread__start,
	.chat-thread__reply {
		display: grid;
		gap: 12px;
		padding: 14px;
	}

	.chat-thread label {
		display: grid;
		gap: 6px;
		color: #334155;
		font-size: 13px;
		font-weight: 800;
	}

	.chat-thread input,
	.chat-thread textarea {
		width: 100%;
		border: 1px solid rgba(15, 23, 42, 0.16);
		border-radius: 8px;
		background: #fff;
		padding: 10px 11px;
		color: #111827;
		font: inherit;
		font-size: 16px;
		resize: vertical;
	}

	.chat-thread input:focus,
	.chat-thread textarea:focus {
		border-color: var(--sa-ink);
		outline: 2px solid var(--sa-ink);
		outline-offset: 2px;
	}

	.chat-thread button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		border: 0;
		border-radius: 8px;
		background: var(--sa-ink);
		color: #fff;
		font-weight: 800;
		cursor: pointer;
	}

	.chat-thread button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.chat-thread button :global(svg) {
		width: 17px;
		height: 17px;
	}

	.chat-thread__messages {
		display: grid;
		max-height: min(420px, calc(100vh - 260px));
		gap: 10px;
		overflow-y: auto;
		padding: 14px;
		background: #f8fafc;
	}

	.chat-thread__message {
		max-width: 86%;
		border-radius: 8px;
		padding: 9px 11px;
		font-size: 14px;
		line-height: 1.45;
	}

	.chat-thread__message p {
		margin: 0;
		white-space: pre-wrap;
	}

	.chat-thread__message footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: 6px;
		font-size: 11px;
		opacity: 0.72;
	}

	.chat-thread__message--staff {
		justify-self: start;
		background: #e2e8f0;
		color: #0f172a;
	}

	.chat-thread__message--visitor {
		justify-self: end;
		background: var(--sa-ink);
		color: #fff;
	}

	.chat-thread__reply {
		border-top: 1px solid rgba(15, 23, 42, 0.1);
	}
</style>
