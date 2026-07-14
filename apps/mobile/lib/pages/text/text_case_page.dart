import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class TextCaseToolPage extends StatefulWidget {
  const TextCaseToolPage({super.key});

  @override
  State<TextCaseToolPage> createState() => _TextCaseToolPageState();
}

class _TextCaseToolPageState extends State<TextCaseToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();

  String _upper = '';
  String _lower = '';
  String _title = '';
  String _sentence = '';
  String _camel = '';
  String _pascal = '';
  String _snake = '';
  String _kebab = '';
  String _reverse = '';

  @override
  void initState() {
    super.initState();
    _inputCtrl.addListener(_update);
  }

  @override
  void dispose() {
    _inputCtrl.removeListener(_update);
    _inputCtrl.dispose();
    super.dispose();
  }

  void _update() {
    final r = TextCaseTool.convert(_inputCtrl.text);
    setState(() {
      _upper = r.upper;
      _lower = r.lower;
      _title = r.title;
      _sentence = r.sentence;
      _camel = r.camel;
      _pascal = r.pascal;
      _snake = r.snake;
      _kebab = r.kebab;
      _reverse = r.reverse;
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
                hintText: '输入文本，实时转换...',
              ),
            ),
          ),
          const SizedBox(height: 16),
          ..._buildItems([
            ('UPPERCASE', _upper),
            ('lowercase', _lower),
            ('Title Case', _title),
            ('Sentence case', _sentence),
            ('camelCase', _camel),
            ('PascalCase', _pascal),
            ('snake_case', _snake),
            ('kebab-case', _kebab),
            ('反转', _reverse),
          ]),
        ],
      ),
    );
  }

  List<Widget> _buildItems(List<(String label, String value)> items) {
    return items.map((item) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    item.$1,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.neutral400),
                  ),
                  const Spacer(),
                  if (item.$2.isNotEmpty) CopyButton(text: item.$2),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                item.$2.isEmpty ? '—' : item.$2,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
              ),
            ],
          ),
        ),
      );
    }).toList();
  }
}
