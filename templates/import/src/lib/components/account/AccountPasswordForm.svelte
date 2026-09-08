<script lang="ts">
	import { KeyRound, Save } from '@lucide/svelte';
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';

	let { password }: { password: AuxeroAccountPasswordFormData } = $props();

	let status = $state('');

	const changePassword = (event: SubmitEvent) => {
		event.preventDefault();
		status = 'Password change recorded locally';
	};
</script>

<form
	action="#"
	class="dash-form"
	novalidate
	data-daynight-password-form
	onsubmit={changePassword}
>
	<input type="hidden" name="role" value={password.role} />
	<input type="hidden" name="actorRole" value={password.role} />

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Change password</h2>
				<p class="dash-card__subtitle">Update the dashboard login password for this account.</p>
			</div>
			<KeyRound class="text-[var(--dash-primary)]" size={22} strokeWidth={2.1} aria-hidden="true" />
		</div>
		<div class="dash-card__body dash-form-grid dash-form-grid--2">
			<label class="dash-field" for="Email">
				<span class="dash-label">Your email*</span>
				<input
					class="dash-input"
					type="email"
					value={password.email}
					id="Email"
					name="Email"
					placeholder="Your email"
					required
				/>
			</label>
			<label class="dash-field" for="OldPassword">
				<span class="dash-label">Old password*</span>
				<input
					class="dash-input"
					type="password"
					value=""
					id="OldPassword"
					name="OldPassword"
					placeholder="Old password"
					required
				/>
			</label>
			<label class="dash-field" for="NewPassword">
				<span class="dash-label">New password*</span>
				<input
					class="dash-input"
					type="password"
					value=""
					id="NewPassword"
					name="NewPassword"
					placeholder="New password"
					required
				/>
			</label>
			<label class="dash-field" for="RetypeNewPassword">
				<span class="dash-label">Retype new password*</span>
				<input
					class="dash-input"
					type="password"
					value=""
					id="RetypeNewPassword"
					name="RetypeNewPassword"
					placeholder="Retype new password"
					required
				/>
			</label>
		</div>
	</section>

	<div class="flex justify-end">
		<button type="submit" class="dash-primary-button">
			<Save size={17} strokeWidth={2.1} aria-hidden="true" />
			Change Password
		</button>
	</div>
	<p class="m-0 min-h-5 text-sm font-black text-[#0f9f7a]" aria-live="polite">{status}</p>
</form>
