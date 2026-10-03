"use client";

import type { VehicleListing } from "@repo/marketplace";
import { Bookmark, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import {
  formatVehicleCardMoney,
  getShowroomVehicleHeading,
} from "../lib/vehicle-card-policy";
import styles from "./desktop-saved-cars.module.css";
import Image from "./public-image";

interface SavedCar {
  href: string;
  id: string;
  image: string;
  price: string;
  title: string;
}
const storageKey = "modern-desktop-saved-cars-v1";
const empty: SavedCar[] = [];
let snapshot = empty;
let initialized = false;
const listeners = new Set<() => void>();
function readSavedCars() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(value)
      ? value
          .filter(
            (car): car is SavedCar =>
              car &&
              [car.id, car.title, car.href, car.image, car.price].every(
                (v) => typeof v === "string"
              ) &&
              car.href.startsWith("/") &&
              !car.href.startsWith("//")
          )
          .slice(0, 100)
      : empty;
  } catch {
    return empty;
  }
}
function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    snapshot = readSavedCars();
    initialized = true;
  }
  return snapshot;
}
function onStorage(event: StorageEvent) {
  if (event.key === storageKey || event.key === null) {
    snapshot = readSavedCars();
    for (const listener of listeners) {
      listener();
    }
  }
}
function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}
function toggleCar(car: SavedCar) {
  const current = getSnapshot();
  snapshot = current.some((item) => item.id === car.id)
    ? current.filter((item) => item.id !== car.id)
    : [...current, car].slice(-100);
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    /* The shortlist remains available for this visit. */
  }
  for (const listener of listeners) {
    listener();
  }
}
function useSavedCars() {
  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}

/** Boxcar's bookmark action, isolated from the existing mobile card and account routes. */
export function DesktopSaveCarButton({
  listing,
  href,
  locale,
  presentation = "bookmark",
}: {
  listing: VehicleListing;
  href: string;
  locale?: string;
  presentation?: "bookmark" | "action";
}) {
  const saved = useSavedCars().some((car) => car.id === listing.id);
  const isBg = locale?.startsWith("bg");
  const heading = getShowroomVehicleHeading(listing, locale);
  const saveLabel = isBg ? "Запази" : "Save";
  const removeLabel = isBg ? "Премахни" : "Unsave";
  const savedLabel = isBg ? "Запазен" : "Saved";
  return (
    <button
      aria-label={`${saved ? removeLabel : saveLabel} ${heading.title}`}
      aria-pressed={saved}
      className={styles.bookmark}
      data-presentation={presentation}
      data-slot="desktop-save-car"
      onClick={() =>
        toggleCar({
          id: listing.id,
          title: heading.title,
          href,
          image: listing.images[0]?.url ?? "",
          price: formatVehicleCardMoney(listing.price, "comparison", locale),
        })
      }
      type="button"
    >
      <Bookmark aria-hidden fill={saved ? "currentColor" : "none"} size={18} />
      {presentation === "action" ? (
        <span>{saved ? savedLabel : saveLabel}</span>
      ) : null}
    </button>
  );
}

export function DesktopSavedCars({ locale }: { locale?: string }) {
  const saved = useSavedCars();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const isBg = locale?.startsWith("bg");
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnMobile = () => {
      if (!desktop.matches) {
        dialog.current?.close();
      }
    };
    desktop.addEventListener("change", closeOnMobile);
    return () => desktop.removeEventListener("change", closeOnMobile);
  }, []);
  return (
    <>
      <button
        className={styles.saved}
        data-slot="desktop-saved-cars"
        onClick={() => dialog.current?.showModal()}
        ref={opener}
        type="button"
      >
        <Bookmark aria-hidden size={18} />
        <span>
          {isBg ? "Запазени" : "Saved"}
          {saved.length > 0 ? ` (${saved.length})` : ""}
        </span>
      </button>
      <dialog
        aria-labelledby={titleId}
        className={styles.dialog}
        onClose={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) {
            opener.current?.focus();
          }
        }}
        ref={dialog}
      >
        <div className={styles.heading}>
          <h2 id={titleId}>{isBg ? "Запазени автомобили" : "Saved cars"}</h2>
          <button
            aria-label={isBg ? "Затвори" : "Close saved cars"}
            onClick={() => dialog.current?.close()}
            type="button"
          >
            <X aria-hidden size={22} />
          </button>
        </div>
        {saved.length === 0 ? (
          <p>
            {isBg
              ? "Запазете автомобил с отметката върху снимката, за да го намерите тук."
              : "Bookmark a car to keep your shortlist here."}
          </p>
        ) : (
          <div className={styles.grid}>
            {saved.map((car) => (
              <article key={car.id}>
                <Link href={car.href} onClick={() => dialog.current?.close()}>
                  {car.image && (
                    <Image alt="" height={280} src={car.image} width={420} />
                  )}
                  <h3>{car.title}</h3>
                  <p>{car.price}</p>
                </Link>
                <button onClick={() => toggleCar(car)} type="button">
                  {isBg ? "Премахни" : "Remove"}
                </button>
              </article>
            ))}
          </div>
        )}
      </dialog>
    </>
  );
}
