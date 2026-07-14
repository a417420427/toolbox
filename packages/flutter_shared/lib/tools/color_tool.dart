import 'package:flutter/material.dart';


/// 颜色格式互转工具
class ColorTool {
  ColorTool._();

  /// HEX → Color
  static Color? fromHex(String hex) {
    hex = hex.trim().replaceFirst('#', '');
    if (hex.isEmpty) return null;

    // 简写 #fff → #ffffff
    if (hex.length == 3) {
      hex = hex.split('').map((c) => '$c$c').join();
    }
    if (hex.length == 4) {
      // #rgba
      hex = hex.split('').map((c) => '$c$c').join();
    }

    try {
      final value = int.parse(hex, radix: 16);
      if (hex.length == 6) {
        return Color(value | 0xFF000000);
      } else if (hex.length == 8) {
        return Color(value);
      }
    } catch (_) {}
    return null;
  }

  /// Color → HEX
  static String toHex(Color color, {bool withAlpha = false}) {
    final r = (color.r * 255).round().clamp(0, 255).toRadixString(16).padLeft(2, '0');
    final g = (color.g * 255).round().clamp(0, 255).toRadixString(16).padLeft(2, '0');
    final b = (color.b * 255).round().clamp(0, 255).toRadixString(16).padLeft(2, '0');
    if (withAlpha) {
      final a = (color.a * 255).round().clamp(0, 255).toRadixString(16).padLeft(2, '0');
      return '#$a$r$g$b'.toUpperCase();
    }
    return '#$r$g$b'.toUpperCase();
  }

  /// Color → RGB
  static ({int r, int g, int b, double a}) toRgb(Color color) {
    return (
      r: (color.r * 255).round().clamp(0, 255),
      g: (color.g * 255).round().clamp(0, 255),
      b: (color.b * 255).round().clamp(0, 255),
      a: color.a.toDouble(),
    );
  }

  /// Color → HSL
  static ({double h, double s, double l, double a}) toHsl(Color color) {
    final hsl = HSLColor.fromColor(color);
    return (
      h: hsl.hue.toDouble(),
      s: hsl.saturation,
      l: hsl.lightness,
      a: hsl.alpha,
    );
  }

  /// Color → HSV
  static ({double h, double s, double v, double a}) toHsv(Color color) {
    final hsv = HSVColor.fromColor(color);
    return (
      h: hsv.hue.toDouble(),
      s: hsv.saturation,
      v: hsv.value,
      a: hsv.alpha,
    );
  }

  /// Color → 猜测的颜色名称（常见色）
  static String name(Color color) {
    const named = <int, String>{
      0xFF000000: '黑色 Black',
      0xFFFFFFFF: '白色 White',
      0xFFFF0000: '红色 Red',
      0xFF00FF00: '绿色 Green',
      0xFF0000FF: '蓝色 Blue',
      0xFFFFFF00: '黄色 Yellow',
      0xFFFF00FF: '品红 Magenta',
      0xFF00FFFF: '青色 Cyan',
      0xFFFFA500: '橙色 Orange',
      0xFF800080: '紫色 Purple',
      0xFFA52A2A: '棕色 Brown',
      0xFF808080: '灰色 Gray',
      0xFFC0C0C0: '银色 Silver',
      0xFF00FF7F: '春绿 SpringGreen',
      0xFFFFC0CB: '粉红 Pink',
      0xFF8B4513: '马鞍棕 SaddleBrown',
      0xFF2E8B57: '海绿 SeaGreen',
      0xFF6A5ACD: '板岩蓝 SlateBlue',
      0xFF708090: '石板灰 SlateGray',
      0xFFDAA520: '金菊色 Goldenrod',
      0xFFB22222: '耐火砖 FireBrick',
    };

    // 找最近的颜色
    int bestMatch = 0xFFFFFFFF;
    int bestDiff = (1 << 63) - 1;

    for (final entry in named.entries) {
      final r1 = (entry.key >> 16) & 0xFF;
      final g1 = (entry.key >> 8) & 0xFF;
      final b1 = entry.key & 0xFF;
      final rVal = (color.r * 255).round().clamp(0, 255);
      final gVal = (color.g * 255).round().clamp(0, 255);
      final bVal = (color.b * 255).round().clamp(0, 255);
      final diff = (rVal - r1).abs() + (gVal - g1).abs() + (bVal - b1).abs();
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = entry.key;
      }
    }

    return named[bestMatch] ?? '';
  }

  /// 解析任意颜色值
  static Color? parse(String input) {
    input = input.trim();
    if (input.isEmpty) return null;

    // HEX
    if (input.startsWith('#') || RegExp(r'^[0-9a-fA-F]{6,8}$').hasMatch(input)) {
      return fromHex(input);
    }

    // rgb/rgba
    final rgbMatch = RegExp(
      r'rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)',
      caseSensitive: false,
    ).firstMatch(input);
    if (rgbMatch != null) {
      final r = int.parse(rgbMatch.group(1)!);
      final g = int.parse(rgbMatch.group(2)!);
      final b = int.parse(rgbMatch.group(3)!);
      final a = rgbMatch.group(4) != null ? double.parse(rgbMatch.group(4)!) : 1.0;
      return Color.fromRGBO(r, g, b, a);
    }

    // hsl/hsla
    final hslMatch = RegExp(
      r'hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+)\s*)?\)',
      caseSensitive: false,
    ).firstMatch(input);
    if (hslMatch != null) {
      final h = double.parse(hslMatch.group(1)!);
      final s = double.parse(hslMatch.group(2)!) / 100;
      final l = double.parse(hslMatch.group(3)!) / 100;
      final a = hslMatch.group(4) != null ? double.parse(hslMatch.group(4)!) : 1.0;
      return HSLColor.fromAHSL(a, h, s, l).toColor();
    }

    return null;
  }
}
