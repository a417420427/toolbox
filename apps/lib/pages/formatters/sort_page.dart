import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 排序 / 去重工具
class SortPage extends StatefulWidget {
  const SortPage({super.key});

  @override
  State<SortPage> createState() => _SortPageState();
}

class _SortPageState extends State<SortPage> {
  final _ctrl = TextEditingController(
    text: '香蕉\n苹果\n橙子\n苹果\n葡萄\n香蕉\n蓝莓\n草莓',
  );
  String _output = '';
  ({int totalLines, int nonEmptyLines, int uniqueLines})? _stats;
  int _selectedAction = 0;
  bool _autoUpdate = true;

  final _actions = <(String, IconData)>[
    ('升序排序', Icons.arrow_upward),
    ('降序排序', Icons.arrow_downward),
    ('按长度排序', Icons.text_fields),
    ('反转顺序', Icons.swap_vert),
    ('去重', Icons.filter_1),
    ('去重(忽略大小写)', Icons.filter_alt_outlined),
    ('移除空行', Icons.space_bar),
  ];

  void _process() {
    final input = _ctrl.text;

    setState(() {
      _output = switch (_selectedAction) {
        0 => SortTool.sort(input, SortMode.asc),
        1 => SortTool.sort(input, SortMode.desc),
        2 => SortTool.sort(input, SortMode.lengthAsc),
        3 => SortTool.sort(input, SortMode.reverse),
        4 => SortTool.dedup(input, DedupMode.all),
        5 => SortTool.dedup(input, DedupMode.caseInsensitive),
        6 => SortTool.removeEmptyLines(input),
        _ => input,
      };
      _stats = SortTool.stats(input);
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 44,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            itemCount: _actions.length,
            itemBuilder: (ctx, i) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 3),
                child: FilterChip(
                  selected: _selectedAction == i,
                  label: Text(_actions[i].$1, style: const TextStyle(fontSize: 12)),
                  avatar: Icon(_actions[i].$2, size: 16),
                  onSelected: (v) {
                    setState(() => _selectedAction = i);
                    if (_autoUpdate) _process();
                  },
                  visualDensity: VisualDensity.compact,
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 4),

        if (_stats != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: Row(
              children: [
                _statChip('${_stats!.totalLines} 行', Icons.line_weight),
                const SizedBox(width: 8),
                _statChip('${_stats!.nonEmptyLines} 非空', Icons.text_fields),
                const SizedBox(width: 8),
                _statChip('${_stats!.uniqueLines} 不重复', Icons.filter_none),
              ],
            ),
          ),

        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                Expanded(child: _buildTextPanel('输入', _ctrl, onChanged: (_) => _process())),
                const SizedBox(width: 4),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_forward, size: 20),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: _ctrl.text));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('输入已复制'), duration: Duration(seconds: 1)),
                        );
                      },
                      tooltip: '复制输入',
                    ),
                    IconButton(
                      icon: const Icon(Icons.refresh, size: 20),
                      onPressed: _process,
                      tooltip: '执行',
                    ),
                    IconButton(
                      icon: Icon(_autoUpdate ? Icons.sync : Icons.sync_disabled, size: 20),
                      onPressed: () => setState(() => _autoUpdate = !_autoUpdate),
                      tooltip: _autoUpdate ? '自动执行' : '手动执行',
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy_all, size: 20),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: _output));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('结果已复制'), duration: Duration(seconds: 1)),
                        );
                      },
                      tooltip: '复制结果',
                    ),
                  ],
                ),
                const SizedBox(width: 4),
                Expanded(child: _buildOutputPanel('结果', _output)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _statChip(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.brand50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppColors.brand500),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 11, color: AppColors.brand500)),
        ],
      ),
    );
  }

  Widget _buildTextPanel(String label, TextEditingController ctrl, {ValueChanged<String>? onChanged}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 4),
        Expanded(
          child: TextField(
            controller: ctrl,
            maxLines: null,
            expands: true,
            textAlignVertical: TextAlignVertical.top,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.all(8),
              isDense: true,
            ),
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildOutputPanel(String label, String text) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 4),
        Expanded(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.neutral300),
              borderRadius: BorderRadius.circular(4),
            ),
            child: SingleChildScrollView(
              child: SelectableText(
                text,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
