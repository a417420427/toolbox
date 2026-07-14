import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class ColorToolPage extends StatefulWidget {
  const ColorToolPage({super.key});

  @override
  State<ColorToolPage> createState() => _ColorToolPageState();
}

class _ColorToolPageState extends State<ColorToolPage> {
  final TextEditingController _inputCtrl = TextEditingController();
  Color? _color;
  String? _error;
  String _hex = '';
  String _rgb = '';
  String _hsl = '';
  String _hsv = '';
  String _name = '';

  @override
  void dispose() {
    _inputCtrl.dispose();
    super.dispose();
  }

  void _process() {
    final input = _inputCtrl.text;
    final color = ColorTool.parse(input);
    if (color == null) {
      setState(() {
        _color = null;
        _error = '无法解析该颜色值';
        _hex = _rgb = _hsl = _hsv = _name = '';
      });
      return;
    }

    final rgb = ColorTool.toRgb(color);
    final hsl = ColorTool.toHsl(color);
    final hsv = ColorTool.toHsv(color);

    setState(() {
      _color = color;
      _error = null;
      _hex = ColorTool.toHex(color);
      _rgb = 'rgb(${rgb.r}, ${rgb.g}, ${rgb.b})';
      _hsl = 'hsl(${hsl.h.toStringAsFixed(0)}, ${(hsl.s * 100).toStringAsFixed(1)}%, ${(hsl.l * 100).toStringAsFixed(1)}%)';
      _hsv = 'hsv(${hsv.h.toStringAsFixed(0)}, ${(hsv.s * 100).toStringAsFixed(1)}%, ${(hsv.v * 100).toStringAsFixed(1)}%)';
      _name = ColorTool.name(color);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 颜色预览大色块
          if (_color != null)
            Container(
              width: double.infinity,
              height: 80,
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isDark ? AppColors.neutralDark200 : AppColors.neutral200,
                ),
              ),
              child: Center(
                child: Text(
                  _hex,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'monospace',
                    color: _color!.computeLuminance() > 0.5
                        ? Colors.black
                        : Colors.white,
                  ),
                ),
              ),
            ),
          const SizedBox(height: 12),
          ToolCard(
            title: '输入颜色值',
            child: Column(
              children: [
                TextField(
                  controller: _inputCtrl,
                  decoration: const InputDecoration(
                    hintText: 'HEX / RGB / HSL / HSV',
                    prefixIcon: Icon(Icons.colorize, size: 20),
                  ),
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#rgb(255, 100, 50)', '#hsl(200, 80%, 50%)']
                      .map((s) => ActionChip(
                            label: Text(s, style: const TextStyle(fontSize: 11, fontFamily: 'monospace')),
                            onPressed: () {
                              _inputCtrl.text = s;
                              _process();
                            },
                          ))
                      .toList(),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _process,
                    child: const Text('解析'),
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
              child: Text(_error!, style: const TextStyle(color: AppColors.error)),
            ),
          if (_color != null) ...[
            const SizedBox(height: 12),
            ResultPanel(title: 'HEX', content: _hex),
            const SizedBox(height: 8),
            ResultPanel(title: 'RGB', content: _rgb, isMono: false),
            const SizedBox(height: 8),
            ResultPanel(title: 'HSL', content: _hsl, isMono: false),
            const SizedBox(height: 8),
            ResultPanel(title: 'HSV', content: _hsv, isMono: false),
            if (_name.isNotEmpty) ...[
              const SizedBox(height: 8),
              ResultPanel(title: '颜色名称', content: _name, isMono: false),
            ],
          ],
        ],
      ),
    );
  }
}
