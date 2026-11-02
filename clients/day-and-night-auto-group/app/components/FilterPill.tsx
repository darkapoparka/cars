'use client';

import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import Link from '@/components/AppLink';
import IconButton from '@/components/IconButton';
import {ArrowUpDown, ChevronDown, SlidersHorizontal} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {pillStyles as pill} from '@/components/pill.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

type Props = {
  label: string;
  mobileLabel?: string;
  icon?: 'filter' | 'sort' | 'chevron';
  count?: number;
  truncate?: boolean;
  mutedLabel?: boolean;
  flagSrc?: string;
  selected?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  inventoryAction?: 'filter' | 'sort';
  compact?: boolean;
  field?: boolean;
  compactRow?: boolean;
  iconOnly?: boolean;
  whiteOnMobile?: boolean;
  ariaLabel?: string;
  tone?: 'default' | 'soft' | 'grey' | 'white';
  onDark?: boolean;
} & ({href: string; onClick?: never} | {href?: never; onClick: () => void});

/** One compact treatment for drawer actions and inline quick filters. */
export default function FilterPill({label, mobileLabel, icon, count, truncate = false, mutedLabel = false, flagSrc, selected = false, pressed, expanded, inventoryAction, compact = false, field = false, compactRow = false, iconOnly = false, whiteOnMobile = false, ariaLabel, tone = 'default', onDark = false, href, onClick}: Props) {
  const tx = useCopy();
  const rowAction = compactRow && (icon === 'filter' || icon === 'sort');
  const accessibleLabel = ariaLabel ?? (count ? `${tx(label)}: ${count}` : mobileLabel ? `${tx(label)}: ${tx(mobileLabel)}` : selected ? `${tx(label)}: ${tx('Applied')}` : tx(label));
  if (iconOnly) {
    const actionIcon = icon === 'sort' ? ArrowUpDown : icon === 'chevron' ? ChevronDown : SlidersHorizontal;
    const common = {icon: actionIcon, label: accessibleLabel, tone: tone === 'grey' ? 'grey' as const : 'neutral' as const, selected: pressed ?? selected, count, expanded, pressed, hasPopup: pressed === undefined ? 'dialog' as const : undefined, dataAttributes: {'data-inventory-filter-action': inventoryAction === 'filter' || undefined, 'data-inventory-sort-action': inventoryAction === 'sort' || undefined}};
    return href !== undefined ? <IconButton href={href} {...common}/> : <IconButton onClick={() => onClick?.()} {...common}/>;
  }
  const actionIconSize = rowAction ? 18 : 16;
  const labelContent = mobileLabel ? <><span {...stylex.props(s.wideLabel, truncate && s.truncatedLabel)}>{tx(label)}</span><span {...stylex.props(s.mobileLabel, truncate && s.truncatedLabel)}>{tx(mobileLabel)}</span></> : <span {...stylex.props(truncate && s.truncatedLabel)}>{tx(label)}</span>;

  const content = <span {...stylex.props(pill.surface, tone !== 'default' && pill.soft, tone === 'grey' && pill.grey, tone === 'white' && pill.white, compact && pill.compactSurface, field && pill.fieldSurface, truncate && s.constrainedSurface, mutedLabel && s.mutedLabel, rowAction && s.rowActionSurface, whiteOnMobile && !(pressed ?? selected) && s.whiteOnMobile, (pressed ?? selected) && pill.selected, onDark && pill.onDark, onDark && (pressed ?? selected) && pill.selectedOnDark)}>
    {flagSrc ? <img src={assetPath(flagSrc)} width={20} height={15} alt="" aria-hidden="true" draggable={false} {...stylex.props(s.flag)}/> : null}
    {icon === 'filter' ? <SlidersHorizontal size={actionIconSize} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : icon === 'sort' ? <ArrowUpDown size={actionIconSize} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
    {rowAction ? <span {...stylex.props(s.rowActionLabel)}>{labelContent}</span> : labelContent}
    {count ? <span aria-hidden="true" {...stylex.props(s.count, rowAction && s.rowActionCount)}>{count}</span> : null}
    {icon === 'chevron' ? <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)}/> : null}
  </span>;
  const props = stylex.props(pill.control, truncate && s.constrainedControl, rowAction && s.rowActionControl, (pressed ?? selected) && pill.selectedControl, onDark && pill.controlOnDark);
  return href
    ? <Link href={href} aria-label={accessibleLabel} {...props}>{content}</Link>
    : <button type="button" onClick={onClick} aria-label={accessibleLabel} aria-pressed={pressed} aria-expanded={expanded} aria-haspopup={pressed === undefined ? 'dialog' : undefined} data-inventory-filter-action={inventoryAction === 'filter' || undefined} data-inventory-sort-action={inventoryAction === 'sort' || undefined} {...props}>{content}</button>;
}

const s = stylex.create({
  mutedLabel: {color: $.muted},
  whiteOnMobile: {backgroundColor: {[media.mobile]: {default: $.surface, ':hover': $.surface}, default: $.surfaceAlt, ':hover': $.line}},
  constrainedControl: {minWidth: 0, width: '100%', textAlign: 'left'},
  constrainedSurface: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: {[media.mobile]: $.controlActionGap, default: $.controlActionGap}, minWidth: 0, width: '100%', paddingInline: 12, textAlign: 'left'},
  truncatedLabel: {flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: $.controlLineHeight},
  count: {minWidth: 16, fontSize: 12, fontWeight: 600, textAlign: 'center'},
  wideLabel: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileLabel: {display: {[media.mobile]: 'inline', default: 'none'}},
  icon: {flexShrink: 0},
  rowActionControl: {width: {default: 'auto', '@media (max-width: 479px)': 44}},
  rowActionSurface: {position: 'relative', width: {default: 'auto', '@media (max-width: 479px)': 36}, paddingInline: {default: 8, '@media (max-width: 479px)': 0}, gap: {default: 6, '@media (max-width: 479px)': 0}},
  rowActionLabel: {display: {default: 'contents', '@media (max-width: 479px)': 'none'}},
  rowActionCount: {position: {default: 'static', '@media (max-width: 479px)': 'absolute'}, top: {default: 'auto', '@media (max-width: 479px)': -3}, right: {default: 'auto', '@media (max-width: 479px)': -3}, width: {default: 'auto', '@media (max-width: 479px)': 16}, height: {default: 'auto', '@media (max-width: 479px)': 16}, color: {default: 'inherit', '@media (max-width: 479px)': $.ink}, fontSize: {default: 12, '@media (max-width: 479px)': 10}, lineHeight: {default: 'inherit', '@media (max-width: 479px)': '14px'}, borderWidth: {default: 0, '@media (max-width: 479px)': 1}, borderStyle: 'solid', borderColor: $.ink, borderRadius: 9999, backgroundColor: {default: 'transparent', '@media (max-width: 479px)': $.surface}},
  flag: {display: 'block', flexShrink: 0, width: 20, height: 15, objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,.08)'},
});
