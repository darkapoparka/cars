'use client';
import {useCopy} from '@/lib/locale';
import DealerBrand from '@/components/DealerBrand';
import {useEffect, useState} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {MapPin, ArrowUpRight} from 'lucide-react';
import {showroom} from '@/lib/showroom';
import NativeIcon from '@/components/NativeIcon';
import {ServiceTabs, type ServiceKey} from '@/components/ReferenceUI';
import {media, tokens as $} from '@/app/tokens.stylex';

/** The native discovery header compacts without moving the page's scroll position. */
export default function DiscoveryHeader({active, hideMobileIdentity = false}: {active: ServiceKey; hideMobileIdentity?: boolean}) {
  const tx = useCopy();

  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 768 && window.scrollY > 90);
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update);};
  }, []);
  return <>
    <div aria-hidden="true" {...stylex.props(s.spacer, hideMobileIdentity && s.spacerWithoutIdentity)} />
    <header data-discovery-header data-compact={compact} {...stylex.props(s.header, compact && s.compact)}>
      <div {...stylex.props(s.inner, compact && s.innerCompact)}>
        <div {...stylex.props(s.identity, hideMobileIdentity && s.mobileIdentityHidden)}><Link href="/" {...stylex.props(s.wordmark)}><DealerBrand/></Link><Link href={showroom.locationHref} {...stylex.props(s.location)}><MapPin size={13}/>{tx(showroom.locationLabel)}<ArrowUpRight size={12}/></Link></div>
        <ServiceTabs active={active} compact={compact} />
      </div>
    </header>
  </>;
}
export function ShowroomSearch() {
  const tx = useCopy();

  return <div {...stylex.props(s.searchWrap)}><div {...stylex.props(s.searchRow)}>
    <Link href="/search" aria-label={tx("Search cars")} {...stylex.props(s.search)}><NativeIcon name="search" size={20} /><span {...stylex.props(s.searchPrompt)}>{tx(showroom.searchPlaceholder)}</span><span {...stylex.props(s.mobileSearchPrompt)}>{tx(showroom.mobileSearchPlaceholder)}</span></Link>
    <Link href="/saved" aria-label={tx("Saved cars")} {...stylex.props(s.saved)}><NativeIcon name="heart" size={20} /></Link>
  </div></div>;
}
const s = stylex.create({
  identity: {display: {[media.desktop]: 'none', default: 'flex'}, alignItems: 'center', justifyContent: 'space-between', gap: 12, height: 32, marginBottom: 12},
  mobileIdentityHidden: {display: {[media.tablet]: 'flex', default: 'none'}},
  wordmark: {fontSize: 21, fontWeight: 700, letterSpacing: '-.9px'},
  location: {display: 'inline-flex', alignItems: 'center', gap: 5, minHeight: 32, fontSize: 11, color: $.muted},
  spacer: {display: {[media.mobile]: 'block', default: 'none'}, height: 'calc(156px + env(safe-area-inset-top))'},
  spacerWithoutIdentity: {height: 'calc(112px + env(safe-area-inset-top))'},
  header: {position: {[media.mobile]: 'fixed', default: 'relative'}, top: 0, left: 0, right: 0, zIndex: 70, color: $.ink, backgroundColor: '#fff'},
  compact: {boxShadow: '0 1px 0 rgba(20,20,24,.08)'},
  inner: {maxWidth: $.content, marginInline: 'auto', paddingTop: {[media.mobile]: 'calc(12px + env(safe-area-inset-top))', default: 30}, paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: 12},
  innerCompact: {paddingTop: {[media.mobile]: 'calc(12px + env(safe-area-inset-top))', default: 18}, paddingBottom: 16},
  searchWrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 10},
  searchRow: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 44px', gap: 8},
  search: {display: 'flex', alignItems: 'center', gap: 10, height: 44, paddingInline: 13, color: $.muted, fontSize: 15, fontWeight: 400, borderRadius: 12, backgroundColor: '#f4f4f5'},
  searchPrompt: {display: {[media.mobile]: 'none', default: 'block'}},
  mobileSearchPrompt: {display: {[media.mobile]: 'block', default: 'none'}, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  saved: {display: 'grid', placeItems: 'center', width: 44, height: 44, color: $.ink, borderRadius: '50%', backgroundColor: '#f4f4f5'},
});
