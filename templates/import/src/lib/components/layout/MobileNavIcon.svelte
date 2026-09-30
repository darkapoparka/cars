<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
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
</script>

<HugeiconsIcon icon={icons[name]} size={24} color="currentColor" strokeWidth={1.75} />
