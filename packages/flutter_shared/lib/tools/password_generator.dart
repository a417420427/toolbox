import 'dart:math' as dartmath;

/// 密码生成器
class PasswordGenerator {
  PasswordGenerator._();

  static const String lowercase = 'abcdefghijklmnopqrstuvwxyz';
  static const String uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static const String digits = '0123456789';
  static const String symbols = '!@#\$%^&*()_+-=[]{}|;:,.<>?';

  static String generate({
    int length = 16,
    bool useLower = true,
    bool useUpper = true,
    bool useDigits = true,
    bool useSymbols = true,
    bool excludeAmbiguous = false,
  }) {
    String chars = '';
    if (useLower) chars += lowercase;
    if (useUpper) chars += uppercase;
    if (useDigits) chars += digits;
    if (useSymbols) chars += symbols;

    if (excludeAmbiguous) {
      chars = chars.replaceAll(RegExp(r'[0Ool1I!|]'), '');
    }

    if (chars.isEmpty) chars = lowercase + digits;

    final random = dartmath.Random();
    return List.generate(length, (_) => chars[random.nextInt(chars.length)]).join();
  }

  /// 密码强度 0-4
  static int strength(String password) {
    int score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (RegExp(r'[a-z]').hasMatch(password)) score++;
    if (RegExp(r'[A-Z]').hasMatch(password)) score++;
    if (RegExp(r'\d').hasMatch(password)) score++;
    if (RegExp(r'[!@#\$%^&*()_+\-=\[\]{}|;:,.<>?]').hasMatch(password)) score++;
    return score;
  }

  static String strengthLabel(int score) {
    if (score <= 1) return '弱';
    if (score <= 3) return '中等';
    if (score <= 4) return '强';
    return '非常强';
  }
}
