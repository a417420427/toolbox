import 'package:flutter/material.dart';

/// 工具分类
enum ToolCategory {
  formatters('格式化 & 转换'),
  crypto('编码 & 加密'),
  text('文本处理'),
  dev('开发者工具');

  final String label;

  /// 注意: 由于 IconData 不可用于 const enum, icon 属性通过 Switch 返回
  IconData get icon {
    return switch (this) {
      ToolCategory.formatters => Icons.transform,
      ToolCategory.crypto => Icons.lock_outline,
      ToolCategory.text => Icons.text_fields,
      ToolCategory.dev => Icons.code,
    };
  }

  const ToolCategory(this.label);
}
