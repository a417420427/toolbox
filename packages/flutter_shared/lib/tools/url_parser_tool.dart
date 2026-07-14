/// URL 解析工具
class UrlParserTool {
  UrlParserTool._();

  /// URL 解析结果
  static ({
    String protocol,
    String host,
    int? port,
    String pathname,
    String search,
    Map<String, String> params,
    String hash,
    bool isValid,
    String? error,
  }) parse(String url) {
    if (url.trim().isEmpty) {
      return (
        protocol: '', host: '', port: null, pathname: '',
        search: '', params: {}, hash: '',
        isValid: false, error: 'URL 为空',
      );
    }

    var remaining = url.trim();

    // 提取 protocol
    String protocol = '';
    final protoMatch = RegExp(r'^([a-zA-Z][a-zA-Z0-9+\-.]*)://').firstMatch(remaining);
    if (protoMatch != null) {
      protocol = protoMatch.group(1)!;
      remaining = remaining.substring(protoMatch.end);
    }

    // 提取 hash
    String hash = '';
    final hashIdx = remaining.indexOf('#');
    if (hashIdx != -1) {
      hash = remaining.substring(hashIdx + 1);
      remaining = remaining.substring(0, hashIdx);
    }

    // 提取 search / params
    String search = '';
    Map<String, String> params = {};
    final qIdx = remaining.indexOf('?');
    if (qIdx != -1) {
      search = remaining.substring(qIdx);
      remaining = remaining.substring(0, qIdx);

      final queryStr = search.substring(1); // 去掉 '?'
      for (final pair in queryStr.split('&')) {
        if (pair.isEmpty) continue;
        final eqIdx = pair.indexOf('=');
        if (eqIdx != -1) {
          final key = _decodeUriComponent(pair.substring(0, eqIdx));
          final value = _decodeUriComponent(pair.substring(eqIdx + 1));
          params[key] = value;
        } else {
          params[_decodeUriComponent(pair)] = '';
        }
      }
    }

    // 提取 host 和 port
    String host = '';
    int? port;

    // 处理 auth@host
    final atIdx = remaining.lastIndexOf('@');
    if (atIdx != -1) {
      // 有 userinfo，跳过
      remaining = remaining.substring(atIdx + 1);
    }

    // host 可能以 [ipv6] 开头
    if (remaining.startsWith('[')) {
      final closeBracket = remaining.indexOf(']');
      if (closeBracket != -1) {
        host = remaining.substring(0, closeBracket + 1);
        remaining = remaining.substring(closeBracket + 1);
      }
    } else {
      final slashIdx = remaining.indexOf('/');
      final colonIdx = remaining.indexOf(':');
      if (colonIdx != -1 && (slashIdx == -1 || colonIdx < slashIdx)) {
        host = remaining.substring(0, colonIdx);
        remaining = remaining.substring(colonIdx + 1);
        // 解析 port
        final endPortIdx = remaining.indexOf('/');
        final portStr = endPortIdx != -1 ? remaining.substring(0, endPortIdx) : remaining;
        port = int.tryParse(portStr);
        remaining = endPortIdx != -1 ? remaining.substring(endPortIdx) : '';
      } else {
        if (slashIdx != -1) {
          host = remaining.substring(0, slashIdx);
          remaining = remaining.substring(slashIdx);
        } else {
          host = remaining;
          remaining = '';
        }
      }
    }

    // pathname 就是剩余部分
    final pathname = remaining.isEmpty ? '/' : remaining;

    return (
      protocol: protocol,
      host: host,
      port: port,
      pathname: pathname,
      search: search,
      params: params,
      hash: hash,
      isValid: protocol.isNotEmpty && host.isNotEmpty,
      error: protocol.isEmpty || host.isEmpty ? '缺少协议或主机名' : null,
    );
  }

  static String _decodeUriComponent(String s) {
    try {
      return Uri.decodeComponent(s);
    } catch (_) {
      return s;
    }
  }

  /// 简单 URL 编码/解码
  static String encode(String input) => Uri.encodeComponent(input);
  static String decode(String input) {
    try {
      return Uri.decodeComponent(input);
    } catch (_) {
      return input;
    }
  }
}
