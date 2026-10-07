<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  interface Image {
    src: string;
    alt: string;
  }
  let {
    slides,
    thumbnails = [],
    boxClass = "box-banner-activities",
    slideClass = "banner-slide-activity",
    thumbnailClass = "banner-slide",
    label = "Vehicle photos",
    peekNeighbours = false,
    children,
  }: {
    slides: readonly Image[];
    thumbnails?: readonly Image[];
    boxClass?: string;
    slideClass?: string;
    thumbnailClass?: string;
    label?: string;
    peekNeighbours?: boolean;
    children?: Snippet;
  } = $props();
  let main: HTMLDivElement;
  let thumbs = $state<HTMLDivElement>();
  let index = $state(0);
  let thumbIndex = $state(0);
  let mainWidth = $state(0);
  let thumbWidth = $state(0);
  let thumbMargins = $state(0);
  let visibleThumbs = $state(6);
  let ready = $state(false);
  let start: { x: number; y: number } | null = null;
  const leading = $derived(peekNeighbours && ready ? 1 : 0);
  const renderedSlides = $derived(
    leading ? [slides[slides.length - 1], ...slides, slides[0]] : slides,
  );
  const mainStyle = $derived(
    mainWidth ? `${mainWidth}px` : `${100 / slides.length}%`,
  );
  const thumbStyle = $derived(
    thumbWidth
      ? `${Math.max(0, thumbWidth - thumbMargins)}px`
      : `${100 / thumbnails.length}%`,
  );
  function select(next: number) {
    index = ((next % slides.length) + slides.length) % slides.length;
    thumbIndex = Math.min(
      index,
      Math.max(0, thumbnails.length - visibleThumbs),
    );
  }
  function keys(event: KeyboardEvent) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(index + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : slides.length - 1);
    }
  }
  function showPhotos(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent("karento-gallery", {
        detail: { images: slides.map((image) => image.src), index },
      }),
    );
  }
  function photoLinks(node: HTMLElement) {
    const click = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest('[aria-label="See All Photos"]')
      )
        return;
      showPhotos(event);
    };
    node.addEventListener("click", click);
    return {
      destroy() {
        node.removeEventListener("click", click);
      },
    };
  }
  onMount(() => {
    const resize = () => {
      mainWidth = Math.ceil(main.getBoundingClientRect().width);
      const width = window.innerWidth;
      visibleThumbs =
        width < 480
          ? 2
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
    };
    const observer = new ResizeObserver(resize);
    observer.observe(main);
    if (thumbs) observer.observe(thumbs);
    window.addEventListener("resize", resize);
    resize();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  });
</script>

<svelte:window
  onkeydown={(event) => {
    if (
      document.activeElement &&
      (main?.contains(document.activeElement) ||
        thumbs?.contains(document.activeElement))
    )
      keys(event);
  }}
  onpointerdown={(event) => {
    start =
      event.target instanceof Node && main?.contains(event.target)
        ? { x: event.clientX, y: event.clientY }
        : null;
  }}
  onpointerup={(event) => {
    if (
      start &&
      Math.abs(event.clientX - start.x) > 40 &&
      Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)
    )
      select(index + (event.clientX < start.x ? 1 : -1));
    start = null;
  }}
  onpointercancel={() => {
    start = null;
  }}
/>

<div class={boxClass} use:photoLinks>
  <div
    bind:this={main}
    class="banner-activities-detail slick-initialized slick-slider"
    data-widget-ready={ready ? "true" : undefined}
    role="region"
    aria-label={label}
    aria-roledescription="carousel"
  >
    <button
      type="button"
      class="slick-prev slick-arrow"
      aria-label="Previous photo"
      onclick={() => select(index - 1)}
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
    >
    <div class="slick-list draggable"
      ><div
        class="slick-track"
        style:opacity="1"
        style:width={mainWidth
          ? `${mainWidth * renderedSlides.length}px`
          : `${100 * slides.length}%`}
        style:transform={`translate3d(${-(index + leading) * mainWidth}px, 0px, 0px)`}
      >
        {#each renderedSlides as image, i}<div
            class={`${slideClass} slick-slide`}
            class:slick-current={i - leading === index}
            class:slick-active={i - leading === index}
            data-slick-index={i - leading}
            aria-hidden={i - leading !== index}
            style:width={mainStyle}
            ><a
              href={image.src}
              role="button"
              aria-label="Open photo viewer"
              tabindex={i - leading === index ? 0 : -1}
              onclick={showPhotos}
              onkeydown={(event) => {
                if (event.key === " ") showPhotos(event);
              }}><img src={image.src} alt={image.alt} draggable="false" /></a
            ></div
          >{/each}
      </div></div
    >
    <button
      type="button"
      class="slick-next slick-arrow"
      aria-label="Next photo"
      onclick={() => select(index + 1)}
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
    >
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
          {#each thumbnails as image, i}<div
              class={`${thumbnailClass} slick-slide`}
              class:slick-current={i === index}
              class:slick-active={i >= thumbIndex &&
                i < thumbIndex + visibleThumbs}
              data-slick-index={i}
              style:width={thumbStyle}
              ><button
                type="button"
                class="karento-gallery-thumb"
                aria-label={`Show photo ${(i % slides.length) + 1}`}
                aria-pressed={i === index}
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
