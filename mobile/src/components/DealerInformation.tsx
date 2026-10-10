import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { colors } from '@/styles/tokens.stylex';
import { Header } from './Header';
import { Icon } from './Icon';
const s = stylex.create({
  body: { backgroundColor: colors.surface, minHeight: 'calc(100dvh - 60px)', padding: 16 },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    color: colors.text,
  },
  row: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, lineHeight: '28px' },
  note: { fontSize: 12, lineHeight: '20px', color: colors.muted, marginTop: 24 },
});
const hofmannServices = [
  'HU locally, by official provider',
  'Repair Center',
  'Repair Shop',
  'Paint Shop',
  'Smart Repair',
  'Autoglass',
  'Vehicle Preparation',
  'Tire Service',
  'Tinted Glass',
  'Spare Parts & Accessories',
  'New Cars',
  'AC Check',
  'Used Cars',
  'Winter Check',
  'Registration Service',
  'Inspection',
  'Financing',
  'Insurance',
  'Leasing',
  'Tire Storage',
  'Mobility guarantee',
  'Used vehicle trade-in',
  'Training organisation',
  'Bonus programme (customer card)',
  'Test drive',
  'Rental car service',
];
export function DealerInformation({ vehicle: v }: { vehicle: Vehicle }) {
  const hasCapturedServices = v.id === 'bmw-x6';
  return (
    <>
      <Header title="Additional Information" back={'/vehicle/' + v.id + '#about-dealer-' + v.id} />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(s.card)}>
          <h2 {...stylex.props(s.title)}>Additional Services</h2>
          {hasCapturedServices ? (
            hofmannServices.map((service) => (
              <p key={service} {...stylex.props(s.row)}>
                <Icon name="check" size={24} />
                {service}
              </p>
            ))
          ) : (
            <p {...stylex.props(s.row)}>
              Additional services have not been captured for this dealer.
            </p>
          )}
          <p {...stylex.props(s.note)}>
            Captured interface reference. Contact and service availability are not connected or
            verified in this local build.
          </p>
        </section>
      </div>
    </>
  );
}
