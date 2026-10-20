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

type Highlight = {title: string; copy: string; action: string; href: string; image: string};

export default function ShowroomHighlights({onDark = false, hero = false, items = showroom.highlights}: {onDark?: boolean; hero?: boolean; items?: ReadonlyArray<Highlight>}) {
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
    <div data-promotion-rail ref={rail} onScroll={syncPage} {...stylex.props(s.rail, hero && s.heroRail)}>{items.map(({title, copy, href, image, action}, index) => <Link data-promotion-card href={href} key={image} aria-label={tx(action)} {...stylex.props(s.card, hero && s.heroCard)}>
    <Image src={image} alt={tx("")} width={1672} height={941} loading={index === 0 ? 'eager' : 'lazy'} sizes={hero ? '100vw' : '(max-width: 767px) calc(100vw - 24px), 600px'} {...stylex.props(s.artwork, hero && s.heroArtwork)}/>
    <div {...stylex.props(s.content, hero && s.heroContent)}><h2 data-promotion-title {...stylex.props(t.heading, s.title, hero && s.heroTitle)}>{tx(title).replace(/\.$/, '')}</h2><p data-promotion-copy {...stylex.props(t.body, s.copy)}>{tx(copy)}</p><span data-promotion-action aria-hidden="true" {...stylex.props(t.base, s.action, hero && s.heroAction)}>{tx(action)}<ArrowRight aria-hidden="true" {...stylex.props(s.arrow)}/></span></div>
  </Link>)}</div>
    <div aria-label={tx("Choose a promotion")} {...stylex.props(s.pagination)}>{items.map((item, index) => <button key={item.href} type="button" aria-label={`${index + 1}: ${tx(item.action)}`} aria-current={active === index ? 'true' : undefined} onClick={() => select(index)} {...stylex.props(s.pageButton, onDark && s.pageButtonOnDark)}><span {...stylex.props(s.pageDot, active === index && s.pageDotActive, active === index && onDark && s.pageDotOnDark)}/></button>)}</div>
  </div>;
}
const s = stylex.create({
  rail: {position: 'relative', display: {[media.mobile]: 'flex', default: 'grid'}, gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, overflowX: 'auto', paddingBottom: 0, borderRadius: {[media.mobile]: 0, default: 20}, scrollbarWidth: 'none', scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain'},
  card: {position: 'relative', display: 'block', flexGrow: 0, flexShrink: 0, flexBasis: {[media.mobile]: '100%', default: 'calc((100% - 12px) / 2)'}, overflow: 'hidden', borderRadius: 20, scrollSnapAlign: 'start', color: '#fff', backgroundColor: campaign.surface, containerType: 'inline-size', outlineOffset: -4},
  artwork: {position: 'absolute', right: 0, bottom: 0, width: '100%', height: {[media.mobile]: 'auto', default: '100%'}, objectFit: 'cover', objectPosition: {[media.mobile]: 'right bottom', default: 'right 35%'}, maskImage: {[media.mobile]: 'linear-gradient(to bottom,transparent,rgba(0,0,0,.25) 65%,#000)', default: 'linear-gradient(to right,transparent,#000 60%)'}},
  content: {position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: {[media.mobile]: 'center', default: 'flex-start'}, width: '100%', padding: {[media.mobile]: 16, default: 24}, textAlign: {[media.mobile]: 'center', default: 'left'}},
  heroRail: {gap: 0},
  heroCard: {borderRadius: 0, backgroundColor: 'transparent'},
  heroArtwork: {height: '100%', objectPosition: 'center 58%', maskImage: 'linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.18) 25%,rgba(0,0,0,.18) 75%,rgba(0,0,0,.55))'},
  heroContent: {minHeight: 132, justifyContent: 'center', alignItems: 'center', padding: '12px 16px', textAlign: 'center'},
  heroTitle: {fontWeight: 500},
  heroAction: {minWidth: 160, height: 36, marginTop: 10, fontSize: 14},
  title: {width: '100%', maxWidth: '100%', whiteSpace: 'nowrap'},
  copy: {width: '100%', maxWidth: '100%', marginTop: 6, whiteSpace: 'nowrap', color: campaign.muted},
  action: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 32, marginTop: 14, paddingInline: 12, color: campaign.actionText, fontSize: 13, fontWeight: 400, lineHeight: '18px', whiteSpace: 'nowrap', borderRadius: $.radiusPill, backgroundColor: '#fff'},
  arrow: {width: 14, height: 14, flexShrink: 0},
  pagination: {display: {[media.mobile]: 'flex', default: 'none'}, justifyContent: 'center', gap: 0, paddingTop: 0},
  pageButton: {display: 'grid', placeItems: 'center', width: $.controlHeight, height: $.controlHeight, padding: 0, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  pageButtonOnDark: {borderRadius: 8, outlineColor: {':focus-visible': '#fff'}, outlineOffset: -4},
  pageDot: {display: 'block', width: 5, height: 5, borderRadius: 5, backgroundColor: '#c7c7cc'},
  pageDotActive: {width: 16, backgroundColor: '#202024'},
  pageDotOnDark: {backgroundColor: '#fff'},
});
