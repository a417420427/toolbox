
/// HTML 实体编解码工具
class HtmlEntityTool {
  HtmlEntityTool._();

  static const Map<String, String> _namedEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': '\u00A0',
    '&iexcl;': '\u00A1',
    '&cent;': '\u00A2',
    '&pound;': '\u00A3',
    '&curren;': '\u00A4',
    '&yen;': '\u00A5',
    '&brvbar;': '\u00A6',
    '&sect;': '\u00A7',
    '&uml;': '\u00A8',
    '&copy;': '\u00A9',
    '&ordf;': '\u00AA',
    '&laquo;': '\u00AB',
    '&not;': '\u00AC',
    '&shy;': '\u00AD',
    '&reg;': '\u00AE',
    '&macr;': '\u00AF',
    '&deg;': '\u00B0',
    '&plusmn;': '\u00B1',
    '&sup2;': '\u00B2',
    '&sup3;': '\u00B3',
    '&acute;': '\u00B4',
    '&micro;': '\u00B5',
    '&para;': '\u00B6',
    '&middot;': '\u00B7',
    '&cedil;': '\u00B8',
    '&sup1;': '\u00B9',
    '&ordm;': '\u00BA',
    '&raquo;': '\u00BB',
    '&frac14;': '\u00BC',
    '&frac12;': '\u00BD',
    '&frac34;': '\u00BE',
    '&iquest;': '\u00BF',
    '&times;': '\u00D7',
    '&divide;': '\u00F7',
    '&euro;': '\u20AC',
  };

  /// 编码 HTML — 将特殊字符转为实体
  static String encode(String input) {
    if (input.isEmpty) return '';
    return input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
  }

  /// 解码 HTML 实体
  static String decode(String input) {
    if (input.isEmpty) return '';

    var result = input;

    // 解码命名实体
    for (final entry in _namedEntities.entries) {
      result = result.replaceAll(entry.key, entry.value);
    }

    // 解码十进制实体 &#123;
    result = result.replaceAllMapped(
      RegExp(r'&#(\d+);'),
      (m) => String.fromCharCode(int.parse(m[1]!)),
    );

    // 解码十六进制实体 &#xABC;
    result = result.replaceAllMapped(
      RegExp(r'&#x([\da-fA-F]+);'),
      (m) => String.fromCharCode(int.parse(m[1]!, radix: 16)),
    );

    return result;
  }
}
