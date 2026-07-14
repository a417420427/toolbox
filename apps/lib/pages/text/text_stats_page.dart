import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class TextStatsToolPage extends StatefulWidget {
  const TextStatsToolPage({super.key});

  @override
  State<TextStatsToolPage> createState() => _TextStatsToolPageState();
}

class _TextStatsToolPageState extends State<TextStatsToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  TextStatsData _stats = TextStatsData(
    charCount: 0, charNoSpace: 0, wordCount: 0, lineCount: 0,
    chineseCharCount: 0, byteCountUtf8: 0, byteCountUtf16: 0,
    digitCount: 0, letterCount: 0, punctuationCount: 0, spaceCount: 0,
  );

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
    setState(() {
      _stats = TextStatsTool.analyze(_inputCtrl.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          flex: 3,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: TextField(
              controller: _inputCtrl,
              maxLines: null,
              expands: true,
              textAlignVertical: TextAlignVertical.top,
              decoration: const InputDecoration(
                hintText: '输入文本，实时统计...',
              ),
            ),
          ),
        ),
        Expanded(
          flex: 4,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: GridView.count(
              crossAxisCount: 2,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              childAspectRatio: 2.5,
              children: [
                _statCard('字符数（含空格）', '${_stats.charCount}'),
                _statCard('字符数（不含空格）', '${_stats.charNoSpace}'),
                _statCard('单词数', '${_stats.wordCount}'),
                _statCard('行数', '${_stats.lineCount}'),
                _statCard('中文字数', '${_stats.chineseCharCount}'),
                _statCard('UTF-8 字节', '${_stats.byteCountUtf8}'),
                _statCard('数字', '${_stats.digitCount}'),
                _statCard('字母', '${_stats.letterCount}'),
                _statCard('标点', '${_stats.punctuationCount}'),
                _statCard('空格', '${_stats.spaceCount}'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _statCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              fontFamily: 'monospace',
              color: AppColors.brand500,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: AppColors.neutral400),
          ),
        ],
      ),
    );
  }
}
