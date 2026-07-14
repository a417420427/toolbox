import 'dart:convert';
import 'dart:typed_data';

/// Base64 编解码工具
class Base64Tool {
  Base64Tool._();

  /// 文本 → Base64
  static String encode(String input) {
    if (input.isEmpty) return '';
    final bytes = utf8.encode(input);
    return base64.encode(bytes);
  }

  /// 文本 → Base64 URL Safe
  static String encodeUrlSafe(String input) {
    if (input.isEmpty) return '';
    final bytes = utf8.encode(input);
    return base64Url.encode(bytes);
  }

  /// Base64 → 文本
  static ({String result, String? error}) decode(String input) {
    if (input.isEmpty) return (result: '', error: null);
    try {
      final bytes = base64.decode(input);
      return (result: utf8.decode(bytes), error: null);
    } on FormatException catch (e) {
      return (result: '', error: '非法 Base64 字符串: ${e.message}');
    }
  }

  /// 文件字节 → Base64
  static String encodeBytes(Uint8List bytes) => base64.encode(bytes);

  /// 文件字节 → Base64 Data URI
  static String encodeDataUri(Uint8List bytes, String mimeType) {
    final b64 = base64.encode(bytes);
    return 'data:$mimeType;base64,$b64';
  }
}
