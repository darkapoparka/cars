'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState, type Ref } from 'react';
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
function SelectionButton({
  label,
  value,
  active,
  back = false,
  disabled = false,
  buttonRef,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  back?: boolean;
  disabled?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  onClick: () => void;
}) {
  const { t } = useLocale();
  const accessibleLabel = back ? t('Back') + ': ' + t('Makes') : t(label) + ': ' + t(value);
  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={accessibleLabel}
      aria-controls="showroom-make-model-options"
      aria-expanded={active}
      title={disabled ? t('Choose a make first') : back ? accessibleLabel : t(value)}
      onClick={onClick}
      {...stylex.props(s.selector)}
    >
      <span
        data-pill-surface
        {...stylex.props(
          s.selectorSurface,
          active && s.selectorActive,
          disabled && s.selectorDisabled,
        )}
      >
        {back && (
          <span aria-hidden="true" {...stylex.props(s.selectorArrow)}>
            <Icon name="back" size={16} />
          </span>
        )}
        <span {...stylex.props(s.selectorLabel)}>{t(label)}</span>
        <span {...stylex.props(s.selectorValue)}>
          <span {...stylex.props(s.selectorText)}>{t(value)}</span>
          {!back && (
            <span aria-hidden="true" {...stylex.props(s.selectorArrow)}>
              <Icon name={active ? 'up' : 'down'} size={14} />
            </span>
          )}
        </span>
      </span>
    </button>
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
  const { t } = useLocale();
  const state = useAppState();
  const filters = suppliedFilters || state.filters;
  const changeFilters = onApply || updateFilters;
  const initialMode = initialExclude || filters.excludedMakes.includes(initialMake);
  const [make, setMake] = useState(initialMake);
  const [selector, setSelector] = useState<'make' | 'model'>(initialMake ? 'model' : 'make');
  const [exclude, setExclude] = useState(initialMode);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(() => modelDraftFor(filters, initialMake, initialMode));
  const [expanded, setExpanded] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const makeSelectorRef = useRef<HTMLButtonElement>(null);
  const modelSelectorRef = useRef<HTMLButtonElement>(null);
  const modelsVisible = Boolean(make) && (!embedded || selector === 'model');
  const selectedMakes = [
    ...filters.makes.map((name) => ({ name, excluded: false })),
    ...excludedMakeNames(filters).map((name) => ({ name, excluded: true })),
  ].map(({ name, excluded }) => ({
    name,
    excluded,
    summary: makeSelectionSummary(filters, name, excluded),
  }));
  const currentSelection = selectedMakes.find(
    (selection) => selection.name === make && selection.excluded === exclude,
  );
  const removeLabel = (name: string, excluded: boolean) =>
    t(excluded ? 'Remove excluded make' : 'Remove make') + ': ' + name;
  const modelSummary = draft.selected.length ? draft.selected.map(modelLabel).join(', ') : 'Any';
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
  }, [make, query, modelsVisible]);
  function chooseMake(name: string, mode = exclude) {
    if (name === 'Any') {
      changeFilters(clearMakeSelections());
      if (embedded) {
        setMake('');
        setSelector('make');
        setQuery('');
        setExclude(false);
        setDraft({ selected: [], variants: {} });
      } else onClose();
      return;
    }
    setMake(name);
    setSelector('model');
    setExclude(mode);
    setQuery('');
    setExpanded([]);
    const next = modelDraftFor(filters, name, mode);
    setDraft(next);
    if (embedded) {
      applyDraft(name, next, mode);
      requestAnimationFrame(() => modelSelectorRef.current?.focus({ preventScroll: true }));
    }
  }
  function editSelectedMake(name: string, excluded: boolean) {
    setMake(name);
    setSelector('model');
    setExclude(excluded);
    setQuery('');
    setExpanded([]);
    setDraft(modelDraftFor(filters, name, excluded));
    requestAnimationFrame(() => modelSelectorRef.current?.focus({ preventScroll: true }));
  }
  function removeSelectedMake(name: string, excluded: boolean) {
    changeFilters(removeMakeSelection(filters, name, excluded));
    if (name === make && excluded === exclude) {
      setMake('');
      setSelector('make');
      setExclude(false);
      setQuery('');
      setExpanded([]);
      setDraft({ selected: [], variants: {} });
    }
    requestAnimationFrame(() => {
      const row = [
        ...(listRef.current?.querySelectorAll<HTMLElement>('[data-make-option]') || []),
      ].find((element) => element.dataset.makeOption === name);
      const target = row?.querySelector<HTMLButtonElement>('button') || makeSelectorRef.current;
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
      {embedded ? (
        <div {...stylex.props(s.selectors)}>
          <div {...stylex.props(s.makeSelector)}>
            <SelectionButton
              buttonRef={makeSelectorRef}
              label={t('Make')}
              value={make || 'Any'}
              active={!modelsVisible}
              back={modelsVisible}
              onClick={() => {
                setSelector('make');
                setQuery('');
              }}
            />
            {currentSelection && (
              <button
                type="button"
                aria-label={removeLabel(make, exclude)}
                title={removeLabel(make, exclude)}
                onClick={() => removeSelectedMake(make, exclude)}
                {...stylex.props(s.removeCurrentMake)}
              >
                <span {...stylex.props(s.removeSurface)}>
                  <Icon name="close" size={14} />
                  {t('Remove')}
                </span>
              </button>
            )}
          </div>
          <SelectionButton
            buttonRef={modelSelectorRef}
            label={t('Model')}
            value={make ? modelSummary : 'Any'}
            active={modelsVisible}
            disabled={!make}
            onClick={() => {
              setSelector('model');
              setQuery('');
            }}
          />
        </div>
      ) : (
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
            embedded
              ? modelsVisible
                ? t('Search models') + ' · ' + make
                : t('Search makes')
              : t('Search…')
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
          {...stylex.props(s.list, !modelsVisible && s.makeList, embedded && s.embeddedList)}
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
                    const selected = embedded
                      ? selectedMakes.find(
                          (selection) => selection.name === name && selection.excluded === exclude,
                        ) || selectedMakes.find((selection) => selection.name === name)
                      : undefined;
                    const option = (
                      <button
                        type="button"
                        key={name}
                        onClick={() =>
                          selected
                            ? editSelectedMake(name, selected.excluded)
                            : chooseMake(name, embedded ? false : exclude)
                        }
                        {...stylex.props(
                          s.make,
                          embedded && s.embeddedMake,
                          sectionIndex === sections.length - 1 &&
                            index === section.names.length - 1 &&
                            !embedded &&
                            s.lastMake,
                        )}
                      >
                        {embedded && name === 'Any' ? (
                          <span aria-hidden="true" {...stylex.props(s.allMakesIcon)}>
                            <Icon name="grid" size={20} />
                          </span>
                        ) : (
                          <BrandLogo make={name} size={embedded ? 32 : 40} />
                        )}
                        <span
                          {...stylex.props(
                            embedded && s.makeName,
                            Boolean(selected) && s.selectedCopy,
                          )}
                        >
                          <span>
                            {selected?.excluded ? t('Exclude ') : ''}
                            {embedded && name === 'Any' ? t('Any make') : t(name)}
                          </span>
                          {selected && (
                            <span {...stylex.props(s.selectionSummary)}>
                              {selected.summary === 'Any' ? t('All models') : selected.summary}
                            </span>
                          )}
                        </span>
                        {embedded &&
                          (selected || (name === 'Any' && !selectedMakes.length) ? (
                            <span aria-hidden="true" {...stylex.props(s.selectedMark)}>
                              <Icon name="check" size={14} />
                            </span>
                          ) : (
                            <Icon name="right" size={18} />
                          ))}
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
