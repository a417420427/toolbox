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
  loading: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (toolId: string, name: string, description: string, icon: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),
  favorites: [],
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
}));
