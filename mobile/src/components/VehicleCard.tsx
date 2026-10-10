'use client';
import { formatStockMileage } from "../lib/dealer-mileage";
import { useLocale } from '@/lib/use-locale';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { money, number } from '@/lib/search';
import { togglePark, useAppState } from '@/lib/store';
import { Button, IconButton, Pill, ui } from './ui';
import { Icon } from './Icon';
import { RatingStars } from './RatingStars';
import { DealerLogo } from './DealerLogo';
import { ContactSheet } from './ContactSheet';
import { RelatedPhotos } from './RelatedPhotos';
const s = stylex.create({
  leaseCustomer: { fontSize: 12, lineHeight: '20px', marginTop: 4 },
  leaseTerms: { fontSize: 12, lineHeight: '20px', color: colors.muted },
  card: { minWidth: 0, position: 'relative' },
  ribbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 48,
    backgroundColor: colors.accent,
    color: '#fff',
    clipPath: 'polygon(0 0,100% 0,0 100%)',
    zIndex: 2,
  },
  ribbonText: {
    position: 'absolute',
    left: 9,
    top: 5,
    transform: 'rotate(-30deg)',
    fontSize: 14,
    fontWeight: 700,
  },
  dealerTop: { lineHeight: '20px', display: 'flex', gap: 6, alignItems: 'center' },
  nowrap: { whiteSpace: 'nowrap' },
  dealerLocation: { fontSize: 14, lineHeight: '20px' },
  dealerName: {
    fontSize: 14,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  reviewCount: { fontSize: 14, color: colors.muted, whiteSpace: 'nowrap' },
  listBar: { height: 6, width: 14 },
  home: { width: 281.333, flexShrink: 0, scrollSnapAlign: 'start' },
  photo: {
    position: 'relative',
    display: 'block',
    aspectRatio: '1.5',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f7f7f9',
  },
  photoLink: { position: 'absolute', inset: 0, display: 'block' },
  image: { objectFit: 'cover' },
  listPhoto: { aspectRatio: '4 / 3' },
  park: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: colors.purple,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTitle: { fontSize: 14, fontWeight: 700, lineHeight: '20px', marginTop: 8, marginBottom: 8 },
  price: { fontSize: 16, fontWeight: 700, lineHeight: '24px' },
  pricing: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rating: { color: colors.muted, fontSize: 12, lineHeight: '16px', fontWeight: 500 },
  detailRating: { color: colors.green, fontSize: 13, lineHeight: '18px' },
  detailBar: { width: 14, height: 3 },
  inactiveBar: { backgroundColor: colors.line },
  bars: { display: 'flex', gap: 3, marginBottom: 2 },
  bar: { width: 13, height: 2, borderRadius: 1, backgroundColor: colors.green },
  old: { textDecoration: 'line-through', fontSize: 14, fontWeight: 500, color: colors.accent },
  discount: {
    position: 'relative',
    backgroundColor: '#ff8f66',
    paddingLeft: 18,
    paddingRight: 8,
    clipPath: 'polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%)',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 5,
      top: 'calc(50% - 2px)',
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: '#fff',
    },
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
  },
  specs: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
  },
  list: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  compactTop: { display: 'grid', gridTemplateColumns: '40% minmax(0,1fr)', gap: 16 },
  compactTitle: { fontSize: 14, fontWeight: 700, lineHeight: '20px' },
  variant: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 14,
    fontWeight: 700,
  },
  listPrice: {
    fontSize: 20,
    lineHeight: '28px',
    fontFamily: 'var(--font-base)',
    fontWeight: 700,
    marginTop: 8,
  },
  metadata: { fontSize: 14, lineHeight: '20px', marginTop: 18, marginBottom: 16 },
  dealer: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 },
  similar: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    marginTop: 18,
    paddingTop: 16,
  },
  thumbs: { display: 'flex', gap: 8, overflowX: 'auto', marginTop: 8 },
  thumb: { width: 96, height: 72, objectFit: 'cover', borderRadius: 8 },
  financing: {
    fontSize: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 5,
    paddingInline: 4,
    display: 'inline-block',
    marginTop: 8,
  },
  sponsor: {
    fontSize: 10,
    fontWeight: 400,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'solid',
    borderRadius: 4,
    paddingInline: 4,
    marginRight: 4,
  },
});
export function PriceRating({
  veryGood = false,
  detail = false,
  list = false,
}: {
  veryGood?: boolean;
  detail?: boolean;
  list?: boolean;
}) {
  const { t } = useLocale();
  return (
    <span {...stylex.props(s.rating, detail && s.detailRating)}>
      <span {...stylex.props(s.bars)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            {...stylex.props(
              s.bar,
              detail && s.detailBar,
              list && s.listBar,
              !veryGood && i === 4 && s.inactiveBar,
            )}
          />
        ))}
      </span>
      {t(veryGood ? 'Very good price' : 'Good price')}
    </span>
  );
}
export function VehicleCard({
  vehicle: v,
  home = false,
  grid = false,
  lease = false,
}: {
  vehicle: Vehicle;
  home?: boolean;
  grid?: boolean;
  lease?: boolean;
}) {
  const { parked } = useAppState();
  const [contact, setContact] = useState(false);
  const saved = parked.includes(v.id);
  const href = '/vehicle/' + v.id;
  const photo = (
    <div {...stylex.props(s.photo, !home && s.listPhoto)}>
      <Link
        href={href}
        aria-label={'View ' + v.make + ' ' + v.model}
        {...stylex.props(s.photoLink)}
      >
        <Image
          src={v.images[0]}
          alt={v.make + ' ' + v.model}
          fill
          sizes={home ? '282px' : '(max-width: 600px) 45vw, 300px'}
          {...stylex.props(s.image)}
        />
      </Link>
      {home && (
        <span {...stylex.props(s.park)}>
          <IconButton
            icon="heart"
            label={(saved ? 'Unpark ' : 'Park ') + v.make + ' ' + v.model}
            filled={saved}
            onClick={() => togglePark(v.id)}
          />
        </span>
      )}
    </div>
  );
  return (
    <article {...stylex.props(s.card, home ? s.home : s.list)}>
      {!home && v.sponsored && (
        <span {...stylex.props(s.ribbon)}>
          <span {...stylex.props(s.ribbonText)}>TOP</span>
        </span>
      )}
      {home ? (
        <>
          {photo}
          <Link href={href} {...stylex.props(ui.resetLink)}>
            <h3 {...stylex.props(s.homeTitle)}>
              {v.make} {v.model}
            </h3>
          </Link>
          <div {...stylex.props(s.pricing)}>
            <strong {...stylex.props(s.price)}>
              {lease && v.monthly ? v.monthly + ' GBP mth.' : money(v.price)}
            </strong>
            {!lease && v.priceRating && <PriceRating veryGood={v.priceRating === 'very-good'} />}
          </div>
          {lease ? (
            <>
              <span {...stylex.props(ui.badge)}>• DEAL</span>
              <p {...stylex.props(ui.small, ui.muted, ui.space)}>24 months, 5,000 km, incl. VAT</p>
            </>
          ) : (
            v.previousPrice && (
              <div {...stylex.props(ui.row)}>
                <span {...stylex.props(s.old)}>{money(v.previousPrice)}</span>
                <span {...stylex.props(s.discount)}>-{money(v.previousPrice - v.price)}</span>
              </div>
            )
          )}
          <div {...stylex.props(s.specs)}>
            {v.mileage > 0 && <Pill icon="registration">{v.year}</Pill>}
            <Pill icon="fuel">{v.fuel}</Pill>
            {v.power > 0 && <Pill icon="gauge">{v.power} HP</Pill>}
            {v.mileage > 0 && <Pill icon="mileage">{formatStockMileage(v)}</Pill>}
            <Pill icon="transmission">{v.transmission}</Pill>
          </div>
          <p {...stylex.props(s.location)}>
            <Icon name="pin" size={16} />
            {v.location}
          </p>
        </>
      ) : (
        <>
          <div {...stylex.props(!grid && s.compactTop)}>
            {photo}
            <Link href={href} {...stylex.props(ui.resetLink)}>
              <h3 {...stylex.props(s.compactTitle)}>
                {v.sponsored && <span {...stylex.props(s.sponsor)}>Sponsored</span>}
                {v.make} {v.model}
              </h3>
              <p {...stylex.props(s.variant)}>{v.variant}</p>
              {lease && v.leaseTerms && (
                <p {...stylex.props(s.leaseCustomer)}>For private customers</p>
              )}
              <div {...stylex.props(s.pricing)}>
                <strong {...stylex.props(s.listPrice)}>
                  {lease && v.monthly
                    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
                        v.monthly,
                      ) + ' mth. ¹'
                    : money(v.price)}
                </strong>
                {!lease && v.priceRating && (
                  <PriceRating veryGood={v.priceRating === 'very-good'} list />
                )}
              </div>
              {lease && v.leaseTerms && (
                <p {...stylex.props(s.leaseTerms)}>
                  {v.leaseTerms.months} months term •{' '}
                  {v.leaseTerms.annualMileage.toLocaleString('en-GB')} km per year, Leasing details
                </p>
              )}
              {(v.financeMonthly || v.monthly) && (
                <span {...stylex.props(s.financing)}>
                  Financing from {money(v.financeMonthly || v.monthly || 0)} mth.
                </span>
              )}
            </Link>
          </div>
          {lease && <p {...stylex.props(ui.small, ui.muted, ui.space)}>Price {money(v.price)}</p>}
          <p {...stylex.props(s.metadata)}>
            {v.mileage === 0
              ? 'New vehicle'
              : v.sample && v.id === 'bmw-x6'
                ? "Employee's Car"
                : 'Used vehicle'}{' '}
            •{' '}
            {v.mileage > 0 && (
              <>
                <span {...stylex.props(s.nowrap)}>FR {v.registration}</span> •{' '}
              </>
            )}
            <span {...stylex.props(s.nowrap)}>{formatStockMileage(v)}</span> •{' '}
            <span {...stylex.props(s.nowrap)}>
              {v.power > 0 ? Math.round(v.power / 1.36) + ' kW (' + v.power + ' hp)' : 'Power not published'}
            </span>{' '}
            • {v.fuel}
          </p>
          <Link href={'/dealer/' + v.id} {...stylex.props(s.dealer, ui.resetLink)}>
            <DealerLogo id={v.id} size={32} />
            <span {...stylex.props(ui.grow)}>
              <span {...stylex.props(s.dealerTop)}>
                <strong {...stylex.props(s.dealerName)}>{v.dealer}</strong>
                {v.reviews > 0 && (<><RatingStars rating={v.rating} size={20} />
                <span {...stylex.props(s.reviewCount)}>({v.reviews})</span></>)}
              </span>
              <span {...stylex.props(s.dealerLocation)}>{v.location}</span>
            </span>
          </Link>
          <div {...stylex.props(s.actions)}>
            <Button dense icon="phone" variant="outline" onClick={() => setContact(true)}>
              Contact
            </Button>
            <Button dense icon="heart" variant="outline" onClick={() => togglePark(v.id)}>
              {saved ? 'Parked' : 'Park'}
            </Button>
          </div>
          {v.sample && v.id === 'bmw-x6' ? (
            <RelatedPhotos />
          ) : (
            v.sponsored &&
            v.images.length > 1 && (
              <div {...stylex.props(s.similar)}>
                <p {...stylex.props(ui.small)}>More photos from this seller</p>
                <div {...stylex.props(s.thumbs)}>
                  {v.images.slice(1, 5).map((src, i) => (
                    <Link key={src} href={href + '/gallery'}>
                      <Image
                        src={src}
                        alt={'Vehicle photo ' + (i + 1)}
                        width={96}
                        height={72}
                        {...stylex.props(s.thumb)}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </>
      )}
      <ContactSheet vehicle={v} open={contact} onClose={() => setContact(false)} />
    </article>
  );
}
