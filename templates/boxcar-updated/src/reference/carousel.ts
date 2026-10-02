export type Options = {
  selector: string;
  slidesToShow?: number;
  slidesToScroll?: number;
  [key: string]: unknown;
};
export type Carousel = {
  layout: () => void;
  go: (index: number) => void;
  destroy: () => void;
};
type Slider = {
  slick: (option: Options | string, ...args: unknown[]) => Slider;
};
type JQuery = ((node: HTMLElement) => Slider) & { fn: { slick?: unknown } };
let library: Promise<JQuery> | undefined;

function script(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing?.dataset.loaded) {
      resolve();
      return;
    }
    const el = existing || document.createElement("script");
    el.id = id;
    el.onload = () => {
      el.dataset.loaded = "true";
      resolve();
    };
    el.onerror = () => {
      el.remove();
      reject(new Error("Could not load " + src));
    };
    if (!existing) {
      el.src = src;
      document.head.append(el);
    }
  });
}

/** Keep the demo's proven slider engine inside a Svelte-owned lifecycle. */
export function loadSliderLibrary(): Promise<JQuery> {
  const get = () => (window as unknown as { jQuery?: JQuery }).jQuery;
  if (get()?.fn.slick) return Promise.resolve(get()!);
  return (library ||= (async () => {
    await script("boxcar-jquery", "/reference/js/jquery.js");
    await script("boxcar-slick", "/reference/js/slick-core.js");
    return get()!;
  })());
}

export function carousel(
  node: HTMLElement,
  options: Options,
  jq: JQuery,
): Carousel {
  const slider = jq(node);
  slider.slick({
    ...options,
    slidesToShow: options.slidesToShow ?? (Number(node.dataset.preview) || 1),
  });
  return {
    layout: () => {
      if (node.isConnected && node.offsetWidth) slider.slick("setPosition");
    },
    go: (index) => {
      slider.slick("slickGoTo", index);
    },
    destroy: () => {
      if (node.classList.contains("slick-initialized")) slider.slick("unslick");
    },
  };
}
