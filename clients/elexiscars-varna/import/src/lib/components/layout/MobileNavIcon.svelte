<script lang="ts">
	import Car01Icon from '@hugeicons/core-free-icons/Car01Icon';
	import Globe02Icon from '@hugeicons/core-free-icons/Globe02Icon';
	import Home03Icon from '@hugeicons/core-free-icons/Home03Icon';
	import Menu01Icon from '@hugeicons/core-free-icons/Menu01Icon';
	import SaleTag02Icon from '@hugeicons/core-free-icons/SaleTag02Icon';
	let { name }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu' } = $props();
	const icons = {
		home: Home03Icon,
		cars: Car01Icon,
		sell: SaleTag02Icon,
		import: Globe02Icon,
		menu: Menu01Icon
	} as const;
	// Render the existing icon data with Svelte so paths survive hydration and route changes.
	const svgAttributes = (attributes: Readonly<Record<string, string | number>>) => ({
		...Object.fromEntries(
			Object.entries(attributes).map(([key, value]) => [
				key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
				value
			])
		),
		'stroke-width': 1.75
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	aria-hidden="true"
>
	{#each icons[name] as [tag, attributes], index (index)}
		<svelte:element this={tag} {...svgAttributes(attributes)} />
	{/each}
</svg>
