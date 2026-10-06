'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { showroomSorts } from '@/lib/showroom';
import { IconButton, Modal, ui } from './ui';
import { ShowroomDesktopPopover } from './ShowroomDesktopPopover';
import { desktopFilterStyles } from './showroom-desktop-filters.stylex';

type Sort = (typeof showroomSorts)[number][0];

const s = stylex.create({
  dropdownOptions: { display: 'flex', flexDirection: 'column', gap: 4, padding: 8 },
  dropdownOption: {
    minHeight: 52,
    borderWidth: 0,
    borderRadius: 10,
    fontSize: 15,
    lineHeight: '22px',
  },
  dropdownSelected: { backgroundColor: colors.controlSurface },
  dialog: {
    width: { default: 'calc(100% - 32px)', '@media (min-width: 1024px)': 'calc(100% - 68px)' },
    maxWidth: { default: 480, '@media (min-width: 1024px)': 440 },
    padding: { default: 16, '@media (min-width: 1024px)': 20 },
    borderRadius: { default: 16, '@media (min-width: 1024px)': 20 },
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: { default: 8, '@media (min-width: 1024px)': 12 },
    marginInlineEnd: { default: -12, '@media (min-width: 1024px)': 0 },
    marginBottom: { default: 8, '@media (min-width: 1024px)': 16 },
  },
  title: {
    fontSize: { default: 18, '@media (min-width: 1024px)': 20 },
    fontWeight: { default: 600, '@media (min-width: 1024px)': 700 },
    lineHeight: { default: '24px', '@media (min-width: 1024px)': '28px' },
  },
  options: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    gap: 8,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    fontSize: { default: 16, '@media (min-width: 1024px)': 14 },
    paddingBlock: 8,
    paddingInline: { default: 0, '@media (min-width: 1024px)': 12 },
    borderWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: { default: 0, '@media (min-width: 1024px)': 12 },
    backgroundColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': { default: 'transparent', ':hover': colors.stripe },
    },
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.activeSurface },
    borderColor: { default: colors.line, '@media (min-width: 1024px)': colors.accent },
  },
  radio: { width: 22, height: 22, flexShrink: 0, accentColor: colors.accent },
});

function subscribeDesktop(listener: () => void) {
  const media = window.matchMedia('(min-width: 1024px)');
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

export function ShowroomSortDialog({
  open,
  value,
  onChange,
  onClose,
  desktopAnchor,
  onDesktopDismiss,
}: {
  open: boolean;
  value: Sort;
  onChange: (value: Sort) => void;
  onClose: () => void;
  desktopAnchor?: HTMLElement;
  onDesktopDismiss?: () => void;
}) {
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  );
  useEffect(() => {
    if (!open || !desktop) return;
    const frame = requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLInputElement>('input:checked')
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open, desktop]);
  if (desktop) {
    return open ? (
      <ShowroomDesktopPopover
        label={t('Sort')}
        anchor={desktopAnchor}
        anchorSelector="[data-desktop-sort]"
        xstyle={desktopFilterStyles.choicePopover}
        onClose={onClose}
        onDismiss={onDesktopDismiss || onClose}
      >
        <div
          ref={root}
          role="radiogroup"
          aria-label={t('Sort')}
          {...stylex.props(s.dropdownOptions)}
        >
          {showroomSorts.map(([option, label]) => (
            <label
              key={option}
              {...stylex.props(s.option, s.dropdownOption, value === option && s.dropdownSelected)}
            >
              <input
                type="radio"
                name="showroom-sort"
                checked={value === option}
                onChange={() => onChange(option)}
                {...stylex.props(s.radio)}
              />
              {t(label)}
            </label>
          ))}
        </div>
      </ShowroomDesktopPopover>
    ) : null;
  }
  return (
    <Modal open={open} onClose={onClose} label={t('Sort')} xstyle={s.dialog}>
      <div {...stylex.props(s.heading)}>
        <h2 {...stylex.props(ui.title, s.title)}>{t('Sort')}</h2>
        <IconButton icon="close" label={t('Close sorting')} onClick={onClose} />
      </div>
      <div {...stylex.props(s.options)}>
        {showroomSorts.map(([option, label]) => (
          <label key={option} {...stylex.props(s.option, value === option && s.selected)}>
            <input
              type="radio"
              name="showroom-sort"
              checked={value === option}
              onChange={() => onChange(option)}
              {...stylex.props(s.radio)}
            />
            {t(label)}
          </label>
        ))}
      </div>
    </Modal>
  );
}
