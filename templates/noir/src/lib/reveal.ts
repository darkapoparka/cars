import type { Attachment } from "svelte/attachments";

/**
 * Fades an element in when it scrolls into view. Elements already visible on
 * load are left alone, and without JavaScript nothing is hidden.
 */
export const reveal: Attachment<HTMLElement> = (node) => {
  if (node.getBoundingClientRect().top < window.innerHeight) return;
  node.dataset.reveal = "";
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      node.dataset.reveal = "in";
      observer.disconnect();
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(node);
  return () => observer.disconnect();
};
