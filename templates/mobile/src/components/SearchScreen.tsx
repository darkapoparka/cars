'use client';
import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { excludedMakeNames } from '@/lib/make-selection';
import { SelectedMakeList } from './SelectedMakeList';
import { topMakes, vehicles } from '@/lib/catalog';
import { filterVehicles, serializeFilters } from '@/lib/search';
import { switchVehicleCategory, updateFilters, useAppState } from '@/lib/store';
import type { VehicleCategory } from '@/lib/types';
import { Icon, type IconName } from './Icon';
import { Button, IconButton, Modal, ui } from './ui';
import { BrandLogo, MakePicker } from './MakePicker';
import { ConditionFields, FinancialFields, LocationFields, TechnicalFields } from './FilterFields';
import { CategoryTypes, ElectricBikeTechnical, TruckChooser } from './CategoryFields';
import { CategoryMakePicker } from './CategoryMakePicker';
import { ResetSearchDialog } from './ResetSearchDialog';
import { categoryTopMakes, categoryBrandImages } from '@/lib/categories';
const s = stylex.create({
  searchbar: {
    height: 60,
    paddingBottom: 4,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 0,
    gap: 8,
    backgroundColor: colors.background,
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  query: {
    height: 56,
    borderRadius: 30,
    backgroundColor: colors.surface,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingInline: 16,
    flex: '1',
    minWidth: 0,
    textDecoration: 'none',
    color: colors.muted,
    fontSize: 16,
  },
  queryInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    outlineOffset: 2,
    width: '100%',
    color: colors.text,
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5,1fr)',
    height: 48,
    backgroundColor: colors.background,
    position: 'sticky',
    top: 60,
    zIndex: 29,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  category: {
    position: 'relative',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.muted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    color: colors.accent,
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 2,
      right: 2,
      height: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: colors.accent,
    },
  },
  groups: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 88,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  group: { borderRadius: 20, backgroundColor: colors.surface, overflow: 'hidden' },
  expanded: { backgroundColor: colors.panel, boxShadow: '0 3px 8px #0004' },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 64.667,
    lineHeight: '20px',
    padding: 12,
    paddingRight: 18,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    color: colors.text,
  },
  iconBox: {
    overflow: 'hidden',
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.iconBg,
    color: colors.muted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  groupTitle: { fontSize: 14, lineHeight: '20px', fontWeight: 700 },
  expandedTitle: { fontFamily: 'var(--font-base)', fontSize: 20, lineHeight: '28px' },
  summary: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  selectedBrandIcon: { backgroundColor: colors.background, boxShadow: '0 2px 5px #0003' },
  selectedBrandSummary: {
    display: 'inline-block',
    paddingInline: 8,
    borderRadius: 4,
    backgroundColor: colors.iconBg,
    color: colors.text,
  },
  groupBody: { padding: 24, paddingTop: 16 },
  brands: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
    gap: 12,
    marginBottom: 24,
  },
  brand: {
    borderWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    aspectRatio: '1',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImage: { width: '100%', height: '100%', objectFit: 'contain' },
  footer: {
    position: 'fixed',
    bottom: 64,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 1100,
    padding: 16,
    paddingBlock: 8,
    display: 'grid',
    gridTemplateColumns: '44% minmax(0,1fr)',
    gap: 12,
    backgroundColor: colors.background,
    zIndex: 35,
  },
});
function Group({
  title,
  summary,
  icon,
  open,
  onToggle,
  children,
  selectedMake,
}: {
  title: string;
  summary: string;
  icon: IconName;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  selectedMake?: string;
}) {
  return (
    <section {...stylex.props(s.group, open && s.expanded)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        {...stylex.props(s.groupHeader)}
      >
        <span {...stylex.props(s.iconBox, !open && Boolean(selectedMake) && s.selectedBrandIcon)}>
          {!open && selectedMake ? (
            <BrandLogo make={selectedMake} size={24} />
          ) : ['building', 'calendar', 'euro', 'wrench', 'pin'].includes(icon) ? (
            <Image src={'/images/group-' + icon + '.webp'} width={40} height={40} alt="" />
          ) : (
            <Icon name={icon} size={25} />
          )}
        </span>
        <span {...stylex.props(ui.grow)}>
          <span {...stylex.props(s.groupTitle, open && s.expandedTitle)}>{title}</span>
          {!open && (
            <span {...stylex.props(s.summary)}>
              <br />
              <span {...stylex.props(Boolean(selectedMake) && s.selectedBrandSummary)}>
                {summary}
              </span>
            </span>
          )}
        </span>
        <span {...stylex.props(ui.muted)}>
          <Icon name={open ? 'up' : 'down'} size={26} />
        </span>
      </button>
      {open && <div {...stylex.props(s.groupBody)}>{children}</div>}
    </section>
  );
}
export function SearchScreen() {
  const { filters: f } = useAppState();
  const [open, setOpen] = useState<string[]>(['Make & model']);
  const [picker, setPicker] = useState<string | null>(null);
  const [pickerExclude, setPickerExclude] = useState(false);
  function showPicker(make: string, excluded = false) {
    setPickerExclude(excluded);
    setPicker(make);
  }
  const [voice, setVoice] = useState(false);
  const [reset, setReset] = useState(false);
  const truckType = f.details.find((value) => value.startsWith('truckCategory='))?.slice(14) || '';
  const truckChooser = f.category === 'truck' && !truckType;
  const brands = f.category === 'car' ? topMakes : categoryTopMakes[f.category] || [];
  const count = filterVehicles(vehicles, f).length;
  const props = (title: string, summary: string, icon: IconName) => ({
    title,
    summary,
    icon,
    open: open.includes(title),
    onToggle: () => setOpen(open.includes(title) ? [] : [title]),
  });
  const categories: [VehicleCategory, IconName, string][] = [
    ['car', 'car', 'Car search'],
    ['bike', 'bike', 'Motorbike search'],
    ['electric-bike', 'electric', 'E-Bike search'],
    ['motorhome', 'motorhome', 'Motorhome search'],
    ['truck', 'truck', 'Search Trucks and more'],
  ];
  return (
    <>
      <div {...stylex.props(s.searchbar)}>
        <div {...stylex.props(s.query)}>
          <Icon name="smartSearch" size={24} />
          <input
            value={f.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            placeholder="Search Anything"
            aria-label="Search Anything"
            {...stylex.props(s.queryInput)}
          />
          <button
            type="button"
            aria-label="Voice input"
            onClick={() => setVoice(true)}
            {...stylex.props(s.category)}
          >
            <Icon name="mic" size={23} />
          </button>
        </div>
        <IconButton icon="reset" label="Reset filters" onClick={() => setReset(true)} />
      </div>
      <div {...stylex.props(s.categories)} role="tablist" aria-label="Vehicle category">
        {categories.map(([category, icon, label]) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={f.category === category}
            aria-label={category === 'truck' && truckType ? truckType : label}
            onClick={() => {
              switchVehicleCategory(category);
              setOpen(['Make & model']);
              window.scrollTo(0, 0);
            }}
            {...stylex.props(s.category, f.category === category && s.active)}
          >
            <Icon name={icon} size={40} />
          </button>
        ))}
      </div>
      {truckChooser ? (
        <TruckChooser filters={f} />
      ) : (
        <div {...stylex.props(s.groups)}>
          <Group
            {...props('Make & model', f.makes.join(', ') || 'Any', 'building')}
            selectedMake={f.category === 'car' ? f.makes[0] : undefined}
          >
            {f.makes.length || excludedMakeNames(f).length ? (
              <>
                <SelectedMakeList filters={f} onEdit={showPicker} />
                <Button variant="outline" block onClick={() => showPicker('')}>
                  + Select Make / Model
                </Button>
              </>
            ) : (
              <>
                {(brands.length > 0 || f.category === 'truck') && (
                  <div {...stylex.props(s.brands)}>
                    {brands.map((make) => (
                      <button
                        key={make}
                        type="button"
                        aria-label={make}
                        onClick={() => showPicker(make)}
                        {...stylex.props(s.brand)}
                      >
                        <Image
                          src={
                            categoryBrandImages[f.category]?.[make] ||
                            '/images/brand-' + make.toLowerCase() + '.webp'
                          }
                          width={78}
                          height={78}
                          alt=""
                          {...stylex.props(s.brandImage)}
                        />
                      </button>
                    ))}
                  </div>
                )}
                <Button variant="outline" block onClick={() => showPicker('')}>
                  All Makes
                </Button>
              </>
            )}
          </Group>
          {f.category !== 'car' && (
            <Group
              {...props(
                'Vehicle type',
                f.body.join(', ') || 'Any',
                f.category === 'bike'
                  ? 'helmet'
                  : f.category === 'electric-bike'
                    ? 'bicycle'
                    : f.category === 'motorhome'
                      ? 'umbrella'
                      : 'category',
              )}
            >
              <CategoryTypes filters={f} />
            </Group>
          )}
          {f.category !== 'electric-bike' && (
            <Group
              {...props(
                'Condition',
                [f.minYear && 'From ' + f.minYear, f.maxMileage && 'Up to ' + f.maxMileage + ' km']
                  .filter(Boolean)
                  .join(', ') || 'First registration, Mileage',
                'calendar',
              )}
            >
              <ConditionFields filters={f} />
            </Group>
          )}
          <Group
            {...props(
              'Financial',
              f.maxPrice ? 'Up to €' + f.maxPrice : 'Price, Leasing rate, Deal',
              'euro',
            )}
          >
            <FinancialFields filters={f} />
          </Group>
          <Group
            {...props(
              'Technical data',
              f.category === 'electric-bike'
                ? 'Frame size, Gears, Battery'
                : [...f.transmission, ...f.fuel].join(', ') || 'Transmission, Fuel type, Power',
              'wrench',
            )}
          >
            {f.category === 'electric-bike' ? (
              <ElectricBikeTechnical filters={f} />
            ) : (
              <TechnicalFields filters={f} />
            )}
          </Group>
          <Group {...props('Location', f.location || 'Anywhere', 'pin')}>
            <LocationFields filters={f} />
          </Group>
          <p {...stylex.props(ui.small, ui.muted)}>
            Searching captured reference vehicles. Live inventory is not connected.
          </p>
        </div>
      )}
      {!truckChooser && (
        <div {...stylex.props(s.footer)}>
          <Button href="/search/filters" variant="outline" icon="filter">
            More filters
          </Button>
          <Button href={'/results?' + serializeFilters(f)} icon="search">
            {count.toLocaleString('en-GB')}
            {count === 1 ? ' Offer' : ' Offers'}
          </Button>
        </div>
      )}
      {picker !== null &&
        (f.category === 'car' ? (
          <MakePicker
            key={picker + pickerExclude}
            open
            initialMake={picker}
            initialExclude={pickerExclude}
            onClose={() => setPicker(null)}
          />
        ) : (
          <CategoryMakePicker
            key={picker + pickerExclude}
            initialMake={picker}
            initialExclude={pickerExclude}
            onClose={() => setPicker(null)}
          />
        ))}
      <ResetSearchDialog
        open={reset}
        onClose={() => setReset(false)}
        onReset={() => setOpen(['Make & model'])}
      />
      <Modal open={voice} onClose={() => setVoice(false)} title="Search Anything">
        <div {...stylex.props(ui.column)}>
          <p>
            Type a make, model or fuel type in the search field. Voice recognition is not connected
            in this browser reference.
          </p>
          <Button href="/assistant" variant="purple">
            Open AI Assistant
          </Button>
          <Button variant="ghost" onClick={() => setVoice(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
