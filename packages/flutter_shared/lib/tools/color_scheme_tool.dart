/// 配色方案 / 色彩搭配推荐
class ColorSchemeTool {
  ColorSchemeTool._();

  /// 调色板类型
  static const List<({String name, List<int> colors})> palettes = [
    // Material Design 色板
    (name: '品牌蓝', colors: [0x1565C0, 0x1976D2, 0x2196F3, 0x64B5F6, 0xBBDEFB]),
    (name: '清新绿', colors: [0x2E7D32, 0x388E3C, 0x4CAF50, 0x81C784, 0xC8E6C9]),
    (name: '热情红', colors: [0xC62828, 0xD32F2F, 0xF44336, 0xE57373, 0xFFCDD2]),
    (name: '温暖橙', colors: [0xE65100, 0xF57C00, 0xFF9800, 0xFFB74D, 0xFFE0B2]),
    (name: '优雅紫', colors: [0x6A1B9A, 0x7B1FA2, 0x9C27B0, 0xCE93D8, 0xE1BEE7]),
    (name: '深邃靛', colors: [0x1A237E, 0x283593, 0x3F51B5, 0x7986CB, 0xC5CAE9]),
    (name: '高级灰', colors: [0x212121, 0x424242, 0x616161, 0x9E9E9E, 0xE0E0E0]),
    (name: '森系', colors: [0x33691E, 0x558B2F, 0x689F38, 0xAED581, 0xDCEDC8]),
    (name: '复古棕', colors: [0x4E342E, 0x6D4C41, 0x8D6E63, 0xA1887F, 0xD7CCC8]),
    (name: '糖果色', colors: [0xE91E63, 0xFF5722, 0xFFEB3B, 0x00BCD4, 0x8BC34A]),
    (name: '日系', colors: [0xF5F5F5, 0xE0E0E0, 0xBDBDBD, 0x757575, 0x424242]),
    (name: '莫兰迪', colors: [0x9E9E9E, 0xB39DDB, 0x80CBC4, 0xA5D6A7, 0xFFCC80]),
    (name: '赛博朋克', colors: [0x00E5FF, 0xE040FB, 0xFF1744, 0x00E676, 0x2979FF]),
    (name: '中国风', colors: [0xB71C1C, 0xD4A017, 0xE8D5B7, 0x2E4057, 0x8D6E63]),
    (name: '马卡龙', colors: [0xFFB3BA, 0xFFDFBA, 0xFFFFBA, 0xBAFFC9, 0xBAE1FF]),
  ];

  /// 互补色
  static int complementary(int color) {
    final r = 255 - ((color >> 16) & 0xFF);
    final g = 255 - ((color >> 8) & 0xFF);
    final b = 255 - (color & 0xFF);
    return (0xFF << 24) | (r << 16) | (g << 8) | b;
  }

  /// 类似色（返回两个相邻色）
  static List<int> analogous(int color) {
    final h = _rgbToHsl(color);
    return [
      _hslToRgb((h.$1 + 30) % 360, 0.6, 0.5),
      color,
      _hslToRgb((h.$1 + 330) % 360, 0.6, 0.5),
    ];
  }

  /// 三分色
  static List<int> triadic(int color) {
    final h = _rgbToHsl(color);
    return [
      color,
      _hslToRgb((h.$1 + 120) % 360, h.$2, h.$3),
      _hslToRgb((h.$1 + 240) % 360, h.$2, h.$3),
    ];
  }

  static (double, double, double) _rgbToHsl(int color) {
    final r = ((color >> 16) & 0xFF) / 255;
    final g = ((color >> 8) & 0xFF) / 255;
    final b = (color & 0xFF) / 255;
    final max = [r, g, b].reduce((a, b) => a > b ? a : b);
    final min = [r, g, b].reduce((a, b) => a < b ? a : b);
    final l = (max + min) / 2;
    if (max == min) return (0, 0, l);
    final d = max - min;
    final s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    double h;
    if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max == g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return (h * 60, s, l);
  }

  static int _hslToRgb(double h, double s, double l) {
    final c = (1 - (2 * l - 1).abs()) * s;
    final x = c * (1 - ((h / 60) % 2 - 1).abs());
    final m = l - c / 2;
    double r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return (0xFF << 24) |
      (((r + m) * 255).round() << 16) |
      (((g + m) * 255).round() << 8) |
      ((b + m) * 255).round();
  }

  static String hex(int color) {
    return '#${(color & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}';
  }
}
