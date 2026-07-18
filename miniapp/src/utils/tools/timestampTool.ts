/**
 * 时间戳工具 — 秒级/毫秒级互转
 * 移植自 flutter_shared/tools/timestamp_tool.dart
 */

export interface TimestampDateTime {
  dateTime: Date;
  isMs: boolean;
}

export const TimestampTool = {
  /** 时间戳 → Date（自动识别秒/毫秒） */
  toDateTime(timestamp: number): TimestampDateTime {
    if (timestamp > 1e12) {
      return { dateTime: new Date(timestamp), isMs: true };
    }
    return { dateTime: new Date(timestamp * 1000), isMs: false };
  },

  /** Date → 秒级时间戳 */
  toSeconds(dt: Date): number {
    return Math.floor(dt.getTime() / 1000);
  },

  /** Date → 毫秒级时间戳 */
  toMilliseconds(dt: Date): number {
    return dt.getTime();
  },

  /** ISO 8601 */
  toIso(dt: Date): string {
    return dt.toISOString();
  },

  /** 中国常用格式: 2024-01-15 10:30:00 */
  toChinese(dt: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  },

  /** 美国格式: 01/15/2024 10:30:00 AM */
  toAmerican(dt: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const hour = dt.getHours() > 12 ? dt.getHours() - 12 : (dt.getHours() === 0 ? 12 : dt.getHours());
    const ampm = dt.getHours() >= 12 ? 'PM' : 'AM';
    return `${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}/${dt.getFullYear()} ${hour}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())} ${ampm}`;
  },

  /** 相对时间描述 */
  relative(dt: Date): string {
    const now = new Date();
    const diff = dt.getTime() - now.getTime();
    const seconds = Math.abs(Math.floor(diff / 1000));
    const isPast = diff < 0;

    if (seconds < 60) return `几秒${isPast ? '前' : '后'}`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟${isPast ? '前' : '后'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时${isPast ? '前' : '后'}`;
    if (seconds < 172800) return isPast ? '昨天' : '明天';
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} 天${isPast ? '前' : '后'}`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} 周${isPast ? '前' : '后'}`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} 个月${isPast ? '前' : '后'}`;
    return `${Math.floor(seconds / 31536000)} 年${isPast ? '前' : '后'}`;
  },

  nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
  },

  nowMilliseconds(): number {
    return Date.now();
  },
};
