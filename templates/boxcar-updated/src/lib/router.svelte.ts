import { tick } from "svelte";
export const route = $state({
  path: window.location.pathname,
  search: window.location.search,
});
function update() {
  route.path = window.location.pathname;
  route.search = window.location.search;
}
export async function navigate(href: string, replace = false) {
  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin) {
    window.location.href = url.href;
    return;
  }
  history.replaceState({ ...history.state, scrollY: window.scrollY }, "");
  history[replace ? "replaceState" : "pushState"](
    { scrollY: 0 },
    "",
    url.pathname + url.search + url.hash,
  );
  update();
  await tick();
  window.scrollTo({ top: 0, behavior: "instant" });
  const main = document.getElementById("main");
  main?.focus({ preventScroll: true });
}
export function setupRouter() {
  const click = (event: MouseEvent) => {
    const anchor = (event.target as Element)?.closest("a");
    if (
      !anchor ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.target ||
      anchor.hasAttribute("download")
    )
      return;
    const raw = anchor.getAttribute("href");
    if (!raw || raw.startsWith("#")) return;
    const url = new URL(anchor.href);
    if (
      url.origin !== location.origin ||
      !["http:", "https:"].includes(url.protocol)
    )
      return;
    event.preventDefault();
    void navigate(url.pathname + url.search + url.hash);
  };
  const back = async (event: PopStateEvent) => {
    update();
    await tick();
    window.scrollTo({
      top: Number(event.state?.scrollY) || 0,
      behavior: "instant",
    });
  };
  document.addEventListener("click", click);
  window.addEventListener("popstate", back);
  return () => {
    document.removeEventListener("click", click);
    window.removeEventListener("popstate", back);
  };
}
