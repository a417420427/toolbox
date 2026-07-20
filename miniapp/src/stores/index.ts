import { create } from 'zustand';
import * as api from '../services/api';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; name: string } | null;
  ready: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: api.getToken(),
  user: null,
  ready: false,

  login: async () => {
    // 先尝试用已有 token 获取 profile
    const storedToken = api.getToken();
    if (storedToken) {
      try {
        const profile = await api.request<any>('GET', '/auth/profile');
        set({ token: storedToken, user: profile, ready: true });
        return;
      } catch {
        // token 过期，重新登录
        api.clearToken();
      }
    }

    // 微信静默登录
    const result = await api.wechatLogin();
    if (result) {
      api.setToken(result.token);
      set({ token: result.token, user: result.user, ready: true });
    } else {
      set({ ready: true });
    }
  },

  logout: () => {
    api.clearToken();
    set({ token: null, user: null });
  },
}));

// ── Favorites Store ──

interface FavoritesState {
  favoriteIds: Set<string>;
  favorites: api.FavoriteItem[];
  folders: api.FolderInfo[];
  loading: boolean;
  loadFavorites: () => Promise<void>;
  loadFolders: () => Promise<void>;
  toggleFavorite: (toolId: string, name: string, description: string, icon: string) => Promise<void>;
  moveFavorite: (toolId: string, folder: string) => Promise<void>;
  createFolder: (name: string) => Promise<string | null>;
  renameFolder: (oldName: string, newName: string) => Promise<string | null>;
  deleteFolder: (name: string) => Promise<string | null>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),
  favorites: [],
  folders: [],
  loading: false,

  loadFavorites: async () => {
    const token = api.getToken();
    if (!token) {
      set({ favorites: [], favoriteIds: new Set(), loading: false });
      return;
    }
    set({ loading: true });
    try {
      const list = await api.getFavorites();
      set({
        favorites: list,
        favoriteIds: new Set(list.map((f) => f.toolId)),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  loadFolders: async () => {
    const token = api.getToken();
    if (!token) return;
    try {
      const list = await api.getFolders();
      set({ folders: list });
    } catch {}
  },

  toggleFavorite: async (toolId, _name, _description, _icon) => {
    const { favoriteIds } = get();
    const token = api.getToken();
    if (!token) return;

    if (favoriteIds.has(toolId)) {
      try {
        const list = await api.removeFavorite(toolId);
        set({
          favorites: list,
          favoriteIds: new Set(list.map((f) => f.toolId)),
        });
      } catch {}
    } else {
      try {
        const list = await api.addFavorite(toolId);
        set({
          favorites: list,
          favoriteIds: new Set(list.map((f) => f.toolId)),
        });
      } catch {}
    }
  },

  moveFavorite: async (toolId, folder) => {
    try {
      const list = await api.moveFavorite(toolId, folder);
      set({
        favorites: list,
        favoriteIds: new Set(list.map((f) => f.toolId)),
      });
    } catch {}
  },

  createFolder: async (name) => {
    try {
      const folder = await api.createFolder(name);
      set((s) => ({ folders: [...s.folders, folder] }));
      return null;
    } catch (e: any) {
      return e.message || '创建失败';
    }
  },

  renameFolder: async (oldName, newName) => {
    try {
      await api.renameFolder(oldName, newName);
      set((s) => ({
        folders: s.folders.map((f) =>
          f.name === oldName ? { ...f, name: newName } : f
        ),
        // 同步更新收藏中的 folder 名
        favorites: s.favorites.map((f) =>
          f.folder === oldName ? { ...f, folder: newName } : f
        ),
      }));
      return null;
    } catch (e: any) {
      return e.message || '重命名失败';
    }
  },

  deleteFolder: async (name) => {
    try {
      await api.deleteFolder(name);
      set((s) => ({
        folders: s.folders.filter((f) => f.name !== name),
        // 该文件夹内的收藏移入未分类
        favorites: s.favorites.map((f) =>
          f.folder === name ? { ...f, folder: '' } : f
        ),
      }));
      return null;
    } catch (e: any) {
      return e.message || '删除失败';
    }
  },
}));
