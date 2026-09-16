<script lang="ts">
	let { bodyClasses }: { bodyClasses: string[] } = $props();

	const classList = $derived(Array.from(new Set(bodyClasses.filter(Boolean))));

	$effect(() => {
		if (classList.length) {
			document.body.classList.add(...classList);
		}

		return () => {
			if (classList.length) {
				document.body.classList.remove(...classList);
			}
		};
	});
</script>
