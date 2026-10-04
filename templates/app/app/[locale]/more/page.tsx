'use client';

import * as stylex from '@stylexjs/stylex';
import {Check, ChevronRight} from 'lucide-react';
import Link from '@/components/AppLink';
import PageHeader from '@/components/PageHeader';
import DealerBrand from '@/components/DealerBrand';
import ShowroomIcon, {type ShowroomIconName} from '@/components/ShowroomIcon';
import {dealer} from '@/lib/dealer-config';
import {useCopy, useLocale} from '@/lib/locale';
import {browserPath} from '@/lib/paths';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

const languageNames = {en: 'English', bg: 'Български'};

export default function MorePage() {
  const tx = useCopy();
  const locale = useLocale();

  return <div data-menu-page {...stylex.props(s.screen)}>
    <PageHeader title="Menu" compact wrapTitle action={<span {...stylex.props(s.brand)}><DealerBrand compact/></span>}/>
    <main {...stylex.props(s.content)}>
      {showroom.menu.map((group, index) => <nav key={group.label} aria-labelledby={`menu-group-${index}`} {...stylex.props(s.section)}>
        <h2 id={`menu-group-${index}`} {...stylex.props(t.caption, s.sectionTitle)}>{tx(group.label)}</h2>
        <div {...stylex.props(s.list)}>
          {group.items.map(item => <MenuRow key={item.href} href={item.href} icon={item.icon} title={tx(item.label)}/>)}
          {group.contacts && dealer.phoneE164 ? <MenuRow href={'tel:' + dealer.phoneE164} icon="phone" title={dealer.phoneDisplay || dealer.phoneE164}/> : null}
          {group.contacts && dealer.email ? <MenuRow href={'mailto:' + dealer.email} icon="email" title={dealer.email}/> : null}
        </div>
      </nav>)}

      {dealer.enabledLocales.length > 1 ? <footer data-menu-language {...stylex.props(s.languageFooter)}>
        <div role="group" aria-label={tx('Language')} {...stylex.props(s.languages)}>
          <span data-menu-language-rail aria-hidden="true" {...stylex.props(s.languageRail)}/>
          {dealer.enabledLocales.map(language => <a key={language} href={browserPath('/more', language)} lang={language} hrefLang={language} aria-current={locale === language ? 'true' : undefined} {...stylex.props(s.language)}><span {...stylex.props(s.languageLabel, locale === language && s.languageSelected)}>{locale === language ? <Check size={12} aria-hidden="true"/> : null}{languageNames[language]}</span></a>)}
        </div>
      </footer> : null}
    </main>
  </div>;
}

function MenuRow({href, icon, title}: {href: string; icon: ShowroomIconName; title: string}) {
  return <Link href={href} {...stylex.props(t.input, s.row)}>
    <span {...stylex.props(s.icon)}><ShowroomIcon name={icon} size={20}/></span>
    <span {...stylex.props(s.label)}>{title}</span>
    <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.chevron)}/>
  </Link>;
}

const s = stylex.create({
  screen: {display: 'flex', flexDirection: 'column', minHeight: {[media.desktop]: 'calc(100svh - 73px)', default: 'calc(100svh - 80px - env(safe-area-inset-bottom))'}, maxWidth: 760, marginInline: 'auto', color: $.ink, backgroundColor: $.surface, fontFamily: $.fontSans},
  brand: {display: 'block', maxWidth: 128, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 600, letterSpacing: '-.025em'},
  content: {display: 'flex', flexDirection: 'column', flexGrow: 1, paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 8, paddingBottom: 12},
  section: {marginBottom: $.mobileSectionGap},
  sectionTitle: {margin: 0, paddingBottom: 8, paddingInline: 2, color: $.muted},
  list: {borderColor: $.line, borderStyle: 'solid', borderWidth: 1, borderRadius: $.radiusMd, overflow: 'hidden'},
  row: {display: 'grid', gridTemplateColumns: '32px minmax(0,1fr) 16px', alignItems: 'center', gap: 12, minHeight: 56, paddingBlock: 10, paddingInline: 12, color: $.ink, textAlign: 'left', borderBottomWidth: {default: 1, ':last-child': 0}, borderBottomStyle: 'solid', borderBottomColor: '#ededf0', backgroundColor: {default: $.surface, ':hover': $.surfaceAlt, ':active': $.rail}, outlineOffset: -3, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  icon: {display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 10, backgroundColor: $.surfaceAlt},
  label: {minWidth: 0, overflowWrap: 'anywhere'},
  chevron: {color: $.subtle},
  languageFooter: {display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: 'auto', paddingTop: 24},
  languages: {position: 'relative', display: 'flex', maxWidth: '100%', paddingInline: 2},
  languageRail: {position: 'absolute', top: '50%', left: 0, right: 0, height: 36, transform: 'translateY(-50%)', borderRadius: 20, backgroundColor: $.surfaceAlt, pointerEvents: 'none'},
  language: {position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingInline: 2, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px', borderRadius: 20, outlineOffset: -2, outlineWidth: 2, outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineColor: $.ink},
  languageLabel: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 32, paddingInline: 10, borderRadius: 18, backgroundColor: {default: 'transparent', ':hover': $.rail}},
  languageSelected: {color: $.surface, backgroundColor: {default: $.ink, ':hover': $.violetDark}},
});
