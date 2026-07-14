import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class DateCalcPage extends StatefulWidget {
  const DateCalcPage({super.key});

  @override
  State<DateCalcPage> createState() => _DateCalcPageState();
}

class _DateCalcPageState extends State<DateCalcPage> {
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now().add(const Duration(days: 7));
  int _addDays = 0;
  int _addMonths = 0;
  int _addYears = 0;
  String _result = '';
  String _addResult = '';
  String _weekdayResult = '';
  String _ageResult = '';

  @override
  void initState() {
    super.initState();
    _calculateAll();
  }

  void _calculateAll() {
    // 日期差
    final diff = DateCalcTool.dateDiff(_startDate, _endDate);
    setState(() {
      _result = '相差 ${diff.totalDays.abs()} 天';
    });

    // 工作日
    final wd = DateCalcTool.weekdaysBetween(_startDate, _endDate);
    _weekdayResult = '工作日: $wd 天';

    // 加减
    var added = _startDate;
    if (_addYears != 0) added = DateCalcTool.addYears(added, _addYears);
    if (_addMonths != 0) added = DateCalcTool.addMonths(added, _addMonths);
    if (_addDays != 0) added = DateCalcTool.addDays(added, _addDays);
    _addResult = _formatDate(added);

    // 年龄
    final age = DateCalcTool.age(_startDate);
    _ageResult = '${age.years} 岁 ${age.months} 个月 ${age.days} 天';
  }

  String _formatDate(DateTime dt) {
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')}';
  }

  Future<void> _pickDate(bool isStart) async {
    final initial = isStart ? _startDate : _endDate;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        if (isStart) _startDate = picked;
        else _endDate = picked;
      });
      _calculateAll();
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 日期差
          ToolCard(
            title: '日期差',
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _dateButton('开始', _startDate, () => _pickDate(true)),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.date_range, color: AppColors.brand400),
                    ),
                    Expanded(
                      child: _dateButton('结束', _endDate, () => _pickDate(false)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.brand50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(_result, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.brand600)),
                      const SizedBox(height: 4),
                      Text(_weekdayResult, style: const TextStyle(fontSize: 14, color: AppColors.neutral500)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // 加减日期
          ToolCard(
            title: '日期加减',
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(child: _numberInput('年', _addYears, (v) => setState(() => _addYears = v))),
                    const SizedBox(width: 8),
                    Expanded(child: _numberInput('月', _addMonths, (v) => setState(() => _addMonths = v))),
                    const SizedBox(width: 8),
                    Expanded(child: _numberInput('天', _addDays, (v) => setState(() => _addDays = v))),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: _calculateAll,
                      child: const Text('计算'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${_formatDate(_startDate)}  +  ${_addYears}y ${_addMonths}m ${_addDays}d',
                  style: const TextStyle(fontSize: 14, color: AppColors.neutral500),
                ),
                const SizedBox(height: 4),
                Text(
                  '=  $_addResult',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.brand600),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // 年龄计算
          ToolCard(
            title: '年龄计算',
            child: Column(
              children: [
                _dateButton('出生日期', _startDate, () => _pickDate(true)),
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.brand50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(_ageResult, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.brand600)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dateButton(String label, DateTime date, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          isDense: true,
          suffixIcon: const Icon(Icons.calendar_today, size: 18),
        ),
        child: Text(_formatDate(date), style: const TextStyle(fontWeight: FontWeight.w500)),
      ),
    );
  }

  Widget _numberInput(String label, int value, ValueChanged<int> onChanged) {
    return TextField(
      decoration: InputDecoration(labelText: label, isDense: true),
      keyboardType: TextInputType.number,
      style: const TextStyle(fontSize: 14),
      onChanged: (v) => onChanged(int.tryParse(v) ?? 0),
    );
  }
}
