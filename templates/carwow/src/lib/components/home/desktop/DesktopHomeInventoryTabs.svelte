<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { desktopHomeInventoryPills } from './desktop-home-inventory-data';
	import '$lib/styles/desktop-discovery.css';
</script>

<div class="daynight-home-inventory__pills" role="group" aria-label={i18n.t('copy.0ff4d985dee2')}>
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
