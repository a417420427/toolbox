import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_spacing.dart';
import '../theme/app_colors.dart';

/// 复制按钮 — 点击复制内容到剪贴板
class CopyButton extends StatefulWidget {
  final String text;
  final String? label;

  const CopyButton({
    super.key,
    required this.text,
    this.label,
  });

  @override
  State<CopyButton> createState() => _CopyButtonState();
}

class _CopyButtonState extends State<CopyButton> {
  bool _copied = false;

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: () async {
        await Clipboard.setData(ClipboardData(text: widget.text));
        setState(() => _copied = true);
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) setState(() => _copied = false);
      },
      icon: Icon(
        _copied ? Icons.check : Icons.copy,
        size: 16,
      ),
      label: Text(
        _copied ? '已复制' : (widget.label ?? '复制'),
        style: const TextStyle(fontSize: 13),
      ),
      style: TextButton.styleFrom(
        foregroundColor: _copied ? AppColors.success : AppColors.neutral500,
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space2,
          vertical: AppSpacing.space1,
        ),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
    );
  }
}
