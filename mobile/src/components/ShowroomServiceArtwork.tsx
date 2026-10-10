'use client';

import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';

const s = stylex.create({
  media: {
    display: 'block',
    flexShrink: 0,
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': '1 / -1' },
    gridRow: 1,
    width: { default: 48, '@media (min-width: 360px)': 56, '@media (min-width: 1024px)': '100%' },
    height: { default: 48, '@media (min-width: 360px)': 56, '@media (min-width: 1024px)': 'auto' },
    aspectRatio: { default: '1', '@media (min-width: 1024px)': '16 / 10' },
    overflow: 'hidden',
    borderRadius: { default: 0, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.stripe },
  },
  desktopOnly: { display: { default: 'none', '@media (min-width: 1024px)': 'block' } },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: { default: 'contain', '@media (min-width: 1024px)': 'cover' },
    transition: 'transform 180ms ease',
    transform: {
      default: 'scale(1)',
      ':hover': 'scale(1.025)',
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
  },
});

// Each viewport downloads its own artwork; the fallback does not request an image.
const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function ShowroomServiceArtwork({ src, mobileSrc }: { src: string; mobileSrc?: string }) {
  return (
    <picture data-service-artwork {...stylex.props(s.media, !mobileSrc && s.desktopOnly)}>
      <source media="(min-width: 1024px)" type="image/webp" srcSet={src} />
      {mobileSrc && <source media="(max-width: 1023px)" type="image/webp" srcSet={mobileSrc} />}
      <Image
        src={transparentPixel}
        alt=""
        width={768}
        height={432}
        unoptimized
        loading="lazy"
        {...stylex.props(s.image)}
      />
    </picture>
  );
}
