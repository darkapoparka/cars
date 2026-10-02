'use client';
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
  return (
    <Modal open={open} onClose={onClose} title="Contact the showroom" sheet>
      <div {...stylex.props(ui.column)}>
        <strong>{showroom.name}</strong>
        <p {...stylex.props(ui.muted)}>
          {vehicle.make} {vehicle.model}
        </p>
        {showroom.phone && (
          <Button icon="phone" href={'tel:' + showroom.phone} block>
            Call the showroom
          </Button>
        )}
        <Button icon="mail" href={'/contact?vehicle=' + vehicle.id} block>
          Enquire about this car
        </Button>
        <p {...stylex.props(ui.small, ui.muted)}>
          Showroom template preview · Enquiries are saved as local drafts.
        </p>
        <Button variant="ghost" onClick={onClose} block>
          Close
        </Button>
      </div>
    </Modal>
  );
}
