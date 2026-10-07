<script lang="ts">
  import { tick, untrack } from "svelte";
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
  let {
    value = $bindable(""),
    class: className = "",
    id = generatedId,
    ...attributes
  }: Omit<HTMLInputAttributes, "value" | "type" | "class" | "id"> & {
    value?: string;
    class?: string;
    id?: string;
  } = $props();
  let input: HTMLInputElement;
  let popup = $state<HTMLDivElement>();
  let open = $state(false);
  let restoringFocus = false;
  let selected = $state<Date | null>(null);
  let cursor = $state(untrack(() => parseDate(value) || new Date()));
  let left = $state(0);
  let top = $state(0);
  let mode = $state<"days" | "months" | "years">("days");
  const days = $derived(calendarDays(cursor.getFullYear(), cursor.getMonth()));
  const decade = $derived(Math.floor(cursor.getFullYear() / 10) * 10);
  const label = $derived(
    `${months[cursor.getMonth()]} ${cursor.getFullYear()}`,
  );
  const numeric = $derived(className.includes("calendar-date"));
  function position() {
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
      if (keyboard) void focusDate();
      return;
    }
    selected = parseDate(value);
    const now = new Date();
    cursor =
      selected || dateAt(now.getFullYear(), now.getMonth(), now.getDate());
    mode = "days";
    open = true;
    await tick();
    position();
    if (keyboard) focusDate();
  }
  function close(restore = false) {
    open = false;
    if (restore) {
      restoringFocus = true;
      input.focus({ preventScroll: true });
      queueMicrotask(() => {
        restoringFocus = false;
      });
    }
  }
  function choose(date: Date) {
    value = formatDate(date, numeric);
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    close(true);
  }
  async function focusDate() {
    await tick();
    popup
      ?.querySelector<HTMLButtonElement>(`[data-date="${cursor.getTime()}"]`)
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
    void focusDate();
  }
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
  $effect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !popup?.contains(event.target) &&
        event.target !== input
      )
        close();
    };
    document.addEventListener("pointerdown", dismiss);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  });
</script>

<input
  {...attributes}
  {id}
  class={className}
  type="text"
  role="combobox"
  aria-autocomplete="none"
  bind:value
  bind:this={input}
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
    bind:this={popup}
    use:portal
    id={`${id}-calendar`}
    class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom karento-calendar"
    style:left={`${left}px`}
    style:top={`${top}px`}
    style:display="block"
    role="dialog"
    aria-label="Choose a date"
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
                aria-label={`Previous ${mode === "years" ? "decade" : mode === "months" ? "year" : "month"}`}
                onclick={() => {
                  cursor = moveMonth(
                    cursor,
                    mode === "years" ? -120 : mode === "months" ? -12 : -1,
                  );
                }}
              ></button></th
            ><th colspan="5" class="datepicker-switch"
              ><button
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
                aria-label={`Next ${mode === "years" ? "decade" : mode === "months" ? "year" : "month"}`}
                onclick={() => {
                  cursor = moveMonth(
                    cursor,
                    mode === "years" ? 120 : mode === "months" ? 12 : 1,
                  );
                }}
              ></button></th
            ></tr
          >
          {#if mode === "days"}<tr
              >{#each ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as day}<th
                  class="dow"
                  scope="col">{day}</th
                >{/each}</tr
            >{/if}
        </thead>
        <tbody>
          {#if mode === "days"}
            {#each Array.from({ length: 6 }, (_, i) => i) as row}
              <tr
                >{#each days.slice(row * 7, row * 7 + 7) as date}<td
                    class:old={date <
                      dateAt(cursor.getFullYear(), cursor.getMonth(), 1)}
                    class:new={date >
                      dateAt(cursor.getFullYear(), cursor.getMonth() + 1, 0)}
                    class:active={selected?.getTime() === date.getTime()}
                    class="day"
                    aria-selected={selected?.getTime() === date.getTime()}
                    ><button
                      type="button"
                      data-date={date.getTime()}
                      aria-label={formatDate(date, false)}
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
                  >{#each Array.from({ length: 12 }, (_, i) => i) as i}<button
                      type="button"
                      onclick={() => {
                        cursor = dateAt(
                          mode === "years"
                            ? decade - 1 + i
                            : cursor.getFullYear(),
                          mode === "years" ? cursor.getMonth() : i,
                          1,
                        );
                        mode = mode === "years" ? "months" : "days";
                      }}
                      >{mode === "years"
                        ? decade - 1 + i
                        : months[i].slice(0, 3)}</button
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
