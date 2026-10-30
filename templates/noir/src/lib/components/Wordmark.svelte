<script lang="ts">
  import { site } from "#lib/config/site.ts";

  let { size = "1rem" }: { size?: string } = $props();
</script>

<span class="wordmark" style:font-size={size} aria-hidden="true">
  {site.wordmark[0]}<span class="amp">&amp;</span>{site.wordmark[1]}
</span>

<style>
  .wordmark {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35em;
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Pull the ampersand back over the trailing letter-spacing of the first word. */
  .amp {
    margin-left: -0.18em;
    color: var(--accent);
    letter-spacing: 0;
  }
</style>
