<script lang="ts">
  import type { SocialLink, SocialPlatform } from "../data/brand";
  let { links }: { links: SocialLink[] } = $props();
  const platforms: Record<SocialPlatform, { label: string; glyph: string }> = {
    facebook: { label: "Facebook", glyph: "\uf39e" },
    instagram: { label: "Instagram", glyph: "\uf16d" },
    youtube: { label: "YouTube", glyph: "\uf167" },
    tiktok: { label: "TikTok", glyph: "\ue07b" },
    linkedin: { label: "LinkedIn", glyph: "\uf0e1" },
  };
</script>

<nav class="bc-social-links" aria-label="Social media">
  {#each links as { platform, url }}
    <a href={url} target="_blank" rel="noopener noreferrer">
      <span class="bc-social-symbol" aria-hidden="true">
        {platforms[platform].glyph}
      </span>
      {platforms[platform].label}
    </a>
  {/each}
</nav>

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
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 44px;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    padding: 9px 14px;
    color: #050b20;
    font-size: 14px;
    line-height: 24px;
    font-weight: 500;
    text-decoration: none;
  }
  a:hover {
    border-color: #405ff2;
    color: #405ff2;
    background: #eef1fb;
  }
  a:focus-visible {
    outline: 2px solid #050b20;
    outline-offset: 3px;
  }
  .bc-social-symbol {
    font-family: "Boxcar Social";
    font-size: 18px;
    font-weight: 400;
    width: 20px;
    line-height: 20px;
    text-align: center;
  }
</style>
