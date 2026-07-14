import 'dart:math';

/// 计算器 — 日常 + 科学计算
class CalculatorTool {
  CalculatorTool._();

  /// 支持的运算
  static const List<String> operators = ['+', '-', '×', '÷', '%', '^'];

  /// 基础计算
  static ({double result, String? error}) calculate(
    double a, String op, double b,
  ) {
    return switch (op) {
      '+' => (result: a + b, error: null),
      '-' => (result: a - b, error: null),
      '×' => (result: a * b, error: null),
      '÷' => b == 0 ? (result: double.nan, error: '除数不能为 0') : (result: a / b, error: null),
      '%' => b == 0 ? (result: double.nan, error: '除数不能为 0') : (result: a % b, error: null),
      '^' => (result: pow(a, b).toDouble(), error: null),
      _ => (result: double.nan, error: '不支持的运算'),
    };
  }

  /// 科学计算
  static ({double result, String? error}) scientific(
    String func, double value,
  ) {
    return switch (func) {
      'sin' => (result: sin(value * pi / 180), error: null),
      'cos' => (result: cos(value * pi / 180), error: null),
      'tan' => (result: tan(value * pi / 180), error: null),
      'sqrt' => value < 0 ? (result: double.nan, error: '负数不能开平方') : (result: sqrt(value), error: null),
      'log' => value <= 0 ? (result: double.nan, error: '对数参数必须大于 0') : (result: log(value) / ln10, error: null),
      'ln' => value <= 0 ? (result: double.nan, error: '对数参数必须大于 0') : (result: log(value), error: null),
      'square' => (result: value * value, error: null),
      'cube' => (result: value * value * value, error: null),
      'reciprocal' => value == 0 ? (result: double.nan, error: '不能求 0 的倒数') : (result: 1 / value, error: null),
      'factorial' => _factorial(value),
      'abs' => (result: value.abs(), error: null),
      _ => (result: double.nan, error: '不支持的计算'),
    };
  }

  /// 表达式求值（简单版，支持 + - × ÷）
  static ({double result, String? error}) eval(String expr) {
    try {
      // 替换 × ÷ 为 * /
      var sanitized = expr
          .replaceAll('×', '*')
          .replaceAll('÷', '/')
          .replaceAll(' ', '')
          .replaceAll(',', '.');
      // 只允许数字和基本运算符
      if (!RegExp(r'^[\d+\-*/().%]+$').hasMatch(sanitized)) {
        return (result: double.nan, error: '包含非法字符');
      }
      // Dart 不支持运行时 eval，用简单方法
      return (result: double.nan, error: '表达式求值暂不支持，请使用按钮计算');
    } catch (e) {
      return (result: double.nan, error: '计算错误: $e');
    }
  }

  /// 格式化结果 — 去掉多余的小数位
  static String formatResult(double value) {
    if (value.isNaN) return '错误';
    if (value.isInfinite) return '无穷大';
    if (value == value.roundToDouble()) {
      return value.toInt().toString();
    }
    // 限制最多 10 位小数
    return value.toStringAsFixed(10).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\.$'), '');
  }

  static ({double result, String? error}) _factorial(double n) {
    if (n < 0 || n != n.roundToDouble()) {
      return (result: double.nan, error: '阶乘仅支持非负整数');
    }
    int m = n.toInt();
    if (m > 170) {
      return (result: double.nan, error: '数值过大');
    }
    double r = 1;
    for (int i = 2; i <= m; i++) {
      r *= i;
    }
    return (result: r, error: null);
  }
}
