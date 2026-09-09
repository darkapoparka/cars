<script lang="ts">
	type Props = {
		json: string;
	};

	let { json }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is serialized and escaped by the route owner. -->
{@html `<script type="application/ld+json">${json}<` + `/script>`}
