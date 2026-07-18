/**
 * HTML 实体编解码工具
 * 移植自 flutter_shared/tools/html_entity_tool.dart
 */

const namedEntities: Record<string, string> = {
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

export const HtmlEntityTool = {
  /** 编码 HTML — 将特殊字符转为实体 */
  encode(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  /** 解码 HTML 实体 */
  decode(input: string): string {
    if (!input) return '';

    let result = input;

    // 解码命名实体
    for (const [entity, char] of Object.entries(namedEntities)) {
      result = result.split(entity).join(char);
    }

    // 解码十进制实体 &#123;
    result = result.replace(/&#(\d+);/g, (_match, code) => {
      return String.fromCharCode(parseInt(code));
    });

    // 解码十六进制实体 &#xABC;
    result = result.replace(/&#x([\da-fA-F]+);/g, (_match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return result;
  },
};
