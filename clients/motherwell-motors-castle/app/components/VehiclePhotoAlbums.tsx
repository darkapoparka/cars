'use client';

import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import type {GalleryCategory, GalleryPhoto} from '@/lib/vehicle-gallery';
import {media, tokens as $} from '@/app/tokens.stylex';

const categories: readonly GalleryCategory[] = ['Exteriors', 'Interiors', 'Features'];

export default function VehiclePhotoAlbums({photos, onOpenPhoto}: {
  photos: GalleryPhoto[];
  onOpenPhoto: (photos: GalleryPhoto[], index?: number) => void;
}) {
  const tx = useCopy();
  if (photos.length < 2) return null;

  return <nav aria-label={tx('Vehicle photos')} {...stylex.props(s.albums)}>
    {categories.map(category => {
      const album = photos.filter(photo => photo.category === category);
      if (!album.length) return null;
      const label = tx(category === 'Features' ? 'Photo details' : category === 'Exteriors' ? 'Exterior' : 'Interior');
      const count = `${album.length} ${tx(album.length === 1 ? 'photo' : 'photos')}`;
      return <button key={category} type="button" title={`${label}, ${count}`} aria-label={`${label}, ${count}`} onClick={() => onOpenPhoto(album)} {...stylex.props(s.album)}>
        <img src={assetPath(album[0].src)} alt="" width={320} height={180} {...stylex.props(s.image)}/>
        <span aria-hidden="true" {...stylex.props(s.shade)}/>
        <span {...stylex.props(s.caption)}><span {...stylex.props(s.label)}>{label}</span><span aria-hidden="true" {...stylex.props(s.count)}><span {...stylex.props(s.mobileCount)}>{album.length}</span><span {...stylex.props(s.wideCount)}>{count}</span></span></span>
      </button>;
    })}
  </nav>;
}

const s = stylex.create({
  albums: {display: 'flex', flexWrap: {[media.mobile]: 'nowrap', default: 'wrap'}, gap: 8, marginTop: 12},
  album: {position: 'relative', display: 'flex', alignItems: {[media.mobile]: 'center', default: 'flex-end'}, justifyContent: 'flex-start', flex: '1 1 0', minWidth: {[media.mobile]: 0, default: 'max-content'}, maxWidth: '100%', minHeight: {[media.mobile]: 56, default: 74}, padding: 8, overflow: 'hidden', color: '#fff', textAlign: 'left', fontFamily: $.fontSans, borderWidth: 0, borderRadius: 8, backgroundColor: $.ink, cursor: 'pointer', outlineWidth: 2, outlineStyle: 'solid', outlineColor: {default: 'transparent', ':focus-visible': '#fff'}, outlineOffset: -3},
  image: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  shade: {position: 'absolute', inset: 0, backgroundImage: {[media.mobile]: 'linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.5))', default: 'linear-gradient(180deg,transparent,rgba(0,0,0,.8))'}, pointerEvents: 'none'},
  caption: {position: 'relative', display: {[media.mobile]: 'flex', default: 'grid'}, alignItems: 'center', justifyContent: {[media.mobile]: 'flex-start', default: 'normal'}, width: {[media.mobile]: '100%', default: 'auto'}, minWidth: 0, gap: {[media.mobile]: 4, default: 2}},
  label: {display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 500, lineHeight: '18px'},
  count: {flexShrink: 0, fontSize: 11, fontWeight: 400, lineHeight: '16px'},
  mobileCount: {display: {[media.mobile]: 'inline', default: 'none'}},
  wideCount: {display: {[media.mobile]: 'none', default: 'inline'}},
});
