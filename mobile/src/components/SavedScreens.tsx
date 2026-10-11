'use client';
import { modelLabel } from '@/lib/native-taxonomy';
import { useState } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { filterVehicles, serializeFilters } from '@/lib/search';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { Button, CheckRow, IconButton, Modal, ui } from './ui';
import { VehicleCard } from './VehicleCard';
import { SaveSearchDialog } from './ResultsScreen';
import { FollowedDealers } from './FollowedDealers';
import { NativeCarPark } from './NativeCarPark';
const s = stylex.create({
  background: {
    minHeight: 'calc(100dvh - 124px)',
    backgroundColor: colors.surface,
    padding: 8,
    paddingBottom: 32,
  },
  info: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    paddingBlock: 8,
    paddingInline: 8,
    fontSize: 14,
    lineHeight: '20px',
  },
  infoIcon: { width: 24, flexShrink: 0 },
  emptyCard: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  emptyTitle: { fontSize: 14, fontWeight: 700, lineHeight: '20px', marginBottom: 8 },
  benefit: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: '20px' },
  tabbar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: 72,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  tab: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    backgroundColor: colors.background,
    color: colors.muted,
    fontSize: 14,
    fontWeight: 500,
  },
  active: {
    color: colors.accent,
    '::after': {
      content: '""',
      position: 'absolute',
      width: 80,
      height: 3,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
  },
  content: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: colors.surface,
    minHeight: 'calc(100dvh - 196px)',
  },
  lastResults: { textDecoration: 'none', color: colors.muted, fontSize: 14, lineHeight: '24px' },
  last: {
    padding: 16,
    marginInline: -8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  cardList: { display: 'grid', gap: 16 },
});
export function CarParkScreen() {
  const { parked, parkedAt } = useAppState();
  if (parked.length || Object.keys(parkedAt).length) return <NativeCarPark />;
  const selected = vehicles.filter((v) => parked.includes(v.id));
  return (
    <>
      <Header title={'Car Park (' + selected.length + ')'}>
        {selected.length > 1 && (
          <Button href="/compare" variant="ghost">
            Compare
          </Button>
        )}
      </Header>
      <div {...stylex.props(s.background)}>
        {selected.length ? (
          <div {...stylex.props(s.cardList)}>
            {selected.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <>
            <div {...stylex.props(s.info)}>
              <span {...stylex.props(s.infoIcon)}>
                <Icon name="info" size={24} />
              </span>
              <p>You haven’t parked any vehicle or synchronized your account with mobile.de.</p>
            </div>
            <section {...stylex.props(s.emptyCard)}>
              <h2 {...stylex.props(s.emptyTitle)}>Your Car Park – on PC, Tablet and Smartphone</h2>
              <p {...stylex.props(s.benefit)}>
                <span {...stylex.props(ui.orange)}>
                  <Icon name="checkCircle" size={16} />
                </span>
                Parked vehicles everywhere at a glance
              </p>
              <p {...stylex.props(s.benefit)}>
                <span {...stylex.props(ui.orange)}>
                  <Icon name="checkCircle" size={16} />
                </span>
                Transfer your favourites from your Tablet and Smartphone to your PC
              </p>
              <div {...stylex.props(ui.space)}>
                <Button href="/login" block>
                  Log In
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
export function MySearchesScreen({
  initialTab = 'searches',
}: {
  initialTab?: 'searches' | 'dealers';
}) {
  const { filters, saved } = useAppState();
  const [tab, setTab] = useState(initialTab);
  const [save, setSave] = useState(false);
  const [edit, setEdit] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [remove, setRemove] = useState<string | null>(null);
  return (
    <>
      <Header title="My Searches" />
      <div {...stylex.props(s.tabbar)}>
        {[
          ['searches', 'My Searches', 'searches'],
          ['dealers', 'My Dealers', 'building'],
        ].map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id === 'dealers' ? 'dealers' : 'searches')}
            {...stylex.props(s.tab, tab === id && s.active)}
          >
            <Icon name={icon === 'building' ? 'users' : 'searches'} size={24} />
            {label}
          </button>
        ))}
      </div>
      <div {...stylex.props(s.content)}>
        {tab === 'searches' ? (
          <>
            <h2 {...stylex.props(ui.title)}>Continue your search</h2>
            <section {...stylex.props(s.last)}>
              <strong>Your last search</strong>
              <Link href={'/results?' + serializeFilters(filters)} {...stylex.props(s.lastResults)}>
                {filterVehicles(vehicles, filters).length} Results
              </Link>
              <Button icon="searches" onClick={() => setSave(true)} block>
                Save Search
              </Button>
            </section>
            {saved.length > 0 && <h2 {...stylex.props(ui.title)}>Saved searches</h2>}
            {saved.map((item) => (
              <section key={item.id} {...stylex.props(ui.card, ui.column)}>
                <div {...stylex.props(ui.between)}>
                  <Button href={'/results?' + serializeFilters(item.filters)} variant="ghost">
                    {item.name}
                  </Button>
                  <IconButton
                    icon="trash"
                    label={'Delete ' + item.name}
                    onClick={() => setRemove(item.id)}
                  />
                </div>
                <p {...stylex.props(ui.muted)}>
                  {[...item.filters.makes, ...item.filters.models.map(modelLabel)].join(', ') ||
                    'All vehicles'}{' '}
                  · {filterVehicles(vehicles, item.filters).length} captured offers
                </p>
                <CheckRow
                  checked={item.notifications}
                  onChange={(notifications) =>
                    patchState({
                      saved: saved.map((s) => (s.id === item.id ? { ...s, notifications } : s)),
                    })
                  }
                >
                  Notifications preference
                </CheckRow>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEdit(item.id);
                    setName(item.name);
                  }}
                >
                  Rename search
                </Button>
              </section>
            ))}
          </>
        ) : (
          <FollowedDealers />
        )}
      </div>
      <SaveSearchDialog
        key={serializeFilters(filters)}
        open={save}
        onClose={() => setSave(false)}
        filters={filters}
      />
      <Modal open={edit !== null} onClose={() => setEdit(null)} title="Rename search">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            patchState({
              saved: saved.map((s) =>
                s.id === edit ? { ...s, name: name.trim() || 'My search' } : s,
              ),
            });
            setEdit(null);
          }}
          {...stylex.props(ui.column)}
        >
          <input
            aria-label="Search name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            {...stylex.props(ui.input)}
          />
          <Button type="submit">Save</Button>
          <Button variant="ghost" onClick={() => setEdit(null)}>
            Cancel
          </Button>
        </form>
      </Modal>
      <Modal open={remove !== null} onClose={() => setRemove(null)} title="Delete saved search?">
        <div {...stylex.props(ui.column)}>
          <p>This removes the search saved in this browser.</p>
          <Button
            onClick={() => {
              patchState({ saved: saved.filter((s) => s.id !== remove) });
              setRemove(null);
            }}
          >
            Delete search
          </Button>
          <Button variant="ghost" onClick={() => setRemove(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
