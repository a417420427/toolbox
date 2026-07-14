/**
 * 颜色格式转换工具
 *
 * 支持 HEX / RGB / RGBA / HSL / HSLA / HSV 互转。
 * 所有函数均为纯函数。
 */

export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface RgbaColor extends RgbColor {
  a: number; // 0-1
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HslaColor extends HslColor {
  a: number; // 0-1
}

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

/** 颜色格式类型 */
export type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "hsla" | "hsv" | "name";

/** 解析结果 */
export interface ColorParseResult {
  format: ColorFormat;
  rgba: RgbaColor;
  isValid: boolean;
  error?: string;
}

// ---- 解析 ----

/**
 * 解析颜色字符串为 RGBA 对象。
 * 自动检测输入格式（HEX / RGB / RGBA / HSL / HSLA）。
 */
export function parseColor(input: string): ColorParseResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { format: "hex", rgba: { r: 0, g: 0, b: 0, a: 1 }, isValid: false, error: "输入为空" };
  }

  // HEX
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4 || hex.length === 6 || hex.length === 8) {
      const rgba = parseHexToRgba(hex);
      return { format: "hex", rgba, isValid: true };
    }
    return { format: "hex", rgba: { r: 0, g: 0, b: 0, a: 1 }, isValid: false, error: "无效的 HEX 长度" };
  }

  // RGB / RGBA
  const rgbMatch = trimmed.match(
    /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i
  );
  if (rgbMatch) {
    const r = clamp(parseInt(rgbMatch[1]), 0, 255);
    const g = clamp(parseInt(rgbMatch[2]), 0, 255);
    const b = clamp(parseInt(rgbMatch[3]), 0, 255);
    const a = rgbMatch[4] !== undefined ? clamp(parseFloat(rgbMatch[4]), 0, 1) : 1;
    const format = rgbMatch[4] !== undefined ? "rgba" : "rgb";
    return { format, rgba: { r, g, b, a }, isValid: true };
  }

  // HSL / HSLA
  const hslMatch = trimmed.match(
    /^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/i
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]) % 360;
    const s = clamp(parseFloat(hslMatch[2]), 0, 100);
    const l = clamp(parseFloat(hslMatch[3]), 0, 100);
    const a = hslMatch[4] !== undefined ? clamp(parseFloat(hslMatch[4]), 0, 1) : 1;
    const rgba = hslToRgba({ h, s, l, a });
    const format = hslMatch[4] !== undefined ? "hsla" : "hsl";
    return { format, rgba, isValid: true };
  }

  return { format: "hex", rgba: { r: 0, g: 0, b: 0, a: 1 }, isValid: false, error: "无法识别的颜色格式" };
}

// ---- HEX 解析 ----

function parseHexToRgba(hex: string): RgbaColor {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;

  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b, a: 1 };
  }

  if (h.length === 4) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    const a = parseInt(h[3] + h[3], 16) / 255;
    return { r, g, b, a };
  }

  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }

  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

// ---- 转换为各格式 ----

/**
 * RGBA → HEX（#RRGGBB）
 */
