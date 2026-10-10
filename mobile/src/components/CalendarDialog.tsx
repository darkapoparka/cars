'use client';
import { useState } from 'react';
import { isISODate } from '@/lib/enquiry';
import * as stylex from '@stylexjs/stylex';
import { Modal, IconButton, ui } from './ui';
import { colors } from '@/styles/tokens.stylex';
const s = stylex.create({
  body: { fontFamily: 'AndroidReference, sans-serif', color: '#484651' },
  head: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  label: { fontSize: 14, lineHeight: '20px', marginBottom: 24 },
  selectedDate: { fontSize: 32, lineHeight: '40px', fontWeight: 400 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navigation: {
    paddingLeft: 24,
    paddingRight: 12,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 500,
  },
  month: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 500,
    fontSize: 14,
    padding: 0,
    textAlign: 'left',
    flex: '1',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', paddingInline: 12 },
  week: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    fontSize: 14,
  },
  day: {
    height: 48,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: '#545866',
    fontSize: 16,
    fontFamily: 'inherit',
    padding: 2,
  },
  number: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chosen: { backgroundColor: '#354477', color: '#fff' },
  past: { color: '#aaa' },
  actions: { display: 'flex', justifyContent: 'flex-end', padding: 12, gap: 8 },
  action: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.accent,
    minWidth: 64,
    height: 40,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 500,
  },
  editor: { minHeight: 360, padding: 24 },
  years: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    maxHeight: 336,
    overflowY: 'auto',
    padding: 12,
  },
});
const iso = (year: number, month: number, day: number) =>
  [year, String(month + 1).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
export function CalendarDialog({
  value,
  minDate,
  onClose,
  onApply,
}: {
  value: string;
  minDate: string;
  onClose: () => void;
  onApply: (date: string) => void;
}) {
  const [selected, setSelected] = useState(isISODate(value) && value >= minDate ? value : minDate);
  const [view, setView] = useState(() => {
    const [year, month] = (isISODate(value) && value >= minDate ? value : minDate)
      .split('-')
      .map(Number);
    return { year, month: month - 1 };
  });
  const [mode, setMode] = useState<'calendar' | 'input' | 'year'>('calendar');
  const date = new Date(selected + 'T12:00:00');
  const first = new Date(view.year, view.month, 1).getDay();
  const days = new Date(view.year, view.month + 1, 0).getDate();
  function move(amount: number) {
    const next = new Date(view.year, view.month + amount, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  }
  const valid = isISODate(selected) && selected >= minDate;
  return (
    <Modal material label="Select Date" open onClose={onClose}>
      <div {...stylex.props(s.body)}>
        <div {...stylex.props(s.head)}>
          <p {...stylex.props(s.label)}>Select Date</p>
          <div {...stylex.props(s.row)}>
            <h2 {...stylex.props(s.selectedDate)}>
              {valid
                ? date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Enter date'}
            </h2>
            <IconButton
              icon="edit"
              label="Toggle date input"
              onClick={() => setMode(mode === 'input' ? 'calendar' : 'input')}
            />
          </div>
        </div>
        {mode === 'input' ? (
          <div {...stylex.props(s.editor)}>
            <label {...stylex.props(ui.label)}>
              Date
              <input
                type="date"
                aria-label="Enter desired date"
                min={minDate}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
                {...stylex.props(ui.input)}
              />
            </label>
          </div>
        ) : (
          <>
            <div {...stylex.props(s.navigation)}>
              <button
                type="button"
                onClick={() => setMode(mode === 'year' ? 'calendar' : 'year')}
                {...stylex.props(s.month)}
              >
                {new Date(view.year, view.month, 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                ▾
              </button>
              <IconButton icon="left" label="Previous month" onClick={() => move(-1)} />
              <IconButton icon="right" label="Next month" onClick={() => move(1)} />
            </div>
            {mode === 'year' ? (
              <div {...stylex.props(s.years)}>
                {Array.from({ length: 51 }, (_, i) => Number(minDate.slice(0, 4)) + i).map(
                  (year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setView({ ...view, year });
                        setMode('calendar');
                      }}
                      {...stylex.props(s.day)}
                    >
                      {year}
                    </button>
                  ),
                )}
              </div>
            ) : (
              <>
                <div {...stylex.props(s.grid)}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
                    <span key={index} {...stylex.props(s.week)}>
                      {label}
                    </span>
                  ))}
                </div>
                <div {...stylex.props(s.grid)}>
                  {Array.from({ length: 42 }, (_, index) => {
                    const day = index - first + 1;
                    if (day < 1 || day > days)
                      return <span key={index} {...stylex.props(s.week)} />;
                    const value = iso(view.year, view.month, day);
                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={value < minDate}
                        aria-pressed={value === selected}
                        aria-label={new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        onClick={() => setSelected(value)}
                        {...stylex.props(s.day, value < minDate && s.past)}
                      >
                        <span {...stylex.props(s.number, value === selected && s.chosen)}>
                          {day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
        <div {...stylex.props(s.actions)}>
          <button type="button" onClick={onClose} {...stylex.props(s.action)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onApply(selected)}
            {...stylex.props(s.action)}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
}
