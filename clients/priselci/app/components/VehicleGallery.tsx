'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from '@/lib/navigation';
import * as stylex from '@stylexjs/stylex';
import {ChevronLeft, Share2, Star} from 'lucide-react';
import LoginSheet from '@/components/DealerEnquirySheet';
import VehiclePhotoViewer from '@/components/VehiclePhotoViewer';
import {vehicleGallery, type GalleryCategory,type GalleryPhoto} from '@/lib/vehicle-gallery';
import type {Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';

const categories: GalleryCategory[] = ['Exteriors', 'Interiors', 'Features'];
const captions = {Exteriors: 'Exterior', Interiors: 'Interior', Features: 'Features'};
export default function VehicleGallery({vehicle, initialCategory = 'Exteriors',capturedPhotos}: {vehicle: Vehicle; initialCategory?: GalleryCategory;capturedPhotos?:GalleryPhoto[]}) {
  const tx = useCopy();

  const router = useRouter();
  const photos = useMemo(() => capturedPhotos?.length?capturedPhotos:vehicleGallery(vehicle), [vehicle,capturedPhotos]);
  const available = categories.filter(item => photos.some(photo => photo.category === item));
  const [category, setCategory] = useState<GalleryCategory>(available.includes(initialCategory) ? initialCategory : available[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState('');
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const first = photos.findIndex(photo => photo.category === initialCategory);
      const target = content.current?.querySelector<HTMLElement>(`[data-photo-index="${Math.max(0, first - (initialCategory === 'Interiors' ? 1 : 0))}"]`);
      if (first > 0 && target) window.scrollTo({top: scrollY + target.getBoundingClientRect().top - (innerWidth >= 1100 ? 182 : 158), behavior: 'instant'});
    });
    return () => cancelAnimationFrame(frame);
  }, [initialCategory, photos]);
  function choose(next: GalleryCategory) {
    setCategory(next);
    const params = new URLSearchParams(location.search); params.set('category', next);
    history.replaceState({...history.state}, '', `${location.pathname}?${params}`);
    const first = photos.findIndex(photo => photo.category === next);
    const target = content.current?.querySelector<HTMLElement>(`[data-photo-index="${Math.max(0, first - (next === 'Interiors' ? 1 : 0))}"]`);
    if (target) window.scrollTo({top: scrollY + target.getBoundingClientRect().top - (innerWidth >= 1100 ? 182 : 158), behavior: 'instant'});
  }
  async function share() {
    try {
      const url = `${location.origin}/cars/${vehicle.slug}`;
      if (navigator.share) await navigator.share({title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, url});
      else if (navigator.clipboard) {await navigator.clipboard.writeText(url); setMessage('Link copied');}
      else setMessage(url);
    } catch (error) {if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage('Sharing is unavailable in this browser.');}
  }
  return <main aria-label={tx("Vehicle photo gallery")} {...stylex.props(s.page)}>
    <header {...stylex.props(s.header)}><button type="button" aria-label={tx("Back to vehicle details")} onClick={() => history.length > 1 ? router.back() : router.push(`/cars/${vehicle.slug}`)} {...stylex.props(s.back)}><ChevronLeft size={27} strokeWidth={2} /></button><button type="button" aria-label={tx("Share car")} onClick={share} {...stylex.props(s.back)}><Share2 size={21} /></button></header>
    <nav aria-label={tx("Vehicle photo categories")} {...stylex.props(s.tabs)}>{available.map(item => <button type="button" key={item} aria-pressed={item === category} onClick={() => choose(item)} {...stylex.props(s.tab, item === category && s.activeTab)}>{tx(captions[item])}</button>)}</nav>
    <div ref={content} {...stylex.props(s.images)}>{photos.map((photo, index) => <button type="button" key={`${photo.src}-${index}`} data-photo-index={index} data-photo-category={photo.category} aria-label={tx(`Zoom ${photo.label} photo`)} onClick={() => setSelected(index)} {...stylex.props(s.photoButton)}><img src={assetPath(photo.src)} width={1200} height={625} alt={tx(`${vehicle.make} ${vehicle.model}: ${photo.label}`)} loading={index < 2 ? 'eager' : 'lazy'} {...stylex.props(s.photo)} /><span {...stylex.props(s.photoCaption)}><Star size={12} fill="currentColor" />{tx(photo.label)}</span></button>)}</div>
    <footer {...stylex.props(s.footer)}><button type="button" onClick={() => setLogin(true)} {...stylex.props(s.book)}>{tx("BOOK FREE TEST DRIVE")}</button></footer>
    {message ? <button type="button" role="status" onClick={() => setMessage('')} {...stylex.props(s.message)}>{tx(message)}</button> : null}
    {selected !== null ? <VehiclePhotoViewer photos={photos} initialIndex={selected} onClose={() => setSelected(null)} /> : null}
    <LoginSheet open={login} onClose={() => setLogin(false)} />
  </main>;
}
const s = stylex.create({
  page: {minHeight: '100dvh', paddingTop: {[media.desktop]: 182, default: 158}, paddingBottom: 77, color: '#202024', backgroundColor: '#fff'},
  header: {position: 'fixed', top: {[media.desktop]: 72, default: 0}, left: 0, right: 0, zIndex: 105, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: {[media.desktop]: 64, default: 112}, paddingTop: {[media.desktop]: 0, default: 51}, paddingInline: 20, backgroundColor: '#fff'},
  back: {display: 'grid', placeItems: 'center', width: 32, height: 61, padding: 0, color: '#f17100', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  tabs: {position: 'fixed', top: {[media.desktop]: 136, default: 112}, left: 0, right: 0, zIndex: 104, display: 'flex', alignItems: 'center', gap: 9, height: 46, paddingInline: 22, backgroundColor: '#f9f9f9'},
  tab: {fontFamily:$.fontDisplay,minHeight: 29, padding: '4px 13px', color: '#202024', fontSize: 12, fontWeight: 400, lineHeight: '19px', borderColor: '#c4c4c4', borderStyle: 'solid', borderWidth: 1, borderRadius: 15, backgroundColor: 'transparent', cursor: 'pointer'},
  activeTab: {color: '#fff', fontWeight: 600, borderColor: '#202024', backgroundColor: '#202024'},
  images: {display: 'grid', gap: 4, maxWidth: 960, marginInline: 'auto'},
  photoButton: {position: 'relative', display: 'block', width: '100%', padding: 0, overflow: 'hidden', borderWidth: 0, backgroundColor: '#f1f1f1', cursor: 'zoom-in'},
  photo: {display: 'block', width: '100%', height: 'auto', aspectRatio: '1.92', objectFit: 'cover'},
  photoCaption: {position: 'absolute', right: 22, bottom: 8, display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 'calc(100% - 44px)', padding: '7px 9px', color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: '17px', borderRadius: 3, backgroundColor: 'rgba(8,24,53,.47)'},
  footer: {position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 110, padding: '8px 18px 20px', backgroundColor: '#fff'},
  book: {display: 'block', width: '100%', maxWidth: 924, marginInline: 'auto', minHeight: 48, padding: '10px 15px', color: '#fff', fontSize: 16, fontWeight: 600, borderWidth: 0, borderRadius: 7, backgroundColor: $.violet, cursor: 'pointer'},
  message: {position: 'fixed', left: '50%', bottom: 95, transform: 'translateX(-50%)', zIndex: 120, padding: '12px 18px', color: '#fff', fontSize: 13, borderWidth: 0, borderRadius: 10, backgroundColor: '#202024', cursor: 'pointer'},
});
