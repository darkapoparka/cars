'use client';
import { useState, useSyncExternalStore } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import {
  parseServiceRequest,
  normalizeServiceRequest,
  saleConditions,
  serializeServiceRequest,
  serviceRequestLimits,
  serviceRequestMessage,
  serviceRequestStorageKey,
  validateServiceRequest,
  type ServiceRequestErrors,
  type ServiceRequestField,
  type ServiceRequestKind,
  type ServiceRequestValues,
} from '@/lib/service-requests';
import { saveMessageDraft } from '@/lib/store';
import { Button, ui } from './ui';

const s = stylex.create({
  card: { backgroundColor: colors.background, borderRadius: 16, padding: 16, minWidth: 0 },
  heading: { fontSize: 22, fontWeight: 700, lineHeight: '30px' },
  copy: { color: colors.muted, fontSize: 14, lineHeight: '20px', marginTop: 4, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  group: { borderWidth: 0, padding: 0, minWidth: 0 },
  legend: { fontSize: 16, lineHeight: '24px', fontWeight: 600, marginBottom: 12 },
  fields: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 480px)': 'repeat(2,minmax(0,1fr))',
    },
    gap: 12,
  },
  field: { minWidth: 0, overflowWrap: 'anywhere' },
  input: { minWidth: 0, borderColor: colors.line, borderRadius: 12 },
  wide: { gridColumn: '1 / -1' },
  textarea: {
    height: 'auto',
    minHeight: 88,
    paddingBlock: 12,
    lineHeight: '24px',
    resize: 'vertical',
  },
  invalid: { borderColor: colors.accent },
  error: { fontSize: 13, lineHeight: '20px', color: colors.accent },
  saved: { fontSize: 14, lineHeight: '22px', color: colors.green },
  optional: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    paddingInline: 12,
  },
  summary: {
    minHeight: 44,
    paddingBlock: 12,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  optionalFields: { display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 12 },
});

const draftEvent = 'cars-service-draft-change';
function subscribeDrafts(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener(draftEvent, listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(draftEvent, listener);
  };
}
function readDraft(kind: ServiceRequestKind) {
  try {
    return localStorage.getItem(serviceRequestStorageKey(kind)) || '';
  } catch {
    return '';
  }
}

