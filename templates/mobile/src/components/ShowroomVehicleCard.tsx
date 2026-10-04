'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { localizeVehicle } from '@/lib/vehicle-copy';
import { rememberInventory } from '@/lib/showroom';
import { togglePark, useAppState } from '@/lib/store';

const s = stylex.create({
  card: {
    position: 'relative',
    minWidth: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(27, 27, 33, 0.08)',
    overflow: 'hidden',
  },
  photo: {
    position: 'relative',
    aspectRatio: '16 / 10',
    margin: 12,
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  link: {
    textDecoration: 'none',
    '::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 16 },
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
    borderRadius: 24,
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
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  body: { padding: 12, display: 'flex', flexDirection: 'column', gap: 6 },
  heading: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 4,
  },
  title: {
    minWidth: 0,
    flexGrow: 1,
    flexBasis: 120,
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 700,
    overflowWrap: 'anywhere',
  },
  variant: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  specs: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: 4,
    marginTop: 2,
  },
  price: {
    fontSize: 20,
    lineHeight: '26px',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    minWidth: 0,
    paddingInline: 6,
    paddingBlock: 2,
    borderRadius: 4,
    backgroundColor: colors.controlSurface,
    color: colors.muted,
    fontSize: 12,
    lineHeight: '18px',
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
  const displayVehicle = localizeVehicle(vehicle, locale);
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = [String(vehicle.year), number(vehicle.mileage) + ' ' + t('km'), t(vehicle.fuel)];
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <div {...stylex.props(s.photo)}>
        <Image
          src={displayVehicle.images[0]}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 699px) calc(100vw - 56px), 520px"
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
        <div {...stylex.props(s.heading)}>
          <h2 {...stylex.props(s.title)}>
            <Link
              href={href}
              onClick={() => rememberInventory(vehicle.id)}
              {...stylex.props(s.link)}
            >
              {name}
            </Link>
          </h2>
          <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
        </div>
        <p title={displayVehicle.variant} {...stylex.props(s.variant)}>
          {displayVehicle.variant}
        </p>
        <p title={specs.join(' · ')} {...stylex.props(s.specs)}>
          {specs.map((fact) => (
            <span key={fact} title={fact} {...stylex.props(s.fact)}>
              {fact}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
