import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 配色方案推荐
class ColorSchemePage extends StatefulWidget {
  const ColorSchemePage({super.key});

  @override
  State<ColorSchemePage> createState() => _ColorSchemePageState();
}

class _ColorSchemePageState extends State<ColorSchemePage> {
  String _selectedPalette = '品牌蓝';
  int _customColor = 0xFF1976D2;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('预设调色板', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          // 调色板选择
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: ColorSchemeTool.palettes.map((p) {
                final selected = p.name == _selectedPalette;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(p.name, style: const TextStyle(fontSize: 12)),
                    selected: selected,
                    onSelected: (_) => setState(() => _selectedPalette = p.name),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          // 选中的调色板展示
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    children: ColorSchemeTool.palettes
                        .firstWhere((p) => p.name == _selectedPalette)
                        .colors
                        .map((c) => Expanded(
                              child: GestureDetector(
                                onTap: () {
                                  Clipboard.setData(ClipboardData(text: ColorSchemeTool.hex(c)));
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('已复制 ${ColorSchemeTool.hex(c)}'), duration: const Duration(seconds: 1)),
                                  );
                                },
                                child: Container(
                                  height: 60,
                                  decoration: BoxDecoration(
                                    color: Color(c),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Center(
                                    child: Text(
                                      ColorSchemeTool.hex(c),
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: (c & 0xFFFFFF) > 0x888888 ? Colors.black : Colors.white,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 8),
                  Text('点击颜色复制 HEX 值', style: TextStyle(fontSize: 12, color: AppColors.neutral400)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          // 自定义颜色搭配
          const Text('自定义配色', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // 颜色选择器简化版
                  Row(
                    children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(
                          color: Color(_customColor),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.neutral300),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          decoration: const InputDecoration(
                            labelText: 'HEX 颜色',
                            border: OutlineInputBorder(),
                            prefixText: '#',
                          ),
                          controller: TextEditingController(text: ColorSchemeTool.hex(_customColor).substring(1)),
                          onSubmitted: (v) {
                            final hex = int.tryParse('FF${v.replaceAll('#', '')}', radix: 16);
                            if (hex != null) setState(() => _customColor = hex);
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // 互补色
                  _schemeRow('互补色', [ColorSchemeTool.complementary(_customColor)]),
                  const SizedBox(height: 8),
                  _schemeRow('类似色', ColorSchemeTool.analogous(_customColor)),
                  const SizedBox(height: 8),
                  _schemeRow('三分色', ColorSchemeTool.triadic(_customColor)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _schemeRow(String label, List<int> colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.neutral500)),
        const SizedBox(height: 4),
        Row(
          children: colors.map((c) => Expanded(
            child: GestureDetector(
              onTap: () {
                Clipboard.setData(ClipboardData(text: ColorSchemeTool.hex(c)));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('已复制 ${ColorSchemeTool.hex(c)}'), duration: const Duration(seconds: 1)),
                );
              },
              child: Container(
                height: 44,
                margin: const EdgeInsets.only(right: 4),
                decoration: BoxDecoration(
                  color: Color(c),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Center(
                  child: Text(ColorSchemeTool.hex(c),
                    style: TextStyle(fontSize: 10, color: (c & 0xFFFFFF) > 0x888888 ? Colors.black : Colors.white),
                  ),
                ),
              ),
            ),
          )).toList(),
        ),
      ],
    );
  }
}
