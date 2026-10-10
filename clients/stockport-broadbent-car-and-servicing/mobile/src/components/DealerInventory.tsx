'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { sortVehicles } from '@/lib/search';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, IconButton, Modal, ui } from './ui';
import { AssistantFab, AssistantPanel } from './AssistantEntry';
import { VehicleCard } from './VehicleCard';
const s = stylex.create({
  body: {
    backgroundColor: colors.surface,
    padding: 12,
    paddingBottom: 92,
    minHeight: 'calc(100dvh - 60px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  listings: { display: 'grid', gap: 12 },
  grid: {
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
  },
  row: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    minHeight: 49,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    fontSize: 16,
  },
  radio: { width: 20, height: 20, accentColor: colors.deepPurple },
});
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
export function DealerInventory({
  vehicle,
  sort = 'standard',
}: {
  vehicle: Vehicle;
  sort?: string;
}) {
  const router = useRouter();
  const { view } = useAppState();
  const [open, setOpen] = useState(false);
  const selected = sorts.some(([id]) => id === sort) ? sort : 'standard';
  const inventory = sortVehicles(
    vehicles.filter((v) => v.dealer === vehicle.dealer),
    selected,
  );
  return (
    <>
      <Header
        title={inventory.length + (inventory.length === 1 ? ' Offer' : ' Offers')}
        back="/my-searches?tab=dealers"
      >
        <IconButton
          icon={
            ['price-asc', 'mileage', 'oldest', 'listing-oldest'].includes(selected)
              ? 'sortAscending'
              : 'sortDescending'
          }
          label="Sort options"
          onClick={() => setOpen(true)}
        />
        <IconButton
          icon={view === 'list' ? 'layoutCard' : 'grid'}
          label="Toggle Views"
          onClick={() => patchState({ view: view === 'list' ? 'grid' : 'list' })}
        />
      </Header>
      <div {...stylex.props(s.body)}>
        <AssistantPanel />
        <div {...stylex.props(s.listings, view === 'grid' && s.grid)}>
          {inventory.map((v) => (
            <VehicleCard key={v.id} vehicle={v} grid={view === 'grid'} />
          ))}
        </div>
        <p {...stylex.props(ui.small, ui.muted, ui.center)}>
          Captured listings from {vehicle.dealer}. Not live inventory.
        </p>
      </div>
      <AssistantFab compact low />
      <Modal open={open} onClose={() => setOpen(false)} title="Sort By">
        {sorts.map(([id, label]) => (
          <label key={id} {...stylex.props(s.row)}>
            <input
              type="radio"
              name="dealer-sort"
              checked={id === selected}
              onChange={() => {
                router.replace('/dealer/' + vehicle.id + (id === 'standard' ? '' : '?sort=' + id), {
                  scroll: false,
                });
                setOpen(false);
              }}
              {...stylex.props(s.radio)}
            />
            {label}
          </label>
        ))}
        <Button variant="ghost" onClick={() => setOpen(false)} block>
          Cancel
        </Button>
      </Modal>
    </>
  );
}
