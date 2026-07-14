import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class HtmlEntityToolPage extends StatefulWidget {
  const HtmlEntityToolPage({super.key});

  @override
  State<HtmlEntityToolPage> createState() => _HtmlEntityToolPageState();
}

class _HtmlEntityToolPageState extends State<HtmlEntityToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  String _result = '';
  bool _isEncode = true;

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _process() {
    final input = _inputCtrl.text;
    setState(() {
      _result = _isEncode ? HtmlEntityTool.encode(input) : HtmlEntityTool.decode(input);
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
            title: _isEncode ? '原始文本' : 'HTML 实体',
            child: TextField(
              controller: _inputCtrl,
              maxLines: 6,
              decoration: InputDecoration(
                hintText: _isEncode ? '输入包含 < > & " \' 的文本...' : '输入 HTML 实体字符串...',
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
                onSelectionChanged: (v) => setState(() => _isEncode = v.first),
                style: SegmentedButton.styleFrom(
                  selectedBackgroundColor: AppColors.brand100,
                  selectedForegroundColor: AppColors.brand700,
                ),
              ),
              const Spacer(),
              FilledButton(
                onPressed: _process,
                child: const Text('执行'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ResultPanel(title: '结果', content: _result),
        ],
      ),
    );
  }
}
