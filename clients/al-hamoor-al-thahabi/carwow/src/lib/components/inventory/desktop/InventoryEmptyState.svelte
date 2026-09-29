<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	let { isEmpty = false }: { isEmpty?: boolean } = $props();
</script>

<p
	class={['daynight-inventory-empty', { 'is-visible': isEmpty }]}
	aria-live="polite"
	hidden={!isEmpty}
>
	{i18n.t('copy.90f2d6e8b6e8')}
</p>
