'use client';

import {useId} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Check, ChevronRight} from 'lucide-react';
import Link from '@/components/AppLink';
import ShowroomIcon, {type ShowroomIconName} from '@/components/ShowroomIcon';
import {dealer} from '@/lib/dealer-config';
import {useCopy, useLocale} from '@/lib/locale';
import {browserPath} from '@/lib/paths';
import {homeAlternativeHref, useHomeAlternative} from '@/lib/home-alternative';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

const languageNames = {en: 'English', bg: 'Български'};

/** Shared destinations and language controls for the phone page and header disclosure. */
export default function ShowroomMenu({compact = false, languagePath = '/more', onNavigate}: {compact?: boolean; languagePath?: string; onNavigate?: () => void}) {
  const tx = useCopy(), locale = useLocale(), alternative = useHomeAlternative();
  const id = useId();
  return <>
    {showroom.menu.map((group, index) => <nav key={group.label} aria-labelledby={`${id}-group-${index}`} {...stylex.props(s.section, compact && s.compactSection)}>
      <h2 id={`${id}-group-${index}`} {...stylex.props(t.caption, s.sectionTitle, compact && s.compactTitle)}>{tx(group.label)}</h2>
      <div {...stylex.props(s.list, compact && s.compactList)}>
        {group.items.map(item => <MenuRow key={item.href} href={item.href} icon={item.icon} title={tx(item.label)} compact={compact} onNavigate={onNavigate}/>)}
        {group.contacts && dealer.phoneE164 ? <MenuRow href={'tel:' + dealer.phoneE164} icon="phone" title={dealer.phoneDisplay || dealer.phoneE164} compact={compact} onNavigate={onNavigate}/> : null}
        {group.contacts && dealer.email ? <MenuRow href={'mailto:' + dealer.email} icon="email" title={dealer.email} compact={compact} onNavigate={onNavigate}/> : null}
      </div>
    </nav>)}
    {dealer.enabledLocales.length > 1 ? <footer data-menu-language {...stylex.props(compact ? s.compactFooter : s.languageFooter)}>
      <div role="group" aria-label={tx('Language')} {...stylex.props(s.languages)}>
        <span data-menu-language-rail aria-hidden="true" {...stylex.props(s.languageRail, compact && s.compactLanguageRail)}/>
        {dealer.enabledLocales.map(language => <a key={language} href={browserPath(homeAlternativeHref(languagePath, alternative), language)} lang={language} hrefLang={language} aria-current={locale === language ? 'true' : undefined} onClick={onNavigate} {...stylex.props(s.language)}><span {...stylex.props(s.languageLabel, locale === language && s.languageSelected)}>{locale === language ? <Check size={12} aria-hidden="true"/> : null}{languageNames[language]}</span></a>)}
      </div>
    </footer> : null}
  </>;
}

function MenuRow({href, icon, title, compact, onNavigate}: {href: string; icon: ShowroomIconName; title: string; compact: boolean; onNavigate?: () => void}) {
  return <Link href={href} onClick={onNavigate} {...stylex.props(t.input, s.row, compact && s.compactRow)}>
    <span {...stylex.props(s.icon, compact && s.compactIcon)}><ShowroomIcon name={icon} size={compact ? 18 : 20}/></span>
    <span {...stylex.props(s.label)}>{title}</span>
    <ChevronRight size={compact ? 14 : 16} aria-hidden="true" {...stylex.props(s.chevron)}/>
  </Link>;
}

const s = stylex.create({
  section: {marginBottom: $.mobileSectionGap},
  sectionTitle: {margin: 0, paddingBottom: 8, paddingInline: 2, color: $.muted},
  list: {display: {[media.mobile]: 'flex', default: 'block'}, flexDirection: 'column', gap: 0, padding: 0, backgroundColor: {[media.mobile]: $.surface, default: 'transparent'}, borderColor: {[media.mobile]: $.surfaceBorder, default: $.line}, borderStyle: 'solid', borderWidth: 1, borderRadius: $.radiusMd, overflow: 'hidden'},
  row: {display: 'grid', gridTemplateColumns: '32px minmax(0,1fr) 16px', alignItems: 'center', gap: 12, minHeight: 56, paddingBlock: 10, paddingInline: 12, color: $.ink, textAlign: 'left',
    borderRadius: 0, borderBottomWidth: {[media.mobile]: {default: 1, ':last-child': 0}, default: 0}, borderBottomStyle: 'solid', borderBottomColor: $.line, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt, ':active': {default: $.rail, [media.mobile]: $.line}},
    outlineOffset: -3, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  icon: {display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 10, backgroundColor: {[media.mobile]: 'transparent', default: $.surfaceAlt}},
  label: {minWidth: 0, overflowWrap: 'anywhere'},
  chevron: {color: $.subtle},
  languageFooter: {display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: {[media.desktop]: 0, default: 'auto'}, paddingTop: {[media.desktop]: 8, default: 24}},
  languages: {position: 'relative', display: 'flex', maxWidth: '100%', paddingInline: 2},
  languageRail: {position: 'absolute', top: '50%', left: 0, right: 0, height: 36, transform: 'translateY(-50%)', borderRadius: 20, backgroundColor: $.surfaceAlt, pointerEvents: 'none'},
  language: {position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingInline: 2, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px', borderRadius: 20, outlineOffset: -2, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  languageLabel: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 32, paddingInline: 10, borderRadius: 18, backgroundColor: {default: 'transparent', ':hover': $.rail}},
  languageSelected: {color: $.surface, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
  compactSection: {marginBottom: 12, paddingBottom: 0},
  compactTitle: {paddingInline: 10, paddingBottom: 4, fontSize: 12, fontWeight: 500, lineHeight: '18px'},
  compactList: {display: 'flex', flexDirection: 'column', gap: 4, borderWidth: 0, borderRadius: 0},
  compactRow: {gridTemplateColumns: '28px minmax(0,1fr) 14px', gap: 10, minHeight: 44, paddingBlock: 8, paddingInline: 10, fontSize: 14, lineHeight: '20px', borderRadius: 8, borderBottomWidth: 0, backgroundColor: {default: $.surfaceAlt, ':hover': $.line, ':active': $.line}},
  compactIcon: {width: 28, height: 28, backgroundColor: 'transparent'},
  compactFooter: {display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: 0, paddingTop: 0},
  compactLanguageRail: {backgroundColor: $.surfaceAlt},
});
