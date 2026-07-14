import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class HashToolPage extends StatefulWidget {
  const HashToolPage({super.key});

  @override
  State<HashToolPage> createState() => _HashToolPageState();
}

class _HashToolPageState extends State<HashToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  Map<String, String> _results = {};
  bool _uppercase = true;

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _inputCtrl.addListener(_onInputChanged);
  }

  void _onInputChanged() {
    _process();
  }

  void _process() {
    setState(() {
      _results = HashTool.hashText(_inputCtrl.text, uppercase: _uppercase);
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
            title: '输入文本',
            child: TextField(
              controller: _inputCtrl,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: '输入要计算哈希的文本（实时计算）...',
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Text('输出格式: ', style: TextStyle(fontSize: 14)),
              Switch(
                value: _uppercase,
                onChanged: (v) {
                  setState(() => _uppercase = v);
                  _process();
                },
                activeThumbColor: AppColors.brand500,
              ),
              Text(_uppercase ? '大写' : '小写', style: const TextStyle(fontSize: 13)),
              const Spacer(),
              FilledButton(
                onPressed: _process,
                child: const Text('计算'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...HashTool.algorithms.map((algo) {
            final hash = _results[algo] ?? '';
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          algo,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.neutral400,
                          ),
                        ),
                        const Spacer(),
                        if (hash.isNotEmpty) CopyButton(text: hash),
                      ],
                    ),
                    if (hash.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      SelectableText(
                        hash,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
