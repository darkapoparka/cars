'use client';

import { useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Filters } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { showroomMakeOptions } from '@/lib/make-picker-options';
import { modelGroupsFor } from '@/lib/native-taxonomy';
import {
  applyMakeSelection,
  clearMakeSelections,
  excludedMakeNames,
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

export function ShowroomDesktopMakeModel({
  availableMakes,
  filters,
  onChange,
}: {
  availableMakes: string[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const { t } = useLocale();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selections: Selection[] = [
    ...filters.makes.map((name) => ({ name, excluded: false })),
    ...excludedMakeNames(filters).map((name) => ({ name, excluded: true })),
  ];
  const [editing, setEditing] = useState<Selection | null>(() => selections[0] || null);
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);
  // The parent draft is the only filter state. A removed selection cannot leave stale models open.
  const current =
    selections.find(
      ({ name, excluded }) => name === editing?.name && excluded === editing.excluded,
    ) || (selections.length === 1 ? selections[0] : null);
  const draft = current ? modelDraftFor(filters, current.name, current.excluded) : null;
  const makes = showroomMakeOptions(
    availableMakes,
    selections.map(({ name }) => name),
    makeQuery,
  );

  function edit(selection: Selection) {
    setEditing(selection);
    setModelQuery('');
    setExpanded([]);
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
    setModelQuery('');
    setExpanded([]);
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
      <div {...stylex.props(s.search, controls.fieldFocus, disabled && s.disabledSearch)}>
        <span aria-hidden="true" {...stylex.props(s.searchIcon)}>
          <Icon name="search" size={18} />
        </span>
        <input
          aria-label={label}
          placeholder={disabled ? t('Choose a make first') : label}
          disabled={disabled}
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          {...stylex.props(ui.input, s.searchInput)}
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
    <div ref={rootRef} data-desktop-make-model {...stylex.props(s.layout)}>
      <section aria-labelledby={id + '-makes'} {...stylex.props(s.pane)}>
        <div {...stylex.props(s.heading)}>
          <h3 id={id + '-makes'} {...stylex.props(s.title)}>
            {t('Makes')}
          </h3>
        </div>
        {searchField('make')}
        <div data-desktop-make-list {...stylex.props(s.makeList)}>
          {makes.map((name) => {
            const selection = selections.find((item) => item.name === name);
            const checked = name === 'Any' ? !selections.length : Boolean(selection);
            const active = current?.name === name;
            return (
              <div
                key={name}
                data-desktop-make={name}
                {...stylex.props(s.makeRow, active && s.activeRow)}
              >
                <label {...stylex.props(s.makeChoice)}>
                  <input
                    type="checkbox"
                    aria-label={name === 'Any' ? t('Any make') : name}
                    checked={checked}
                    onChange={(event) => chooseMake(name, event.target.checked)}
                    {...stylex.props(controls.checkbox, s.checkbox)}
                  />
                  {name !== 'Any' && <BrandLogo make={name} size={28} />}
                  <span {...stylex.props(s.makeName)}>
                    {name === 'Any' ? t('Any make') : name}
                    {selection?.excluded && (
                      <span {...stylex.props(s.excluded)}>{t('Excluded')}</span>
                    )}
                  </span>
                </label>
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
              </div>
            );
          })}
          {!makes.length && (
            <p role="status" {...stylex.props(s.empty)}>
              {t('No makes found')}
            </p>
          )}
        </div>
      </section>
      <section aria-labelledby={id + '-models'} {...stylex.props(s.pane, s.modelPane)}>
        <div {...stylex.props(s.heading)}>
          <h3 id={id + '-models'} {...stylex.props(s.title)}>
            {t('Models')}
            {current ? ' · ' + current.name : ''}
          </h3>
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
        </div>
        {searchField('model')}
        <div {...stylex.props(s.modelContent)}>
          {current && draft ? (
            <ShowroomModelOptions
              key={current.name}
              desktop
              groups={modelGroupsFor(current.name)}
              draft={draft}
              query={modelQuery}
              expanded={expanded}
              excluded={current.excluded}
              onChange={applyDraft}
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
