<script lang="ts">
	type IconName =
		| 'account'
		| 'chevron-down'
		| 'compare'
		| 'facebook'
		| 'heart'
		| 'instagram'
		| 'location'
		| 'phone'
		| 'plus-circle'
		| 'search'
		| 'tiktok-header';

	let {
		name,
		stroke = 'currentColor',
		class: className = ''
	}: { name: IconName; stroke?: string; class?: string } = $props();

	const outlineClass = $derived(['site-chrome-outline-icon', className].filter(Boolean).join(' '));
</script>

{#if name === 'chevron-down'}
	<svg
		class={className}
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 6L8 10L12 6"
			{stroke}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'search'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-4.05-4.05" />
	</svg>
{:else if name === 'account'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21a8 8 0 0 1 16 0" />
	</svg>
{:else if name === 'plus-circle'}
	<svg
		class={outlineClass}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 8v8M8 12h8" />
	</svg>
{:else if name === 'compare'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M16.5 13.5L19.5 16.5L16.5 19.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 16.5H19.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M7.5 10.5L4.5 7.5L7.5 4.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 7.5H4.5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'heart'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'phone'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"
		/>
	</svg>
{:else if name === 'location'}
	<svg
		class={outlineClass}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
		<circle cx="12" cy="10" r="2.5" />
	</svg>
{:else if name === 'facebook'}
	<img
		class="block size-6 object-contain"
		src="/assets/icons/facebook.svg"
		alt=""
		aria-hidden="true"
		width="24"
		height="24"
	/>
{:else if name === 'instagram'}
	<img
		class="block size-6 object-contain"
		src="/assets/icons/instagram-official-gradient.svg"
		alt=""
		aria-hidden="true"
		width="24"
		height="24"
	/>
{:else if name === 'tiktok-header'}
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M12.08 3.25C12.31 5.07 13.35 6.14 15.08 6.26V8.11C14.08 8.2 13.21 7.88 12.13 7.23V10.75C12.13 15.22 7.25 16.62 5.3 13.42C4.05 11.36 4.82 7.75 8.83 7.61V9.56C8.5 9.61 8.15 9.69 7.83 9.8C6.87 10.12 6.33 10.72 6.48 11.79C6.77 13.84 10.53 14.45 10.22 10.44V3.25H12.08Z"
			fill="currentColor"
		/>
	</svg>
{/if}

<style>
	.site-chrome-outline-icon,
	.site-chrome-outline-icon :global(*) {
		fill: none !important;
		stroke: currentColor !important;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8px;
	}
</style>
