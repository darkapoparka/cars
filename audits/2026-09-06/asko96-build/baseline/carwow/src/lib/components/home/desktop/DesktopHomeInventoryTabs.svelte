<script lang="ts">
	import { resolve } from '$app/paths';
	import { desktopHomeInventoryPills } from './desktop-home-inventory-data';
	import DesktopHomeInventoryPillIcon from './DesktopHomeInventoryPillIcon.svelte';
</script>

<div class="daynight-home-inventory__pills">
	{#each desktopHomeInventoryPills as pill (pill.href)}
		<a
			class={['daynight-home-inventory__pill', pill.isActive && 'is-active']}
			href={resolve(pill.href)}
			aria-current={pill.isActive ? 'page' : undefined}
		>
			<DesktopHomeInventoryPillIcon icon={pill.icon} />
			<span>{pill.label}</span>
		</a>
	{/each}
</div>

<style>
	:global(body.daynight-home-page) .daynight-home-inventory__pills {
		gap: 8px !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill {
		background: #fff !important;
		background-image: none !important;
		border: 1px solid #d7dee8 !important;
		border-radius: 999px !important;
		box-shadow: none !important;
		color: #344054 !important;
		font-size: 14px !important;
		font-weight: 600 !important;
		gap: 7px !important;
		min-height: 38px !important;
		padding: 0 13px !important;
		transform: none !important;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill:hover {
		background: #fff !important;
		border-color: #98a2b3 !important;
		box-shadow: none !important;
		color: #101828 !important;
		transform: none !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill.is-active {
		background: #111827 !important;
		background-image: none !important;
		border-color: #111827 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill.is-active:hover {
		background: #252b35 !important;
		border-color: #252b35 !important;
		box-shadow: none !important;
		color: #fff !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill:focus-visible {
		outline: 2px solid #c91620 !important;
		outline-offset: 2px !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill :global(svg) {
		height: 14px !important;
		opacity: 0.78;
		width: 24px !important;
	}

	:global(body.daynight-home-page) .daynight-home-inventory__pill.is-active :global(svg) {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(body.daynight-home-page) .daynight-home-inventory__pill {
			transition: none !important;
		}
	}
</style>
