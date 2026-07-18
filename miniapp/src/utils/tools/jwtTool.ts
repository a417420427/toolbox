/**
 * JWT 解码工具
 * 移植自 flutter_shared/tools/jwt_tool.dart
 */

export interface JwtResult {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
}

export interface JwtDecodeResult {
  result?: JwtResult;
  error?: string;
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  return atob(b64);
}

export const JwtTool = {
  /** 解析 JWT token */
  decode(token: string): JwtDecodeResult {
    token = token.trim();
    if (!token) return { error: '请输入 JWT Token' };

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: '非法 JWT 格式：Token 必须由三部分组成（Header.Payload.Signature）' };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);
      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);

      return {
        result: {
          header,
          payload,
          signature: parts[2],
        },
      };
    } catch (e: any) {
      return { error: `解码失败: ${e.message}` };
    }
  },
};
