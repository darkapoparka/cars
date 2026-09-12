<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';

	let { slug }: { slug: string } = $props();
</script>

<a href={resolve('/inventory/[slug]', { slug })} class="view-details">
	Виж детайли<img class="ml-4" src="/variant-3/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
</a>
