'use client';
import {useCopy} from '@/lib/locale';
import DealerBrand from '@/components/DealerBrand';
import {useEffect, useRef, useState} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {MapPin, ArrowUpRight} from 'lucide-react';
import {showroom} from '@/lib/showroom';
import {ServiceTabs, type ServiceKey} from '@/components/ReferenceUI';
import {media, tokens as $} from '@/app/tokens.stylex';
import ShowroomSearchField from '@/components/ShowroomSearchField';

/** The native discovery header compacts without moving the page's scroll position. */
export default function DiscoveryHeader({active, hideMobileIdentity = false}: {active: ServiceKey; hideMobileIdentity?: boolean}) {
  const tx = useCopy();

  const [compact, setCompact] = useState(false);
  const header = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (spacer.current && element.dataset.compact === 'false') spacer.current.style.height = `${element.getBoundingClientRect().height}px`;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 768 && window.scrollY > 90);
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update);};
  }, []);
  return <>
    <div ref={spacer} aria-hidden="true" {...stylex.props(s.spacer, hideMobileIdentity && s.spacerWithoutIdentity)} />
    <header ref={header} data-discovery-header data-compact={compact} {...stylex.props(s.header, hideMobileIdentity && s.landingHeader)}>
      <div {...stylex.props(s.inner, hideMobileIdentity && s.landingInner, compact && s.innerCompact)}>
        <div {...stylex.props(s.identity, hideMobileIdentity && s.mobileIdentityHidden)}><Link href="/" {...stylex.props(s.wordmark)}><DealerBrand onDark={hideMobileIdentity}/></Link><Link href={showroom.locationHref} {...stylex.props(s.location, hideMobileIdentity && s.landingLocation)}><MapPin size={13}/>{tx(showroom.locationLabel)}<ArrowUpRight size={12}/></Link></div>
        <ServiceTabs active={active} compact={compact} onDark={hideMobileIdentity} />
      </div>
    </header>
  </>;
}
export function ShowroomSearch({desktopOnly = false}: {desktopOnly?: boolean}) {
  return <div {...stylex.props(s.searchWrap, desktopOnly && s.desktopSearchOnly)}><ShowroomSearchField/></div>;
}
const s = stylex.create({
  identity: {display: {[media.desktop]: 'none', default: 'flex'}, alignItems: 'center', justifyContent: 'space-between', gap: 12, height: 44},
  mobileIdentityHidden: {display: 'none'},
  wordmark: {display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 21, fontWeight: 700, letterSpacing: '-.9px'},
  location: {display: 'inline-flex', alignItems: 'center', gap: 5, minHeight: 44, fontSize: 12, color: $.muted},
  spacer: {display: {[media.mobile]: 'block', default: 'none'}, height: 'calc(126px + env(safe-area-inset-top))'},
  spacerWithoutIdentity: {height: 'calc(82px + env(safe-area-inset-top))'},
  header: {display: {[media.desktop]: 'none', default: 'block'}, position: {[media.mobile]: 'fixed', default: 'relative'}, top: 0, left: 0, right: 0, zIndex: 70, color: $.ink, backgroundColor: '#fff'},
  landingHeader: {color: {[media.mobile]: $.ink, default: '#fff'}, backgroundColor: {[media.mobile]: $.rail, default: '#202023'}},
  landingLocation: {color: '#d1d1d5'},
  inner: {maxWidth: $.content, marginInline: 'auto', paddingTop: {[media.mobile]: 'calc(6px + env(safe-area-inset-top))', [media.desktop]: 16, default: 30}, paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: {[media.mobile]: 0, default: 12}},
  landingInner: {paddingTop: {[media.mobile]: 'calc(6px + env(safe-area-inset-top))', default: 16}},
  innerCompact: {paddingTop: {[media.mobile]: 'calc(4px + env(safe-area-inset-top))', default: 18}, paddingBottom: {[media.mobile]: 0, default: 4}},
  searchWrap: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingTop: 10},
  desktopSearchOnly: {display: {[media.mobile]: 'none', [media.desktop]: 'none', default: 'block'}},
});
