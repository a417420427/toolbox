import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class UnitConverterPage extends StatefulWidget {
  const UnitConverterPage({super.key});

  @override
  State<UnitConverterPage> createState() => _UnitConverterPageState();
}

class _UnitConverterPageState extends State<UnitConverterPage> {
  String _category = '长度';
  final TextEditingController _inputCtrl = TextEditingController(text: '1');
  int _fromIndex = 0;
  int _toIndex = 1;
  String _result = '';

  List<String> get _units => UnitConverterTool.unitsFor(_category);

  @override
  void initState() {
    super.initState();
    _inputCtrl.addListener(_convert);
    _convert();
  }

  @override
  void dispose() {
    _inputCtrl.removeListener(_convert);
    _inputCtrl.dispose();
    super.dispose();
  }

  void _convert() {
    final value = double.tryParse(_inputCtrl.text.replaceAll(',', '.'));
    if (value == null) {
      setState(() => _result = '');
      return;
    }
    final r = UnitConverterTool.convert(
      category: _category,
      value: value,
      fromIndex: _fromIndex,
      toIndex: _toIndex,
    );
    setState(() {
      _result = r.error ?? UnitConverterTool.format(r.result);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 分类选择
          ToolCard(
            title: '分类',
            child: Wrap(
              spacing: 8,
              runSpacing: 4,
              children: UnitConverterTool.categories.map((cat) {
                return ChoiceChip(
                  label: Text(cat, style: const TextStyle(fontSize: 13)),
                  selected: _category == cat,
                  onSelected: (v) {
                    setState(() {
                      _category = cat;
                      _fromIndex = 0;
                      _toIndex = 1;
                    });
                    _convert();
                  },
                  selectedColor: AppColors.brand100,
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          // 输入
          ToolCard(
            title: '数值',
            child: TextField(
              controller: _inputCtrl,
              keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
              style: const TextStyle(fontSize: 20, fontFamily: 'monospace'),
              decoration: const InputDecoration(
                prefixText: ' ',
              ),
            ),
          ),
          const SizedBox(height: 16),
          // 源单位和目标单位
          ToolCard(
            title: '单位',
            child: Column(
              children: [
                DropdownButtonFormField<int>(
                  initialValue: _fromIndex,
                  decoration: const InputDecoration(labelText: '从', isDense: true),
                  items: _units.asMap().entries.map((e) => DropdownMenuItem(
                    value: e.key,
                    child: Text(e.value, style: const TextStyle(fontSize: 14)),
                  )).toList(),
                  onChanged: (v) {
                    if (v != null) {
                      setState(() => _fromIndex = v);
                      _convert();
                    }
                  },
                ),
                const SizedBox(height: 16),
                Center(
                  child: IconButton(
                    icon: const Icon(Icons.swap_vert, color: AppColors.brand500),
                    onPressed: () {
                      setState(() {
                        final t = _fromIndex;
                        _fromIndex = _toIndex;
                        _toIndex = t;
                      });
                      _convert();
                    },
                  ),
                ),
                DropdownButtonFormField<int>(
                  initialValue: _toIndex,
                  decoration: const InputDecoration(labelText: '到', isDense: true),
                  items: _units.asMap().entries.map((e) => DropdownMenuItem(
                    value: e.key,
                    child: Text(e.value, style: const TextStyle(fontSize: 14)),
                  )).toList(),
                  onChanged: (v) {
                    if (v != null) {
                      setState(() => _toIndex = v);
                      _convert();
                    }
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // 结果
          if (_result.isNotEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.brand50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.brand200),
              ),
              child: Column(
                children: [
                  Text(
                    '${_inputCtrl.text} ${_units[_fromIndex].split(' (')[0]}',
                    style: const TextStyle(fontSize: 14, color: AppColors.neutral500),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '=  $_result  ${_units[_toIndex].split(' (')[0]}',
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.brand600),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
