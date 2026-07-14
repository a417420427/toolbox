import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// YAML ↔ JSON 互转
class YamlJsonPage extends StatefulWidget {
  const YamlJsonPage({super.key});

  @override
  State<YamlJsonPage> createState() => _YamlJsonPageState();
}

class _YamlJsonPageState extends State<YamlJsonPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  String _result = '';
  String? _error;
  bool _yamlToJsonMode = true;

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _convert() {
    final input = _inputCtrl.text.trim();
    if (input.isEmpty) {
      setState(() { _result = ''; _error = null; });
      return;
    }

    try {
      if (_yamlToJsonMode) {
        final jsonStr = YamlJsonConverter.yamlToJson(input);
        // 尝试格式化
        try {
          final parsed = jsonDecode(jsonStr);
          const encoder = JsonEncoder.withIndent('  ');
          setState(() { _result = encoder.convert(parsed); _error = null; });
        } catch (_) {
          setState(() { _result = jsonStr; _error = null; });
        }
      } else {
        // JSON → YAML
        setState(() {
          _result = YamlJsonConverter.jsonToYaml(input);
          _error = null;
        });
      }
    } catch (e) {
      setState(() { _result = ''; _error = '转换失败: $e'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 模式切换
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SegmentedButton<bool>(
            segments: const [
              ButtonSegment(value: true, label: Text('YAML → JSON')),
              ButtonSegment(value: false, label: Text('JSON → YAML')),
            ],
            selected: {_yamlToJsonMode},
            onSelectionChanged: (v) => setState(() { _yamlToJsonMode = v.first; _convert(); }),
          ),
        ),
        // 输入
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              controller: _inputCtrl,
              maxLines: null,
              expands: true,
              decoration: InputDecoration(
                hintText: _yamlToJsonMode ? '粘贴 YAML…' : '粘贴 JSON…',
                border: const OutlineInputBorder(),
                contentPadding: const EdgeInsets.all(12),
              ),
              style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
              onChanged: (_) => _convert(),
            ),
          ),
        ),
        // 结果
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(16),
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
                  _result.isEmpty ? (_error ?? '结果') : _result,
                  style: TextStyle(fontFamily: 'monospace', fontSize: 13, color: _error != null ? AppColors.error : null),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
