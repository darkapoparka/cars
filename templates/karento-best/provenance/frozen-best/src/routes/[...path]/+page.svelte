<script lang="ts">
  import CapturedPage from '../../lib/components/CapturedPage.svelte';
  import type { CapturedPageData } from '../../lib/page-types';
  let { data }: { data: { page: CapturedPageData } } = $props();
</script>

<CapturedPage page={data.page} />
