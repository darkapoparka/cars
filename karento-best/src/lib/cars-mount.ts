// Generated deployment paths; canonical template URLs stay local.
export const carsBase = "/variant-6";
export function carsLocalPath(value: string): string {
  return value === carsBase ? "/" : value.startsWith(carsBase + "/") ? value.slice(carsBase.length) : value;
}
export function carsMountPath<T extends string | null | undefined>(value: T): T {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value === "/preview-switcher.js" || value === carsBase || value.startsWith(carsBase + "/") || value.startsWith(carsBase + "?") || value.startsWith(carsBase + "#")) return value;
  return (carsBase + value) as T;
}
