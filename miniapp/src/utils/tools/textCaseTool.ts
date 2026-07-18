/**
 * 文字格式互转 — 大小写 / 命名法
 * 移植自 flutter_shared/tools/text_case_tool.dart
 */

export interface TextCaseResult {
  upper: string;
  lower: string;
  title: string;
  sentence: string;
  camel: string;
  pascal: string;
  snake: string;
  kebab: string;
  reverse: string;
}

function splitWords(input: string): string[] {
  const withSpaces = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  const withSpaces2 = withSpaces.replace(/([a-zA-Z])(\d)/g, '$1 $2');
  return withSpaces2.split(/[\s_-]+/).filter(w => w.length > 0);
}

function capitalize(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.substring(1).toLowerCase();
}

export const TextCaseTool = {
  convert(input: string): TextCaseResult {
    if (!input) {
      return {
        upper: '', lower: '', title: '', sentence: '',
        camel: '', pascal: '', snake: '', kebab: '', reverse: '',
      };
    }

    const words = splitWords(input);

    return {
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: words.map(w => capitalize(w)).join(' '),
      sentence: input[0].toUpperCase() + input.substring(1).toLowerCase(),
      camel: words.length === 0 ? '' :
        words[0].toLowerCase() + words.slice(1).map(w => capitalize(w)).join(''),
      pascal: words.map(w => capitalize(w)).join(''),
      snake: words.map(w => w.toLowerCase()).join('_'),
      kebab: words.map(w => w.toLowerCase()).join('-'),
      reverse: input.split('').reverse().join(''),
    };
  },
};
