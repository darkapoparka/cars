'use client';
import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { filterVehicles } from '@/lib/search';
import { showroomCategory } from '@/lib/showroom';
import {
  resetShowroomFilterDraft,
  showroomFilterTabs,
  updateShowroomFilterDraft,
  type ShowroomFilterTab,
} from '@/lib/showroom-filter-editor';
import { colors } from '@/styles/tokens.stylex';
import { RangeField } from './RangeField';
import { MakePicker } from './MakePicker';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ShowroomTabs } from './ShowroomTabs';
import { Button, CheckRow, IconButton, Modal } from './ui';

const s = stylex.create({
  editor: { display: 'flex', flexDirection: 'column', flex: '1', minHeight: 0, minWidth: 0 },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingInline: 12,
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    flexShrink: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    flex: '1',
    minWidth: 0,
    textAlign: 'center',
  },
  tabs: { flexShrink: 0 },
  panel: { flex: '1', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' },
  makePanel: { display: 'flex', flex: '1', minHeight: 0, minWidth: 0 },
  hidden: { display: 'none' },
  fields: {
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  group: { borderWidth: 0, padding: 0, minWidth: 0 },
  fieldTitle: { fontSize: 18, fontWeight: 600, lineHeight: '26px', marginBottom: 12 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: '22px' },
  footer: {
    flexShrink: 0,
    paddingInline: 16,
    paddingTop: 12,
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
  },
});
function Choices({
  title,
  field,
  options,
  filters,
  onChange,
}: {
  title: string;
  field: 'condition' | 'fuel' | 'transmission' | 'body';
  options: string[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  return (
    <fieldset {...stylex.props(s.group)}>
      <legend {...stylex.props(s.fieldTitle)}>{title}</legend>
      {options.map((value) => (
        <CheckRow
          key={value}
          checked={filters[field].includes(value)}
          onChange={(checked) =>
            onChange({
              [field]: checked
                ? [...filters[field], value]
                : filters[field].filter((choice) => choice !== value),
            })
          }
        >
          {value}
        </CheckRow>
      ))}
    </fieldset>
  );
}

export function ShowroomFilterSheet({
  sheet,
  filters,
  onTabChange,
  onApply,
  onClose,
}: {
  sheet: ShowroomFilterTab;
  filters: Filters;
  onTabChange: (tab: ShowroomFilterTab) => void;
  onApply: (filters: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => structuredClone(filters));
  const [resetVersion, setResetVersion] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const category = showroomCategory(draft.category);
  const stock = vehicles.filter((vehicle) => vehicle.category === draft.category);
  const stockMakes = [...new Set(stock.map((vehicle) => vehicle.make))];
  const fuels = [...new Set(stock.map((vehicle) => vehicle.fuel))];
  const transmissions = [...new Set(stock.map((vehicle) => vehicle.transmission))];
  const bodies = [...new Set(stock.map((vehicle) => vehicle.body))];
  const count = filterVehicles(stock, draft).length;
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      editorRef.current
        ?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    fieldsRef.current?.scrollTo(0, 0);
  }, [sheet]);
  function change(patch: Partial<Filters>) {
    setDraft((current) => updateShowroomFilterDraft(current, patch));
  }
  return (
    <Modal open onClose={onClose} label="Filters" flowSheet>
      <div ref={editorRef} {...stylex.props(s.editor)}>
        <div {...stylex.props(s.heading)}>
          <IconButton icon="close" label="Close filters" onClick={onClose} />
          <h2 {...stylex.props(s.title)}>Filters</h2>
          <IconButton
            icon="reset"
            label="Reset"
            onClick={() => {
              setDraft(resetShowroomFilterDraft(draft));
              setResetVersion((current) => current + 1);
            }}
          />
        </div>
        <div {...stylex.props(s.tabs)}>
          <ShowroomTabs
            label="Filter sections"
            tabs={showroomFilterTabs}
            selected={sheet}
            panelId="showroom-filter-options"
            idPrefix="filter-section-"
            onChange={onTabChange}
          />
        </div>
        <div
          id="showroom-filter-options"
          role="tabpanel"
          aria-labelledby={'filter-section-' + sheet}
          {...stylex.props(s.panel)}
        >
          <div
            hidden={sheet !== 'make'}
            {...stylex.props(s.makePanel, sheet !== 'make' && s.hidden)}
          >
            {draft.category === 'car' ? (
              <MakePicker
                key={resetVersion}
                embedded
                open
                initialMake={draft.makes.length === 1 ? draft.makes[0] : ''}
                availableMakes={stockMakes}
                filters={draft}
                onApply={change}
                onClose={onClose}
              />
            ) : (
              <CategoryMakePicker
                key={resetVersion}
                embedded
                filters={draft}
                onApply={change}
                onClose={onClose}
              />
            )}
          </div>
          {sheet !== 'make' && (
            <div ref={fieldsRef} data-filter-scroll {...stylex.props(s.fields)}>
              {sheet === 'price' && (
                <RangeField
                  comfortable
                  label="Price"
                  floor={0}
                  ceiling={100000}
                  step={500}
                  unit="€"
                  min={draft.minPrice}
                  max={draft.maxPrice}
                  onChange={(minPrice, maxPrice) => change({ minPrice, maxPrice })}
                />
              )}
              {sheet === 'year' && (
                <RangeField
                  comfortable
                  label="Year"
                  floor={1980}
                  ceiling={new Date().getFullYear() + 1}
                  min={draft.minYear}
                  max={draft.maxYear}
                  onChange={(minYear, maxYear) => change({ minYear, maxYear })}
                />
              )}
              {sheet === 'fuel' &&
                (fuels.length ? (
                  <Choices
                    title="Fuel"
                    field="fuel"
                    options={fuels}
                    filters={draft}
                    onChange={change}
                  />
                ) : (
                  <p {...stylex.props(s.copy)}>No fuel options in this category’s inventory yet.</p>
                ))}
              {sheet === 'condition' && (
                <Choices
                  title="Condition"
                  field="condition"
                  options={['Used', 'New']}
                  filters={draft}
                  onChange={change}
                />
              )}
              {sheet === 'more' && (
                <>
                  <RangeField
                    comfortable
                    label="Mileage"
                    floor={0}
                    ceiling={200000}
                    step={5000}
                    unit="km"
                    min={draft.minMileage}
                    max={draft.maxMileage}
                    onChange={(minMileage, maxMileage) => change({ minMileage, maxMileage })}
                  />
                  {transmissions.length > 0 && (
                    <Choices
                      title="Transmission"
                      field="transmission"
                      options={transmissions}
                      filters={draft}
                      onChange={change}
                    />
                  )}
                  {bodies.length > 0 && (
                    <Choices
                      title="Body type"
                      field="body"
                      options={bodies}
                      filters={draft}
                      onChange={change}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div data-filter-footer {...stylex.props(s.footer)}>
          <Button block floating onClick={() => onApply(draft)}>
            <span aria-live="polite" aria-atomic="true">
              Show {count} {count === 1 ? category.singular : category.plural}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
