<svelte:options runes={true} />

<script lang="ts">
  import { manufacturerArtwork } from "#lib/data/manufacturer-artwork.ts";
  import { bodyTypeArtwork } from "#lib/data/body-type-artwork.ts";
  let { value, kind }: { value: string; kind: "make" | "type" } = $props();
  const make = $derived(
    kind === "make" ? manufacturerArtwork(value) : undefined,
  );
  const body = $derived(kind === "type" ? bodyTypeArtwork(value) : undefined);
  const scale = $derived(
    make
      ? Math.min(
          36 / (make.bounds[2] - make.bounds[0]),
          28 / (make.bounds[3] - make.bounds[1]),
        )
      : 1,
  );
</script>

<span
  class={["filter-artwork", kind === "type" && "body-artwork"]}
  aria-hidden="true"
>
  {#if make}
    <span
      class="mark-window"
      style:width={(make.bounds[2] - make.bounds[0]) * scale + "px"}
      style:height={(make.bounds[3] - make.bounds[1]) * scale + "px"}
    >
      <img
        src={make.image}
        alt=""
        width={make.width}
        height={make.height}
        decoding="async"
        style:width={make.width * scale + "px"}
        style:height={make.height * scale + "px"}
        style:left={-make.bounds[0] * scale + "px"}
        style:top={-make.bounds[1] * scale + "px"}
      />
    </span>
  {:else if body}
    <img
      src={body.image}
      alt=""
      width={body.width}
      height={body.height}
      decoding="async"
    />
  {:else if kind === "make" && value}
    <span class="mark-fallback desktop-type-badge">{value.slice(0, 2)}</span>
  {:else}
    <svg width="48" height="28" viewBox="0 0 64 32" fill="none"
      ><path
        d="M9 21v-7l7-2 7-7h19l9 9 5 2v5H9Zm11-9h24M31 5v7"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      /><circle
        cx="19"
        cy="23"
        r="4"
        fill="white"
        stroke="currentColor"
        stroke-width="1.5"
      /><circle
        cx="47"
        cy="23"
        r="4"
        fill="white"
        stroke="currentColor"
        stroke-width="1.5"
      /></svg
    >
  {/if}
</span>

<style>
  .filter-artwork {
    display: grid;
    place-items: center;
    width: 42px;
    height: 36px;
    flex-shrink: 0;
  }
  .mark-window {
    position: relative;
    display: block;
    overflow: hidden;
  }
  .mark-window img {
    position: absolute;
    max-width: none;
  }
  .body-artwork {
    width: 112px;
    height: 56px;
  }
  .body-artwork > img {
    display: block;
    width: 112px;
    height: 56px;
    object-fit: contain;
  }
  .mark-fallback {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bs-neutral-100, #f5f5f5);
    font-size: 12px;
    font-weight: 600;
  }
</style>
