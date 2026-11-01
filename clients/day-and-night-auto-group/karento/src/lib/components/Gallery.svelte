<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { onMount, tick, type Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";
  interface Image {
    src: string;
    alt: string;
  }
  interface ImageEntry {
    image: Image;
    key: string;
  }
  let {
    slides,
    thumbnails = [],
    boxClass = "box-banner-activities",
    slideClass = "banner-slide-activity",
    thumbnailClass = "banner-slide",
    label,
    peekNeighbours = false,
    mobileThumbnailCount = 2,
    showNavigation = true,
    children,
  }: {
    slides: readonly Image[];
    thumbnails?: readonly Image[];
    boxClass?: string;
    slideClass?: string;
    thumbnailClass?: string;
    label?: string;
    peekNeighbours?: boolean;
    mobileThumbnailCount?: 2 | 3 | 4;
    showNavigation?: boolean;
    children?: Snippet;
  } = $props();
  let main: HTMLDivElement | undefined;
  let thumbs = $state<HTMLDivElement>();
  let index = $state(0);
  let thumbIndex = $state(0);
  let mainWidth = $state(0);
  let thumbWidth = $state(0);
  let thumbMargins = $state(0);
  let visibleThumbs = $state(6);
  let ready = $state(false);
  let start: { x: number; y: number; pointer: number } | null = null;
  let ignorePhotoClick = false;
  function imageEntries(images: readonly Image[]): ImageEntry[] {
    const occurrences = new Map<string, number>();
    return images.map((image) => {
      const occurrence = occurrences.get(image.src) || 0;
      occurrences.set(image.src, occurrence + 1);
      return { image, key: `${image.src}:${occurrence}` };
    });
  }
  const slideEntries = $derived(imageEntries(slides));
  const thumbnailEntries = $derived(imageEntries(thumbnails));
  const currentIndex = $derived(
    Math.min(index, Math.max(0, slides.length - 1)),
  );
  const leading = $derived(
    peekNeighbours && ready && slides.length > 1 ? 1 : 0,
  );
  const renderedSlides = $derived(
    leading
      ? [
          { ...slideEntries[slideEntries.length - 1], key: "previous-peek" },
          ...slideEntries,
          { ...slideEntries[0], key: "next-peek" },
        ]
      : slideEntries,
  );
  const mainStyle = $derived(
    mainWidth
      ? `${mainWidth}px`
      : `${slides.length ? 100 / slides.length : 0}%`,
  );
  const thumbStyle = $derived(
    thumbWidth
      ? `${Math.max(0, thumbWidth - thumbMargins)}px`
      : `${thumbnails.length ? 100 / thumbnails.length : 0}%`,
  );
  function select(next: number) {
    if (!slides.length) return;
    const focusedPhoto =
      document.activeElement instanceof HTMLAnchorElement &&
      main?.contains(document.activeElement) &&
      document.activeElement.closest(".slick-slide");
    index = ((next % slides.length) + slides.length) % slides.length;
    thumbIndex = Math.min(
      index,
      Math.max(0, thumbnails.length - visibleThumbs),
    );
    if (focusedPhoto) void focusPhoto();
  }
  async function focusPhoto() {
    await tick();
    if (!main?.isConnected) return;
    main
      .querySelector<HTMLAnchorElement>(".slick-current a")
      ?.focus({ preventScroll: true });
  }
  function keys(event: KeyboardEvent) {
    if (slides.length < 2) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : slides.length - 1);
    }
  }
  function showPhotos(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    if (event instanceof MouseEvent && event.detail > 0 && ignorePhotoClick) {
      ignorePhotoClick = false;
      return;
    }
    ignorePhotoClick = false;
    window.dispatchEvent(
      new CustomEvent("karento-gallery", {
        detail: {
          images: slides.map((image) => image.src),
          index: currentIndex,
        },
      }),
    );
  }
  const photoLinks: Attachment<HTMLElement> = (node) => {
    const click = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest("[data-photo-viewer-trigger]")
      )
        return;
      showPhotos(event);
      event.stopPropagation();
    };
    node.addEventListener("click", click, true);
    return () => node.removeEventListener("click", click, true);
  };
  function resize() {
    if (!main?.isConnected) return;
    mainWidth = Math.ceil(main.getBoundingClientRect().width);
    const width = window.innerWidth;
    visibleThumbs =
      width < 480
        ? mobileThumbnailCount
        : width < 700
          ? 3
          : width < 1024
            ? 4
            : width < 1200
              ? 5
              : 6;
    thumbWidth = thumbs
      ? Math.ceil(thumbs.getBoundingClientRect().width / visibleThumbs)
      : 0;
    const first = thumbs?.querySelector<HTMLElement>(".slick-slide");
    const style = first && getComputedStyle(first);
    thumbMargins = style
      ? parseFloat(style.marginLeft) + parseFloat(style.marginRight)
      : 0;
    thumbIndex = Math.min(
      thumbIndex,
      Math.max(0, thumbnails.length - visibleThumbs),
    );
    ready = true;
  }
  onMount(() => {
    if (!main) return;
    const observer = new ResizeObserver(resize);
    observer.observe(main);
    if (thumbs) observer.observe(thumbs);
    resize();
    return () => observer.disconnect();
  });
