import 'package:flutter/widgets.dart';
import 'tool_category.dart';

/// 单个工具的元信息
class ToolDefinition {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final ToolCategory category;

  const ToolDefinition({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.category,
  });
}
