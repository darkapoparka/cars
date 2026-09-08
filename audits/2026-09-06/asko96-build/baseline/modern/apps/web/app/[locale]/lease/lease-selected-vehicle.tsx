"use client";

import { CarFront, Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  type FinancingVehicleOption,
  leaseSelectorCopy,
} from "./lease-finance-policy";

export function LeaseSelectedVehicle({
  locale,
  onClear,
  onSelect,
  selected = false,
  vehicle,
}: {
  locale: "bg" | "en";
  onClear?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  vehicle: FinancingVehicleOption;
}) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const facts = [
    [locale === "bg" ? "Година" : "Year", vehicle.yearLabel],
    [locale === "bg" ? "Пробег" : "Mileage", vehicle.mileageLabel],
    [locale === "bg" ? "Гориво" : "Fuel", vehicle.fuelLabel],
    [
      locale === "bg" ? "Скоростна кутия" : "Transmission",
      vehicle.transmissionLabel,
    ],
  ];

  return (
    <article
      className={`relative grid min-h-[8.75rem] grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-xl bg-white ${onSelect ? "" : "mt-4"}`}
      data-slot={
        onSelect ? "lease-vehicle-option" : "lease-selected-vehicle-card"
      }
    >
      <div className="relative min-h-[8.75rem] overflow-hidden bg-zinc-100">
        {failedImageUrl === vehicle.imageUrl ? (
          <div className="absolute inset-0 grid place-items-center text-zinc-400">
            <CarFront aria-hidden="true" className="size-9" />
          </div>
        ) : (
          <Image
            alt={vehicle.imageAlt}
            className="object-cover"
            fill
            onError={() => setFailedImageUrl(vehicle.imageUrl)}
            sizes="120px"
            src={vehicle.imageUrl}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2 px-3 py-2.5">
        <div className="min-w-0 space-y-0.5">
          <h2
            className="line-clamp-2 font-semibold text-[16px] text-zinc-950 leading-5 tracking-tight"
            data-slot="lease-selected-vehicle-title"
            title={vehicle.title}
          >
            {vehicle.title}
          </h2>
          <p
            className="font-bold text-[18px] text-zinc-950 tabular-nums leading-5 tracking-tight"
            data-slot="lease-selected-vehicle-price"
          >
            {vehicle.priceLabel}
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-1 min-[360px]:grid-cols-2">
          {facts.map(([label, value]) => (
            <div
              className="flex h-6 min-w-0 items-center rounded-md bg-zinc-100 px-2 font-medium text-[11px] text-zinc-700"
              key={label}
            >
              <dt className="sr-only">{label}</dt>
              <dd
                className="truncate tabular-nums"
                title={`${label}: ${value}`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {onSelect ? (
        <button
          aria-label={`${vehicle.title}, ${vehicle.priceLabel}`}
          aria-pressed={selected}
          className="absolute inset-0 rounded-xl focus-visible:outline-2 focus-visible:outline-zinc-950 focus-visible:outline-offset-[-2px] active:bg-black/5"
          data-vehicle-selected={selected}
          onClick={onSelect}
          type="button"
        >
          {selected ? (
            <span className="absolute top-1.5 left-1.5 grid size-8 place-items-center rounded-full bg-white text-[var(--lead-site-accent)]">
              <Check aria-hidden="true" className="size-5" />
            </span>
          ) : null}
        </button>
      ) : null}
      {onClear ? (
        <button
          aria-label={leaseSelectorCopy[locale].clearSelection}
          className="absolute top-1.5 left-1.5 grid size-11 place-items-center rounded-full bg-white text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:bg-zinc-200"
          onClick={onClear}
          title={leaseSelectorCopy[locale].clearSelection}
          type="button"
        >
          <X aria-hidden="true" className="size-[18px]" />
        </button>
      ) : null}
    </article>
  );
}
