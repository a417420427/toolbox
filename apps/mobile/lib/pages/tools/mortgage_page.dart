import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 房贷计算器
class MortgagePage extends StatefulWidget {
  const MortgagePage({super.key});

  @override
  State<MortgagePage> createState() => _MortgagePageState();
}

class _MortgagePageState extends State<MortgagePage> {
  final TextEditingController _amountCtrl = TextEditingController(text: '1000000');
  final TextEditingController _rateCtrl = TextEditingController(text: '3.85');
  final TextEditingController _yearsCtrl = TextEditingController(text: '30');

  // 0=等额本息, 1=等额本金
  int _type = 0;

  String _monthly = '—';
  String _totalInterest = '—';
  String _totalPayment = '—';
  String _firstMonth = '—';

  @override
  void dispose() {
    _amountCtrl.dispose();
    _rateCtrl.dispose();
    _yearsCtrl.dispose();
    super.dispose();
  }

  void _calculate() {
    final p = double.tryParse(_amountCtrl.text) ?? 0;
    final annualRate = double.tryParse(_rateCtrl.text) ?? 0;
    final years = int.tryParse(_yearsCtrl.text) ?? 0;

    if (p <= 0 || annualRate < 0 || years <= 0) {
      setState(() {
        _monthly = '—';
        _totalInterest = '—';
        _totalPayment = '—';
        _firstMonth = '—';
      });
      return;
    }

    final r = annualRate / 100 / 12;
    final n = years * 12;

    setState(() {
      if (_type == 0) {
        final monthly = MortgageTool.equalPayment(p, r, n);
        _monthly = MortgageTool.format(monthly);
        _totalInterest = MortgageTool.format(MortgageTool.totalInterest(p, r, n));
        _totalPayment = MortgageTool.format(MortgageTool.totalPayment(p, r, n));
        _firstMonth = '—';
      } else {
        final first = MortgageTool.equalPrincipalFirst(p, r, n);
        _monthly = MortgageTool.format(first) + ' (逐月递减)';
        final totalInterest = (n * (p / n + p * r) - p * r * (n - 1) * n / 2 / n) - p;
        _totalInterest = MortgageTool.format(totalInterest);
        _totalPayment = MortgageTool.format(p + totalInterest);
        _firstMonth = MortgageTool.format(first);
      }
    });
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
                  TextField(
                    controller: _amountCtrl,
                    decoration: const InputDecoration(labelText: '贷款总额 (元)', border: OutlineInputBorder(), prefixText: '¥ '),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _rateCtrl,
                          decoration: const InputDecoration(labelText: '年利率 (%)', border: OutlineInputBorder(), suffixText: '%'),
                          keyboardType: TextInputType.number,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: _yearsCtrl,
                          decoration: const InputDecoration(labelText: '贷款年限', border: OutlineInputBorder(), suffixText: '年'),
                          keyboardType: TextInputType.number,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // 还款方式选择
                  SegmentedButton<int>(
                    segments: const [
                      ButtonSegment(value: 0, label: Text('等额本息')),
                      ButtonSegment(value: 1, label: Text('等额本金')),
                    ],
                    selected: {_type},
                    onSelectionChanged: (v) => setState(() => _type = v.first),
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: _calculate,
                    icon: const Icon(Icons.calculate),
                    label: const Text('计算'),
                    style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // 结果区
          if (_monthly != '—')
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    _resultRow('月供', _monthly, AppColors.brand500, 20),
                    const Divider(height: 24),
                    if (_firstMonth != '—') _resultRow('首月还款', _firstMonth, AppColors.neutral700, 16),
                    if (_firstMonth != '—') const SizedBox(height: 12),
                    _resultRow('总利息', _totalInterest, AppColors.warning, 16),
                    const SizedBox(height: 8),
                    _resultRow('还款总额', _totalPayment, AppColors.neutral700, 16),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _resultRow(String label, String value, Color color, double valueSize) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, color: AppColors.neutral500)),
        Text(value, style: TextStyle(fontSize: valueSize, fontWeight: FontWeight.w600, color: color, fontFamily: 'monospace')),
      ],
    );
  }
}
