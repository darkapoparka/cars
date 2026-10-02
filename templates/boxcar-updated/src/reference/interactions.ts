import carouselOptions from "./carousels.json";
import { navigate } from "../lib/router.svelte";
import { vehicles } from "../lib/catalog";
import { calculateLoan } from "../lib/domain";
import { initializeHeaderSearch } from "./header-search";

import {
  carousel,
  loadSliderLibrary,
  type Options,
  type Carousel,
} from "./carousel";

export function referencePage(node: HTMLElement) {
  if (
    /AppleWebKit/.test(navigator.userAgent) &&
    !/Chrome|Chromium|Edg/.test(navigator.userAgent)
  )
    node.dataset.webkitLayout = "";
  let alive = true;
  const carousels = new Map<HTMLElement, Carousel>();
  const abort = new AbortController(),
    signal = abort.signal;
  const curated = node.hasAttribute("data-curated-home");
  initializeHeaderSearch(node, signal);
  const selectorLabel = (menu: HTMLElement) =>
    menu.querySelector<HTMLElement>(".select span")?.textContent?.trim() || "";
  const closeDrops = () =>
    node.querySelectorAll<HTMLElement>(".drop-menu.active").forEach((menu) => {
      menu.classList.remove("active");
      menu.querySelector<HTMLElement>(".dropdown")!.style.display = "none";
      menu.querySelector(".select")?.setAttribute("aria-expanded", "false");
    });
  const runSearch = (form: HTMLFormElement) => {
    const params = new URLSearchParams();
    const labels = Array.from(
      form.querySelectorAll<HTMLElement>(".drop-menu"),
    ).map(selectorLabel);
    for (const label of labels) {
      if (vehicles.some((v) => v.make === label)) params.set("make", label);
      else if (vehicles.some((v) => v.model === label))
        params.set("model", label);
      else if (
        [
          "SUV",
          "Sedan",
          "Hatchback",
          "Coupe",
          "Hybrid",
          "Convertible",
        ].includes(label)
      )
        params.set("body", label);
      else if (/^\$[\d,]+/.test(label))
        params.set("max", label.replace(/\D/g, ""));
      else if (/^(New|Used)\s*Cars$/i.test(label))
        params.set("condition", label.split(/\s/)[0]);
    }
    const tab = node
      .querySelector(".form-tabs-list .current")
      ?.textContent?.trim()
      .toLowerCase();
    if (tab === "new" || tab === "used") params.set("condition", tab);
    const search = form
      .querySelector<HTMLInputElement>("input[type=search]")
      ?.value.trim();
    if (search) params.set("q", search);
    void navigate("/inventory/" + (params.size ? "?" + params : ""));
  };
  // Replace placeholder choices with the working catalogue without changing the closed control DOM.
  for (const menu of node.querySelectorAll<HTMLElement>(".drop-menu")) {
    const label = selectorLabel(menu).toLowerCase();
    const values = label.includes("make")
      ? [...new Set(vehicles.map((v) => v.make))].sort()
      : label.includes("model")
        ? [...new Set(vehicles.map((v) => v.model))].sort()
        : label.includes("price")
          ? ["$25,000", "$50,000", "$75,000", "$100,000"]
          : [];
    if (values.length) {
      const list = menu.querySelector(".dropdown");
      list?.replaceChildren(
        ...(curated ? [selectorLabel(menu), ...values] : values).map((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          li.setAttribute("role", "option");
          li.tabIndex = 0;
          li.setAttribute("aria-selected", "false");
          return li;
        }),
      );
    }
    menu.dataset.initial = selectorLabel(menu);
    if (curated) {
      const control = menu.querySelector<HTMLElement>(".select");
      if (control) {
        menu.dataset.controlLabel =
          control.getAttribute("aria-label") || selectorLabel(menu);
        control.setAttribute(
          "aria-label",
          `${menu.dataset.controlLabel}: ${selectorLabel(menu)}`,
        );
      }
    }
  }
  const click = (event: MouseEvent) => {
    const target = event.target as Element;
    const tab = target.closest<HTMLElement>("[data-tab]");
    if (tab) {
      const group = tab.closest(".form-tabs,.banner-v8-form") || node;
      group
        .querySelectorAll("[data-tab],.form-tab-pane")
        .forEach((el) => el.classList.remove("current"));
      group
        .querySelectorAll("[data-tab]")
        .forEach((el) => el.setAttribute("aria-selected", "false"));
      tab.classList.add("current");
      tab.setAttribute("aria-selected", "true");
      group
        .querySelector(`#${CSS.escape(tab.dataset.tab || "")}`)
        ?.classList.add("current");
      closeDrops();
      return;
    }
    const bootstrap = target.closest<HTMLElement>("[data-bs-toggle=tab]");
    if (bootstrap) {
      const section = bootstrap.closest("section") || node;
      section.querySelectorAll("[data-bs-toggle=tab]").forEach((el) => {
        el.classList.remove("active");
        el.setAttribute("aria-selected", "false");
        if (curated) el.setAttribute("tabindex", "-1");
      });
      section
        .querySelectorAll(".tab-pane")
        .forEach((el) => el.classList.remove("show", "active"));
      bootstrap.classList.add("active");
      bootstrap.setAttribute("aria-selected", "true");
      if (curated) bootstrap.tabIndex = 0;
      section
        .querySelector(bootstrap.dataset.bsTarget || "")
        ?.classList.add("show", "active");
      requestAnimationFrame(() => carousels.forEach((c) => c.layout()));
      return;
    }
    const menu = target.closest<HTMLElement>(".drop-menu");
    if (menu) {
      const option = target.closest<HTMLElement>(".dropdown li");
      if (option) {
        const span = menu.querySelector<HTMLElement>(".select span")!;
        span.textContent = option.textContent;
        span.classList.add("selected");
        menu
          .querySelectorAll(".dropdown li")
          .forEach((li) =>
            li.setAttribute("aria-selected", String(li === option)),
          );
        if (curated)
          menu
            .querySelector(".select")
            ?.setAttribute(
              "aria-label",
              `${menu.dataset.controlLabel}: ${selectorLabel(menu)}`,
            );
        if (menu.dataset.initial?.toLowerCase().includes("make")) {
          const form = menu.closest("form");
          const modelMenu = Array.from(
            form?.querySelectorAll<HTMLElement>(".drop-menu") || [],
          ).find((el) => el.dataset.initial?.toLowerCase().includes("model"));
          if (modelMenu) {
            modelMenu.querySelector(".select span")!.textContent =
              modelMenu.dataset.initial!;
            if (curated)
              modelMenu
                .querySelector(".select")
                ?.setAttribute(
                  "aria-label",
                  `${modelMenu.dataset.controlLabel}: ${modelMenu.dataset.initial}`,
                );
            const list = modelMenu.querySelector(".dropdown");
            const choices = [
              ...new Set(
                vehicles
                  .filter(
                    (v) =>
                      v.make === option.textContent ||
                      (curated && option.textContent === menu.dataset.initial),
                  )
                  .map((v) => v.model),
              ),
            ].sort();
            list?.replaceChildren(
              ...(curated
                ? [modelMenu.dataset.initial!, ...choices]
                : choices
              ).map((model) => {
                const li = document.createElement("li");
                li.textContent = model;
                li.tabIndex = 0;
                li.setAttribute("role", "option");
                li.setAttribute(
                  "aria-selected",
                  String(model === modelMenu.dataset.initial),
                );
                return li;
              }),
            );
          }
        }
        closeDrops();
        menu.querySelector<HTMLElement>(".select")?.focus();
      } else {
        const open = menu.classList.contains("active");
        closeDrops();
        if (!open) {
          menu.classList.add("active");
          menu.querySelector<HTMLElement>(".dropdown")!.style.display = "block";
          menu.querySelector(".select")?.setAttribute("aria-expanded", "true");
        }
      }
      return;
    }
    closeDrops();
    const nav = target.closest<HTMLElement>(".current-dropdown > span");
    if (nav) {
      const li = nav.parentElement!;
      const open = li.classList.toggle("reference-nav-open");
      nav.setAttribute("aria-expanded", String(open));
    }
    const mobile = target.closest<HTMLAnchorElement>('a[href="#nav-mobile"]');
    if (mobile) {
      event.preventDefault();
      showMobile(mobile);
    }
    const video = target.closest("[data-preview-video]");
    if (video) {
      event.preventDefault();
      showNotice(
        "Video preview",
        "This template preview uses illustrative media. No dealer video has been connected.",
      );
    }
    const preview = target.closest<HTMLAnchorElement>(
      'a[href="#account-preview"],a[href="#social-preview"],a[href="#app-preview"]',
    );
    if (preview) {
      event.preventDefault();
      const account = preview.hash === "#account-preview";
      showNotice(
        account ? "Sign in preview" : "Link preview",
        account
          ? "An account service has not been connected to this template preview. Saved cars are stored in this browser."
          : "This demo destination has not been connected.",
      );
    }
    const save = target.closest<HTMLElement>("a.icon-box");
    if (save) {
      event.preventDefault();
      void navigate("/favorites/");
    }
    const anchor = target.closest<HTMLAnchorElement>('a[href="#"]');
    if (anchor) {
      const text = anchor.textContent?.trim() || "";
      const type = ["SUV", "Sedan", "Hatchback", "Coupe", "Hybrid"].find(
        (t) => text === t,
      );
      if (type) {
        event.preventDefault();
        void navigate("/inventory/?body=" + type);
      } else if (/Learn More|More Info|View Details/.test(text)) {
        event.preventDefault();
        void navigate(
          "/vehicle/" +
            (node.dataset.referenceHome === "4"
              ? "volvo-xc90-recharge"
              : "mercedes-e-class") +
            "/",
        );
      } else if (/Terms|Privacy/.test(text)) {
        event.preventDefault();
        void navigate("/terms/");
      }
    }
  };
  function showNotice(title: string, message: string) {
    const dialog = document.createElement("dialog");
    dialog.className = "reference-dialog";
    const h = document.createElement("h2"),
      p = document.createElement("p"),
      b = document.createElement("button");
    h.textContent = title;
    p.textContent = message;
    b.textContent = "Close";
    b.type = "button";
    b.onclick = () => dialog.close();
    dialog.append(h, p, b);
    node.append(dialog);
    dialog.addEventListener("close", () => dialog.remove(), { once: true });
    dialog.showModal();
  }
  function showMobile(opener: HTMLElement) {
    const dialog = document.createElement("dialog");
    dialog.className =
      "reference-mobile-menu mm-menu mm-menu_offcanvas mm-menu_position-left mm-menu_theme-black mm-menu_opened";
    dialog.setAttribute("aria-label", "Main menu");
    const panels = document.createElement("div");
    panels.className = "mm-panels";
    dialog.append(panels);
    const rootList = (
      node.querySelector("ul#navbar") || node.querySelector("#navbar > ul")
    )?.cloneNode(true) as HTMLElement;
    rootList?.removeAttribute("id");
    rootList?.classList.remove("navbar");
    function panel(
      title: string,
      content: HTMLElement,
      parent?: HTMLElement,
    ): HTMLElement {
      const result = document.createElement("div");
      result.className = "mm-panel mm-hidden";
      const navbar = document.createElement("div");
      navbar.className = "mm-navbar mm-navbar_sticky";
      if (parent) {
        const back = document.createElement("a");
        back.href = "#menu-back";
        back.className = "mm-btn mm-btn_prev mm-navbar__btn";
        back.setAttribute("aria-label", "Back to menu");
        back.onclick = (e) => {
          e.preventDefault();
          result.classList.add("mm-hidden");
          result.classList.remove("mm-panel_opened");
          parent.classList.remove("mm-hidden");
          parent.classList.add("mm-panel_opened");
        };
        navbar.append(back);
      }
      const label = document.createElement("a");
      label.className = "mm-navbar__title";
      const text = document.createElement("span");
      text.textContent = title;
      label.append(text);
      navbar.append(label);
      result.append(navbar, content);
      panels.append(result);
      content
        .querySelectorAll("[id]")
        .forEach((el) => el.removeAttribute("id"));
      content
        .querySelectorAll("ul")
        .forEach((el) => el.classList.add("mm-listview"));
      if (content.tagName === "UL") content.classList.add("mm-listview");
      const items =
        content.tagName === "UL"
          ? Array.from(content.children)
          : Array.from(content.querySelectorAll("li"));
      for (const item of items) {
        item.classList.add("mm-listitem");
        const submenu = item.querySelector<HTMLElement>(
          ":scope > .dropdown,:scope > .mega-menu",
        );
        const existing = item.querySelector<HTMLElement>(
          ":scope > span,:scope > a",
        );
        if (submenu && existing) {
          const link = document.createElement("a");
          link.href = "#menu-submenu";
          link.className =
            "mm-btn mm-btn_next mm-listitem__btn mm-listitem__text";
          link.textContent = existing.textContent?.trim() || "";
          existing.replaceWith(link);
          submenu.remove();
          const nextPanel = panel(link.textContent, submenu, result);
          link.onclick = (e) => {
            e.preventDefault();
            result.classList.add("mm-hidden");
            result.classList.remove("mm-panel_opened");
            nextPanel.classList.remove("mm-hidden");
            nextPanel.classList.add("mm-panel_opened");
          };
        } else if (existing?.tagName === "A") {
          existing.classList.add("mm-listitem__text");
        }
      }
      return result;
    }
    if (rootList) {
      const first = panel("Menu", rootList);
      first.classList.remove("mm-hidden");
      first.classList.add("mm-panel_opened");
    }
    const close = document.createElement("button");
    close.type = "button";
    close.className = "reference-menu-close";
    close.textContent = "Close menu";
    close.onclick = () => dialog.close();
    dialog.append(close);
    const before = document.documentElement.style.overflow,
      transform = node.style.transform;
    document.documentElement.style.overflow = "hidden";
    document.body.append(dialog);
    node.style.transform = `translateX(${Math.min(window.innerWidth * 0.8, 440)}px)`;
    dialog.addEventListener("click", (e) => {
      if (
        e.target === dialog &&
        e.clientX > dialog.getBoundingClientRect().right
      )
        dialog.close();
    });
    opener.focus({ preventScroll: true });
    dialog.showModal();
    const restore = () => {
      document.documentElement.style.overflow = before;
      node.style.transform = transform;
      dialog.remove();
    };
    dialog.addEventListener(
      "close",
      () => {
        restore();
        opener.focus({ preventScroll: true });
      },
      { once: true },
    );
    signal.addEventListener("abort", restore, { once: true });
  }
  node.addEventListener("click", click, { signal });
  if (curated) {
    document.addEventListener(
      "click",
      (event) => {
        if (!node.contains(event.target as Node)) closeDrops();
      },
      { signal },
    );
    node.addEventListener(
      "focusout",
      (event) => {
        if (!(event.relatedTarget as Element | null)?.closest(".drop-menu"))
          closeDrops();
      },
      { signal },
    );
  }
  node.addEventListener(
    "keydown",
    (event) => {
      const target = event.target as HTMLElement;
      const menu = curated ? target.closest<HTMLElement>(".drop-menu") : null;
      if (
        curated &&
        target.matches("[data-bs-toggle=tab]") &&
        ["ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
        const tabs = Array.from(
          target
            .closest("[role=tablist]")!
            .querySelectorAll<HTMLElement>("[role=tab]"),
        );
        const next =
          (tabs.indexOf(target) +
            (event.key === "ArrowRight" ? 1 : tabs.length - 1)) %
          tabs.length;
        tabs[next]?.click();
        tabs[next]?.focus();
        return;
      }
      if (menu && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        if (!menu.classList.contains("active"))
          menu.querySelector<HTMLElement>(".select")?.click();
        const options = Array.from(
          menu.querySelectorAll<HTMLElement>(".dropdown li"),
        );
        const index = options.indexOf(target);
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? options.length - 1
              : event.key === "ArrowDown"
                ? (index + 1) % options.length
                : index <= 0
                  ? options.length - 1
                  : index - 1;
        options[next]?.focus();
        return;
      }
      if (event.key === "Escape") {
        closeDrops();
        menu?.querySelector<HTMLElement>(".select")?.focus();
        node
          .querySelectorAll(".reference-nav-open")
          .forEach((el) => el.classList.remove("reference-nav-open"));
      } else if (
        (event.key === "Enter" || event.key === " ") &&
        (event.target as Element).matches(
          "[role=button],[role=option],[role=tab]",
        )
      ) {
        event.preventDefault();
        (event.target as HTMLElement).click();
      }
    },
    { signal },
  );
  node.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const section = form.closest("section")?.className || "";
      if (
        section.includes("banner") ||
        section.includes("filter-search") ||
        form.querySelector("input[type=search]")
      )
        runSearch(form);
      else if (/calculat/.test(section)) {
        const inputs = Array.from(
          form.querySelectorAll<HTMLInputElement>("input:not([type=hidden])"),
        );
        const number = (input: HTMLInputElement | undefined) =>
          Number(input?.value.replace(/[^\d.]/g, "") || 0);
        const price =
            inputs.find((i) =>
              /price/i.test(i.getAttribute("aria-label") || ""),
            ) || inputs[0],
          rate =
            inputs.find((i) =>
              /interest/i.test(i.getAttribute("aria-label") || ""),
            ) || inputs[1],
          deposit =
            inputs.find((i) =>
              /down|deposit/i.test(i.getAttribute("aria-label") || ""),
            ) || inputs[2];
        const period =
          Array.from(
            form.querySelectorAll<HTMLElement>(".drop-menu .select span"),
          )
            .map((el) => Number(el.textContent?.replace(/[^\d.]/g, "")))
            .find((n) => n > 0) || 36;
        try {
          const result = calculateLoan(
            number(price),
            number(deposit),
            number(rate),
            period,
          );
          if ("error" in result) {
            showNotice("Check the figures", result.error);
            return;
          }
          showNotice(
            "Repayment illustration",
            `Estimated monthly repayment: $${result.monthly.toFixed(2)} for ${result.months} months. This is an illustration, not a finance offer.`,
          );
        } catch {
          showNotice(
            "Check the figures",
            "Enter a positive vehicle price, a deposit no greater than the price, a valid interest rate and a repayment period.",
          );
        }
      } else
        showNotice(
          "Preview only",
          "Your details were checked locally. No email or enquiry was sent.",
        );
    },
    { signal },
  );
  const scroll = () => {
    node
      .querySelector(".header-style-v1")
      ?.classList.toggle("fixed-header", window.scrollY > 1);
    const top =
      node.parentElement?.querySelector<HTMLElement>(".scroll-to-top");
    if (top) {
      top.style.display = window.scrollY > 100 ? "block" : "none";
      top.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  window.addEventListener("scroll", scroll, { signal, passive: true });
  scroll();
  const resize = () => carousels.forEach((c) => c.layout());
  window.addEventListener("resize", resize, { signal });
  // Offscreen lazy images must not hold up slider initialization or Back.
  const decodeImages = () =>
    Promise.all(
      Array.from(node.querySelectorAll("img"))
        .filter(
          (img) =>
            img.loading !== "lazy" || (img.complete && img.naturalWidth > 0),
        )
        .map((img) => img.decode().catch(() => {})),
    );
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve())).then(
    async () => {
      await document.fonts.ready;
      if (!alive) return;
      await decodeImages();
      if (!alive) return;
      const jq = await loadSliderLibrary();
      if (!alive) return;
      for (const config of carouselOptions as Options[])
        for (const el of node.querySelectorAll<HTMLElement>(config.selector)) {
          if (el.hasAttribute("data-static-hero")) continue;
          if (!carousels.has(el)) {
            // The dealer shelf contains Svelte save buttons. Keep it finite:
            // Slick's cloned cards do not carry their Svelte event bindings.
            const options =
              curated && el.classList.contains("car-slider-three")
                ? {
                    ...config,
                    infinite: false,
                    responsive: Array.isArray(config.responsive)
                      ? config.responsive.map((breakpoint) => ({
                          ...breakpoint,
                          settings: { ...breakpoint.settings, infinite: false },
                        }))
                      : undefined,
                  }
                : config;
            carousels.set(el, carousel(el, options, jq));
          }
        }
      await decodeImages();
      if (!alive) return;
      carousels.forEach((c) => c.layout());
      node.querySelectorAll<HTMLElement>(".wow").forEach((el) => {
        el.style.visibility = "visible";
      });
      node.dataset.ready = "true";
      document.dispatchEvent(new CustomEvent("boxcar:reference-ready"));
    },
  );
  // A concise fixture note keeps the source demo's marketing counts/copy honest.
  const note = document.createElement("p");
  note.className = "reference-preview-note";
  note.textContent = curated
    ? "Template preview · sample vehicles. Forms are local previews."
    : "Template demo · illustrative inventory, reviews and figures. Forms are local previews.";
  node.querySelector("footer")?.append(note);
  return {
    destroy() {
      alive = false;
      abort.abort();
      Array.from(carousels.values())
        .reverse()
        .forEach((c) => c.destroy());
      delete node.dataset.ready;
      note.remove();
    },
  };
}
