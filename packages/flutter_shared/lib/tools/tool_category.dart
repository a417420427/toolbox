import 'package:flutter/material.dart';

/// 工具分类
enum ToolCategory {
  tools('日常工具'),
  formatters('格式化 & 转换'),
  crypto('编码 & 加密'),
  dev('开发者工具');

  final String label;

  IconData get icon {
    return switch (this) {
      ToolCategory.tools => Icons.widgets_outlined,
      ToolCategory.formatters => Icons.transform,
      ToolCategory.crypto => Icons.lock_outline,
      ToolCategory.dev => Icons.code,
    };
  }

  const ToolCategory(this.label);
}
