'use client';
import * as stylex from '@stylexjs/stylex';
import { vehicles } from '@/lib/catalog';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, ui } from './ui';
export function MessageDrafts() {
  const { messageDrafts } = useAppState();
  return (
    <>
      <Header title="Messages" back="/" />
      <div {...stylex.props(ui.pad, ui.column)}>
        <h2 {...stylex.props(ui.title)}>Local message drafts</h2>
        <p {...stylex.props(ui.small, ui.muted)}>
          These drafts are stored in this browser. Nothing has been sent to a seller.
        </p>
        {Object.entries(messageDrafts).map(([id, message]) => {
          const vehicle = vehicles.find((item) => item.id === id);
          if (!vehicle) return null;
          return (
            <section key={id} {...stylex.props(ui.card, ui.column)}>
              <h3>
                {vehicle.make} {vehicle.model}
              </h3>
              <p>{vehicle.dealer}</p>
              <p>{message}</p>
              <Button href={'/vehicle/' + id} variant="outline">
                View vehicle
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  patchState({
                    messageDrafts: Object.fromEntries(
                      Object.entries(messageDrafts).filter(([key]) => key !== id),
                    ),
                  })
                }
              >
                Delete draft
              </Button>
            </section>
          );
        })}
      </div>
    </>
  );
}
