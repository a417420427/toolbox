import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 进制转换
class NumberBasePage extends StatefulWidget {
  const NumberBasePage({super.key});

  @override
  State<NumberBasePage> createState() => _NumberBasePageState();
}

class _NumberBasePageState extends State<NumberBasePage> {
  final TextEditingController _inputCtrl = TextEditingController();
  int _fromBase = 10;
  int _toBase = 2;
  final Map<int, String> _results = {};

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _convert() {
    final input = _inputCtrl.text.trim();
    final results = <int, String>{};
    if (input.isNotEmpty && NumberBaseTool.isValid(input, _fromBase)) {
      for (final base in NumberBaseTool.bases) {
        results[base] = NumberBaseTool.convert(input, _fromBase, base);
      }
    }
    setState(() => _results..clear()..addAll(results));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _inputCtrl,
                    decoration: InputDecoration(
                      labelText: '输入数值',
                      border: const OutlineInputBorder(),
                      suffixText: '($_fromBase 进制)',
                    ),
                    onChanged: (_) => _convert(),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Text('从 ', style: TextStyle(fontSize: 14)),
                      _baseChip(2), _baseChip(8), _baseChip(10), _baseChip(16),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Text('到 ', style: TextStyle(fontSize: 14)),
                      _baseChip(2, isTo: true), _baseChip(8, isTo: true),
                      _baseChip(10, isTo: true), _baseChip(16, isTo: true),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (_results.isNotEmpty)
            ...NumberBaseTool.bases.where((b) => b != _fromBase).map((base) {
              return Card(
                child: ListTile(
                  title: Text('$base 进制', style: const TextStyle(fontWeight: FontWeight.w500)),
                  trailing: SelectableText(
                    _results[base] ?? '',
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 16),
                  ),
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _baseChip(int base, {bool isTo = false}) {
    final selected = isTo ? _toBase == base : _fromBase == base;
    return Padding(
      padding: const EdgeInsets.only(right: 4),
      child: ChoiceChip(
        label: Text('$base', style: const TextStyle(fontSize: 12)),
        selected: selected,
        onSelected: (_) {
          setState(() {
            if (isTo) { _toBase = base; } else { _fromBase = base; }
          });
          _convert();
        },
      ),
    );
  }
}
