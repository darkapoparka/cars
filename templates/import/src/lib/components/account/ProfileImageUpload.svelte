<script lang="ts">
	import type { Snippet } from 'svelte';
	import Action from '$lib/components/common/Action.svelte';
	let {
		image,
		kind,
		english,
		children
	}: { image: string; kind: 'avatar' | 'poster'; english: boolean; children?: Snippet } = $props();
	const id = $props.id();
	let input = $state<HTMLInputElement>();
	let preview = $state('');
	let fileName = $state('');
	let error = $state('');
	const label = $derived(
		kind === 'avatar'
			? english
				? 'Change photo'
				: 'Промени снимката'
			: english
				? 'Change banner'
				: 'Промени банера'
	);
	const selectImage = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		error = '';
		if (
			!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type) ||
			file.size > 4 * 1024 * 1024
		) {
			error = english ? 'Choose a PNG, JPG or SVG under 4 MB.' : 'Избери PNG, JPG или SVG до 4 MB.';
			target.value = '';
			return;
		}
		fileName = file.name;
		const reader = new FileReader();
		reader.onload = () => {
			if (target.files?.[0] === file && typeof reader.result === 'string') preview = reader.result;
		};
		reader.readAsDataURL(file);
	};
</script>

<div
	class="profile-image-upload"
	class:profile-image-upload--poster={kind === 'poster'}
	data-profile-image-upload={kind}
>
	<img
		src={preview || image}
		alt={kind === 'avatar'
			? english
				? 'Profile photo'
				: 'Профилна снимка'
			: english
				? 'Profile banner'
				: 'Банер на профила'}
	/>
	<div class="profile-image-upload__content">
		{@render children?.()}
		<Action variant="quiet" size="compact" onclick={() => input?.click()} aria-controls={id}
			>{label}</Action
		>
		<input
			bind:this={input}
			{id}
			type="file"
			accept="image/png,image/jpeg,image/svg+xml"
			aria-label={label}
			onchange={selectImage}
			class="sr-only"
			tabindex="-1"
		/>
		{#if fileName}<small>{fileName}</small>{/if}
		{#if error}<p class="site-form-error" role="alert">{error}</p>{/if}
	</div>
</div>

<style>
	.profile-image-upload {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr);
		align-items: center;
		gap: var(--bc-space-4);
	}
	.profile-image-upload > img {
		width: 64px;
		height: 64px;
		border-radius: var(--bc-radius-pill);
		object-fit: cover;
	}
	.profile-image-upload__content {
		min-width: 0;
	}
	.profile-image-upload :global(.site-action) {
		justify-content: flex-start;
		padding-inline: 0;
		font-size: var(--bc-mobile-label);
		font-weight: var(--bc-weight-body);
		line-height: 1.4;
		text-decoration: underline;
		text-underline-offset: 3px;
		height: auto;
		white-space: normal;
	}
	small {
		display: block;
		color: var(--bc-muted);
		font-size: 14px;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	.profile-image-upload--poster {
		grid-template-columns: minmax(0, 1fr);
		gap: var(--bc-space-2);
	}
	.profile-image-upload--poster > img {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 6;
		border-radius: var(--bc-radius-card);
	}
</style>
