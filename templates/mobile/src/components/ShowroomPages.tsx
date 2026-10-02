'use client';
import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import type { Vehicle } from '@/lib/types';
import { restoreInventoryPosition, showroom, showroomInventoryHref } from '@/lib/showroom';
import { notify, saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon, type IconName } from './Icon';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { Button, ui } from './ui';

const services: { id: string; title: string; icon: IconName; copy: string }[] = [
  {
    id: 'financing',
    title: 'Financing',
    icon: 'wallet',
    copy: 'Discuss your budget, deposit and preferred monthly payment with the showroom.',
  },
  {
    id: 'trade-in',
    title: 'Part exchange',
    icon: 'car',
    copy: 'Thinking of changing your car? Ask about a valuation and using it towards your next one.',
  },
  {
    id: 'sourcing',
    title: 'Find a car',
    icon: 'search',
    copy: 'Tell us the make, model and budget you have in mind, even if it is not in the current selection.',
  },
  {
    id: 'viewing',
    title: 'Viewings & test drives',
    icon: 'calendar',
    copy: 'Ask about availability and arrange a time to see a car in person.',
  },
];
const s = stylex.create({
  page: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.stripe,
    minHeight: 'calc(100dvh - 124px)',
  },
  head: { paddingBlock: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  title: { fontSize: 28, lineHeight: '36px', fontWeight: 700 },
  intro: { fontSize: 16, lineHeight: '24px', color: colors.muted },
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
    gap: 20,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    minWidth: 0,
  },
  icon: {
    color: colors.purple,
    backgroundColor: colors.assistant,
    padding: 12,
    borderRadius: 12,
    display: 'inline-flex',
  },
  body: { fontSize: 16, lineHeight: '25px', color: colors.muted },
  note: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.muted,
    textAlign: 'center',
    paddingTop: 24,
  },
  textArea: {
    width: '100%',
    minHeight: 156,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    resize: 'vertical',
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: 16 },
  context: { fontSize: 16, lineHeight: '24px', fontWeight: 700 },
  saved: { color: colors.green, fontSize: 14, lineHeight: '22px' },
});

export function SavedCarsScreen() {
  const { parked, filters, inventorySort } = useAppState();
  const saved = vehicles.filter((vehicle) => parked.includes(vehicle.id));
  useEffect(restoreInventoryPosition, []);
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>Saved cars</h1>
          <p {...stylex.props(s.intro)}>
            {saved.length
              ? saved.length + (saved.length === 1 ? ' car' : ' cars') + ' saved on this device.'
              : 'Keep the cars you like in one place.'}
          </p>
        </div>
        {saved.length ? (
          <div {...stylex.props(s.grid)}>
            {saved.map((vehicle) => (
              <ShowroomVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <Icon name="heart" size={44} />
            <h2 {...stylex.props(ui.title)}>Your shortlist starts here</h2>
            <p>Tap the heart on a car to save it for later.</p>
            <Button href={showroomInventoryHref(filters, inventorySort)}>Browse cars</Button>
          </div>
        )}
      </div>
    </>
  );
}

export function ShowroomServicesScreen() {
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>Services</h1>
          <p {...stylex.props(s.intro)}>A little help with your next car.</p>
        </div>
        <div {...stylex.props(s.grid)}>
          {services.map((service) => (
            <section key={service.id} {...stylex.props(s.card)}>
              <span {...stylex.props(s.icon)}>
                <Icon name={service.icon} size={28} />
              </span>
              <h2 {...stylex.props(ui.title)}>{service.title}</h2>
              <p {...stylex.props(s.body)}>{service.copy}</p>
              <Button href={'/contact?service=' + service.id} variant="outline">
                Ask about {service.title.toLowerCase()}
              </Button>
            </section>
          ))}
        </div>
        <p {...stylex.props(s.note)}>Showroom template preview · Example services</p>
      </div>
    </>
  );
}

export function ShowroomContactScreen({
  vehicle,
  serviceId,
}: {
  vehicle?: Vehicle;
  serviceId?: string;
}) {
  const { messageDrafts } = useAppState();
  const service = services.find((item) => item.id === serviceId);
  const draftKey = vehicle?.id || 'showroom-' + (service?.id || 'general');
  const initial = vehicle
    ? `Hello, I'm interested in the ${vehicle.make} ${vehicle.model}. Could we arrange a viewing?`
    : service
      ? `Hello, I'd like to ask about ${service.title.toLowerCase()}.`
      : '';
  const [edited, setEdited] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const message = edited ?? messageDrafts[draftKey] ?? initial;
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>Contact</h1>
          <p {...stylex.props(s.intro)}>Ask a question or arrange a viewing.</p>
        </div>
        <div {...stylex.props(s.grid)}>
          <section {...stylex.props(s.card)}>
            <span {...stylex.props(s.icon)}>
              <Icon name="pin" size={28} />
            </span>
            <h2 {...stylex.props(ui.title)}>{showroom.name}</h2>
            <p {...stylex.props(s.body)}>
              {showroom.address || 'Address and opening hours to be confirmed.'}
            </p>
            {showroom.hours.map((hours) => (
              <p key={hours}>{hours}</p>
            ))}
            {showroom.phone && (
              <Button href={'tel:' + showroom.phone} icon="phone" block>
                Call the showroom
              </Button>
            )}
            {showroom.email && (
              <Button href={'mailto:' + showroom.email} icon="mail" variant="outline" block>
                Email the showroom
              </Button>
            )}
            {showroom.directionsUrl && (
              <Button href={showroom.directionsUrl} icon="pin" variant="outline" block>
                Directions
              </Button>
            )}
          </section>
          <section {...stylex.props(s.card)}>
            <h2 {...stylex.props(ui.title)}>Your enquiry</h2>
            {vehicle ? (
              <p {...stylex.props(s.context)}>
                {vehicle.make} {vehicle.model}
              </p>
            ) : service ? (
              <p {...stylex.props(s.context)}>{service.title}</p>
            ) : null}
            <form
              {...stylex.props(s.form)}
              onSubmit={(event) => {
                event.preventDefault();
                saveMessageDraft(draftKey, message);
                notify('Enquiry draft saved on this device. Nothing was sent.');
                setSaved(true);
              }}
            >
              <label {...stylex.props(ui.label)}>
                Message
                <textarea
                  aria-label="Enquiry message"
                  value={message}
                  onChange={(event) => {
                    setEdited(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Which car are you interested in?"
                  required
                  minLength={10}
                  maxLength={4000}
                  {...stylex.props(s.textArea)}
                />
              </label>
              <p {...stylex.props(ui.small, ui.muted)}>
                Preview: your enquiry is saved on this device.
              </p>
              <Button type="submit" block>
                Save enquiry draft
              </Button>
              {saved && (
                <p role="status" {...stylex.props(s.saved)}>
                  Draft saved on this device. Nothing was sent.
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
