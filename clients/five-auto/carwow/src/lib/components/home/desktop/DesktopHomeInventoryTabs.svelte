<script lang="ts">
	import { resolve } from '$app/paths';
	import { desktopHomeInventoryPills } from './desktop-home-inventory-data';
	import '$lib/styles/desktop-discovery.css';
</script>

<div class="daynight-home-inventory__pills">
	{#each desktopHomeInventoryPills as pill (pill.href)}
		<a
			class={['daynight-home-inventory__pill desktop-discovery-chip', pill.isActive && 'is-active']}
			href={resolve(pill.href)}
			aria-current={pill.isActive ? 'page' : undefined}
		>
			<span>{pill.label}</span>
		</a>
	{/each}
</div>

<style>
	:global(body.daynight-home-page) .daynight-home-inventory__pills {
		gap: 8px !important;
	}
</style>
