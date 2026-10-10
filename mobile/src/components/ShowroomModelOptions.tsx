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
  dropdown = false,
  modelBrowser = false,
  hideOptions = false,
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
  dropdown?: boolean;
  modelBrowser?: boolean;
  hideOptions?: boolean;
  onChange: (draft: ModelDraft) => void;
  onRemoveMake?: () => void;
  onBack?: () => void;
  onToggleFamily: (name: string) => void;
  onToggleExcluded: () => void;
}) {
  const { t } = useLocale();
  const compact = desktop && (dropdown || modelBrowser);
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
    const copy = <span {...stylex.props(s.name)}>{name || make || t('Any model')}</span>;
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
        <div {...stylex.props(s.familyRow)}>
          <button
            type="button"
            aria-label={t('Back') + ': ' + t('Makes')}
            onClick={onBack}
            {...stylex.props(s.familyButton)}
          >
            <Icon name="back" size={20} />
            {copy}
          </button>
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
          compact && ds.dropdownRow,
          compact && parent && ds.dropdownChild,
        )}
      >
        {copy}
        <span
          {...stylex.props(
            s.checkTarget,
            desktop && ds.checkTarget,
            compact && ds.dropdownRow,
            compact && parent && ds.dropdownChild,
          )}
        >
          {checkbox}
        </span>
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
          {...stylex.props(ui.input, s.variantInput, compact && ds.dropdownVariant)}
        />
      </label>
    );
  }

  const optionFields = (
    <div
      {...stylex.props(
        s.optionFields,
        desktop && ds.optionFields,
        compact && ds.dropdownFields,
        modelBrowser && ds.browserFields,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-label={t('Exclude make')}
        aria-checked={excluded}
        onClick={onToggleExcluded}
        {...stylex.props(
          s.excludeRow,
          desktop && ds.excludeRow,
          compact && ds.dropdownExclude,
          modelBrowser && ds.browserExclude,
        )}
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
  );

  return (
    <div
      data-showroom-model-options={desktop ? undefined : ''}
      data-desktop-model-options={desktop ? '' : undefined}
      {...stylex.props(desktop && s.desktopOptions, compact && ds.dropdownOptions)}
    >
      <div
        {...stylex.props(
          desktop ? s.desktopChoices : s.phoneChoices,
          compact && ds.dropdownChoices,
          modelBrowser && ds.browserChoices,
        )}
      >
        {(!q || Boolean(make && onBack && !desktop)) && (
          <div {...stylex.props(s.group, desktop && ds.group, compact && ds.dropdownGroup)}>
            {modelChoice('')}
          </div>
        )}
        {visibleGroups.map((group) => {
          const key = modelNodeKey(group, groups);
          if (!group.children.length) {
            return (
              <div
                key={key}
                data-model-node={key}
                {...stylex.props(s.group, desktop && ds.group, compact && ds.dropdownGroup)}
              >
                <label
                  {...stylex.props(
                    s.choice,
                    desktop && ds.choice,
                    desktop && draft.selected.includes(key) && ds.selected,
                    compact && ds.dropdownRow,
                  )}
                >
                  <span {...stylex.props(s.name)}>{t(group.name)}</span>
                  <span
                    {...stylex.props(
                      s.checkTarget,
                      desktop && ds.checkTarget,
                      compact && ds.dropdownRow,
                    )}
                  >
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
            <div
              key={key}
              data-model-node={key}
              {...stylex.props(
                s.group,
                desktop && ds.group,
                compact && ds.dropdownGroup,
                compact && show && ds.dropdownExpandedGroup,
              )}
            >
              <div
                {...stylex.props(
                  s.familyRow,
                  desktop && ds.familyRow,
                  desktop && (checked || mixed) && ds.selected,
                  compact && ds.dropdownRow,
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
                  {...stylex.props(
                    s.familyButton,
                    desktop && ds.familyButton,
                    compact && ds.dropdownRow,
                  )}
                >
                  <span {...stylex.props(s.name, s.familyName)}>{t(group.name)}</span>
                  <span aria-hidden="true" {...stylex.props(s.chevron)}>
                    <Icon name={show ? 'up' : 'down'} size={18} />
                  </span>
                </button>
                <label
                  {...stylex.props(
                    s.checkTarget,
                    desktop && ds.checkTarget,
                    compact && ds.dropdownRow,
                  )}
                >
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
              <div
                id={childrenId}
                hidden={!show}
                {...stylex.props(s.children, compact && show && ds.dropdownChildren)}
              >
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
          <p role="status" {...stylex.props(s.empty, compact && ds.dropdownEmpty)}>
            {t('No models found')}
          </p>
        )}
      </div>
      {!hideOptions &&
        (modelBrowser ? (
          optionFields
        ) : (
          <details
            open={optionsOpen}
            onToggle={(event) => setOptionsOpen(event.currentTarget.open)}
            {...stylex.props(
              s.options,
              desktop && s.desktopExtras,
              desktop && ds.extras,
              compact && ds.dropdownExtras,
            )}
          >
            <summary
              {...stylex.props(s.summary, desktop && ds.summary, compact && ds.dropdownSummary)}
            >
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
            {optionFields}
          </details>
        ))}
    </div>
  );
}
