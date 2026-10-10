'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import checklist from '@/lib/native-data/checklist.json';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { money } from '@/lib/search';
import { patchState, togglePark, useAppState } from '@/lib/store';
import { Header } from './Header';
import { IconButton, ui } from './ui';
import { LoginScreen } from './LoginScreen';
const s = stylex.create({
  body: { padding: 8, minHeight: 'calc(100dvh - 60px)', backgroundColor: colors.surface },
  vehicle: {
    padding: 16,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  image: { width: 96, height: 82, objectFit: 'cover', borderRadius: 8 },
  name: { fontSize: 16, fontWeight: 500, lineHeight: '24px' },
  price: { fontSize: 16, fontWeight: 700, lineHeight: '24px', marginTop: 4 },
  section: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    color: colors.muted,
    marginTop: 8,
    marginLeft: 16,
  },
  card: {
    padding: 8,
    paddingInline: 12,
    minHeight: 64,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
    marginTop: 4,
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: 500, lineHeight: '20px' },
  copy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  memo: { padding: 16 },
  textarea: {
    width: '100%',
    minHeight: 84,
    resize: 'vertical',
    height: 'auto',
    padding: 12,
    fontSize: 14,
    marginTop: 4,
  },
});
export function NativeChecklist({ vehicle: v }: { vehicle: Vehicle }) {
  const { email, parked, parkNotes } = useAppState();
  const [notes, setNotes] = useState<string | null>(null);
  const router = useRouter();
  if (!email) return <LoginScreen next={'/vehicle/' + v.id + '/checklist'} />;
  function save() {
    if (!parked.includes(v.id)) togglePark(v.id);
    patchState({
      parkNotes: { ...parkNotes, [v.id]: notes ?? parkNotes[v.id] ?? '' },
      toast: 'Checklist saved locally.',
    });
    router.push('/vehicle/' + v.id);
  }
  return (
    <>
      <Header title="Checklist" back={'/vehicle/' + v.id}>
        <IconButton icon="check" label="Save checklist" onClick={save} />
      </Header>
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(s.vehicle)}>
          <Image src={v.images[0]} alt="" width={96} height={82} {...stylex.props(s.image)} />
          <div>
            <h2 {...stylex.props(s.name)}>
              {v.make} {v.model}
            </h2>
            <p {...stylex.props(s.price)}>{money(v.price)}</p>
          </div>
        </section>
        {checklist.sections.map((section) => (
          <section key={section.id}>
            <h2 {...stylex.props(s.section)}>{section.title}</h2>
            {section.items.map((item) => (
              <article key={item.id} {...stylex.props(s.card)}>
                <h3 {...stylex.props(s.title)}>{item.title}</h3>
                <p {...stylex.props(s.copy)}>{item.text}</p>
              </article>
            ))}
          </section>
        ))}
        <h2 {...stylex.props(s.section)}>My notes</h2>
        <section {...stylex.props(s.card, s.memo)}>
          <label {...stylex.props(s.title)}>
            Notes
            <textarea
              aria-label="Checklist notes"
              value={notes ?? parkNotes[v.id] ?? ''}
              maxLength={255}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes."
              {...stylex.props(ui.input, s.textarea)}
            />
          </label>
        </section>
        <p {...stylex.props(ui.small, ui.muted, ui.pad)}>
          Local reference. Inspection notes stay in this browser.
        </p>
      </div>
    </>
  );
}
