'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { money, paymentEstimate } from '@/lib/search';
import type { Vehicle } from '@/lib/types';
import { Button, ui } from './ui';
const s = stylex.create({
  price: { fontFamily: 'var(--font-hero)', fontSize: 36, fontWeight: 700, color: colors.purple },
  range: { width: '100%', height: 30 },
  summary: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
});
export function FinanceCalculator({
  vehicle: v,
  onClose,
}: {
  vehicle: Vehicle;
  onClose?: () => void;
}) {
  const [deposit, setDeposit] = useState(Math.round(v.price * 0.2));
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(7.9);
  const payment = paymentEstimate(v.price, deposit, months, rate);
  return (
    <div {...stylex.props(ui.column)}>
      <h3>
        {v.make} {v.model}
      </h3>
      <div {...stylex.props(ui.center)}>
        <p {...stylex.props(ui.muted)}>Estimated monthly payment</p>
        <p {...stylex.props(s.price)}>
          {money(payment)}
          <span {...stylex.props(ui.text)}> mth.</span>
        </p>
      </div>
      <label {...stylex.props(ui.label)}>
        Down payment <strong>{money(deposit)}</strong>
        <input
          type="range"
          min={0}
          max={v.price}
          step={100}
          value={deposit}
          onChange={(e) => setDeposit(Math.min(v.price, Number(e.target.value)))}
          {...stylex.props(s.range)}
        />
      </label>
      <label {...stylex.props(ui.label)}>
        Term
        <select
          aria-label="Term"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          {...stylex.props(ui.input)}
        >
          {[12, 24, 36, 48, 60, 72, 84, 96].map((m) => (
            <option key={m} value={m}>
              {m} months
            </option>
          ))}
        </select>
      </label>
      <label {...stylex.props(ui.label)}>
        Assumed annual interest rate (%)
        <input
          type="number"
          aria-label="Assumed annual interest rate (%)"
          min="0"
          max="30"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Math.max(0, Math.min(30, Number(e.target.value))))}
          {...stylex.props(ui.input)}
        />
      </label>
      <div {...stylex.props(s.summary)}>
        <span>Vehicle price</span>
        <strong>{money(v.price)}</strong>
        <span>Loan amount</span>
        <strong>{money(v.price - deposit)}</strong>
        <span>Total instalments</span>
        <strong>{money(payment * months)}</strong>
      </div>
      <p {...stylex.props(ui.small, ui.muted)}>
        Illustrative local calculator using an assumed rate, not a finance offer or application.
        Excludes lender fees and any balloon payment.
      </p>
      {onClose && (
        <Button variant="purple" onClick={onClose} block>
          Done
        </Button>
      )}
    </div>
  );
}
