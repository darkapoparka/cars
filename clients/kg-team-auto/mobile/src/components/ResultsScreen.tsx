'use client';
import { modelLabel } from '@/lib/native-taxonomy';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { vehicles } from '@/lib/catalog';
import { filterVehicles, parseFilters, serializeFilters, sortVehicles } from '@/lib/search';
import { patchState, saveSearch, useAppState } from '@/lib/store';
import type { Filters } from '@/lib/types';
import { ResultFilterChips } from './ResultFilterChips';
import { Header } from './Header';
import { AuthPrompt } from './AuthPrompt';
import { Button, IconButton, Modal, ui } from './ui';
import { Icon } from './Icon';
import { VehicleCard } from './VehicleCard';
import { AssistantFab, AssistantPanel } from './AssistantEntry';
const s = stylex.create({
  about: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: 16,
    paddingBlock: 8,
    lineHeight: '24px',
    borderWidth: 0,
    backgroundColor: colors.surface,
    color: colors.muted,
    textAlign: 'left',
    fontSize: 12,
  },
  content: {
    padding: 12,
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 100,
    backgroundColor: colors.surface,
  },
  cards: { display: 'grid', gap: 16, gridTemplateColumns: '1fr' },
  grid: {
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
  },
  floating: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 4,
    zIndex: 35,
    boxShadow: '0 3px 12px #0002',
    borderRadius: 14,
  },
  sortRow: {
    fontFamily: 'AndroidReference, sans-serif',
    fontWeight: 400,
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    minHeight: 49,
    paddingBlock: 0,
    fontSize: 16,
    color: colors.muted,
  },
  sortRadio: { width: 22, height: 22, accentColor: colors.accent },
});
export function SaveSearchDialog({
  open,
  onClose,
  filters,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
}) {
  const [name, setName] = useState(
    [...filters.makes, ...filters.models.map(modelLabel)].join(' ') || 'My search',
  );
  const { email } = useAppState();
  if (!email)
    return (
      <AuthPrompt open={open} onClose={onClose} next={'/results?' + serializeFilters(filters)} />
    );
  return (
    <Modal open={open} onClose={onClose} title="Save search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSearch(name, filters);
          onClose();
        }}
        {...stylex.props(ui.column)}
      >
        <label {...stylex.props(ui.label)}>
          Search name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            {...stylex.props(ui.input)}
          />
        </label>
        <p {...stylex.props(ui.small, ui.muted)}>
          Saved on this browser. Live offer alerts are not connected.
        </p>
        <Button type="submit" block>
          Save Search
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </form>
    </Modal>
  );
}
export function ResultsScreen({ query }: { query: string }) {
  const router = useRouter();
  const filters = useMemo(() => parseFilters(query), [query]);
  const { view } = useAppState();
  const requestedSort = new URLSearchParams(query).get('sort') || 'standard';
  const sort = [
    'standard',
    'price-asc',
    'price-desc',
    'mileage',
    'mileage-desc',
    'oldest',
    'newest',
    'listing-oldest',
    'listing-newest',
  ].includes(requestedSort)
    ? requestedSort
    : 'standard';
  const [sortOpen, setSortOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [about, setAbout] = useState(false);
  const results = sortVehicles(filterVehicles(vehicles, filters), sort);
  useEffect(() => {
    patchState({ filters });
  }, [filters]);
  function change(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    patchState({ filters: next });
    router.replace(
      '/results?' + serializeFilters(next) + (sort === 'standard' ? '' : '&sort=' + sort),
      { scroll: false },
    );
  }
  const sorts = [
    ['standard', 'Standard sorting'],
    ['price-asc', 'Price (lowest first)'],
    ['price-desc', 'Price (highest first)'],
    ['mileage', 'Mileage (lowest first)'],
    ['mileage-desc', 'Mileage (highest first)'],
    ['oldest', 'First registration (oldest first)'],
    ['newest', 'First registration (newest first)'],
    ['listing-oldest', 'Listing (oldest first)'],
    ['listing-newest', 'Listing (newest first)'],
  ];
  return (
    <>
      <Header title={results.length.toLocaleString('en-GB') + ' Offers'} back="/search">
        <IconButton
          icon={
            ['price-asc', 'mileage', 'oldest', 'listing-oldest'].includes(sort)
              ? 'sortAscending'
              : 'sortDescending'
          }
          label="Sort options"
          onClick={() => setSortOpen(true)}
        />
        <IconButton
          icon={view === 'list' ? 'layoutCard' : 'grid'}
          label="Toggle Views"
          onClick={() => patchState({ view: view === 'list' ? 'grid' : 'list' })}
        />
      </Header>
      <ResultFilterChips filters={filters} onChange={change} />
      <button onClick={() => setAbout(true)} {...stylex.props(s.about)}>
        <Icon name="info" size={18} />
        About Standard Sorting
      </button>
      <div {...stylex.props(s.content)}>
        <AssistantPanel />
        {results.length ? (
          <div {...stylex.props(s.cards, view === 'grid' && s.grid)}>
            {results.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                grid={view === 'grid'}
                lease={filters.payment === 'lease'}
              />
            ))}
          </div>
        ) : (
          <section {...stylex.props(ui.empty)}>
            <Icon name="search" size={52} />
            <h2 {...stylex.props(ui.title)}>No matching vehicles</h2>
            <p>
              Try fewer filters or another make. This local reference has a limited captured
              inventory.
            </p>
            <Button href="/search" variant="outline">
              Change filters
            </Button>
          </section>
        )}
        <p {...stylex.props(ui.small, ui.muted, ui.center)}>
          Captured reference listings · Not live offers · Representative demo specifications
        </p>
      </div>
      <div {...stylex.props(s.floating)}>
        <Button icon="searches" floating onClick={() => setSaveOpen(true)}>
          Save search
        </Button>
      </div>
      <AssistantFab compact low />
      <Modal sorting open={sortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        {sorts.map(([value, label]) => (
          <label key={value} {...stylex.props(s.sortRow)}>
            <input
              type="radio"
              name="sort"
              value={value}
              checked={sort === value}
              onChange={() => {
                router.replace(
                  '/results?' +
                    serializeFilters(filters) +
                    (value === 'standard' ? '' : '&sort=' + value),
                  { scroll: false },
                );
                setSortOpen(false);
              }}
              {...stylex.props(s.sortRadio, controls.radio, controls.orangeRadio)}
            />
            {label}
          </label>
        ))}
      </Modal>
      <SaveSearchDialog
        key={serializeFilters(filters)}
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        filters={filters}
      />
      <Modal open={about} onClose={() => setAbout(false)} title="About Standard Sorting">
        <div {...stylex.props(ui.column)}>
          <p>
            The captured sponsored listing appears first. Price, mileage, registration and power
            sorting work on the local inventory.
          </p>
          <p>
            This is an independent interface reference, not the live marketplace. Listings and
            prices are captured examples.
          </p>
          <Button onClick={() => setAbout(false)} block>
            Got it
          </Button>
        </div>
      </Modal>
    </>
  );
}
