'use client';
import { useLocale } from '@/lib/use-locale';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { showroom } from '@/lib/showroom';
import { Button, Modal, ui } from './ui';
export function ContactSheet({
  vehicle,
  open,
  onClose,
}: {
  vehicle: Vehicle;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  return (
    <Modal open={open} onClose={onClose} title={t('Contact the showroom')} sheet>
      <div {...stylex.props(ui.column)}>
        <strong>{t(showroom.name)}</strong>
        <p {...stylex.props(ui.muted)}>
          {vehicle.make} {vehicle.model}
        </p>
        {showroom.phone && (
          <Button icon="phone" href={'tel:' + showroom.phone} block>
            {t('Call the showroom')}
          </Button>
        )}
        <Button icon="mail" href={'/contact?vehicle=' + vehicle.id} block>
          {t('Enquire about this car')}
        </Button>
        <p {...stylex.props(ui.small, ui.muted)}>
          {t('Showroom template preview · Enquiries are saved as local drafts.')}
        </p>
        <Button variant="ghost" onClick={onClose} block>
          {t('Close')}
        </Button>
      </div>
    </Modal>
  );
}
