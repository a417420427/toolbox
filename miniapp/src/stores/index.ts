import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { FavoriteItem } from '../services/api';

const STORAGE_KEY = 'toolbox_favorites';

function loadFromStorage(): FavoriteItem[] {
  try {
    const v = Taro.getStorageSync(STORAGE_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: FavoriteItem[]) {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

// Favorites Store — 纯本地存储
interface FavoritesState {
  favoriteIds: Set<string>;
  favorites: FavoriteItem[];
  loadFavorites: () => void;
  toggleFavorite: (toolId: string, name?: string, description?: string, icon?: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(loadFromStorage().map(f => f.toolId)),
  favorites: loadFromStorage(),

  loadFavorites: () => {
    const items = loadFromStorage();
    set({ favorites: items, favoriteIds: new Set(items.map(f => f.toolId)) });
  },

  toggleFavorite: (toolId: string) => {
    const was = get().favoriteIds.has(toolId);
    let upd: FavoriteItem[];

    if (was) {
      upd = get().favorites.filter(f => f.toolId !== toolId);
    } else {
      upd = [...get().favorites, { toolId, folder: '', sortOrder: get().favorites.length }];
    }

    set({ favorites: upd, favoriteIds: new Set(upd.map(f => f.toolId)) });
    saveToStorage(upd);
  },
}));
