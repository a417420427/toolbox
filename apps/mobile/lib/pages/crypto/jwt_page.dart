import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import 'dart:convert';

class JwtToolPage extends StatefulWidget {
  const JwtToolPage({super.key});

  @override
  State<JwtToolPage> createState() => _JwtToolPageState();
}

class _JwtToolPageState extends State<JwtToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  JwtResult? _result;
  String? _error;

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _process() {
    final r = JwtTool.decode(_inputCtrl.text);
    setState(() {
      _result = r.result;
      _error = r.error;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ToolCard(
            title: 'JWT Token',
            child: Column(
              children: [
                TextField(
                  controller: _inputCtrl,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    hintText: '粘贴 JWT token 进行解码...',
                  ),
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _process,
                    child: const Text('解码'),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (_error != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: AppColors.error, size: 20),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13))),
                ],
              ),
            ),
          if (_result != null) ...[
            // 过期状态
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _result!.isExpired
                    ? AppColors.error.withValues(alpha: 0.1)
                    : AppColors.success.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: _result!.isExpired
                      ? AppColors.error.withValues(alpha: 0.3)
                      : AppColors.success.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    _result!.isExpired ? Icons.warning_rounded : Icons.check_circle,
                    color: _result!.isExpired ? AppColors.error : AppColors.success,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _result!.isExpired
                        ? '此 Token 已过期'
                        : _result!.remainingSeconds != null
                            ? '有效 — 剩余 ${_formatDuration(_result!.remainingSeconds!)}'
                            : '有效',
                    style: TextStyle(
                      color: _result!.isExpired ? AppColors.error : AppColors.success,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            // Header
            _buildSection('Header', _result!.header),
            const SizedBox(height: 8),
            // Payload
            _buildSection('Payload', _result!.payload),
            const SizedBox(height: 8),
            // Signature
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text('Signature', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.neutral400)),
                      const Spacer(),
                      CopyButton(text: _result!.signature),
                    ],
                  ),
                  const SizedBox(height: 4),
                  SelectableText(
                    _result!.signature,
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: AppColors.neutral400),
                    maxLines: 2,
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSection(String title, Map<String, dynamic> data) {
    final json = _formatJson(data);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Theme.of(context).dividerTheme.color ?? AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.neutral400)),
              const Spacer(),
              CopyButton(text: json),
            ],
          ),
          const SizedBox(height: 4),
          SelectableText(
            json,
            style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
          ),
        ],
      ),
    );
  }

  String _formatJson(Map<String, dynamic> data) {
    final encoder = JsonEncoder.withIndent('  ');
    return encoder.convert(data);
  }

  String _formatDuration(int seconds) {
    if (seconds < 60) return '$seconds 秒';
    if (seconds < 3600) return '${seconds ~/ 60} 分 ${seconds % 60} 秒';
    if (seconds < 86400) return '${seconds ~/ 3600} 时 ${(seconds % 3600) ~/ 60} 分';
    return '${seconds ~/ 86400} 天 ${(seconds % 86400) ~/ 3600} 时';
  }
}
