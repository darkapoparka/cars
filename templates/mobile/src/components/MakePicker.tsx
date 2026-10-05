'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { controls } from '@/styles/controls.stylex';
import { topMakes } from '@/lib/catalog';
import { makeImages, popularMakes } from '@/lib/makes';
import { showroomMakeOptions } from '@/lib/make-picker-options';
import {
  nativeCarMakes as allMakes,
  modelGroupsFor,
  modelLeafKey,
  modelNodeKey,
  modelLabel,
  type NativeModelGroup,
} from '@/lib/native-taxonomy';
import { updateFilters, useAppState } from '@/lib/store';
import type { Filters } from '@/lib/types';
import {
  applyMakeSelection,
  clearMakeSelections,
  excludedMakeNames,
  makeSelectionSummary,
  removeMakeSelection,
} from '@/lib/make-selection';
import {
  modelDraftFor,
  selectedModelVariants,
  toggleModelDraft,
  modelVariantFor,
  setModelVariant,
  type ModelDraft,
} from '@/lib/model-picker';
import { IconButton, Modal, ui } from './ui';
import { Icon } from './Icon';
import { PickerScrollbar } from './PickerScrollbar';
import { ShowroomModelOptions } from './ShowroomModelOptions';
import { pickerStyles as s } from './make-picker.stylex';
const catalogMakeCount = new Set(allMakes).size;

