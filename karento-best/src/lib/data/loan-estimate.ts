export interface LoanEstimateInputs {
  readonly price: number;
  readonly annualRate: number;
  readonly termMonths: number;
  readonly downPayment: number;
}

export type LoanFieldKey = keyof LoanEstimateInputs;
export type LoanEstimateDraft = {
  [Key in LoanFieldKey]: number | undefined;
};
export type LoanEstimateErrors = Partial<Record<LoanFieldKey, true>>;

export interface LoanCalculatorState {
  values: LoanEstimateDraft;
  currency: string;
  selectedVehicleId: string;
}

/** Each presentation owner gets its own mutable draft, separate from defaults. */
export function createLoanCalculatorState(
  defaults: LoanEstimateInputs,
  currency: string,
): LoanCalculatorState {
  return { values: { ...defaults }, currency, selectedVehicleId: "" };
}

export type LoanEstimateResult =
  | {
      readonly valid: true;
      readonly downPayment: number;
      readonly financed: number;
      readonly monthly: number;
    }
  | {
      readonly valid: false;
      readonly errors: LoanEstimateErrors;
      readonly calculationError: boolean;
    };

/** A fixed-rate, equal-payment estimate. Supplied lender fees are not included. */
export function calculateLoanEstimate(
  input: LoanEstimateDraft,
): LoanEstimateResult {
  const errors: LoanEstimateErrors = {};
  const { price, annualRate, termMonths, downPayment } = input;
  if (price === undefined || !Number.isFinite(price) || price <= 0)
    errors.price = true;
  if (
    annualRate === undefined ||
    !Number.isFinite(annualRate) ||
    annualRate < 0
  )
    errors.annualRate = true;
  if (
    termMonths === undefined ||
    !Number.isSafeInteger(termMonths) ||
    termMonths <= 0
  )
    errors.termMonths = true;
  if (
    downPayment === undefined ||
    !Number.isFinite(downPayment) ||
    downPayment < 0 ||
    (price !== undefined && downPayment > price)
  )
    errors.downPayment = true;
  if (
    Object.keys(errors).length ||
    price === undefined ||
    annualRate === undefined ||
    termMonths === undefined ||
    downPayment === undefined
  )
    return { valid: false, errors, calculationError: false };

  const financed = price - downPayment;
  const monthlyRate = annualRate / 1200;
  const monthly =
    financed === 0
      ? 0
      : monthlyRate === 0
        ? financed / termMonths
        : (financed * monthlyRate) /
          -Math.expm1(-termMonths * Math.log1p(monthlyRate));
  if (!Number.isFinite(monthly))
    return { valid: false, errors: {}, calculationError: true };
  return { valid: true, downPayment, financed, monthly };
}
