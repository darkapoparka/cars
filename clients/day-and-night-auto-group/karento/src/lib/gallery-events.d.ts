import "svelte/elements";

declare module "svelte/elements" {
  interface SvelteWindowAttributes {
    "onkarento-gallery"?: (event: CustomEvent<unknown>) => void;
  }
}
