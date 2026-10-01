'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { vehicles } from '@/lib/catalog';
import { notify, patchState, removeParkedVehicle, useAppState } from '@/lib/store';
import { money, number } from '@/lib/search';
import { Header } from './Header';
import { Icon, type IconName } from './Icon';
import { Button, IconButton, Modal, ui } from './ui';
import { PriceRating } from './VehicleCard';
import { FinanceCalculator } from './FinanceCalculator';
const s = stylex.create({
  body: {
    backgroundColor: colors.surface,
    minHeight: 'calc(100dvh - 124px)',
    padding: 14,
    paddingTop: 0,
    paddingBottom: 40,
  },
  notice: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    minHeight: 90,
    paddingInline: 10,
    fontSize: 14,
    lineHeight: '20px',
  },
  card: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.background,
    marginBottom: 12,
  },
  top: {
    display: 'grid',
    gridTemplateColumns: '108px minmax(0,1fr)',
    gap: 12,
    color: colors.text,
    textDecoration: 'none',
  },
  image: { width: 108, height: 81, objectFit: 'cover', borderRadius: 8 },
  name: { fontSize: 16, fontWeight: 700, lineHeight: '20px' },
  variant: {
    fontSize: 14,
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  price: { fontSize: 20, lineHeight: '28px', fontWeight: 700 },
  priceRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 4 },
  specs: { fontSize: 14, lineHeight: '20px', marginTop: 8 },
  parked: { fontSize: 12, lineHeight: '20px', color: colors.muted, marginTop: 12 },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 8, marginTop: 20 },
  dots: {
    width: 40,
    height: 44,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 24,
    color: colors.text,
  },
  vat: { fontSize: 12, lineHeight: '20px', color: colors.muted, padding: 10, paddingTop: 2 },
  section: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    color: colors.muted,
    paddingInline: 8,
    marginBottom: 6,
  },
  saleCard: { padding: 32, paddingTop: 24 },
  saleTitle: { fontSize: 14, lineHeight: '20px', fontWeight: 700 },
  sale: {
    fontSize: 16,
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    textDecoration: 'none',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    paddingBottom: 12,
    marginBottom: 8,
  },
  success: { color: colors.green },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    lineHeight: '20px',
    color: colors.muted,
    marginTop: 8,
  },
  handle: {
    width: 32,
    height: 4,
    margin: '0 auto 20px',
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  menu: {
    width: '100%',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    paddingInline: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 16,
    textAlign: 'left',
  },
  sortHeading: { fontSize: 16, lineHeight: '24px', fontWeight: 700, marginBottom: 16 },
  sortRow: { height: 48, fontSize: 14, gap: 20 },
  delete: { color: colors.accent },
  radio: { width: 20, height: 20, accentColor: colors.deepPurple },
  undo: {
    position: 'fixed',
    bottom: 92,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 120,
    width: 'calc(100% - 32px)',
    maxWidth: 1068,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1b1b21',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 14,
  },
  undoButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: '#fff',
    fontWeight: 700,
    padding: 4,
  },
  textarea: {
    width: '100%',
    minHeight: 150,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 8,
    padding: 12,
  },
});
const sorting = [
  ['price-asc', 'Price (lowest first)'],
  ['price-desc', 'Price (highest first)'],
  ['oldest', 'Oldest parking first'],
  ['newest', 'Newest parking first'],
  ['make-asc', 'Make A - Z'],
  ['make-desc', 'Make Z - A'],
];
export function NativeCarPark() {
  const state = useAppState();
  const { parked, parkedAt, parkNotes, parkNoticeDismissed, dealers } = state;
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ id: string; mode: string } | null>(null);
  const [note, setNote] = useState('');
  const [removed, setRemoved] = useState<string | null>(null);
  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(timer);
  }, [removed]);
  const selected = vehicles
    .filter((v) => parked.includes(v.id))
    .sort((a, b) => {
      const time =
        (parkedAt[a.id] || parked.indexOf(a.id)) - (parkedAt[b.id] || parked.indexOf(b.id));
      return sort === 'price-asc'
        ? a.price - b.price
        : sort === 'price-desc'
          ? b.price - a.price
          : sort === 'oldest'
            ? time
            : sort === 'newest'
              ? -time
              : sort === 'make-asc'
                ? (a.make + ' ' + a.model).localeCompare(b.make + ' ' + b.model)
                : (b.make + ' ' + b.model).localeCompare(a.make + ' ' + a.model);
    });
  const vehicle = vehicles.find((v) => v.id === dialog?.id);
  async function share(id?: string) {
    try {
      await navigator.clipboard.writeText(location.origin + (id ? '/vehicle/' + id : '/car-park'));
      notify('Link copied');
    } catch {
      notify('Use the browser address to copy this local reference link.');
    }
  }
  const menuItems: [string, IconName][] = [
    ['Share', 'share'],
    ['Show on map', 'map'],
    ['Notes', 'edit'],
    ['Calculate Financing', 'calculator'],
    [
      menu && dealers.includes(menu) ? 'Unfollow this dealer' : 'Follow this dealer',
      menu && dealers.includes(menu) ? 'userRemove' : 'userAdd',
    ],
    ['Compare insurance', 'shield'],
    ['Delete', 'trash'],
  ];
  function action(label: string) {
    const id = menu;
    if (!id) return;
    setMenu(null);
    if (label === 'Share') {
      void share(id);
      return;
    }
    if (label === 'Delete') {
      removeParkedVehicle(id);
      setRemoved(id);
      return;
    }
    if (label === 'Follow this dealer' || label === 'Unfollow this dealer') {
      const followed = dealers.includes(id);
      patchState({
        dealers: followed
          ? dealers.filter((value) => value !== id)
          : [...new Set([...dealers, id])],
      });
      notify(followed ? 'Dealer unfollowed' : 'Dealer followed');
      return;
    }
    if (label === 'Notes') setNote(parkNotes[id] || '');
    setDialog({ id, mode: label });
  }
  return (
    <>
      <Header title={'Car Park (' + selected.length + ')'}>
        {selected.length > 1 && (
          <Button href="/compare" variant="ghost">
            Compare
          </Button>
        )}
        <IconButton
          icon={
            ['price-asc', 'oldest', 'make-asc'].includes(sort) ? 'sortAscending' : 'sortDescending'
          }
          label="Sort options"
          onClick={() => setSortOpen(true)}
        />
        <IconButton icon="share" label="Share via" onClick={() => void share()} />
      </Header>
      <div {...stylex.props(s.body)}>
        {!parkNoticeDismissed && (
          <div {...stylex.props(s.notice)}>
            <span {...stylex.props(ui.muted)}>
              <Icon name="bellOn" size={24} />
            </span>
            <p {...stylex.props(ui.grow)}>Notifications for direct offers are now available.</p>
            <IconButton
              icon="close"
              label="Dismiss notification"
              onClick={() => patchState({ parkNoticeDismissed: true })}
            />
          </div>
        )}
        {selected.map((v) => (
          <article key={v.id} {...stylex.props(s.card)}>
            <Link href={'/vehicle/' + v.id} {...stylex.props(s.top)}>
              <Image
                src={v.images[0]}
                alt={v.make + ' ' + v.model}
                width={108}
                height={81}
                {...stylex.props(s.image)}
              />
              <div>
                <h2 {...stylex.props(s.name)}>
                  {v.make} {v.model}
                </h2>
                <p {...stylex.props(s.variant)}>{v.variant}</p>
                <div {...stylex.props(s.priceRow)}>
                  <strong {...stylex.props(s.price)}>{money(v.price)}</strong>
                  <PriceRating veryGood={v.deal} list />
                </div>
              </div>
            </Link>
            <p {...stylex.props(s.specs)}>
              FR {v.registration} • {number(v.mileage)} km • {Math.round(v.power / 1.36)} kW (
              {v.power} hp) • {v.fuel}
            </p>
            <p {...stylex.props(s.parked)}>
              {parkedAt[v.id]
                ? 'Parked on ' + new Date(parkedAt[v.id]).toLocaleDateString('en-US')
                : 'Parked on this device'}{' '}
              for {v.price.toLocaleString('de-DE')} €
            </p>
            <div {...stylex.props(s.actions)}>
              <Button href={'/vehicle/' + v.id + '/message'} variant="outline" icon="mail">
                Message
              </Button>
              <Button
                variant="purple"
                icon="phone"
                onClick={() => setDialog({ id: v.id, mode: 'Call' })}
              >
                Call
              </Button>
              <button
                type="button"
                aria-label={'Options for ' + v.make + ' ' + v.model}
                onClick={() => setMenu(v.id)}
                {...stylex.props(s.dots)}
              >
                ⋮
              </button>
            </div>
          </article>
        ))}
        <p {...stylex.props(s.vat)}>¹ VAT deductible</p>
        <h2 {...stylex.props(s.section)}>Fast Sale</h2>
        <section {...stylex.props(s.card, s.saleCard)}>
          <Link href="/sell/direct" {...stylex.props(s.sale)}>
            <span {...stylex.props(ui.orange)}>
              <Icon name="timer" size={32} />
            </span>
            <span {...stylex.props(ui.grow)}>
              <strong {...stylex.props(s.saleTitle)}>Express sale</strong>
              <br />
              Quick direct sale to verified dealers
            </span>
            <Icon name="right" size={20} />
          </Link>
          {[
            'Free choice of buying stations in your area',
            'Reliable car sale in just 24 hours',
          ].map((text) => (
            <p key={text} {...stylex.props(s.benefit)}>
              <span {...stylex.props(s.success)}>
                <Icon name="checkCircle" size={16} />
              </span>
              {text}
            </p>
          ))}
        </section>
      </div>
      <Modal open={sortOpen} onClose={() => setSortOpen(false)} sheet nativeSheet>
        <div {...stylex.props(s.handle)} />
        <h2 {...stylex.props(s.sortHeading)}>Sort By</h2>
        {sorting.map(([id, label]) => (
          <label key={id} {...stylex.props(s.menu, s.sortRow)}>
            <input
              type="radio"
              name="park-sort"
              checked={id === sort}
              onChange={() => {
                setSort(id);
                setSortOpen(false);
              }}
              {...stylex.props(s.radio, controls.radio)}
            />
            {label}
          </label>
        ))}
      </Modal>
      <Modal open={menu !== null} onClose={() => setMenu(null)} sheet nativeSheet>
        <div {...stylex.props(s.handle)} />
        {menuItems.map(([label, icon]) => (
          <button
            type="button"
            key={label}
            onClick={() => action(label)}
            {...stylex.props(s.menu, label === 'Delete' && s.delete)}
          >
            {label === 'Compare insurance' ? (
              <Image src="/icons/check24.svg" alt="" width={22} height={22} />
            ) : (
              <Icon name={icon} size={22} />
            )}
            {label}
          </button>
        ))}
      </Modal>
      <Modal open={dialog !== null} onClose={() => setDialog(null)} title={dialog?.mode}>
        {vehicle && dialog?.mode === 'Calculate Financing' ? (
          <FinanceCalculator vehicle={vehicle} onClose={() => setDialog(null)} />
        ) : dialog?.mode === 'Notes' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (dialog) patchState({ parkNotes: { ...parkNotes, [dialog.id]: note.trim() } });
              setDialog(null);
            }}
            {...stylex.props(ui.column)}
          >
            <label {...stylex.props(ui.label)}>
              Private note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={4000}
                {...stylex.props(s.textarea)}
              />
            </label>
            <p {...stylex.props(ui.small, ui.muted)}>Saved on this device only.</p>
            <Button type="submit">Save note</Button>
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
          </form>
        ) : (
          <div {...stylex.props(ui.column)}>
            <strong>{vehicle?.dealer}</strong>
            <p>{vehicle?.location}</p>
            <p>
              This external service is not connected in the local interface reference. No call,
              enquiry or insurance request has been made.
            </p>
            <Button onClick={() => setDialog(null)}>Close</Button>
          </div>
        )}
      </Modal>
      {removed && (
        <div role="status" {...stylex.props(s.undo)}>
          <span {...stylex.props(ui.grow)}>Parked vehicle removed.</span>
          <button
            type="button"
            onClick={() => {
              patchState({ parked: [...new Set([...parked, removed])] });
              setRemoved(null);
            }}
            {...stylex.props(s.undoButton)}
          >
            Undo
          </button>
        </div>
      )}
    </>
  );
}
