<script lang="ts">
	import { resolve } from '$app/paths';
	import { MoreHorizontal, Paperclip, Search, Send } from '@lucide/svelte';
	import type { AuxeroMessageThreadData } from '$lib/auxero/messages';

	let { thread }: { thread: AuxeroMessageThreadData } = $props();
</script>

<section class="dash-message-app" data-eliqauto-message-container>
	<aside class="dash-message-sidebar">
		<div class="dash-message-search">
			<label class="dash-field" for="SearchUsers">
				<span class="dash-label">{thread.heading}</span>
				<span class="relative block">
					<Search
						class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--dash-muted)]"
						size={17}
						strokeWidth={2.1}
						aria-hidden="true"
					/>
					<input
						type="text"
						name="SearchUsers"
						id="SearchUsers"
						class="dash-input pl-10"
						placeholder="Search people"
					/>
				</span>
			</label>
		</div>

		<div>
			{#each thread.contacts as contact (contact.id)}
				<article
					class={['dash-message-contact', contact.active && 'is-active']}
					data-contact={contact.id}
				>
					<div class="dash-message-avatar">
						<img src={contact.avatar} alt={contact.name} />
					</div>
					<div class="min-w-0">
						<p class="dash-message-name">{contact.name}</p>
						<p class="dash-message-preview truncate">{contact.preview}</p>
					</div>
					<div class="grid justify-items-end gap-1">
						<p class="dash-message-time">{contact.time}</p>
						{#if contact.badge}
							<span class="dash-message-badge">{contact.badge}</span>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</aside>

	<div class="dash-chat">
		<header class="dash-chat__head">
			<div class="flex min-w-0 items-center gap-3">
				<div class="dash-message-avatar">
					<img src={thread.activeContact.avatar} alt={thread.activeContact.name} />
				</div>
				<div class="min-w-0">
					<p class="m-0 truncate text-base font-black text-[var(--dash-heading)]">
						{thread.activeContact.name}
					</p>
					<p class="m-0 truncate text-sm font-bold text-[var(--dash-muted)]">
						{thread.activeContact.email}
					</p>
				</div>
			</div>
			<a
				href={resolve(thread.contextHref)}
				class="dash-icon-button"
				aria-label="Open conversation context"
			>
				<MoreHorizontal size={18} strokeWidth={2.1} aria-hidden="true" />
			</a>
		</header>

		<div class="dash-chat__body">
			{#each thread.messages as message, index (message.id)}
				{#if index === thread.messages.length - 1}
					<div class="my-2 flex items-center gap-3 text-xs font-black text-[var(--dash-muted)]">
						<span class="h-px flex-1 bg-[var(--dash-border)]"></span>
						Today
						<span class="h-px flex-1 bg-[var(--dash-border)]"></span>
					</div>
				{/if}
				<div class={['dash-bubble', message.sent && 'is-sent']}>
					<div class="dash-bubble__text">{message.text}</div>
					<p class="m-0 text-xs font-bold text-[var(--dash-muted)]">{message.time}</p>
				</div>
			{/each}
		</div>

		<div class="dash-chat__composer">
			<div class="relative min-w-0 flex-1">
				<input type="text" placeholder="Add a message..." class="dash-input pr-11" />
				<button
					type="button"
					class="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-primary)]"
					aria-label="Attach file"
				>
					<Paperclip size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
			</div>
			<button type="button" class="dash-primary-button min-w-10 px-0" aria-label="Send message">
				<Send size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
		</div>
	</div>
</section>
