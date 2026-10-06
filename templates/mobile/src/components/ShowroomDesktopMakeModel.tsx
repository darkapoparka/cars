'use client';

import { useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { showroomMakeOptions } from '@/lib/make-picker-options';
import { modelGroupsFor, modelLabel, nativeCarMakes } from '@/lib/native-taxonomy';
import { makeImages, popularMakes } from '@/lib/makes';
import {
  applyMakeSelection,
  clearMakeSelections,
  excludedMakeNames,
  modelsForMake,
  removeMakeSelection,
} from '@/lib/make-selection';
import { modelDraftFor, selectedModelVariants, type ModelDraft } from '@/lib/model-picker';
import { controls } from '@/styles/controls.stylex';
import { BrandLogo } from './MakePicker';
import { Icon } from './Icon';
import { ShowroomModelOptions } from './ShowroomModelOptions';
import { ui } from './ui';
import { desktopMakeModelStyles as s } from './showroom-desktop-make-model.stylex';

type Selection = { name: string; excluded: boolean };

const desktopCatalogue = [...popularMakes, ...nativeCarMakes];

export function ShowroomDesktopMakeModel({
  availableMakes,
  filters,
  onChange,
  compact = false,
  view = 'split',
  dropdown = false,
}: {
  availableMakes: string[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  compact?: boolean;
  view?: 'split' | 'makes' | 'models';
  dropdown?: boolean;
}) {
  const { t } = useLocale();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selections: Selection[] = [
    ...filters.makes.map((name) => ({ name, excluded: false })),
    ...excludedMakeNames(filters).map((name) => ({ name, excluded: true })),
  ];
  const [editing, setEditing] = useState<Selection | null>(() => selections[0] || null);
  const [browsingMakes, setBrowsingMakes] = useState(!selections.length);
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);
  // The parent draft is the only filter state. A removed selection cannot leave stale models open.
  const current =
    selections.find(
      ({ name, excluded }) => name === editing?.name && excluded === editing.excluded,
    ) || (view === 'models' || selections.length === 1 ? selections[0] : null);
  const draft = current ? modelDraftFor(filters, current.name, current.excluded) : null;
  const single = view !== 'split';
  const grid = dropdown && view === 'makes';
  const makeView =
    view === 'makes' || (view === 'split' && (!compact || browsingMakes || !current));
  const modelView =
    view === 'models' || (view === 'split' && (!compact || (!browsingMakes && Boolean(current))));
  const makes = showroomMakeOptions(
    availableMakes,
    selections.map(({ name }) => name),
    makeQuery,
    grid ? desktopCatalogue : undefined,
  );

  function edit(selection: Selection) {
    setEditing(selection);
    setBrowsingMakes(false);
    setModelQuery('');
    setExpanded([]);
    if (compact) focusSearch('model');
  }

  function focusSearch(kind: 'make' | 'model') {
    requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLInputElement>(`[data-desktop-${kind}-search]`)
        ?.focus({ preventScroll: true });
    });
  }

  function backToMakes() {
    setBrowsingMakes(true);
    focusSearch('make');
  }

  function applyDraft(next: ModelDraft, excluded = current?.excluded || false, source = filters) {
    if (!current) return;
    const variants = selectedModelVariants(next);
    onChange(
      applyMakeSelection(
        source,
        current.name,
        next.selected,
        excluded,
        next.selected.length ? '' : variants[''] || '',
        variants,
      ),
    );
  }

  function remove(name: string) {
    onChange({
      ...removeMakeSelection(filters, name),
      ...removeMakeSelection(filters, name, true),
    });
    setEditing(null);
    setBrowsingMakes(true);
    setModelQuery('');
    setExpanded([]);
    if (compact) focusSearch('make');
    else
      requestAnimationFrame(() => {
        const row = [
          ...(rootRef.current?.querySelectorAll<HTMLElement>('[data-desktop-make]') || []),
        ].find((element) => element.dataset.desktopMake === name);
        row?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
      });
  }

  function chooseMake(name: string, checked: boolean) {
    if (name === 'Any') {
      onChange(clearMakeSelections());
      setEditing(null);
      setBrowsingMakes(true);
      setMakeQuery('');
      setModelQuery('');
      setExpanded([]);
    } else if (checked) {
      onChange(applyMakeSelection(filters, name, [], false));
      edit({ name, excluded: false });
    } else remove(name);
  }

  function searchField(kind: 'make' | 'model') {
    const model = kind === 'model';
    const value = model ? modelQuery : makeQuery;
    const setValue = model ? setModelQuery : setMakeQuery;
    const disabled = model && !current;
    const label = t(model ? 'Search models' : 'Search makes');
    return (
      <div
        {...stylex.props(
          s.search,
          dropdown && s.dropdownSearch,
          controls.fieldFocus,
          disabled && s.disabledSearch,
        )}
      >
        <span aria-hidden="true" {...stylex.props(s.searchIcon)}>
          <Icon name="search" size={18} />
        </span>
        <input
          data-desktop-make-search={model ? undefined : ''}
          data-desktop-model-search={model ? '' : undefined}
          aria-label={label}
          placeholder={
            disabled
              ? t('Choose a make first')
              : model && dropdown && current
                ? label + ' · ' + current.name
                : label
          }
          disabled={disabled}
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          {...stylex.props(ui.input, s.searchInput, dropdown && s.dropdownSearchInput)}
        />
        <button
          type="button"
          aria-label={t('Clear search') + ': ' + label}
          disabled={!value}
          onClick={(event) => {
            setValue('');
            event.currentTarget.parentElement?.querySelector('input')?.focus();
          }}
          {...stylex.props(s.clearSearch, !value && s.invisible)}
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      data-desktop-make-model
      data-desktop-make-view={single ? view : compact ? (makeView ? 'makes' : 'models') : 'split'}
      {...stylex.props(
        s.layout,
        compact && s.compactLayout,
        compact && modelView && s.compactModels,
        single && s.singleLayout,
        view === 'makes' && s.singleMakesLayout,
        dropdown && s.dropdownLayout,
        dropdown && modelView && s.dropdownModelLayout,
      )}
    >
      <section
        aria-labelledby={id + '-makes'}
        {...stylex.props(
          s.pane,
          single && s.singlePane,
          dropdown && s.dropdownPane,
          (compact || single) && !makeView && s.hidden,
        )}
      >
        <div {...stylex.props(compact || single ? ui.srOnly : s.heading)}>
          <h3 id={id + '-makes'} {...stylex.props(s.title)}>
            {t('Makes')}
          </h3>
        </div>
        {searchField('make')}
        <div
          data-desktop-make-list
          {...stylex.props(
            s.makeList,
            compact && s.compactMakeList,
            single && s.singleMakeList,
            dropdown && s.dropdownMakeList,
            grid && s.makeGrid,
          )}
        >
          {makes.map((name) => {
            const selection = selections.find((item) => item.name === name);
            const checked = name === 'Any' ? !selections.length : Boolean(selection);
            const active = current?.name === name;
            const selectedModels = selection
              ? modelsForMake(filters, name, selection.excluded).map((model) =>
                  t(modelLabel(model)),
                )
              : [];
            return (
              <div
                key={name}
                data-desktop-make={name}
                {...stylex.props(
                  s.makeRow,
                  active && s.activeRow,
                  single && s.singleRow,
                  single && checked && s.singleSelectedRow,
                  grid && s.gridRow,
                  grid && checked && s.gridSelectedRow,
                )}
              >
                <label
                  {...stylex.props(s.makeChoice, single && s.singleChoice, grid && s.gridChoice)}
                >
                  <input
                    type="checkbox"
                    aria-label={name === 'Any' ? t('Any make') : name}
                    checked={checked}
                    onChange={(event) => chooseMake(name, event.target.checked)}
                    {...stylex.props(
                      controls.checkbox,
                      s.checkbox,
                      single && s.singleCheckbox,
                      grid && s.gridCheckbox,
                    )}
                  />
                  {grid ? (
                    <span aria-hidden="true" {...stylex.props(s.gridLogo)}>
                      {name === 'Any' ? (
                        <Icon name="grid" size={28} />
                      ) : makeImages[name] ? (
                        <BrandLogo make={name} size={32} />
                      ) : (
                        <span {...stylex.props(s.gridMark)}>{name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </span>
                  ) : name !== 'Any' ? (
                    <BrandLogo make={name} size={compact ? 32 : 28} />
                  ) : null}
                  <span {...stylex.props(s.makeName, grid && s.gridName)}>
                    <span
                      {...stylex.props(
                        grid && s.gridCaption,
                        grid && checked && s.gridSelectedName,
                      )}
                    >
                      <span>{name === 'Any' ? t('Any make') : name}</span>
                      {grid && checked && (
                        <span
                          aria-hidden="true"
                          data-desktop-make-check
                          {...stylex.props(s.gridTick)}
                        >
                          <Icon name="check" size={12} />
                        </span>
                      )}
                    </span>
                    {selection && !grid && (
                      <span
                        title={selectedModels.join(', ') || t('All models')}
                        {...stylex.props(s.selectionSummary)}
                      >
                        {selectedModels.join(', ') || t('All models')}
                      </span>
                    )}
                    {selection?.excluded && (
                      <span {...stylex.props(s.excluded)}>{t('Excluded')}</span>
                    )}
                  </span>
                </label>
                {!single && (
                  <button
                    type="button"
                    aria-label={t('Edit models') + ': ' + name}
                    title={t('Edit models') + ': ' + name}
                    disabled={!selection}
                    onClick={() => selection && edit(selection)}
                    {...stylex.props(s.edit, !selection && s.invisible)}
                  >
                    <Icon name="right" size={16} />
                  </button>
                )}
              </div>
            );
          })}
          {!makes.length && (
            <p role="status" {...stylex.props(s.empty, grid && s.gridEmpty)}>
              {t('No makes found')}
            </p>
          )}
        </div>
      </section>
      <section
        aria-labelledby={id + '-models'}
        {...stylex.props(
          s.pane,
          single && s.singlePane,
          dropdown && s.dropdownPane,
          (compact || single) && !modelView && s.hidden,
        )}
      >
        {single && selections.length > 1 && (
          <div
            role="group"
            aria-label={t('Makes')}
            data-desktop-model-makes
            {...stylex.props(s.selectedMakes, dropdown && s.dropdownSelectedMakes)}
          >
            {selections.map((selection) => (
              <button
                key={selection.name + ':' + selection.excluded}
                type="button"
                data-desktop-model-make={selection.name}
                aria-pressed={
                  current?.name === selection.name && current.excluded === selection.excluded
                }
                onClick={() => edit(selection)}
                {...stylex.props(
                  s.selectedMake,
                  dropdown && s.dropdownSelectedMake,
                  current?.name === selection.name &&
                    current.excluded === selection.excluded &&
                    s.currentMake,
                )}
              >
                <BrandLogo make={selection.name} size={20} />
                {selection.name}
                {selection.excluded && <span {...stylex.props(s.excluded)}>{t('Excluded')}</span>}
              </button>
            ))}
          </div>
        )}
        <div
          {...stylex.props(
            s.heading,
            compact && s.compactHeading,
            single && s.singleHeading,
            dropdown && ui.srOnly,
            single && selections.length > 1 && ui.srOnly,
          )}
        >
          {compact && current && (
            <button
              type="button"
              aria-label={t('Back') + ': ' + t('Makes')}
              onClick={backToMakes}
              {...stylex.props(s.back)}
            >
              <Icon name="back" size={18} />
              <BrandLogo make={current.name} size={24} />
              {current.name}
            </button>
          )}
          <h3
            id={id + '-models'}
            {...stylex.props(compact ? ui.srOnly : s.title, single && s.singleTitle)}
          >
            {single && current ? (
              <>
                <BrandLogo make={current.name} size={24} />
                {current.name}
              </>
            ) : (
              <>
                {t('Models')}
                {current ? ' · ' + current.name : ''}
              </>
            )}
          </h3>
          {!single && (
            <button
              type="button"
              aria-label={
                t(current?.excluded ? 'Remove excluded make' : 'Remove make') +
                ': ' +
                (current?.name || '')
              }
              disabled={!current}
              onClick={() => current && remove(current.name)}
              {...stylex.props(s.remove, !current && s.invisible)}
            >
              <Icon name="close" size={14} />
              {t('Remove')}
            </button>
          )}
        </div>
        {searchField('model')}
        <div {...stylex.props(s.modelContent, dropdown && s.dropdownModelContent)}>
          {current && draft ? (
            <ShowroomModelOptions
              key={current.name}
              desktop
              dropdown={dropdown}
              groups={modelGroupsFor(current.name)}
              draft={draft}
              query={modelQuery}
              expanded={expanded}
              excluded={current.excluded}
              onChange={applyDraft}
              onRemoveMake={single ? undefined : () => remove(current.name)}
              onToggleFamily={(name) =>
                setExpanded((values) =>
                  values.includes(name)
                    ? values.filter((value) => value !== name)
                    : [...values, name],
                )
              }
              onToggleExcluded={() => {
                const excluded = !current.excluded;
                applyDraft(draft, excluded, {
                  ...filters,
                  ...removeMakeSelection(filters, current.name, current.excluded),
                });
                setEditing({ name: current.name, excluded });
              }}
            />
          ) : (
            <p {...stylex.props(s.empty)}>{t('Choose a make to see its models.')}</p>
          )}
        </div>
      </section>
    </div>
  );
}
