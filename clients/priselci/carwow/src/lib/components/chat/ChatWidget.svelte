<script lang="ts">
	import { onMount } from 'svelte';
	import ChatLauncher from './ChatLauncher.svelte';
	import ChatThread, { type ChatConversation, type ChatMessage } from './ChatThread.svelte';

	type ConversationResponse = {
		conversation: ChatConversation | null;
		messages: ChatMessage[];
	};

	let open = $state(false);
	let loaded = $state(false);
	let loading = $state(false);
	let sending = $state(false);
	let errorMessage = $state('');
	let conversation = $state<ChatConversation | null>(null);
	let messages = $state<ChatMessage[]>([]);

	const unreadCount = $derived(
		open
			? 0
			: messages.filter((message) => message.senderType === 'staff' && !message.readAt).length
	);

	async function readResponse(response: Response): Promise<ConversationResponse> {
		const body = await response.json().catch(() => null);

		if (!response.ok) {
			throw new Error(body?.message ?? 'Chat request failed.');
		}

		return {
			conversation: body.conversation ?? null,
			messages: Array.isArray(body.messages) ? body.messages : []
		};
	}

	function mergeMessages(nextMessages: ChatMessage[]) {
		const merged = [...messages];

		for (const message of nextMessages) {
			const existingIndex = merged.findIndex((existing) => existing.id === message.id);
			if (existingIndex >= 0) {
				merged[existingIndex] = message;
			} else {
				merged.push(message);
			}
		}

		messages = merged.sort(
			(left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
		);
	}

	async function loadConversation() {
		if (loading) return;

		loading = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/chat/conversations', {
				headers: { accept: 'application/json' }
			});
			const body = await readResponse(response);
			conversation = body.conversation;
			mergeMessages(body.messages);
			loaded = true;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Чатът временно не е наличен. Опитайте отново.';
		} finally {
			loading = false;
		}
	}

	async function toggleOpen() {
		open = !open;

		if (open && !loaded) {
			await loadConversation();
		}
	}

	async function startConversation(payload: { name: string; message: string }) {
		sending = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/chat/conversations', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			const body = await readResponse(response);
			conversation = body.conversation;
			mergeMessages(body.messages);
			loaded = true;
			return true;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Съобщението не беше изпратено. Опитайте пак.';
			return false;
		} finally {
			sending = false;
		}
	}

	async function sendMessage(message: string) {
		if (!conversation) return startConversation({ name: '', message });

		sending = true;
		errorMessage = '';

		try {
			const response = await fetch(`/api/chat/conversations/${conversation.id}/messages`, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json'
				},
				body: JSON.stringify({ message })
			});
			const body = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(body?.message ?? 'Chat message failed.');
			}

			if (body?.message) {
				mergeMessages([body.message]);
			}

			return true;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Съобщението не беше изпратено. Опитайте пак.';
			return false;
		} finally {
			sending = false;
		}
	}

	async function pollMessages() {
		if (!conversation || sending) return;

		const lastMessage = messages.at(-1);
		const suffix = lastMessage ? `?after=${encodeURIComponent(lastMessage.createdAt)}` : '';

		try {
			const response = await fetch(`/api/chat/conversations/${conversation.id}/messages${suffix}`, {
				headers: { accept: 'application/json' }
			});
			const body = await response.json().catch(() => null);

			if (!response.ok) return;
			if (Array.isArray(body?.messages)) mergeMessages(body.messages);
		} catch {
			// Polling failures are intentionally silent; direct sends surface errors.
		}
	}

	onMount(() => {
		const interval = window.setInterval(() => {
			if (open && conversation) void pollMessages();
		}, 15_000);

		return () => window.clearInterval(interval);
	});
</script>

<div class="chat-widget" data-open={open} data-daynight-chat-widget>
	{#if open}
		<ChatThread
			{conversation}
			{messages}
			{loading}
			{sending}
			{errorMessage}
			onStart={startConversation}
			onSend={sendMessage}
		/>
	{/if}

	<ChatLauncher {open} {unreadCount} onclick={toggleOpen} />
</div>

<style>
	.chat-widget {
		position: fixed;
		right: 20px;
		bottom: 24px;
		z-index: 9000;
		display: grid;
		justify-items: end;
		gap: 12px;
		pointer-events: none;
	}

	.chat-widget :global(.chat-thread),
	.chat-widget :global(.chat-launcher) {
		pointer-events: auto;
	}

	@media (max-width: 760px) {
		.chat-widget {
			right: 12px;
			bottom: 92px;
		}

		:global(body:has(.mobile-fullsheet) [data-daynight-chat-widget]),
		:global(body:has(.mobile-drawer[data-state='open']) [data-daynight-chat-widget]),
		:global(body:has(.mobile-contact-app) [data-daynight-chat-widget]),
		:global(body:has(.mobile-sell) [data-daynight-chat-widget]) {
			display: none;
		}
	}
</style>
