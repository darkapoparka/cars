<script lang="ts">
	let { isEmpty = false }: { isEmpty?: boolean } = $props();
</script>

<p
	class={['daynight-inventory-empty', { 'is-visible': isEmpty }]}
	aria-live="polite"
	hidden={!isEmpty}
>
	Няма автомобили по избраните филтри.
</p>
