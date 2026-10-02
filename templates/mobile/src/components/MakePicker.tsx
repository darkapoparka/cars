'use client';
import { useEffect, useRef, useState } from 'react';
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
  const [exclude, setExclude] = useState(initialMode);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(() => modelDraftFor(filters, initialMake, initialMode));
  const [expanded, setExpanded] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
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
  const sections = q
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
        setQuery('');
        setExclude(false);
        setDraft({ selected: [], variants: {} });
      } else onClose();
      return;
    }
    setMake(name);
    setQuery('');
    setExpanded([]);
    const next = modelDraftFor(filters, name, exclude);
    setDraft(next);
    if (embedded) applyDraft(name, next, exclude);
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
          <span>{name || 'Any'}</span>
          <span {...stylex.props(s.checkTarget)}>
            <input
              type="checkbox"
              data-model-key={key}
              aria-label={name || 'Any'}
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
  const content = (
    <>
      <div {...stylex.props(s.header, embedded && s.embeddedHeader)}>
        {embedded && make && (
          <IconButton
            icon="back"
            label="All makes"
            onClick={() => {
              setMake('');
              setQuery('');
            }}
          />
        )}
        {embedded ? (
          <h3 {...stylex.props(s.title)}>{make || 'Choose a make'}</h3>
        ) : (
          <h2 {...stylex.props(s.title)}>{make || 'Make'}</h2>
        )}
        <label {...stylex.props(s.toggle)}>
          Exclude
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
            {...stylex.props(s.switch, exclude && s.switchOn)}
          >
            <span {...stylex.props(s.dot, exclude && s.dotOn)} />
          </button>
        </label>
      </div>
      <div {...stylex.props(s.searchBox, Boolean(make) && s.modelSearch)}>
        <input
          ref={searchRef}
          aria-label={make ? 'Search models' : 'Search makes'}
          placeholder="Search…"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          {...stylex.props(ui.input, s.search, embedded && s.embeddedInput)}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              searchRef.current?.focus();
            }}
            {...stylex.props(s.clear)}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
      <div {...stylex.props(s.viewport)}>
        <div
          id={make ? undefined : 'car-make-list'}
          ref={listRef}
          data-picker-scroll={make ? 'models' : 'makes'}
          {...stylex.props(s.list, !make && s.makeList)}
        >
          {make ? (
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
                  No models found
                </p>
              )}
            </>
          ) : (
            <>
              {embedded && (filters.makes.length > 0 || excludedMakeNames(filters).length > 0) && (
                <section aria-label="Selected makes">
                  <h3 {...stylex.props(s.group)}>Selected</h3>
                  {[
                    ...filters.makes.map((name) => ({ name, excluded: false })),
                    ...excludedMakeNames(filters).map((name) => ({ name, excluded: true })),
                  ].map(({ name, excluded }) => (
                    <div key={name + excluded} {...stylex.props(s.selectedRow)}>
                      <button
                        type="button"
                        {...stylex.props(s.make, s.selectedMake)}
                        onClick={() => {
                          setMake(name);
                          setExclude(excluded);
                          setQuery('');
                          setExpanded([]);
                          setDraft(modelDraftFor(filters, name, excluded));
                        }}
                      >
                        <BrandLogo make={name} />
                        <span>
                          {excluded ? 'Exclude ' : ''}
                          {name} · {makeSelectionSummary(filters, name, excluded)}
                        </span>
                      </button>
                      <IconButton
                        icon="close"
                        label={'Remove ' + (excluded ? 'excluded ' : '') + name}
                        onClick={() => changeFilters(removeMakeSelection(filters, name, excluded))}
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
                        sectionIndex === sections.length - 1 &&
                          index === section.names.length - 1 &&
                          s.lastMake,
                      )}
                    >
                      <BrandLogo make={name} />
                      {name}
                    </button>
                  ))}
                  {!section.names.length && (
                    <p role="status" {...stylex.props(ui.srOnly)}>
                      No makes found
                    </p>
                  )}
                </section>
              ))}
            </>
          )}
        </div>
        {!make && <PickerScrollbar target={listRef} identity={query} />}
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
