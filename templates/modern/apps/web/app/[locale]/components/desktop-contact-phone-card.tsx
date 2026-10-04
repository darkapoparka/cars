"use client";

import { Check, Copy, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./boxcar-desktop-pages.module.css";

export function DesktopContactPhoneCard({
  locale,
  phoneDisplay,
  phoneHref,
}: {
  locale: "bg" | "en";
  phoneDisplay: string;
  phoneHref: string;
}) {
  const isBg = locale === "bg";
  const [copyState, setCopyState] = useState<"idle" | "copied" | "selected">(
    "idle"
  );
  const numberRef = useRef<HTMLParagraphElement>(null);
  const copyingRef = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyLabel = isBg ? "Копирайте номера" : "Copy phone number";
  const feedback = {
    idle: "",
    copied: isBg ? "Номерът е копиран" : "Phone number copied",
    selected: isBg ? "Копирайте избрания номер" : "Copy the selected number",
  }[copyState];

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    },
    []
  );

  const copyNumber = async () => {
    if (copyingRef.current) {
      return;
    }
    copyingRef.current = true;
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }
    try {
      await navigator.clipboard.writeText(phoneDisplay);
      setCopyState("copied");
      resetTimer.current = setTimeout(() => setCopyState("idle"), 3000);
    } catch {
      if (numberRef.current) {
        const range = document.createRange();
        range.selectNodeContents(numberRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopyState("selected");
    } finally {
      copyingRef.current = false;
    }
  };

  return (
    <div
      className={`${styles.contactCard} ${styles.phoneCard}`}
      data-slot="desktop-contact-phone-card"
    >
      <a className={styles.contactCardMain} href={phoneHref}>
        <Phone aria-hidden size={26} />
        <div>
          <h3 className={styles.phoneTitle}>
            <span className={styles.phoneTitleRest}>
              {isBg ? "Телефон" : "Phone"}
            </span>
            <span className={styles.phoneTitleActive}>
              {isBg ? "Обадете се" : "Call us"}
            </span>
          </h3>
          <p ref={numberRef}>{phoneDisplay}</p>
        </div>
      </a>
      <button
        aria-label={feedback || copyLabel}
        className={styles.copyPhone}
        data-copy-state={copyState}
        onClick={copyNumber}
        title={feedback || copyLabel}
        type="button"
      >
        {copyState === "copied" ? (
          <Check aria-hidden size={18} />
        ) : (
          <Copy aria-hidden size={18} />
        )}
      </button>
      <output aria-live="polite" className="sr-only">
        {feedback}
      </output>
    </div>
  );
}
