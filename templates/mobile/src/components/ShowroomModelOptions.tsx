'use client';

import { useId, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controls } from '@/styles/controls.stylex';
import {
  modelLabel,
  modelLeafKey,
  modelNodeKey,
  type NativeModelGroup,
} from '@/lib/native-taxonomy';
import {
  modelVariantFor,
  setModelVariant,
  toggleModelDraft,
  type ModelDraft,
} from '@/lib/model-picker';
import { Icon } from './Icon';
import { ui } from './ui';
import { modelOptionStyles as s } from './showroom-model-options.stylex';

function ModelCheckbox({
  name,
  modelKey,
  checked,
  mixed = false,
  onChange,
}: {
  name: string;
  modelKey: string;
  checked: boolean;
  mixed?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      aria-label={name}
      data-model-key={modelKey}
      checked={checked}
      ref={(element) => {
        if (element) element.indeterminate = mixed;
      }}
      onChange={(event) => onChange(event.target.checked)}
      {...stylex.props(controls.checkbox, s.checkbox, mixed && s.mixed)}
    />
  );
}

export function ShowroomModelOptions({
  groups,
  draft,
  query,
  expanded,
  excluded,
  onChange,
  onToggleFamily,
  onToggleExcluded,
}: {
  groups: NativeModelGroup[];
  draft: ModelDraft;
  query: string;
  expanded: string[];
  excluded: boolean;
  onChange: (draft: ModelDraft) => void;
  onToggleFamily: (name: string) => void;
  onToggleExcluded: () => void;
}) {
  const optionsId = useId();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [searchExpansion, setSearchExpansion] = useState({ query: '', collapsed: [] as string[] });
  const q = query.trim().toLocaleLowerCase();
  const collapsedSearchGroups = searchExpansion.query === q ? searchExpansion.collapsed : [];
  const visibleGroups = groups.filter(
    (group) =>
      !q || [group.name, ...group.children].some((name) => name.toLocaleLowerCase().includes(q)),
  );
  const variantGroups = groups.filter(
    (group) =>
      draft.selected.includes(modelNodeKey(group, groups)) ||
      group.children.some((name) => draft.selected.includes(modelLeafKey(name, group))),
  );
  const activeOptions =
    Number(excluded) +
    Number(
      (draft.selected.length ? draft.selected : ['']).some((key) => draft.variants[key]?.trim()),
    );

  function modelChoice(name: string, parent?: NativeModelGroup) {
    const key = parent ? modelLeafKey(name, parent) : name;
    const checked = name
      ? draft.selected.includes(key) || Boolean(parent && draft.selected.includes(parent.name))
      : !draft.selected.length;
    return (
      <label {...stylex.props(s.choice, parent && s.childChoice)}>
        <span {...stylex.props(s.name)}>{name || 'Any model'}</span>
        <span {...stylex.props(s.checkTarget)}>
          <ModelCheckbox
            name={name || 'Any model'}
            modelKey={key}
            checked={checked}
            onChange={(next) => onChange(toggleModelDraft(draft, key, next, groups, parent?.name))}
          />
        </span>
      </label>
    );
  }

  function variantField(model: string, group?: NativeModelGroup) {
    return (
      <label {...stylex.props(s.variantField)}>
        <span>{model ? modelLabel(model) + ' variant' : 'Variant'} (optional)</span>
        <input
          aria-label={model ? 'Variant for ' + modelLabel(model) : 'Variant'}
          value={modelVariantFor(draft, model, group)}
          placeholder="Variant or trim"
          maxLength={200}
          autoComplete="off"
          onChange={(event) => onChange(setModelVariant(draft, model, event.target.value, group))}
          {...stylex.props(ui.input, s.variantInput)}
        />
      </label>
    );
  }

  return (
    <div data-showroom-model-options>
      {!q && <div {...stylex.props(s.group)}>{modelChoice('')}</div>}
      {visibleGroups.map((group) => {
        const key = modelNodeKey(group, groups);
        if (!group.children.length) {
          return (
            <div key={key} data-model-node={key} {...stylex.props(s.group)}>
              <label {...stylex.props(s.choice)}>
                <span {...stylex.props(s.name)}>{group.name}</span>
                <span {...stylex.props(s.checkTarget)}>
                  <ModelCheckbox
                    name={group.name}
                    modelKey={key}
                    checked={draft.selected.includes(key)}
                    onChange={(next) => onChange(toggleModelDraft(draft, key, next, groups))}
                  />
                </span>
              </label>
            </div>
          );
        }
        const checked =
          draft.selected.includes(key) ||
          group.children.every((name) => draft.selected.includes(modelLeafKey(name, group)));
        const mixed =
          !checked &&
          group.children.some((name) => draft.selected.includes(modelLeafKey(name, group)));
        const show = q
          ? !collapsedSearchGroups.includes(group.name)
          : expanded.includes(group.name);
        const childrenId = optionsId + '-' + encodeURIComponent(key);
        return (
          <div key={key} data-model-node={key} {...stylex.props(s.group)}>
            <div {...stylex.props(s.familyRow)}>
              <button
                type="button"
                aria-label={(show ? 'Collapse ' : 'Expand ') + group.name}
                aria-expanded={show}
                aria-controls={childrenId}
                onClick={() => {
                  if (!q) onToggleFamily(group.name);
                  else
                    setSearchExpansion((current) => {
                      const collapsed = current.query === q ? current.collapsed : [];
                      return {
                        query: q,
                        collapsed: collapsed.includes(group.name)
                          ? collapsed.filter((name) => name !== group.name)
                          : [...collapsed, group.name],
                      };
                    });
                }}
                {...stylex.props(s.familyButton)}
              >
                <span {...stylex.props(s.name)}>{group.name}</span>
                <span aria-hidden="true" {...stylex.props(s.chevron)}>
                  <Icon name={show ? 'up' : 'down'} size={18} />
                </span>
              </button>
              <label {...stylex.props(s.checkTarget)}>
                <ModelCheckbox
                  name={group.name}
                  modelKey={key}
                  checked={checked}
                  mixed={mixed}
                  onChange={(next) => onChange(toggleModelDraft(draft, key, next, groups))}
                />
              </label>
            </div>
            <div id={childrenId} hidden={!show} {...stylex.props(s.children)}>
              {show &&
                group.children
                  .filter(
                    (name) =>
                      !q ||
                      group.name.toLocaleLowerCase().includes(q) ||
                      name.toLocaleLowerCase().includes(q),
                  )
                  .map((name) => <div key={name}>{modelChoice(name, group)}</div>)}
            </div>
          </div>
        );
      })}
      {q && !visibleGroups.length && (
        <p role="status" {...stylex.props(s.empty)}>
          No models found
        </p>
      )}
      <details
        open={optionsOpen}
        onToggle={(event) => setOptionsOpen(event.currentTarget.open)}
        {...stylex.props(s.options)}
      >
        <summary {...stylex.props(s.summary)}>
          <span {...stylex.props(s.name)}>More options</span>
          {activeOptions > 0 && (
            <span {...stylex.props(s.activeCount)}>{activeOptions} active</span>
          )}
          <span aria-hidden="true" {...stylex.props(s.chevron)}>
            <Icon name={optionsOpen ? 'up' : 'down'} size={18} />
          </span>
        </summary>
        <div {...stylex.props(s.optionFields)}>
          <button
            type="button"
            role="switch"
            aria-label="Exclude make"
            aria-checked={excluded}
            onClick={onToggleExcluded}
            {...stylex.props(s.excludeRow)}
          >
            <span {...stylex.props(s.name)}>Exclude this selection</span>
            <span aria-hidden="true" {...stylex.props(s.switch, excluded && s.switchOn)}>
              <span {...stylex.props(s.thumb)} />
            </span>
          </button>
          {!draft.selected.length
            ? variantField('')
            : variantGroups.map((group) => (
                <div key={modelNodeKey(group, groups)}>
                  {variantField(modelNodeKey(group, groups), group)}
                </div>
              ))}
        </div>
      </details>
    </div>
  );
}
