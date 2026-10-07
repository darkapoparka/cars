import { getContext, setContext } from "svelte";
export type PreviewRole = "guest" | "owner" | "member";
const key = Symbol("karento-preview");
export class PreviewState {
  role = $state<PreviewRole>("guest");
  panels = $state<Record<string, string | null | undefined>>({});
  drawer = $state(false);
  mobile = $state(false);
  accountHref = $derived(
    this.role === "owner"
      ? "/dashboard"
      : this.role === "member"
        ? "/account"
        : "/login",
  );
  setRole(role: PreviewRole) {
    this.role = role;
    try {
      sessionStorage.setItem("karento-best-demo-area", role);
    } catch {
      /* Browser storage is optional for this preview. */
    }
  }
}
export function createPreview() {
  return setContext(key, new PreviewState());
}
export function usePreview(): PreviewState {
  return getContext<PreviewState>(key);
}
