'use client';

import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { showroomSorts } from '@/lib/showroom';
import { IconButton, Modal, ui } from './ui';

type Sort = (typeof showroomSorts)[number][0];

const s = stylex.create({
  dialog: {
    maxWidth: { default: 480, '@media (min-width: 1024px)': 440 },
    padding: { default: 24, '@media (min-width: 1024px)': 20 },
    borderRadius: { default: 16, '@media (min-width: 1024px)': 20 },
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: { default: 12, '@media (min-width: 1024px)': 16 },
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

export function ShowroomSortDialog({
  open,
  categoryLabel,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  categoryLabel: string;
  value: Sort;
  onChange: (value: Sort) => void;
  onClose: () => void;
}) {
  const { t } = useLocale();
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={t('Sort') + ' · ' + t(categoryLabel)}
      xstyle={s.dialog}
    >
      <div {...stylex.props(s.heading)}>
        <h2 {...stylex.props(ui.title)}>
          {t('Sort ')}
          {t(categoryLabel)}
        </h2>
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
