import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 健康指标计算 (BMI / BMR / 体脂率)
class BmiPage extends StatefulWidget {
  const BmiPage({super.key});

  @override
  State<BmiPage> createState() => _BmiPageState();
}

class _BmiPageState extends State<BmiPage> {
  final _heightCtrl = TextEditingController(text: '170');
  final _weightCtrl = TextEditingController(text: '65');
  final _ageCtrl = TextEditingController(text: '30');
  bool _isMale = true;
  int _activityLevel = 2; // 默认中度活动

  // 结果
  double _bmi = double.nan;
  String _bmiLabel = '—';
  String _bmiDetail = '请输入身高和体重';
  int _bmiColor = 0;
  double _bmr = double.nan;
  double _tdee = double.nan;
  double _bodyFat = double.nan;
  String _idealWeight = '—';

  void _calculate() {
    final h = double.tryParse(_heightCtrl.text) ?? 0;
    final w = double.tryParse(_weightCtrl.text) ?? 0;
    final age = int.tryParse(_ageCtrl.text) ?? 0;

    if (h <= 0 || w <= 0 || age <= 0) {
      setState(() {
        _bmi = double.nan;
        _bmiLabel = '—';
        _bmiDetail = '请输入有效的数值';
        _bmiColor = 0;
      });
      return;
    }

    final bmi = BmiTool.bmi(w, h);
    final category = BmiTool.bmiCategory(bmi);
    final bmr = BmiTool.bmr(w, h, age, _isMale);
    final tdee = BmiTool.tdee(bmr, BmiTool.activityLevels[_activityLevel].factor);
    final bf = BmiTool.bodyFatPercentage(bmi, age, _isMale);
    final ideal = BmiTool.idealWeightRange(h.toInt(), _isMale);

    setState(() {
      _bmi = bmi;
      _bmiLabel = category.label;
      _bmiDetail = category.detail;
      _bmiColor = category.color;
      _bmr = bmr;
      _tdee = tdee;
      _bodyFat = bf;
      _idealWeight = '${BmiTool.format(ideal[0])} — ${BmiTool.format(ideal[1])} kg';
    });
  }

  @override
  void dispose() {
    _heightCtrl.dispose();
    _weightCtrl.dispose();
    _ageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 输入区
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    children: [
                      const SizedBox(width: 8),
                      _buildGenderToggle(),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _heightCtrl,
                    decoration: const InputDecoration(
                      labelText: '身高',
                      border: OutlineInputBorder(),
                      suffixText: 'cm',
                      prefixIcon: Icon(Icons.height),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _weightCtrl,
                    decoration: const InputDecoration(
                      labelText: '体重',
                      border: OutlineInputBorder(),
                      suffixText: 'kg',
                      prefixIcon: Icon(Icons.monitor_weight_outlined),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _ageCtrl,
                          decoration: const InputDecoration(
                            labelText: '年龄',
                            border: OutlineInputBorder(),
                            suffixText: '岁',
                          ),
                          keyboardType: TextInputType.number,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActivityDropdown(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: FilledButton.icon(
                      onPressed: _calculate,
                      icon: const Icon(Icons.calculate),
                      label: const Text('计算'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // ── BMI 结果 ──
          if (!_bmi.isNaN) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text(
                      BmiTool.format(_bmi),
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Color(_bmiColor),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: Color(_bmiColor).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        _bmiLabel,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Color(_bmiColor),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _bmiDetail,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.neutral500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // ── 详细信息 ──
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _resultRow('基础代谢 (BMR)', '${BmiTool.format(_bmr)} kcal/天'),
                    const Divider(height: 16),
                    _resultRow('每日热量需求 (TDEE)', '${BmiTool.format(_tdee)} kcal/天'),
                    const Divider(height: 16),
                    _resultRow('体脂率 (估算)', '${BmiTool.format(_bodyFat)}%'),
                    const Divider(height: 16),
                    _resultRow('理想体重范围', _idealWeight),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildGenderToggle() {
    return SegmentedButton<bool>(
      segments: const [
        ButtonSegment(value: true, label: Text('男性'), icon: Icon(Icons.male, size: 18)),
        ButtonSegment(value: false, label: Text('女性'), icon: Icon(Icons.female, size: 18)),
      ],
      selected: {_isMale},
      onSelectionChanged: (v) => setState(() => _isMale = v.first),
    );
  }

  Widget _buildActivityDropdown() {
    return DropdownButtonFormField<int>(
      initialValue: _activityLevel,
      decoration: const InputDecoration(
        labelText: '活动水平',
        border: OutlineInputBorder(),
      ),
      isExpanded: true,
      items: BmiTool.activityLevels.asMap().entries.map((e) {
        return DropdownMenuItem(value: e.key, child: Text(e.value.label, overflow: TextOverflow.ellipsis));
      }).toList(),
      onChanged: (v) {
        if (v != null) setState(() => _activityLevel = v);
      },
    );
  }

  Widget _resultRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 14)),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.brand500)),
      ],
    );
  }
}
