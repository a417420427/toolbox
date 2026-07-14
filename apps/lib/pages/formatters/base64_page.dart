import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class Base64ToolPage extends StatefulWidget {
  const Base64ToolPage({super.key});

  @override
  State<Base64ToolPage> createState() => _Base64ToolPageState();
}

class _Base64ToolPageState extends State<Base64ToolPage> {
  final TextEditingController _inputController = TextEditingController();
  String _result = '';
  String? _error;
  bool _isEncode = true;
  bool _urlSafe = false;

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  void _process() {
    final input = _inputController.text;
    if (_isEncode) {
      final r = _urlSafe ? Base64Tool.encodeUrlSafe(input) : Base64Tool.encode(input);
      setState(() {
        _result = r;
        _error = null;
      });
    } else {
      final r = Base64Tool.decode(input);
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
            title: _isEncode ? '原始文本' : 'Base64 字符串',
            child: TextField(
              controller: _inputController,
              maxLines: 6,
              decoration: InputDecoration(
                hintText: _isEncode ? '输入要编码的文本...' : '输入 Base64 字符串...',
              ),
              style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              SegmentedButton<bool>(
                segments: const [
                  ButtonSegment(value: true, label: Text('编码')),
                  ButtonSegment(value: false, label: Text('解码')),
                ],
                selected: {_isEncode},
                onSelectionChanged: (v) {
                  setState(() => _isEncode = v.first);
                },
                style: SegmentedButton.styleFrom(
                  selectedBackgroundColor: AppColors.brand100,
                  selectedForegroundColor: AppColors.brand700,
                ),
              ),
              if (_isEncode) ...[
                const SizedBox(width: 12),
                FilterChip(
                  label: const Text('URL Safe', style: TextStyle(fontSize: 12)),
                  selected: _urlSafe,
                  onSelected: (v) => setState(() => _urlSafe = v),
                ),
              ],
              const Spacer(),
              FilledButton(
                onPressed: _process,
                child: const Text('执行'),
              ),
            ],
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
            title: _isEncode ? 'Base64 结果' : '解码结果',
            content: _result,
          ),
        ],
      ),
    );
  }
}
