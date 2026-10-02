'use client';
import { useEffect, useRef, useState, type Ref } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { controls } from '@/styles/controls.stylex';
import { topMakes } from '@/lib/catalog';
import { makeImages, popularMakes } from '@/lib/makes';
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
  disabled = false,
  buttonRef,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  disabled?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  onClick: () => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={label + ': ' + value}
      aria-controls="showroom-make-model-options"
      aria-expanded={active}
      title={value}
      onClick={onClick}
      {...stylex.props(s.selector, active && s.selectorActive, disabled && s.selectorDisabled)}
    >
      <span {...stylex.props(s.selectorLabel)}>{label}</span>
      <span {...stylex.props(s.selectorValue)}>
        <span {...stylex.props(s.selectorText)}>{value}</span>
        <span aria-hidden="true" {...stylex.props(s.selectorArrow)}>
          <Icon name={active ? 'up' : 'down'} size={18} />
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
  const selectedNames = new Set(selectedMakes.map(({ name }) => name));
  const modelSummary = draft.selected.length
    ? draft.selected.map(modelLabel).join(', ')
    : 'Any model';
  const groups = modelGroupsFor(make);
  const q = query.trim().toLocaleLowerCase();
  const visibleSelectedMakes = selectedMakes.filter(
    ({ name }) => !q || name.toLocaleLowerCase().includes(q),
  );
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
            names: ['Any', ...makeNames].filter(
              (name) =>
                (name === 'Any' || !selectedNames.has(name)) &&
                (!q || name.toLocaleLowerCase().includes(q)),
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
  function chooseMake(name: string) {
    if (name === 'Any') {
      changeFilters({
        makes: [],
        excludedMakes: [],
        models: [],
        makeModels: {},
        excludedModels: {},
        makeVariants: {},
        excludedMakeVariants: {},
        modelVariants: {},
        excludedModelVariants: {},
      });
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
    setQuery('');
    setExpanded([]);
    const next = modelDraftFor(filters, name, exclude);
    setDraft(next);
    if (embedded) {
      applyDraft(name, next, exclude);
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
      setDraft({ selected: [], variants: {} });
    }
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
          aria-label={model ? 'Variant for ' + modelLabel(model) : 'Variant'}
          value={modelVariantFor(draft, model, group)}
          placeholder="Variant e.g. GTI (optional)"
          maxLength={200}
          autoComplete="off"
          onChange={(event) => {
            const value = event.target.value;
            if (embedded) changeDraft(setModelVariant(draft, model, value, group));
            else setDraft((current) => setModelVariant(current, model, value, group));
          }}
          {...stylex.props(ui.input, s.variant, embedded && s.embeddedInput)}
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
          <span>{name || (embedded ? 'Any model' : 'Any')}</span>
          <span {...stylex.props(s.checkTarget)}>
            <input
              type="checkbox"
              data-model-key={key}
              aria-label={name || (embedded ? 'Any model' : 'Any')}
              checked={checked}
              ref={(element) => {
                if (element) element.indeterminate = Boolean(partial);
              }}
              onChange={(event) => {
                if (embedded)
                  changeDraft(
                    toggleModelDraft(draft, key, event.target.checked, groups, parent?.name),
                  );
                else
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
    <label {...stylex.props(s.toggle, embedded && s.embeddedToggle)}>
      {embedded ? 'Exclude selection' : 'Exclude'}
      <button
        type="button"
        role="switch"
        aria-label="Exclude make"
        aria-checked={exclude}
        onClick={() => {
          setExclude((value) => !value);
          if (embedded && make)
            applyDraft(make, draft, !exclude, {
              ...filters,
              ...removeMakeSelection(filters, make, exclude),
            });
        }}
        {...stylex.props(embedded ? s.toggleTarget : s.switch, !embedded && exclude && s.switchOn)}
      >
        {embedded ? (
          <span aria-hidden="true" {...stylex.props(s.switch, exclude && s.switchOn)}>
            <span {...stylex.props(s.dot, exclude && s.dotOn)} />
          </span>
        ) : (
          <span {...stylex.props(s.dot, exclude && s.dotOn)} />
        )}
      </button>
    </label>
  );
  const content = (
    <>
      {embedded ? (
        <div {...stylex.props(s.selectors)}>
          <SelectionButton
            label="Make"
            value={make || 'Any make'}
            active={!modelsVisible}
            onClick={() => {
              setSelector('make');
              setQuery('');
            }}
          />
          <SelectionButton
            buttonRef={modelSelectorRef}
            label="Model"
            value={make ? modelSummary : 'Choose make'}
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
          <h2 {...stylex.props(s.title)}>{make || 'Make'}</h2>
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
          aria-label={modelsVisible ? 'Search models' : 'Search makes'}
          placeholder={
            embedded ? (modelsVisible ? 'Search ' + make + ' models' : 'Search makes') : 'Search…'
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
            aria-label="Clear search"
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
            !modelsVisible && s.makeList,
            embedded && !modelsVisible && s.embeddedList,
          )}
        >
          {modelsVisible ? (
            <>
              {embedded && (
                <div {...stylex.props(s.modelHeading)}>
                  <h3 {...stylex.props(s.embeddedGroup)}>Models</h3>
                  {excludeToggle}
                </div>
              )}
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
                <p role="status" {...stylex.props(embedded ? s.empty : ui.srOnly)}>
                  No models found
                </p>
              )}
            </>
          ) : (
            <>
              {embedded && visibleSelectedMakes.length > 0 && (
                <section aria-label="Selected makes">
                  <h3 {...stylex.props(s.group, s.embeddedGroup)}>Selected makes</h3>
                  {visibleSelectedMakes.map(({ name, excluded, summary }) => (
                    <div key={name + excluded} {...stylex.props(s.selectedRow)}>
                      <button
                        type="button"
                        {...stylex.props(s.make, s.selectedMake)}
                        onClick={() => editSelectedMake(name, excluded)}
                      >
                        <BrandLogo make={name} size={32} />
                        <span {...stylex.props(s.selectedCopy)}>
                          <span>
                            {excluded ? 'Exclude ' : ''}
                            {name}
                          </span>
                          <span {...stylex.props(s.selectionSummary)}>
                            {summary === 'Any' ? 'All models' : summary}
                          </span>
                        </span>
                        <span aria-hidden="true" {...stylex.props(s.selectorArrow)}>
                          <Icon name="right" size={18} />
                        </span>
                      </button>
                      <IconButton
                        icon="close"
                        label={'Remove ' + (excluded ? 'excluded ' : '') + name}
                        onClick={() => removeSelectedMake(name, excluded)}
                      />
                    </div>
                  ))}
                </section>
              )}
              {sections.map((section, sectionIndex) => (
                <section key={section.title || 'matches'}>
                  {section.title && <h3 {...stylex.props(s.group)}>{section.title}</h3>}
                  {section.names.map((name, index) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => chooseMake(name)}
                      {...stylex.props(
                        s.make,
                        embedded && s.embeddedMake,
                        sectionIndex === sections.length - 1 &&
                          index === section.names.length - 1 &&
                          !embedded &&
                          s.lastMake,
                      )}
                    >
                      {(name !== 'Any' || !embedded) && (
                        <BrandLogo make={name} size={embedded ? 32 : 40} />
                      )}
                      <span {...stylex.props(embedded && s.makeName)}>
                        {embedded && name === 'Any' ? 'Any make' : name}
                      </span>
                      {embedded &&
                        (name === 'Any' && !selectedMakes.length ? (
                          <Icon name="check" size={20} />
                        ) : (
                          <Icon name="right" size={18} />
                        ))}
                    </button>
                  ))}
                  {!section.names.length && (!embedded || !visibleSelectedMakes.length) && (
                    <p role="status" {...stylex.props(embedded ? s.empty : ui.srOnly)}>
                      No makes found
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
            Cancel
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
      label={make ? make + ' models' : 'Make'}
    >
      {content}
    </Modal>
  );
}
