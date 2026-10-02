<script lang="ts">
  import type { SocialLink, SocialPlatform } from "../data/brand";
  let {
    links,
    previewPlatforms = [],
  }: { links: SocialLink[]; previewPlatforms?: SocialPlatform[] } = $props();
  let items = $derived(
    links.length
      ? links
      : previewPlatforms.map((platform) => ({ platform, url: null })),
  );
  const platforms: Record<SocialPlatform, { label: string; glyph: string }> = {
    facebook: { label: "Facebook", glyph: "\uf39e" },
    instagram: { label: "Instagram", glyph: "\uf16d" },
    youtube: { label: "YouTube", glyph: "\uf167" },
    tiktok: { label: "TikTok", glyph: "\ue07b" },
    linkedin: { label: "LinkedIn", glyph: "\uf0e1" },
  };
</script>

{#snippet platformLabel(platform: SocialPlatform)}
  <span class="bc-social-symbol" aria-hidden="true">
    {platforms[platform].glyph}
  </span>
  <span>{platforms[platform].label}</span>
{/snippet}

<div class="bc-social-links" role="group" aria-label="Social media">
  {#each items as { platform, url }}
    {#if url}
      <a
        class="bc-social-item"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {@render platformLabel(platform)}
      </a>
    {:else}
      <span class="bc-social-item">
        {@render platformLabel(platform)}
      </span>
    {/if}
  {/each}
</div>

<style>
  @font-face {
    font-family: "Boxcar Social";
    src: url("/reference/fonts/fa-brands-400.woff2") format("woff2");
    font-style: normal;
    font-weight: 400;
    font-display: block;
  }
  .bc-social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .bc-social-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 48px;
    color: #050b20;
    font-size: 12px;
    line-height: 20px;
    font-weight: 500;
    text-decoration: none;
  }
  a:hover {
    color: #405ff2;
  }
  a:hover .bc-social-symbol {
    background: #eef1fb;
  }
  a:focus-visible {
    outline: 2px solid #050b20;
    outline-offset: 3px;
    border-radius: 12px;
  }
  .bc-social-symbol {
    display: grid;
    place-items: center;
    font-family: "Boxcar Social";
    font-size: 22px;
    font-weight: 400;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #f2f4f7;
    line-height: 1;
  }
</style>