export function ShowroomServiceRequest({ kind }: { kind: ServiceRequestKind }) {
  const raw = useSyncExternalStore(
    subscribeDrafts,
    () => readDraft(kind),
    () => '',
  );
  const [edited, setEdited] = useState<ServiceRequestValues | null>(null);
  const [errors, setErrors] = useState<ServiceRequestErrors>({});
  const [status, setStatus] = useState<'saved' | 'unavailable' | null>(null);
  const values = edited ?? parseServiceRequest(kind, raw);
  const importing = kind === 'import';

  function change(key: ServiceRequestField, value: string) {
    setEdited((current) => ({ ...(current ?? values), [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setStatus(null);
  }
  function field(
    key: ServiceRequestField,
    label: string,
    type = 'text',
    optional = false,
    wide = false,
  ) {
    const id = 'service-request-' + kind + '-' + key;
    const numeric = type === 'number';
    return (
      <label htmlFor={id} {...stylex.props(ui.label, s.field, wide && s.wide)}>
        {label}
        <input
          id={id}
          name={key}
          type={type}
          value={values[key]}
          onChange={(event) => change(key, event.target.value)}
          required={!optional}
          maxLength={serviceRequestLimits[key]}
          min={numeric ? (key === 'year' ? 1900 : 0) : undefined}
          max={key === 'year' ? new Date().getFullYear() + 1 : undefined}
          step={numeric ? (key === 'budget' || key === 'price' ? 0.01 : 1) : undefined}
          inputMode={
            numeric
              ? key === 'budget' || key === 'price'
                ? 'decimal'
                : 'numeric'
              : key === 'phone'
                ? 'tel'
                : undefined
          }
          autoComplete={
            key === 'name' ? 'name' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'off'
          }
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? id + '-error' : undefined}
          {...stylex.props(ui.input, s.input, Boolean(errors[key]) && s.invalid)}
        />
        {errors[key] && (
          <span id={id + '-error'} {...stylex.props(s.error)}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }

  return (
    <section aria-labelledby={'service-request-' + kind + '-heading'} {...stylex.props(s.card)}>
      <h2 id={'service-request-' + kind + '-heading'} {...stylex.props(s.heading)}>
        {importing ? 'Import a car' : 'Sell your car'}
      </h2>
      <p {...stylex.props(s.copy)}>
        {importing
          ? 'Tell us what you’re looking for, or share a car you’ve found.'
          : 'Share your car’s details for a direct purchase or part exchange enquiry.'}
      </p>
      <form
        aria-label={importing ? 'Car import enquiry' : 'Car sale enquiry'}
        noValidate
        {...stylex.props(s.form)}
        onSubmit={(event) => {
          event.preventDefault();
          const normalized = normalizeServiceRequest(kind, values);
          const nextErrors = validateServiceRequest(kind, normalized);
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length) {
            const invalid = event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0]);
            if (invalid instanceof HTMLElement) {
              const details = invalid.closest('details');
              if (details) details.open = true;
              invalid.focus();
            }
            return;
          }
          try {
            localStorage.setItem(
              serviceRequestStorageKey(kind),
              serializeServiceRequest(kind, normalized),
            );
            window.dispatchEvent(new Event(draftEvent));
            saveMessageDraft('showroom-' + kind, serviceRequestMessage(kind, normalized));
            setEdited(normalized);
            setStatus('saved');
          } catch {
            setStatus('unavailable');
          }
        }}
      >
        <fieldset {...stylex.props(s.group)}>
          <legend {...stylex.props(s.legend)}>
            {importing ? 'Your preferred car' : 'Your car'}
          </legend>
          <div {...stylex.props(s.fields)}>
            {field('make', 'Make')}
            {field('model', 'Model')}
            {importing ? (
              <>
                {field('budget', 'Maximum budget (€)', 'number')}
                {field('year', 'Minimum year (optional)', 'number', true)}
                {field('listing', 'Listing link (optional)', 'url', true, true)}
              </>
            ) : (
              <>
                {field('year', 'Year', 'number')}
                {field('mileage', 'Mileage (km)', 'number')}
                {field('price', 'Expected price (€) (optional)', 'number', true)}
                <label {...stylex.props(ui.label, s.field)}>
                  Condition (optional)
                  <select
                    name="condition"
                    value={values.condition}
                    onChange={(event) => change('condition', event.target.value)}
                    aria-invalid={Boolean(errors.condition)}
                    aria-describedby={errors.condition ? 'sale-condition-error' : undefined}
                    {...stylex.props(ui.input, s.input, Boolean(errors.condition) && s.invalid)}
                  >
                    <option value="">Select condition</option>
                    {saleConditions.map((condition) => (
                      <option key={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.condition && (
                    <span id="sale-condition-error" {...stylex.props(s.error)}>
                      {errors.condition}
                    </span>
                  )}
                </label>
              </>
            )}
          </div>
        </fieldset>
        <details {...stylex.props(s.optional)}>
          <summary {...stylex.props(s.summary)}>Contact details & note (optional)</summary>
          <div {...stylex.props(s.optionalFields)}>
            <div {...stylex.props(s.fields)}>
              {field('name', 'Name', 'text', true, true)}
              {field('phone', 'Phone', 'tel', true)}
              {field('email', 'Email', 'email', true)}
            </div>
            <label {...stylex.props(ui.label, s.field)}>
              Anything else? (optional)
              <textarea
                name="message"
                value={values.message}
                maxLength={serviceRequestLimits.message}
                onChange={(event) => change('message', event.target.value)}
                {...stylex.props(ui.input, s.input, s.textarea)}
              />
            </label>
          </div>
        </details>
        <Button type="submit" block>
          {importing ? 'Save import draft' : 'Save sale draft'}
        </Button>
        <p {...stylex.props(ui.small, ui.muted)}>
          Template preview · Saved on this device. Nothing is sent.
        </p>
        {status === 'saved' && (
          <>
            <p role="status" {...stylex.props(s.saved)}>
              {importing ? 'Import' : 'Sale'} draft saved on this device.
            </p>
            <Button href={'/contact?service=' + kind} variant="outline" block>
              View enquiry draft
            </Button>
          </>
        )}
        {status === 'unavailable' && (
          <p role="alert" {...stylex.props(s.error)}>
            Saving is unavailable. Your details are still in this form.
          </p>
        )}
      </form>
    </section>
  );
}
