<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Info from '@lucide/svelte/icons/info';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type Props = {
		tone?: 'error' | 'success' | 'notice';
		class?: string;
		children: Snippet;
	};

	let { tone = 'notice', class: className, children }: Props = $props();

	const Icon = $derived(
		tone === 'error' ? AlertTriangle : tone === 'success' ? CheckCircle2 : Info
	);
	const toneClass = $derived(
		tone === 'error'
			? 'border-destructive/20 bg-destructive/10 text-destructive'
			: tone === 'success'
				? 'border-primary/15 bg-primary/5 text-foreground'
				: 'border-border bg-muted/60 text-foreground'
	);
</script>

<div
	class={cn(
		'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium',
		toneClass,
		className
	)}
>
	<Icon class="mt-0.5 shrink-0" aria-hidden="true" />
	<div class="min-w-0">{@render children()}</div>
</div>
