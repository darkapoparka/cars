'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { vehicles } from '@/lib/catalog';
import { showroomInventoryHref } from '@/lib/showroom';
import { restoreInventoryPosition } from '@/lib/inventory-navigation';
import { useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { Button, ui } from './ui';
import { s } from './showroom-pages.stylex';

export function SavedCarsScreen() {
  const { t, locale } = useLocale();
  const { parked, filters, inventorySort } = useAppState();
  const saved = vehicles.filter((vehicle) => parked.includes(vehicle.id));
  useEffect(restoreInventoryPosition, []);
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>{t('Saved cars')}</h1>
          <p {...stylex.props(s.intro)}>
            {saved.length
              ? locale === 'bg'
                ? saved.length +
                  (saved.length === 1 ? ' кола е запазена' : ' коли са запазени') +
                  ' на това устройство.'
                : saved.length + (saved.length === 1 ? ' car' : ' cars') + ' saved on this device.'
              : t('Keep the cars you like in one place.')}
          </p>
        </div>
        {saved.length ? (
          <div {...stylex.props(s.grid)}>
            {saved.map((vehicle) => (
              <ShowroomVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <Icon name="heart" size={44} />
            <h2 {...stylex.props(ui.title)}>{t('Your shortlist starts here')}</h2>
            <p>{t('Tap the heart on a car to save it for later.')}</p>
            <Button href={showroomInventoryHref(filters, inventorySort)}>{t('Browse cars')}</Button>
          </div>
        )}
      </div>
    </>
  );
}
