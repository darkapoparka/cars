"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  MobileMarketplaceOverlayCloseAction,
  MobileMarketplaceOverlayHeader,
  MobileMarketplaceOverlayShell,
} from "@repo/marketplace-ui/components/mobile-marketplace-overlay";
import { ArrowRight, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MobileImportSourceSearchProps {
  actionHref: string;
  defaultOrigin?: string;
  defaultSourceUrl: string;
  label: string;
  locale: "bg" | "en";
  placeholder: string;
  submitLabel: string;
}

const overlayCopy = {
  bg: {
    clear: "Изчистете линка",
    close: "Затворете търсенето",
    description:
      "Поставете директен линк към конкретна автомобилна обява и продължете към заявката за внос.",
    hint: "Поставете директен линк към конкретната обява. Ще го пренесем в заявката ви за внос.",
    open: "Отворете полето за линк към обява",
    title: "Линк към обява за внос",
  },
  en: {
    clear: "Clear listing link",
    close: "Close import search",
    description:
      "Paste a direct link to a specific vehicle listing and continue to the import request.",
    hint: "Paste a direct link to the specific listing. We will carry it into your import request.",
    open: "Open vehicle listing link field",
    title: "Import listing link",
  },
} as const;

export const MobileImportSourceSearch = ({
  actionHref,
  defaultOrigin,
  defaultSourceUrl,
  label,
  locale,
  placeholder,
  submitLabel,
}: MobileImportSourceSearchProps) => {
  const copy = overlayCopy[locale];
  const [open, setOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(defaultSourceUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSourceUrl(defaultSourceUrl);
  }, [defaultSourceUrl]);

  return (
    <>
      <search className="block">
        <button
          aria-haspopup="dialog"
          aria-label={copy.open}
          className="flex h-[52px] w-full items-center gap-2 rounded-full bg-white px-4 text-left text-zinc-950 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-[var(--lead-site-accent-ring)] active:bg-zinc-200"
          onClick={() => setOpen(true)}
          ref={triggerRef}
          type="button"
        >
          <Search
            aria-hidden="true"
            className="size-[18px] shrink-0 text-zinc-500"
          />
          <span
            className={`min-w-0 flex-1 truncate text-[15px] ${
              sourceUrl ? "text-zinc-950" : "text-zinc-500"
            }`}
          >
            {sourceUrl || placeholder}
          </span>
          <ChevronRight
            aria-hidden="true"
            className="size-5 shrink-0 text-zinc-950"
          />
        </button>
      </search>

      <MobileMarketplaceOverlayShell
        className="z-[80]"
        contentDataSlot="mobile-import-source-search"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          window.requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
          });
        }}
        onOpenChange={setOpen}
        open={open}
      >
        <MobileMarketplaceOverlayHeader
          description={copy.description}
          rightAction={
            <MobileMarketplaceOverlayCloseAction ariaLabel={copy.close} />
          }
          title={copy.title}
        />

        <form
          action={actionHref}
          className="flex min-h-0 flex-1 flex-col"
          method="get"
          onSubmit={() => setOpen(false)}
        >
          {defaultOrigin ? (
            <input name="origin" type="hidden" value={defaultOrigin} />
          ) : null}

          <div
            className="shrink-0 px-3 pb-3"
            data-slot="mobile-import-source-search-header"
          >
            <label className="flex h-[52px] min-w-0 items-center gap-1 rounded-full bg-zinc-100 p-1 pl-3">
              <Search
                aria-hidden="true"
                className="size-[18px] shrink-0 text-zinc-600"
                strokeWidth={2}
              />
              <input
                aria-label={label}
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[16px] text-zinc-950 outline-none placeholder:text-zinc-600"
                inputMode="url"
                maxLength={500}
                name="sourceUrl"
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder={placeholder}
                ref={inputRef}
                required
                spellCheck={false}
                type="url"
                value={sourceUrl}
              />
              {sourceUrl.trim() ? (
                <Button
                  aria-label={copy.clear}
                  className="size-11 shrink-0 rounded-full bg-zinc-200 p-0 text-zinc-950 shadow-none hover:bg-zinc-300 active:bg-zinc-300"
                  onClick={() => setSourceUrl("")}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X aria-hidden="true" className="size-[18px]" />
                </Button>
              ) : null}
            </label>
          </div>

          <div
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            data-slot="mobile-import-source-search-body"
          >
            <p className="rounded-xl bg-zinc-50 px-3.5 py-3 text-[14px] text-zinc-600 leading-5">
              {copy.hint}
            </p>

            <Button
              className="mt-6 h-12 w-full justify-between rounded-xl bg-[var(--lead-site-accent)] px-4 font-semibold text-[15px] text-white shadow-none hover:bg-[var(--lead-site-accent-hover)] active:bg-[var(--lead-site-accent-hover)]"
              disabled={!sourceUrl.trim()}
              type="submit"
            >
              <span>{submitLabel}</span>
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            </Button>
          </div>
        </form>
      </MobileMarketplaceOverlayShell>
    </>
  );
};
