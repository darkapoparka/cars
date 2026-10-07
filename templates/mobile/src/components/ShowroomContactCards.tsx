'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { showroom } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const s = stylex.create({
  options: {
    display: { default: 'grid', '@media (min-width: 700px)': 'none' },
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
    minHeight: 52,
    paddingBlock: 8,
    paddingInline: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 26,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.stripe },
    color: colors.text,
    textDecoration: 'none',
    textAlign: 'center',
    outlineColor: colors.text,
    outlineOffset: 3,
    cursor: { default: 'pointer', ':disabled': 'default' },
  },
  unavailable: {
    color: colors.muted,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
  },
  artwork: { display: 'block', width: 32, height: 32, flexShrink: 0 },
  image: { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  enquiryImage: { transform: 'scale(1.5)' },
  title: {
    minWidth: 0,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  email: {
    display: 'inline-flex',
    gridColumn: '1 / -1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.stripe },
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    textDecoration: 'none',
    outlineColor: colors.text,
    outlineOffset: 3,
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

export function ShowroomContactCards({
  enquiryOpen,
  onWrite,
}: {
  enquiryOpen: boolean;
  onWrite: (button: HTMLButtonElement) => void;
}) {
  const { t } = useLocale();
  const call = (
    <>
      <ShowroomContactArtwork name="call" />
      <span {...stylex.props(s.title)}>{t('Call us')}</span>
    </>
  );
  return (
    <div
      data-mobile-contact-options
      role="group"
      aria-label={t('Contact options')}
      {...stylex.props(s.options)}
    >
      {showroom.phone ? (
        <a data-contact-option="call" href={'tel:' + showroom.phone} {...stylex.props(s.card)}>
          {call}
        </a>
      ) : (
        <button
          data-contact-option="call"
          type="button"
          disabled
          {...stylex.props(s.card, s.unavailable)}
        >
          {call}
        </button>
      )}
      <button
        data-contact-option="write"
        data-contact-enquiry-trigger
        type="button"
        aria-haspopup="dialog"
        aria-expanded={enquiryOpen}
        onClick={(event) => onWrite(event.currentTarget)}
        {...stylex.props(s.card)}
      >
        <ShowroomContactArtwork name="enquiry" />
        <span {...stylex.props(s.title)}>{t('Write to us')}</span>
      </button>
      {showroom.email && (
        <a href={'mailto:' + showroom.email} {...stylex.props(s.email)}>
          <Mail size={20} strokeWidth={1.8} aria-hidden="true" />
          {t('Email us')}
        </a>
      )}
    </div>
  );
}
