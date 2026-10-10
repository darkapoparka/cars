import type {GalleryPhoto} from './vehicle-gallery';

/** Public listing snapshots, never a live assessment or account/transaction record. */
export type ReferenceFeature = {name: string; description?: string};
export type ReferenceFeatureGroup = {name: string; key: string; items: ReferenceFeature[]};
export type ReferenceSpecification = {key: string; label: string; value: string; description?: string};
export type ReferenceCheckpoint = {name: string; status: number | null; remarks: string[]; value?: string};
export type ReferenceInspectionGroup = {heading?: string; items: ReferenceCheckpoint[]};
export type ReferenceInspectionSection = {title: string; groups: ReferenceInspectionGroup[]};
export type ReferenceServiceRecord = {date: string; distance: string; location: string; work?: readonly string[]};
export type ReferenceServiceDue = {title: string; description: string; image: string};
export type ReferenceVehicleDetail = {
  referenceId: string;
  capturedAt: string;
  gallery: GalleryPhoto[];
  primaryImage?: string;
  subcategory?: string;
  optionsType?: string;
  videoTour?: {src:string;poster:string};
  priceComparison?: {marketPrice:number;newCarPrice?:number;cars24Price:number;totalSavings:number};
  specifications: ReferenceSpecification[];
  featureGroups: ReferenceFeatureGroup[];
  topFeatures: string[];
  highlights: {key: string; title: string; description: string}[];
  inspection: ReferenceInspectionSection[];
  serviceRecords: ReferenceServiceRecord[];
  serviceDue?: ReferenceServiceDue;
  vin?: string;
  convenienceFee?: number;
  structuralClear: boolean;
  shortListCount?: number;
  isReturnApplicable?: boolean;
};
