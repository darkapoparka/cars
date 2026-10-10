<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { locales } from "#lib/i18n/locales.ts";
  import { tick, untrack } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import type { Attachment } from "svelte/attachments";
  import type { HTMLInputAttributes } from "svelte/elements";
  import {
    calendarDays,
    dateAt,
    formatDate,
    months,
    moveMonth,
    parseDate,
  } from "#lib/calendar.ts";
  const generatedId = $props.id();
  const phone = new MediaQuery("(max-width: 767.98px)", false);
  let {
    value = $bindable(""),
    class: className = "desktop-type-body",
    id = generatedId,
    ...attributes
  }: Omit<HTMLInputAttributes, "value" | "type" | "class" | "id"> & {
    value?: string;
    class?: string;
    id?: string;
  } = $props();
  let input: HTMLInputElement | undefined;
  const ownInput: Attachment<HTMLInputElement> = (node) => {
    input = node;
    return () => {
      if (input === node) input = undefined;
    };
  };
  let popup = $state<HTMLDivElement>();
  let open = $state(false);
  let restoringFocus = false;
  const selected = $derived(parseDate(value));
  let cursor = $state(untrack(() => parseDate(value) || new Date()));
  let left = $state(0);
  let top = $state(0);
  let mode = $state<"days" | "months" | "years">("days");
  const days = $derived(calendarDays(cursor.getFullYear(), cursor.getMonth()));
  const decade = $derived(Math.floor(cursor.getFullYear() / 10) * 10);
  const label = $derived(
    new Intl.DateTimeFormat(locales[locale.locale].format, {
      month: "long",
      year: "numeric",
    }).format(cursor),
  );
  const weekLabels = $derived(
    Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(locales[locale.locale].format, {
        weekday: "short",
      }).format(dateAt(2025, 0, 5 + index)),
    ),
  );
  const monthLabels = $derived(
    Array.from({ length: 12 }, (_, index) =>
      new Intl.DateTimeFormat(locales[locale.locale].format, {
        month: "short",
      }).format(dateAt(2025, index, 1)),
    ),
  );
  function calendarDateLabel(date: Date) {
    return new Intl.DateTimeFormat(locales[locale.locale].format, {
      dateStyle: "long",
    }).format(date);
  }
  const numeric = $derived(className.includes("calendar-date"));
  function position() {
    if (!open || !input?.isConnected) return;
    const box = input.getBoundingClientRect();
    const width = popup?.offsetWidth || 340;
    left =
      Math.max(10, Math.min(box.left, window.innerWidth - width - 10)) +
      window.scrollX;
    top = box.bottom + window.scrollY;
  }
  async function show(keyboard = false) {
    if (restoringFocus) return;
    if (open) {
      if (keyboard) {
        if (selected) cursor = selected;
        void focusCursor();
      }
      return;
    }
    const now = new Date();
    cursor =
      selected || dateAt(now.getFullYear(), now.getMonth(), now.getDate());
    mode = "days";
    open = true;
    await tick();
    if (!open || !input?.isConnected) return;
    position();
    if (keyboard) void focusCursor();
  }
  function close(restore = false) {
    open = false;
    if (restore && input?.isConnected) {
      restoringFocus = true;
      input.focus({ preventScroll: true });
      queueMicrotask(() => {
        restoringFocus = false;
      });
    }
  }
  function choose(date: Date) {
    if (!input?.isConnected) return;
    value = formatDate(date, numeric);
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    close(true);
  }
  async function focusCursor() {
    await tick();
    if (!open || !popup?.isConnected) return;
    const selector =
      mode === "days"
        ? `[data-date="${cursor.getTime()}"]`
        : `[data-calendar-period="${mode === "months" ? cursor.getMonth() : cursor.getFullYear()}"]`;
    popup
      ?.querySelector<HTMLButtonElement>(selector)
      ?.focus({ preventScroll: true });
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === "Tab") {
      // Resume the page's tab order from the owning input, not the body portal.
      close(true);
      return;
    }
    if (
      mode !== "days" ||
      !(event.target instanceof HTMLElement) ||
      !event.target.hasAttribute("data-date")
    )
      return;
    const offset: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -cursor.getDay(),
      End: 6 - cursor.getDay(),
    };
    if (event.key === "PageUp" || event.key === "PageDown")
      cursor = moveMonth(
        cursor,
        (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1),
      );
    else if (Object.hasOwn(offset, event.key))
      cursor = dateAt(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate() + offset[event.key],
      );
    else return;
    event.preventDefault();
    void focusCursor();
  }
  const portal: Attachment<HTMLDivElement> = (node) => {
    popup = node;
    document.body.appendChild(node);
    return () => {
      if (popup === node) popup = undefined;
      node.remove();
    };
  };
  function dismiss(event: PointerEvent) {
    if (
      open &&
      event.target instanceof Node &&
      !popup?.contains(event.target) &&
      event.target !== input
    )
      close();
  }
