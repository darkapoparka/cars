<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data, form } = $props();
	const emailValue = $derived(
		form && 'email' in form ? String(form.email) : 'admin@eliqauto.local'
	);
</script>

<svelte:head>
	<title>Eliqauto Admin Login</title>
</svelte:head>

<main class="admin-cms bg-background text-foreground min-h-svh">
	<section class="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.72fr)]">
		<div class="bg-primary text-primary-foreground relative hidden overflow-hidden lg:block">
			<img
				src="/assets/eliqauto/cta/import-canada-banner-v2.webp"
				alt=""
				class="absolute inset-0 h-full w-full object-cover opacity-55"
			/>
			<div class="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-black/75"></div>
			<div class="relative flex h-full flex-col justify-between p-12">
				<p class="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
					Eliqauto CMS
				</p>
				<div class="max-w-xl">
					<p class="mb-3 text-sm font-medium text-white/70">Protected workspace</p>
					<h1 class="text-4xl font-semibold tracking-normal">
						Inventory, leads, imports, and team work in one place.
					</h1>
					<p class="mt-5 max-w-lg text-base leading-7 text-white/75">
						Use the admin CMS to manage Eliqauto stock, customer requests, staff assignments,
						content, and operational signals.
					</p>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center p-6">
			<Card.Root class="w-full max-w-md">
				<Card.Header>
					<div class="bg-muted mb-3 flex size-10 items-center justify-center rounded-lg">
						<ShieldCheck aria-hidden="true" />
					</div>
					<Card.Title>Welcome back</Card.Title>
					<Card.Description>Use the Eliqauto admin account to open the CMS.</Card.Description>
				</Card.Header>
				<Card.Content>
					<form
						method="POST"
						action={`?redirectTo=${encodeURIComponent(data.redirectTo)}`}
						class="grid gap-4"
					>
						{#if form?.error}
							<p
								class="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm font-medium"
							>
								{form.error}
							</p>
						{/if}

						<div class="grid gap-2">
							<Label for="admin-email">Email</Label>
							<Input
								id="admin-email"
								name="email"
								autocomplete="username"
								value={emailValue}
								required
							/>
						</div>
						<div class="grid gap-2">
							<Label for="admin-password">Password</Label>
							<Input
								id="admin-password"
								name="password"
								type="password"
								autocomplete="current-password"
								placeholder="At least 8 characters"
								required
							/>
						</div>
						<input type="hidden" name="role" value="admin" />
						<Button type="submit" class="w-full">
							Open dashboard
							<ArrowRight data-icon="inline-end" aria-hidden="true" />
						</Button>
					</form>
				</Card.Content>
				<Card.Footer class="text-muted-foreground text-sm">
					Prototype account: admin@eliqauto.local with any intentional 8+ character password.
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</main>
