/**
 * 网络请求封装
 * 生产环境：通过 nginx 代理 /tool/api -> 后端
 * 本地开发：直接 localhost:3000
 */
const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : window.location.origin + "/tool";

function getToken(): string {
  return localStorage.getItem('toolbox_admin_token') || '';
}

export async function request<T>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    auth?: boolean;
  },
): Promise<T> {
  const { method = 'GET', body, auth = true } = options || {};
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `请求失败: ${res.status}`);
  return data;
}
