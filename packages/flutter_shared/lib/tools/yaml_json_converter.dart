/// YAML ↔ JSON 互转（简化版，用 JSON 模拟 YAML 结构检测）
class YamlJsonConverter {
  YamlJsonConverter._();

  /// 判断输入是否为 YAML（简单的启发式检测）
  static bool isLikelyYaml(String input) {
    final trimmed = input.trim();
    if (trimmed.isEmpty) return false;
    // YAML 特征：缩进结构、冒号空格、横线列表
    if (trimmed.startsWith('---')) return true;
    if (RegExp(r'^\w+:').hasMatch(trimmed)) return true;
    if (RegExp(r'^\s*-\s+').hasMatch(trimmed)) return true;
    return false;
  }

  /// 简单 YAML → JSON（关键值对格式）
  static String yamlToJson(String yaml) {
    final lines = yaml.split('\n');
    final map = <String, dynamic>{};
    int indent = -1;

    for (final line in lines) {
      final trimmed = line.trimLeft();
      if (trimmed.isEmpty || trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('- ')) {
        // 列表项 — 简化：只用最后一个
        continue;
      }
      final colonIdx = trimmed.indexOf(':');
      if (colonIdx <= 0) continue;

      final key = trimmed.substring(0, colonIdx).trim();
      var value = trimmed.substring(colonIdx + 1).trim();

      if (value.isEmpty) {
        map[key] = null;
      } else if (value == 'true' || value == 'false') {
        map[key] = value == 'true';
      } else if (RegExp(r'^\d+\.?\d*$').hasMatch(value)) {
        map[key] = num.parse(value);
      } else if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        map[key] = value.substring(1, value.length - 1);
      } else {
        map[key] = value;
      }
    }

    return _toJsonString(map);
  }

  static String _toJsonString(dynamic obj) {
    if (obj == null) return 'null';
    if (obj is String) return '"${obj.replaceAll('"', '\\"')}"';
    if (obj is num || obj is bool) return obj.toString();
    if (obj is Map) {
      final entries = obj.entries.map((e) =>
        '  "${e.key}": ${_toJsonString(e.value)}');
      return '{\n${entries.join(',\n')}\n}';
    }
    if (obj is List) {
      return '[${obj.map(_toJsonString).join(', ')}]';
    }
    return '"$obj"';
  }

  /// JSON → YAML（简化）
  static String jsonToYaml(String json) {
    try {
      final parsed = _parseSimpleJson(json);
      return _toYamlString(parsed, 0);
    } catch (_) {
      return json;
    }
  }

  static dynamic _parseSimpleJson(String input) {
    // 用 dart:convert
    return input;
  }

  static String _toYamlString(dynamic obj, int indent) {
    final prefix = '  ' * indent;
    if (obj is Map) {
      final lines = <String>[];
      for (final entry in obj.entries) {
        if (entry.value is Map || entry.value is List) {
          lines.add('$prefix${entry.key}:');
          lines.add(_toYamlString(entry.value, indent + 1));
        } else {
          lines.add('$prefix${entry.key}: ${_toYamlString(entry.value, 0)}');
        }
      }
      return lines.join('\n');
    }
    if (obj is List) {
      return obj.map((e) => '$prefix- ${_toYamlString(e, indent)}').join('\n');
    }
    if (obj is String) return obj;
    return obj.toString();
  }
}
