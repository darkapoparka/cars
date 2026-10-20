'use client';
import { useLocale } from '@/lib/use-locale';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import type { ShowroomService } from '@/lib/showroom-services';
import { showroom } from '@/lib/showroom';
import { Button, Modal, ui } from './ui';
export function ContactSheet({
  vehicle,
  service,
  open,
  onClose,
}: {
  vehicle?: Vehicle;
  service?: ShowroomService;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const subject = vehicle ? `${vehicle.make} ${vehicle.model}` : service ? t(service.title) : null;
  const enquiryHref = vehicle
    ? '/contact?vehicle=' + vehicle.id
    : service
      ? '/contact?service=' + encodeURIComponent(service.id)
      : '/contact';
  return (
    <Modal open={open} onClose={onClose} title={t('Contact the showroom')} sheet>
      <div {...stylex.props(ui.column)}>
        <strong>{t(showroom.name)}</strong>
        {subject && <p {...stylex.props(ui.muted)}>{subject}</p>}
        {showroom.phone && (
          <Button icon="phone" href={'tel:' + showroom.phone} block>
            {t('Call the showroom')}
          </Button>
        )}
        <Button icon="mail" href={enquiryHref} block>
          {t(vehicle ? 'Enquire about this car' : 'Enquire')}
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
