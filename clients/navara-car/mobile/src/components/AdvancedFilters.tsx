'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { makeSelectionSummary, excludedMakeNames, removeMakeSelection } from '@/lib/make-selection';
import { controls } from '@/styles/controls.stylex';
import type { Filters } from '@/lib/types';
import { getFilterSections, type FilterField } from '@/lib/native-filter-fields';
import { CategoryMakePicker } from './CategoryMakePicker';
import { vehicles } from '@/lib/catalog';
import { filterVehicles, serializeFilters } from '@/lib/search';
import { resetFilters, updateFilters, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, IconButton, Modal, ui } from './ui';
import { BrandLogo, MakePicker } from './MakePicker';
import { LocationFields } from './NativeFilterFields';
import { DialogActions, RangeDialog, SelectionDialog } from './FilterDialog';
const s = stylex.create({
  body: { paddingBottom: 90 },
  section: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 700,
    padding: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
    color: colors.muted,
    borderTopWidth: 4,
    borderTopStyle: 'solid',
    borderTopColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  row: {
    minHeight: 65,
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 16,
    gap: 16,
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
    color: colors.text,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  summary: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
    color: colors.muted,
    display: 'block',
    marginTop: 2,
  },
  add: { color: colors.accent, justifyContent: 'flex-start', paddingLeft: 24, gap: 8 },
  checkbox: { width: 22, height: 22, accentColor: colors.deepPurple, flexShrink: 0 },
  make: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flex: '1',
    justifyContent: 'flex-start',
    paddingInline: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    minHeight: 64,
    width: 'auto',
  },
  makeSummary: { minHeight: 20 },
  makeRemove: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderWidth: 0,
    padding: 16,
    backgroundColor: 'transparent',
    color: colors.muted,
  },
  toggleRow: { paddingRight: 30 },
  deal: {
    display: 'inline-block',
    position: 'relative',
    height: 20,
    lineHeight: '20px',
    fontSize: 14,
    fontWeight: 500,
    paddingLeft: 18,
    paddingRight: 8,
    borderRadius: 5,
    backgroundColor: '#ff8f66',
    color: '#1b1b21',
    clipPath: 'polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%)',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 5,
      top: 8,
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: '#fff',
    },
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 1100,
    padding: 12,
    paddingInline: 24,
    backgroundColor: colors.background,
    zIndex: 35,
  },
  show: {
    width: '100%',
    minHeight: 60,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.accent,
    fontSize: 18,
    fontWeight: 700,
  },
  search: {
    position: 'sticky',
    top: 60,
    padding: 16,
    backgroundColor: colors.background,
    zIndex: 20,
  },
});
const arrays = ['condition', 'fuel', 'body', 'transmission', 'color'] as const;
const ranges: Record<string, [keyof Filters, keyof Filters]> = {
  seats: ['seats', 'maxSeats'],
  price: ['minPrice', 'maxPrice'],
  leaseRate: ['minLease', 'maxLease'],
  year: ['minYear', 'maxYear'],
  mileage: ['minMileage', 'maxMileage'],
  power: ['minPower', 'maxPower'],
};
function valuesFor(f: Filters, id: string): string[] {
  if (arrays.some((k) => k === id)) return f[id as (typeof arrays)[number]];
  if (id === 'payment') return [f.payment === 'buy' ? 'Buy' : 'Leasing'];
  if (id === 'damaged')
    return f.damagedOnly ? ['Show only'] : f.excludeDamaged ? ['Do not show'] : [];
  if (['seller', 'seats', 'doors'].includes(id)) {
    const v = f[id as 'seller' | 'seats' | 'doors'];
    return v && v !== 'Any' ? [v] : [];
  }
  if (id === 'deal') return f.deal ? ['Deal'] : [];
  return f.details.filter((v) => v.startsWith(id + '=')).map((v) => v.slice(id.length + 1));
}
export function AdvancedFilters() {
  const { filters: f } = useAppState();
  const [all, setAll] = useState(false);
  const [field, setField] = useState<FilterField | null>(null);
  const [make, setMake] = useState<string | null>(null);
  const [excludeMake, setExcludeMake] = useState(false);
  function showMake(name: string, excluded = false) {
    setExcludeMake(excluded);
    setMake(name);
  }
  const makeRows = [
    ...f.makes.map((brand) => ({ brand, excluded: false })),
    ...excludedMakeNames(f).map((brand) => ({ brand, excluded: true })),
  ];
  const [find, setFind] = useState(false);
  const [query, setQuery] = useState('');
  const [reset, setReset] = useState(false);
  const [text, setText] = useState('');
  const [locationDraft, setLocationDraft] = useState<Filters | null>(null);
  function change(id: string, values: string[]) {
    if (arrays.some((k) => k === id)) updateFilters({ [id]: values });
    else if (id === 'payment')
      updateFilters({ payment: values[0] === 'Leasing' ? 'lease' : 'buy' });
    else if (id === 'damaged')
      updateFilters({
        excludeDamaged: values[0] === 'Do not show',
        damagedOnly: values[0] === 'Show only',
      });
    else if (id === 'deal') updateFilters({ deal: values.length > 0 });
    else if (['seller', 'seats', 'doors'].includes(id)) updateFilters({ [id]: values[0] || '' });
    else
      updateFilters({
        details: [
          ...f.details.filter((v) => !v.startsWith(id + '=')),
          ...values.map((v) => id + '=' + v),
        ],
      });
  }
  function rangeValues(id: string): [string, string] {
    const keys = ranges[id];
    return keys
      ? [String(f[keys[0]]), String(f[keys[1]])]
      : [valuesFor(f, id + 'From')[0] || '', valuesFor(f, id + 'To')[0] || ''];
  }
  function rangeApply(id: string, min: string, max: string) {
    const keys = ranges[id];
    if (keys) updateFilters({ [keys[0]]: min, [keys[1]]: max });
    else
      updateFilters({
        details: [
          ...f.details.filter((v) => !v.startsWith(id + 'From=') && !v.startsWith(id + 'To=')),
          ...(min ? [id + 'From=' + min] : []),
          ...(max ? [id + 'To=' + max] : []),
        ],
      });
  }
  const filterSections = getFilterSections(f);
  const sections = all || query ? filterSections : filterSections.slice(0, 1);
  return (
    <>
      <Header title="Search Filters" back="/search">
        <IconButton icon="search" label="Search filters" onClick={() => setFind(!find)} />
        <IconButton icon="reset" label="Reset search" onClick={() => setReset(true)} />
      </Header>
      {find && (
        <div {...stylex.props(s.search)}>
          <input
            autoFocus
            aria-label="Find a filter"
            placeholder="Search filters"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            {...stylex.props(ui.input)}
          />
        </div>
      )}
      <div {...stylex.props(s.body)}>
        {sections.map((section, index) => {
          const fields = section.fields.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
          );
          if (!fields.length) return null;
          return (
            <section key={section.title}>
              <h2 {...stylex.props(s.section)}>{section.title}</h2>
              {index === 0 && !query && f.category === 'car' && (
                <>
                  {makeRows.map(({ brand, excluded }) => (
                    <div key={brand + excluded} {...stylex.props(s.row)}>
                      <button
                        type="button"
                        onClick={() => showMake(brand, excluded)}
                        {...stylex.props(s.row, s.make)}
                      >
                        <BrandLogo make={brand} size={40} />
                        <span>
                          {brand}
                          {excluded ? ' (excluded)' : ''}
                          <span {...stylex.props(s.summary, s.makeSummary)}>
                            {makeSelectionSummary(f, brand, excluded) === 'Any'
                              ? ''
                              : makeSelectionSummary(f, brand, excluded)}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={'Remove ' + (excluded ? 'excluded ' : '') + brand}
                        onClick={() => updateFilters(removeMakeSelection(f, brand, excluded))}
                        {...stylex.props(s.makeRemove)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="m8 8 8 8m0-8-8 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => showMake('')}
                    {...stylex.props(s.row, s.add)}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                      <circle
                        cx="11"
                        cy="11"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path d="M6 11h10M11 6v10" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    {f.makes.length ? 'Select another make / model' : 'Select make / model'}
                  </button>
                </>
              )}
              {fields.map((item) => {
                const selected = valuesFor(f, item.id);
                const range = item.kind === 'range' ? rangeValues(item.id) : [];
                const summary =
                  item.id === 'location'
                    ? [f.country, f.location].filter(Boolean).join(', ')
                    : range.some(Boolean)
                      ? range.map((x) => x || 'Any').join(' – ')
                      : selected.join(', ');
                return item.kind === 'toggle' ? (
                  <label
                    key={item.id}
                    data-filter-id={item.id}
                    {...stylex.props(s.row, s.toggleRow)}
                  >
                    <span {...stylex.props(item.id === 'deal' && s.deal)}>{item.label}</span>
                    <input
                      aria-label={item.label}
                      type="checkbox"
                      checked={selected.length > 0}
                      onChange={(e) => change(item.id, e.target.checked ? [item.label] : [])}
                      {...stylex.props(s.checkbox, controls.checkbox)}
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    key={item.id}
                    data-filter-id={item.id}
                    onClick={() => {
                      if (item.kind === 'make') {
                        showMake('');
                        return;
                      }
                      if (item.kind === 'location') setLocationDraft(structuredClone(f));
                      setField(item);
                      setText(selected[0] || '');
                    }}
                    {...stylex.props(s.row)}
                  >
                    <span>
                      {item.label}
                      {summary && <span {...stylex.props(s.summary)}>{summary}</span>}
                    </span>
                  </button>
                );
              })}
            </section>
          );
        })}
        {!all && !query && (
          <button type="button" onClick={() => setAll(true)} {...stylex.props(s.show)}>
            Show all filters
          </button>
        )}
        {all && (
          <p {...stylex.props(ui.small, ui.muted, ui.pad)}>
            Filters apply to captured local examples. A filter requiring data absent from the
            fixtures returns no matches.
          </p>
        )}
      </div>
      <div {...stylex.props(s.footer)}>
        <Button href={'/results?' + serializeFilters(f)} icon="search" block>
          {filterVehicles(vehicles, f).length} Offers
        </Button>
      </div>
      {make !== null &&
        (f.category === 'car' ? (
          <MakePicker
            key={make + excludeMake}
            open
            initialMake={make}
            initialExclude={excludeMake}
            onClose={() => setMake(null)}
          />
        ) : (
          <CategoryMakePicker
            initialMake={make}
            initialExclude={excludeMake}
            onClose={() => setMake(null)}
          />
        ))}
      {field?.kind === 'range' && (
        <RangeDialog
          key={field.id}
          title={field.label}
          unit={field.unit}
          ceiling={field.max || 100000}
          choices={field.rangeChoices}
          powerKwChoices={field.powerKwChoices}
          min={rangeValues(field.id)[0]}
          max={rangeValues(field.id)[1]}
          onApply={(min, max) => rangeApply(field.id, min, max)}
          onClose={() => setField(null)}
        />
      )}
      {field && (!field.kind || field.kind === 'single') && (
        <SelectionDialog
          key={field.id}
          title={field.label}
          options={field.options || []}
          values={valuesFor(f, field.id)}
          single={field.kind === 'single'}
          includeAny={field.includeAny ?? true}
          onApply={(values) => change(field.id, values)}
          onClose={() => setField(null)}
        />
      )}
      <Modal
        open={field?.kind === 'location'}
        onClose={() => setField(null)}
        title="Location and radius"
      >
        <LocationFields
          filters={locationDraft || f}
          onChange={(patch) => setLocationDraft((current) => ({ ...(current || f), ...patch }))}
        />
        <DialogActions
          onCancel={() => setField(null)}
          onApply={() => {
            if (locationDraft) updateFilters(locationDraft);
            setField(null);
          }}
        />
      </Modal>
      <Modal open={field?.kind === 'text'} onClose={() => setField(null)} title={field?.label}>
        <input
          aria-label="Search vehicle description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          {...stylex.props(ui.input)}
        />
        <DialogActions
          onCancel={() => setField(null)}
          onApply={() => {
            if (field) change(field.id, text ? [text] : []);
            setField(null);
          }}
        />
      </Modal>
      <Modal open={reset} onClose={() => setReset(false)} title="Reset search?">
        <p>Reset all search filters?</p>
        <DialogActions
          onCancel={() => setReset(false)}
          onApply={() => {
            resetFilters();
            setReset(false);
          }}
        />
      </Modal>
    </>
  );
}
