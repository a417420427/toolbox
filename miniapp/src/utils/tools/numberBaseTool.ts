/**
 * 进制转换工具
 * 移植自 flutter_shared/tools/number_base_tool.dart
 */

export const NumberBaseTool = {
  bases: [2, 8, 10, 16],

  convert(input: string, fromBase: number, toBase: number): string {
    if (!input.trim()) return '';
    try {
      const value = parseInt(input.trim(), fromBase);
      if (isNaN(value)) return '';
      return value.toString(toBase).toUpperCase();
    } catch {
      return '';
    }
  },

  isValid(input: string, base: number): boolean {
    if (!input.trim()) return false;
    try {
      const val = parseInt(input.trim(), base);
      return !isNaN(val);
    } catch {
      return false;
    }
  },

  validate(input: string, fromBase: number): string | undefined {
    if (!input.trim()) return '请输入数值';
    if (!this.isValid(input, fromBase)) return `输入不是有效的 ${fromBase} 进制数`;
    return undefined;
  },
};
