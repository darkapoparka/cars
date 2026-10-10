import {capturedRelatedVehicles} from './captured-related';
import type {Vehicle} from './vehicle';

/** The archived Fortuner comparison belongs only to the template preview. */
export function selectSimilarVehicles(slug: string, related: readonly Vehicle[], mode: 'template' | 'dealer'): readonly Vehicle[] {
  return mode === 'template' && slug === '2024-toyota-fortuner-exr' ? capturedRelatedVehicles : related;
}
