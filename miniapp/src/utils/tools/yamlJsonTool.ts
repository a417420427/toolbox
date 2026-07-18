/**
 * YAML ↔ JSON 互转（简化版）
 * 移植自 flutter_shared/tools/yaml_json_converter.dart
 */

export const YamlJsonConverter = {
  /** 判断输入是否为 YAML */
  isLikelyYaml(input: string): boolean {
    const trimmed = input.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('---')) return true;
    if (/^\w+:/.test(trimmed)) return true;
    if (/^\s*-\s+/.test(trimmed)) return true;
    return false;
  },

  /** 简单 YAML → JSON */
  yamlToJson(yaml: string): string {
    const lines = yaml.split('\n');
    const map: Record<string, any> = {};

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('- ')) continue;
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx <= 0) continue;

      const key = trimmed.substring(0, colonIdx).trim();
      let value = trimmed.substring(colonIdx + 1).trim();

      if (!value) {
        map[key] = null;
      } else if (value === 'true' || value === 'false') {
        map[key] = value === 'true';
      } else if (/^\d+\.?\d*$/.test(value)) {
        map[key] = parseFloat(value);
      } else if ((value.startsWith('"') && value.endsWith('"')) ||
                 (value.startsWith("'") && value.endsWith("'"))) {
        map[key] = value.substring(1, value.length - 1);
      } else {
        map[key] = value;
      }
    }

    return JSON.stringify(map, null, 2);
  },

  /** JSON → YAML（简化） */
  jsonToYaml(json: string): string {
    try {
      const parsed = JSON.parse(json);
      return this._toYamlString(parsed, 0);
    } catch {
      return json;
    }
  },

  _toYamlString(obj: any, indent: number): string {
    const prefix = '  '.repeat(indent);
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.map(e => `${prefix}- ${this._toYamlString(e, indent)}`).join('\n');
      }
      const lines: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          lines.push(`${prefix}${key}:`);
          lines.push(this._toYamlString(value, indent + 1));
        } else {
          lines.push(`${prefix}${key}: ${this._toYamlString(value, 0)}`);
        }
      }
      return lines.join('\n');
    }
    if (typeof obj === 'string') return obj;
    return String(obj);
  },
};
