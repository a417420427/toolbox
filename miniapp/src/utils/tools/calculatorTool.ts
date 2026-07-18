/**
 * 计算器工具 — 日常 + 科学计算
 * 移植自 flutter_shared/tools/calculator_tool.dart
 */

export interface CalcResult {
  result: number;
  error?: string;
}

export const CalculatorTool = {
  operators: ['+', '-', '×', '÷', '%', '^'],

  calculate(a: number, op: string, b: number): CalcResult {
    switch (op) {
      case '+': return { result: a + b };
      case '-': return { result: a - b };
      case '×': return { result: a * b };
      case '÷': return b === 0 ? { result: NaN, error: '除数不能为 0' } : { result: a / b };
      case '%': return b === 0 ? { result: NaN, error: '除数不能为 0' } : { result: a % b };
      case '^': return { result: Math.pow(a, b) };
      default: return { result: NaN, error: '不支持的运算' };
    }
  },

  scientific(func: string, value: number): CalcResult {
    switch (func) {
      case 'sin': return { result: Math.sin(value * Math.PI / 180) };
      case 'cos': return { result: Math.cos(value * Math.PI / 180) };
      case 'tan': return { result: Math.tan(value * Math.PI / 180) };
      case 'sqrt': return value < 0 ? { result: NaN, error: '负数不能开平方' } : { result: Math.sqrt(value) };
      case 'log': return value <= 0 ? { result: NaN, error: '对数参数必须大于 0' } : { result: Math.log10(value) };
      case 'ln': return value <= 0 ? { result: NaN, error: '对数参数必须大于 0' } : { result: Math.log(value) };
      case 'square': return { result: value * value };
      case 'cube': return { result: value * value * value };
      case 'reciprocal': return value === 0 ? { result: NaN, error: '不能求 0 的倒数' } : { result: 1 / value };
      case 'factorial': return factorial(value);
      case 'abs': return { result: Math.abs(value) };
      default: return { result: NaN, error: '不支持的计算' };
    }
  },

  formatResult(value: number): string {
    if (isNaN(value)) return '错误';
    if (!isFinite(value)) return '无穷大';
    if (value === Math.round(value)) return value.toString();
    return parseFloat(value.toFixed(10)).toString();
  },
};

function factorial(n: number): CalcResult {
  if (n < 0 || n !== Math.round(n)) {
    return { result: NaN, error: '阶乘仅支持非负整数' };
  }
  let m = Math.round(n);
  if (m > 170) return { result: NaN, error: '数值过大' };
  let r = 1;
  for (let i = 2; i <= m; i++) r *= i;
  return { result: r };
}
