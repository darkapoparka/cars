'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  clearShowroomQuickFilter,
  type ShowroomFilterTab,
  type ShowroomMoreSection,
} from '@/lib/showroom-filter-editor';
import {
  clearMakeSelections,
  clearModelSelections,
  excludedMakeNames,
  makeSelectionSummary,
} from '@/lib/make-selection';
import { useLocale } from '@/lib/use-locale';
import {
  desktopFilterSections,
  ShowroomDesktopFilterFields,
  type DesktopFilterFieldsProps,
} from './ShowroomDesktopFilterFields';
import { ShowroomDesktopFilterDialog } from './ShowroomDesktopFilterDialog';
import { Icon } from './Icon';
import { desktopFilterStyles as s } from './showroom-desktop-filters.stylex';

type Props = DesktopFilterFieldsProps & {
  sheet: ShowroomFilterTab;
  moreSection: ShowroomMoreSection | null;
  presentation: 'sheet' | 'quick' | 'all';
  makeView: 'make' | 'model';
  anchor?: HTMLElement;
  keyboardOpening?: boolean;
  onReset: () => void;
};

export function ShowroomDesktopFilters({
  sheet,
  moreSection,
  presentation,
  makeView,
  anchor,
  keyboardOpening,
  onReset,
  ...fields
}: Props) {
  const { t } = useLocale();
  const [editingMake, setEditingMake] = useState<'make' | 'model' | null>(null);
  const all = presentation === 'all' && !editingMake;
  const requestedSection =
    editingMake ||
    (sheet === 'make' ? makeView : sheet === 'more' ? moreSection || 'mileage' : sheet);
  const section =
    requestedSection === 'model' && fields.draft.category !== 'car' ? 'make' : requestedSection;
  const title = all
    ? 'All filters'
    : section === 'model'
      ? 'Model'
      : section === 'make' && fields.draft.category === 'car'
        ? 'Make'
        : desktopFilterSections.find(({ key }) => key === section)!.label;
  const dropdown = presentation !== 'all';
  const picker = !all && ['make', 'model'].includes(section) && fields.draft.category === 'car';
  const excluded = excludedMakeNames(fields.draft);
  const modelReady = Boolean(fields.draft.makes.length || excluded.length);
  const makeSummary =
    [...fields.draft.makes, ...excluded.map((name) => t('Excluded') + ': ' + name)].join(', ') ||
    t('All makes');
  const modelSummary =
    fields.draft.makes
      .map((name) => {
        const summary = makeSelectionSummary(fields.draft, name);
        return (
          (fields.draft.makes.length > 1 ? name + ' · ' : '') +
          t(summary === 'Any' ? 'All models' : summary)
        );
      })
      .join(', ') || t(modelReady ? 'All models' : 'Choose a make first');

  function reset() {
    if (all) onReset();
    else if (section === 'make') fields.onChange(clearMakeSelections());
    else if (section === 'model') fields.onChange(clearModelSelections(fields.draft));
    else {
      fields.onChange(
        clearShowroomQuickFilter(fields.draft, section === 'transmission' ? 'gearbox' : section),
      );
    }
  }

  return (
    <ShowroomDesktopFilterDialog
      title={title}
      section={all ? 'all' : section}
      category={fields.draft.category}
      count={fields.matches.length}
      dropdown={dropdown}
      narrow={['fuel', 'transmission', 'body', 'condition'].includes(section)}
      fullHeight={all || section === 'model' || (section === 'make' && !picker)}
      picker={picker}
      anchor={anchor}
      keyboardOpening={keyboardOpening}
      anchorSelector={
        presentation === 'quick'
          ? `[data-quick-filter="${section === 'transmission' ? 'gearbox' : section}"]`
          : `[data-desktop-hero-filter="${section}"]`
      }
      onBack={editingMake ? () => setEditingMake(null) : undefined}
      onReset={reset}
      onApply={fields.onApply}
      onClose={fields.onClose}
      onDismiss={fields.onDismiss || fields.onClose}
    >
      {all ? (
        <div {...stylex.props(s.overview)}>
          <div {...stylex.props(s.overviewLead)}>
            <section aria-label={t('Search')} {...stylex.props(s.fieldGroup)}>
              <h3 {...stylex.props(s.fieldTitle)}>{t('Search')}</h3>
              <ShowroomDesktopFilterFields {...fields} section="search" compact />
            </section>
            <div
              {...stylex.props(
                s.makeModelSummary,
                fields.draft.category !== 'car' && s.singleSummary,
              )}
            >
              <button
                type="button"
                data-desktop-picker-open="make"
                onClick={() => setEditingMake('make')}
                {...stylex.props(s.makeSummary)}
              >
                <span {...stylex.props(s.makeSummaryCopy)}>
                  <span {...stylex.props(s.fieldTitle)}>
                    {t(fields.draft.category === 'car' ? 'Make' : 'Make & model')}
                  </span>
                  <span {...stylex.props(s.copy)}>{makeSummary}</span>
                </span>
                <Icon name="right" size={18} />
              </button>
              {fields.draft.category === 'car' && (
                <button
                  type="button"
                  data-desktop-picker-open="model"
                  disabled={!modelReady}
                  onClick={() => setEditingMake('model')}
                  {...stylex.props(s.makeSummary, !modelReady && s.disabledSummary)}
                >
                  <span {...stylex.props(s.makeSummaryCopy)}>
                    <span {...stylex.props(s.fieldTitle)}>{t('Model')}</span>
                    <span {...stylex.props(s.copy)}>{modelSummary}</span>
                  </span>
                  <Icon name="right" size={18} />
                </button>
              )}
            </div>
          </div>
          <div {...stylex.props(s.overviewGrid)}>
            {desktopFilterSections
              .filter(({ key }) => key !== 'make' && key !== 'search')
              .map(({ key, label }) => (
                <section key={key} aria-label={t(label)} {...stylex.props(s.fieldGroup)}>
                  <h3 {...stylex.props(s.fieldTitle)}>{t(label)}</h3>
                  <ShowroomDesktopFilterFields {...fields} section={key} compact />
                </section>
              ))}
          </div>
        </div>
      ) : (
        <ShowroomDesktopFilterFields {...fields} section={section} dropdown={dropdown} />
      )}
    </ShowroomDesktopFilterDialog>
  );
}
