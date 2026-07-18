/**
 * 文本差异比较工具
 * 移植自 flutter_shared/tools/diff_tool.dart
 */

export enum DiffType {
  same = 'same',
  added = 'added',
  removed = 'removed',
}

export interface DiffLine {
  type: DiffType;
  text: string;
  oldLine: number;
  newLine: number;
}

export interface DiffStats {
  added: number;
  removed: number;
}

export const DiffTool = {
  /** 计算行级 diff */
  diff(oldText: string, newText: string): DiffLine[] {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const m = oldLines.length;
    const n = newLines.length;

    // LCS DP
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 回溯
    const reverse: DiffLine[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        reverse.push({ type: DiffType.same, text: oldLines[i - 1], oldLine: i, newLine: j });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        reverse.push({ type: DiffType.added, text: newLines[j - 1], oldLine: 0, newLine: j });
        j--;
      } else if (i > 0) {
        reverse.push({ type: DiffType.removed, text: oldLines[i - 1], oldLine: i, newLine: 0 });
        i--;
      }
    }

    return reverse.reverse();
  },

  /** 统计 */
  stats(oldText: string, newText: string): DiffStats {
    const lines = this.diff(oldText, newText);
    let added = 0, removed = 0;
    for (const line of lines) {
      if (line.type === DiffType.added) added++;
      if (line.type === DiffType.removed) removed++;
    }
    return { added, removed };
  },
};
