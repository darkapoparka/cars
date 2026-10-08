'use client';

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { VehicleCategory } from '@/lib/types';
import { showroomCategory } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { Button, Modal } from './ui';
import { ShowroomDesktopPopover } from './ShowroomDesktopPopover';
import { Icon } from './Icon';
import { desktopFilterStyles as s } from './showroom-desktop-filters.stylex';

function wrapFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'Tab' || event.defaultPrevented) return;
  const controls = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, a[href], summary, [tabindex]',
    ),
  ].filter(
    (control) =>
      control.tabIndex >= 0 && !control.matches(':disabled') && control.getClientRects().length,
  );
  const first = controls[0];
  const last = controls[controls.length - 1];
  const active = document.activeElement;
  if (
    (event.shiftKey && (active === first || active === event.currentTarget.querySelector('h2'))) ||
    (!event.shiftKey && active === last)
  ) {
    event.preventDefault();
    (event.shiftKey ? last : first)?.focus({ preventScroll: true });
  }
}

export function ShowroomDesktopFilterDialog({
  title,
  section,
  category,
  count,
  children,
  dropdown,
  narrow,
  fullHeight,
  picker = false,
  anchor,
  keyboardOpening,
  anchorSelector,
  onBack,
  backLabel = 'All filters',
  onReset,
  onApply,
  onClose,
  onDismiss,
}: {
  title: string;
  section: string;
  category: VehicleCategory;
  count: number;
  children: ReactNode;
  dropdown: boolean;
  narrow: boolean;
  fullHeight: boolean;
  picker?: boolean;
  anchor?: HTMLElement;
  keyboardOpening?: boolean;
  anchorSelector: string;
  onBack?: () => void;
  backLabel?: string;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
  onDismiss: () => void;
}) {
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const categoryCopy = showroomCategory(category);
  const make = section === 'make' || section === 'model';

  useEffect(() => {
    if (dropdown && picker) return;
    const frame = requestAnimationFrame(() => {
      const selector = section === 'search' ? '[data-showroom-search-input]' : 'h2';
      const target = [...(root.current?.querySelectorAll<HTMLElement>(selector) || [])].find(
        (element) => element.getClientRects().length,
      );
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [title, section, dropdown, picker]);

  const editor = (
    <div
      ref={root}
      data-desktop-filter-editor={section}
      data-desktop-filter-presentation={dropdown ? 'dropdown' : 'modal'}
      onKeyDown={dropdown ? undefined : wrapFocus}
      {...stylex.props(s.editor, (!fullHeight || dropdown) && s.autoEditor)}
    >
      <div
        {...stylex.props(s.header, dropdown && s.popupHeader, dropdown && picker && s.hiddenHeader)}
      >
        {onBack && (
          <button
            type="button"
            aria-label={t('Back') + ': ' + t(backLabel)}
            onClick={onBack}
            {...stylex.props(s.close)}
          >
            <Icon name="back" size={18} />
          </button>
        )}
        <h2 tabIndex={-1} {...stylex.props(s.title, dropdown && s.popupTitle)}>
          {t(title)}
        </h2>
        <button
          type="button"
          aria-label={t('Close filters')}
          onClick={onClose}
          {...stylex.props(s.close)}
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div
        data-desktop-filter-section={section}
        {...stylex.props(s.content, dropdown && s.popupContent, make && s.makeContent)}
      >
        {children}
      </div>
      <div
        {...stylex.props(s.footer, dropdown && s.popupFooter, dropdown && picker && s.pickerFooter)}
      >
        <button
          type="button"
          aria-label={t('Clear filters')}
          onClick={onReset}
          {...stylex.props(s.clear, dropdown && s.popupClear)}
        >
          {t('Clear')}
        </button>
        <Button xstyle={[s.apply, dropdown && s.popupApply]} onClick={onApply}>
          <span aria-live="polite" aria-atomic="true">
            {t('Show ')}
            {count} {t(count === 1 ? categoryCopy.singular : categoryCopy.plural)}
          </span>
        </Button>
      </div>
    </div>
  );
  return dropdown ? (
    <ShowroomDesktopPopover
      label={t(title)}
      anchor={anchor}
      keyboardOpening={keyboardOpening}
      anchorSelector={anchorSelector}
      matchAnchorSelector={picker ? '[data-desktop-search-box]' : undefined}
      initialFocusSelector={
        picker ? '[data-desktop-make-search], [data-desktop-model-search]' : undefined
      }
      xstyle={[narrow && s.choicePopover, picker && s.pickerPopover]}
      onClose={onClose}
      onDismiss={onDismiss}
    >
      {editor}
    </ShowroomDesktopPopover>
  ) : (
    <Modal
      open
      onClose={onClose}
      label={t(title)}
      xstyle={[
        s.dialog,
        !fullHeight && s.smallSheet,
        picker && s.pickerSheet,
        picker && fullHeight && s.modelSheet,
      ]}
    >
      {editor}
    </Modal>
  );
}
