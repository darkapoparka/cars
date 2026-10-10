'use client';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Icon, type IconName } from './Icon';
import { Modal } from './ui';

// Native capture 27: 48px handle region followed by four 56px rows.
const categories: [string, IconName][] = [
  ['Car', 'car'],
  ['Motorbike', 'bike'],
  ['Trailer or Motorhome', 'motorhome'],
  ['Truck or Utility Vehicle', 'truck'],
];
const s = stylex.create({
  handleRegion: { height: 26, display: 'flex', justifyContent: 'center', flexShrink: 0 },
  handle: { width: 32, height: 4, borderRadius: 4, backgroundColor: colors.muted },
  rows: { paddingBottom: 'env(safe-area-inset-bottom)' },
  row: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 56,
    gap: 16,
    textDecoration: 'none',
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    borderRadius: 8,
    backgroundColor: { default: 'transparent', ':hover': colors.surface },
  },
});
export function SellCategorySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="Create new ad" sheet nativeSheet>
      <div {...stylex.props(s.handleRegion)} aria-hidden="true">
        <span {...stylex.props(s.handle)} />
      </div>
      <nav aria-label="Vehicle listing category" {...stylex.props(s.rows)}>
        {categories.map(([label, icon]) => (
          <Link
            key={label}
            href={'/login?next=/sell/create&category=' + encodeURIComponent(label)}
            {...stylex.props(s.row)}
          >
            <Icon name={icon} size={24} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </Modal>
  );
}
