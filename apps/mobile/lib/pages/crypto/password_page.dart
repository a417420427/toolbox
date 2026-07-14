import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 密码生成器
class PasswordPage extends StatefulWidget {
  const PasswordPage({super.key});

  @override
  State<PasswordPage> createState() => _PasswordPageState();
}

class _PasswordPageState extends State<PasswordPage> {
  int _length = 16;
  bool _useLower = true;
  bool _useUpper = true;
  bool _useDigits = true;
  bool _useSymbols = true;
  bool _excludeAmbiguous = false;
  String _password = '';

  void _generate() {
    setState(() {
      _password = PasswordGenerator.generate(
        length: _length,
        useLower: _useLower,
        useUpper: _useUpper,
        useDigits: _useDigits,
        useSymbols: _useSymbols,
        excludeAmbiguous: _excludeAmbiguous,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final score = PasswordGenerator.strength(_password);
    final label = PasswordGenerator.strengthLabel(score);
    final strengthColor = score <= 1 ? AppColors.error : (score <= 3 ? AppColors.warning : const Color(0xFF43A047));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 密码显示
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  SelectableText(
                    _password.isEmpty ? '点击生成密码' : _password,
                    style: TextStyle(fontSize: 20, fontFamily: 'monospace', fontWeight: FontWeight.w600, color: _password.isNotEmpty ? null : AppColors.neutral400),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  if (_password.isNotEmpty)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(icon: const Icon(Icons.copy, size: 18), onPressed: () {
                          Clipboard.setData(ClipboardData(text: _password));
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('已复制'), duration: Duration(seconds: 1)));
                        }, tooltip: '复制'),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: strengthColor.withAlpha(30), borderRadius: BorderRadius.circular(10)),
                          child: Text('$label  (${_password.length}位)', style: TextStyle(fontSize: 12, color: strengthColor)),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // 长度
                  Row(
                    children: [
                      const Text('长度: ', style: TextStyle(fontSize: 14)),
                      Expanded(
                        child: Slider(value: _length.toDouble(), min: 4, max: 64, divisions: 60, label: '$_length', onChanged: (v) => setState(() => _length = v.round())),
                      ),
                      Text('$_length', style: const TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const Divider(),
                  // 字符选项
                  _toggle('小写字母 (a-z)', _useLower, (v) => setState(() => _useLower = v)),
                  _toggle('大写字母 (A-Z)', _useUpper, (v) => setState(() => _useUpper = v)),
                  _toggle('数字 (0-9)', _useDigits, (v) => setState(() => _useDigits = v)),
                  _toggle('特殊符号', _useSymbols, (v) => setState(() => _useSymbols = v)),
                  _toggle('排除易混淆字符', _excludeAmbiguous, (v) => setState(() => _excludeAmbiguous = v)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 48,
            child: FilledButton.icon(
              onPressed: _generate,
              icon: const Icon(Icons.refresh),
              label: const Text('生成密码', style: TextStyle(fontSize: 16)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _toggle(String label, bool value, ValueChanged<bool> onChanged) {
    return SwitchListTile(
      title: Text(label, style: const TextStyle(fontSize: 14)),
      value: value,
      onChanged: onChanged,
      dense: true,
      contentPadding: EdgeInsets.zero,
    );
  }
}
