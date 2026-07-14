import 'package:flutter/material.dart';
import '../theme/app_spacing.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import 'copy_button.dart';

/// 结果展示面板 — 对应 DESIGN.md 结果面板规范
class ResultPanel extends StatelessWidget {
  final String title;
  final String content;
  final bool isMono;

  const ResultPanel({
    super.key,
    this.title = '结果',
    required this.content,
    this.isMono = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.space4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: theme.dividerTheme.color ?? AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.neutral400,
                ),
              ),
              const Spacer(),
              if (content.isNotEmpty) CopyButton(text: content),
            ],
          ),
          if (content.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space2),
            if (isMono)
              SelectableText(
                content,
                style: AppTypography.monoSm.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
              )
            else
              SelectableText(
                content,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
          ] else
            Padding(
              padding: const EdgeInsets.only(top: AppSpacing.space2),
              child: Text(
                '暂无结果',
                style: TextStyle(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.4),
                  fontSize: 14,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
