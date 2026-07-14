import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class RandomSelectorPage extends StatefulWidget {
  const RandomSelectorPage({super.key});

  @override
  State<RandomSelectorPage> createState() => _RandomSelectorPageState();
}

class _RandomSelectorPageState extends State<RandomSelectorPage> {
  int _tabIndex = 0; // 0: 列表随机, 1: 抛硬币/抽签, 2: 随机数字, 3: 随机颜色
  final TextEditingController _listCtrl = TextEditingController();
  final TextEditingController _minCtrl = TextEditingController(text: '1');
  final TextEditingController _maxCtrl = TextEditingController(text: '100');
  final TextEditingController _countCtrl = TextEditingController(text: '1');

  String _result = '';
  List<String> _drawResults = [];

  @override
  void dispose() {
    _listCtrl.dispose();
    _minCtrl.dispose();
    _maxCtrl.dispose();
    _countCtrl.dispose();
    super.dispose();
  }

  void _pickFromList() {
    final r = RandomSelectorTool.pickFromList(_listCtrl.text);
    setState(() {
      _result = r.error ?? r.result;
    });
  }

  void _drawLots() {
    final count = int.tryParse(_countCtrl.text) ?? 1;
    setState(() {
      _drawResults = RandomSelectorTool.drawLots(_listCtrl.text, count);
    });
  }

  void _randomNumber() {
    final min = int.tryParse(_minCtrl.text) ?? 1;
    final max = int.tryParse(_maxCtrl.text) ?? 100;
    setState(() {
      _result = RandomSelectorTool.randomInt(min, max).toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Tab 选择
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
          child: SegmentedButton<int>(
            segments: const [
              ButtonSegment(value: 0, label: Text('列表随机', style: TextStyle(fontSize: 12))),
              ButtonSegment(value: 1, label: Text('抽签', style: TextStyle(fontSize: 12))),
              ButtonSegment(value: 2, label: Text('随机数字', style: TextStyle(fontSize: 12))),
              ButtonSegment(value: 3, label: Text('随机颜色', style: TextStyle(fontSize: 12))),
            ],
            selected: {_tabIndex},
            onSelectionChanged: (v) => setState(() {
              _tabIndex = v.first;
              _result = '';
              _drawResults = [];
            }),
            style: SegmentedButton.styleFrom(
              selectedBackgroundColor: AppColors.brand100,
              selectedForegroundColor: AppColors.brand700,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: _buildContent(),
          ),
        ),
      ],
    );
  }

  Widget _buildContent() {
    switch (_tabIndex) {
      case 0: return _buildListPicker();
      case 1: return _buildDrawLots();
      case 2: return _buildRandomNumber();
      case 3: return _buildRandomColor();
      default: return const SizedBox();
    }
  }

  Widget _buildListPicker() {
    return Column(
      children: [
        ToolCard(
          title: '选项列表',
          child: TextField(
            controller: _listCtrl,
            maxLines: 6,
            decoration: const InputDecoration(
              hintText: '输入选项，用逗号或换行分隔\n例：\n苹果\n香蕉\n橘子',
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: _pickFromList,
            icon: const Icon(Icons.shuffle),
            label: const Text('随机选一个'),
            style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
          ),
        ),
        const SizedBox(height: 16),
        if (_result.isNotEmpty)
          _resultCard(_result),
      ],
    );
  }

  Widget _buildDrawLots() {
    return Column(
      children: [
        ToolCard(
          title: '抽签选项',
          child: TextField(
            controller: _listCtrl,
            maxLines: 5,
            decoration: const InputDecoration(
              hintText: '输入选项，用逗号或换行分隔',
            ),
          ),
        ),
        const SizedBox(height: 8),
        ToolCard(
          title: '',
          child: TextField(
            controller: _countCtrl,
            decoration: const InputDecoration(
              labelText: '抽取数量',
              isDense: true,
            ),
            keyboardType: TextInputType.number,
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: _drawLots,
            icon: const Icon(Icons.casino_outlined),
            label: const Text('抽签'),
            style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
          ),
        ),
        const SizedBox(height: 16),
        if (_drawResults.isNotEmpty)
          ..._drawResults.asMap().entries.map((e) {
            return Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.brand50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.brand200),
              ),
              child: Row(
                children: [
                  Text('#${e.key + 1}', style: const TextStyle(fontSize: 12, color: AppColors.neutral400)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(e.value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  ),
                  CopyButton(text: e.value),
                ],
              ),
            );
          }),
      ],
    );
  }

  Widget _buildRandomNumber() {
    return Column(
      children: [
        ToolCard(
          title: '范围',
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _minCtrl,
                  decoration: const InputDecoration(labelText: '最小值', isDense: true),
                  keyboardType: TextInputType.number,
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 12),
                child: Text('~', style: TextStyle(fontSize: 20)),
              ),
              Expanded(
                child: TextField(
                  controller: _maxCtrl,
                  decoration: const InputDecoration(labelText: '最大值', isDense: true),
                  keyboardType: TextInputType.number,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: _randomNumber,
            icon: const Icon(Icons.shuffle),
            label: const Text('随机生成'),
            style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
          ),
        ),
        const SizedBox(height: 16),
        if (_result.isNotEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            alignment: Alignment.center,
            child: Text(
              _result,
              style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w200, fontFamily: 'monospace', color: AppColors.brand500),
            ),
          ),
      ],
    );
  }

  Widget _buildRandomColor() {
    return Column(
      children: [
        ToolCard(
          title: '',
          child: SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () {
                final c = RandomSelectorTool.randomColor();
                final color = Color.fromARGB(255, c.r, c.g, c.b);
                setState(() => _result = c.hex);
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    content: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(
                          c.hex,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                            color: color.computeLuminance() > 0.5 ? Colors.black : Colors.white,
                          ),
                        ),
                      ),
                    ),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('关闭')),
                      TextButton(onPressed: () {
                        CopyButton(text: c.hex);
                        Navigator.pop(ctx);
                      }, child: const Text('复制')),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.palette_outlined),
              label: const Text('生成随机颜色'),
              style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            ),
          ),
        ),
        const SizedBox(height: 16),
        // 抛硬币
        ToolCard(
          title: '抛硬币',
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                setState(() => _result = RandomSelectorTool.flipCoin());
              },
              icon: const Icon(Icons.monetization_on_outlined),
              label: const Text('抛一次'),
              style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            ),
          ),
        ),
        if (_result.isNotEmpty) ...[
          const SizedBox(height: 12),
          _resultCard(_result),
        ],
      ],
    );
  }

  Widget _resultCard(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.brand50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.brand200),
      ),
      child: Center(
        child: Text(
          text,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.brand600),
        ),
      ),
    );
  }
}
