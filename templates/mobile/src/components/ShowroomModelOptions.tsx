'use client';
import { useLocale } from '@/lib/use-locale';

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
import { desktopModelOptions as ds } from './desktop-model-options.stylex';

function ModelCheckbox({
  id,
  name,
  modelKey,
  checked,
  mixed = false,
  desktop = false,
  onChange,
}: {
  id?: string;
  name: string;
  modelKey: string;
  checked: boolean;
  mixed?: boolean;
  desktop?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useLocale();
  return (
    <input
      id={id}
      type="checkbox"
      aria-label={t(name)}
      data-model-key={modelKey}
      checked={checked}
      ref={(element) => {
        if (element) element.indeterminate = mixed;
      }}
      onChange={(event) => onChange(event.target.checked)}
      {...stylex.props(
        controls.checkbox,
        s.checkbox,
        mixed && s.mixed,
        desktop && ds.checkbox,
        desktop && mixed && ds.mixed,
      )}
    />
  );
}

export function ShowroomModelOptions({
  make,
  groups,
  draft,
  query,
  expanded,
  excluded,
  desktop = false,
  onChange,
  onRemoveMake,
  onBack,
  onToggleFamily,
  onToggleExcluded,
}: {
  make?: string;
  groups: NativeModelGroup[];
  draft: ModelDraft;
  query: string;
  expanded: string[];
  excluded: boolean;
  desktop?: boolean;
  onChange: (draft: ModelDraft) => void;
  onRemoveMake?: () => void;
  onBack?: () => void;
  onToggleFamily: (name: string) => void;
  onToggleExcluded: () => void;
}) {
  const { t } = useLocale();
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
    const inputId = !name && onBack ? optionsId + '-all' : undefined;
    const copy = (
      <span {...stylex.props(s.name)}>
        {name || make || t('Any model')}
        {!name && make && <span {...stylex.props(s.allModelCopy)}>{t('All models')}</span>}
      </span>
    );
    const checkbox = (
      <ModelCheckbox
        id={inputId}
        name={name || (make ? make + ' · ' + t('All models') : 'Any model')}
        modelKey={key}
        checked={checked}
        desktop={desktop}
        onChange={(next) => {
          if (!name && !next && onRemoveMake) onRemoveMake();
          else onChange(toggleModelDraft(draft, key, next, groups, parent?.name));
        }}
      />
    );
    if (!name && make && onBack && !desktop) {
      return (
        <div {...stylex.props(s.familyRow, s.allChoice)}>
          <button
            type="button"
            aria-label={t('Back') + ': ' + t('Makes')}
            onClick={onBack}
            {...stylex.props(s.backButton)}
          >
            <Icon name="left" size={18} />
            {t('Back')}
          </button>
          <label htmlFor={inputId} {...stylex.props(s.choice, s.allMakeLabel)}>
            {copy}
          </label>
          <label htmlFor={inputId} {...stylex.props(s.checkTarget)}>
            {checkbox}
          </label>
        </div>
      );
    }
    return (
      <label
        {...stylex.props(
          s.choice,
          !desktop && !name && s.allChoice,
          parent && s.childChoice,
          desktop && ds.choice,
          desktop && parent && ds.childChoice,
          desktop && checked && ds.selected,
        )}
      >
        {copy}
        <span {...stylex.props(s.checkTarget, desktop && ds.checkTarget)}>{checkbox}</span>
      </label>
    );
  }

  function variantField(model: string, group?: NativeModelGroup) {
    return (
      <label {...stylex.props(s.variantField)}>
        <span>
          {model
            ? (desktop ? t(modelLabel(model)) : modelLabel(model)) + ' · ' + t('Variant')
            : t('Variant')}
          {t(' (optional)')}
        </span>
        <input
          aria-label={
            model
              ? t('Variant') + ': ' + (desktop ? t(modelLabel(model)) : modelLabel(model))
              : t('Variant')
          }
          value={modelVariantFor(draft, model, group)}
          placeholder={t('Variant or trim')}
          maxLength={200}
          autoComplete="off"
          onChange={(event) => onChange(setModelVariant(draft, model, event.target.value, group))}
          {...stylex.props(ui.input, s.variantInput)}
        />
      </label>
    );
  }

  return (
    <div
      data-showroom-model-options={desktop ? undefined : ''}
      data-desktop-model-options={desktop ? '' : undefined}
      {...stylex.props(desktop && s.desktopOptions)}
    >
      <div {...stylex.props(desktop ? s.desktopChoices : s.phoneChoices)}>
        {(!q || Boolean(make && onBack && !desktop)) && (
          <div {...stylex.props(s.group, desktop && ds.group)}>{modelChoice('')}</div>
        )}
        {visibleGroups.map((group) => {
          const key = modelNodeKey(group, groups);
          if (!group.children.length) {
            return (
              <div key={key} data-model-node={key} {...stylex.props(s.group, desktop && ds.group)}>
                <label
                  {...stylex.props(
                    s.choice,
                    desktop && ds.choice,
                    desktop && draft.selected.includes(key) && ds.selected,
                  )}
                >
                  <span {...stylex.props(s.name)}>{t(group.name)}</span>
                  <span {...stylex.props(s.checkTarget, desktop && ds.checkTarget)}>
                    <ModelCheckbox
                      name={t(group.name)}
                      modelKey={key}
                      checked={draft.selected.includes(key)}
                      desktop={desktop}
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
            <div key={key} data-model-node={key} {...stylex.props(s.group, desktop && ds.group)}>
              <div
                {...stylex.props(
                  s.familyRow,
                  desktop && ds.familyRow,
                  desktop && (checked || mixed) && ds.selected,
                )}
              >
                <button
                  type="button"
                  aria-label={t(show ? 'Collapse' : 'Expand') + ' ' + t(group.name)}
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
                  {...stylex.props(s.familyButton, desktop && ds.familyButton)}
                >
                  <span {...stylex.props(s.name, s.familyName)}>{t(group.name)}</span>
                  <span aria-hidden="true" {...stylex.props(s.chevron)}>
                    <Icon name={show ? 'up' : 'down'} size={18} />
                  </span>
                </button>
                <label {...stylex.props(s.checkTarget, desktop && ds.checkTarget)}>
                  <ModelCheckbox
                    name={t(group.name)}
                    modelKey={key}
                    checked={checked}
                    mixed={mixed}
                    desktop={desktop}
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
            {t('No models found')}
          </p>
        )}
      </div>
      <details
        open={optionsOpen}
        onToggle={(event) => setOptionsOpen(event.currentTarget.open)}
        {...stylex.props(s.options, desktop && s.desktopExtras, desktop && ds.extras)}
      >
        <summary {...stylex.props(s.summary, desktop && ds.summary)}>
          <span {...stylex.props(s.name)}>{t('More options')}</span>
          {activeOptions > 0 && (
            <span {...stylex.props(s.activeCount)}>
              {activeOptions} {t('active')}
            </span>
          )}
          <span aria-hidden="true" {...stylex.props(s.chevron)}>
            <Icon name={optionsOpen ? 'up' : 'down'} size={18} />
          </span>
        </summary>
        <div {...stylex.props(s.optionFields, desktop && ds.optionFields)}>
          <button
            type="button"
            role="switch"
            aria-label={t('Exclude make')}
            aria-checked={excluded}
            onClick={onToggleExcluded}
            {...stylex.props(s.excludeRow, desktop && ds.excludeRow)}
          >
            <span {...stylex.props(s.name)}>{t('Exclude this selection')}</span>
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