</script>

<svelte:window
  onresize={resize}
  onkeydown={(event) => {
    if (
      document.activeElement &&
      (main?.contains(document.activeElement) ||
        thumbs?.contains(document.activeElement))
    )
      keys(event);
  }}
  onpointerdown={(event) => {
    ignorePhotoClick = false;
    start =
      slides.length > 1 &&
      event.isPrimary &&
      event.button === 0 &&
      event.target instanceof Element &&
      main?.contains(event.target) &&
      event.target.closest(".slick-slide")
        ? { x: event.clientX, y: event.clientY, pointer: event.pointerId }
        : null;
  }}
  onpointerup={(event) => {
    if (
      start &&
      start.pointer === event.pointerId &&
      Math.abs(event.clientX - start.x) > 40 &&
      Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)
    ) {
      ignorePhotoClick = true;
      select(currentIndex + (event.clientX < start.x ? 1 : -1));
    }
    start = null;
  }}
  onpointercancel={() => {
    start = null;
  }}
/>

<div class={boxClass} {@attach photoLinks}>
  <div
    bind:this={main}
    class="banner-activities-detail slick-initialized slick-slider"
    data-widget-ready={ready ? "true" : undefined}
    role="region"
    aria-label={label ?? locale.t("gallery.photos")}
    aria-roledescription={slides.length > 1 ? "carousel" : undefined}
  >
    {#if showNavigation && slides.length > 1}<button
        type="button"
        class="slick-prev slick-arrow"
        aria-label={locale.t("gallery.previousPhoto")}
        onclick={() => select(currentIndex - 1)}
        ><svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          ><path
            d="M5.99967 1.33325L1.33301 5.99992M1.33301 5.99992L5.99967 10.6666M1.33301 5.99992H10.6663"
            stroke=""
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path></svg
        ></button
      >{/if}
    <div class="slick-list draggable"
      ><div
        class="slick-track"
        style:opacity="1"
        style:width={mainWidth
          ? `${mainWidth * renderedSlides.length}px`
          : `${100 * slides.length}%`}
        style:transform={`translate3d(${-(currentIndex + leading) * mainWidth}px, 0px, 0px)`}
      >
        {#each renderedSlides as { image, key }, i (key)}<div
            class={[
              slideClass,
              "slick-slide",
              {
                "slick-current": i - leading === currentIndex,
                "slick-active": i - leading === currentIndex,
              },
            ]}
            data-slick-index={i - leading}
            aria-hidden={i - leading !== currentIndex}
            style:width={mainStyle}
            ><a
              href={image.src}
              draggable="false"
              role="button"
              aria-label={locale.t("gallery.openViewer")}
              tabindex={i - leading === currentIndex ? 0 : -1}
              onclick={showPhotos}
              onkeydown={(event) => {
                if (event.key === " ") showPhotos(event);
              }}><img src={image.src} alt={image.alt} draggable="false" /></a
            ></div
          >{/each}
      </div></div
    >
    {#if showNavigation && slides.length > 1}<button
        type="button"
        class="slick-next slick-arrow"
        aria-label={locale.t("gallery.nextPhoto")}
        onclick={() => select(currentIndex + 1)}
        ><svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          ><path
            d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992"
            stroke=""
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path></svg
        ></button
      >{/if}
  </div>
  {#if children}{@render children()}{/if}
</div>
{#if thumbnails.length}<div class="slider-thumnail-activities">
    <div
      bind:this={thumbs}
      class="slider-nav-thumbnails-activities-detail slick-initialized slick-slider"
    >
      <div class="slick-list draggable"
        ><div
          class="slick-track"
          style:opacity="1"
          style:width={thumbWidth
            ? `${thumbWidth * thumbnails.length}px`
            : `${(100 * thumbnails.length) / visibleThumbs}%`}
          style:transform={`translate3d(${-thumbIndex * thumbWidth}px, 0px, 0px)`}
        >
          {#each thumbnailEntries as { image, key }, i (key)}<div
              class={[
                thumbnailClass,
                "slick-slide",
                {
                  "slick-current": i === currentIndex,
                  "slick-active":
                    i >= thumbIndex && i < thumbIndex + visibleThumbs,
                },
              ]}
              data-slick-index={i}
              style:width={thumbStyle}
              ><button
                type="button"
                class="karento-gallery-thumb"
                aria-label={locale.t("gallery.showPhoto", {
                  number: locale.number((i % slides.length) + 1),
                })}
                aria-pressed={i === currentIndex}
                onclick={() => select(i)}
                ><img
                  src={image.src}
                  alt={image.alt}
                  draggable="false"
                /></button
              ></div
            >{/each}
        </div></div
      >
    </div>
  </div>{/if}
