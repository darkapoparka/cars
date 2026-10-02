'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import {
  parseServiceRequest,
  normalizeServiceRequest,
  saleConditions,
  serializeServiceRequest,
  serviceRequestErrorStep,
  serviceRequestLimits,
  serviceRequestMessage,
  serviceRequestSteps,
  serviceRequestStorageKey,
  validateServiceRequest,
  validateServiceRequestStep,
  type ServiceRequestErrors,
  type ServiceRequestField,
  type ServiceRequestKind,
  type ServiceRequestStep,
  type ServiceRequestValues,
} from '@/lib/service-requests';
import { saveMessageDraft } from '@/lib/store';
import { Button, IconButton, Modal, ui } from './ui';

const s = stylex.create({
  card: { backgroundColor: colors.background, borderRadius: 16, padding: 20, minWidth: 0 },
  heading: { fontSize: 24, fontWeight: 700, lineHeight: '32px' },
  copy: { color: colors.muted, fontSize: 16, lineHeight: '24px', marginTop: 8 },
  overviewSteps: {
    marginBlock: 20,
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    gap: 12,
    padding: 0,
    listStyle: 'none',
    fontSize: 13,
    lineHeight: '20px',
    color: colors.muted,
  },
  overviewStep: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  stepNumber: { fontSize: 16, fontWeight: 600, color: colors.text },
  header: {
    paddingInline: 16,
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    paddingBottom: 16,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 20, lineHeight: '28px', fontWeight: 700 },
  progress: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    gap: 8,
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
    fontSize: 13,
    lineHeight: '20px',
    color: colors.muted,
  },
  current: { color: colors.text, fontWeight: 600 },
  rail: { height: 3, borderRadius: 2, backgroundColor: colors.controlSurface },
  filledRail: { backgroundColor: colors.accent },
  form: { display: 'flex', flexDirection: 'column', flex: '1', minHeight: 0 },
  body: {
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    flex: '1',
    minHeight: 0,
    padding: 20,
    scrollPaddingBlock: 20,
  },
  stepHeading: { fontSize: 24, lineHeight: '32px', fontWeight: 700, marginBottom: 4 },
  stepCopy: { fontSize: 14, lineHeight: '22px', color: colors.muted, marginBottom: 24 },
  fields: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 480px)': 'repeat(2,minmax(0,1fr))',
    },
    gap: 16,
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
  footer: {
    flexShrink: 0,
    paddingInline: 16,
    paddingTop: 12,
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  actions: { display: 'grid', gridTemplateColumns: 'max-content minmax(0,1fr)', gap: 12 },
  singleAction: { gridTemplateColumns: 'minmax(0,1fr)' },
  back: {
    minHeight: 48,
    paddingInline: 16,
    paddingBlock: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  note: {
    fontSize: 12,
    lineHeight: '18px',
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  review: { backgroundColor: colors.stripe, padding: 16, borderRadius: 12, marginBottom: 24 },
  reviewHeading: { fontSize: 16, lineHeight: '24px', fontWeight: 600, marginBottom: 8 },
  reviewRows: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8 },
  reviewRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 },
  reviewLabel: { fontSize: 13, lineHeight: '20px', color: colors.muted },
  reviewValue: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
    minWidth: 0,
  },
  success: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 },
});

const draftEvent = 'cars-service-draft-change';
const requestEntry = 'carsMobileServiceRequest';
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
function persistDraft(kind: ServiceRequestKind, values: ServiceRequestValues) {
  try {
    localStorage.setItem(serviceRequestStorageKey(kind), serializeServiceRequest(kind, values));
    window.dispatchEvent(new Event(draftEvent));
    return true;
  } catch {
    return false;
  }
}

