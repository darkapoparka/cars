'use client';

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import { serviceCategories, type ServiceTab } from '@/lib/showroom-services';
import { useLocale } from '@/lib/use-locale';
import { useMediaQuery } from '@/lib/use-media-query';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { desktopSearchStyles as field } from './showroom-desktop-controls.stylex';

const s = stylex.create({
  menu: {
    zIndex: 100,
    width: 240,
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
    overflowY: 'auto',
    padding: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 18,
    backgroundColor: colors.background,
    color: colors.text,
    boxShadow: '0 16px 48px rgba(20,24,32,.16), 0 2px 8px rgba(20,24,32,.06)',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingInline: 12,
    paddingBlock: 8,
    borderRadius: 8,
    backgroundColor: { default: 'transparent', ':focus': colors.stripe },
    color: colors.text,
    fontSize: 15,
    lineHeight: '22px',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: -2,
  },
  selected: { backgroundColor: colors.controlSurface, fontWeight: 600 },
  label: { flex: '1', minWidth: 0 },
});

export function ShowroomDesktopServiceType({
  selected,
  onSelect,
}: {
  selected: ServiceTab;
  onSelect: (value: ServiceTab) => void;
}) {
  const { t } = useLocale();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);
  const label = serviceCategories.find(({ value }) => value === selected)?.label || 'All';
  return (
    <DropdownMenu.Root open={desktop && open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t('Service category') + ': ' + t(label)}
          data-desktop-service-type-trigger
          {...stylex.props(
            field.field,
            field.divider,
            open && field.open,
            open && field.hideDivider,
          )}
        >
          <span {...stylex.props(s.label, field.value)}>
            {t(selected === 'services' ? 'Service category' : label)}
          </span>
          <Icon name="down" size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          loop
          aria-label={t('Service category')}
          {...stylex.props(s.menu)}
        >
          <DropdownMenu.RadioGroup
            value={selected}
            onValueChange={(value) => {
              const category = serviceCategories.find((category) => category.value === value);
              if (category) onSelect(category.value);
            }}
          >
            {serviceCategories.map(({ value, label }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                {...stylex.props(s.option, value === selected && s.selected)}
              >
                <span {...stylex.props(s.label)}>{t(label)}</span>
                <DropdownMenu.ItemIndicator>
                  <Icon name="check" size={18} />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
