"use client";

import { leadSite } from '@repo/marketplace';
import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getLocalizedPublicPath } from '../lib/public-path';
import type { MarketplaceMode } from './marketplace-masthead';

export const DealerDesktopHeader=({activeMode='buy',children,homeHref,locale}:{activeMode?:MarketplaceMode|null;children?:ReactNode;homeHref?:string;locale?:string})=>{
  const isBg=locale?.toLowerCase().startsWith('bg')??false;
  const destinations=[
    {id:'buy',path:'/cars',label:isBg?'Автомобили':'Cars'},
    {id:'sell',path:'/sell',label:isBg?'Твоят автомобил':'Your car'},
    {id:'imports',path:'/imports',label:isBg?'Произход':'Vehicle origin'},
    {id:'lease',path:'/lease',label:isBg?'Плащане':'Payment'}
  ];
  return (<>
    <header className="dealer-desktop-header hidden lg:block" data-has-search={Boolean(children)} data-slot="dealer-desktop-header">
      <div className="dealer-desktop-nav">
        <Link aria-label={`${leadSite.name} — ${isBg?'начало':'home'}`} className="dealer-desktop-brand" href={homeHref??getLocalizedPublicPath(locale,'/')}>
          <Image alt={leadSite.name} className="object-contain object-left" fill priority sizes="220px" src={leadSite.logoPath} />
        </Link>
        <nav aria-label={isBg?'Основни действия':'Primary dealership navigation'} className="dealer-desktop-segments">
          {destinations.map(destination=>(<Link aria-current={activeMode===destination.id?'page':undefined} data-marketplace-mode={destination.id} data-slot="marketplace-mode-action" href={getLocalizedPublicPath(locale,destination.path)} key={destination.id}>{destination.label}</Link>))}
        </nav>
        <div className="dealer-desktop-contact">
          <a aria-label={isBg?`Обадете се на ${leadSite.phoneDisplay}`:`Call ${leadSite.phoneDisplay}`} href={leadSite.phoneHref}><Phone aria-hidden="true" size={18} strokeWidth={1.8} /><span>{leadSite.phoneDisplay}</span></a>
          <a aria-label={isBg?`Адрес: ${leadSite.address}`:`Address: ${leadSite.address}`} className="dealer-desktop-showroom" href={leadSite.mapsUrl} rel="noreferrer" target="_blank"><MapPin aria-hidden="true" size={18} strokeWidth={1.8} /><span>{isBg?'Адрес':'Address'}</span></a>
        </div>
      </div>
    </header>
    {children}
  </>);
};
