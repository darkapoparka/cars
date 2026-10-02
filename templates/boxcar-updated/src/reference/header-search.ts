import { detailHref, money, vehicles } from "../lib/catalog";
import { filterVehicles, parseFilters } from "../lib/domain";
import { navigate } from "../lib/router.svelte";

export function initializeHeaderSearch(root: HTMLElement, signal: AbortSignal) {
  for (const [index, layout] of Array.from(
    root.querySelectorAll<HTMLElement>(".layout-search"),
  ).entries()) {
    const input = layout.querySelector<HTMLInputElement>(".show-search");
    const popup = layout.querySelector<HTMLElement>(".box-content-search");
    const list = popup?.querySelector<HTMLElement>(".box-car-search");
    const more = popup?.querySelector<HTMLAnchorElement>(".btn-view-search");
    const template = list
      ?.querySelector<HTMLLIElement>("li")
      ?.cloneNode(true) as HTMLLIElement | undefined;
    if (!input || !popup || !list || !more || !template) continue;

    list.id = `reference-search-${root.dataset.referenceHome}-${index}`;
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", "Matching vehicles");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("aria-controls", list.id);
    input.autocomplete = "off";
    input.spellcheck = false;
    more.tabIndex = 0;
    let active = -1;
    let options: HTMLAnchorElement[] = [];
    let query: string | undefined;

    const select = (next: number) => {
      active = next;
      options.forEach((option, i) => {
        option.setAttribute("aria-selected", String(i === active));
      });
      const selected = options[active];
      if (selected) {
        input.setAttribute("aria-activedescendant", selected.id);
        selected.scrollIntoView({ block: "nearest" });
      } else input.removeAttribute("aria-activedescendant");
    };
    const open = (visible: boolean) => {
      layout.classList.toggle("active", visible);
      popup.classList.toggle("active", visible);
      popup.inert = !visible;
      input.setAttribute("aria-expanded", String(visible));
      if (!visible) select(-1);
    };
    const refresh = () => {
      const text = input.value.trim();
      if (text !== query) {
        query = text;
        const search = new URLSearchParams({ q: text });
        const matches = filterVehicles(vehicles, parseFilters("?" + search));
        options = [];
        list.replaceChildren(
          ...matches.slice(0, 6).map((vehicle) => {
            const item = template.cloneNode(true) as HTMLLIElement;
            item.setAttribute("role", "presentation");
            const link = item.querySelector<HTMLAnchorElement>("a")!;
            link.href = detailHref(vehicle);
            link.id = `${list.id}-${vehicle.id}`;
            link.setAttribute("role", "option");
            link.setAttribute("aria-selected", "false");
            link.tabIndex = -1;
            const image = item.querySelector("img")!;
            image.src = vehicle.image;
            image.alt = "";
            item.querySelector(".name")!.textContent = vehicle.title;
            item.querySelector(".price")!.textContent = money(vehicle.price);
            options.push(link);
            return item;
          }),
        );
        if (!matches.length) {
          const empty = document.createElement("li");
          empty.className = "reference-search-empty";
          empty.setAttribute("role", "presentation");
          empty.textContent = "No matching cars. Try another make or model.";
          list.append(empty);
        }
        more.href = "/inventory/" + (text ? "?" + search : "");
        more.replaceChildren(
          document.createTextNode(
            `View all ${matches.length} ${matches.length === 1 ? "car" : "cars"}`,
          ),
          ...Array.from(more.querySelectorAll("svg")),
        );
        select(-1);
      }
      open(true);
    };
    open(false);
    input.addEventListener("input", refresh, { signal });
    input.addEventListener("focus", refresh, { signal });
    input.addEventListener("click", refresh, { signal });
    layout.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          input.focus({ preventScroll: true });
          open(false);
        } else if (event.target !== input) return;
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          refresh();
          if (options.length && popup.classList.contains("active")) {
            select(
              event.key === "ArrowDown"
                ? (active + 1) % options.length
                : active < 0
                  ? options.length - 1
                  : (active - 1 + options.length) % options.length,
            );
          }
        } else if (event.key === "Enter") {
          event.preventDefault();
          const href = popup.classList.contains("active")
            ? options[active]?.href
            : undefined;
          const text = input.value.trim();
          open(false);
          void navigate(
            href ||
              "/inventory/" +
                (text ? "?" + new URLSearchParams({ q: text }) : ""),
          );
        }
      },
      { signal },
    );
    let pointerInside = false;
    document.addEventListener(
      "pointerdown",
      (event) => {
        pointerInside = layout.contains(event.target as Node);
        if (!pointerInside) open(false);
      },
      { signal },
    );
    document.addEventListener(
      "focusin",
      (event) => {
        // WebKit focuses the main container while a suggestion is being clicked.
        // Keep the link visible until the click has reached the router.
        if (!pointerInside && !layout.contains(event.target as Node))
          open(false);
      },
      { signal },
    );
    const finishPointer = () => {
      pointerInside = false;
      if (!layout.contains(document.activeElement)) open(false);
    };
    document.addEventListener("click", finishPointer, { signal });
    document.addEventListener("pointercancel", finishPointer, { signal });
  }
}
