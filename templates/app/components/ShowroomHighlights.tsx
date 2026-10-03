'use client';
import {useCopy} from '@/lib/locale';
import {useRef, useState} from 'react';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import {ArrowRight} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {campaignTokens as campaign} from '@/app/campaign-theme.stylex';
import {showroom} from '@/lib/showroom';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export default function ShowroomHighlights() {
  const tx = useCopy();

  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function select(index: number) {
    const track = rail.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({left: card.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  function syncPage() {
    const track = rail.current;
    if (!track) return;
    const index = Array.from(track.children).reduce((nearest, child, i, cards) => Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft) < Math.abs((cards[nearest] as HTMLElement).offsetLeft - track.scrollLeft) ? i : nearest, 0);
    setActive(index);
  }
  return <div role="region" aria-label={tx("Explore the showroom")} aria-roledescription="carousel">
    <div ref={rail} onScroll={syncPage} {...stylex.props(s.rail)}>{showroom.highlights.map(({title, mobileTitle, copy, mobileCopy, href, image, action, mobileAction}, index) => <Link href={href} key={image} aria-label={tx(action)} {...stylex.props(s.card)}>
    <Image src={image} alt={tx("")} width={1672} height={941} loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 767px) calc(100vw - 56px), 600px" {...stylex.props(s.artwork)}/>
    <div {...stylex.props(s.content)}><h2 {...stylex.props(s.title, t.heading)}><span {...stylex.props(s.desktopCopy)}>{tx(title)}</span><span {...stylex.props(s.mobileCopy)}>{tx(mobileTitle)}</span></h2><p {...stylex.props(s.copy, t.body)}><span {...stylex.props(s.desktopCopy)}>{tx(copy)}</span><span {...stylex.props(s.mobileCopy)}>{tx(mobileCopy)}</span></p><span {...stylex.props(s.action, t.control)}><span {...stylex.props(s.desktopCopy)}>{tx(action)}</span><span {...stylex.props(s.mobileCopy)}>{tx(mobileAction)}</span><ArrowRight aria-hidden="true" {...stylex.props(s.arrow)}/></span></div>
  </Link>)}</div>
    <div aria-label={tx("Choose a promotion")} {...stylex.props(s.pagination)}>{showroom.highlights.map((item, index) => <button key={item.href} type="button" aria-label={`${index + 1}: ${tx(item.action)}`} aria-current={active === index ? 'true' : undefined} onClick={() => select(index)} {...stylex.props(s.pageButton)}><span {...stylex.props(s.pageDot, active === index && s.pageDotActive)}/></button>)}</div>
  </div>;
}
const s = stylex.create({
  rail: {position: 'relative', display: {[media.mobile]: 'flex', default: 'grid'}, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, overflowX: 'auto', paddingBottom: 0, borderRadius: {[media.mobile]: 0, default: 20}, scrollbarWidth: 'none', scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain'},
  card: {position: 'relative', display: 'block', flexGrow: 0, flexShrink: 0, flexBasis: {[media.mobile]: 'calc(100% - 32px)', default: 'calc((100% - 12px) / 2)'}, overflow: 'hidden', borderRadius: 20, scrollSnapAlign: 'start', color: '#fff', backgroundColor: campaign.surface, containerType: 'inline-size'},
  artwork: {position: 'absolute', right: 0, bottom: 0, width: '100%', height: {[media.mobile]: 'auto', default: '100%'}, objectFit: 'cover', objectPosition: {[media.mobile]: 'right bottom', default: 'right 35%'}, maskImage: {[media.mobile]: 'linear-gradient(to bottom,transparent,#000 25%)', default: 'linear-gradient(to right,transparent,#000 60%)'}},
  content: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: {[media.mobile]: '100%', default: '57%'}, padding: {[media.mobile]: 18, default: 'clamp(16px,4.6cqw,25px)'}, paddingRight: {[media.mobile]: 18, default: 0}},
  title: {maxWidth: {[media.mobile]: '75%', default: 'none'}, textWrap: 'pretty'},
  copy: {maxWidth: {[media.mobile]: '65%', default: 'none'}, marginTop: {[media.mobile]: 6, default: 'clamp(6px,2cqw,10px)'}, whiteSpace: 'pre-line', color: campaign.muted},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: $.controlHeight, marginTop: 16, padding: '8px clamp(16px,3cqw,20px)', color: campaign.actionText, whiteSpace: 'nowrap', borderRadius: 30, backgroundColor: '#fff'},
  arrow: {width: 'clamp(12px,4cqw,20px)', height: 'clamp(12px,4cqw,20px)', flexShrink: 0},
  pagination: {display: {[media.mobile]: 'flex', default: 'none'}, justifyContent: 'center', gap: 0, paddingTop: 0},
  pageButton: {display: 'grid', placeItems: 'center', width: $.controlHeight, height: $.controlHeight, padding: 0, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  pageDot: {display: 'block', width: 5, height: 5, borderRadius: 5, backgroundColor: '#c7c7cc'},
  pageDotActive: {width: 16, backgroundColor: '#202024'},
  desktopCopy: {display: {[media.mobile]: 'none', default: 'inline'}},
  mobileCopy: {display: {[media.mobile]: 'inline', default: 'none'}},
});
