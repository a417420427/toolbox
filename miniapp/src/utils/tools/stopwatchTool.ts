/**
 * 秒表工具
 * 移植自 flutter_shared/tools/stopwatch_tool.dart
 */

export const StopwatchTool = {
  format(durationMs: number): string {
    const d = Math.abs(durationMs);
    const h = Math.floor(d / 3600000);
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);
    const ms = Math.floor(d % 1000);

    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    const mss = ms.toString().padStart(3, '0');

    if (h > 0) return `${hh}:${mm}:${ss}.${mss}`;
    return `${mm}:${ss}.${mss}`;
  },
};
