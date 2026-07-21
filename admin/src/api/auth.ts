import { request } from './request';

export interface LoginResult {
  user: { id: string; email: string; name: string };
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}