export function rgbaToHex(color: RgbaColor): string {
  const r = Math.round(clamp(color.r, 0, 255));
  const g = Math.round(clamp(color.g, 0, 255));
  const b = Math.round(clamp(color.b, 0, 255));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * RGBA → HEX（#RRGGBBAA），带 Alpha
 */
export function rgbaToHexA(color: RgbaColor): string {
  const hex = rgbaToHex(color);
  const a = Math.round(clamp(color.a, 0, 1) * 255);
  return `${hex}${a.toString(16).padStart(2, "0")}`;
}

/**
 * RGBA → RGB 字符串
 */
export function rgbaToRgbString(color: RgbaColor): string {
  const r = Math.round(clamp(color.r, 0, 255));
  const g = Math.round(clamp(color.g, 0, 255));
  const b = Math.round(clamp(color.b, 0, 255));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * RGBA → RGBA 字符串
 */
export function rgbaToRgbaString(color: RgbaColor): string {
  const r = Math.round(clamp(color.r, 0, 255));
  const g = Math.round(clamp(color.g, 0, 255));
  const b = Math.round(clamp(color.b, 0, 255));
  const a = Math.round(clamp(color.a, 0, 1) * 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * RGB → HSL
 */
export function rgbToHsl(color: RgbColor): HslColor {
  let { r, g, b } = color;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * RGBA → HSLA
 */
export function rgbaToHsla(color: RgbaColor): HslaColor {
  const hsl = rgbToHsl(color);
  return { ...hsl, a: color.a };
}

/**
 * HSL → RGBA
 */
export function hslToRgba(hsl: HslaColor): RgbaColor {
  const { h, s, l, a } = hsl;
  const hue = ((h % 360) + 360) % 360 / 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;

  if (sat === 0) {
    const v = Math.round(lig * 255);
    return { r: v, g: v, b: v, a: clamp(a, 0, 1) };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat;
  const p = 2 * lig - q;

  return {
    r: Math.round(hue2rgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hue) * 255),
    b: Math.round(hue2rgb(p, q, hue - 1 / 3) * 255),
    a: clamp(a, 0, 1),
  };
}

/**
 * HSL → HSLA（添加 alpha）
 */
export function hslToHsla(hsl: HslColor, alpha = 1): HslaColor {
  return { ...hsl, a: alpha };
}

/**
 * RGB → HSV
 */
export function rgbToHsv(color: RgbColor): HsvColor {
  let { r, g, b } = color;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * RGBA → 所有格式
 */
export interface ColorConversion {
  hex: string;
  hexA: string;
  rgb: string;
  rgba: string;
  hsl: HslaColor;
  hslString: string;
  hslaString: string;
  hsv: HsvColor;
  hsvString: string;
}

/**
 * 将任意颜色输入转换为所有格式。
 * 如果输入无效，抛出异常。
 */
export function convertColor(input: string): ColorConversion {
  const result = parseColor(input);
  if (!result.isValid) {
    throw new Error(result.error ?? "无效的颜色值");
  }

  const { rgba } = result;
  const hsl = rgbaToHsla(rgba);
  const hsv = rgbToHsv(rgba);

  return {
    hex: rgbaToHex(rgba),
    hexA: rgbaToHexA(rgba),
    rgb: rgbaToRgbString(rgba),
    rgba: rgbaToRgbaString(rgba),
    hsl,
    hslString: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    hslaString: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a})`,
    hsv,
    hsvString: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`,
  };
}

/**
 * 获取颜色的亮度感知值（0-1），用于判断深色/浅色文字。
 * 使用 WCAG 相对亮度公式。
 */
export function getRelativeLuminance(color: RgbaColor): number {
  const srgb = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * srgb(color.r) + 0.7152 * srgb(color.g) + 0.0722 * srgb(color.b);
}

/**
 * 推荐在背景色上使用深色还是浅色文字。
 * @returns "dark" 或 "light"
 */
export function suggestTextColor(background: RgbaColor): "dark" | "light" {
  return getRelativeLuminance(background) > 0.179 ? "dark" : "light";
}

/**
 * 生成一组和谐的配色方案（单色）。
 * @param baseColor 基础颜色字符串
 * @param steps 生成色阶数（默认 5）
 * @returns 从浅到深的颜色 HEX 数组
 */
export function generateMonochromaticPalette(baseColor: string, steps = 5): string[] {
  const { rgba } = parseColor(baseColor);
  const hsl = rgbaToHsla(rgba);
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = 10 + (80 / (steps - 1)) * i;
    const c = hslToRgba({ h: hsl.h, s: hsl.s, l: Math.round(lightness), a: 1 });
    colors.push(rgbaToHex(c));
  }

  return colors;
}

// ---- 内部工具 ----

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
