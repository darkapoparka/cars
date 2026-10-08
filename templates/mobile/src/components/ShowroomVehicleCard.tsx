'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { localizeVehicle } from '@/lib/vehicle-copy';
import { rememberInventory } from '@/lib/showroom';
import { togglePark, useAppState } from '@/lib/store';

const s = stylex.create({
  card: {
    position: 'relative',
    display: { default: 'block', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    minWidth: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: { default: 16, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    boxShadow: {
      default: '0 3px 12px rgba(27, 27, 33, 0.035)',
      '@media (max-width: 699px)': 'none',
    },
    overflow: 'hidden',
  },
  photo: {
    position: 'relative',
    flexShrink: 0,
    aspectRatio: '16 / 10',
    margin: { default: 12, '@media (min-width: 1024px)': 8 },
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: { default: 16, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    },
  },
  image: { objectFit: 'cover' },
  save: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },
  saveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: 'transparent',
    color: colors.text,
    outlineColor: colors.text,
    outlineOffset: -2,
    opacity: { default: 1, ':active': 0.75 },
  },
  savedButton: { color: colors.accent },
  saveFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: controlShape.circle,
    backgroundColor: colors.background,
  },
  body: {
    padding: { default: 12, '@media (min-width: 1024px)': 14 },
    flexGrow: { default: 0, '@media (min-width: 1024px)': 1 },
    fontFamily: {
      default: 'inherit',
      '@media (min-width: 1024px)': '"Mobile UI", Arial, sans-serif',
    },
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 6, '@media (min-width: 1024px)': 8 },
  },
  title: {
    minWidth: 0,
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: { default: 500, '@media (max-width: 699px)': 600 },
    overflowWrap: 'anywhere',
  },
  titleText: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
  },
  variant: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    minWidth: 0,
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  specs: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 6,
    rowGap: 6,
  },
  price: {
    marginTop: { default: 0, '@media (min-width: 1024px)': 'auto' },
    fontSize: { default: 20, '@media (min-width: 1024px)': 22 },
    lineHeight: {
      default: '26px',
      '@media (max-width: 699px)': '24px',
      '@media (min-width: 1024px)': '28px',
    },
    fontWeight: {
      default: 700,
      '@media (min-width: 1024px)': 600,
    },
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '100%',
    flexShrink: { default: 0, '@media (min-width: 1024px)': 1 },
    paddingInline: 8,
    paddingBlock: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 6,
    backgroundColor: colors.badgeSurface,
    color: { default: colors.muted, '@media (max-width: 699px)': colors.text },
    fontSize: { default: 12, '@media (max-width: 699px)': 14, '@media (min-width: 1024px)': 14 },
    lineHeight: {
      default: '18px',
      '@media (max-width: 699px)': '20px',
      '@media (min-width: 1024px)': '20px',
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export function ShowroomVehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const { t, locale, number, money } = useLocale();
  const localizedVehicle = localizeVehicle(vehicle, locale);
  const photos = localizedVehicle.images;
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = {
    year: String(vehicle.year),
    mileage: number(vehicle.mileage) + ' ' + t('km'),
    fuel: t(vehicle.fuel),
  };
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <div {...stylex.props(s.photo)}>
        <Image
          src={photos[0]}
          alt={name}
          fill
          priority={priority}
          sizes="(min-width: 1328px) 276px, (min-width: 1280px) calc((100vw - 224px) / 4), (min-width: 1024px) calc((100vw - 190px) / 3), (max-width: 699px) calc(100vw - 56px), 520px"
          {...stylex.props(s.image)}
        />
        <span {...stylex.props(s.save)}>
          <button
            type="button"
            aria-label={
              (locale === 'bg' ? (saved ? 'Премахни ' : 'Запази ') : saved ? 'Remove ' : 'Save ') +
              name +
              (saved ? (locale === 'bg' ? ' от запазените' : ' from saved cars') : '')
            }
            aria-pressed={saved}
            onClick={() => togglePark(vehicle.id)}
            {...stylex.props(s.saveButton, saved && s.savedButton)}
          >
            <span {...stylex.props(s.saveFace)}>
              <Heart
                size={22}
                strokeWidth={1.8}
                fill={saved ? 'currentColor' : 'none'}
                aria-hidden="true"
                focusable="false"
              />
            </span>
          </button>
        </span>
      </div>
      <div {...stylex.props(s.body)}>
        <h2 {...stylex.props(s.title)}>
          <Link href={href} onClick={() => rememberInventory(vehicle.id)} {...stylex.props(s.link)}>
            <span title={name} {...stylex.props(s.titleText)}>
              {name}
            </span>
          </Link>
        </h2>
        {localizedVehicle.variant && (
          <p title={localizedVehicle.variant} {...stylex.props(s.variant)}>
            {localizedVehicle.variant}
          </p>
        )}
        <p title={Object.values(specs).join(' · ')} {...stylex.props(s.specs)}>
          {Object.entries(specs).map(([key, fact]) => (
            <span key={key} data-vehicle-fact={key} title={fact} {...stylex.props(s.fact)}>
              {fact}
            </span>
          ))}
        </p>
        <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
      </div>
    </article>
  );
}
