<script lang="ts">
	import { resolve } from '$app/paths';

	let { slug }: { slug: string } = $props();
</script>

<a href={resolve('/inventory/[slug]', { slug })} class="view-details">
	View details<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
</a>
