/**
 * XML 格式化工具
 * 移植自 flutter_shared/tools/xml_formatter.dart
 */

export interface XmlProcessResult {
  result: string;
  error?: string;
}

export const XmlFormatter = {
  format(xml: string): string {
    if (!xml.trim()) return '';

    let result = xml;
    result = result.replace(/>\s+</g, '><');

    const output: string[] = [];
    let indent = 0;
    let inTag = false;

    for (let i = 0; i < result.length; i++) {
      const c = result[i];
      if (c === '<') {
        inTag = true;
        if (i > 0) output.push('\n');
        if (i + 1 < result.length && result[i + 1] === '/') {
          indent--;
        }
        output.push('  '.repeat(Math.max(0, indent)));
        output.push(c);
      } else if (c === '>') {
        output.push(c);
        inTag = false;
        if (i > 0 && result[i - 1] !== '/' && !(i > 1 && result[i - 2] === '/') &&
            !(i + 1 < result.length && result[i + 1] === '<')) {
          // has text content
        } else if (i > 0 && result[i - 1] !== '/' && !(result[i - 1] === '?')) {
          indent++;
        }
      } else if (c === '/' && i + 1 < result.length && result[i + 1] === '>') {
        output.push(c);
      } else {
        output.push(c);
      }
    }

    return output.join('').trim();
  },

  minify(xml: string): string {
    if (!xml.trim()) return '';
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\n\s*/g, '')
      .trim();
  },

  process(input: string, isMinify = false): XmlProcessResult {
    if (!input.trim()) return { result: '', error: '请输入 XML' };
    try {
      if (isMinify) return { result: this.minify(input) };
      return { result: this.format(input) };
    } catch (e: any) {
      return { result: input, error: `格式化失败: ${e.message}` };
    }
  },
};
