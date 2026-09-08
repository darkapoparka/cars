"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import { type ReactNode, useRef } from "react";

export const mobileMarketplaceOverlayIconActionClassName =
  "size-11 shrink-0 rounded-full bg-zinc-200 p-0 text-zinc-950 shadow-none hover:bg-zinc-300 active:bg-zinc-300";

export const mobileMarketplaceOverlayPrimaryActionClassName =
  "h-12 w-full rounded-xl bg-[var(--lead-site-accent)] text-white shadow-none hover:bg-[var(--lead-site-accent-hover)]";

interface MobileMarketplaceOverlayShellProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentDataSlot?: string;
  readonly onCloseAutoFocus?: (event: Event) => void;
  readonly onOpenAutoFocus?: (event: Event) => void;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
}

export const MobileMarketplaceOverlayShell = ({
  children,
  className,
  contentDataSlot = "mobile-marketplace-overlay",
  onCloseAutoFocus,
  onOpenAutoFocus,
  onOpenChange,
  open,
}: MobileMarketplaceOverlayShellProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        const openDialogs = Array.from(
          document.querySelectorAll('[role="dialog"][data-state="open"]')
        );
        if (
          !nextOpen &&
          openDialogs.length > 0 &&
          openDialogs.at(-1) !== contentRef.current
        ) {
          return;
        }
        onOpenChange(nextOpen);
      }}
      open={open}
    >
      <DialogContent
        className={cn(
          "data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 top-0 left-0 z-[70] flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-white p-0 shadow-none sm:max-w-none sm:rounded-none",
          className
        )}
        data-mobile-overlay="fullscreen"
        data-slot={contentDataSlot}
        onCloseAutoFocus={onCloseAutoFocus}
        onOpenAutoFocus={onOpenAutoFocus}
        ref={contentRef}
        showCloseButton={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const MobileMarketplaceOverlayHeader = ({
  description,
  leftAction,
  rightAction,
  title,
}: {
  readonly description: string;
  readonly leftAction?: ReactNode;
  readonly rightAction?: ReactNode;
  readonly title: string;
}) => (
  <DialogHeader
    className="shrink-0 gap-0 bg-white text-left"
    data-slot="mobile-marketplace-overlay-header"
  >
    <div className="grid min-h-16 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <div className="flex justify-start">{leftAction}</div>
      <DialogTitle className="truncate text-center text-[17px] leading-6">
        {title}
      </DialogTitle>
      <div className="flex justify-end">{rightAction}</div>
    </div>
    <DialogDescription className="sr-only">{description}</DialogDescription>
  </DialogHeader>
);

export const MobileMarketplaceOverlay = ({
  bodyClassName,
  children,
  contentClassName,
  contentDataSlot,
  description,
  footer,
  leftAction,
  onCloseAutoFocus,
  onOpenAutoFocus,
  onOpenChange,
  open,
  rightAction,
  title,
}: {
  readonly bodyClassName?: string;
  readonly children: ReactNode;
  readonly contentClassName?: string;
  readonly contentDataSlot?: string;
  readonly description: string;
  readonly footer?: ReactNode;
  readonly leftAction?: ReactNode;
  readonly onCloseAutoFocus?: (event: Event) => void;
  readonly onOpenAutoFocus?: (event: Event) => void;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly rightAction?: ReactNode;
  readonly title: string;
}) => (
  <MobileMarketplaceOverlayShell
    className={contentClassName}
    contentDataSlot={contentDataSlot}
    onCloseAutoFocus={onCloseAutoFocus}
    onOpenAutoFocus={onOpenAutoFocus}
    onOpenChange={onOpenChange}
    open={open}
  >
    <MobileMarketplaceOverlayHeader
      description={description}
      leftAction={leftAction}
      rightAction={rightAction}
      title={title}
    />

    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white",
        bodyClassName
      )}
      data-slot="mobile-marketplace-overlay-scroll-body"
    >
      {children}
      {footer ? (
        <div
          className="px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          data-slot="mobile-marketplace-overlay-footer"
        >
          {footer}
        </div>
      ) : null}
    </div>
  </MobileMarketplaceOverlayShell>
);

export const MobileMarketplaceOverlayIconAction = ({
  ariaLabel,
  children,
  disabled,
  onClick,
}: {
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) => (
  <Button
    aria-label={ariaLabel}
    className={mobileMarketplaceOverlayIconActionClassName}
    disabled={disabled}
    onClick={onClick}
    size="icon"
    title={ariaLabel}
    type="button"
    variant="ghost"
  >
    {children}
  </Button>
);

export const MobileMarketplaceOverlayCloseAction = ({
  ariaLabel,
}: {
  readonly ariaLabel: string;
}) => (
  <DialogClose asChild>
    <Button
      aria-label={ariaLabel}
      className={mobileMarketplaceOverlayIconActionClassName}
      size="icon"
      title={ariaLabel}
      type="button"
      variant="ghost"
    >
      <X aria-hidden="true" className="size-[18px]" />
    </Button>
  </DialogClose>
);

export const MobileMarketplaceOverlayBackAction = ({
  ariaLabel,
  onClick,
}: {
  readonly ariaLabel: string;
  readonly onClick: () => void;
}) => (
  <MobileMarketplaceOverlayIconAction ariaLabel={ariaLabel} onClick={onClick}>
    <ChevronLeft aria-hidden="true" className="size-5" />
  </MobileMarketplaceOverlayIconAction>
);

export const MobileMarketplaceOverlayBackOrCancelAction = ({
  backLabel,
  cancelLabel,
  onBack,
  onCancel,
  showBack,
}: {
  readonly backLabel: string;
  readonly cancelLabel: string;
  readonly onBack: () => void;
  readonly onCancel: () => void;
  readonly showBack: boolean;
}) => (
  <MobileMarketplaceOverlayIconAction
    ariaLabel={showBack ? backLabel : cancelLabel}
    onClick={showBack ? onBack : onCancel}
  >
    {showBack ? (
      <ChevronLeft aria-hidden="true" className="size-5" />
    ) : (
      <X aria-hidden="true" className="size-[18px]" />
    )}
  </MobileMarketplaceOverlayIconAction>
);
