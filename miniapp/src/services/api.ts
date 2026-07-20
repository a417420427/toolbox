import Taro from '@tarojs/taro';

const BASE_URL = 'https://ibnlus.com/tool/api';

const TOKEN_KEY = 'auth_token';

/** 获取存储的 token */
export function getToken(): string | null {
  try {
    const token = Taro.getStorageSync(TOKEN_KEY);
    return token || null;
  } catch {
    return null;
  }
}

/** 保存 token */
export function setToken(token: string) {
  Taro.setStorageSync(TOKEN_KEY, token);
}

/** 清除 token */
export function clearToken() {
  try {
    Taro.removeStorageSync(TOKEN_KEY);
  } catch {}
}

/** 通用请求 */
export async function request<T>(
  method: string,
  path: string,
  body?: any,
): Promise<T> {
  const token = getToken();
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  const res = await Taro.request({
    url: `${BASE_URL}${path}`,
    method,
    header,
    data: body,
    dataType: 'json',
  });

  if (res.statusCode >= 400) {
    const msg = (res.data as any)?.message || `请求失败 (${res.statusCode})`;
    throw new Error(msg);
  }

  return res.data as T;
}

// ── Auth ──

export interface AuthResult {
  user: { id: string; email: string; name: string };
  token: string;
}

/** 微信静默登录 */
export async function wechatLogin(): Promise<AuthResult | null> {
  try {
    const loginRes = await Taro.login();
    if (!loginRes.code) return null;
    return await request<AuthResult>('POST', '/auth/wechat-login', { code: loginRes.code });
  } catch (e) {
    console.error('[API] wechatLogin failed:', e);
    return null;
  }
}

// ── Favorites ──

export interface FavoriteItem {
  toolId: string;
  folder: string;
  sortOrder: number;
}

export type FavoritesList = FavoriteItem[];

/** 获取收藏列表 */
export async function getFavorites(): Promise<FavoritesList> {
  return request<FavoritesList>('GET', '/user/favorites');
}

/** 添加收藏 */
export async function addFavorite(toolId: string, folder?: string): Promise<FavoritesList> {
  return request<FavoritesList>('POST', '/user/favorites', { toolId, folder });
}

/** 取消收藏 */
export async function removeFavorite(toolId: string): Promise<FavoritesList> {
  return request<FavoritesList>('DELETE', `/user/favorites/${toolId}`);
}
