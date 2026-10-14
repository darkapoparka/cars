<script lang="ts">
	import { page } from '$app/state';
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';
	import { daynightContact } from '$lib/config/dealer';
	import { linkHref } from '$lib/utils/links';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Action from '$lib/components/common/Action.svelte';
	import ProfileImageUpload from './ProfileImageUpload.svelte';
	let { profile, english }: { profile: AuxeroAccountProfileFormData; english: boolean } = $props();
	const id = $props.id();
	let pending = $state(false);
	let status = $state('');
	let failed = $state(false);
	const fields = $derived([
		{
			name: 'first_name',
			label: english ? 'First name' : 'Име',
			value: profile.firstName,
			type: 'text',
			autocomplete: 'given-name'
		},
		{
			name: 'last_name',
			label: english ? 'Last name' : 'Фамилия',
			value: profile.lastName,
			type: 'text',
			autocomplete: 'family-name'
		},
		{
			name: 'Phone',
			label: english ? 'Phone' : 'Телефон',
			value: profile.phone,
			type: 'tel',
			autocomplete: 'tel'
		},
		{
			name: 'EmailAddress',
			label: english ? 'Email' : 'Имейл',
			value: profile.email,
			type: 'email',
			autocomplete: 'email'
		}
	] as const);
	const roleLabel = $derived(
		english
			? { customer: 'Customer', agent: 'Agent', admin: 'Admin' }[profile.role]
			: profile.roleLabel
	);
	const save = async (event: SubmitEvent) => {
		event.preventDefault();
		if (pending) return;
		pending = true;
		status = '';
		failed = false;
		try {
			const response = await fetch(linkHref('/api/account/profile'), {
				method: 'POST',
				headers: page.data.preview ? { 'x-daynight-prototype-role': profile.role } : undefined,
				body: new FormData(event.currentTarget as HTMLFormElement)
			});
			if (!response.ok) throw new Error('Profile save failed');
			status = english ? 'Saved in this demo profile.' : 'Запазено в този демо профил.';
		} catch {
			failed = true;
			status = english ? 'Could not save. Try again.' : 'Не успяхме да запазим. Опитай отново.';
		} finally {
			pending = false;
		}
	};
</script>

<form
	class="mobile-profile-form site-form"
	method="POST"
	onsubmit={save}
	data-mobile-profile-form
	aria-busy={pending}
