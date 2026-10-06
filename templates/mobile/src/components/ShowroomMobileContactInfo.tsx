'use client';

import * as stylex from '@stylexjs/stylex';
import { Clock3, MapPin } from 'lucide-react';
import { showroom, showroomContactLocation } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  card: {
    display: 'flex',
    gridColumn: '1 / -1',
    flexDirection: 'column',
    gap: 8,
    paddingInline: 4,
    minWidth: 0,
  },
  row: { display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 },
  icon: { flexShrink: 0, color: colors.muted, marginTop: 3 },
  text: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  address: { fontSize: 16, lineHeight: '24px', fontStyle: 'normal', overflowWrap: 'anywhere' },
  note: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  hoursTitle: { fontSize: 15, lineHeight: '22px', fontWeight: 500 },
  hours: { fontSize: 15, lineHeight: '22px', color: colors.muted, overflowWrap: 'anywhere' },
});

export function ShowroomMobileContactInfo() {
  const { locale, t } = useLocale();
  const location = showroomContactLocation(locale);
  if (!location.address && showroom.hours.length === 0) return null;
  return (
    <section data-mobile-showroom-info aria-label={t('Showroom contact')} {...stylex.props(s.card)}>
      {location.address && (
        <div {...stylex.props(s.row)}>
          <MapPin size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
          <div {...stylex.props(s.text)}>
            <address {...stylex.props(s.address)}>{location.address}</address>
            {location.preview && (
              <p id="showroom-mobile-location-preview" {...stylex.props(s.note)}>
                {t('Example location')}
              </p>
            )}
          </div>
        </div>
      )}
      {showroom.hours.length > 0 && (
        <div {...stylex.props(s.row)}>
          <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
          <div {...stylex.props(s.text)}>
            <h3 {...stylex.props(s.hoursTitle)}>{t('Opening hours')}</h3>
            {showroom.hours.map((hours) => (
              <p key={hours} {...stylex.props(s.hours)}>
                {hours}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
