"use client";

import { mobileDealerContentClassName } from "@repo/marketplace-ui";
import { ArrowRight, ChevronRight, ScanLine } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { MobileDealerServiceHero } from "./mobile-dealer-service-hero";
import {
  mobileSellVehicleCopy,
  normalizeVehicleVin,
} from "./mobile-sell-vehicle-policy";
import { MobileServiceHelpButton } from "./mobile-service-help";

export const MobileSellVehicleHero = ({
  inventoryShelf,
  locale,
  onOpenDetails,
  onOpenInfo,
  onVinChange,
  vin,
}: {
  inventoryShelf: ReactNode;
  locale: "bg" | "en";
  onOpenDetails: (vin?: string) => void;
  onOpenInfo: () => void;
  onVinChange: (vin: string) => void;
  vin: string;
}) => {
  const content = mobileSellVehicleCopy[locale];
  const openWithVin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const vinInput =
      event.currentTarget.querySelector<HTMLInputElement>('input[name="vin"]');
    onOpenDetails(vinInput ? normalizeVehicleVin(vinInput.value) : vin);
  };

  return (
    <div className="bg-background lg:hidden">
      <MobileDealerServiceHero
        helpAction={
          <MobileServiceHelpButton
            onClick={onOpenInfo}
            title={content.howTitle}
          />
        }
        imageSrc="/images/sell/day-night-mobile-studio-v1.png"
        locale={locale}
        tone="sell"
      >
        <div className="h-full">
          <form
            className="flex h-[52px] items-center gap-2 rounded-full bg-white p-1 pl-4 text-zinc-950 focus-within:outline-2 focus-within:outline-zinc-900 focus-within:outline-offset-2"
            data-slot="mobile-sell-vin-entry"
            onSubmit={openWithVin}
          >
            <ScanLine
              aria-hidden="true"
              className="size-[18px] shrink-0 text-zinc-500"
            />
            <label className="min-w-0 flex-1">
              <span className="sr-only">{content.vin}</span>
              <input
                autoCapitalize="characters"
                className="h-11 w-full min-w-0 bg-transparent text-base uppercase outline-none placeholder:text-zinc-500 placeholder:normal-case"
                maxLength={17}
                minLength={17}
                name="vin"
                onChange={(event) =>
                  onVinChange(normalizeVehicleVin(event.target.value))
                }
                pattern="[A-HJ-NPR-Z0-9]{17}"
                placeholder={content.vin}
                required
                spellCheck={false}
                value={vin}
              />
            </label>
            <button
              aria-label={content.openForm}
              className="grid size-11 shrink-0 place-items-center rounded-full text-zinc-950 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-zinc-900 active:bg-zinc-100"
              type="submit"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </form>
        </div>
      </MobileDealerServiceHero>
      <div
        className={`${mobileDealerContentClassName} pb-4`}
        data-slot="mobile-dealer-content"
      >
        <h1 className="text-center font-semibold text-[20px] text-zinc-950 leading-6">
          {content.title}
        </h1>
        <p className="mt-2 text-center text-[15px] text-zinc-600 leading-6">
          {content.description}
        </p>
        <button
          className="mt-4 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-[var(--lead-site-accent)] px-4 py-3 text-left font-semibold text-[15px] text-white focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:opacity-90"
          onClick={() => onOpenDetails()}
          type="button"
        >
          <span>{content.noVin}</span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </button>
      </div>
      {inventoryShelf}
    </div>
  );
};
