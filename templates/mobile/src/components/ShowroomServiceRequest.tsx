'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import {
  parseServiceRequest,
  normalizeServiceRequest,
  seedServiceRequest,
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
import {
  importCountries,
  importCountryLabel,
  saleEnquiryTypes,
  type ImportCountry,
  type SaleEnquiryType,
} from '@/lib/showroom-services';
import { ShowroomQuickPill, ShowroomQuickPills } from './ShowroomQuickPills';
import { Button, IconButton, Modal, ui } from './ui';

const s = stylex.create({
  banner: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    padding: 16,
    minWidth: 0,
  },
  introRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  heading: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '26px',
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  headingIcon: { color: colors.muted, flexShrink: 0 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: '22px', marginTop: 4 },
  entry: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    width: '100%',
    padding: 6,
    paddingLeft: 12,
    marginTop: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.controlSurface,
    textAlign: 'left',
    outlineColor: colors.accent,
  },
  entryText: {
    flex: '1',
    minWidth: 0,
    fontSize: 14,
    lineHeight: '22px',
    color: colors.muted,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  entryValue: { color: colors.text },
  entryAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minHeight: 32,
    paddingBlock: 6,
    paddingInline: 12,
    borderRadius: 20,
    backgroundColor: colors.accent,
    color: '#fff',
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
  },
  choiceGroup: { borderWidth: 0, padding: 0, margin: 0, minWidth: 0 },
  choiceLegend: { fontSize: 14, fontWeight: 500, lineHeight: '22px', marginBottom: 4 },
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
    textAlign: { default: 'left', '@media (max-width: 699px)': 'center' },
    gap: 6,
    minWidth: 0,
    fontSize: 13,
    lineHeight: '20px',
    color: colors.muted,
  },
  current: { color: colors.text, fontWeight: 600 },
  rail: { height: 3, borderRadius: 2, backgroundColor: colors.controlSurface },
  filledRail: { backgroundColor: colors.accent },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: 0,
    overflowY: { default: 'visible', '@media (max-width: 699px)': 'auto' },
    overscrollBehaviorY: 'contain',
    scrollPaddingBlock: 20,
  },
  body: {
    overflowY: { default: 'auto', '@media (max-width: 699px)': 'visible' },
    overscrollBehaviorY: 'contain',
    flex: { default: '1', '@media (max-width: 699px)': 'none' },
    minHeight: 0,
    padding: 20,
    paddingBottom: { default: 20, '@media (max-width: 699px)': 16 },
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
    paddingInline: { default: 16, '@media (max-width: 699px)': 20 },
    paddingTop: { default: 12, '@media (max-width: 699px)': 0 },
    paddingBottom: {
      default: 'max(16px, env(safe-area-inset-bottom))',
      '@media (max-width: 699px)': 'max(20px, env(safe-area-inset-bottom))',
    },
    borderTopWidth: { default: 1, '@media (max-width: 699px)': 0 },
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  actions: { display: 'grid', gridTemplateColumns: 'max-content minmax(0,1fr)', gap: 12 },
  singleAction: { gridTemplateColumns: 'minmax(0,1fr)' },
  back: {
    minHeight: { default: 48, '@media (max-width: 699px)': 44 },
    paddingInline: 16,
    paddingBlock: { default: 10, '@media (max-width: 699px)': 8 },
    borderRadius: { default: 24, '@media (max-width: 699px)': 22 },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    lineHeight: { default: '20px', '@media (max-width: 699px)': '22px' },
    fontWeight: { default: 600, '@media (max-width: 699px)': 500 },
    cursor: 'pointer',
  },
  note: {
    fontSize: 12,
    lineHeight: '18px',
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  phoneLabel: { display: { default: 'none', '@media (max-width: 699px)': 'inline' } },
  largerLabel: { display: { default: 'inline', '@media (max-width: 699px)': 'none' } },
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

export function ShowroomServiceRequest({
  kind,
  country = 'all',
  saleType = 'buyout',
}: {
  kind: ServiceRequestKind;
  country?: ImportCountry;
  saleType?: SaleEnquiryType;
}) {
  const { t, locale, number } = useLocale();
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
  const startContext = useRef({ country, saleType });
  const values = edited ?? parseServiceRequest(kind, raw);
  const importing = kind === 'import';
  const title = importing ? 'Import a car' : 'Sell your car';
  const steps = serviceRequestSteps[kind];
  const saved = status === 'saved';
  const entrySummary =
    values.vin ||
    [values.make, values.model].filter(Boolean).join(' ') ||
    t('VIN or vehicle details');
  const entrySummaryId = 'service-request-' + kind + '-entry-summary';

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
    const next = seedServiceRequest(kind, values, {
      country: country !== startContext.current.country || !values.country ? country : undefined,
      saleType:
        saleType !== startContext.current.saleType || !values.saleType ? saleType : undefined,
    });
    startContext.current = { country, saleType };
    setEdited(next);
    setStatus(persistDraft(kind, next) ? null : 'unavailable');
    errorFocus.current = 'vin';
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
    if (key === 'vin') value = value.toUpperCase();
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
      <div {...stylex.props(ui.label, s.field, wide && s.wide)}>
        <label htmlFor={id}>{t(label)}</label>
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
          autoCapitalize={key === 'vin' ? 'characters' : undefined}
          spellCheck={key === 'vin' ? false : undefined}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? id + '-error' : undefined}
          {...stylex.props(ui.input, s.input, Boolean(errors[key]) && s.invalid)}
        />
        {errors[key] && (
          <span id={id + '-error'} {...stylex.props(s.error)}>
            {t(errors[key]!)}
          </span>
        )}
      </div>
    );
  }
  const amount = (value: string) =>
    new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value));
  const reviewRows = [
    ['Car', [values.make, values.model, !importing && values.year].filter(Boolean).join(' ')],
    ...(values.vin ? [['VIN', values.vin]] : []),
    ...(importing && values.country ? [['Import from', importCountryLabel(values.country)]] : []),
    ...(!importing && values.saleType
      ? [
          [
            'Sale type',
            saleEnquiryTypes.find((type) => type.value === values.saleType)?.label || '',
          ],
        ]
      : []),
    [
      importing ? 'Maximum budget' : 'Mileage',
      importing ? amount(values.budget) : number(Number(values.mileage)) + ' ' + t('km'),
    ],
    ...(importing && values.year ? [['Minimum year', values.year]] : []),
    ...(!importing && values.price ? [['Expected price', amount(values.price)]] : []),
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
        data-service-request-banner={kind}
        {...stylex.props(s.banner)}
      >
        <div {...stylex.props(s.introRow)}>
          <h2 id={'service-request-' + kind + '-heading'} {...stylex.props(s.heading)}>
            {importing ? t('Import a vehicle') : t(title)}
          </h2>
          {importing && (
            <Globe
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
              {...stylex.props(s.headingIcon)}
            />
          )}
        </div>
        <p {...stylex.props(s.copy)}>
          {importing
            ? t('Choose a car or paste its VIN.')
            : t('Start a sale or part exchange enquiry.')}
        </p>
        <button
          type="button"
          aria-label={importing ? t('Start import enquiry') : t('Start sale enquiry')}
          aria-haspopup="dialog"
          aria-describedby={entrySummaryId}
          onClick={start}
          {...stylex.props(s.entry)}
        >
          <span
            id={entrySummaryId}
            title={entrySummary}
            {...stylex.props(s.entryText, Boolean(values.vin || values.make) && s.entryValue)}
          >
            {entrySummary}
          </span>
          <span aria-hidden="true" {...stylex.props(s.entryAction)}>
            {t('Start')}
          </span>
        </button>
      </section>
      <Modal open={open} onClose={close} label={t(title)} flowSheet>
        <div {...stylex.props(s.header)}>
          <div {...stylex.props(s.headerRow)}>
            <h2 {...stylex.props(s.title)}>{t(title)}</h2>
            <IconButton icon="close" label={t('Close enquiry')} onClick={close} />
          </div>
          <ol aria-label={t('Enquiry progress')} {...stylex.props(s.progress)}>
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
                {t(label)}
              </li>
            ))}
          </ol>
        </div>
        <form
          ref={formRef}
          aria-label={importing ? t('Car import enquiry') : t('Car sale enquiry')}
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
            const persisted = saveMessageDraft(
              'showroom-' + kind,
              serviceRequestMessage(kind, normalized, locale),
            );
            setEdited(normalized);
            setStatus(persisted ? 'saved' : 'unavailable');
          }}
        >
          <div ref={bodyRef} data-service-request-body {...stylex.props(s.body)}>
            <h3 ref={headingRef} tabIndex={-1} {...stylex.props(s.stepHeading)}>
              {saved ? t('Draft saved') : t(stepTitle)}
            </h3>
            {saved ? (
              <div {...stylex.props(s.success)}>
                <p role="status">
                  {t(
                    importing
                      ? 'Import draft saved on this device. Nothing was sent.'
                      : 'Sale draft saved on this device. Nothing was sent.',
                  )}
                </p>
                <p {...stylex.props(ui.text, ui.muted)}>
                  {t('Your enquiry is ready to review on the Contact page.')}
                </p>
                <Button href={'/contact?service=' + kind} block floating>
                  {t('View enquiry draft')}
                </Button>
              </div>
            ) : (
              <>
                <p {...stylex.props(s.stepCopy)}>
                  {step === 0
                    ? t('Step 1 of 3 · Add a VIN if available, then the car details.')
                    : step === 1
                      ? t('Step 2 of 3 · A few details to guide your enquiry.')
                      : t('Step 3 of 3 · Check your car details. Contact details are optional.')}
                </p>
                {step === 2 && (
                  <section aria-label={t('Car details summary')} {...stylex.props(s.review)}>
                    <h4 {...stylex.props(s.reviewHeading)}>{t('Your enquiry')}</h4>
                    <dl {...stylex.props(s.reviewRows)}>
                      {reviewRows.map(([label, value]) => (
                        <div key={label} {...stylex.props(s.reviewRow)}>
                          <dt {...stylex.props(s.reviewLabel)}>{t(label)}</dt>
                          <dd {...stylex.props(s.reviewValue)}>
                            {['Import from', 'Sale type', 'Condition'].includes(label)
                              ? t(value)
                              : value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
                <div {...stylex.props(s.fields)}>
                  {step === 0 && (
                    <>
                      {field('vin', t('VIN (optional)'), 'text', true, true)}
                      {field('make', t('Make'))}
                      {field('model', t('Model'))}
                      {!importing && field('year', t('Year'), 'number')}
                    </>
                  )}
                  {step === 1 &&
                    (importing ? (
                      <>
                        <fieldset {...stylex.props(s.choiceGroup, s.wide)}>
                          <legend {...stylex.props(s.choiceLegend)}>
                            {t('Import from (optional)')}
                          </legend>
                          <ShowroomQuickPills label={t('Import country preference')} inset={false}>
                            {importCountries.map(({ value, label }) => (
                              <ShowroomQuickPill
                                key={value}
                                active={(values.country || 'all') === value}
                                aria-pressed={(values.country || 'all') === value}
                                onClick={() => change('country', value === 'all' ? '' : value)}
                              >
                                {value === 'all' ? t('Any country') : t(label)}
                              </ShowroomQuickPill>
                            ))}
                          </ShowroomQuickPills>
                        </fieldset>
                        {field('budget', t('Maximum budget (€)'), 'number')}
                        {field('year', t('Minimum year (optional)'), 'number', true)}
                        {field('listing', t('Listing link (optional)'), 'url', true, true)}
                      </>
                    ) : (
                      <>
                        <fieldset {...stylex.props(s.choiceGroup, s.wide)}>
                          <legend {...stylex.props(s.choiceLegend)}>{t('Sale type')}</legend>
                          <ShowroomQuickPills label={t('Sale preference')} inset={false}>
                            {saleEnquiryTypes.map(({ value, label }) => (
                              <ShowroomQuickPill
                                key={value}
                                active={values.saleType === value}
                                aria-pressed={values.saleType === value}
                                onClick={() => change('saleType', value)}
                              >
                                {label}
                              </ShowroomQuickPill>
                            ))}
                          </ShowroomQuickPills>
                        </fieldset>
                        {field('mileage', t('Mileage (km)'), 'number')}
                        {field('price', t('Expected price (€) (optional)'), 'number', true)}
                        <div {...stylex.props(ui.label, s.field, s.wide)}>
                          <label htmlFor="service-request-sell-condition">
                            {t('Condition (optional)')}
                          </label>
                          <select
                            id="service-request-sell-condition"
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
                            <option value="">{t('Select condition')}</option>
                            {saleConditions.map((condition) => (
                              <option key={condition} value={condition}>
                                {t(condition)}
                              </option>
                            ))}
                          </select>
                          {errors.condition && (
                            <span id="sale-condition-error" {...stylex.props(s.error)}>
                              {t(errors.condition!)}
                            </span>
                          )}
                        </div>
                      </>
                    ))}
                  {step === 2 && (
                    <>
                      {field('name', t('Name (optional)'), 'text', true, true)}
                      {field('phone', t('Phone (optional)'), 'tel', true)}
                      {field('email', t('Email (optional)'), 'email', true)}
                      <label {...stylex.props(ui.label, s.field, s.wide)}>
                        {t('Anything else? (optional)')}
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
                {t('Saving is unavailable. Keep this sheet open to retain your details.')}
              </p>
            )}
            <div {...stylex.props(s.actions, (step === 0 || saved) && s.singleAction)}>
              {saved ? (
                <Button block floating variant="outline" onClick={close}>
                  {t('Done')}
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
                      {t('Back')}
                    </button>
                  )}
                  <Button type="submit" block floating>
                    {step < 2 ? (
                      t('Continue')
                    ) : (
                      <>
                        <span {...stylex.props(s.phoneLabel)}>{t('Save draft')}</span>
                        <span {...stylex.props(s.largerLabel)}>
                          {importing ? t('Save import draft') : t('Save sale draft')}
                        </span>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
            <p {...stylex.props(s.note)}>{t('Draft only · Nothing is sent.')}</p>
          </div>
        </form>
      </Modal>
    </>
  );
}
