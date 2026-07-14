import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class UuidToolPage extends StatefulWidget {
  const UuidToolPage({super.key});

  @override
  State<UuidToolPage> createState() => _UuidToolPageState();
}

class _UuidToolPageState extends State<UuidToolPage> {
  final List<String> _results = [];
  int _count = 5;
  bool _useV7 = false;
  bool _uppercase = false;
  bool _noDashes = false;
  bool _curlyBraces = false;

  void _generate() {
    final uuids = UuidTool.bulkGenerate(count: _count, v7: _useV7);
    final formatted = uuids
        .map((u) => UuidTool.format(u, uppercase: _uppercase, noDashes: _noDashes, curlyBraces: _curlyBraces))
        .toList();
    setState(() => _results..clear()..addAll(formatted));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ToolCard(
            title: '生成选项',
            child: Column(
              children: [
                // 数量
                Row(
                  children: [
                    const Text('数量: ', style: TextStyle(fontSize: 14)),
                    SizedBox(
                      width: 80,
                      child: TextField(
                        decoration: const InputDecoration(
                          hintText: '5',
                          isDense: true,
                        ),
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontSize: 14),
                        onChanged: (v) {
                          final count = int.tryParse(v);
                          if (count != null) _count = count.clamp(1, 100);
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text('(1-100)', style: TextStyle(fontSize: 12, color: AppColors.neutral400)),
                  ],
                ),
                const SizedBox(height: 12),
                // UUID 版本
                Row(
                  children: [
                    const Text('版本: ', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 8),
                    SegmentedButton<bool>(
                      segments: const [
                        ButtonSegment(value: false, label: Text('UUID v4')),
                        ButtonSegment(value: true, label: Text('UUID v7')),
                      ],
                      selected: {_useV7},
                      onSelectionChanged: (v) => setState(() => _useV7 = v.first),
                      style: SegmentedButton.styleFrom(
                        selectedBackgroundColor: AppColors.brand100,
                        selectedForegroundColor: AppColors.brand700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // 格式选项
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: [
                    FilterChip(
                      label: const Text('大写', style: TextStyle(fontSize: 12)),
                      selected: _uppercase,
                      onSelected: (v) => setState(() => _uppercase = v),
                    ),
                    FilterChip(
                      label: const Text('去横线', style: TextStyle(fontSize: 12)),
                      selected: _noDashes,
                      onSelected: (v) => setState(() => _noDashes = v),
                    ),
                    FilterChip(
                      label: const Text('花括号', style: TextStyle(fontSize: 12)),
                      selected: _curlyBraces,
                      onSelected: (v) => setState(() => _curlyBraces = v),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _generate,
                    icon: const Icon(Icons.refresh),
                    label: const Text('生成'),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (_results.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      '生成结果 (${_results.length})',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                    const Spacer(),
                    CopyButton(text: _results.join('\n'), label: '复制全部'),
                  ],
                ),
                const SizedBox(height: 8),
                ..._results.asMap().entries.map((entry) {
                  return Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200,
                      ),
                    ),
                    child: Row(
                      children: [
                        Text(
                          '${entry.key + 1}.',
                          style: const TextStyle(fontSize: 12, color: AppColors.neutral400, fontFamily: 'monospace'),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: SelectableText(
                            entry.value,
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                          ),
                        ),
                        CopyButton(text: entry.value),
                      ],
                    ),
                  );
                }),
              ],
            ),
        ],
      ),
    );
  }
}
