'use client';

import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import type {GalleryCategory, GalleryPhoto} from '@/lib/vehicle-gallery';
import {tokens as $} from '@/app/tokens.stylex';

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
      const label = tx(category === 'Features' ? 'Photo details' : category);
      const count = `${album.length} ${tx(album.length === 1 ? 'photo' : 'photos')}`;
      return <button key={category} type="button" aria-label={`${label}, ${count}`} onClick={() => onOpenPhoto(album)} {...stylex.props(s.album)}>
        <img src={assetPath(album[0].src)} alt="" width={320} height={180} {...stylex.props(s.image)}/>
        <span aria-hidden="true" {...stylex.props(s.shade)}/>
        <span {...stylex.props(s.caption)}><span {...stylex.props(s.label)}>{label}</span><span {...stylex.props(s.count)}>{count}</span></span>
      </button>;
    })}
  </nav>;
}

const s = stylex.create({
  albums: {display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12},
  album: {position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', flex: '1 1 0', minWidth: 'max-content', maxWidth: '100%', minHeight: 80, padding: 8, overflow: 'hidden', color: '#fff', textAlign: 'left', fontFamily: $.fontSans, borderWidth: 0, borderRadius: 8, backgroundColor: $.ink, cursor: 'pointer', outlineOffset: 3},
  image: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  shade: {position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(180deg,transparent,rgba(0,0,0,.8))', pointerEvents: 'none'},
  caption: {position: 'relative', display: 'grid', gap: 2},
  label: {fontSize: 13, fontWeight: 500, lineHeight: '18px'},
  count: {fontSize: 11, fontWeight: 400, lineHeight: '16px'},
});
