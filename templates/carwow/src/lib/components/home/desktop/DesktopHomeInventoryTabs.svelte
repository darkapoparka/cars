<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { desktopHomeInventoryPills } from './desktop-home-inventory-data';
	import '$lib/styles/desktop-discovery.css';
</script>

<div class="daynight-home-inventory__pills">
	{#each desktopHomeInventoryPills as pill (pill.href)}
		<a
			class={['daynight-home-inventory__pill desktop-discovery-chip', pill.isActive && 'is-active']}
			href={i18n.href(resolve(pill.href))}
			aria-current={pill.isActive ? 'page' : undefined}
		>
			<span>{i18n.text(pill.label)}</span>
		</a>
	{/each}
</div>

<style>
	:global(body.daynight-home-page .daynight-home-shell--original) .daynight-home-inventory__pills {
		gap: 20px !important;
		justify-content: flex-start !important;
		border-bottom: 1px solid var(--discovery-control-border);
		padding-bottom: 0 !important;
	}
</style>
