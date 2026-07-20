/**
 * Markdown 笔记本工具 — 本地存储管理
 * 使用 Taro.setStorageSync 实现持久化
 */

import Taro from '@tarojs/taro';

export interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

const STORAGE_KEY = '__md_notebook_entries__';

export const MdNotebookTool = {
  /** 获取所有笔记 */
  getAll(): NotebookEntry[] {
    try {
      const raw = Taro.getStorageSync(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /** 保存笔记列表 */
  _saveAll(entries: NotebookEntry[]): void {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(entries));
  },

  /** 创建笔记 */
  create(title: string, content: string): NotebookEntry {
    const entries = this.getAll();
    const now = Date.now();
    const entry: NotebookEntry = {
      id: `md_${now}_${Math.random().toString(36).substring(2, 8)}`,
      title: title || '未命名笔记',
      content,
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };
    entries.unshift(entry);
    this._saveAll(entries);
    return entry;
  },

  /** 更新笔记 */
  update(id: string, updates: Partial<Pick<NotebookEntry, 'title' | 'content'>>): NotebookEntry | null {
    const entries = this.getAll();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    entries[idx] = { ...entries[idx], ...updates, updatedAt: Date.now() };
    this._saveAll(entries);
    return entries[idx];
  },

  /** 删除笔记 */
  delete(id: string): boolean {
    const entries = this.getAll();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    this._saveAll(filtered);
    return true;
  },

  /** 置顶/取消置顶 */
  togglePin(id: string): NotebookEntry | null {
    const entries = this.getAll();
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    entries[idx].pinned = !entries[idx].pinned;
    entries[idx].updatedAt = Date.now();
    this._saveAll(entries);
    return entries[idx];
  },

  /** 搜索笔记 */
  search(query: string): NotebookEntry[] {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(e =>
      e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)
    );
  },

  /** 格式化工时 */
  formatTime(ts: number): string {
    const d = new Date(ts);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (d.toDateString() === now.toDateString()) {
      return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `昨天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  },
};
