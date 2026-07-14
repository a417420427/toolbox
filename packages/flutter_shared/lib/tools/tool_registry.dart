import 'package:flutter/material.dart';
import 'tool_definition.dart';
import 'tool_category.dart';

/// 所有工具的注册表
class ToolRegistry {
  ToolRegistry._();

  static final List<ToolDefinition> _all = [
    // ── 格式化 & 转换 ──
    const ToolDefinition(
      id: 'json',
      name: 'JSON 工具',
      description: '格式化 / 压缩 / 校验 JSON',
      icon: Icons.data_object,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'base64',
      name: 'Base64 编解码',
      description: '文本 ↔ Base64 / 文件编码',
      icon: Icons.code,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'url',
      name: 'URL 编解码',
      description: 'encodeURI / decodeURIComponent',
      icon: Icons.link,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'timestamp',
      name: '时间戳工具',
      description: '时间戳 ↔ 日期 / 多种格式',
      icon: Icons.schedule,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'color',
      name: '颜色工具',
      description: 'HEX ↔ RGB ↔ HSL 互转',
      icon: Icons.palette,
      category: ToolCategory.formatters,
    ),

    // ── 编码 & 加密 ──
    const ToolDefinition(
      id: 'uuid',
      name: 'UUID 生成器',
      description: 'UUID v4 / NanoID 批量生成',
      icon: Icons.fingerprint,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'hash',
      name: '哈希工具',
      description: 'MD5 / SHA-1 / SHA-256 / SHA-512',
      icon: Icons.shield,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'jwt',
      name: 'JWT 解码器',
      description: '解析 token / 检查过期',
      icon: Icons.key,
      category: ToolCategory.crypto,
    ),

    // ── 文本处理 ──
    const ToolDefinition(
      id: 'text_stats',
      name: '文本统计',
      description: '字符 / 单词 / 行数统计',
      icon: Icons.bar_chart,
      category: ToolCategory.text,
    ),
    const ToolDefinition(
      id: 'text_case',
      name: '文字格式互转',
      description: '大小写 / 驼峰 / 蛇形 / 中划线',
      icon: Icons.text_format,
      category: ToolCategory.text,
    ),
    const ToolDefinition(
      id: 'regex',
      name: '正则测试器',
      description: '实时匹配高亮 / Flags 开关',
      icon: Icons.manage_search,
      category: ToolCategory.text,
    ),

    // ── 开发者工具 ──
    const ToolDefinition(
      id: 'html_entity',
      name: 'HTML 实体编解码',
      description: '< → &lt; / 解码还原',
      icon: Icons.html,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'unicode',
      name: 'Unicode 码点查询',
      description: '字符 ↔ U+XXXX / 批量查询',
      icon: Icons.abc,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'cron',
      name: 'Cron 解析器',
      description: 'Cron → 可读描述 / 执行时间预览',
      icon: Icons.timer,
      category: ToolCategory.dev,
    ),
  ];

  static List<ToolDefinition> all() => List.unmodifiable(_all);

  static List<ToolDefinition> byCategory(ToolCategory cat) =>
      _all.where((t) => t.category == cat).toList();

  static ToolDefinition? byId(String id) {
    try {
      return _all.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }
}
