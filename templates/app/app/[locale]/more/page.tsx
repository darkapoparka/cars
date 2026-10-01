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
import {media, tokens as $} from '@/app/tokens.stylex';

const languageNames = {en: 'English', bg: 'Български'};

export default function MorePage() {
  const tx = useCopy();
  const locale = useLocale();
  const location = dealer.address.trim() || dealer.city.trim() ? showroomLocation(locale, true) : tx('Plan your visit');

  return <div {...stylex.props(s.screen)}>
    <PageHeader title="Menu" action={<span {...stylex.props(s.brand)}><DealerBrand compact/></span>}/>
    <main {...stylex.props(s.content)}>
      {showroom.menu.map(group => <nav key={group.label} aria-label={tx(group.label)} {...stylex.props(s.section)}>
        <h2 {...stylex.props(s.groupTitle)}>{tx(group.label)}</h2>
        <div {...stylex.props(s.list)}>{group.items.map(item => <MenuRow key={item.href} href={item.href} icon={item.icon} title={tx(item.href === '/cars' ? 'Cars' : item.label)} copy={item.location ? location : undefined}/>)}</div>
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
    </main>
  </div>;
}

function MenuRow({href, icon, title, copy}: {href: string; icon: ShowroomIconName; title: string; copy?: string}) {
  return <Link href={href} {...stylex.props(s.row)}>
    <span {...stylex.props(s.icon)}><ShowroomIcon name={icon} size={20}/></span>
    <span {...stylex.props(s.copy)}><span>{title}</span>{copy ? <span {...stylex.props(s.subtitle)}>{copy}</span> : null}</span>
    <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.chevron)}/>
  </Link>;
}

const s = stylex.create({
  screen: {maxWidth: 760, marginInline: 'auto', color: $.ink, backgroundColor: $.surface, fontFamily: $.fontSans},
  brand: {display: 'block', maxWidth: 128, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16, fontWeight: 600, letterSpacing: '-.025em'},
  content: {paddingInline: {[media.mobile]: 20, default: 28}, paddingTop: 8, paddingBottom: 20},
  section: {marginBottom: {[media.mobile]: 24, default: 16}},
  groupTitle: {display: {[media.mobile]: 'block', default: 'none'}, margin: 0, paddingBlock: 4, color: $.muted, fontSize: 12, fontWeight: 500, lineHeight: '18px'},
  sectionTitle: {margin: 0, paddingBlock: 10, paddingInline: 2, color: $.muted, fontSize: 13, fontWeight: 500, lineHeight: '20px'},
  list: {borderColor: $.line, borderStyle: 'solid', borderWidth: {[media.mobile]: 0, default: 1}, borderRadius: {[media.mobile]: 0, default: $.radiusMd}, overflow: 'hidden'},
  row: {display: 'grid', gridTemplateColumns: '24px minmax(0,1fr) 16px', alignItems: 'center', gap: 12, minHeight: 56, paddingBlock: 12, paddingInline: {[media.mobile]: 0, default: 15}, color: $.ink, fontSize: 16, fontWeight: {[media.mobile]: 400, default: 500}, lineHeight: '22px', textAlign: 'left', borderBottomWidth: {default: 1, ':last-child': 0}, borderBottomStyle: 'solid', borderBottomColor: $.line, backgroundColor: {default: $.surface, ':hover': $.surfaceAlt, ':active': $.rail}, outlineOffset: -3, outlineColor: {default: 'transparent', ':focus-visible': $.ink}},
  icon: {display: 'grid', placeItems: 'center', width: 24, height: 24},
  copy: {display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, overflowWrap: 'anywhere'},
  subtitle: {color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px'},
  chevron: {color: $.subtle},
  languageRow: {display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 64, paddingTop: 12, paddingInline: 0, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: $.line},
  languageTitle: {fontSize: 14, fontWeight: 500, lineHeight: '20px'},
  languages: {display: 'flex', gap: 2, padding: 3, borderRadius: 12, backgroundColor: $.surfaceAlt},
  language: {display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingInline: 12, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '20px', borderWidth: 1, borderStyle: 'solid', borderColor: 'transparent', borderRadius: 9, backgroundColor: {default: 'transparent', ':hover': $.rail}, outlineOffset: -3},
  languageSelected: {color: $.ink, fontWeight: 500, borderColor: $.line, backgroundColor: {default: $.surface, ':hover': $.surface}, boxShadow: '0 1px 3px rgba(0,0,0,.04)', outlineColor: {default: 'transparent', ':focus-visible': $.ink}},
  notice: {margin: 0, paddingTop: 18, paddingInline: 0, color: $.muted, fontSize: 12, lineHeight: '18px'},
});
