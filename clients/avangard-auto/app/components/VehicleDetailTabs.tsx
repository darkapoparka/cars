'use client';

import {useId, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Expand} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import type {GalleryPhoto} from '@/lib/vehicle-gallery';
import {media, tokens as $} from '@/app/tokens.stylex';

const tabs = ['Information', 'Exteriors', 'Interiors'] as const;
type DetailTab = typeof tabs[number];

export default function VehicleDetailTabs({photos, children, onOpenPhoto, onInformationChange}: {
  photos: GalleryPhoto[];
  children: ReactNode;
  onOpenPhoto: (photos: GalleryPhoto[], index: number) => void;
  onInformationChange: (visible: boolean) => void;
}) {
  const tx = useCopy();
  const id = useId();
  const [selected, setSelected] = useState<DetailTab>('Information');
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function select(tab: DetailTab) {
    setSelected(tab);
    onInformationChange(tab === 'Information');
  }
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % tabs.length; break;
      case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(tabs[next]);
    buttons.current[next]?.focus();
  }

  return <div {...stylex.props(s.content)}>
    <div role="tablist" aria-label={tx('Vehicle details')} {...stylex.props(s.tabs)}>
      {tabs.map((tab, index) => <button
        key={tab}
        ref={element => {buttons.current[index] = element;}}
        type="button"
        role="tab"
        aria-label={tx(tab)}
        id={`${id}-tab-${index}`}
        aria-controls={`${id}-panel-${index}`}
        aria-selected={selected === tab}
        tabIndex={selected === tab ? 0 : -1}
        onClick={() => select(tab)}
        onKeyDown={event => move(event, index)}
        {...stylex.props(s.tab, selected === tab && s.selected)}
      ><span {...stylex.props(s.tabLabel, selected === tab && s.selectedLabel)}>{tab === 'Information' ? <><span {...stylex.props(s.mobileLabel)}>{tx('Info')}</span><span {...stylex.props(s.wideLabel)}>{tx(tab)}</span></> : tx(tab)}</span></button>)}
    </div>
    <div role="tabpanel" id={`${id}-panel-0`} aria-labelledby={`${id}-tab-0`} hidden={selected !== 'Information'} tabIndex={0} {...stylex.props(s.panel)}>{children}</div>
    {tabs.slice(1).map((tab, index) => {
      const categoryPhotos = photos.filter(photo => photo.category === tab);
      return <div key={tab} role="tabpanel" id={`${id}-panel-${index + 1}`} aria-labelledby={`${id}-tab-${index + 1}`} hidden={selected !== tab} tabIndex={0} {...stylex.props(s.panel)}>
        {selected === tab ? <section {...stylex.props(s.photoPanel)}>
          {categoryPhotos.length ? <div {...stylex.props(s.photos)}>{categoryPhotos.map((photo, photoIndex) => <button
            type="button"
            key={`${photo.src}-${photoIndex}`}
            aria-label={`${tx('Open photo')}: ${tx(photo.label)}`}
            onClick={() => onOpenPhoto(categoryPhotos, photoIndex)}
            {...stylex.props(s.photo)}
          >
            <span {...stylex.props(s.imageFrame)}>
              <img src={assetPath(photo.src)} alt="" width={680} height={384} loading="lazy" {...stylex.props(s.image)}/>
              <span aria-hidden="true" {...stylex.props(s.expand)}><Expand size={17}/></span>
            </span>
            <span {...stylex.props(s.caption)}>{tx(photo.label)}</span>
          </button>)}</div> : <p {...stylex.props(s.empty)}>{tx('Photos in this category are not available for this car.')}</p>}
        </section> : null}
      </div>;
    })}
  </div>;
}

const s = stylex.create({
  content: {marginTop: 8},
  tabs: {position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', paddingInline: 2, '::before': {content: '""', position: 'absolute', inset: '4px 0', borderRadius: $.radiusSm, backgroundColor: $.violetSoft, pointerEvents: 'none'}},
  tab: {position: 'relative', display: 'grid', alignItems: 'center', minWidth: 0, minHeight: $.controlHeight, padding: '0 2px', color: $.muted, fontFamily: $.fontSans, fontSize: $.controlFontSize, fontWeight: 500, lineHeight: $.controlLineHeight, whiteSpace: 'nowrap', borderWidth: 0, borderRadius: $.radiusSm, backgroundColor: 'transparent', outlineWidth: 2, outlineStyle: 'solid', outlineColor: {default: 'transparent', ':focus-visible': $.ink}, outlineOffset: -2, cursor: 'pointer'},
  selected: {color: $.ink},
  tabLabel: {display: 'grid', placeItems: 'center', height: 'calc(' + $.controlCompactHeight + ' - 4px)', borderRadius: $.radiusXs, backgroundColor: {default: 'transparent', ':hover': $.line}},
  selectedLabel: {backgroundColor: {default: $.surface, ':hover': $.surface}, boxShadow: '0 1px 3px rgba(0,0,0,0.08)'},
  mobileLabel: {display: {[media.mobile]: 'inline', default: 'none'}},
  wideLabel: {display: {[media.mobile]: 'none', default: 'inline'}},
  panel: {outlineOffset: 4},
  photoPanel: {marginTop: 16},
  photos: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 12},
  photo: {display: 'flex', flexDirection: 'column', minWidth: 0, padding: 0, overflow: 'hidden', color: $.ink, textAlign: 'left', borderWidth: 0, borderRadius: 12, backgroundColor: $.surface, cursor: 'zoom-in'},
  imageFrame: {position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden'},
  image: {display: 'block', width: '100%', height: '100%', objectFit: 'cover'},
  expand: {display: 'grid', placeItems: 'center', position: 'absolute', right: 10, bottom: 10, width: 32, height: 32, color: $.ink, borderRadius: '50%', backgroundColor: $.surface},
  caption: {padding: '10px 12px', fontFamily: $.fontSans, fontSize: 14, lineHeight: '20px'},
  empty: {color: $.muted, fontFamily: $.fontSans, fontSize: 14, lineHeight: '22px'},
});
