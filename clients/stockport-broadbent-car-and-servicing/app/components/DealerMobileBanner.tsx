'use client';

import {useId, type ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import DealerBrand from '@/components/DealerBrand';
import ShowroomBannerFrame from '@/components/ShowroomBannerFrame';
import {searchField} from '@/components/search-field.stylex';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Phone heroes use the soft page surface; wider heroes retain the satin backdrop. */
export default function DealerMobileBanner({title, description, secondary, children, mobileCard = false, controlOnly = false}: {title?: string; description?: string; secondary?: ReactNode; children: ReactNode; mobileCard?: boolean; controlOnly?: boolean}) {
  const tx = useCopy();
  const titleId = useId();
  return <div {...stylex.props(s.mobileOnly)}><ShowroomBannerFrame inline mobileCard={mobileCard && !controlOnly}>
    <section data-dealer-mobile-banner aria-labelledby={titleId} {...stylex.props(s.panel, controlOnly && s.plainPanel)}>
      <img src={assetPath('/showroom/black/dealer-satin-v1.webp')} alt="" aria-hidden="true" width={1536} height={512} {...stylex.props(s.backdrop, controlOnly && s.compactBackdrop)}/>
      <div {...stylex.props(s.identity, controlOnly && s.compactIdentity)}>
        {title ? <><h1 id={titleId} {...stylex.props(s.title)}>{tx(title)}</h1>{description ? <p {...stylex.props(s.description)}>{tx(description)}</p> : null}</> : <h1 id={titleId} {...stylex.props(s.brand)}><DealerBrand hero onDark mobileOnLight/></h1>}
        {secondary}
      </div>
      <div {...stylex.props(s.control, controlOnly && s.compactControl)}>{children}</div>
    </section>
  </ShowroomBannerFrame></div>;
}

export function DealerBannerAction({label, icon, onClick, expanded, searchEntry = false, plainOnMobile = false}: {label: string; icon: ReactNode; onClick: () => void; expanded: boolean; searchEntry?: boolean; plainOnMobile?: boolean}) {
  const tx = useCopy();
  return <button type="button" aria-haspopup="dialog" aria-expanded={expanded} onClick={onClick} {...stylex.props(searchField.field, s.action, searchEntry && s.searchEntry, plainOnMobile && s.plainMobileAction)}>
    <span {...stylex.props(s.icon, searchEntry && searchField.icon)}>{icon}</span><span {...stylex.props(s.label)}>{tx(label)}</span>{!searchEntry ? <ArrowRight size={18} aria-hidden="true"/> : null}
  </button>;
}

const s = stylex.create({
  mobileOnly: {display: {[media.desktop]: 'none', default: 'block'}},
  panel: {position: 'relative', overflow: 'hidden', backgroundColor: {[media.mobile]: $.rail, default: '#202023'}, color: {[media.mobile]: $.ink, default: '#fff'}},
  plainPanel: {overflow: {[media.mobile]: 'visible', default: 'hidden'}, backgroundColor: {[media.mobile]: '#fff', default: '#202023'}},
  backdrop: {display: {[media.mobile]: 'none', default: 'block'}, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .14, pointerEvents: 'none'},
  compactBackdrop: {display: {[media.mobile]: 'none', default: 'block'}},
  identity: {position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: {[media.mobile]: '16px 12px 14px', default: '20px 28px 16px'}, textAlign: 'center'},
  compactIdentity: {display: {[media.mobile]: 'none', default: null}},
  brand: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: {[media.mobile]: 164, default: 204}, maxWidth: '100%', minWidth: 0, margin: 0, padding: 0},
  title: {fontSize: {[media.mobile]: 24, default: 28}, fontWeight: 500, lineHeight: 1.2, textWrap: 'balance'},
  description: {color: {[media.mobile]: $.muted, default: '#d1d1d5'}, fontSize: 14, lineHeight: '20px'},
  control: {position: 'relative', width: '100%', maxWidth: 640, marginInline: 'auto', padding: {[media.mobile]: '0 12px 20px', default: '0 28px 24px'}},
  compactControl: {padding: {[media.mobile]: '4px 12px 0', default: null}},
  action: {width: '100%', color: '#202024', backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}, textAlign: 'left', cursor: 'pointer', outlineColor: {':focus-visible': {[media.mobile]: $.ink, default: '#fff'}}, outlineOffset: 3},
  plainMobileAction: {backgroundColor: {default: $.surface, ':hover': $.surfaceAlt}, outlineColor: {':focus-visible': {default: '#fff', [media.mobile]: '#242428'}}, outlineOffset: {[media.mobile]: 2, default: 3}},
  searchEntry: {color: $.muted},
  icon: {display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', width: 20, height: 20},
  label: {flexGrow: 1, minWidth: 0},
});
