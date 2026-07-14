import 'dart:convert';

/// JSON 工具 — 格式化 / 压缩 / 校验
class JsonTool {
  JsonTool._();

  /// 格式化 JSON
  static ({String result, String? error}) format(String input, {int indent = 2}) {
    if (input.trim().isEmpty) {
      return (result: '', error: '请输入 JSON');
    }
    try {
      final parsed = jsonDecode(input);
      final encoder = JsonEncoder.withIndent(' ' * indent);
      return (result: encoder.convert(parsed), error: null);
    } on FormatException catch (e) {
      return (result: input, error: 'JSON 格式错误: ${e.message}');
    }
  }

  /// 压缩 JSON
  static ({String result, String? error}) minify(String input) {
    if (input.trim().isEmpty) {
      return (result: '', error: '请输入 JSON');
    }
    try {
      final parsed = jsonDecode(input);
      return (result: jsonEncode(parsed), error: null);
    } on FormatException catch (e) {
      return (result: input, error: 'JSON 格式错误: ${e.message}');
    }
  }

  /// 校验 JSON
  static ({bool valid, String? error, dynamic parsed}) validate(String input) {
    if (input.trim().isEmpty) {
      return (valid: false, error: '请输入 JSON', parsed: null);
    }
    try {
      final parsed = jsonDecode(input);
      return (valid: true, error: null, parsed: parsed);
    } on FormatException catch (e) {
      return (valid: false, error: e.message, parsed: null);
    }
  }

  /// 示例 JSON
  static String get sample => jsonEncode({
    'name': '工具箱',
    'version': '1.0.0',
    'tools': ['JSON', 'Base64', 'Hash'],
    'enabled': true,
    'count': 3,
    'metadata': {
      'author': 'toolbox',
      'created': '2024-01-15',
    },
  });
}
