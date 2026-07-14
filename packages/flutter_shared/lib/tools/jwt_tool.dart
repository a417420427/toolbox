import 'dart:convert';

import 'jwt_result.dart';

/// JWT 解码工具
class JwtTool {
  JwtTool._();

  /// 解析 JWT token
  static ({JwtResult? result, String? error}) decode(String token) {
    token = token.trim();
    if (token.isEmpty) {
      return (result: null, error: '请输入 JWT Token');
    }

    final parts = token.split('.');
    if (parts.length != 3) {
      return (result: null, error: '非法 JWT 格式：Token 必须由三部分组成（Header.Payload.Signature）');
    }

    try {
      final header = _decodeBase64Url(parts[0]);
      final payload = _decodeBase64Url(parts[1]);
      final signature = parts[2];

      return (
        result: JwtResult(
          header: header,
          payload: payload,
          signature: signature,
        ),
        error: null,
      );
    } catch (e) {
      return (result: null, error: '解码失败: $e');
    }
  }

  static Map<String, dynamic> _decodeBase64Url(String str) {
    // Base64 URL → Base64
    var b64 = str.replaceAll('-', '+').replaceAll('_', '/');
    // 补 = padding
    while (b64.length % 4 != 0) {
      b64 += '=';
    }
    final decoded = base64.decode(b64);
    return jsonDecode(utf8.decode(decoded)) as Map<String, dynamic>;
  }
}
