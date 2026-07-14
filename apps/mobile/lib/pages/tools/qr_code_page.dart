import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:ui' as ui;
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import 'package:qr/qr.dart' as qr;

/// 二维码生成
class QrCodePage extends StatefulWidget {
  const QrCodePage({super.key});

  @override
  State<QrCodePage> createState() => _QrCodePageState();
}

class _QrCodePageState extends State<QrCodePage> {
  final TextEditingController _textCtrl = TextEditingController(text: 'https://github.com');
  qr.QrImage? _qrImage;
  int _moduleCount = 0;

  @override
  void initState() {
    super.initState();
    _generate();
    _textCtrl.addListener(_generate);
  }

  @override
  void dispose() {
    _textCtrl.removeListener(_generate);
    _textCtrl.dispose();
    super.dispose();
  }

  void _generate() {
    final text = _textCtrl.text.trim();
    if (text.isEmpty) {
      setState(() { _qrImage = null; _moduleCount = 0; });
      return;
    }
    try {
      final qrCode = qr.QrCode(
        payload: qr.QrPayload.fromString(text),
        errorCorrectLevel: qr.QrErrorCorrectLevel.high,
      );
      final image = qr.QrImage(qrCode);
      setState(() { _qrImage = image; _moduleCount = qrCode.moduleCount; });
    } catch (_) {
      setState(() { _qrImage = null; _moduleCount = 0; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          TextField(
            controller: _textCtrl,
            decoration: InputDecoration(
              labelText: '输入文本或链接',
              border: const OutlineInputBorder(),
              suffixIcon: IconButton(
                icon: const Icon(Icons.clear, size: 18),
                onPressed: () { _textCtrl.clear(); },
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (_qrImage != null)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Container(
                      width: 200, height: 200,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.neutral200),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CustomPaint(
                          size: const Size(200, 200),
                          painter: _QrPainter(_qrImage!, _moduleCount),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text('${_moduleCount}x$_moduleCount 模块 · 纠错级别高',
                      style: const TextStyle(fontSize: 12, color: AppColors.neutral400)),
                  ],
                ),
              ),
            )
          else if (_textCtrl.text.trim().isNotEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Icon(Icons.error_outline, size: 48, color: AppColors.error),
                    const SizedBox(height: 8),
                    const Text('输入内容过长或无法编码'),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 16),
          if (_textCtrl.text.trim().isNotEmpty)
            OutlinedButton.icon(
              onPressed: () {
                Clipboard.setData(ClipboardData(text: _textCtrl.text.trim()));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('已复制'), duration: Duration(seconds: 1)),
                );
              },
              icon: const Icon(Icons.copy, size: 16),
              label: const Text('复制内容'),
            ),
        ],
      ),
    );
  }
}

class _QrPainter extends CustomPainter {
  final qr.QrImage qrImage;
  final int moduleCount;

  _QrPainter(this.qrImage, this.moduleCount);

  @override
  void paint(Canvas canvas, Size size) {
    if (moduleCount == 0) return;
    final cellSize = size.width / moduleCount;
    final paint = Paint()..color = const Color(0xFF000000);

    for (int y = 0; y < moduleCount; y++) {
      for (int x = 0; x < moduleCount; x++) {
        if (qrImage.isDark(y, x)) {
          canvas.drawRect(
            Rect.fromLTWH(x * cellSize, y * cellSize, cellSize, cellSize),
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant _QrPainter oldDelegate) =>
      oldDelegate.qrImage != qrImage;
}
