'use client';
import { useSyncExternalStore } from 'react';
import {
  vehicleDetailHashSection,
  vehicleDetailSection,
  vehicleDetailSectionHref,
  type VehicleDetailSection,
} from '@/lib/vehicle-detail-navigation';

const changed = 'cars-mobile-detail-section';
function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  window.addEventListener('popstate', listener);
  window.addEventListener(changed, listener);
  return () => {
    window.removeEventListener('hashchange', listener);
    window.removeEventListener('popstate', listener);
    window.removeEventListener(changed, listener);
  };
}
const serverSection = () => 'details' as const;
const currentSection = () => vehicleDetailHashSection(window.location.hash);
const galleryReturnSection = () =>
  vehicleDetailSection(new URLSearchParams(window.location.search).get('returnSection'));

export function useVehicleDetailSection() {
  return useSyncExternalStore(subscribe, currentSection, serverSection);
}

export function useVehicleGalleryReturnSection() {
  return useSyncExternalStore(subscribe, galleryReturnSection, serverSection);
}

export function selectVehicleDetailSection(section: VehicleDetailSection) {
  // A section is a view within this PDP: keep the inventory Back entry intact.
  window.history.replaceState(
    window.history.state,
    '',
    vehicleDetailSectionHref(window.location.href, section),
  );
  window.dispatchEvent(new Event(changed));
}
