'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { lockDocumentScroll } from '@/lib/scroll-lock';
import { clampPhotoPan } from '@/lib/gallery';
import {
  vehicleGalleryReturnHref,
  vehiclePhotoViewerIndex,
  vehiclePhotoViewerState,
} from '@/lib/vehicle-detail-navigation';
import { setVehiclePhoto } from '@/lib/store';
import type { Vehicle } from '@/lib/types';
import { Header } from './Header';
import { Button } from './ui';
import { Icon } from './Icon';
import { ContactSheet } from './ContactSheet';
import { useVehicleGalleryReturnSection } from './useVehicleDetailSection';
const s = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 800px)': 'repeat(3,minmax(0,1fr))',
    },
    gap: 12,
    padding: 12,
    paddingBottom: 84,
  },
  tile: {
    position: 'relative',
    aspectRatio: '4 / 3',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  embeddedGrid: { padding: 0, gap: 8 },
  singlePhoto: { gridTemplateColumns: 'minmax(0,1fr)' },
  embeddedTile: { borderWidth: 0, borderRadius: 12 },
  photo: { objectFit: 'cover' },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 1100,
    backgroundColor: colors.background,
    padding: 12,
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
    paddingInline: 16,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridAutoRows: 48,
    gap: 8,
    zIndex: 30,
  },
  viewer: {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100dvh',
    maxWidth: 'none',
    maxHeight: 'none',
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: '#000',
    color: '#fff',
    overflow: 'hidden',
  },
  close: { position: 'absolute', top: 'max(16px, env(safe-area-inset-top))', left: 16, zIndex: 3 },
  round: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    borderWidth: 0,
    backgroundColor: '#090a0d',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    touchAction: 'none',
  },
  fullPhoto: { objectFit: 'contain', userSelect: 'none' },
  transform: (scale: number, x: number, y: number) => ({
    transform: `translate(${x}px,${y}px) scale(${scale})`,
  }),
  viewerFooter: {
    position: 'absolute',
    bottom: 'calc(8px + env(safe-area-inset-bottom))',
    left: 16,
    right: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  count: {
    paddingInline: 8,
    paddingBlock: 4,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '24px',
    backgroundColor: '#090a0d',
  },
});
export function GalleryScreen({
  vehicle: v,
  embedded = false,
}: {
  vehicle: Vehicle;
  embedded?: boolean;
}) {
  const returnSection = useVehicleGalleryReturnSection();
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [contact, setContact] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const gesture = useRef({ x: 0, y: 0, distance: 0, scale: 1, panX: 0, panY: 0, multi: false });
  const open = index !== null;
  useEffect(() => {
    if (index === null) return;
    setVehiclePhoto(v.id, index);
    if (embedded && vehiclePhotoViewerIndex(window.history.state, v.id, v.images.length) !== null) {
      window.history.replaceState(
        vehiclePhotoViewerState(window.history.state, v.id, index),
        '',
        window.location.href,
      );
    }
  }, [index, v.id, embedded, v.images.length]);
  useEffect(() => {
    if (!embedded) return;
    function restoreViewer() {
      const saved = vehiclePhotoViewerIndex(window.history.state, v.id, v.images.length);
      if (saved !== null) {
        setIndex(saved);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      } else {
        const wasOpen = ref.current?.open;
        ref.current?.close();
        setIndex(null);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        if (wasOpen && opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      }
    }
    restoreViewer();
    window.addEventListener('popstate', restoreViewer);
    return () => window.removeEventListener('popstate', restoreViewer);
  }, [embedded, v.id, v.images.length]);
  function resetZoom() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }
  function move(direction: number) {
    setIndex((i) => (i === null ? null : (i + direction + v.images.length) % v.images.length));
    resetZoom();
  }
  function close() {
    if (embedded && vehiclePhotoViewerIndex(window.history.state, v.id, v.images.length) !== null) {
      window.history.back();
      return;
    }
    ref.current?.close();
    setIndex(null);
    resetZoom();
    opener.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const release = lockDocumentScroll();
    return () => {
      dialog?.close();
      release();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    function key(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
        setIndex((i) =>
          i === null
            ? null
            : (i + (event.key === 'ArrowRight' ? 1 : -1) + v.images.length) % v.images.length,
        );
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom((z) => Math.min(4, z + 0.5));
      }
      if (event.key === '-') {
        event.preventDefault();
        setZoom((z) => Math.max(1, z - 0.5));
        setPan({ x: 0, y: 0 });
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, v.images.length]);
  return (
    <>
      {!embedded && (
        <Header
          title={v.images.length + ' Images'}
          back={vehicleGalleryReturnHref(v.id, returnSection)}
        />
      )}
      <div
        data-gallery-inline={embedded || undefined}
        {...stylex.props(
          s.grid,
          embedded && s.embeddedGrid,
          embedded && v.images.length === 1 && s.singlePhoto,
        )}
      >
        {v.images.map((src, i) => (
          <button
            type="button"
            key={src}
            aria-label={'Open vehicle image ' + (i + 1)}
            onClick={(event) => {
              opener.current = event.currentTarget;
              if (embedded)
                window.history.pushState(
                  vehiclePhotoViewerState(window.history.state, v.id, i),
                  '',
                  window.location.href,
                );
              setIndex(i);
              resetZoom();
            }}
            {...stylex.props(s.tile, embedded && s.embeddedTile)}
          >
            <Image
              src={src}
              alt={v.make + ' ' + v.model + ' photo ' + (i + 1)}
              fill
              sizes={
                embedded && v.images.length === 1
                  ? '(min-width:1100px) 1068px, 100vw'
                  : '(min-width:800px) 33vw, 50vw'
              }
              {...stylex.props(s.photo)}
            />
          </button>
        ))}
      </div>
      {!embedded && (
        <div {...stylex.props(s.footer)}>
          <Button icon="phone" onClick={() => setContact(true)}>
            Call
          </Button>
          <Button icon="mail" href={'/vehicle/' + v.id + '/message'}>
            E-mail
          </Button>
        </div>
      )}
      {!embedded && <ContactSheet vehicle={v} open={contact} onClose={() => setContact(false)} />}
      {index !== null && (
        <dialog
          ref={ref}
          aria-label="Vehicle photo viewer"
          onCancel={(event) => {
            event.preventDefault();
            event.stopPropagation();
            close();
          }}
          {...stylex.props(s.viewer)}
        >
          <button
            type="button"
            aria-label="Close photo viewer"
            onClick={close}
            {...stylex.props(s.round, s.close)}
          >
            <Icon name="close" size={30} />
          </button>
          <div
            data-testid="photo-frame"
            {...stylex.props(s.frame)}
            onDoubleClick={() => {
              setZoom(zoom > 1 ? 1 : 2);
              setPan({ x: 0, y: 0 });
            }}
            onTouchStart={(event) => {
              const one = event.touches[0],
                two = event.touches[1];
              if (!one) return;
              gesture.current = {
                x: one.clientX,
                y: one.clientY,
                distance: two
                  ? Math.hypot(one.clientX - two.clientX, one.clientY - two.clientY)
                  : 0,
                scale: zoom,
                panX: pan.x,
                panY: pan.y,
                multi: Boolean(two),
              };
            }}
            onTouchMove={(event) => {
              const one = event.touches[0],
                two = event.touches[1],
                start = gesture.current;
              if (!one) return;
              const image = event.currentTarget.querySelector('img');
              const bounded = (x: number, y: number, scale: number) =>
                clampPhotoPan(
                  { x, y },
                  scale,
                  event.currentTarget.clientWidth,
                  event.currentTarget.clientHeight,
                  image?.naturalWidth || 0,
                  image?.naturalHeight || 0,
                );
              if (two && start.distance) {
                const nextZoom = Math.max(
                  1,
                  Math.min(
                    4,
                    (start.scale *
                      Math.hypot(one.clientX - two.clientX, one.clientY - two.clientY)) /
                      start.distance,
                  ),
                );
                setZoom(nextZoom);
                setPan(bounded(start.panX, start.panY, nextZoom));
              } else if (zoom > 1)
                setPan(
                  bounded(
                    start.panX + one.clientX - start.x,
                    start.panY + one.clientY - start.y,
                    zoom,
                  ),
                );
            }}
            onTouchEnd={(event) => {
              if (event.touches.length || !event.changedTouches[0]) return;
              const dx = event.changedTouches[0].clientX - gesture.current.x,
                dy = event.changedTouches[0].clientY - gesture.current.y;
              if (
                !gesture.current.multi &&
                zoom === 1 &&
                Math.abs(dx) > 50 &&
                Math.abs(dx) > Math.abs(dy)
              )
                move(dx < 0 ? 1 : -1);
            }}
            onTouchCancel={() => {
              gesture.current.multi = true;
            }}
          >
            <Image
              src={v.images[index]}
              alt={v.make + ' ' + v.model + ' photo ' + (index + 1)}
              fill
              sizes="100vw"
              draggable={false}
              {...stylex.props(s.fullPhoto, s.transform(zoom, pan.x, pan.y))}
            />
          </div>
          <div {...stylex.props(s.viewerFooter)}>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => move(-1)}
              {...stylex.props(s.round)}
            >
              <Icon name="left" size={32} />
            </button>
            <output aria-live="polite" {...stylex.props(s.count)}>
              {index + 1} / {v.images.length}
            </output>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => move(1)}
              {...stylex.props(s.round)}
            >
              <Icon name="right" size={32} />
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
