import type { Attachment } from "svelte/attachments";
import { slider } from "./vendor.ts";

interface MeasuredSliderElement extends HTMLElement {
  swiper?: {
    width: number;
    destroyed?: boolean;
    update(): void;
  };
}

/** Keep these responsive desktop carousels aligned with their settled width. */
export const measuredSlider: Attachment<MeasuredSliderElement> = (node) => {
  let active = true;
  // The container can settle after Swiper handles the viewport resize.
  const observer = new ResizeObserver(([entry]) => {
    const instance = node.swiper;
    if (
      !active ||
      !node.isConnected ||
      !entry ||
      !instance ||
      instance.destroyed
    )
      return;
    if (Math.abs(instance.width - entry.contentRect.width) > 1)
      instance.update();
  });
  observer.observe(node);
  const disposeSlider = slider(node);
  return () => {
    active = false;
    observer.disconnect();
    if (typeof disposeSlider === "function") disposeSlider();
  };
};
