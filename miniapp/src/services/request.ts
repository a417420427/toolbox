/**
 * 网络请求封装
 * 请求后端 API，支持 token 自动注入
 *
 * API 地址在 config/index.ts 中通过 defineConstants 注入。
 * 在项目根目录 .env 文件中设置：
 *   API_BASE_URL=http://localhost:3000
 * 编译时会被替换为实际值，不设则走默认地址。
 */

// @ts-ignore — 编译时由 Taro defineConstants 注入
const BASE_URL: string = (typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : null) || 'http://localhost:3000';

import Taro from '@tarojs/taro';

function getToken(): string {
  try {
    return Taro.getStorageSync('toolbox_token') || '';
  } catch {
    return '';
  }
}

export async function request<T>(url: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  auth?: boolean;
}): Promise<T> {
  const { method = 'GET', body, auth = false } = options || {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    header: headers,
    data: body,
    timeout: 10000,
  });

  if (res.statusCode >= 400) {
    throw new Error((res.data as any)?.message || `请求失败: ${res.statusCode}`);
  }

  return res.data as T;
}
