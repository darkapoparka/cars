<script lang="ts">
	import { MapPin, Save, Upload } from '@lucide/svelte';
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';

	let { profile }: { profile: AuxeroAccountProfileFormData } = $props();

	let status = $state('');
	let primarySocialLinks = $derived(profile.socialLinks.slice(0, 3));
	let secondarySocialLinks = $derived(profile.socialLinks.slice(3));

	const saveProfile = (event: SubmitEvent) => {
		event.preventDefault();
		status = `Profile saved locally for ${profile.firstName} ${profile.lastName}`;
	};
</script>

<form action="#" class="dash-form" novalidate data-daynight-profile-form onsubmit={saveProfile}>
	<input type="hidden" name="role" value={profile.role} />
	<input type="hidden" name="actorRole" value={profile.role} />

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Account role</h2>
				<p class="dash-card__subtitle">{profile.roleNote}</p>
			</div>
			<span class="dash-role-pill">{profile.roleLabel}</span>
		</div>
		<div class="dash-card__body dash-form-grid dash-form-grid--2">
			<div class="dash-field">
				<span class="dash-label">Avatar</span>
				<div class="flex flex-wrap items-center gap-4">
					<div class="dash-upload__preview dash-upload__preview--avatar">
						<img src={profile.avatarImage} alt="Avatar Preview" />
					</div>
					<div class="grid gap-2">
						<label class="dash-secondary-button cursor-pointer" for="avatarInput">
							<Upload size={17} strokeWidth={2.1} aria-hidden="true" />
							Choose avatar
						</label>
						<input
							type="file"
							id="avatarInput"
							accept="image/png,image/jpeg,image/jpg,image/svg+xml"
							class="hidden"
						/>
						<span class="text-xs font-bold text-[var(--dash-muted)]"
							>PNG, JPG or SVG up to 4 MB</span
						>
					</div>
				</div>
			</div>

			<div class="dash-field">
				<span class="dash-label">Dealer poster</span>
				<div class="dash-upload__preview dash-upload__preview--poster">
					<img src={profile.posterImage} alt="Dealer Poster Preview" />
				</div>
				<label class="dash-secondary-button mt-3 w-fit cursor-pointer" for="posterInput">
					<Upload size={17} strokeWidth={2.1} aria-hidden="true" />
					Choose poster
				</label>
				<input
					type="file"
					id="posterInput"
					accept="image/png,image/jpeg,image/jpg,image/svg+xml"
					class="hidden"
				/>
			</div>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Information</h2>
				<p class="dash-card__subtitle">Profile details used by the dashboard and sales pages.</p>
			</div>
		</div>
		<div class="dash-card__body dash-form-grid dash-form-grid--4">
			<label class="dash-field" for="first_name">
				<span class="dash-label">First name*</span>
				<input
					class="dash-input"
					type="text"
					name="first_name"
					id="first_name"
					value={profile.firstName}
					placeholder="First name"
				/>
			</label>
			<label class="dash-field" for="last_name">
				<span class="dash-label">Last name*</span>
				<input
					class="dash-input"
					type="text"
					name="last_name"
					id="last_name"
					value={profile.lastName}
					placeholder="Last name"
				/>
			</label>
			<label class="dash-field md:col-span-2" for="message">
				<span class="dash-label">Description*</span>
				<textarea class="dash-textarea" rows="4" name="message" id="message" required
					>{profile.description}</textarea
				>
			</label>
			<label class="dash-field" for="Phone">
				<span class="dash-label">Phone*</span>
				<input class="dash-input" type="text" name="Phone" id="Phone" value={profile.phone} />
			</label>
			<label class="dash-field" for="SalesPhone">
				<span class="dash-label">Sales phone*</span>
				<input
					class="dash-input"
					type="text"
					name="SalesPhone"
					id="SalesPhone"
					value={profile.marketplacePhone}
				/>
			</label>
			<label class="dash-field" for="EmailAddress">
				<span class="dash-label">Email address*</span>
				<input
					class="dash-input"
					type="text"
					name="EmailAddress"
					id="EmailAddress"
					value={profile.email}
				/>
			</label>
			<label class="dash-field" for="Company">
				<span class="dash-label">Company*</span>
				<input class="dash-input" type="text" name="Company" id="Company" value={profile.company} />
			</label>
			<label class="dash-field" for="Gender">
				<span class="dash-label">Gender*</span>
				<select class="dash-select" name="Gender" id="Gender" value={profile.gender}>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
			</label>
			<label class="dash-field" for="DayofBirth">
				<span class="dash-label">Day of birth*</span>
				<input
					class="dash-input"
					type="date"
					name="DayofBirth"
					id="DayofBirth"
					value={profile.birthDate}
				/>
			</label>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Social network</h2>
				<p class="dash-card__subtitle">Links displayed on consultant and dealer surfaces.</p>
			</div>
		</div>
		<div class="dash-card__body dash-form-grid">
			<div class="dash-form-grid dash-form-grid--3">
				{#each primarySocialLinks as link (link.id)}
					<label class="dash-field" for={link.id}>
						<span class="dash-label">{link.name}</span>
						<span class="relative block">
							<img
								class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 object-contain"
								src={link.icon}
								alt=""
							/>
							<input
								class="dash-input pl-10"
								type="text"
								name={link.name}
								id={link.id}
								value={link.value}
								placeholder="URL"
							/>
						</span>
					</label>
				{/each}
			</div>
			<div class="dash-form-grid dash-form-grid--3">
				{#each secondarySocialLinks as link (link.id)}
					<label class="dash-field" for={link.id}>
						<span class="dash-label">{link.name}</span>
						<span class="relative block">
							<img
								class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 object-contain"
								src={link.icon}
								alt=""
							/>
							<input
								class="dash-input pl-10"
								type="text"
								name={link.name}
								id={link.id}
								value={link.value}
								placeholder="URL"
							/>
						</span>
					</label>
				{/each}
			</div>
		</div>
	</section>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Location</h2>
				<p class="dash-card__subtitle">Dealer address and map context.</p>
			</div>
			<MapPin class="text-[var(--dash-primary)]" size={22} strokeWidth={2.1} aria-hidden="true" />
		</div>
		<div class="dash-card__body dash-form-grid dash-form-grid--2">
			<label class="dash-field" for="ProfileAddress">
				<span class="dash-label">Full address*</span>
				<input
					class="dash-input"
					type="text"
					id="ProfileAddress"
					name="ProfileAddress"
					placeholder={profile.address}
					value={profile.address}
					required
				/>
			</label>
			<label class="dash-field" for="ProfileLocation">
				<span class="dash-label">Map location*</span>
				<select class="dash-select" id="ProfileLocation" name="ProfileLocation">
					{#each profile.mapOptions as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
			<div class="dash-field md:col-span-2">
				<span class="dash-label">Map preview</span>
				<div class="dash-map">
					<iframe
						src={profile.mapEmbedUrl}
						height="281"
						style="border:0;width: 100%;"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Promosale Varna map"
					></iframe>
				</div>
			</div>
		</div>
	</section>

	<div class="flex justify-end">
		<button type="submit" class="dash-primary-button">
			<Save size={17} strokeWidth={2.1} aria-hidden="true" />
			Save Locally
		</button>
	</div>
	<p class="m-0 min-h-5 text-sm font-black text-[#0f9f7a]" aria-live="polite">{status}</p>
</form>
