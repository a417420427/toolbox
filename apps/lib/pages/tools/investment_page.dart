import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 投资回报计算
class InvestmentPage extends StatefulWidget {
  const InvestmentPage({super.key});

  @override
  State<InvestmentPage> createState() => _InvestmentPageState();
}

class _InvestmentPageState extends State<InvestmentPage> {
  final TextEditingController _principalCtrl = TextEditingController(text: '100000');
  final TextEditingController _monthlyCtrl = TextEditingController(text: '5000');
  final TextEditingController _rateCtrl = TextEditingController(text: '8');
  final TextEditingController _yearsCtrl = TextEditingController(text: '10');

  String _futureValue = '—';
  String _totalInvest = '—';
  String _totalReturn = '—';

  void _calculate() {
    final pv = double.tryParse(_principalCtrl.text) ?? 0;
    final monthly = double.tryParse(_monthlyCtrl.text) ?? 0;
    final rate = double.tryParse(_rateCtrl.text) ?? 0;
    final years = int.tryParse(_yearsCtrl.text) ?? 0;

    if (years <= 0) {
      setState(() {
        _futureValue = '—';
        _totalInvest = '—';
        _totalReturn = '—';
      });
      return;
    }

    final fv = InvestmentTool.futureValueWithMonthly(pv, monthly, rate, years);
    final totalInvested = pv + monthly * 12 * years;
    setState(() {
      _futureValue = InvestmentTool.format(fv);
      _totalInvest = InvestmentTool.format(totalInvested);
      _totalReturn = InvestmentTool.format(fv - totalInvested);
    });
  }

  @override
  void dispose() {
    _principalCtrl.dispose();
    _monthlyCtrl.dispose();
    _rateCtrl.dispose();
    _yearsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(controller: _principalCtrl, decoration: const InputDecoration(labelText: '初始本金 (元)', border: OutlineInputBorder(), prefixText: '¥ '), keyboardType: TextInputType.number),
                  const SizedBox(height: 12),
                  TextField(controller: _monthlyCtrl, decoration: const InputDecoration(labelText: '每月定投 (元)', border: OutlineInputBorder(), prefixText: '¥ '), keyboardType: TextInputType.number),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(controller: _rateCtrl, decoration: const InputDecoration(labelText: '年化收益率 (%)', border: OutlineInputBorder(), suffixText: '%'), keyboardType: TextInputType.number),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(controller: _yearsCtrl, decoration: const InputDecoration(labelText: '投资年限', border: OutlineInputBorder(), suffixText: '年'), keyboardType: TextInputType.number),
                      ),
                    ],
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
          if (_futureValue != '—')
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text('最终资产', style: TextStyle(fontSize: 12, color: AppColors.neutral400)),
                    const SizedBox(height: 4),
                    Text(_futureValue, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, fontFamily: 'monospace')),
                    const Divider(height: 24),
                    _row('总投入', _totalInvest),
                    const SizedBox(height: 8),
                    _row('总收益', _totalReturn, isPositive: true),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _row(String label, String value, {bool isPositive = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, color: AppColors.neutral500)),
        Text(value, style: TextStyle(
          fontSize: 16, fontWeight: FontWeight.w600,
          color: isPositive ? const Color(0xFF43A047) : null,
          fontFamily: 'monospace',
        )),
      ],
    );
  }
}
