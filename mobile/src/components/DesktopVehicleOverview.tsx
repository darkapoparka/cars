'use client';

import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { vehicleDesktop } from './vehicle-detail-desktop.stylex';

const s = stylex.create({
  heading: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 18,
    backgroundColor: colors.stripe,
  },
  headingCopy: { flex: '1 1 220px', minWidth: 0 },
  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: '42px',
    fontWeight: 700,
    textWrap: 'balance',
    overflowWrap: 'anywhere',
  },
  make: { display: 'inline-block', maxWidth: '100%' },
  variant: { marginTop: 6, fontSize: 14, lineHeight: '22px', color: colors.muted },
  utilities: { display: 'flex', flexShrink: 0, gap: 8, marginLeft: 'auto' },
  utility: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 44,
    height: 44,
    paddingInline: 12,
    paddingBlock: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 22,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.muted,
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
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
  const { t, locale } = useLocale();
  return (
    <section
      data-vehicle-desktop-overview
      aria-label={t('Vehicle information')}
      {...stylex.props(vehicleDesktop.overview)}
    >
      <div {...stylex.props(s.heading)}>
        <div {...stylex.props(s.headingCopy)}>
          <h1 {...stylex.props(s.title)}>
            <span {...stylex.props(s.make)}>{v.make}</span> {v.model}
          </h1>
          <p {...stylex.props(s.variant)}>{v.variant}</p>
        </div>
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
            <span>
              {locale === 'bg' ? (saved ? 'Запазен' : 'Запази') : saved ? 'Saved' : 'Save'}
            </span>
          </button>
          <button
            type="button"
            aria-label={t('Share via')}
            title={t('Share via')}
            onClick={onShare}
            {...stylex.props(s.utility)}
          >
            <Icon name="share" size={18} />
            <span>{locale === 'bg' ? 'Сподели' : 'Share'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
