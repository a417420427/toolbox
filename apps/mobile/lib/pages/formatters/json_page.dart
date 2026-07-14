import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class JsonToolPage extends StatefulWidget {
  const JsonToolPage({super.key});

  @override
  State<JsonToolPage> createState() => _JsonToolPageState();
}

class _JsonToolPageState extends State<JsonToolPage> {
  final TextEditingController _inputController = TextEditingController();
  String _result = '';
  String? _error;
  String _mode = 'format'; // format | minify
  int _indent = 2;

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  void _process() {
    final input = _inputController.text;
    if (_mode == 'format') {
      final r = JsonTool.format(input, indent: _indent);
      setState(() {
        _result = r.result;
        _error = r.error;
      });
    } else {
      final r = JsonTool.minify(input);
      setState(() {
        _result = r.result;
        _error = r.error;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ToolCard(
            title: 'JSON 输入',
            child: Column(
              children: [
                TextField(
                  controller: _inputController,
                  maxLines: 8,
                  decoration: const InputDecoration(
                    hintText: '粘贴 JSON 内容...',
                  ),
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    // Mode toggle
                    SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(value: 'format', label: Text('格式化')),
                        ButtonSegment(value: 'minify', label: Text('压缩')),
                      ],
                      selected: {_mode},
                      onSelectionChanged: (v) {
                        setState(() => _mode = v.first);
                      },
                      style: SegmentedButton.styleFrom(
                        selectedBackgroundColor: AppColors.brand100,
                        selectedForegroundColor: AppColors.brand700,
                      ),
                    ),
                    const SizedBox(width: 12),
                    if (_mode == 'format')
                      DropdownButton<int>(
                        value: _indent,
                        underline: const SizedBox(),
                        items: [2, 4, 8].map((i) {
                          return DropdownMenuItem(value: i, child: Text('缩进 $i'));
                        }).toList(),
                        onChanged: (v) {
                          if (v != null) setState(() => _indent = v);
                        },
                      ),
                    const Spacer(),
                    FilledButton(
                      onPressed: _process,
                      child: const Text('执行'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      _inputController.text = JsonTool.sample;
                      _process();
                    },
                    child: const Text('填入示例'),
                  ),
                ),
              ],
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
                border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: AppColors.error, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _error!,
                      style: const TextStyle(color: AppColors.error, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 12),
          ResultPanel(
            title: '输出结果',
            content: _result,
          ),
        ],
      ),
    );
  }
}
