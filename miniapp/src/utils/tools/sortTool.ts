/**
 * 排序 / 去重工具
 * 移植自 flutter_shared/tools/sort_tool.dart
 */

export enum SortMode { asc = 'asc', desc = 'desc', lengthAsc = 'lengthAsc', lengthDesc = 'lengthDesc', reverse = 'reverse' }
export enum DedupMode { all = 'all', caseInsensitive = 'caseInsensitive', trimThenDedup = 'trimThenDedup' }

export interface SortStats {
  totalLines: number;
  nonEmptyLines: number;
  uniqueLines: number;
}

export const SortTool = {
  sort(input: string, mode: SortMode): string {
    const lines = input.split('\n');
    const trimmed = lines.map(l => l.trimEnd());

    switch (mode) {
      case SortMode.asc:
        trimmed.sort((a, b) => a.localeCompare(b));
        break;
      case SortMode.desc:
        trimmed.sort((a, b) => b.localeCompare(a));
        break;
      case SortMode.lengthAsc:
        trimmed.sort((a, b) => a.length - b.length);
        break;
      case SortMode.lengthDesc:
        trimmed.sort((a, b) => b.length - a.length);
        break;
      case SortMode.reverse:
        trimmed.reverse();
        break;
    }

    return trimmed.join('\n');
  },

  dedup(input: string, mode: DedupMode): string {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];

    for (const line of lines) {
      let key: string;
      switch (mode) {
        case DedupMode.all:
          key = line;
          break;
        case DedupMode.caseInsensitive:
          key = line.toLowerCase();
          break;
        case DedupMode.trimThenDedup:
          key = line.trim();
          break;
      }
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }

    return result.join('\n');
  },

  removeEmptyLines(input: string): string {
    return input.split('\n').filter(l => l.trim().length > 0).join('\n');
  },

  stats(input: string): SortStats {
    const lines = input.split('\n');
    return {
      totalLines: lines.length,
      nonEmptyLines: lines.filter(l => l.trim().length > 0).length,
      uniqueLines: new Set(lines).size,
    };
  },
};
