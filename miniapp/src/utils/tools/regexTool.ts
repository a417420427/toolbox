/**
 * 正则表达式测试器
 * 移植自 flutter_shared/tools/regex_tool.dart
 */

export interface RegexMatchItem {
  index: number;
  match: string;
  start: number;
  end: number;
}

export interface RegexResult {
  matches: RegexMatchItem[];
  error?: string;
}

export interface RegexQuickPattern {
  label: string;
  pattern: string;
  description: string;
}

export const RegexTool = {
  test(pattern: string, testText: string, flags?: {
    global?: boolean;
    caseSensitive?: boolean;
    multiLine?: boolean;
    dotAll?: boolean;
    unicode?: boolean;
  }): RegexResult {
    const {
      global = true,
      caseSensitive = true,
      multiLine = false,
      dotAll = false,
      unicode = false,
    } = flags || {};

    if (!pattern) return { matches: [], error: '请输入正则表达式' };

    try {
      let flagStr = '';
      if (global) flagStr += 'g';
      if (!caseSensitive) flagStr += 'i';
      if (multiLine) flagStr += 'm';
      if (dotAll) flagStr += 's';
      if (unicode) flagStr += 'u';

      const regex = new RegExp(pattern, flagStr);
      const matches: RegexMatchItem[] = [];
      let m: RegExpExecArray | null;
      const maxMatches = 1000;
      let idx = 0;

      while ((m = regex.exec(testText)) !== null) {
        if (idx >= maxMatches) {
          matches.push({
            index: idx,
            match: `... (超过 ${maxMatches} 个匹配，已截断)`,
            start: m.index,
            end: regex.lastIndex,
          });
          idx++;
          break;
        }
        matches.push({
          index: idx,
          match: m[0],
          start: m.index,
          end: regex.lastIndex,
        });
        idx++;
        if (!global) break;
      }

      return { matches };
    } catch (e: any) {
      return { matches: [], error: `正则表达式错误: ${e.message}` };
    }
  },

  quickPatterns: [
    { label: '邮箱', pattern: '^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$', description: '匹配 Email 地址' },
    { label: 'URL', pattern: 'https?://[\\w./?=&%-]+', description: '匹配 HTTP/HTTPS URL' },
    { label: '手机号', pattern: '1[3-9]\\d{9}', description: '中国大陆手机号' },
    { label: 'IP v4', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', description: 'IPv4 地址' },
    { label: '日期', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'YYYY-MM-DD 格式日期' },
    { label: '中文', pattern: '[\\u4e00-\\u9fff]+', description: '匹配中文字符' },
    { label: '空白行', pattern: '^\\s*$', description: '匹配空行或纯空白行' },
    { label: 'Hex颜色', pattern: '#?[\\da-fA-F]{6}\\b', description: '匹配 HEX 颜色值' },
  ] as RegexQuickPattern[],

  flagDescriptions: {
    'g': '全局匹配 (global)',
    'i': '忽略大小写 (ignoreCase)',
    'm': '多行模式 (multiLine)',
    's': '点号匹配换行 (dotAll)',
    'u': 'Unicode 模式',
  },
};
