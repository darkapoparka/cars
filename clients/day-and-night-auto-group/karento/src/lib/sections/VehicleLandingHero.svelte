<script lang="ts">
  import type { Snippet } from "svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  let {
    title,
    children,
    image,
  }: {
    title: string;
    children: Snippet;
    image?: { src: string; mobileSrc?: string };
  } = $props();
  const locale = useLocale();
  const titleId = $props.id();
</script>

<section class="container landing-frame" aria-labelledby={titleId}>
  <div class="vehicle-landing-hero">
    <div class="landing-visual">
      <picture class="landing-art"
        ><source
          media="(max-width:767.98px)"
          srcset={image?.mobileSrc ??
            image?.src ??
            "/campaign/daynight-home-phone.webp"}
        /><img
          src={image?.src ?? "/campaign/daynight-home-wide.webp"}
          alt={locale.t("image.illustrative")}
          width="1536"
          height="1024"
          fetchpriority="high"
        /></picture
      >
    </div>
    <div class="landing-search">
      <h1 id={titleId}>{title}</h1>
      {@render children()}
    </div>
  </div>
</section>

<style>
  .landing-frame {
    position: relative;
    z-index: 20;
    padding-top: 16px;
  }
  .vehicle-landing-hero {
    position: relative;
    overflow: hidden;
    padding: 20px;
    border-radius: 18px;
    background: #26344a;
    color: white;
  }
  .landing-visual {
    position: absolute;
    inset: 0;
  }
  .landing-visual::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, rgb(0 0 0 / 50%), rgb(0 0 0 / 12%));
    pointer-events: none;
  }
  .landing-art {
    display: block;
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
  }
  img {
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 65%;
  }
  h1 {
    position: relative;
    z-index: 1;
    margin: 0 0 12px;
    color: #fff;
    font-size: 22px;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: -0.025em;
    text-align: center;
    text-shadow: 0 1px 8px rgb(0 0 0 / 30%);
  }
  .landing-search {
    position: relative;
    width: min(960px, 100%);
    z-index: 2;
    margin-inline: auto;
    color: var(--bs-neutral-1000);
    --marketplace-search-padding: 8px;
    --marketplace-search-border: transparent;
    --marketplace-search-radius: 12px;
    --marketplace-search-shadow: none;
  }
  @media (max-width: 767.98px) {
    .landing-frame {
      padding-top: 12px;
    }
    .vehicle-landing-hero {
      padding: 12px;
      border-radius: 16px;
    }
    h1 {
      margin-bottom: 10px;
      font-size: 18px;
      line-height: 24px;
    }
    img {
      width: 100%;
      height: 100%;
      object-position: 50% 60%;
      mask-image: none;
    }
    .landing-search {
      width: 100%;
      --marketplace-control-height: 44px;
      --marketplace-row-gap: 6px;
      --marketplace-field-padding-block: 2px;
    }
  }
</style>
