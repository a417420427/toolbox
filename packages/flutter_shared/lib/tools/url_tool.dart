
/// URL 编解码工具
class UrlTool {
  UrlTool._();

  /// encodeURIComponent — 编码 URL 参数值
  static String encodeComponent(String input) {
    return Uri.encodeComponent(input);
  }

  /// decodeURIComponent
  static ({String result, String? error}) decodeComponent(String input) {
    try {
      return (result: Uri.decodeComponent(input), error: null);
    } on FormatException catch (_) {
      // 尝试部分解码
      try {
        final partial = _partialDecode(input);
        return (result: partial, error: '部分字符解码失败，已原样保留');
      } catch (_) {
        return (result: input, error: '无法解码该字符串');
      }
    }
  }

  /// encodeURI — 编码完整 URL（保留 :// / ? #）
  static String encodeFull(String input) {
    return Uri.encodeFull(input);
  }

  /// decodeURI
  static ({String result, String? error}) decodeFull(String input) {
    try {
      return (result: Uri.decodeFull(input), error: null);
    } on FormatException catch (_) {
      try {
        return (result: _partialDecode(input), error: '部分字符解码失败');
      } catch (_) {
        return (result: input, error: '无法解码');
      }
    }
  }

  static String _partialDecode(String input) {
    final buffer = StringBuffer();
    for (int i = 0; i < input.length; i++) {
      if (input[i] == '%' && i + 2 < input.length) {
        final hex = input.substring(i + 1, i + 3);
        try {
          buffer.writeCharCode(int.parse(hex, radix: 16));
          i += 2;
          continue;
        } catch (_) {}
      }
      buffer.write(input[i]);
    }
    return buffer.toString();
  }
}
