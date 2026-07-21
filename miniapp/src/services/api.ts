// 仅保留类型定义，移除所有后端请求代码

export interface FavoriteItem {
  toolId: string;
  folder: string;
  sortOrder: number;
}

export type FavoritesList = FavoriteItem[];

export interface FolderInfo {
  id: string;
  name: string;
  sortOrder: number;
}
