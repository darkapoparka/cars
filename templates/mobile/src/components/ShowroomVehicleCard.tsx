'use client';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { money, number } from '@/lib/search';
import { rememberInventory } from '@/lib/showroom';
import { togglePark, useAppState } from '@/lib/store';
import { IconButton } from './ui';

const s = stylex.create({
  card: {
    position: 'relative',
    minWidth: 0,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: { position: 'relative', aspectRatio: '3 / 2', backgroundColor: colors.surface },
  link: {
    textDecoration: 'none',
    '::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 16 },
  },
  image: { objectFit: 'cover' },
  save: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    borderRadius: '50%',
    backgroundColor: colors.background,
    color: colors.purple,
  },
  body: { padding: 14, display: 'flex', flexDirection: 'column', gap: 4 },
  title: { fontSize: 18, lineHeight: '24px', fontWeight: 700 },
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
    flexWrap: 'wrap',
    columnGap: 6,
    rowGap: 2,
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
  },
  spec: { display: 'inline-flex', gap: 6, alignItems: 'center' },
  price: { fontSize: 23, lineHeight: '30px', fontWeight: 700, marginTop: 4 },
});

export function ShowroomVehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = [
    String(vehicle.year),
    number(vehicle.mileage) + ' km',
    vehicle.fuel,
    vehicle.transmission,
  ];
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <div {...stylex.props(s.photo)}>
        <Image
          src={vehicle.images[0]}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 699px) calc(100vw - 32px), 520px"
          {...stylex.props(s.image)}
        />
      </div>
      <div {...stylex.props(s.body)}>
        <h2 {...stylex.props(s.title)}>
          <Link href={href} onClick={() => rememberInventory(vehicle.id)} {...stylex.props(s.link)}>
            {name}
          </Link>
        </h2>
        <p title={vehicle.variant} {...stylex.props(s.variant)}>
          {vehicle.variant}
        </p>
        <p {...stylex.props(s.specs)}>
          {specs.map((spec, index) => (
            <span key={spec} {...stylex.props(s.spec)}>
              {index > 0 && <span aria-hidden="true">·</span>}
              {spec}
            </span>
          ))}
        </p>
        <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
      </div>
      <span {...stylex.props(s.save)}>
        <IconButton
          icon="heart"
          label={(saved ? 'Remove ' : 'Save ') + name + (saved ? ' from saved cars' : '')}
          filled={saved}
          onClick={() => togglePark(vehicle.id)}
        />
      </span>
    </article>
  );
}
