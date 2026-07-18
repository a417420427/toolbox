/**
 * 颜色格式互转工具
 * 移植自 flutter_shared/tools/color_tool.dart
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } | null {
  hex = hex.trim().replace('#', '');
  if (!hex) return null;

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const value = parseInt(hex, 16);
  if (isNaN(value)) return null;

  if (hex.length === 6) {
    return { r: (value >> 16) & 0xFF, g: (value >> 8) & 0xFF, b: value & 0xFF, a: 1 };
  }
  if (hex.length === 8) {
    return {
      r: (value >> 16) & 0xFF,
      g: (value >> 8) & 0xFF,
      b: value & 0xFF,
      a: ((value >> 24) & 0xFF) / 255,
    };
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
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
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

const namedColors: Record<number, string> = {
  0x000000: '黑色 Black',
  0xFFFFFF: '白色 White',
  0xFF0000: '红色 Red',
  0x00FF00: '绿色 Green',
  0x0000FF: '蓝色 Blue',
  0xFFFF00: '黄色 Yellow',
  0xFF00FF: '品红 Magenta',
  0x00FFFF: '青色 Cyan',
  0xFFA500: '橙色 Orange',
  0x800080: '紫色 Purple',
  0xA52A2A: '棕色 Brown',
  0x808080: '灰色 Gray',
  0xC0C0C0: '银色 Silver',
  0x00FF7F: '春绿 SpringGreen',
  0xFFC0CB: '粉红 Pink',
  0x8B4513: '马鞍棕 SaddleBrown',
  0x2E8B57: '海绿 SeaGreen',
  0x6A5ACD: '板岩蓝 SlateBlue',
  0x708090: '石板灰 SlateGray',
  0xDAA520: '金菊色 Goldenrod',
  0xB22222: '耐火砖 FireBrick',
};

export const ColorTool = {
  /** HEX → RGB */
  fromHex(hex: string): RgbColor | null {
    return hexToRgb(hex);
  },

  /** RGB → HEX */
  toHex(r: number, g: number, b: number, withAlpha = false): string {
    const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0').toUpperCase();
    if (withAlpha) {
      return `#FF${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  toRgb(color: RgbColor): RgbColor {
    return color;
  },

  toHsl(r: number, g: number, b: number): HslColor {
    const hsl = rgbToHsl(r, g, b);
    return { h: hsl.h, s: hsl.s, l: hsl.l, a: 1 };
  },

  /** 猜测的颜色名称 */
  name(r: number, g: number, b: number): string {
    let bestMatch = 0xFFFFFF;
    let bestDiff = Number.MAX_SAFE_INTEGER;
    for (const [key, _name] of Object.entries(namedColors)) {
      const c = parseInt(key);
      const r1 = (c >> 16) & 0xFF;
      const g1 = (c >> 8) & 0xFF;
      const b1 = c & 0xFF;
      const diff = Math.abs(r - r1) + Math.abs(g - g1) + Math.abs(b - b1);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = c;
      }
    }
    return namedColors[bestMatch] || '';
  },

  /** 解析任意颜色值 */
  parse(input: string): RgbColor | null {
    input = input.trim();
    if (!input) return null;

    // HEX
    if (input.startsWith('#') || /^[0-9a-fA-F]{6,8}$/.test(input)) {
      return hexToRgb(input);
    }

    // rgb/rgba
    const rgbMatch = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
      };
    }

    // hsl/hsla
    const hslMatch = input.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+)\s*)?\)/i);
    if (hslMatch) {
      const h = parseFloat(hslMatch[1]);
      const s = parseFloat(hslMatch[2]) / 100;
      const l = parseFloat(hslMatch[3]) / 100;
      const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
      const rgb = hslToRgb(h, s, l);
      return { ...rgb, a };
    }

    return null;
  },
};
