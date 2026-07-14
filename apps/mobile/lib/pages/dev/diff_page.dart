import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 文本差异对比
class DiffPage extends StatefulWidget {
  const DiffPage({super.key});

  @override
  State<DiffPage> createState() => _DiffPageState();
}

class _DiffPageState extends State<DiffPage> {
  final TextEditingController _oldCtrl = TextEditingController();
  final TextEditingController _newCtrl = TextEditingController();
  List<DiffLine> _lines = [];
  ({int added, int removed}) _stats = (added: 0, removed: 0);

  @override
  void dispose() {
    _oldCtrl.dispose();
    _newCtrl.dispose();
    super.dispose();
  }

  void _compare() {
    setState(() {
      _lines = DiffTool.diff(_oldCtrl.text, _newCtrl.text);
      _stats = DiffTool.stats(_oldCtrl.text, _newCtrl.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 输入区
        Expanded(
          flex: 2,
          child: Row(
            children: [
              Expanded(
                child: _inputPanel('原始文本', _oldCtrl, AppColors.error.withAlpha(30)),
              ),
              const VerticalDivider(width: 1),
              Expanded(
                child: _inputPanel('新文本', _newCtrl, const Color(0xFF43A047).withAlpha(30)),
              ),
            ],
          ),
        ),
        // 工具栏：比较按钮 + 统计
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: Row(
            children: [
              FilledButton.icon(
                onPressed: _compare,
                icon: const Icon(Icons.compare_arrows, size: 16),
                label: const Text('比较'),
              ),
              const SizedBox(width: 12),
              if (_lines.isNotEmpty)
                Text(
                  '+${_stats.added}  -${_stats.removed}  ${_lines.length}行',
                  style: TextStyle(fontSize: 12, color: AppColors.neutral500),
                ),
            ],
          ),
        ),
        // 差异结果
        Expanded(
          flex: 3,
          child: _lines.isEmpty
              ? const Center(child: Text('输入文本后点击"比较"', style: TextStyle(color: AppColors.neutral400)))
              : ListView.builder(
                  itemCount: _lines.length,
                  itemBuilder: (context, index) {
                    final line = _lines[index];
                    Color? bgColor;
                    String prefix = ' ';
                    if (line.type == DiffType.added) {
                      bgColor = const Color(0xFF43A047).withAlpha(25);
                      prefix = '+';
                    } else if (line.type == DiffType.removed) {
                      bgColor = AppColors.error.withAlpha(25);
                      prefix = '-';
                    }
                    return Container(
                      color: bgColor,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(
                            width: 20,
                            child: Text(prefix, style: TextStyle(
                              fontSize: 13, fontFamily: 'monospace',
                              color: line.type == DiffType.added
                                  ? const Color(0xFF43A047)
                                  : (line.type == DiffType.removed ? AppColors.error : AppColors.neutral400),
                              fontWeight: FontWeight.w600,
                            )),
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              line.text,
                              style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _inputPanel(String label, TextEditingController ctrl, Color bgColor) {
    return Container(
      color: bgColor,
      child: TextField(
        controller: ctrl,
        maxLines: null,
        expands: true,
        decoration: InputDecoration(
          hintText: label,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(8),
        ),
        style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
      ),
    );
  }
}
