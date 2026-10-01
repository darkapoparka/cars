'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { saveMessageDraft, useAppState } from '@/lib/store';
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
  const { messageDrafts } = useAppState();
  const [mode, setMode] = useState<'options' | 'message' | 'call'>('options');
  function close() {
    setMode('options');
    onClose();
  }
  const [message, setMessage] = useState(
    messageDrafts[vehicle.id] ||
      'Hello, I am interested in your ' +
        vehicle.make +
        ' ' +
        vehicle.model +
        '. Is this vehicle still available?',
  );
  return (
    <Modal
      open={open}
      onClose={close}
      title={mode === 'message' ? 'Message seller' : 'Contact seller'}
      sheet
    >
      <div {...stylex.props(ui.column)}>
        <strong>{vehicle.dealer}</strong>
        <p {...stylex.props(ui.muted)}>{vehicle.location}</p>
        {mode === 'options' ? (
          <>
            <Button icon="phone" onClick={() => setMode('call')} block>
              Call
            </Button>
            <Button icon="mail" variant="outline" onClick={() => setMode('message')} block>
              Message
            </Button>
          </>
        ) : mode === 'call' ? (
          <>
            <p>Calling is not connected in this local reference. No call has been placed.</p>
            <Button variant="outline" onClick={() => setMode('options')} block>
              Back to contact options
            </Button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMessageDraft(vehicle.id, message);
              close();
            }}
            {...stylex.props(ui.column)}
          >
            <label {...stylex.props(ui.label)}>
              Your message
              <textarea
                aria-label="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={4000}
                rows={6}
              />
            </label>
            <p {...stylex.props(ui.small, ui.muted)}>
              Local demonstration — this message will not reach the seller.
            </p>
            <Button type="submit" block>
              Save message draft
            </Button>
          </form>
        )}
        <p {...stylex.props(ui.small, ui.muted)}>
          Independent UI reference. No connection to mobile.de or this dealer.
        </p>
        <Button variant="ghost" onClick={close} block>
          Close
        </Button>
      </div>
    </Modal>
  );
}