>
	<input type="hidden" name="role" value={profile.role} />
	<input type="hidden" name="actorRole" value={profile.role} />
	<section class="profile-section profile-core">
		<ProfileImageUpload image={profile.avatarImage} kind="avatar" {english}>
			<p class="profile-name">{profile.firstName} {profile.lastName}</p>
			<p class="profile-role">{roleLabel}</p>
		</ProfileImageUpload>
		<div class="site-fields">
			{#each fields as field (field.name)}
				<label class="site-field" for={id + field.name}>
					<span>{field.label}</span>
					<input
						id={id + field.name}
						name={field.name}
						type={field.type}
						autocomplete={field.autocomplete}
						value={field.value}
						required
					/>
				</label>
			{/each}
		</div>
	</section>
	<div class="profile-section profile-extras">
		<details>
			<summary
				>{english ? 'More about you' : 'Допълнителни данни'}<ChevronDown
					size={20}
					aria-hidden="true"
				/></summary
			>
			<div class="site-fields profile-details-fields">
				<label class="site-field" for={id + '-company'}
					><span>{english ? 'Company' : 'Компания'}</span><input
						id={id + '-company'}
						name="Company"
						value={profile.company}
						autocomplete="organization"
					/></label
				>
				<label class="site-field" for={id + '-description'}
					><span>{english ? 'About you' : 'Описание'}</span><textarea
						id={id + '-description'}
						name="message"
						rows="3"
						value={profile.description}
					></textarea></label
				>
				<label class="site-field" for={id + '-contact-phone'}
					><span>{english ? 'Contact phone' : 'Телефон за контакт'}</span><input
						id={id + '-contact-phone'}
						name="SalesPhone"
						type="tel"
						value={profile.marketplacePhone}
					/></label
				>
				<label class="site-field" for={id + '-gender'}
					><span>{english ? 'Gender' : 'Пол'}</span><select
						id={id + '-gender'}
						name="Gender"
						value={profile.gender}
						><option value="Male">{english ? 'Male' : 'Мъж'}</option><option value="Female"
							>{english ? 'Female' : 'Жена'}</option
						></select
					></label
				>
				<label class="site-field" for={id + '-birth-date'}
					><span>{english ? 'Date of birth' : 'Дата на раждане'}</span><input
						id={id + '-birth-date'}
						name="DayofBirth"
						type="date"
						value={profile.birthDate}
					/></label
				>
				<div class="site-field">
					<span>{english ? 'Profile banner' : 'Банер на профила'}</span><ProfileImageUpload
						image={profile.posterImage}
						kind="poster"
						{english}
					/>
				</div>
			</div>
		</details>
		<details>
			<summary
				>{english ? 'Social links' : 'Социални мрежи'}<ChevronDown
					size={20}
					aria-hidden="true"
				/></summary
			>
			<div class="site-fields profile-details-fields">
				{#each profile.socialLinks as link (link.id)}
					<label class="site-field" for={id + link.id}
						><span
							>{link.id === 'xUrl' ? 'X' : link.name[0].toUpperCase() + link.name.slice(1)}</span
						><input
							id={id + link.id}
							name={link.name}
							value={link.value}
							placeholder="URL"
						/></label
					>
				{/each}
			</div>
		</details>
		<details>
			<summary>{english ? 'Address' : 'Адрес'}<ChevronDown size={20} aria-hidden="true" /></summary>
			<div class="site-fields profile-details-fields">
				<label class="site-field" for={id + '-address'}
					><span>{english ? 'Full address' : 'Пълен адрес'}</span><input
						id={id + '-address'}
						name="PriceListing"
						value={profile.address}
						autocomplete="street-address"
					/></label
				>
				<label class="site-field" for={id + '-location'}
					><span>{english ? 'Map location' : 'Местоположение на картата'}</span><select
						id={id + '-location'}
						name="SelectLocation"
						>{#each profile.mapOptions as option (option)}<option value={option}>{option}</option
							>{/each}</select
					></label
				>
				<iframe
					src={daynightContact.mapEmbedUrl}
					title={profile.address}
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
		</details>
	</div>
	<div class="profile-save">
		<p class="site-form-note">
			{english ? 'Demo profile · changes stay local.' : 'Демо профил · промените са локални.'}
		</p>
		<Action type="submit" size="primary" disabled={pending}
			>{pending
				? english
					? 'Saving…'
					: 'Запазване…'
				: english
					? 'Save changes'
					: 'Запази промените'}</Action
		>
		{#if status}<p class:site-form-error={failed} role="status">{status}</p>{/if}
	</div>
</form>

<style>
	.mobile-profile-form {
		min-width: 0;
		gap: var(--bc-space-4);
		font-family: var(--bc-font-body);
	}
	.profile-section {
		min-width: 0;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-white);
		padding: var(--bc-space-4);
	}
	.profile-core {
		display: grid;
		gap: var(--bc-space-6);
	}
	.profile-name {
		margin: 0;
		color: var(--bc-ink);
		font: var(--bc-weight-heading) var(--bc-mobile-card-title)/1.3 var(--bc-font-body);
		overflow-wrap: anywhere;
	}
	.profile-role {
		margin: var(--bc-space-1) 0 0;
		color: var(--bc-muted);
		font-size: 14px;
		line-height: 1.4;
	}
	.site-fields {
		grid-template-columns: minmax(0, 1fr);
	}
	.mobile-profile-form input:not([type='hidden']),
	.mobile-profile-form select,
	.mobile-profile-form textarea {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		padding: var(--bc-space-3);
		background: var(--bc-control);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		font-size: var(--bc-mobile-body);
		line-height: 1.4;
	}
	.mobile-profile-form input:not([type='hidden']),
	.mobile-profile-form select {
		height: var(--bc-control-height-chip);
		min-height: var(--bc-control-height-chip);
		padding-block: 0;
		font-size: var(--bc-text-control);
		line-height: var(--bc-leading-control);
	}
	.site-field > span {
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
		line-height: 1.4;
		font-weight: var(--bc-weight-body);
	}
	.profile-extras {
		padding-block: 0;
	}
	details + details {
		border-top: 1px solid var(--bc-border);
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		min-height: 56px;
		padding-block: var(--bc-space-3);
		cursor: pointer;
		list-style: none;
		font-size: var(--bc-mobile-body);
		font-weight: var(--bc-weight-heading);
		line-height: 1.4;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary :global(svg) {
		flex: none;
	}
	details[open] summary :global(svg) {
		transform: rotate(180deg);
	}
	.profile-details-fields {
		padding-bottom: var(--bc-space-4);
	}
	iframe {
		width: 100%;
		height: 184px;
		border: 0;
		border-radius: var(--bc-radius-card);
	}
	.profile-save {
		display: grid;
		gap: var(--bc-space-3);
	}
	.profile-save :global(.site-action) {
		height: auto;
		min-width: 0;
		padding-block: var(--bc-space-3);
		white-space: normal;
		line-height: 1.4;
	}
	.profile-save > p {
		margin: 0;
		line-height: 1.4;
	}
</style>
