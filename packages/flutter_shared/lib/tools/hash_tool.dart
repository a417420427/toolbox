import 'dart:convert';
import 'package:crypto/crypto.dart' as crypto;

/// 哈希工具 — MD5 / SHA-1 / SHA-256 / SHA-512
class HashTool {
  HashTool._();

  /// 支持的算法
  static const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-224', 'SHA-512', 'SHA-384'];

  /// 计算文本哈希
  static Map<String, String> hashText(String input, {bool uppercase = false}) {
    if (input.isEmpty) {
      final result = <String, String>{};
      for (final algo in algorithms) {
        result[algo] = _hashString(utf8.encode(''), algo, uppercase);
      }
      return result;
    }
    final bytes = utf8.encode(input);
    final result = <String, String>{};
    for (final algo in algorithms) {
      result[algo] = _hashString(bytes, algo, uppercase);
    }
    return result;
  }

  /// 计算单算法哈希
  static String hashSingle(String input, String algorithm, {bool uppercase = false}) {
    final bytes = utf8.encode(input);
    return _hashString(bytes, algorithm, uppercase);
  }

  static String _hashString(List<int> bytes, String algorithm, bool uppercase) {
    final digest = switch (algorithm) {
      'MD5' => crypto.md5.convert(bytes),
      'SHA-1' => crypto.sha1.convert(bytes),
      'SHA-256' => crypto.sha256.convert(bytes),
      'SHA-224' => crypto.sha224.convert(bytes),
      'SHA-512' => crypto.sha512.convert(bytes),
      'SHA-384' => crypto.sha384.convert(bytes),
      _ => crypto.sha256.convert(bytes),
    };
    final hex = digest.toString();
    return uppercase ? hex.toUpperCase() : hex;
  }
}
