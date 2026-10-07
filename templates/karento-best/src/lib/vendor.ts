import { ownAsyncResource, type ResourceScope } from "./async-resource.ts";
import configs from "./slider-config.json";
import charts from "./chart-config.json";
type Options = Record<string, unknown>;
interface Disposable {
  destroy(...args: boolean[]): void;
}
interface Slider extends Disposable {
  autoplay?: { stop(): void };
  params: Options;
}
interface VendorWindow extends Window {
  Swiper?: new (node: HTMLElement, options: Options) => Slider;
  PerfectScrollbar?: new (node: HTMLElement) => Disposable;
  ApexCharts?: new (
    node: HTMLElement,
    options: Options,
  ) => Disposable & { render(): Promise<void> };
}
const resources = new Map<string, Promise<void>>();
function loadScript(src: string) {
  let pending = resources.get(src);
  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => {
        resources.delete(src);
        script.remove();
        reject(new Error(`Unable to load ${src}`));
      };
      document.head.appendChild(script);
    });
    resources.set(src, pending);
  }
  return pending;
}
function own(
  node: HTMLElement,
  initialize: (scope: ResourceScope) => Promise<Disposable | null>,
) {
  const resource = ownAsyncResource(
    async (scope) => {
      const instance = await initialize(scope);
      if (instance) scope.onCleanup(() => instance.destroy(true, true));
    },
    {
      ready() {
        node.dataset.widgetReady = "true";
      },
      error(error) {
        node.dataset.widgetError = "true";
        console.error("Karento preview widget failed", error);
      },
      cleanupError(error) {
        console.error("Karento widget cleanup failed", error);
      },
    },
  );
  return {
    destroy() {
      resource.destroy();
      delete node.dataset.widgetReady;
      delete node.dataset.widgetError;
    },
  };
}
export function slider(node: HTMLElement) {
  return own(node, async (scope) => {
    await loadScript("/assets/js/plugins/swiper-bundle.min.js");
    if (!scope.active) return null;
    const Constructor = (window as VendorWindow).Swiper;
    if (!Constructor) throw new Error("Swiper unavailable");
    const key = Object.keys(configs).find((key) => node.matches(key));
    if (!key) return null;
    const options: Options = structuredClone(
      configs[key as keyof typeof configs],
    );
    const section = node.closest("section") || node.parentElement || node;
    const navigation = options.navigation as
      | { nextEl?: string | Element | null; prevEl?: string | Element | null }
      | undefined;
    if (navigation) {
      if (typeof navigation.nextEl === "string")
        navigation.nextEl = section.querySelector(navigation.nextEl);
      if (typeof navigation.prevEl === "string")
        navigation.prevEl = section.querySelector(navigation.prevEl);
    }
    const pagination = options.pagination as
      | { el?: string | Element | null }
      | undefined;
    if (pagination && typeof pagination.el === "string")
      pagination.el = section.querySelector(pagination.el);
    delete options.autoplay;
    options.speed = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 220;
    const instance = new Constructor(node, options);
    scope.onCleanup(() => instance.destroy(true, true));
    instance.autoplay?.stop();
    const testimonials = section.querySelector<HTMLElement>(
      ".block-testimonials",
    );
    const sectionContainer = section.querySelector(".container");
    if (testimonials && sectionContainer)
      testimonials.style.paddingLeft = `${sectionContainer.getBoundingClientRect().left + 15}px`;
    if (
      node.classList.contains("swiper-group-animate") ||
      node.classList.contains("swiper-group-4") ||
      node.classList.contains("swiper-group-testimonials")
    ) {
      const padding = section.querySelector<HTMLElement>(".box-swiper-padding");
      const container = section.querySelector(".container");
      if (padding && container)
        padding.style.paddingLeft =
          String(
            container.getBoundingClientRect().left +
              (node.classList.contains("swiper-group-animate") ? 15 : 0),
          ) + "px";
    }
    return null;
  });
}
export function scrollbar(node: HTMLElement) {
  return own(node, async (scope) => {
    await loadScript("/assets/js/plugins/perfect-scrollbar.min.js");
    if (!scope.active) return null;
    const Constructor = (window as VendorWindow).PerfectScrollbar;
    if (!Constructor) throw new Error("Scrollbar unavailable");
    return new Constructor(node);
  });
}
export function chart(node: HTMLElement) {
  return own(node, async (scope) => {
    await loadScript("/assets/js/plugins/apexcharts.min.js");
    if (!scope.active) return null;
    const Constructor = (window as VendorWindow).ApexCharts;
    const options = charts[("#" + node.id) as keyof typeof charts];
    if (!Constructor || !options) return null;
    const renderedOptions = structuredClone(options);
    // The chart's auto-sized parent also contains the chart. Observing its
    // height creates a resize feedback loop; window resizing still redraws it.
    Object.assign(renderedOptions.chart, { redrawOnParentResize: false });
    if (node.id === "chart-2") {
      const radial = renderedOptions as (typeof charts)["#chart-2"];
      Object.assign(radial.plotOptions.radialBar.dataLabels.total, {
        formatter: () => radial.series.reduce((sum, value) => sum + value, 0),
      });
    }
    const instance = new Constructor(node, renderedOptions);
    scope.onCleanup(() => instance.destroy());
    await instance.render();
    return null;
  });
}
interface RangeApi {
  on(event: string, callback: (values: string[]) => void): void;
  destroy(): void;
}
interface RangeElement extends HTMLElement {
  noUiSlider?: RangeApi;
}
export function range(node: RangeElement) {
  return own(node, async (scope) => {
    await loadScript("/assets/js/plugins/noUISlider.js");
    if (!scope.active) return null;
    const vendor = window as Window & {
      noUiSlider?: { create(node: HTMLElement, options: Options): void };
    };
    if (!vendor.noUiSlider) throw new Error("Range slider unavailable");
    vendor.noUiSlider.create(node, {
      start: 280,
      tooltips: [
        { to: (value: number) => Math.round(value).toString(), from: Number },
      ],
      step: 1,
      range: { min: 0, max: 500 },
      format: {
        to: (value: number) => Math.round(value).toLocaleString("en-US"),
        from: (value: string) => Number(value.replaceAll(",", "")),
      },
      connect: "lower",
    });
    const api = node.noUiSlider;
    if (!api) throw new Error("Range slider did not initialize");
    api.on("update", (values) => {
      const input = node
        .closest(".block-filter")
        ?.querySelector<HTMLInputElement>(".value-money");
      if (input) input.value = values[0];
    });
    return {
      destroy() {
        api.destroy();
      },
    };
  });
}
