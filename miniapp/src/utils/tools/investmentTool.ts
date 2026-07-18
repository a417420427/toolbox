/**
 * 投资计算 — 复利 / 定投
 * 移植自 flutter_shared/tools/investment_tool.dart
 */

function pow(x: number, n: number): number {
  let r = 1;
  for (let i = 0; i < n; i++) r *= x;
  return r;
}

export const InvestmentTool = {
  /** 复利终值 */
  futureValue(pv: number, annualRate: number, years: number, compoundPerYear = 12): number {
    const r = annualRate / 100 / compoundPerYear;
    const n = years * compoundPerYear;
    return pv * pow(1 + r, n);
  },

  /** 每月定投终值 */
  futureValueWithMonthly(pv: number, monthlyInvest: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const fvPV = pv * pow(1 + r, n);
    const fvPMT = monthlyInvest * (pow(1 + r, n) - 1) / r;
    return fvPV + fvPMT;
  },

  /** 所需本金 */
  requiredPrincipal(targetFV: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return targetFV / pow(1 + r, n);
  },

  format(value: number): string {
    if (isNaN(value) || !isFinite(value)) return '—';
    return `¥ ${value.toFixed(2)}`;
  },
};
