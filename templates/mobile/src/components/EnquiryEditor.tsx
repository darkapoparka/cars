'use client';
// Reference-only editor: returns temporary form values, never sends requests or messages.
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { colors } from '@/styles/tokens.stylex';
import { capturedDealers } from '@/lib/dealers';
import { nativeCarMakes, modelGroupsFor } from '@/lib/native-taxonomy';
import { popularMakes } from '@/lib/makes';
import { nativeFilterOptions } from '@/lib/native-filter-options';
import {
  currentLocalDate,
  referenceDate,
  registrationMonths,
  capturedTradeOptions,
  changeEnquiryField,
  validTradeBasics,
  validTradeDetails,
  validVisit,
  visitTimes,
  type EnquiryKind,
  type EnquiryFields,
} from '@/lib/enquiry';
import { Header } from './Header';
import { Button, Modal, ui } from './ui';
import { Icon } from './Icon';
import { CalendarDialog } from './CalendarDialog';
import { NativeOptionSheet } from './NativeOptionSheet';
import { NativeChoicePage, type ChoiceGroup } from './NativeChoicePage';
const s = stylex.create({
  flow: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    overflowY: { default: 'visible', '@media (max-width: 699px)': 'auto' },
    overscrollBehaviorY: 'contain',
    scrollPaddingBlock: 16,
  },
  body: {
    padding: 16,
    paddingBottom: { default: 100, '@media (max-width: 699px)': 16 },
    overflowY: { default: 'auto', '@media (max-width: 699px)': 'visible' },
    flex: { default: '1', '@media (max-width: 699px)': 'none' },
  },
  title: { fontSize: 20, fontWeight: 500, lineHeight: '28px', marginBottom: 4 },
  copy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  lead: { fontSize: 16, lineHeight: '24px', color: colors.muted, marginBottom: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 },
  label: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  input: {
    height: 44,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    fontWeight: 400,
  },
  select: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 12,
    backgroundColor: { default: colors.background, ':disabled': colors.surface },
    color: colors.muted,
    textAlign: 'left',
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    lineHeight: { default: null, '@media (max-width: 699px)': '24px' },
    fontWeight: 400,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: '20px',
    whiteSpace: 'pre-line',
  },
  hours: { fontWeight: 500, marginTop: 8 },
  footer: {
    padding: 16,
    paddingBottom: 'calc(18px + env(safe-area-inset-bottom))',
    borderTopWidth: { default: 1, '@media (max-width: 699px)': 0 },
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 16,
    backgroundColor: colors.background,
  },
  one: { gridTemplateColumns: '1fr', borderTopWidth: 0, paddingBottom: 2 },
  action: {
    minHeight: 44,
    paddingBlock: { default: 10, '@media (max-width: 699px)': 8 },
    borderRadius: { default: 8, '@media (max-width: 699px)': 22 },
  },
  suffix: { position: 'relative' },
  suffixText: { position: 'absolute', right: 12, bottom: 12, fontSize: 14, color: colors.muted },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#bbd4ff',
    color: '#354477',
  },
  intro: { padding: 16, paddingBottom: 0, flexShrink: 0 },
  tradeBody: {
    padding: 0,
    paddingBottom: 0,
    overflow: { default: 'hidden', '@media (max-width: 699px)': 'visible' },
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  tradeForm: {
    marginTop: 0,
    padding: 16,
    overflowY: { default: 'auto', '@media (max-width: 699px)': 'visible' },
    flex: { default: '1', '@media (max-width: 699px)': 'none' },
    minHeight: 0,
  },
});
const months = registrationMonths;
type OpenChoice = {
  key: string;
  title: string;
  groups: ChoiceGroup[];
  brands?: boolean;
  sheet?: boolean;
};
export function EnquiryEditor({
  kind,
  initial,
  vehicle: v,
  onClose,
  onApply,
}: {
  kind: EnquiryKind;
  initial: EnquiryFields;
  vehicle: Vehicle;
  onClose: () => void;
  onApply: (values: EnquiryFields) => void;
}) {
  const [data, setData] = useState<EnquiryFields>({ ...initial });
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState<OpenChoice | null>(null);
  const [calendar, setCalendar] = useState(false);
  const [times, setTimes] = useState(false);
  const [today] = useState(currentLocalDate);
  const nativeDealer = capturedDealers[v.id];
  const address =
    nativeDealer?.address ||
    (v.id === 'bmw-540' ? 'Weseler Straße 655\nDE-48163 Münster' : v.location);
  const openingHours =
    nativeDealer?.openingHours ||
    (v.id === 'bmw-540'
      ? 'Mon - Fri 08:00 h - 19:00 h\nSat 09:00 h - 14:00 h\nSun 10:00 h - 17:00 h (Viewing day)'
      : '');
  function set(key: string, value: string) {
    setData((current) => changeEnquiryField(current, key, value));
  }
  const groups = (options: string[]): ChoiceGroup[] => [{ options }];
  function choose(key: string, title: string, options: ChoiceGroup[], brands = false) {
    setChoice({ key, title, groups: options, brands, sheet: kind === 'Trade-in' && step === 2 });
  }
  function dropdown(
    key: string,
    label: string,
    placeholder: string,
    options: ChoiceGroup[],
    disabled = false,
    brands = false,
  ) {
    return (
      <label {...stylex.props(s.label)}>
        {label}
        <button
          type="button"
          aria-label={'Open ' + label.toLowerCase() + ' selection'}
          disabled={disabled}
          onClick={() => choose(key, label, options, brands)}
          {...stylex.props(s.select)}
        >
          {data[key] || placeholder}
          <Icon name="down" size={24} />
        </button>
      </label>
    );
  }
  function text(key: string, label: string, placeholder: string, numeric = false, maxLength = 30) {
    return (
      <label {...stylex.props(s.label)}>
        {label}
        <input
          aria-label={label}
          inputMode={numeric ? 'numeric' : 'text'}
          value={data[key] || ''}
          onChange={(event) => {
            const value = event.target.value;
            if (!numeric || /^\d*$/.test(value)) set(key, value);
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          {...stylex.props(ui.input, s.input)}
        />
      </label>
    );
  }
  const title = kind === 'Trade-in' ? 'Trade in your car' : kind;
  const captured = capturedTradeOptions(data);
  const options = (key: string, fallback: string[]) => captured?.[key] || fallback;
  const valid =
    kind === 'Trade-in'
      ? validTradeDetails(data, today)
      : kind === 'Onsite visit'
        ? validVisit(data, today, openingHours)
        : Boolean(data.postal?.trim() && data.city?.trim());
  const brands: ChoiceGroup[] = [
    { title: 'Top Brands', options: popularMakes },
    {
      title: 'Other Brands',
      options: nativeCarMakes.filter((make) => !popularMakes.includes(make)),
    },
  ];
  const models: ChoiceGroup[] = modelGroupsFor(data.brand || '').map((group) =>
    group.children.length
      ? { title: group.name, options: group.children }
      : { options: [group.name] },
  );
  return (
    <Modal fullScreen label={title} open onClose={onClose}>
      <Header title={title} onBack={() => (step === 2 ? setStep(1) : onClose())} />
      <div data-enquiry-flow {...stylex.props(s.flow)}>
        <div {...stylex.props(s.body, kind === 'Trade-in' && s.tradeBody)}>
          {kind === 'Trade-in' ? (
            <>
              <div {...stylex.props(s.intro)}>
                <h2 {...stylex.props(s.title)}>
                  {step === 1 ? 'Basic Information (1/2)' : 'Optional Details (2/2)'}
                </h2>
                {step === 1 ? (
                  <p {...stylex.props(s.copy)}>
                    Enter a few details about your vehicle so that the dealer can make you a
                    personalized offer for your used car.
                  </p>
                ) : (
                  <div {...stylex.props(s.hint)}>
                    <Icon name="info" size={20} />
                    <p {...stylex.props(s.copy)}>
                      With a detailed description, you usually receive an offer more quickly.
                    </p>
                  </div>
                )}
              </div>
              <div {...stylex.props(s.form, s.tradeForm)}>
                {step === 1 ? (
                  <>
                    {dropdown('brand', 'Brand', 'Choose brand', brands, false, true)}
                    {dropdown('model', 'Model', 'Choose model', models, !data.brand)}
                    {dropdown(
                      'year',
                      'First registration year',
                      'Year',
                      groups(
                        Array.from({ length: Number(today.slice(0, 4)) - 1899 }, (_, index) =>
                          String(Number(today.slice(0, 4)) - index),
                        ),
                      ),
                      !data.model,
                    )}
                    {dropdown(
                      'month',
                      'First registration month',
                      'Month',
                      groups(months),
                      !data.year,
                    )}
                    <div {...stylex.props(s.suffix)}>
                      {text('mileage', 'Mileage', 'e.g. 78000', true, 6)}
                      <span {...stylex.props(s.suffixText)}>km</span>
                    </div>
                  </>
                ) : (
                  <>
                    {dropdown(
                      'doors',
                      'Doors',
                      'Choose doors',
                      groups(options('doors', ['2/3', '4/5', '6/7'])),
                    )}
                    {dropdown(
                      'body',
                      'Category',
                      'Choose category',
                      groups(options('body', nativeFilterOptions.body.options)),
                    )}
                    {dropdown(
                      'fuel',
                      'Fuel Type',
                      'Choose Fuel Type',
                      groups(options('fuel', nativeFilterOptions.fuel.options)),
                    )}
                    {dropdown(
                      'transmission',
                      'Transmission',
                      'Choose Transmission',
                      groups(options('transmission', nativeFilterOptions.transmission.options)),
                      !data.fuel,
                    )}
                    {dropdown(
                      'power',
                      'Power/PS',
                      'Choose Power/PS',
                      groups(options('power', [])),
                      !data.transmission,
                    )}
                    {dropdown(
                      'variant',
                      'Equipment Variant',
                      'Choose equipment variant',
                      groups([]),
                      !data.power,
                    )}
                    {dropdown('accident', 'Accident vehicle', 'Choose', groups(['Yes', 'No']))}
                    {dropdown(
                      'owners',
                      'Number of Owners',
                      'Choose number of owners',
                      groups(['1', '2', '3', '4', '5 or more']),
                    )}
                    {dropdown(
                      'color',
                      'Exterior colour',
                      'Choose exterior colour',
                      groups(nativeFilterOptions.color.options),
                    )}
                    {text('vin', 'Vehicle Identification Number', 'Optional', false, 17)}
                    <p {...stylex.props(s.copy)}>
                      The vehicle identification number (VIN) must contain exactly 17 letters and
                      numbers.
                    </p>
                  </>
                )}
              </div>
            </>
          ) : kind === 'Onsite visit' ? (
            <>
              <p {...stylex.props(s.lead)}>
                Please enter your desired date so that the dealer can plan availability.
              </p>
              <div {...stylex.props(s.form)}>
                <label {...stylex.props(s.label)}>
                  Desired date
                  <button
                    type="button"
                    aria-label="Open date selection"
                    onClick={() => setCalendar(true)}
                    {...stylex.props(s.select)}
                  >
                    {referenceDate(data.date || '') || 'Select date'}
                    <Icon name="date" size={24} />
                  </button>
                </label>
                <label {...stylex.props(s.label)}>
                  Time
                  <button
                    type="button"
                    aria-label="Open time selection"
                    disabled={!data.date}
                    onClick={() => setTimes(true)}
                    {...stylex.props(s.select)}
                  >
                    {data.time || 'Select time'}
                    <Icon name="down" size={24} />
                  </button>
                </label>
                <section {...stylex.props(s.card)}>
                  <strong>{v.dealer}</strong>
                  <p>{address}</p>
                  {openingHours && (
                    <>
                      <p {...stylex.props(s.hours)}>Opening Hours</p>
                      <p>{openingHours}</p>
                    </>
                  )}
                </section>
              </div>
            </>
          ) : (
            <>
              <p {...stylex.props(s.lead)}>
                Please enter your location so that the dealer can check delivery options.
              </p>
              <div {...stylex.props(s.form)}>
                {text('postal', 'Zip code', 'e.g. 10115', false, 12)}
                {text('city', 'City', 'e.g. Berlin')}
              </div>
            </>
          )}
        </div>
        <div data-enquiry-actions {...stylex.props(s.footer, kind === 'Trade-in' && s.one)}>
          {kind !== 'Trade-in' && (
            <Button variant="outline" onClick={onClose} xstyle={s.action}>
              Cancel
            </Button>
          )}
          <Button
            disabled={kind === 'Trade-in' && step === 1 ? !validTradeBasics(data, today) : !valid}
            onClick={() => {
              if (kind === 'Trade-in' && step === 1) {
                setStep(2);
                setData((current) => {
                  const defaults = capturedTradeOptions(current);
                  return {
                    ...current,
                    doors: current.doors || defaults?.doors?.[0] || '',
                    body: current.body || defaults?.body?.[0] || '',
                  };
                });
              } else onApply(data);
            }}
            block
            xstyle={s.action}
          >
            {kind === 'Trade-in' && step === 1 ? 'Next' : 'Add'}
          </Button>
        </div>
      </div>
      {choice && !choice.sheet && (
        <NativeChoicePage
          title={choice.title}
          groups={choice.groups}
          brands={choice.brands}
          value={data[choice.key] || ''}
          onClose={() => setChoice(null)}
          onChoose={(value) => {
            set(choice.key, value);
            setChoice(null);
          }}
        />
      )}
      {choice?.sheet && (
        <NativeOptionSheet
          label={choice.title}
          options={choice.groups.flatMap((group) => group.options)}
          value={data[choice.key] || ''}
          onClose={() => setChoice(null)}
          onSelect={(value) => {
            set(choice.key, value);
            setChoice(null);
          }}
        />
      )}
      {calendar && (
        <CalendarDialog
          value={data.date || ''}
          minDate={today}
          onClose={() => setCalendar(false)}
          onApply={(date) => {
            set('date', date);
            setCalendar(false);
            setTimes(true);
          }}
        />
      )}
      {times && (
        <NativeOptionSheet
          times
          label="Time"
          options={visitTimes(data.date || today, openingHours)}
          value={data.time || ''}
          onClose={() => setTimes(false)}
          onSelect={(time) => {
            set('time', time);
            setTimes(false);
          }}
        />
      )}
    </Modal>
  );
}
