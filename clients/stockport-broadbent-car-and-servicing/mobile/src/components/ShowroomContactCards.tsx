'use client';

import Image from 'next/image';
import { ChevronRight, Mail } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { showroom, showroomPreviewPhone } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const s = stylex.create({
  options: {
    display: { default: 'grid', '@media (min-width: 700px)': 'none' },
    gridTemplateColumns: 'minmax(0,1fr)',
    gap: 10,
  },
  previewNote: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
    minWidth: 0,
    minHeight: 48,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 20,
    backgroundColor: { default: colors.background, ':hover': colors.panel },
    boxShadow: '0 4px 16px rgba(27, 27, 33, 0.045)',
    color: colors.text,
    textDecoration: 'none',
    textAlign: 'left',
    outlineColor: colors.text,
    outlineOffset: 3,
    cursor: { default: 'pointer', ':disabled': 'default' },
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  detail: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
    color: colors.muted,
    overflowWrap: 'anywhere',
  },
  arrow: {
    marginLeft: 'auto',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: controlShape.circle,
    backgroundColor: colors.controlSurface,
    color: colors.text,
  },
  artwork: { display: 'block', width: 32, height: 32, flexShrink: 0 },
  unavailable: { backgroundColor: { default: colors.background, ':hover': colors.background } },
  image: { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  enquiryImage: { transform: 'scale(1.5)' },
  title: {
    minWidth: 0,
    fontSize: 18,
    lineHeight: '26px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
});

export function ShowroomContactArtwork({ name }: { name: 'call' | 'visit' | 'enquiry' }) {
  return (
    <picture data-contact-option-artwork {...stylex.props(s.artwork)}>
      <source
        media="(max-width: 699px)"
        type="image/webp"
        srcSet={'/images/contact/' + name + '-20261006.webp'}
      />
      <Image
        src={transparentPixel}
        alt=""
        width={name === 'enquiry' ? 384 : 256}
        height={name === 'enquiry' ? 288 : 256}
        unoptimized
        loading="eager"
        {...stylex.props(s.image, name === 'enquiry' && s.enquiryImage)}
      />
    </picture>
  );
}

export function ShowroomContactCards() {
  const { t } = useLocale();
  const previewCall = !showroom.phone && showroom.contactPreview;
  const hasCall = Boolean(showroom.phone) || previewCall;
  if (!hasCall && !showroom.email) return null;
  const call = (
    <>
      <span {...stylex.props(s.cardHeader)}>
        <ShowroomContactArtwork name="call" />
        <span {...stylex.props(s.title)}>{t('Call us')}</span>
        <span aria-hidden="true" {...stylex.props(s.arrow)}>
          <ChevronRight size={18} strokeWidth={1.8} />
        </span>
      </span>
      <span data-contact-phone {...stylex.props(s.detail)}>
        {showroom.phone || showroomPreviewPhone}
      </span>
    </>
  );
  return (
    <div
      data-mobile-contact-options
      role="group"
      aria-label={t('Contact options')}
      {...stylex.props(s.options)}
    >
      {showroom.phone && (
        <a data-contact-option="call" href={'tel:' + showroom.phone} {...stylex.props(s.card)}>
          {call}
        </a>
      )}
      {previewCall && (
        <button
          data-contact-option="call"
          type="button"
          disabled
          aria-describedby="showroom-preview-phone"
          {...stylex.props(s.card, s.unavailable)}
        >
          {call}
          <span id="showroom-preview-phone" {...stylex.props(s.previewNote)}>
            {t('Example phone')}
          </span>
        </button>
      )}
      {showroom.email && (
        <a href={'mailto:' + showroom.email} {...stylex.props(s.card)}>
          <span {...stylex.props(s.cardHeader)}>
            <Mail size={20} strokeWidth={1.8} aria-hidden="true" />
            <span {...stylex.props(s.title)}>{t('Email us')}</span>
          </span>
          <span {...stylex.props(s.detail)}>{showroom.email}</span>
        </a>
      )}
    </div>
  );
}
