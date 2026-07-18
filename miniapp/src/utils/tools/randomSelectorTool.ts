/**
 * 随机选择器工具
 * 移植自 flutter_shared/tools/random_selector_tool.dart
 */

export const RandomSelectorTool = {
  /** 抛硬币 */
  flipCoin(): string {
    return Math.random() < 0.5 ? '正面' : '反面';
  },

  /** 随机数字 */
  randomInt(min: number, max: number): number {
    if (min > max) [min, max] = [max, min];
    return min + Math.floor(Math.random() * (max - min + 1));
  },

  /** 从列表中随机选 */
  pickFromList(itemsCsv: string): { result: string; error?: string } {
    if (!itemsCsv.trim()) return { result: '', error: '请输入选项，用逗号分隔' };
    const items = itemsCsv
      .split(/[,，\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (items.length === 0) return { result: '', error: '没有有效选项' };
    if (items.length === 1) return { result: items[0] };
    return { result: items[Math.floor(Math.random() * items.length)] };
  },

  /** 抽签 */
  drawLots(itemsCsv: string, count: number): string[] {
    const items = itemsCsv
      .split(/[,，\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (items.length === 0 || count <= 0) return [];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.max(1, Math.min(count, items.length)));
  },

  /** 随机颜色 */
  randomColor(): { r: number; g: number; b: number; hex: string } {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    return { r, g, b, hex };
  },
};
