'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import type { VehicleCategory } from '@/lib/types';
import { showroomCategories, showroomCategory } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { desktopSearchStyles as field } from './showroom-desktop-controls.stylex';

const s = stylex.create({
  root: { position: 'relative', minWidth: 0 },
  image: { width: 48, height: 30, objectFit: 'contain', flexShrink: 0 },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: 0,
    zIndex: 40,
    width: 320,
    maxWidth: 'calc(100vw - 64px)',
    maxHeight: 'min(360px, calc(100dvh - 320px))',
    padding: 6,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
    boxShadow: '0 12px 32px rgba(14, 25, 36, .14)',
    color: colors.text,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 56,
    paddingInline: 12,
    paddingBlock: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.text,
    fontSize: 15,
    lineHeight: '22px',
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: -2,
  },
  selected: { backgroundColor: colors.activeSurface, fontWeight: 600 },
  optionLabel: { flex: '1', minWidth: 0 },
  check: { display: 'flex', color: colors.accent, flexShrink: 0 },
});

export function ShowroomDesktopType({
  category,
  onSelect,
}: {
  category: VehicleCategory;
  onSelect: (category: VehicleCategory) => void;
}) {
  const { t } = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = showroomCategory(category);
  const selectedIndex = Math.max(
    0,
    showroomCategories.findIndex(({ value }) => value === category),
  );

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    const desktop = window.matchMedia('(min-width: 1024px)');
    function resize(event: MediaQueryListEvent) {
      if (!event.matches) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);

  function focusOption(index: number) {
    const option = options.current[index];
    option?.focus({ preventScroll: true });
    option?.scrollIntoView({ block: 'nearest' });
  }
  function show() {
    setOpen(true);
    requestAnimationFrame(() => focusOption(selectedIndex));
  }
  function choose(value: VehicleCategory) {
    setOpen(false);
    onSelect(value);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }

  return (
    <div
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }
      }}
      {...stylex.props(s.root)}
    >
      <button
        ref={trigger}
        type="button"
        id={id + '-trigger'}
        data-desktop-type-trigger
        aria-label={t('Vehicle type') + ': ' + t(selected.label)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id + '-options' : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            show();
          }
        }}
        {...stylex.props(field.field, open && field.open)}
      >
        <Image
          src={selected.image}
          alt=""
          width={48}
          height={30}
          sizes="48px"
          {...stylex.props(s.image)}
        />
        <span {...stylex.props(field.copy)}>
          <span {...stylex.props(field.label)}>{t('Vehicle type')}</span>
          <span title={t(selected.label)} {...stylex.props(field.value)}>
            {t(selected.label)}
          </span>
        </span>
        <Icon name="down" size={16} />
      </button>
      {open && (
        <div
          id={id + '-options'}
          role="listbox"
          aria-label={t('Vehicle type')}
          data-desktop-type-menu
          onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const current = options.current.findIndex((option) => option === event.target);
            const next =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? showroomCategories.length - 1
                  : (current + (event.key === 'ArrowDown' ? 1 : -1) + showroomCategories.length) %
                    showroomCategories.length;
            focusOption(next);
          }}
          {...stylex.props(s.menu)}
        >
          {showroomCategories.map(({ value, label, image }, index) => (
            <button
              key={value}
              ref={(element) => {
                options.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={category === value}
              tabIndex={category === value ? 0 : -1}
              data-desktop-type={value}
              onClick={() => choose(value)}
              {...stylex.props(s.option, category === value && s.selected)}
            >
              <Image
                src={image}
                alt=""
                width={48}
                height={30}
                sizes="48px"
                {...stylex.props(s.image)}
              />
              <span {...stylex.props(s.optionLabel)}>{t(label)}</span>
              {category === value && (
                <span {...stylex.props(s.check)}>
                  <Icon name="check" size={18} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