export function BrandLogo({ make, size = 40 }: { make: string; size?: number }) {
  const src =
    makeImages[make] ||
    (topMakes.includes(make) ? '/images/brand-' + make.toLowerCase() + '.webp' : null);
  return src ? (
    <Image src={src} alt="" width={size} height={size} {...stylex.props(s.logo(size))} />
  ) : (
    <span aria-hidden="true" {...stylex.props(s.fallback)} />
  );
}
type Props = {
  open: boolean;
  onClose: () => void;
  initialMake?: string;
  initialExclude?: boolean;
  filters?: Filters;
  onApply?: (patch: Partial<Filters>) => void;
  availableMakes?: string[];
  embedded?: boolean;
};
export function MakePicker({
  open,
  onClose,
  initialMake = '',
  initialExclude = false,
  filters: suppliedFilters,
  onApply,
  availableMakes,
  embedded = false,
}: Props) {
  const { t, number } = useLocale();
  const makeSummaryId = useId();
  const state = useAppState();
  const filters = suppliedFilters || state.filters;
  const changeFilters = onApply || updateFilters;
  const initialMode = initialExclude || filters.excludedMakes.includes(initialMake);
  const [make, setMake] = useState(initialMake);
  const [exclude, setExclude] = useState(initialMode);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(() => modelDraftFor(filters, initialMake, initialMode));
  const [expanded, setExpanded] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const modelsVisible = Boolean(make);
  const selectedMakes = [
    ...filters.makes.map((name) => ({ name, excluded: false })),
    ...excludedMakeNames(filters).map((name) => ({ name, excluded: true })),
  ].map(({ name, excluded }) => ({
    name,
    excluded,
    summary: makeSelectionSummary(filters, name, excluded),
  }));
  const removeLabel = (name: string, excluded: boolean) =>
    t(excluded ? 'Remove excluded make' : 'Remove make') + ': ' + name;
  const groups = modelGroupsFor(make);
  const q = query.trim().toLocaleLowerCase();
  const visibleGroups = groups.filter(
    (group) =>
      !q || [group.name, ...group.children].some((name) => name.toLocaleLowerCase().includes(q)),
  );
  const makeNames = (availableMakes || allMakes).filter(
    (name) => name !== 'Any' && name !== 'Other',
  );
  const matchingMakes = q
    ? [...makeNames, 'Other', 'Any'].filter((name) => name.toLocaleLowerCase().includes(q))
    : makeNames;
  const alphabet = [...new Set(matchingMakes.map((name) => name[0].toLocaleUpperCase()))].map(
    (letter) => ({
      title: letter,
      names: matchingMakes.filter((name) => name[0].toLocaleUpperCase() === letter),
    }),
  );
  const sections =
    embedded && availableMakes
      ? [
          {
            title: '',
            names: showroomMakeOptions(
              availableMakes,
              selectedMakes.map(({ name }) => name),
              q,
              allMakes,
            ),
          },
        ]
      : q
        ? alphabet
        : [
            { title: 'Top Makes', names: availableMakes || popularMakes },
            ...alphabet,
            { title: '#', names: ['Other', 'Any'] },
          ];
  const modelListHeight =
    (q ? 0 : 48 + (!draft.selected.length ? 53 : 0)) +
    visibleGroups.reduce((height, group) => {
      const show = group.children.length > 0 && (expanded.includes(group.name) || Boolean(q));
      const childCount = show
        ? group.children.filter(
            (name) =>
              !q ||
              group.name.toLocaleLowerCase().includes(q) ||
              name.toLocaleLowerCase().includes(q),
          ).length
        : 0;
      const selected =
        draft.selected.includes(modelNodeKey(group, groups)) ||
        group.children.some((name) => draft.selected.includes(modelLeafKey(name, group)));
      return height + (group.children.length ? 56 : 48) + childCount * 48 + (selected ? 53 : 0);
    }, 0);
  const contentHeight = make
    ? 136 + modelListHeight + 76
    : 132 + sections.reduce((height, group) => height + 53 + group.names.length * 65, 0) + 76;
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [make, query]);
  function focusModelSelection() {
    requestAnimationFrame(() =>
      listRef.current
        ?.querySelector<HTMLInputElement>('input[type="checkbox"]')
        ?.focus({ preventScroll: true }),
    );
  }
  function chooseMake(name: string, mode = exclude) {
    if (name === 'Any') {
      changeFilters(clearMakeSelections());
      if (embedded) {
        setMake('');
        setQuery('');
        setExclude(false);
        setDraft({ selected: [], variants: {} });
      } else onClose();
      return;
    }
    setMake(name);
    setExclude(mode);
    setQuery('');
    setExpanded([]);
    const next = modelDraftFor(filters, name, mode);
    setDraft(next);
    if (embedded) {
      applyDraft(name, next, mode);
      focusModelSelection();
    }
  }
  function editSelectedMake(name: string, excluded: boolean) {
    setMake(name);
    setExclude(excluded);
    setQuery('');
    setExpanded([]);
    setDraft(modelDraftFor(filters, name, excluded));
    focusModelSelection();
  }
  function removeSelectedMake(name: string, excluded: boolean) {
    changeFilters(removeMakeSelection(filters, name, excluded));
    if (name === make && excluded === exclude) {
      setMake('');
      setExclude(false);
      setQuery('');
      setExpanded([]);
      setDraft({ selected: [], variants: {} });
    }
    focusMakeSelection(name);
  }
  function returnToMakes() {
    const previousMake = make;
    setMake('');
    setExclude(false);
    setQuery('');
    setExpanded([]);
    focusMakeSelection(previousMake);
  }
  function focusMakeSelection(name: string) {
    requestAnimationFrame(() => {
      const row = [
        ...(listRef.current?.querySelectorAll<HTMLElement>('[data-make-option]') || []),
      ].find((element) => element.dataset.makeOption === name);
      const target =
        row?.querySelector<HTMLButtonElement>('button') ||
        listRef.current?.querySelector<HTMLButtonElement>('button');
      target?.focus({ preventScroll: true });
    });
  }
  function applyDraft(
    name: string,
    next: ModelDraft,
    excluded: boolean,
    source: Filters = filters,
  ) {
    const variants = selectedModelVariants(next);
    changeFilters(
      applyMakeSelection(
        source,
        name,
        next.selected,
        excluded,
        next.selected.length ? '' : variants[''] || '',
        variants,
      ),
    );
  }
  function changeDraft(next: ModelDraft) {
    setDraft(next);
    if (embedded) applyDraft(make, next, exclude);
  }
  function toggleExcluded() {
    const next = !exclude;
    setExclude(next);
    if (embedded && make)
      applyDraft(make, draft, next, {
        ...filters,
        ...removeMakeSelection(filters, make, exclude),
      });
  }
  function apply() {
    const variants = selectedModelVariants(draft);
    changeFilters(
      applyMakeSelection(
        filters,
        make,
        draft.selected,
        exclude,
        draft.selected.length ? '' : variants[''] || '',
        variants,
      ),
    );
    onClose();
  }
  function variantField(model: string, group?: NativeModelGroup) {
    return (
      <div {...stylex.props(s.variantBox)}>
        <input
          aria-label={model ? 'Variant for ' + modelLabel(model) : t('Variant')}
          value={modelVariantFor(draft, model, group)}
          placeholder={t('Variant e.g. GTI (optional)')}
          maxLength={200}
          autoComplete="off"
          onChange={(event) => {
            const value = event.target.value;
            setDraft((current) => setModelVariant(current, model, value, group));
          }}
          {...stylex.props(ui.input, s.variant)}
        />
      </div>
    );
  }
  function modelRow(
    name: string,
    group?: NativeModelGroup,
    parent?: NativeModelGroup,
    show = false,
  ) {
    const family = Boolean(group?.children.length);
    const key = parent ? modelLeafKey(name, parent) : group ? modelNodeKey(group, groups) : name;
    const checked = !name
      ? !draft.selected.length
      : draft.selected.includes(key) ||
        Boolean(parent && draft.selected.includes(parent.name)) ||
        Boolean(
          family &&
          group!.children.every((child) => draft.selected.includes(modelLeafKey(child, group))),
        );
    const partial =
      family &&
      !checked &&
      group!.children.some((child) => draft.selected.includes(modelLeafKey(child, group)));
    return (
      <div {...stylex.props(s.row, family && s.family)}>
        {family ? (
          <button
            type="button"
            aria-label={(show ? 'Collapse ' : 'Expand ') + name}
            aria-expanded={show}
            onClick={() =>
              setExpanded((current) =>
                current.includes(name)
                  ? current.filter((value) => value !== name)
                  : [...current, name],
              )
            }
            {...stylex.props(s.arrow)}
          >
            <Icon name={show ? 'up' : 'down'} size={16} />
          </button>
        ) : (
          <span aria-hidden="true" {...stylex.props(s.arrow)} />
        )}
        <label {...stylex.props(s.choice)}>
          <span>{name || t('Any')}</span>
          <span {...stylex.props(s.checkTarget)}>
            <input
              type="checkbox"
              data-model-key={key}
              aria-label={name || t('Any')}
              checked={checked}
              ref={(element) => {
                if (element) element.indeterminate = Boolean(partial);
              }}
              onChange={(event) => {
                setDraft((current) =>
                  toggleModelDraft(current, key, event.target.checked, groups, parent?.name),
                );
              }}
              {...stylex.props(controls.checkbox, partial && s.mixed)}
            />
          </span>
        </label>
      </div>
    );
  }
  const excludeToggle = (
    <label {...stylex.props(s.toggle)}>
      {t('Exclude')}
      <button
        type="button"
        role="switch"
        aria-label={t('Exclude make')}
        aria-checked={exclude}
        onClick={toggleExcluded}
        {...stylex.props(s.switch, exclude && s.switchOn)}
      >
        <span {...stylex.props(s.dot, exclude && s.dotOn)} />
      </button>
    </label>
  );
  const content = (
    <>
      {!embedded && (
        <div {...stylex.props(s.header)}>
          <h2 {...stylex.props(s.title)}>{make || t('Make')}</h2>
          {excludeToggle}
        </div>
      )}
      <div
        {...stylex.props(
          s.searchBox,
          modelsVisible && s.modelSearch,
          embedded && s.embeddedSearchBox,
        )}
      >
        {embedded && (
          <span aria-hidden="true" {...stylex.props(s.searchIcon)}>
            <Icon name="search" size={20} />
          </span>
        )}
        <input
          ref={searchRef}
          aria-label={modelsVisible ? t('Search models') : t('Search makes')}
          placeholder={
            embedded ? (modelsVisible ? t('Search models') : t('Search makes')) : t('Search…')
          }
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          {...stylex.props(
            ui.input,
            s.search,
            embedded && s.embeddedInput,
            embedded && s.embeddedSearch,
          )}
        />
        {query && (
          <button
            type="button"
            aria-label={t('Clear search')}
            onClick={() => {
              setQuery('');
              searchRef.current?.focus();
            }}
            {...stylex.props(s.clear, embedded && s.embeddedClear)}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
      <div {...stylex.props(s.viewport)}>
        <div
          id={embedded ? 'showroom-make-model-options' : make ? undefined : 'car-make-list'}
          ref={listRef}
          data-picker-scroll={modelsVisible ? 'models' : 'makes'}
          {...stylex.props(
            s.list,
            !embedded && !modelsVisible && s.makeList,
            embedded && s.embeddedList,
          )}
        >
          {modelsVisible ? (
            embedded ? (
              <ShowroomModelOptions
                key={make}
                make={make}
                groups={groups}
                draft={draft}
                query={query}
                expanded={expanded}
                excluded={exclude}
                onChange={changeDraft}
                onRemoveMake={() => removeSelectedMake(make, exclude)}
                onBack={returnToMakes}
                onToggleFamily={(name) =>
                  setExpanded((current) =>
                    current.includes(name)
                      ? current.filter((value) => value !== name)
                      : [...current, name],
                  )
                }
                onToggleExcluded={toggleExcluded}
              />
            ) : (
              <>
                {!q && (
                  <div {...stylex.props(s.block)}>
                    {modelRow('')}
                    {!draft.selected.length && variantField('')}
                  </div>
                )}
                {visibleGroups.map((group) => {
                  const show =
                    group.children.length > 0 && (expanded.includes(group.name) || Boolean(q));
                  return (
                    <div
                      key={modelNodeKey(group, groups)}
                      data-model-node={modelNodeKey(group, groups)}
                      {...stylex.props(s.block)}
                    >
                      {modelRow(group.name, group, undefined, show)}
                      {show &&
                        group.children
                          .filter(
                            (name) =>
                              !q ||
                              group.name.toLocaleLowerCase().includes(q) ||
                              name.toLocaleLowerCase().includes(q),
                          )
                          .map((name) => <div key={name}>{modelRow(name, undefined, group)}</div>)}
                      {(draft.selected.includes(modelNodeKey(group, groups)) ||
                        group.children.some((name) =>
                          draft.selected.includes(modelLeafKey(name, group)),
                        )) &&
                        variantField(modelNodeKey(group, groups), group)}
                    </div>
                  );
                })}
                {q && !visibleGroups.length && (
                  <p role="status" {...stylex.props(ui.srOnly)}>
                    {t('No models found')}
                  </p>
                )}
              </>
            )
          ) : (
            <>
              {sections.map((section, sectionIndex) => (
                <section key={section.title || 'matches'}>
                  {section.title && <h3 {...stylex.props(s.group)}>{section.title}</h3>}
                  {section.names.map((name, index) => {
                    const isAllMakes = embedded && name === 'Any';
                    const selected = embedded
                      ? selectedMakes.find(
                          (selection) => selection.name === name && selection.excluded === exclude,
                        ) || selectedMakes.find((selection) => selection.name === name)
                      : undefined;
                    const isSelected =
                      Boolean(selected) || (name === 'Any' && !selectedMakes.length);
                    const option = (
                      <button
                        type="button"
                        key={name}
                        aria-label={isAllMakes ? t('Any make') : undefined}
                        aria-describedby={isAllMakes ? makeSummaryId : undefined}
                        aria-pressed={isAllMakes ? !selectedMakes.length : undefined}
                        onClick={() =>
                          selected
                            ? editSelectedMake(name, selected.excluded)
                            : chooseMake(name, embedded ? false : exclude)
                        }
                        {...stylex.props(
                          s.make,
                          embedded && s.embeddedMake,
                          isAllMakes && s.allMakes,
                          sectionIndex === sections.length - 1 &&
                            index === section.names.length - 1 &&
                            !embedded &&
                            s.lastMake,
                        )}
                      >
                        {isAllMakes ? (
                          <Image
                            src="/branding/cars-circle-20261005.png"
                            alt=""
                            width={32}
                            height={32}
                            {...stylex.props(s.logo(32))}
                          />
                        ) : (
                          <BrandLogo make={name} size={embedded ? 32 : 40} />
                        )}
                        <span
                          {...stylex.props(
                            embedded && s.makeName,
                            (Boolean(selected) || isAllMakes) && s.optionCopy,
                            isAllMakes && s.allMakesCopy,
                          )}
                        >
                          <span>
                            {selected?.excluded ? t('Exclude ') : ''}
                            {isAllMakes ? t('Any make') : t(name)}
                          </span>
                          {isAllMakes && (
                            <span id={makeSummaryId} {...stylex.props(s.selectionSummary)}>
                              ({number(catalogMakeCount)})
                            </span>
                          )}
                          {selected && (
                            <span {...stylex.props(s.selectionSummary)}>
                              {selected.summary === 'Any' ? t('All models') : selected.summary}
                            </span>
                          )}
                        </span>
                        {embedded && (
                          <span aria-hidden="true" {...stylex.props(s.makeTrailing)}>
                            {selected || isAllMakes ? (
                              <span
                                {...stylex.props(s.selectionMark, isSelected && s.selectedMark)}
                              >
                                {isSelected && <Icon name="check" size={14} />}
                              </span>
                            ) : (
                              <Icon name="right" size={18} />
                            )}
                          </span>
                        )}
                      </button>
                    );
                    return embedded ? (
                      <div key={name} data-make-option={name} {...stylex.props(s.makeOption)}>
                        {option}
                        {selected && (
                          <IconButton
                            icon="close"
                            label={removeLabel(name, selected.excluded)}
                            onClick={() => removeSelectedMake(name, selected.excluded)}
                          />
                        )}
                      </div>
                    ) : (
                      option
                    );
                  })}
                  {!section.names.length && (
                    <p role="status" {...stylex.props(embedded ? s.empty : ui.srOnly)}>
                      {t('No makes found')}
                    </p>
                  )}
                </section>
              ))}
            </>
          )}
        </div>
        {!embedded && !make && <PickerScrollbar target={listRef} identity={query} />}
      </div>
      {!embedded && (
        <div {...stylex.props(s.footer)}>
          <button type="button" onClick={onClose} {...stylex.props(s.action)}>
            {t('Cancel')}
          </button>
          {make && (
            <button type="button" onClick={apply} {...stylex.props(s.action)}>
              OK
            </button>
          )}
        </div>
      )}
    </>
  );
  return embedded ? (
    <div {...stylex.props(s.embedded)}>{content}</div>
  ) : (
    <Modal
      picker
      pickerHeight={contentHeight}
      open={open}
      onClose={onClose}
      label={make ? make + ' · ' + t('Models') : t('Make')}
    >
      {content}
    </Modal>
  );
}
