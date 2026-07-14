import 'package:flutter/material.dart';
import '../theme/app_spacing.dart';

/// 工具卡片容器 — 对应 DESIGN.md ToolCard 规范
class ToolCard extends StatelessWidget {
  final String title;
  final Widget child;
  final List<Widget>? actions;

  const ToolCard({
    super.key,
    required this.title,
    required this.child,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (title.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.space4),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    if (actions != null) ...actions!,
                  ],
                ),
              ),
            child,
          ],
        ),
      ),
    );
  }
}