</script>

<svelte:document onpointerdown={dismiss} />
<svelte:window onresize={position} onscrollcapture={position} />

<input
  {...attributes}
  {id}
  class={className}
  type="text"
  role="combobox"
  aria-autocomplete="none"
  bind:value
  {@attach ownInput}
  data-widget-ready="true"
  aria-haspopup="dialog"
  aria-expanded={open}
  aria-controls={open ? `${id}-calendar` : undefined}
  autocomplete="off"
  onclick={() => show()}
  onfocus={() => show()}
  onkeydown={(event) => {
    if (event.key === "ArrowDown" || event.key === "F4") {
      event.preventDefault();
      void show(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      close();
    }
  }}
/>
{#if open}
  <div
    {@attach portal}
    id={`${id}-calendar`}
    class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom karento-calendar"
    style:left={`${left}px`}
    style:top={`${top}px`}
    style:display="block"
    role="dialog"
    aria-label={locale.t("ui.calendar-input.choose-a-date")}
    tabindex="-1"
    onkeydown={keydown}
  >
    <div class="datepicker-days">
      <table class="table-condensed" role="grid" aria-label={label}>
        <thead>
          <tr
            ><th class="prev"
              ><button
                type="button"
                aria-label={locale.t(
                  mode === "years"
                    ? "calendar.previous.decade"
                    : mode === "months"
                      ? "calendar.previous.year"
                      : "calendar.previous.month",
                )}
                onclick={() => {
                  cursor = moveMonth(
                    cursor,
                    mode === "years" ? -120 : mode === "months" ? -12 : -1,
                  );
                }}
                >{#if phone.current}<MobileIcon
                    name="chevron-left"
                    size="action"
                  />{/if}</button
              ></th
            ><th colspan="5" class="datepicker-switch"
              ><button
                class="desktop-type-control"
                type="button"
                aria-live="polite"
                onclick={() => {
                  mode = mode === "days" ? "months" : "years";
                }}
                >{mode === "days"
                  ? label
                  : mode === "months"
                    ? cursor.getFullYear()
                    : `${decade}–${decade + 9}`}</button
              ></th
            ><th class="next"
              ><button
                type="button"
                aria-label={locale.t(
                  mode === "years"
                    ? "calendar.next.decade"
                    : mode === "months"
                      ? "calendar.next.year"
                      : "calendar.next.month",
                )}
                onclick={() => {
                  cursor = moveMonth(
                    cursor,
                    mode === "years" ? 120 : mode === "months" ? 12 : 1,
                  );
                }}
                >{#if phone.current}<MobileIcon
                    name="chevron-right"
                    size="action"
                  />{/if}</button
              ></th
            ></tr
          >
          {#if mode === "days"}<tr
              >{#each weekLabels as day (day)}<th
                  class="dow desktop-type-label"
                  scope="col">{day}</th
                >{/each}</tr
            >{/if}
        </thead>
        <tbody>
          {#if mode === "days"}
            {#each Array.from({ length: 6 }, (_, i) => i) as row (days[row * 7].getTime())}
              <tr
                >{#each days.slice(row * 7, row * 7 + 7) as date (date.getTime())}<td
                    class={[
                      "day",
                      {
                        old:
                          date <
                          dateAt(cursor.getFullYear(), cursor.getMonth(), 1),
                        new:
                          date >
                          dateAt(
                            cursor.getFullYear(),
                            cursor.getMonth() + 1,
                            0,
                          ),
                        active: selected?.getTime() === date.getTime(),
                      },
                    ]}
                    aria-selected={selected?.getTime() === date.getTime()}
                    ><button
                      class="desktop-type-body-small"
                      type="button"
                      data-date={date.getTime()}
                      aria-label={calendarDateLabel(date)}
                      tabindex={date.getTime() === cursor.getTime() ? 0 : -1}
                      onfocus={() => {
                        cursor = date;
                      }}
                      onclick={() => choose(date)}>{date.getDate()}</button
                    ></td
                  >{/each}</tr
              >
            {/each}
          {:else}
            <tr
              ><td colspan="7"
                ><div class="karento-calendar-options"
                  >{#each Array.from({ length: 12 }, (_, i) => i) as i (mode === "years" ? decade - 1 + i : months[i])}<button
                      class="desktop-type-body-small"
                      type="button"
                      data-calendar-period={mode === "years"
                        ? decade - 1 + i
                        : i}
                      onclick={() => {
                        cursor = dateAt(
                          mode === "years"
                            ? decade - 1 + i
                            : cursor.getFullYear(),
                          mode === "years" ? cursor.getMonth() : i,
                          1,
                        );
                        mode = mode === "years" ? "months" : "days";
                        void focusCursor();
                      }}
                      >{mode === "years"
                        ? decade - 1 + i
                        : monthLabels[i]}</button
                    >{/each}</div
                ></td
              ></tr
            >
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{/if}
