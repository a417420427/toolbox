/**
 * 网络请求封装
 * 请求后端 API，支持 token 自动注入
 *
 * 环境变量配置（编译时注入）：
 *   API_BASE_URL — 后端地址，默认 http://localhost:3000
 *
 * 在项目根目录创建 .env 文件：
 *   API_BASE_URL=https://your-api.example.com
 *
 * 或者直接改下面的默认值。
 */
import Taro from '@tarojs/taro';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

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
