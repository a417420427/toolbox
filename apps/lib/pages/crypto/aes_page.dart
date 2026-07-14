import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// AES 加解密工具
class AesPage extends StatefulWidget {
  const AesPage({super.key});

  @override
  State<AesPage> createState() => _AesPageState();
}

class _AesPageState extends State<AesPage> {
  final _plainCtrl = TextEditingController(text: 'Hello, Toolbox! 这是一段测试文本。');
  final _passwordCtrl = TextEditingController(text: 'MyPassword123!');
  final _encryptedCtrl = TextEditingController();

  bool _encryptMode = true;
  AesMode _mode = AesMode.cbc;
  AesKeySize _keySize = AesKeySize.bits256;

  String _result = '';
  String? _error;

  void _process() {
    if (_encryptMode) {
      final r = AesTool.encrypt(
        plaintext: _plainCtrl.text,
        password: _passwordCtrl.text,
        mode: _mode,
        keySize: _keySize,
      );
      setState(() {
        _result = r.encrypted;
        _error = r.error;
        _encryptedCtrl.text = r.encrypted;
      });
    } else {
      final r = AesTool.decrypt(
        encrypted: _encryptedCtrl.text,
        password: _passwordCtrl.text,
        mode: _mode,
        keySize: _keySize,
      );
      setState(() {
        _result = r.plaintext;
        _error = r.error;
      });
    }
  }

  void _swap() {
    if (_encryptMode) {
      _encryptedCtrl.text = _result;
    } else {
      _plainCtrl.text = _result;
    }
    setState(() {
      _encryptMode = !_encryptMode;
      _result = '';
      _error = null;
    });
  }

  @override
  void dispose() {
    _plainCtrl.dispose();
    _passwordCtrl.dispose();
    _encryptedCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final modeLabel = _encryptMode ? '加密' : '解密';
    final modeColor = _encryptMode ? AppColors.brand500 : AppColors.warning;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: SegmentedButton<bool>(
                  segments: const [
                    ButtonSegment(value: true, label: Text('加密'), icon: Icon(Icons.lock, size: 16)),
                    ButtonSegment(value: false, label: Text('解密'), icon: Icon(Icons.lock_open, size: 16)),
                  ],
                  selected: {_encryptMode},
                  onSelectionChanged: (v) => setState(() => _encryptMode = v.first),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(child: _buildModeDropdown()),
              const SizedBox(width: 12),
              Expanded(child: _buildKeySizeDropdown()),
            ],
          ),
          const SizedBox(height: 12),

          TextField(
            controller: _passwordCtrl,
            decoration: const InputDecoration(
              labelText: '密码',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.key, size: 20),
            ),
            obscureText: true,
          ),
          const SizedBox(height: 12),

          TextField(
            controller: _encryptMode ? _plainCtrl : _encryptedCtrl,
            maxLines: 4,
            decoration: InputDecoration(
              labelText: _encryptMode ? '明文' : '密文 (Base64)',
              border: const OutlineInputBorder(),
              prefixIcon: Padding(
                padding: EdgeInsets.only(bottom: _encryptMode ? 60 : 0),
                child: Icon(_encryptMode ? Icons.text_fields : Icons.lock, size: 20),
              ),
            ),
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
          ),
          const SizedBox(height: 12),

          SizedBox(
            height: 48,
            child: FilledButton.icon(
              onPressed: _process,
              icon: Icon(_encryptMode ? Icons.lock : Icons.lock_open),
              label: Text('$modeLabel (${_keySize.name.replaceAll('bits', '')}-${_mode.name.toUpperCase()})'),
              style: FilledButton.styleFrom(backgroundColor: modeColor),
            ),
          ),

          if (_result.isNotEmpty)
            Center(
              child: TextButton.icon(
                onPressed: _swap,
                icon: const Icon(Icons.swap_horiz, size: 18),
                label: Text('切换到${_encryptMode ? '解密' : '加密'}'),
              ),
            ),

          if (_error != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(top: 12),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.error_outline, size: 18, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_error!, style: TextStyle(color: AppColors.error))),
                ],
              ),
            ),

          if (_result.isNotEmpty && _error == null) ...[
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(_encryptMode ? Icons.lock : Icons.text_fields, size: 18, color: modeColor),
                        const SizedBox(width: 6),
                        Text('${modeLabel}结果', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.copy, size: 18),
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: _result));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('已复制'), duration: Duration(seconds: 1)),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SelectableText(
                      _result,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildModeDropdown() {
    return DropdownButtonFormField<AesMode>(
      initialValue: _mode,
      decoration: const InputDecoration(
        labelText: '加密模式',
        border: OutlineInputBorder(),
        isDense: true,
      ),
      items: AesMode.values.map((m) {
        final label = switch (m) {
          AesMode.cbc => 'CBC（推荐）',
          AesMode.ecb => 'ECB',
          AesMode.ctr => 'CTR',
          AesMode.gcm => 'GCM',
        };
        return DropdownMenuItem(value: m, child: Text(label));
      }).toList(),
      onChanged: (v) {
        if (v != null) setState(() => _mode = v);
      },
    );
  }

  Widget _buildKeySizeDropdown() {
    return DropdownButtonFormField<AesKeySize>(
      initialValue: _keySize,
      decoration: const InputDecoration(
        labelText: '密钥长度',
        border: OutlineInputBorder(),
        isDense: true,
      ),
      items: AesKeySize.values.map((k) {
        final label = switch (k) {
          AesKeySize.bits128 => '128 位',
          AesKeySize.bits192 => '192 位',
          AesKeySize.bits256 => '256 位（推荐）',
        };
        return DropdownMenuItem(value: k, child: Text(label));
      }).toList(),
      onChanged: (v) {
        if (v != null) setState(() => _keySize = v);
      },
    );
  }
}
