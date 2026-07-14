import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class RegexToolPage extends StatefulWidget {
  const RegexToolPage({super.key});

  @override
  State<RegexToolPage> createState() => _RegexToolPageState();
}

class _RegexToolPageState extends State<RegexToolPage> {
  final TextEditingController _patternCtrl = TextEditingController();
  final TextEditingController _textCtrl = TextEditingController();

  bool _flagGlobal = true;
  bool _flagCaseSensitive = true;
  bool _flagMultiLine = false;
  bool _flagDotAll = false;
  bool _flagUnicode = false;

  RegexResult? _result;

  @override
  void initState() {
    super.initState();
    _patternCtrl.addListener(_run);
    _textCtrl.addListener(_run);
  }

  @override
  void dispose() {
    _patternCtrl.removeListener(_run);
    _textCtrl.removeListener(_run);
    _patternCtrl.dispose();
    _textCtrl.dispose();
    super.dispose();
  }

  void _run() {
    setState(() {
      _result = RegexTool.test(
        _patternCtrl.text,
        _textCtrl.text,
        global: _flagGlobal,
        caseSensitive: _flagCaseSensitive,
        multiLine: _flagMultiLine,
        dotAll: _flagDotAll,
        unicode: _flagUnicode,
      );
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
            title: '正则表达式',
            child: TextField(
              controller: _patternCtrl,
              decoration: const InputDecoration(
                hintText: r'输入正则，如 \d+',
                prefixIcon: Icon(Icons.manage_search, size: 20),
              ),
              style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
            ),
          ),
          const SizedBox(height: 12),
          // Flags
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              _flagChip('g 全局', _flagGlobal, (v) => setState(() => _flagGlobal = v)),
              _flagChip('i 忽略大小写', !_flagCaseSensitive, (v) => setState(() => _flagCaseSensitive = !v)),
              _flagChip('m 多行', _flagMultiLine, (v) => setState(() => _flagMultiLine = v)),
              _flagChip('s 点号匹配换行', _flagDotAll, (v) => setState(() => _flagDotAll = v)),
              _flagChip('u Unicode', _flagUnicode, (v) => setState(() => _flagUnicode = v)),
            ],
          ),
          const SizedBox(height: 12),
          ToolCard(
            title: '测试文本',
            child: TextField(
              controller: _textCtrl,
              maxLines: 8,
              decoration: const InputDecoration(
                hintText: '输入测试文本...',
              ),
            ),
          ),
          const SizedBox(height: 16),
          // 常用模式速查
          ToolCard(
            title: '常用模式',
            child: Wrap(
              spacing: 8,
              runSpacing: 4,
              children: RegexTool.quickPatterns.map((p) {
                return ActionChip(
                  label: Text(p.label, style: const TextStyle(fontSize: 12)),
                  onPressed: () {
                    _patternCtrl.text = p.pattern;
                  },
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          // 错误
          if (_result != null && !_result!.isValid)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _result!.error ?? '',
                style: const TextStyle(color: AppColors.error, fontSize: 13),
              ),
            ),
          // 匹配结果
          if (_result != null && _result!.isValid) ...[
            Text(
              '匹配结果 (${_result!.matchCount})',
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
            ),
            const SizedBox(height: 8),
            if (_result!.matches.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.neutral200),
                ),
                child: const Center(
                  child: Text('无匹配', style: TextStyle(color: AppColors.neutral400)),
                ),
              )
            else
              ..._result!.matches.take(100).map((m) {
                return Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: AppColors.brand200.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      Text(
                        '#${m.index}',
                        style: const TextStyle(fontSize: 11, color: AppColors.neutral400, fontFamily: 'monospace'),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          m.match,
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        '(pos: ${m.start})',
                        style: const TextStyle(fontSize: 11, color: AppColors.neutral400, fontFamily: 'monospace'),
                      ),
                      const SizedBox(width: 4),
                      CopyButton(text: m.match),
                    ],
                  ),
                );
              }),
          ],
        ],
      ),
    );
  }

  Widget _flagChip(String label, bool selected, ValueChanged<bool> onChanged) {
    return FilterChip(
      label: Text(label, style: const TextStyle(fontSize: 12)),
      selected: selected,
      onSelected: onChanged,
      visualDensity: VisualDensity.compact,
    );
  }
}
