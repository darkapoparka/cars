<script lang="ts">
 import type { PageData } from './$types';
 let { data }: { data: PageData } = $props();
</script>

<svelte:head>
 <!-- Build-owned snapshots only; never pass request/user HTML to this boundary. -->
 {@html data.head}
</svelte:head>

<!-- Keep the original document structure until the component migration. -->
{@html data.body}
