'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { makes, models } from '@/lib/catalog';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, ui } from './ui';
import { LoginScreen } from './LoginScreen';
const s = stylex.create({
  body: { padding: 24, backgroundColor: colors.surface, minHeight: 'calc(100dvh - 68px)' },
  progress: { height: 6, width: '100%', accentColor: colors.accent, marginBlock: 16 },
  notice: { fontSize: 12, color: colors.muted, lineHeight: '18px' },
  photos: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  photo: { width: 96, height: 72, objectFit: 'cover', borderRadius: 8 },
  summary: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 },
  error: { color: colors.accent, fontSize: 12 },
});
type Mode = 'valuation' | 'direct' | 'create';
export function SellFlow({ mode }: { mode: Mode }) {
  const { email } = useAppState();
  return email ? <DraftWizard mode={mode} /> : <LoginScreen next={'/sell/' + mode} />;
}
function DraftWizard({ mode }: { mode: Mode }) {
  const { draft } = useAppState();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const total = mode === 'create' ? 3 : 2;
  const title =
    mode === 'create'
      ? 'Create listing'
      : mode === 'valuation'
        ? 'Free car valuation'
        : 'Direct sale';
  useEffect(
    () => () => {
      photos.forEach((url) => URL.revokeObjectURL(url));
    },
    [photos],
  );
  function field(key: string, value: string) {
    patchState({ draft: { ...draft, [key]: value, ...(key === 'make' ? { model: '' } : {}) } });
  }
  function next() {
    if (step < total - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      patchState({ draft: { ...draft, status: 'saved', mode } });
      setDone(true);
    }
  }
  function select(label: string, key: string, options: string[]) {
    return (
      <label {...stylex.props(ui.label)}>
        {label}
        <select
          aria-label={label}
          required
          value={draft[key] || ''}
          onChange={(e) => field(key, e.target.value)}
          {...stylex.props(ui.input)}
        >
          <option value="">Please select</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <>
      <Header title={title} back="/sell" />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(ui.card, ui.column)}>
          <p {...stylex.props(s.notice)}>
            Local demonstration beyond the original app’s sign-in gate. No listing or valuation
            request will be submitted.
          </p>
          {done ? (
            <>
              <h1 {...stylex.props(ui.heading)}>
                {mode === 'create' ? 'Draft saved' : 'Vehicle details saved'}
              </h1>
              <div {...stylex.props(s.summary)}>
                {Object.entries(draft)
                  .filter(([key]) => !['mode', 'status'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <p {...stylex.props(ui.muted)}>{key}</p>
                      <strong>{value}</strong>
                    </div>
                  ))}
              </div>
              <p>
                {mode === 'create'
                  ? 'Your draft is stored in this browser. Publishing is not connected.'
                  : 'A real valuation provider is not connected. No market valuation has been generated.'}
              </p>
              <Button variant="outline" onClick={() => setDone(false)}>
                Edit details
              </Button>
              <Button href="/sell" block>
                Back to Sell
              </Button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              {...stylex.props(ui.column)}
            >
              <div>
                <p {...stylex.props(ui.small)}>
                  Step {step + 1} of {total}
                </p>
                <progress value={step + 1} max={total} {...stylex.props(s.progress)} />
              </div>
              {step === 0 ? (
                <>
                  <h2 {...stylex.props(ui.title)}>Tell us about your vehicle</h2>
                  {select('Make', 'make', makes)}
                  {select('Model', 'model', models[draft.make] || ['Other'])}
                  {select(
                    'First registration',
                    'year',
                    Array.from({ length: 37 }, (_, i) => String(2026 - i)),
                  )}
                </>
              ) : step === 1 ? (
                <>
                  <h2 {...stylex.props(ui.title)}>Vehicle details</h2>
                  <label {...stylex.props(ui.label)}>
                    Mileage (km)
                    <input
                      type="number"
                      min="0"
                      max="2000000"
                      required
                      value={draft.mileage || ''}
                      onChange={(e) => field('mileage', e.target.value)}
                      {...stylex.props(ui.input)}
                    />
                  </label>
                  {select('Fuel', 'fuel', ['Petrol', 'Diesel', 'Electric', 'Hybrid'])}
                  {select('Transmission', 'transmission', ['Automatic', 'Manual'])}
                  <label {...stylex.props(ui.label)}>
                    Postal code
                    <input
                      inputMode="numeric"
                      pattern="[0-9]{4,6}"
                      maxLength={6}
                      required
                      value={draft.postcode || ''}
                      onChange={(e) => field('postcode', e.target.value)}
                      {...stylex.props(ui.input)}
                    />
                  </label>
                </>
              ) : (
                <>
                  <h2 {...stylex.props(ui.title)}>Your listing</h2>
                  <label {...stylex.props(ui.label)}>
                    Asking price (€)
                    <input
                      type="number"
                      min="1"
                      max="10000000"
                      required
                      value={draft.price || ''}
                      onChange={(e) => field('price', e.target.value)}
                      {...stylex.props(ui.input)}
                    />
                  </label>
                  <label {...stylex.props(ui.label)}>
                    Description
                    <textarea
                      aria-label="Description"
                      rows={5}
                      required
                      minLength={20}
                      maxLength={4000}
                      value={draft.description || ''}
                      onChange={(e) => field('description', e.target.value)}
                    />
                  </label>
                  <label {...stylex.props(ui.label)}>
                    Photos
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).slice(0, 6);
                        if (
                          files.some(
                            (f) =>
                              f.size > 8 * 1024 * 1024 ||
                              !['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
                          )
                        ) {
                          setError('Choose JPEG, PNG or WebP images smaller than 8 MB.');
                          return;
                        }
                        setError('');
                        setPhotos(files.map((f) => URL.createObjectURL(f)));
                      }}
                    />
                  </label>
                  {error && (
                    <p role="alert" {...stylex.props(s.error)}>
                      {error}
                    </p>
                  )}
                  <div {...stylex.props(s.photos)}>
                    {photos.map((src, i) => (
                      <Image
                        key={src}
                        src={src}
                        alt={'Draft photo ' + (i + 1)}
                        width={96}
                        height={72}
                        unoptimized
                        {...stylex.props(s.photo)}
                      />
                    ))}
                  </div>
                  <p {...stylex.props(ui.small, ui.muted)}>
                    Photos are previewed in this session only and are never uploaded. Text fields
                    are saved on this device.
                  </p>
                </>
              )}
              <Button type="submit" block>
                {step === total - 1 ? 'Save local draft' : 'Continue'}
              </Button>
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} block>
                  Back
                </Button>
              )}
            </form>
          )}
        </section>
      </div>
    </>
  );
}
