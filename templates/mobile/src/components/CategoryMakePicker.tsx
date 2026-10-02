'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { nativeMakesFor } from '@/lib/native-taxonomy';
import { applyMakeSelection, removeMakeSelection } from '@/lib/make-selection';
import { updateFilters, useAppState } from '@/lib/store';
import type { Filters } from '@/lib/types';
import { Modal, ui } from './ui';
import { DialogActions } from './FilterDialog';
import { Icon } from './Icon';
const s = stylex.create({
  embedded: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    paddingInline: 16,
    paddingTop: 16,
  },
  embeddedInput: { fontSize: 16, height: 48, borderRadius: 12 },
  title: {
    fontFamily: 'var(--font-base)',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  summaryTitle: { padding: 0, paddingBottom: 16, marginInline: -16, paddingInline: 16 },
  content: { flex: '1', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' },
  row: {
    width: '100%',
    minHeight: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    textAlign: 'left',
    paddingInline: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'transparent',
  },
  group: {
    fontSize: 14,
    fontWeight: 500,
    paddingInline: 16,
    paddingTop: 28,
    paddingBottom: 4,
    color: colors.muted,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  action: { color: colors.accent, minHeight: 56, paddingInline: 8, fontWeight: 500 },
  selection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 4,
  },
  input: { height: 44, fontSize: 14 },
  selectedRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  name: {
    flex: '1',
    borderWidth: 0,
    padding: 8,
    textAlign: 'left',
    fontSize: 16,
    backgroundColor: 'transparent',
    color: colors.text,
  },
  close: {
    borderWidth: 0,
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    color: colors.muted,
  },
  excluded: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.muted,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.muted,
    padding: 8,
  },
  footer: { paddingInline: 16, paddingBottom: 16 },
});
export function CategoryMakePicker({
  initialMake = '',
  initialExclude = false,
  onClose,
  filters: suppliedFilters,
  onApply,
  embedded = false,
}: {
  initialMake?: string;
  initialExclude?: boolean;
  onClose: () => void;
  filters?: Filters;
  onApply?: (patch: Partial<Filters>) => void;
  embedded?: boolean;
}) {
  const state = useAppState();
  const filters = suppliedFilters || state.filters;
  const changeFilters = onApply || updateFilters;
  const [screen, setScreen] = useState<'summary' | 'make'>('summary');
  const [exclude, setExclude] = useState(false);
  const [editingMake, setEditingMake] = useState<string | null>(null);
  const [draft, setDraft] = useState(() =>
    initialMake && !initialExclude && !filters.makes.includes(initialMake)
      ? { ...filters, ...applyMakeSelection(filters, initialMake, [], false) }
      : structuredClone(filters),
  );
  const options = nativeMakesFor(filters);
  const letters = [
    ...new Set(options.filter((name) => name !== 'Other').map((name) => name[0].toUpperCase())),
  ];
  const excludedNames = [
    ...new Set([...draft.excludedMakes, ...Object.keys(draft.excludedMakeVariants)]),
  ];
  function choose(make: string) {
    const previous = editingMake
      ? { ...draft, ...removeMakeSelection(draft, editingMake, exclude) }
      : draft;
    changeDraft(
      make === 'Any'
        ? previous
        : { ...previous, ...applyMakeSelection(previous, make, [], exclude) },
    );
    setEditingMake(null);
    setScreen('summary');
  }
  function changeDraft(next: Filters) {
    setDraft(next);
    if (embedded) changeFilters(next);
  }
  function selection(make: string, isExcluded: boolean) {
    return (
      <div key={make} {...stylex.props(s.selection)}>
        <div {...stylex.props(s.selectedRow)}>
          <button
            type="button"
            onClick={() => {
              setEditingMake(make);
              setExclude(isExcluded);
              setScreen('make');
            }}
            {...stylex.props(s.name)}
          >
            {make}
          </button>
          <button
            type="button"
            aria-label={'Remove ' + (isExcluded ? 'excluded ' : '') + make}
            onClick={() =>
              changeDraft({ ...draft, ...removeMakeSelection(draft, make, isExcluded) })
            }
            {...stylex.props(s.close)}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <label {...stylex.props(s.label)}>
          Model (optional)
          <input
            aria-label={'Model for ' + (isExcluded ? 'excluded ' : '') + make}
            value={(isExcluded ? draft.excludedMakeVariants : draft.makeVariants)[make] || ''}
            placeholder="Any"
            maxLength={200}
            onChange={(event) =>
              changeDraft({
                ...draft,
                ...applyMakeSelection(draft, make, [], isExcluded, event.target.value),
              })
            }
            {...stylex.props(ui.input, s.input, embedded && s.embeddedInput)}
          />
        </label>
      </div>
    );
  }
  const content = (
    <>
      <h2 {...stylex.props(s.title, screen === 'summary' && s.summaryTitle)}>
        {screen === 'summary' ? 'Make, Model' : 'Make'}
      </h2>
      <div {...stylex.props(s.content)}>
        {screen === 'summary' ? (
          <>
            {draft.makes.map((make) => selection(make, false))}
            <button
              type="button"
              onClick={() => {
                setEditingMake(null);
                setExclude(false);
                setScreen('make');
              }}
              {...stylex.props(s.row, s.action)}
            >
              Add vehicle
            </button>
            {excludedNames.length > 0 && <h3 {...stylex.props(s.excluded)}>Excluded vehicles</h3>}
            {excludedNames.map((make) => selection(make, true))}
            <button
              type="button"
              onClick={() => {
                setEditingMake(null);
                setExclude(true);
                setScreen('make');
              }}
              {...stylex.props(s.row, s.action)}
            >
              Exclude vehicle
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => choose('Any')} {...stylex.props(s.row)}>
              Any
              {!editingMake && <Icon name="check" size={20} />}
            </button>
            {letters.map((letter) => (
              <section key={letter}>
                <h3 {...stylex.props(s.group)}>{letter}</h3>
                {options
                  .filter((name) => name !== 'Other' && name[0].toUpperCase() === letter)
                  .map((make) => (
                    <button
                      key={make}
                      type="button"
                      onClick={() => choose(make)}
                      {...stylex.props(s.row)}
                    >
                      {make}
                      {editingMake === make && <Icon name="check" size={20} />}
                    </button>
                  ))}
              </section>
            ))}
            <button type="button" onClick={() => choose('Other')} {...stylex.props(s.row)}>
              Other
            </button>
          </>
        )}
      </div>
      {!embedded && (
        <div {...stylex.props(screen === 'make' && s.footer)}>
          <DialogActions
            onCancel={screen === 'summary' ? onClose : () => setScreen('summary')}
            onApply={
              screen === 'summary'
                ? () => {
                    changeFilters(draft);
                    onClose();
                  }
                : undefined
            }
          />
        </div>
      )}
    </>
  );
  return embedded ? (
    <div {...stylex.props(s.embedded)}>{content}</div>
  ) : (
    <Modal
      open
      onClose={onClose}
      table={screen === 'make'}
      wide={screen === 'make'}
      range={screen === 'summary'}
    >
      {content}
    </Modal>
  );
}
