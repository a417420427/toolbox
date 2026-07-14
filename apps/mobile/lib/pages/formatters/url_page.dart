import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class UrlToolPage extends StatefulWidget {
  const UrlToolPage({super.key});

  @override
  State<UrlToolPage> createState() => _UrlToolPageState();
}

class _UrlToolPageState extends State<UrlToolPage> {
  final TextEditingController _inputController = TextEditingController();
  String _result = '';
  String? _error;
  bool _isEncode = true;
  bool _fullEncode = false; // false = component, true = full

  @override
  void dispose() {
    _inputController.dispose();
    super.dispose();
  }

  void _process() {
    final input = _inputController.text;
    if (_isEncode) {
      final r = _fullEncode ? UrlTool.encodeFull(input) : UrlTool.encodeComponent(input);
      setState(() {
        _result = r;
        _error = null;
      });
    } else {
      final r = _fullEncode ? UrlTool.decodeFull(input) : UrlTool.decodeComponent(input);
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
            title: _isEncode ? '原始字符串' : '编码后字符串',
            child: TextField(
              controller: _inputController,
              maxLines: 6,
              decoration: InputDecoration(
                hintText: _isEncode ? '输入要编码的 URL 参数...' : '输入编码后的 URL...',
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
              const SizedBox(width: 12),
              FilterChip(
                label: const Text('encodeURI', style: TextStyle(fontSize: 12)),
                selected: _fullEncode,
                onSelected: (v) => setState(() => _fullEncode = v),
              ),
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
                color: AppColors.warning.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber, color: AppColors.warning, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _error!,
                      style: const TextStyle(color: AppColors.warning, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 12),
          ResultPanel(
            title: '结果',
            content: _result,
          ),
        ],
      ),
    );
  }
}
