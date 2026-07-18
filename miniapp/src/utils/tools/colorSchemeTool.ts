/**
 * 配色方案 / 色彩搭配推荐
 * 移植自 flutter_shared/tools/color_scheme_tool.dart
 */

export interface PaletteEntry {
  name: string;
  colors: number[]; // 0xAARRGGBB
}

function rgbToHsl(color: number): [number, number, number] {
  const r = ((color >> 16) & 0xFF) / 255;
  const g = ((color >> 8) & 0xFF) / 255;
  const b = (color & 0xFF) / 255;
  const maxV = Math.max(r, g, b);
  const minV = Math.min(r, g, b);
  const l = (maxV + minV) / 2;
  if (maxV === minV) return [0, 0, l];
  const d = maxV - minV;
  const s = l > 0.5 ? d / (2 - maxV - minV) : d / (maxV + minV);
  let h: number;
  if (maxV === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (maxV === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb(h: number, s: number, l: number): number {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) { r1 = c; g1 = x; }
  else if (h < 120) { r1 = x; g1 = c; }
  else if (h < 180) { g1 = c; b1 = x; }
  else if (h < 240) { g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  return (0xFF << 24) |
    (Math.round((r1 + m) * 255) << 16) |
    (Math.round((g1 + m) * 255) << 8) |
    Math.round((b1 + m) * 255);
}

export function colorHex(color: number): string {
  return '#' + (color & 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

export const ColorSchemeTool = {
  palettes: [
    { name: '品牌蓝', colors: [0x1565C0, 0x1976D2, 0x2196F3, 0x64B5F6, 0xBBDEFB] },
    { name: '清新绿', colors: [0x2E7D32, 0x388E3C, 0x4CAF50, 0x81C784, 0xC8E6C9] },
    { name: '热情红', colors: [0xC62828, 0xD32F2F, 0xF44336, 0xE57373, 0xFFCDD2] },
    { name: '温暖橙', colors: [0xE65100, 0xF57C00, 0xFF9800, 0xFFB74D, 0xFFE0B2] },
    { name: '优雅紫', colors: [0x6A1B9A, 0x7B1FA2, 0x9C27B0, 0xCE93D8, 0xE1BEE7] },
    { name: '深邃靛', colors: [0x1A237E, 0x283593, 0x3F51B5, 0x7986CB, 0xC5CAE9] },
    { name: '高级灰', colors: [0x212121, 0x424242, 0x616161, 0x9E9E9E, 0xE0E0E0] },
    { name: '森系', colors: [0x33691E, 0x558B2F, 0x689F38, 0xAED581, 0xDCEDC8] },
    { name: '复古棕', colors: [0x4E342E, 0x6D4C41, 0x8D6E63, 0xA1887F, 0xD7CCC8] },
    { name: '糖果色', colors: [0xE91E63, 0xFF5722, 0xFFEB3B, 0x00BCD4, 0x8BC34A] },
    { name: '日系', colors: [0xF5F5F5, 0xE0E0E0, 0xBDBDBD, 0x757575, 0x424242] },
    { name: '莫兰迪', colors: [0x9E9E9E, 0xB39DDB, 0x80CBC4, 0xA5D6A7, 0xFFCC80] },
    { name: '赛博朋克', colors: [0x00E5FF, 0xE040FB, 0xFF1744, 0x00E676, 0x2979FF] },
    { name: '中国风', colors: [0xB71C1C, 0xD4A017, 0xE8D5B7, 0x2E4057, 0x8D6E63] },
    { name: '马卡龙', colors: [0xFFB3BA, 0xFFDFBA, 0xFFFFBA, 0xBAFFC9, 0xBAE1FF] },
  ] as PaletteEntry[],

  /** 互补色 */
  complementary(color: number): number {
    const r = 255 - ((color >> 16) & 0xFF);
    const g = 255 - ((color >> 8) & 0xFF);
    const b = 255 - (color & 0xFF);
    return (0xFF << 24) | (r << 16) | (g << 8) | b;
  },

  /** 类似色 */
  analogous(color: number): number[] {
    const [h] = rgbToHsl(color);
    return [
      hslToRgb((h + 30) % 360, 0.6, 0.5),
      color,
      hslToRgb((h + 330) % 360, 0.6, 0.5),
    ];
  },

  /** 三分色 */
  triadic(color: number): number[] {
    const [h, s, l] = rgbToHsl(color);
    return [
      color,
      hslToRgb((h + 120) % 360, s, l),
      hslToRgb((h + 240) % 360, s, l),
    ];
  },
};
