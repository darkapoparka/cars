"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import {
  type DesktopFullFilterEntry,
  type DesktopFullFilterSection,
  desktopFullFilterSections,
  getDesktopFullFilterLabel,
  getDesktopFullFilterSummary,
} from "../lib/desktop-full-filter-policy";
import { getMarketplaceControlCopy } from "../lib/marketplace-control-copy";
import {
  DesktopFullFilterContent,
  type DesktopFullFilterDraftProps,
} from "./desktop-full-filter-content";
import styles from "./desktop-full-filter-dialog.module.css";

export type {
  DesktopFullFilterEntry,
  DesktopFullFilterSection,
} from "../lib/desktop-full-filter-policy";

function DesktopFullFilterNavigation({
  draft,
  locale,
}: Pick<DesktopFullFilterDraftProps, "draft" | "locale">) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  return (
    <ScrollArea className={styles.navigation}>
      <TabsList
        aria-label={isBg ? "Всички филтри" : "All filters"}
        className={styles.menu}
        data-slot="desktop-full-filter-navigation"
        onPointerDownCapture={() => {
          // Range fields commit on blur before a tab can unmount their panel.
          const input = document.activeElement;
          if (input instanceof HTMLInputElement && input.type === "number") {
            input.blur();
          }
        }}
      >
        {desktopFullFilterSections.map((id) => {
          const label = getDesktopFullFilterLabel(id, locale);
          const summary = getDesktopFullFilterSummary(id, draft, locale);
          return (
            <TabsTrigger
              aria-label={(isBg ? "Филтър: " : "Filter: ") + label}
              className={styles.menuItem}
              key={id}
              value={id}
            >
              <span>{label}</span>
              {summary ? (
                <span className={styles.summary}>{summary}</span>
              ) : null}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </ScrollArea>
  );
}

export function DesktopFullFilterDialog({
  applyLabel,
  draft,
  initialEntry = "vehicle",
  locale,
  modelCounts,
  onApply,
  onChange,
  onOpenChange,
  onReset,
  open,
  taxonomy,
}: DesktopFullFilterDraftProps & {
  applyLabel?: string;
  initialEntry?: DesktopFullFilterEntry;
  onApply: () => void;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  open: boolean;
}) {
  const copy = getMarketplaceControlCopy(locale);
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const [section, setSection] = useState<DesktopFullFilterSection>(
    initialEntry === "make" || initialEntry === "model"
      ? "vehicle"
      : initialEntry
  );
  const [vehicleVisited, setVehicleVisited] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  let vehicleInitialStep: "auto" | "make" | "model" = "make";
  if (vehicleVisited) {
    vehicleInitialStep = "auto";
  } else if (initialEntry === "model") {
    vehicleInitialStep = "model";
  }
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={styles.dialog}
        data-slot="desktop-full-filter-dialog"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const target =
            contentRef.current?.querySelector<HTMLElement>(
              '[data-slot="desktop-full-filter-content"] input:not([disabled])'
            ) ??
            contentRef.current?.querySelector<HTMLElement>(
              '[data-slot="desktop-full-filter-navigation"] [data-state="active"]'
            );
          target?.focus({ preventScroll: true });
        }}
        ref={contentRef}
        showCloseButton={false}
      >
        <DialogHeader className={styles.header}>
          <DialogTitle className="text-dialog-title">
            {isBg ? "Филтри за автомобили" : "Vehicle filters"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {copy.fullFilterDescription}
          </DialogDescription>
          <DialogClose asChild>
            <Button
              aria-label={copy.actions.close}
              className={styles.close}
              data-slot="desktop-full-filter-close"
              size="icon"
              variant="secondary"
            >
              <X aria-hidden="true" size={18} />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Tabs
          className={styles.workspace}
          onValueChange={(value) => {
            setSection(value as DesktopFullFilterSection);
            if (value === "vehicle") {
              setVehicleVisited(true);
            }
          }}
          orientation="vertical"
          value={section}
        >
          <DesktopFullFilterNavigation draft={draft} locale={locale} />
          {desktopFullFilterSections.map((id) => (
            <TabsContent
              className={styles.content}
              data-slot="desktop-full-filter-content"
              key={id}
              value={id}
            >
              {section === id ? (
                <DesktopFullFilterContent
                  draft={draft}
                  locale={locale}
                  modelCounts={modelCounts}
                  onChange={onChange}
                  resetVersion={resetVersion}
                  section={id}
                  taxonomy={taxonomy}
                  vehicleInitialStep={vehicleInitialStep}
                />
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
        <DialogFooter className={styles.footer}>
          <Button
            className={styles.reset}
            data-slot="desktop-full-filter-reset"
            onClick={() => {
              onReset();
              setResetVersion((value) => value + 1);
            }}
            variant="secondary"
          >
            {copy.actions.reset}
          </Button>
          <Button className={styles.apply} onClick={onApply}>
            {applyLabel ?? copy.actions.showResults}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
