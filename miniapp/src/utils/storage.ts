import Taro from '@tarojs/taro';

/** 通用本地存储服务 */
export const Storage = {
  /** 写入 */
  set<T>(key: string, value: T): void {
    try {
      Taro.setStorageSync(key, value);
    } catch (e) {
      console.error(`[Storage] set ${key} failed:`, e);
    }
  },

  /** 读取 */
  get<T>(key: string, fallback?: T): T | undefined {
    try {
      const val = Taro.getStorageSync(key);
      return val !== '' ? (val as T) : fallback;
    } catch {
      return fallback;
    }
  },

  /** 删除 */
  remove(key: string): void {
    try {
      Taro.removeStorageSync(key);
    } catch (e) {
      console.error(`[Storage] remove ${key} failed:`, e);
    }
  },

  /** 清除全部 */
  clear(): void {
    try {
      Taro.clearStorageSync();
    } catch (e) {
      console.error('[Storage] clear failed:', e);
    }
  },
};

// ── 业务类型 ──

export interface TarotRecord {
  date: string;       // "2026-7-20"
  cardName: string;   // "愚者"
  cardEn: string;     // "The Fool"
  number: number;     // 0
  reversed: boolean;
  meaning: string;    // 含义
}

const TAROT_HISTORY_KEY = 'tarot_history';

/** 塔罗占卜存储 */
export const TarotStorage = {
  /** 保存今日抽牌结果（追加或替换当天记录） */
  saveTodayDraw(record: TarotRecord): void {
    const history = TarotStorage.getHistory();
    const existingIdx = history.findIndex(r => r.date === record.date);
    if (existingIdx >= 0) {
      history[existingIdx] = record;
    } else {
      history.unshift(record);
    }
    Storage.set(TAROT_HISTORY_KEY, history);
  },

  /** 获取占卜历史（从新到旧） */
  getHistory(): TarotRecord[] {
    return Storage.get<TarotRecord[]>(TAROT_HISTORY_KEY, []) ?? [];
  },

  /** 清除历史 */
  clearHistory(): void {
    Storage.remove(TAROT_HISTORY_KEY);
  },
};
