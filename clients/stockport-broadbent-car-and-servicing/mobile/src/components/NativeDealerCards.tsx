'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { capturedDealers } from '@/lib/dealers';
import { patchState, useAppState } from '@/lib/store';
import { colors } from '@/styles/tokens.stylex';
import { Button, Modal, ui } from './ui';
import { Icon, type IconName } from './Icon';
import { RatingStars } from './RatingStars';
const s = stylex.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
    scrollMarginTop: 260,
  },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '24px',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  pad: { padding: 16 },
  titlePad: { padding: 16, paddingBottom: 0 },
  ratingRow: {
    width: '100%',
    height: 96,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    textAlign: 'left',
  },
  rating: { fontFamily: 'var(--font-hero)', fontSize: 40, fontWeight: 700, lineHeight: '56px' },
  reviews: { fontSize: 14, lineHeight: '20px' },
  section: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: colors.line, padding: 16 },
  highlights: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  tag: {
    paddingInline: 8,
    borderRadius: 5,
    backgroundColor: colors.surface,
    fontSize: 14,
    lineHeight: '20px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 16,
    marginTop: 28,
    paddingBlock: 4,
  },
  statsOnly: { marginTop: 0 },
  stat: { display: 'flex', alignItems: 'center', gap: 16, minHeight: 40 },
  label: { fontSize: 12, lineHeight: '20px', color: colors.muted },
  value: { fontSize: 14, fontWeight: 700, lineHeight: '20px' },
  note: { fontSize: 12, lineHeight: '20px', color: colors.muted },
  logo: {
    width: 128,
    height: 48,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  address: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    textDecoration: 'none',
    color: colors.text,
    paddingBlock: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    fontSize: 14,
    lineHeight: '20px',
  },
  name: { fontSize: 16, fontWeight: 500, lineHeight: '24px' },
  text: { whiteSpace: 'pre-line', fontSize: 14, lineHeight: '20px' },
  subheading: { fontSize: 16, fontWeight: 500, lineHeight: '24px', marginBottom: 4 },
  follow: { paddingTop: 10, paddingInline: 16 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    width: '100%',
    minHeight: 64,
    padding: 16,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: 'transparent',
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
  },
});
export function NativeDealerCards({ vehicle: v }: { vehicle: Vehicle }) {
  const data = capturedDealers[v.id];
  const { dealers } = useAppState();
  const followed = dealers.includes(v.id);
  const [reviews, setReviews] = useState(false);
  const stats: [IconName, string, string][] = data
    ? [
        ['calendar', 'With mobile.de since', data.years],
        ['list', 'Dated vehicle examples', data.listings],
        ['check', 'Referrals', data.referrals],
        ['checklist', 'Vehicle as described', data.descriptionAccuracy],
      ]
    : [];
  return (
    <>
      <section id={'about-dealer-' + v.id} {...stylex.props(s.card)} aria-label="About this dealer">
        <div {...stylex.props(s.titlePad)}>
          <h2 {...stylex.props(s.heading)}>About this dealer</h2>
        </div>
{v.reviews > 0 && (        <button
          type="button"
          aria-label="View dealer ratings"
          onClick={() => setReviews(true)}
          {...stylex.props(s.ratingRow)}
        >
          <strong {...stylex.props(s.rating)}>{v.rating.toFixed(1)}</strong>
          <span {...stylex.props(ui.grow)}>
            <RatingStars rating={v.rating} />
            <br />
            <span {...stylex.props(s.reviews)}>({v.reviews} ratings)</span>
          </span>
          <span {...stylex.props(ui.muted)}>
            <Icon name="right" size={22} />
          </span>
        </button>)}
        {data && (
          <div {...stylex.props(s.section)}>
            {data.highlights.length > 0 && (
              <>
                <strong {...stylex.props(s.value)}>Customers highlight</strong>
                <div {...stylex.props(s.highlights)}>
                  {data.highlights.map((text) => (
                    <span key={text} {...stylex.props(s.tag)}>
                      {text}
                    </span>
                  ))}
                </div>
              </>
            )}
            <div {...stylex.props(s.stats, !data.highlights.length && s.statsOnly)}>
              {stats.filter(([, , value]) => value.trim()).map(([icon, label, value]) => (
                <div key={label} {...stylex.props(s.stat)}>
                  <span {...stylex.props(ui.orange)}>
                    <Icon name={icon} size={28} />
                  </span>
                  <div>
                    <p {...stylex.props(s.label)}>{label}</p>
                    <p {...stylex.props(s.value)}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <p {...stylex.props(s.section, s.note)}>
          {"Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership."}
        </p>
      </section>
      <section {...stylex.props(s.card)} aria-label="Dealer contact information">
        <div {...stylex.props(s.pad)}>
          <h2 {...stylex.props(s.heading)}>Dealer</h2>
          <span {...stylex.props(s.logo)}>
            {data ? (
              <Image src={data.logo} alt="" width={data.logoWidth || 48} height={48} />
            ) : (
              <Icon name="building" size={36} />
            )}
          </span>
          <Link href={'/dealer/' + v.id} {...stylex.props(s.address)}>
            <span {...stylex.props(ui.grow)}>
              <strong {...stylex.props(s.name)}>{v.dealer}</strong>
              <br />
              <span {...stylex.props(s.text)}>{data?.address || v.location}</span>
            </span>
            <span {...stylex.props(ui.muted)}>
              <Icon name="right" size={22} />
            </span>
          </Link>
          <div {...stylex.props(s.follow)}>
            <Button
              variant="outline"
              icon={followed ? 'userRemove' : 'userAdd'}
              onClick={() =>
                patchState({
                  dealers: followed ? dealers.filter((id) => id !== v.id) : [...dealers, v.id],
                })
              }
              block
            >
              {followed ? 'Following' : 'Follow this dealer'}
            </Button>
          </div>
        </div>
        {data && (
          <>
            {data.languages && (<div {...stylex.props(s.section)}>
              <h3 {...stylex.props(s.subheading)}>We speak</h3>
              <p {...stylex.props(s.text)}>{data.languages}</p>
            </div>)}
            <div {...stylex.props(s.section)}>
              <h3 {...stylex.props(s.subheading)}>Opening Hours</h3>
              <p {...stylex.props(s.text)}>{data.openingHours}</p>
            </div>
          </>
        )}
        <Link href={'/dealer/' + v.id + '/information'} {...stylex.props(s.footer)}>
          Imprint &amp; Additional Information
        </Link>
      </section>
      <Modal open={reviews && v.reviews > 0} onClose={() => setReviews(false)} title="Dealer ratings">
        <div {...stylex.props(ui.column)}>
          <strong>{v.dealer}</strong>
          <p>
            <strong {...stylex.props(s.rating)}>{v.rating}</strong> / 5 · {v.reviews} ratings
          </p>
          {data && (
            <div {...stylex.props(s.highlights)}>
              {data.highlights.map((text) => (
                <span key={text} {...stylex.props(s.tag)}>
                  {text}
                </span>
              ))}
            </div>
          )}
          <p {...stylex.props(s.note)}>
            Captured rating summary. Individual live reviews are not loaded in this reference.
          </p>
          <Button onClick={() => setReviews(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
