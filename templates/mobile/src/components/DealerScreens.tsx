'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { money, number } from '@/lib/search';
import { notify, patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, Modal, ui } from './ui';
import { Icon } from './Icon';
import { VehicleCard } from './VehicleCard';
import { ContactSheet } from './ContactSheet';
const s = stylex.create({
  body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 },
  banner: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    textAlign: 'center',
  },
  stars: { fontSize: 24, letterSpacing: 3, color: colors.accent },
  map: {
    minHeight: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 12,
    padding: 24,
  },
  tableWrap: { width: '100%', overflowX: 'auto', padding: 16 },
  table: { borderCollapse: 'collapse', minWidth: 580, width: '100%' },
  cell: {
    minWidth: 180,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  rowLabel: { minWidth: 110, fontSize: 12, color: colors.muted, fontWeight: 400 },
  thumb: { width: 180, height: 120, objectFit: 'cover', borderRadius: 8 },
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 800px)': 'repeat(2,minmax(0,1fr))' },
    gap: 16,
  },
});
export function DealerScreen({ vehicle: v }: { vehicle: Vehicle }) {
  const { dealers } = useAppState();
  const followed = dealers.includes(v.id);
  const [contact, setContact] = useState(false);
  const [location, setLocation] = useState(false);
  const listings = vehicles.filter((car) => car.dealer === v.dealer);
  return (
    <>
      <Header title="Dealer" back={'/vehicle/' + v.id} />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(s.banner)}>
          <Icon name="building" size={60} />
          <h1 {...stylex.props(ui.heading)}>{v.dealer}</h1>
          <span {...stylex.props(s.stars)}>★★★★★</span>
          <p>
            {v.rating} / 5 · {number(v.reviews)} reviews
          </p>
          <Button
            variant={followed ? 'outline' : 'purple'}
            icon="star"
            onClick={() => {
              patchState({
                dealers: followed ? dealers.filter((id) => id !== v.id) : [...dealers, v.id],
              });
              notify(followed ? 'Dealer unfollowed' : 'Dealer followed on this device');
            }}
          >
            {followed ? 'Following' : 'Follow dealer'}
          </Button>
        </section>
        <div {...stylex.props(ui.grid2)}>
          <Button icon="phone" onClick={() => setContact(true)}>
            Contact
          </Button>
          <Button variant="outline" icon="pin" onClick={() => setLocation(true)}>
            Location
          </Button>
        </div>
        <section>
          <h2 {...stylex.props(ui.title, ui.bottomSpace)}>Vehicles from this dealer</h2>
          <div {...stylex.props(s.grid)}>
            {listings.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        </section>
        <p {...stylex.props(ui.small, ui.muted)}>
          Captured dealer information and representative local fixtures. Contact and map services
          are not connected.
        </p>
      </div>
      <ContactSheet vehicle={v} open={contact} onClose={() => setContact(false)} />
      <Modal open={location} onClose={() => setLocation(false)} title="Location">
        <div {...stylex.props(ui.column)}>
          <div {...stylex.props(s.map)}>
            <Icon name="pin" size={38} />
            <strong>{v.location}</strong>
          </div>
          <p>Interactive maps and directions are not connected in this local reference.</p>
          <Button onClick={() => setLocation(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
export function CompareScreen() {
  const { parked } = useAppState();
  const selected = vehicles.filter((v) => parked.includes(v.id)).slice(0, 3);
  const rows: [string, (v: Vehicle) => string][] = [
    ['Price', (v) => money(v.price)],
    ['First registration', (v) => v.registration],
    ['Mileage', (v) => number(v.mileage) + ' km'],
    ['Fuel', (v) => v.fuel],
    ['Power', (v) => v.power + ' hp'],
    ['Transmission', (v) => v.transmission],
    ['Body type', (v) => v.body],
    ['Location', (v) => v.location],
  ];
  return (
    <>
      <Header title="Compare vehicles" back="/car-park" />
      {selected.length < 2 ? (
        <section {...stylex.props(ui.empty)}>
          <Icon name="car" size={56} />
          <h1 {...stylex.props(ui.title)}>Park at least two vehicles</h1>
          <p>Your first three parked vehicles can be compared here.</p>
          <Button href="/results">Browse vehicles</Button>
        </section>
      ) : (
        <div {...stylex.props(s.tableWrap)}>
          <table {...stylex.props(s.table)}>
            <caption {...stylex.props(ui.srOnly)}>Comparison of parked vehicles</caption>
            <thead>
              <tr>
                <th scope="col" {...stylex.props(s.cell, s.rowLabel)}>
                  Vehicle
                </th>
                {selected.map((v) => (
                  <th scope="col" key={v.id} {...stylex.props(s.cell)}>
                    <Link href={'/vehicle/' + v.id} {...stylex.props(ui.resetLink)}>
                      <Image
                        src={v.images[0]}
                        alt={v.make + ' ' + v.model}
                        width={180}
                        height={120}
                        {...stylex.props(s.thumb)}
                      />
                      <p>
                        {v.make} {v.model}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row" {...stylex.props(s.cell, s.rowLabel)}>
                    {label}
                  </th>
                  {selected.map((v) => (
                    <td key={v.id} {...stylex.props(s.cell)}>
                      {value(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
