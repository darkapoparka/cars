import {dealer} from './dealer-config';
import type {ReferenceServiceRecord} from './reference-types';

export type VehicleServiceHistoryData={records:readonly ReferenceServiceRecord[];isSample:boolean};

// Fictional visits for the template preview only. Never carried into dealer mode.
const sampleRecords:Record<string,readonly ReferenceServiceRecord[]>={
  '2024-toyota-fortuner-exr':[
    {date:'2026-07-12',distance:'48,000 km',location:'Independent workshop',work:['Engine oil and oil filter changed','Brakes and tyres checked']},
    {date:'2025-10-08',distance:'32,000 km',location:'Independent workshop',work:['Engine oil, oil filter and air filter changed']},
    {date:'2024-11-21',distance:'16,000 km',location:'Independent workshop',work:['Scheduled maintenance and fluid check']},
  ],
};

export function getVehicleServiceHistory(slug:string,provided?:readonly ReferenceServiceRecord[]):VehicleServiceHistoryData {
  if(provided?.length)return {records:provided,isSample:false};
  const records=dealer.mode==='template'?sampleRecords[slug]??[]:[];
  return {records,isSample:records.length>0};
}
