'use client';

import type {ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import DealerBrand from '@/components/DealerBrand';
import ShowroomBannerFrame from '@/components/ShowroomBannerFrame';
import {searchField} from '@/components/search-field.stylex';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {media} from '@/app/tokens.stylex';

/** One dealer identity and one useful control under the phone's service tabs. */
export default function DealerMobileBanner({title, children}: {title?: string; children: ReactNode}) {
  const tx = useCopy();
  return <div {...stylex.props(s.mobileOnly)}><ShowroomBannerFrame>
    <section data-dealer-mobile-banner {...stylex.props(s.panel)}>
      <img src={assetPath('/showroom/black/dealer-satin-v1.webp')} alt="" aria-hidden="true" width={1536} height={512} {...stylex.props(s.backdrop)}/>
      <div {...stylex.props(s.identity)}>
        {title ? <><h1 {...stylex.props(s.srOnly)}>{tx(title)}</h1><div {...stylex.props(s.brand)}><DealerBrand hero onDark/></div></> : <h1 {...stylex.props(s.brand)}><DealerBrand hero onDark/></h1>}
      </div>
      <div {...stylex.props(s.control)}>{children}</div>
    </section>
  </ShowroomBannerFrame></div>;
}

export function DealerBannerAction({label, icon, onClick, expanded}: {label: string; icon: ReactNode; onClick: () => void; expanded: boolean}) {
  const tx = useCopy();
  return <button type="button" aria-haspopup="dialog" aria-expanded={expanded} onClick={onClick} {...stylex.props(searchField.field, s.action)}>
    <span {...stylex.props(s.icon)}>{icon}</span><span {...stylex.props(s.label)}>{tx(label)}</span><ArrowRight size={18} aria-hidden="true"/>
  </button>;
}

const s = stylex.create({
  mobileOnly: {display: {[media.mobile]: 'block', default: 'none'}},
  panel: {position: 'relative', overflow: 'hidden', backgroundColor: '#171719', color: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#303034', borderRadius: 20},
  backdrop: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .65, pointerEvents: 'none'},
  identity: {position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 16px 8px'},
  brand: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 204, maxWidth: '100%', minWidth: 0, margin: 0, padding: 0},
  control: {position: 'relative', padding: '0 14px 14px'},
  action: {width: '100%', color: '#202024', backgroundColor: {default: '#fff', ':hover': '#f4f4f5'}, textAlign: 'left', cursor: 'pointer', outlineColor: {':focus-visible': '#fff'}, outlineOffset: 3},
  icon: {display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', width: 20, height: 20},
  label: {flexGrow: 1, minWidth: 0},
  srOnly: {position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0},
});
