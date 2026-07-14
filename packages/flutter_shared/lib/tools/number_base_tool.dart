/// 进制转换工具
class NumberBaseTool {
  NumberBaseTool._();

  static const bases = [2, 8, 10, 16];

  static String convert(String input, int fromBase, int toBase) {
    if (input.trim().isEmpty) return '';
    try {
      final value = int.parse(input.trim(), radix: fromBase);
      return value.toRadixString(toBase).toUpperCase();
    } catch (_) {
      return '';
    }
  }

  static bool isValid(String input, int base) {
    if (input.trim().isEmpty) return false;
    try {
      int.parse(input.trim(), radix: base);
      return true;
    } catch (_) {
      return false;
    }
  }

  static String? validate(String input, int fromBase) {
    if (input.trim().isEmpty) return '请输入数值';
    if (!isValid(input, fromBase)) return '输入不是有效的 ${fromBase} 进制数';
    return null;
  }
}
