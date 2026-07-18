/**
 * 房贷计算器
 * 移植自 flutter_shared/tools/mortgage_tool.dart
 */

export const MortgageTool = {
  /** 等额本息月供 */
  equalPayment(p: number, r: number, n: number): number {
    if (r === 0) return p / n;
    const factor = Math.pow(1 + r, n);
    return p * r * factor / (factor - 1);
  },

  /** 等额本金首月还款 */
  equalPrincipalFirst(p: number, r: number, n: number): number {
    return p / n + p * r;
  },

  /** 总还款额（等额本息） */
  totalPayment(p: number, r: number, n: number): number {
    return this.equalPayment(p, r, n) * n;
  },

  /** 总利息（等额本息） */
  totalInterest(p: number, r: number, n: number): number {
    return this.totalPayment(p, r, n) - p;
  },

  /** 格式化金额 */
  format(value: number): string {
    if (isNaN(value) || !isFinite(value)) return '—';
    return `¥ ${value.toFixed(2)}`;
  },
};
