<script lang="ts">
	import { enhance } from '$app/forms';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const emailValue = $derived(form && 'email' in form ? form.email : '');
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<main id="main-content" tabindex="-1" class="admin-login-shell">
	<section class="admin-login-panel" aria-labelledby="admin-login-title">
		<div class="admin-login-context">
			<img
				class="admin-login-banner-image"
				src="/assets/images/admin/cms-login-banner.png"
				alt=""
				aria-hidden="true"
			/>
			<div class="admin-login-banner-shade"></div>

			<p class="admin-login-brand">Admin</p>

			<div class="admin-login-copy">
				<p>Protected workspace</p>
				<h1 id="admin-login-title">Operations dashboard</h1>
				<span
					>Inventory, imports, leads, and customer conversations in one protected workspace.</span
				>
			</div>
		</div>

		<div class="admin-login-form-panel">
			<div class="admin-login-form-header">
				<span class="admin-login-secure">
					<ShieldCheck size={16} strokeWidth={2.2} />
					Secure staff access
				</span>
				<h2>Welcome back</h2>
				<p>Use <strong>admin</strong> or a staff email to enter the CMS.</p>
			</div>

			<form
				method="POST"
				action={`?/login&redirectTo=${encodeURIComponent(data.redirectTo)}`}
				use:enhance
			>
				{#if form?.error}
					<p class="admin-login-error">{form.error}</p>
				{/if}

				<label>
					<span>Username or email</span>
					<div class="admin-login-field">
						<input
							name="email"
							type="text"
							inputmode="email"
							autocomplete="username"
							placeholder="admin"
							value={emailValue}
							required
						/>
					</div>
				</label>

				<label>
					<span>Password</span>
					<div class="admin-login-field">
						<input
							name="password"
							type="password"
							autocomplete="current-password"
							placeholder="Enter password"
							required
						/>
					</div>
				</label>

				<button type="submit">
					<span>Open dashboard</span>
					<ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
				</button>
			</form>
		</div>
	</section>
</main>
