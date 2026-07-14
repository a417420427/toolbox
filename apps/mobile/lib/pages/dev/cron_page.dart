import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class CronToolPage extends StatefulWidget {
  const CronToolPage({super.key});

  @override
  State<CronToolPage> createState() => _CronToolPageState();
}

class _CronToolPageState extends State<CronToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();

  String _description = '';
  String? _error;
  List<String> _preview = [];

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _process() {
    final r = CronTool.parse(_inputCtrl.text);
    setState(() {
      _description = r.description;
      _error = r.error;
      _preview = r.preview ?? [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ToolCard(
            title: 'Cron 表达式',
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _inputCtrl,
                    decoration: const InputDecoration(
                      hintText: '* * * * *',
                      prefixIcon: Icon(Icons.timer_outlined, size: 20),
                      prefixStyle: TextStyle(fontFamily: 'monospace'),
                    ),
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 16),
                  ),
                ),
                const SizedBox(width: 12),
                FilledButton(
                  onPressed: _process,
                  child: const Text('解析'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          ToolCard(
            title: '常用预设',
            child: Wrap(
              spacing: 8,
              runSpacing: 4,
              children: CronTool.presets.map((p) {
                return ActionChip(
                  label: Text(p.label, style: const TextStyle(fontSize: 12)),
                  onPressed: () {
                    _inputCtrl.text = p.expression;
                    _process();
                  },
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          if (_error != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13)),
            ),
          if (_description.isNotEmpty) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.brand50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.brand200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.brand500, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _description,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                    ),
                  ),
                  CopyButton(text: _inputCtrl.text, label: '复制表达式'),
                ],
              ),
            ),
          ],
          if (_preview.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text('接下来 5 次执行时间', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            const SizedBox(height: 8),
            ..._preview.asMap().entries.map((entry) {
              return Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 4),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.neutral200),
                ),
                child: Row(
                  children: [
                    Text(
                      '#${entry.key + 1}',
                      style: const TextStyle(fontSize: 12, color: AppColors.neutral400, fontFamily: 'monospace'),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        entry.value,
                        style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                      ),
                    ),
                    CopyButton(text: entry.value),
                  ],
                ),
              );
            }),
          ],
        ],
      ),
    );
  }
}
