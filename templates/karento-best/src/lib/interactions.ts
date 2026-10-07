import { goto } from "$app/navigation";
export function toggleCollapse(event: MouseEvent) {
  event.preventDefault();
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  const selector = button.dataset.bsTarget || button.getAttribute("href");
  if (!selector?.startsWith("#")) return;
  const body = document.getElementById(selector.slice(1));
  if (!body) return;
  const open = !body.classList.contains("show");
  const parent = body.getAttribute("data-bs-parent");
  if (open && parent?.startsWith("#")) {
    document
      .getElementById(parent.slice(1))
      ?.querySelectorAll(".collapse.show")
      .forEach((other) => {
        if (other !== body) {
          other.classList.remove("show");
          const trigger = document.querySelector<HTMLElement>(
            `[data-bs-target="#${other.id}"]`,
          );
          trigger?.classList.add("collapsed");
          trigger?.setAttribute("aria-expanded", "false");
        }
      });
  }
  body.classList.toggle("show", open);
  button.classList.toggle("collapsed", !open);
  button.setAttribute("aria-expanded", String(open));
}
export function selectTab(event: MouseEvent) {
  event.preventDefault();
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  const target = button.dataset.bsTarget || button.getAttribute("href");
  if (!target?.startsWith("#")) return;
  const pane = document.getElementById(target.slice(1));
  if (!pane) return;
  button
    .closest('[role="tablist"], .nav')
    ?.querySelectorAll("[data-bs-toggle]")
    .forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
  button.classList.add("active");
  button.setAttribute("aria-selected", "true");
  pane.parentElement
    ?.querySelectorAll(":scope > .tab-pane")
    .forEach((item) => item.classList.remove("show", "active"));
  pane.classList.add("show", "active");
}
export function quantity(node: HTMLElement) {
  const input = node.querySelector<HTMLInputElement>(".qty-val");
  const click = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element) || !input) return;
    const step = target.closest(".qty-up")
      ? 1
      : target.closest(".qty-down")
        ? -1
        : 0;
    if (step) {
      event.preventDefault();
      input.value = String(Math.max(1, (Number(input.value) || 1) + step));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };
  node.addEventListener("click", click);
  return {
    destroy() {
      node.removeEventListener("click", click);
    },
  };
}
export function demoSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.hasAttribute("data-demo-signin")) {
    const role =
      new FormData(form).get("area") === "member" ? "member" : "owner";
    try {
      sessionStorage.setItem("karento-best-demo-area", role);
    } catch {
      /* Optional storage. */
    }
    window.dispatchEvent(new CustomEvent("karento-role", { detail: role }));
    void goto(role === "member" ? "/account" : "/dashboard");
    return;
  }
  let message = form.querySelector<HTMLOutputElement>(
    "output[data-demo-feedback]",
  );
  if (!message) {
    message = document.createElement("output");
    message.dataset.demoFeedback = "true";
    message.setAttribute("role", "status");
    message.className = "text-sm-medium neutral-500";
    form.appendChild(message);
  }
  message.textContent =
    "Template preview only. This form does not send or save information.";
}
export function drawerFocus(node: HTMLElement, initial: boolean) {
  let open = false;
  let previous: HTMLElement | null = null;
  let frame = 0;
  const controls = () =>
    Array.from(
      node.querySelectorAll<HTMLElement>(
        'a[href],button,summary,[tabindex="0"]',
      ),
    ).filter(
      (el) =>
        !el.hidden &&
        el.getClientRects().length > 0 &&
        getComputedStyle(el).visibility !== "hidden" &&
        (!el.closest("details:not([open])") || el.tagName === "SUMMARY"),
    );
  const update = (value: boolean) => {
    if (value && !open) {
      previous =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const focus = () => {
        const control =
          node.querySelector<HTMLElement>(
            '.close-canvas, .mobile-header-logo [role="button"]',
          ) || controls()[0];
        control?.focus();
        if (open && document.activeElement !== control)
          frame = requestAnimationFrame(focus);
      };
      frame = requestAnimationFrame(focus);
    }
    if (!value && open) {
      cancelAnimationFrame(frame);
      previous?.focus();
    }
    open = value;
  };
  const keydown = (event: KeyboardEvent) => {
    if (!open || event.key !== "Tab") return;
    const list = controls();
    const first = list[0],
      last = list.at(-1);
    if (!first) return;
    if (!node.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", keydown);
  update(initial);
  return {
    update,
    destroy() {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown);
      if (open) previous?.focus();
    },
  };
}
export function dropdownClose(
  node: HTMLElement,
  options: { close: () => void },
) {
  const click = (event: MouseEvent) => {
    if (event.target instanceof Node && !node.contains(event.target))
      options.close();
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      options.close();
      node.querySelector<HTMLElement>("[data-bs-toggle]")?.focus();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(".dropdown-item"),
      );
      const index = items.indexOf(document.activeElement as HTMLElement);
      items[
        (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
          items.length
      ]?.focus();
    }
  };
  document.addEventListener("click", click);
  node.addEventListener("keydown", keydown);
  return {
    update(value: { close: () => void }) {
      options = value;
    },
    destroy() {
      document.removeEventListener("click", click);
      node.removeEventListener("keydown", keydown);
    },
  };
}
export function selectCategory(event: MouseEvent) {
  event.preventDefault();
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  button.parentElement
    ?.querySelectorAll(".btn-click")
    .forEach((el) => el.classList.remove("active"));
  button.classList.add("active");
}
export function tabKeydown(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;
  const tabs = Array.from(
    button
      .closest('[role="tablist"],.nav')
      ?.querySelectorAll<HTMLElement>(
        '[data-bs-toggle="tab"],[data-bs-toggle="pill"]',
      ) || [],
  );
  const index = tabs.indexOf(button);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
          tabs.length;
  event.preventDefault();
  tabs[next]?.focus();
  tabs[next]?.click();
}
export function openImage(event: MouseEvent) {
  const anchor = event.currentTarget;
  if (!(anchor instanceof HTMLAnchorElement)) return;
  event.preventDefault();
  const anchors = Array.from(
    anchor
      .closest("main")
      ?.querySelectorAll<HTMLAnchorElement>(".image-gallery") || [anchor],
  );
  window.dispatchEvent(
    new CustomEvent("karento-gallery", {
      detail: {
        images: anchors.map((a) => a.href),
        index: anchors.indexOf(anchor),
      },
    }),
  );
}
export function demoAction(event: MouseEvent) {
  event.preventDefault();
  const control = event.currentTarget;
  if (!(control instanceof HTMLElement)) return;
  let output =
    control.parentElement?.querySelector<HTMLOutputElement>(
      "[data-demo-action]",
    );
  if (!output) {
    output = document.createElement("output");
    output.dataset.demoAction = "true";
    output.setAttribute("role", "status");
    output.className = "text-sm-medium neutral-500";
    control.parentElement?.appendChild(output);
  }
  output.textContent =
    "Template preview only. No purchase or saved account change is made.";
}
