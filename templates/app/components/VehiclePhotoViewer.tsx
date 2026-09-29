'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState, type PointerEvent} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ChevronLeft, ChevronRight, Expand, X} from 'lucide-react';
import {useModal} from '@/components/useModal';
import type {GalleryPhoto} from '@/lib/vehicle-gallery';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function VehiclePhotoViewer({photos, initialIndex = 0, onClose}: {photos: GalleryPhoto[]; initialIndex?: number; onClose: () => void}) {
  const tx = useCopy();

  const [index, setIndex] = useState(Math.max(0, Math.min(photos.length - 1, initialIndex)));
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({x: 0, y: 0});
  const pointers = useRef(new Map<number, {x: number; y: number}>());
  const gesture = useRef({x: 0, y: 0, distance: 0, scale: 1, panX: 0, panY: 0, pinched: false});
  const panel = useModal(true, onClose);
  function move(direction: number) {setIndex(value => (value + direction + photos.length) % photos.length); setScale(1); setPan({x: 0, y: 0});}
  function zoom() {setScale(value => value > 1 ? 1 : 2); setPan({x: 0, y: 0});}
  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      setIndex(value => (value + (event.key === 'ArrowRight' ? 1 : -1) + photos.length) % photos.length);
      setScale(1); setPan({x: 0, y: 0});
    }
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [photos.length]);
  function down(event: PointerEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element) || !event.target.closest('button')) event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pointers.current.size === 1) gesture.current = {x: event.clientX, y: event.clientY, distance: 0, scale, panX: pan.x, panY: pan.y, pinched: false};
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.distance = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.scale = scale; gesture.current.pinched = true;
    }
  }
  function drag(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      setScale(Math.max(1, Math.min(4, gesture.current.scale * distance / Math.max(1, gesture.current.distance))));
    } else if (scale > 1 && !gesture.current.pinched) {
      const limitX = innerWidth * (scale - 1) / 2;
      const limitY = innerWidth * .52 * (scale - 1) / 2;
      setPan({x: Math.max(-limitX, Math.min(limitX, gesture.current.panX + event.clientX - gesture.current.x)), y: Math.max(-limitY, Math.min(limitY, gesture.current.panY + event.clientY - gesture.current.y))});
    }
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (!gesture.current.pinched && scale === 1 && Math.abs(event.clientX - gesture.current.x) > 45) move(event.clientX < gesture.current.x ? 1 : -1);
  }
  const photo = photos[index];
  return <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={tx("Vehicle photo viewer")} {...stylex.props(s.viewer)}>
    <button type="button" onClick={onClose} aria-label={tx("Close photo viewer")} {...stylex.props(s.close)}><X size={20} strokeWidth={1.6} /></button>
    <div onPointerDown={down} onPointerMove={drag} onPointerUp={up} onPointerCancel={event => pointers.current.delete(event.pointerId)} {...stylex.props(s.center)}>
      <div onDoubleClick={zoom} {...stylex.props(s.stage)}>
        <img src={assetPath(photo.src)} alt={tx(photo.label)} width={1200} height={625} draggable={false} style={{transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})`}} {...stylex.props(s.image)} />
      </div>
      <button type="button" onClick={() => move(-1)} aria-label={tx("Previous photo")} {...stylex.props(s.arrow, s.previous)}><ChevronLeft size={27} /></button>
      <button type="button" onClick={() => move(1)} aria-label={tx("Next photo")} {...stylex.props(s.arrow, s.next)}><ChevronRight size={27} /></button>
      <button type="button" onClick={zoom} aria-label={tx(scale > 1 ? 'Zoom out' : 'Zoom in')} {...stylex.props(s.zoom)}><Expand size={15} />{tx(scale > 1 ? 'Zoom Out' : 'Pinch to Zoom In')}</button>
      <div {...stylex.props(s.caption)}><span>{tx(photo.label)}</span><span aria-live="polite">{tx(index + 1)} {tx(" / ")}{tx(photos.length)}</span></div>
    </div>
  </div>;
}
const s = stylex.create({
  viewer: {position: 'fixed', top: {[media.mobile]: 51, default: 0}, right: 0, bottom: {[media.mobile]: 24, default: 0}, left: 0, zIndex: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: $.fontDisplay, backgroundColor: '#000', outlineStyle: 'none'},
  close: {position: 'absolute', top: 24, right: 22, zIndex: 5, display: 'grid', placeItems: 'center', width: 27, height: 27, padding: 0, color: '#fff', borderWidth: 0, borderRadius: '50%', backgroundColor: '#333', cursor: 'pointer'},
  center: {position: 'relative', width: '100%', maxWidth: 1200, touchAction:'none', userSelect:'none'},
  stage: {position: 'relative', width: '100%', aspectRatio: '1.92', overflow: 'hidden', touchAction: 'none', userSelect: 'none'},
  image: {display: 'block', width: '100%', height: '100%', objectFit: 'cover'},
  arrow: {position: 'absolute', top: 'calc(50% - 14px)', zIndex: 3, display: 'grid', placeItems: 'center', width: 29, height: 29, padding: 0, color: '#fff', borderWidth: 0, borderRadius: '50%', backgroundColor: 'rgba(1,16,41,.85)', cursor: 'pointer'},
  previous: {left: 22}, next: {right: 22},
  zoom: {position: 'absolute', top: 'calc(50% - 16px)', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 10px', color: '#fff', fontSize: 11, fontWeight: 500, borderWidth: 0, borderRadius: 2, backgroundColor: 'rgba(5,27,58,.62)', cursor: 'pointer'},
  caption: {position: 'absolute', top: 'calc(100% + 20px)', left: 22, right: 22, display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 11, lineHeight: '18px'},
});
