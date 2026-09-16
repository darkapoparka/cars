<script lang="ts">
	export type DayNightFooterIconName =
		| 'car-lot'
		| 'facebook'
		| 'instagram'
		| 'location'
		| 'phone'
		| 'search'
		| 'tiktok';

	let { name }: { name: DayNightFooterIconName } = $props();
</script>

{#if name === 'search'}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'facebook'}
	<img
		class="block size-5 object-contain"
		src="/assets/icons/facebook.svg"
		alt=""
		aria-hidden="true"
		width="20"
		height="20"
	/>
{:else if name === 'instagram'}
	<img
		class="block size-5 object-contain"
		src="/assets/icons/instagram-official-gradient.svg"
		alt=""
		aria-hidden="true"
		width="20"
		height="20"
	/>
{:else if name === 'tiktok'}
	<img
		class="block size-5 object-contain"
		src="/assets/icons/tiktok-official-circle.png"
		alt=""
		aria-hidden="true"
		loading="lazy"
		decoding="async"
	/>
{:else if name === 'phone'}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'car-lot'}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M5 17H3.8C3.35817 17 3 16.6418 3 16.2V13.28C3 12.4108 3.56096 11.6411 4.38835 11.374L6.25 10.7738L8.00478 6.84909C8.32737 6.1278 9.04394 5.66333 9.83409 5.66333H14.1659C14.9561 5.66333 15.6726 6.1278 15.9952 6.84909L17.75 10.7738L19.6117 11.374C20.439 11.6411 21 12.4108 21 13.28V16.2C21 16.6418 20.6418 17 20.2 17H19"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M6.25 10.75H17.75"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M8.5 17C8.5 18.1046 7.60457 19 6.5 19C5.39543 19 4.5 18.1046 4.5 17C4.5 15.8954 5.39543 15 6.5 15C7.60457 15 8.5 15.8954 8.5 17Z"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 17C19.5 18.1046 18.6046 19 17.5 19C16.3954 19 15.5 18.1046 15.5 17C15.5 15.8954 16.3954 15 17.5 15C18.6046 15 19.5 15.8954 19.5 17Z"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/if}
