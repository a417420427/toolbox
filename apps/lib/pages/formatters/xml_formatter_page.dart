import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// XML 格式化
class XmlFormatterPage extends StatefulWidget {
  const XmlFormatterPage({super.key});

  @override
  State<XmlFormatterPage> createState() => _XmlFormatterPageState();
}

class _XmlFormatterPageState extends State<XmlFormatterPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  String _result = '';
  String? _error;
  bool _isMinify = false;

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _process() {
    final r = XmlFormatter.process(_inputCtrl.text, isMinify: _isMinify);
    setState(() {
      _result = r.result;
      _error = r.error;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: TextField(
            controller: _inputCtrl,
            maxLines: null,
            expands: true,
            decoration: InputDecoration(
              hintText: '粘贴 XML…',
              border: const OutlineInputBorder(),
              contentPadding: const EdgeInsets.all(12),
              suffixIcon: _inputCtrl.text.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.clear, size: 18), onPressed: () { _inputCtrl.clear(); setState(() { _result = ''; _error = null; }); })
                  : null,
            ),
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
            onChanged: (_) => _process(),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            SegmentedButton<bool>(
              segments: const [
                ButtonSegment(value: false, label: Text('格式化', style: TextStyle(fontSize: 12))),
                ButtonSegment(value: true, label: Text('压缩', style: TextStyle(fontSize: 12))),
              ],
              selected: {_isMinify},
              onSelectionChanged: (v) => setState(() { _isMinify = v.first; _process(); }),
              style: const ButtonStyle(visualDensity: VisualDensity.compact),
            ),
            const Spacer(),
            if (_result.isNotEmpty)
              IconButton(icon: const Icon(Icons.copy, size: 18), onPressed: () {
                // copy
              }, tooltip: '复制'),
          ],
        ),
        const SizedBox(height: 8),
        Expanded(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: _error != null ? AppColors.error : AppColors.neutral200),
            ),
            child: SingleChildScrollView(
              child: SelectableText(
                _result.isEmpty ? (_error ?? '结果将显示在这里') : _result,
                style: TextStyle(fontFamily: 'monospace', fontSize: 13, color: _error != null ? AppColors.error : null),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
