import { goto as nativeGoto } from "$app/navigation";
import { carsMountPath } from "#lib/cars-mount.ts";
export * from "$app/navigation";
export const goto: typeof nativeGoto = (url, options) => nativeGoto(typeof url === "string" ? carsMountPath(url) : url, options);
