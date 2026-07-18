/**
 * 倒计时工具
 * 移植自 flutter_shared/tools/countdown_tool.dart
 */

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  description: string;
}

export const CountdownTool = {
  calculate(target: Date): CountdownResult {
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const isPast = diff < 0;
    const abs = Math.abs(diff);

    const totalMs = abs;
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    let description: string;
    const prefix = isPast ? '已过去' : '还剩';

    if (days > 365) {
      const y = Math.floor(days / 365);
      const m = Math.floor((days % 365) / 30);
      description = `${prefix} ${y} 年 ${m} 个月`;
    } else if (days > 30) {
      const m = Math.floor(days / 30);
      const d = days % 30;
      description = `${prefix} ${m} 个月 ${d} 天`;
    } else if (days > 0) {
      description = `${prefix} ${days} 天 ${hours} 小时`;
    } else if (hours > 0) {
      description = `${prefix} ${hours} 小时 ${minutes} 分钟`;
    } else if (minutes > 0) {
      description = `${prefix} ${minutes} 分钟 ${seconds} 秒`;
    } else {
      description = isPast ? '刚刚过去' : '即将到来';
    }

    return { days, hours, minutes, seconds, isPast, description };
  },
};
