/// 复利 / 投资回报计算
class InvestmentTool {
  InvestmentTool._();

  /// 复利终值 FV = PV × (1 + r)^n
  static double futureValue(double pv, double annualRate, int years, {int compoundPerYear = 12}) {
    final r = annualRate / 100 / compoundPerYear;
    final n = years * compoundPerYear;
    return pv * _pow(1 + r, n);
  }

  /// 每月定投终值 FV = PMT × ((1 + r)^n - 1) / r
  static double futureValueWithMonthly(double pv, double monthlyInvest, double annualRate, int years) {
    final r = annualRate / 100 / 12;
    final n = years * 12;
    final fvPV = pv * _pow(1 + r, n);
    final fvPMT = monthlyInvest * (_pow(1 + r, n) - 1) / r;
    return fvPV + fvPMT;
  }

  /// 所需本金
  static double requiredPrincipal(double targetFV, double annualRate, int years) {
    final r = annualRate / 100 / 12;
    final n = years * 12;
    return targetFV / _pow(1 + r, n);
  }

  static double _pow(double x, int n) {
    double result = 1;
    for (int i = 0; i < n; i++) { result *= x; }
    return result;
  }

  static String format(double value) {
    if (value.isNaN || value.isInfinite) return '—';
    return '¥ ${value.toStringAsFixed(2)}';
  }
}
