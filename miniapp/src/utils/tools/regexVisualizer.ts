/**
 * 正则表达式 → 可视化节点树
 * 将 regex 结构解析为 Canvas 可绘制节点
 */

export interface RegexNode {
  type: 'literal' | 'wildcard' | 'repeat' | 'optional' | 'group' | 'alternation' | 'anchor' | 'set' | 'charClass';
  label: string;
  detail: string;
  children?: RegexNode[];
}

function escapeLabel(s: string): string {
  if (s === '.') return '任意字符';
  if (s === ' ') return '空格';
  if (s === '\t') return '\\t';
  if (s === '\n') return '\\n';
  if (s === '\r') return '\\r';
  return s;
}

function parseNode(input: string, startIdx: number): { node: RegexNode; endIdx: number } | null {
  if (startIdx >= input.length) return null;

  const c = input[startIdx];

  // 锚点
  if (c === '^') return { node: { type: 'anchor', label: '^', detail: '行首' }, endIdx: startIdx + 1 };
  if (c === '$') return { node: { type: 'anchor', label: '$', detail: '行尾' }, endIdx: startIdx + 1 };

  // 转义
  if (c === '\\') {
    const next = input[startIdx + 1];
    if (!next) return null;
    const charMap: Record<string, string> = {
      'd': '数字', 'w': '字母/数字/_', 's': '空白',
      'D': '非数字', 'W': '非字母/数字/_', 'S': '非空白',
      'b': '词边界', 'B': '非词边界',
    };
    if (charMap[next]) return { node: { type: 'charClass', label: `\\${next}`, detail: charMap[next] }, endIdx: startIdx + 2 };
    return { node: { type: 'literal', label: escapeLabel(next), detail: '' }, endIdx: startIdx + 2 };
  }

  // 字符集 [...]
  if (c === '[') {
    let end = startIdx + 1;
    while (end < input.length && input[end] !== ']') end++;
    if (end >= input.length) return null;
    const content = input.substring(startIdx + 1, end);
    const detail = content.startsWith('^') ? `非 ${content.substring(1)}` : content;
    return { node: { type: 'set', label: `[...]`, detail: `匹配${detail}` }, endIdx: end + 1 };
  }

  // 分组 (...)
  if (c === '(') {
    let depth = 1;
    let j = startIdx + 1;
    let pipeIdx = -1;
    while (j < input.length && depth > 0) {
      if (input[j] === '(') depth++;
      if (input[j] === ')') depth--;
      if (input[j] === '|' && depth === 1) pipeIdx = j;
      j++;
    }
    if (depth !== 0) return null;

    if (pipeIdx !== -1) {
      const left = input.substring(startIdx + 1, pipeIdx);
      const right = input.substring(pipeIdx + 1, j - 1);
      const parts: RegexNode[] = [];
      parts.push({ type: 'literal', label: left, detail: '', children: parseSequence(left) });
      parts.push({ type: 'literal', label: right, detail: '', children: parseSequence(right) });
      return {
        node: { type: 'alternation', label: '|', detail: '或', children: parts },
        endIdx: j,
      };
    }

    const inner = input.substring(startIdx + 1, j - 1);
    const children = parseSequence(inner);
    return {
      node: { type: 'group', label: '(...)', detail: '分组', children },
      endIdx: j,
    };
  }

  // 通配符
  if (c === '.') return { node: { type: 'wildcard', label: '.', detail: '任意字符' }, endIdx: startIdx + 1 };

  // 量词（跟随前一个节点）
  // 这些作为独立节点不太好，但为了让可视化展示，单独处理
  if (c === '*') return { node: { type: 'repeat', label: '*', detail: '0或多次' }, endIdx: startIdx + 1 };
  if (c === '+') return { node: { type: 'repeat', label: '+', detail: '1或多次' }, endIdx: startIdx + 1 };
  if (c === '?') return { node: { type: 'optional', label: '?', detail: '0或1次' }, endIdx: startIdx + 1 };

  // 普通字符
  return { node: { type: 'literal', label: escapeLabel(c), detail: '' }, endIdx: startIdx + 1 };
}

function parseSequence(input: string): RegexNode[] {
  const nodes: RegexNode[] = [];
  let i = 0;
  while (i < input.length) {
    const result = parseNode(input, i);
    if (!result) break;
    nodes.push(result.node);
    i = result.endIdx;
  }
  return nodes;
}

export const RegexVisualizer = {
  /** 解析正则表达式为可视化节点树 */
  parse(pattern: string): RegexNode[] {
    try {
      new RegExp(pattern);
    } catch {
      return [{ type: 'literal', label: '无效', detail: '非法正则表达式' }];
    }
    return parseSequence(pattern);
  },

  /** 获取颜色映射 */
  nodeColor(type: RegexNode['type']): string {
    const map: Record<string, string> = {
      literal: '#3b82f6',
      wildcard: '#8b5cf6',
      repeat: '#ef4444',
      optional: '#f97316',
      group: '#10b981',
      alternation: '#eab308',
      anchor: '#6b7280',
      set: '#ec4899',
      charClass: '#14b8a6',
    };
    return map[type] || '#6b7280';
  },

  /** 生成节点简短描述 */
  describe(nodes: RegexNode[]): string {
    return nodes.map(n => n.detail || n.label).join(' ');
  },
};
