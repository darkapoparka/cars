<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted raw template fragment with legacy widgets prepared by server helpers -->
{@html html}
