import 'dart:math' as math;

/// 房贷计算器
class MortgageTool {
  MortgageTool._();

  /// 等额本息月供
  /// P = 贷款总额, r = 月利率, n = 还款月数
  static double equalPayment(double p, double r, int n) {
    if (r == 0) return p / n;
    final factor = math.pow(1 + r, n).toDouble();
    return p * r * factor / (factor - 1);
  }

  /// 等额本金首月还款
  static double equalPrincipalFirst(double p, double r, int n) {
    final principalPerMonth = p / n;
    return principalPerMonth + p * r;
  }

  /// 总还款额（等额本息）
  static double totalPayment(double p, double r, int n) {
    final monthly = equalPayment(p, r, n);
    return monthly * n;
  }

  /// 总利息（等额本息）
  static double totalInterest(double p, double r, int n) {
    return totalPayment(p, r, n) - p;
  }

  /// 格式化金额
  static String format(double value) {
    if (value.isNaN || value.isInfinite) return '—';
    return '¥ ${value.toStringAsFixed(2)}';
  }
}
