'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { showroomContactLocation } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { ShowroomContactArtwork } from './ShowroomContactCards';

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const s = stylex.create({
  banner: {
    display: { default: 'block', '@media (min-width: 700px)': 'none' },
    minWidth: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 16,
    backgroundColor: colors.background,
    boxShadow: '0 3px 12px rgba(27, 27, 33, 0.035)',
  },
  artwork: { display: 'block', width: '100%', aspectRatio: '3 / 1', overflow: 'hidden' },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    // Recenter the showroom within the illustration's asymmetric whitespace.
    transform: 'translateX(-12.5%)',
  },
  body: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: 16, paddingTop: 8 },
  icon: { flexShrink: 0, color: colors.accent, marginTop: 2 },
  copy: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  address: { fontStyle: 'normal', fontSize: 16, lineHeight: '24px', overflowWrap: 'anywhere' },
  note: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  actions: { padding: 16, paddingTop: 0 },
  directions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    minWidth: 0,
    minHeight: 48,
    paddingBlock: 6,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: controlShape.pill,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.stripe },
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    textAlign: 'center',
    textDecoration: 'none',
    overflowWrap: 'anywhere',
    outlineColor: colors.text,
    outlineOffset: 3,
    cursor: { default: 'pointer', ':disabled': 'default' },
  },
  unavailable: { color: colors.muted },
});

export function ShowroomContactBanner() {
  const { locale, t } = useLocale();
  const location = showroomContactLocation(locale);
  if (!location.address && !location.directionsUrl) return null;
  const visit = (
    <>
      <ShowroomContactArtwork name="visit" />
      {t('Visit us')}
    </>
  );
  return (
    <section
      data-showroom-contact-banner
      aria-label={t('Showroom location')}
      {...stylex.props(s.banner)}
    >
      <picture {...stylex.props(s.artwork)}>
        <source
          media="(max-width: 699px)"
          type="image/webp"
          srcSet="/images/contact/showroom-20261006.webp"
        />
        <Image
          src={transparentPixel}
          alt=""
          width={768}
          height={256}
          unoptimized
          loading="eager"
          {...stylex.props(s.image)}
        />
      </picture>
      {location.address && (
        <div {...stylex.props(s.body)}>
          <MapPin size={18} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
          <div {...stylex.props(s.copy)}>
            <address {...stylex.props(s.address)}>{location.address}</address>
            {location.preview && (
              <p id="showroom-mobile-location-preview" {...stylex.props(s.note)}>
                {t('Example location')}
              </p>
            )}
          </div>
        </div>
      )}
      <div {...stylex.props(s.actions)}>
        {location.directionsUrl ? (
          <a
            data-contact-option="visit"
            href={location.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby={location.preview ? 'showroom-mobile-location-preview' : undefined}
            {...stylex.props(s.directions)}
          >
            {visit}
          </a>
        ) : (
          <button
            data-contact-option="visit"
            type="button"
            disabled
            {...stylex.props(s.directions, s.unavailable)}
          >
            {visit}
          </button>
        )}
      </div>
    </section>
  );
}
