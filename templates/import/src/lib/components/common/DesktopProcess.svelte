<script lang="ts">
	import ProcessSteps from './ProcessSteps.svelte';
	let { steps }: { steps: readonly { title: string; text: string; mobileText?: string }[] } =
		$props();
</script>

<ProcessSteps {steps} horizontal editorial />
