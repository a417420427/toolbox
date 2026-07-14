import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key});

  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  String _display = '0';
  double _a = 0;
  String? _op;
  bool _waitingB = false;
  bool _showScientific = false;

  void _input(String val) {
    setState(() {
      if (_waitingB) {
        _display = val;
        _waitingB = false;
      } else {
        _display = _display == '0' && val != '.' ? val : _display + val;
      }
    });
  }

  void _operator(String op) {
    setState(() {
      if (_op != null && !_waitingB) {
        _evaluate();
      }
      _a = double.tryParse(_display) ?? 0;
      _op = op;
      _waitingB = true;
    });
  }

  void _evaluate() {
    if (_op == null) return;
    final b = double.tryParse(_display) ?? 0;
    final r = CalculatorTool.calculate(_a, _op!, b);
    _display = r.error ?? CalculatorTool.formatResult(r.result);
    _op = null;
    _waitingB = false;
  }

  void _clear() {
    setState(() {
      _display = '0';
      _a = 0;
      _op = null;
      _waitingB = false;
    });
  }

  void _scientific(String func) {
    final val = double.tryParse(_display) ?? 0;
    final r = CalculatorTool.scientific(func, val);
    setState(() {
      _display = r.error ?? CalculatorTool.formatResult(r.result);
    });
  }

  void _backspace() {
    setState(() {
      if (_display.length > 1) {
        _display = _display.substring(0, _display.length - 1);
      } else {
        _display = '0';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        // 显示屏
        Container(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
          alignment: Alignment.bottomRight,
          child: Text(
            _display,
            style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w300, fontFamily: 'monospace'),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        // 科学计算切换开关
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              TextButton.icon(
                onPressed: () => setState(() => _showScientific = !_showScientific),
                icon: Icon(_showScientific ? Icons.expand_less : Icons.expand_more, size: 18),
                label: Text(_showScientific ? '收起科学' : '科学计算', style: const TextStyle(fontSize: 13)),
              ),
            ],
          ),
        ),
        // 科学计算行
        if (_showScientific)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _buildRow(['sin', 'cos', 'tan', 'sqrt'], isDark, true),
          ),
        if (_showScientific)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: _buildRow(['log', 'ln', 'x²', 'x³'], isDark, true),
          ),
        if (_showScientific)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: _buildRow(['1/x', 'x!', '|x|', '^'], isDark, true),
          ),
        if (_showScientific) const SizedBox(height: 8),
        const Divider(height: 1),
        // 计算器按钮
        Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              _buildRow(['C', '⌫', '%', '÷'], isDark, false, specialIndices: {0}),
              const SizedBox(height: 8),
              _buildRow(['7', '8', '9', '×'], isDark, false),
              const SizedBox(height: 8),
              _buildRow(['4', '5', '6', '−'], isDark, false),
              const SizedBox(height: 8),
              _buildRow(['1', '2', '3', '+'], isDark, false),
              const SizedBox(height: 8),
              _buildRow(['0', '.', '=', ''], isDark, false, lastRow: true),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRow(List<String> labels, bool isDark, bool scientific, {Set<int>? specialIndices, bool lastRow = false}) {
    return Row(
      children: labels.asMap().entries.map((entry) {
        final i = entry.key;
        final label = entry.value;
        if (label.isEmpty && lastRow) return const Expanded(child: SizedBox());

        final isSpecial = specialIndices?.contains(i) ?? false;
        final isOp = ['+', '−', '×', '÷', '%', '='].contains(label) && !scientific && !isSpecial;
        final isEq = label == '=';

        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: SizedBox(
              height: scientific ? 40 : 56,
              child: Material(
                color: label == '=' ? AppColors.brand500 : (isOp ? AppColors.brand50 : (isSpecial && !scientific ? Colors.transparent : (isDark ? AppColors.neutralDark100 : Colors.white))),
                borderRadius: BorderRadius.circular(12),
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    if (scientific) {
                      _scientific(label);
                    } else if (['÷', '×', '−', '+', '%'].contains(label)) {
                      _operator(label);
                      // Fix: map display operators
                    } else if (label == '=') {
                      _evaluate();
                    } else if (label == 'C') {
                      _clear();
                    } else if (label == '⌫') {
                      _backspace();
                    } else {
                      // 映射显示运算符到实际
                      final opMap = {'−': '-', '×': '×'};
                      if (['+', '-', '×', '÷', '%'].contains(label)) {
                        _operator(opMap[label] ?? label);
                      } else {
                        _input(label);
                      }
                    }
                  },
                  child: Center(
                    child: Text(
                      label,
                      style: TextStyle(
                        fontSize: scientific ? 14 : (isEq ? 22 : 20),
                        fontWeight: isOp || isEq || isSpecial ? FontWeight.w600 : FontWeight.w400,
                        color: isEq ? Colors.white : (isOp ? AppColors.brand500 : null),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
