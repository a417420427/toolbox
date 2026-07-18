/**
 * 纪念日/倒数日工具
 * 移植自 flutter_shared/tools/anniversary_tool.dart
 */

export interface AnniversaryResult {
  days: number;
  description: string;
}

export const AnniversaryTool = {
  calculate(target: Date): AnniversaryResult {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff < 0) {
      const abs = Math.abs(diff);
      const d = Math.floor(abs / (1000 * 60 * 60 * 24));
      if (d === 0) return { days: 0, description: '就是今天！🎉' };
      if (d < 365) return { days: -d, description: `已经过去了 ${d} 天` };
      const years = Math.floor(d / 365);
      const remain = d % 365;
      if (remain === 0) return { days: -d, description: `${years} 周年纪念 🎂` };
      return { days: -d, description: `${years} 年零 ${remain} 天` };
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (d === 0) return { days: 0, description: '就是今天！🎉' };
    if (d < 365) return { days: d, description: `还有 ${d} 天` };
    const years = Math.floor(d / 365);
    return { days: d, description: `还有 ${d} 天（约 ${years} 年）` };
  },

  formatDate(d: Date): string {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  },
};