export function ShowroomServiceRequest({ kind }: { kind: ServiceRequestKind }) {
  const params = useSearchParams();
  const open = params.get('request') === '1';
  const raw = useSyncExternalStore(
    subscribeDrafts,
    () => readDraft(kind),
    () => '',
  );
  const [edited, setEdited] = useState<ServiceRequestValues | null>(null);
  const [errors, setErrors] = useState<ServiceRequestErrors>({});
  const [status, setStatus] = useState<'saved' | 'unavailable' | null>(null);
  const [step, setStep] = useState<ServiceRequestStep>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const overviewRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const errorFocus = useRef<ServiceRequestField | null>(null);
  const closing = useRef(false);
  const wasOpen = useRef(false);
  const values = edited ?? parseServiceRequest(kind, raw);
  const importing = kind === 'import';
  const title = importing ? 'Import a car' : 'Sell your car';
  const steps = serviceRequestSteps[kind];
  const saved = status === 'saved';

  useEffect(() => {
    if (!open) {
      closing.current = false;
      if (wasOpen.current)
        overviewRef.current?.querySelector('button')?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const frame = requestAnimationFrame(() => {
      bodyRef.current?.scrollTo(0, 0);
      const invalid = errorFocus.current && formRef.current?.elements.namedItem(errorFocus.current);
      if (invalid instanceof HTMLElement) invalid.focus();
      else headingRef.current?.focus({ preventScroll: true });
      errorFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, step, saved]);

  function start() {
    overviewRef.current?.querySelector('button')?.focus({ preventScroll: true });
    setStep(0);
    setErrors({});
    setStatus(null);
    closing.current = false;
    const url = new URL(window.location.href);
    url.searchParams.set('request', '1');
    // App Router's patched history API retains its internal state and updates search params.
    window.history.pushState({ [requestEntry]: kind }, '', url.pathname + url.search);
  }
  function close() {
    if (closing.current) return;
    closing.current = true;
    if (window.history.state?.[requestEntry] === kind) {
      window.history.back();
    } else {
      // A direct overlay link has no entry belonging to this flow to traverse back to.
      const url = new URL(window.location.href);
      url.searchParams.delete('request');
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  }
  function change(key: ServiceRequestField, value: string) {
    const next = { ...values, [key]: value };
    setEdited((current) => ({ ...(current ?? values), [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setStatus(persistDraft(kind, next) ? null : 'unavailable');
  }
  function showErrors(next: ServiceRequestErrors) {
    setErrors(next);
    const firstStep = serviceRequestErrorStep(kind, next);
    const firstField = steps[firstStep].fields.find((field) => next[field]);
    if (firstStep !== step) {
      errorFocus.current = firstField || null;
      setStep(firstStep);
    } else if (firstField) {
      const invalid = formRef.current?.elements.namedItem(firstField);
      requestAnimationFrame(() => {
        if (invalid instanceof HTMLElement && invalid.closest('dialog')?.open) invalid.focus();
      });
    }
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
  const reviewRows = [
    ['Car', [values.make, values.model, !importing && values.year].filter(Boolean).join(' ')],
    [
      importing ? 'Maximum budget' : 'Mileage',
      importing ? '€' + values.budget : values.mileage + ' km',
    ],
    ...(importing && values.year ? [['Minimum year', values.year]] : []),
    ...(!importing && values.price ? [['Expected price', '€' + values.price]] : []),
    ...(!importing && values.condition ? [['Condition', values.condition]] : []),
    ...(importing && values.listing ? [['Listing link', values.listing]] : []),
  ];
  const stepTitle =
    step === 0
      ? importing
        ? 'Your preferred car'
        : 'Your car'
      : step === 1
        ? importing
          ? 'Budget & preferences'
          : 'Condition & price'
        : 'Contact & review';

  return (
    <>
      <section
        ref={overviewRef}
        aria-labelledby={'service-request-' + kind + '-heading'}
        {...stylex.props(s.card)}
      >
        <h2 id={'service-request-' + kind + '-heading'} {...stylex.props(s.heading)}>
          {title}
        </h2>
        <p {...stylex.props(s.copy)}>
          {importing
            ? 'Tell us what you’re looking for, or share a car you’ve found.'
            : 'Share your car’s details for a direct purchase or part exchange enquiry.'}
        </p>
        <ol aria-label="Enquiry steps" {...stylex.props(s.overviewSteps)}>
          {(importing
            ? ['Choose a car', 'Set your budget', 'Review details']
            : ['Your car', 'Condition & price', 'Review details']
          ).map((label, index) => (
            <li key={label} {...stylex.props(s.overviewStep)}>
              <span aria-hidden="true" {...stylex.props(s.stepNumber)}>
                {index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
        <Button block floating onClick={start}>
          {importing ? 'Start import enquiry' : 'Start sale enquiry'}
        </Button>
      </section>
      <Modal open={open} onClose={close} label={title} flowSheet>
        <div {...stylex.props(s.header)}>
          <div {...stylex.props(s.headerRow)}>
            <h2 {...stylex.props(s.title)}>{title}</h2>
            <IconButton icon="close" label="Close enquiry" onClick={close} />
          </div>
          <ol aria-label="Enquiry progress" {...stylex.props(s.progress)}>
            {steps.map(({ label }, index) => (
              <li
                key={label}
                aria-current={step === index && !saved ? 'step' : undefined}
                {...stylex.props(s.progressStep, step === index && s.current)}
              >
                <span
                  aria-hidden="true"
                  {...stylex.props(s.rail, (index <= step || saved) && s.filledRail)}
                />
                {label}
              </li>
            ))}
          </ol>
        </div>
        <form
          ref={formRef}
          aria-label={importing ? 'Car import enquiry' : 'Car sale enquiry'}
          noValidate
          {...stylex.props(s.form)}
          onSubmit={(event) => {
            event.preventDefault();
            if (saved) return;
            const normalized = normalizeServiceRequest(kind, values);
            const nextErrors =
              step < 2
                ? validateServiceRequestStep(kind, step, normalized)
                : validateServiceRequest(kind, normalized);
            if (Object.keys(nextErrors).length) {
              showErrors(nextErrors);
              return;
            }
            setErrors({});
            if (step < 2) {
              setStep(step === 0 ? 1 : 2);
              return;
            }
            if (!persistDraft(kind, normalized)) {
              setStatus('unavailable');
              return;
            }
            saveMessageDraft('showroom-' + kind, serviceRequestMessage(kind, normalized));
            setEdited(normalized);
            setStatus('saved');
          }}
        >
          <div ref={bodyRef} data-service-request-body {...stylex.props(s.body)}>
            <h3 ref={headingRef} tabIndex={-1} {...stylex.props(s.stepHeading)}>
              {saved ? 'Draft saved' : stepTitle}
            </h3>
            {saved ? (
              <div {...stylex.props(s.success)}>
                <p role="status">
                  {importing ? 'Import' : 'Sale'} draft saved on this device. Nothing was sent.
                </p>
                <p {...stylex.props(ui.text, ui.muted)}>
                  Your enquiry is ready to review on the Contact page.
                </p>
                <Button href={'/contact?service=' + kind} block floating>
                  View enquiry draft
                </Button>
              </div>
            ) : (
              <>
                <p {...stylex.props(s.stepCopy)}>
                  {step === 0
                    ? 'Step 1 of 3 · Start with the car.'
                    : step === 1
                      ? 'Step 2 of 3 · A few details to guide your enquiry.'
                      : 'Step 3 of 3 · Check your car details. Contact details are optional.'}
                </p>
                {step === 2 && (
                  <section aria-label="Car details summary" {...stylex.props(s.review)}>
                    <h4 {...stylex.props(s.reviewHeading)}>Your enquiry</h4>
                    <dl {...stylex.props(s.reviewRows)}>
                      {reviewRows.map(([label, value]) => (
                        <div key={label} {...stylex.props(s.reviewRow)}>
                          <dt {...stylex.props(s.reviewLabel)}>{label}</dt>
                          <dd {...stylex.props(s.reviewValue)}>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
                <div {...stylex.props(s.fields)}>
                  {step === 0 && (
                    <>
                      {field('make', 'Make')}
                      {field('model', 'Model')}
                      {!importing && field('year', 'Year', 'number')}
                    </>
                  )}
                  {step === 1 &&
                    (importing ? (
                      <>
                        {field('budget', 'Maximum budget (€)', 'number')}
                        {field('year', 'Minimum year (optional)', 'number', true)}
                        {field('listing', 'Listing link (optional)', 'url', true, true)}
                      </>
                    ) : (
                      <>
                        {field('mileage', 'Mileage (km)', 'number')}
                        {field('price', 'Expected price (€) (optional)', 'number', true)}
                        <label {...stylex.props(ui.label, s.field, s.wide)}>
                          Condition (optional)
                          <select
                            name="condition"
                            value={values.condition}
                            onChange={(event) => change('condition', event.target.value)}
                            aria-invalid={Boolean(errors.condition)}
                            aria-describedby={errors.condition ? 'sale-condition-error' : undefined}
                            {...stylex.props(
                              ui.input,
                              s.input,
                              Boolean(errors.condition) && s.invalid,
                            )}
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
                    ))}
                  {step === 2 && (
                    <>
                      {field('name', 'Name (optional)', 'text', true, true)}
                      {field('phone', 'Phone (optional)', 'tel', true)}
                      {field('email', 'Email (optional)', 'email', true)}
                      <label {...stylex.props(ui.label, s.field, s.wide)}>
                        Anything else? (optional)
                        <textarea
                          name="message"
                          value={values.message}
                          maxLength={serviceRequestLimits.message}
                          onChange={(event) => change('message', event.target.value)}
                          {...stylex.props(ui.input, s.input, s.textarea)}
                        />
                      </label>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div data-service-request-footer {...stylex.props(s.footer)}>
            {status === 'unavailable' && (
              <p role="alert" {...stylex.props(s.error)}>
                Saving is unavailable. Keep this sheet open to retain your details.
              </p>
            )}
            <div {...stylex.props(s.actions, (step === 0 || saved) && s.singleAction)}>
              {saved ? (
                <Button block floating variant="outline" onClick={close}>
                  Done
                </Button>
              ) : (
                <>
                  {step > 0 && (
                    <button
                      type="button"
                      {...stylex.props(s.back)}
                      onClick={() => {
                        setErrors({});
                        setStep(step === 2 ? 1 : 0);
                      }}
                    >
                      Back
                    </button>
                  )}
                  <Button type="submit" block floating>
                    {step < 2 ? 'Continue' : importing ? 'Save import draft' : 'Save sale draft'}
                  </Button>
                </>
              )}
            </div>
            <p {...stylex.props(s.note)}>Draft only · Nothing is sent.</p>
          </div>
        </form>
      </Modal>
    </>
  );
}
