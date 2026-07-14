import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class UnicodeToolPage extends StatefulWidget {
  const UnicodeToolPage({super.key});

  @override
  State<UnicodeToolPage> createState() => _UnicodeToolPageState();
}

class _UnicodeToolPageState extends State<UnicodeToolPage> {
  final TextEditingController _charInput = TextEditingController();
  final TextEditingController _codeInput = TextEditingController();

  String _charResult = '';
  String _codeResult = '';
  List<({String char, String codePoint, String name, String? block})> _batchResults = [];
  String? _error;

  @override
  void dispose() {
    _charInput.dispose();
    _codeInput.dispose();
    super.dispose();
  }

  void _queryChar() {
    final input = _charInput.text;
    if (input.isEmpty) {
      setState(() {
        _charResult = '';
        _batchResults = [];
      });
      return;
    }

    // 单字符查询 vs 批量
    if (input.length == 1 && input.runes.length == 1) {
      final info = UnicodeTool.charInfo(input);
      setState(() {
        _charResult = '${info.codePoint}  ${info.name}  ${info.block ?? ""}';
        _batchResults = [];
      });
    } else {
      setState(() {
        _batchResults = UnicodeTool.batchInfo(input);
        _charResult = '';
      });
    }
  }

  void _queryCode() {
    final r = UnicodeTool.fromCodePoint(_codeInput.text);
    setState(() {
      _codeResult = r.char;
      _error = r.error;
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
            title: '字符 → 码点',
            child: TextField(
              controller: _charInput,
              decoration: const InputDecoration(
                hintText: '输入字符（支持批量查询）',
                prefixIcon: Icon(Icons.text_fields, size: 20),
              ),
              style: const TextStyle(fontSize: 18),
              onChanged: (_) => _queryChar(),
            ),
          ),
          if (_charResult.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.neutral200),
              ),
              child: Row(
                children: [
                  Text(
                    _charInput.text,
                    style: const TextStyle(fontSize: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      _charResult,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (_batchResults.isNotEmpty) ...[
            const SizedBox(height: 8),
            ..._batchResults.map((r) {
              return Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 4),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.neutral200),
                ),
                child: Row(
                  children: [
                    SizedBox(
                      width: 28,
                      child: Text(r.char, style: const TextStyle(fontSize: 18)),
                    ),
                    const SizedBox(width: 12),
                    Text(r.codePoint, style: const TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        r.name.isNotEmpty ? r.name : '—',
                        style: const TextStyle(fontSize: 12, color: AppColors.neutral500),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (r.block != null)
                      Text(
                        r.block!,
                        style: const TextStyle(fontSize: 11, color: AppColors.neutral400),
                      ),
                  ],
                ),
              );
            }),
          ],
          const SizedBox(height: 16),
          ToolCard(
            title: '码点 → 字符',
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _codeInput,
                    decoration: const InputDecoration(
                      hintText: '如 U+4E00 或 4E00',
                      prefixText: 'U+ ',
                      prefixStyle: TextStyle(color: AppColors.neutral400, fontFamily: 'monospace'),
                    ),
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                  ),
                ),
                const SizedBox(width: 12),
                FilledButton(
                  onPressed: _queryCode,
                  child: const Text('查询'),
                ),
              ],
            ),
          ),
          if (_codeResult.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.neutral200),
              ),
              child: Center(
                child: Text(
                  _codeResult,
                  style: const TextStyle(fontSize: 48),
                ),
              ),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13)),
          ],
        ],
      ),
    );
  }
}
