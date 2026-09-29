'use client';

import * as stylex from '@stylexjs/stylex';
import {ChevronRight} from 'lucide-react';
import Link from '@/components/AppLink';
import PageHeader from '@/components/PageHeader';
import DealerBrand from '@/components/DealerBrand';
import ShowroomIcon, {type ShowroomIconName} from '@/components/ShowroomIcon';
import {dealer} from '@/lib/dealer-config';
import {useCopy, useLocale} from '@/lib/locale';
import {browserPath} from '@/lib/paths';
import {showroom} from '@/lib/showroom';
import {showroomLocation} from '@/lib/showroom-location';
import {tokens as $} from '@/app/tokens.stylex';

const languageNames = {en: 'English', bg: 'Български'};

export default function MorePage() {
  const tx = useCopy();
  const locale = useLocale();
  const location = dealer.address.trim() || dealer.city.trim() ? showroomLocation(locale, true) : tx('Plan your visit');

  return <div {...stylex.props(s.screen)}>
    <PageHeader title="Menu" action={<span {...stylex.props(s.brand)}><DealerBrand compact/></span>}/>
    <div {...stylex.props(s.content)}>
      {showroom.menu.map(group => <nav key={group.label} aria-label={tx(group.label)} {...stylex.props(s.section, s.list)}>
        {group.items.map(item => <MenuRow key={item.href} href={item.href} icon={item.icon} title={tx(item.label)} primary={item.primary} copy={item.location ? location : undefined}/>)}
      </nav>)}

      {dealer.phoneE164 || dealer.email ? <section aria-label={tx('Contact the dealer')} {...stylex.props(s.section)}>
        <h2 {...stylex.props(s.sectionTitle)}>{tx('Contact the dealer')}</h2>
        <div {...stylex.props(s.list)}>
          {dealer.phoneE164 ? <MenuRow href={'tel:' + dealer.phoneE164} icon="phone" title={dealer.phoneDisplay || dealer.phoneE164}/> : null}
          {dealer.email ? <MenuRow href={'mailto:' + dealer.email} icon="email" title={dealer.email}/> : null}
        </div>
      </section> : null}

      {dealer.enabledLocales.length > 1 ? <section {...stylex.props(s.languageRow)}>
        <h2 {...stylex.props(s.languageTitle)}>{tx('Language')}</h2>
        <div role="group" aria-label={tx('Language')} {...stylex.props(s.languages)}>
          {dealer.enabledLocales.map(language => <a key={language} href={browserPath('/more', language)} lang={language} hrefLang={language} aria-current={locale === language ? 'true' : undefined} {...stylex.props(s.language, locale === language && s.languageSelected)}>{languageNames[language]}</a>)}
        </div>
      </section> : null}
      <p {...stylex.props(s.notice)}>{tx(dealer.previewNotice)}</p>
    </div>
  </div>;
}

function MenuRow({href, icon, title, copy, primary = false}: {href: string; icon: ShowroomIconName; title: string; copy?: string; primary?: boolean}) {
  return <Link href={href} {...stylex.props(s.row, primary && s.primaryRow)}>
    <span {...stylex.props(s.icon)}><ShowroomIcon name={icon} size={30}/></span>
    <span {...stylex.props(s.copy)}><span>{title}</span>{copy ? <span {...stylex.props(s.subtitle)}>{copy}</span> : null}</span>
    <ChevronRight size={18} aria-hidden="true" {...stylex.props(s.chevron, primary && s.primaryChevron)}/>
  </Link>;
}

const s = stylex.create({
  screen: {maxWidth: 760, marginInline: 'auto', color: $.ink, backgroundColor: $.surface, fontFamily: $.fontSans},
  brand: {display: 'block', maxWidth: 128, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 600, letterSpacing: '-.025em'},
  content: {padding: 16, paddingTop: 8},
  section: {marginBottom: 12},
  sectionTitle: {margin: 0, paddingBlock: 10, paddingInline: 2, color: $.muted, fontSize: 13, fontWeight: 500, lineHeight: '20px'},
  list: {borderColor: $.line, borderStyle: 'solid', borderWidth: 1, borderRadius: $.radiusSm, overflow: 'hidden'},
  row: {display: 'grid', gridTemplateColumns: '36px minmax(0,1fr) 18px', alignItems: 'center', gap: 12, minHeight: 56, paddingBlock: 9, paddingInline: 12, color: $.ink, fontSize: 15, fontWeight: 500, lineHeight: '21px', textAlign: 'left', borderBottomWidth: {default: 1, ':last-child': 0}, borderBottomStyle: 'solid', borderBottomColor: $.line, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt, ':active': $.rail}, outlineOffset: -3, outlineColor: {default: 'transparent', ':focus-visible': $.ink}},
  primaryRow: {minHeight: 62, fontWeight: 600, color: $.surface, borderBottomColor: $.ink, backgroundColor: {default: $.ink, ':hover': $.violetDark, ':active': $.violetDark}, outlineColor: {default: 'transparent', ':focus-visible': $.surface}},
  icon: {display: 'grid', placeItems: 'center', width: 36, height: 36},
  copy: {display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, overflowWrap: 'anywhere'},
  subtitle: {color: $.muted, fontSize: 12, fontWeight: 400, lineHeight: '17px'},
  chevron: {color: $.subtle},
  primaryChevron: {color: $.surface},
  languageRow: {display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 8, minHeight: 52, paddingInline: 2},
  languageTitle: {fontSize: 14, fontWeight: 500, lineHeight: '20px'},
  languages: {display: 'flex', gap: 4},
  language: {display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingInline: 8, color: $.muted, fontSize: 13, fontWeight: 500, borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: 'transparent'},
  languageSelected: {color: $.ink, borderBottomColor: $.ink},
  notice: {margin: 0, paddingTop: 12, paddingInline: 2, color: $.muted, fontSize: 11, lineHeight: '17px'},
});
