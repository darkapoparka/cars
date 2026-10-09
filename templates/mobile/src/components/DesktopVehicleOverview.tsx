'use client';

import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { vehicleDesktop } from './vehicle-detail-desktop.stylex';

const s = stylex.create({
  title: {
    margin: 0,
    fontSize: 28,
    lineHeight: '36px',
    fontWeight: 600,
    textWrap: 'balance',
    overflowWrap: 'anywhere',
  },
  make: { display: 'inline-block', maxWidth: '100%' },
  secondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    marginTop: 4,
  },
  variant: { flex: '1', minWidth: 0, fontSize: 14, lineHeight: '22px', color: colors.muted },
  utilities: { display: 'flex', flexShrink: 0, gap: 4 },
  utility: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.muted,
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  saved: { color: colors.accent },
});

export function DesktopVehicleOverview({
  vehicle: v,
  saved,
  onSave,
  onShare,
}: {
  vehicle: Vehicle;
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
}) {
  const { t } = useLocale();
  return (
    <section
      data-vehicle-desktop-overview
      aria-label={t('Vehicle information')}
      {...stylex.props(vehicleDesktop.overview)}
    >
      <h1 {...stylex.props(s.title)}>
        <span {...stylex.props(s.make)}>{v.make}</span> {v.model}
      </h1>
      <div {...stylex.props(s.secondary)}>
        <p {...stylex.props(s.variant)}>{v.variant}</p>
        <div data-vehicle-desktop-utilities {...stylex.props(s.utilities)}>
          <button
            type="button"
            aria-label={t(saved ? 'Remove from saved cars' : 'Save car')}
            title={t(saved ? 'Remove from saved cars' : 'Save car')}
            aria-pressed={saved}
            onClick={onSave}
            {...stylex.props(s.utility, saved && s.saved)}
          >
            <Icon name="heart" size={18} filled={saved} />
          </button>
          <button
            type="button"
            aria-label={t('Share via')}
            title={t('Share via')}
            onClick={onShare}
            {...stylex.props(s.utility)}
          >
            <Icon name="share" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
