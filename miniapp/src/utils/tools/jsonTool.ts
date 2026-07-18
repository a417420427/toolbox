/**
 * JSON 工具 — 格式化 / 压缩 / 校验
 * 移植自 flutter_shared/tools/json_tool.dart
 */

export interface JsonResult {
  result: string;
  error?: string;
}

export interface JsonValidateResult {
  valid: boolean;
  error?: string;
  parsed?: any;
}

export const JsonTool = {
  format(input: string, indent = 2): JsonResult {
    const trimmed = input.trim();
    if (!trimmed) return { result: '', error: '请输入 JSON' };
    try {
      const parsed = JSON.parse(trimmed);
      return { result: JSON.stringify(parsed, null, indent), error: undefined };
    } catch (e: any) {
      return { result: input, error: `JSON 格式错误: ${e.message}` };
    }
  },

  minify(input: string): JsonResult {
    const trimmed = input.trim();
    if (!trimmed) return { result: '', error: '请输入 JSON' };
    try {
      const parsed = JSON.parse(trimmed);
      return { result: JSON.stringify(parsed), error: undefined };
    } catch (e: any) {
      return { result: input, error: `JSON 格式错误: ${e.message}` };
    }
  },

  validate(input: string): JsonValidateResult {
    const trimmed = input.trim();
    if (!trimmed) return { valid: false, error: '请输入 JSON' };
    try {
      const parsed = JSON.parse(trimmed);
      return { valid: true, parsed };
    } catch (e: any) {
      return { valid: false, error: e.message };
    }
  },

  get sample(): string {
    return JSON.stringify({
      name: '工具箱',
      version: '1.0.0',
      tools: ['JSON', 'Base64', 'Hash'],
      enabled: true,
      count: 3,
      metadata: {
        author: 'toolbox',
        created: '2024-01-15',
      },
    }, null, 2);
  },
};
