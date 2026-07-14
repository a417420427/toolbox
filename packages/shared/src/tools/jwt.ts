/**
 * JWT 解码工具
 *
 * 纯前端解码 JWT 的 Header 和 Payload。
 * 注意：此工具仅解码验证，不验证签名（签名验证需要密钥）。
 */

export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  // 其他自定义字段
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;     // 签发者
  sub?: string;     // 主题
  aud?: string | string[]; // 受众
  exp?: number;     // 过期时间
  nbf?: number;     // 生效时间
  iat?: number;     // 签发时间
  jti?: string;     // JWT ID
  // 其他自定义字段
  [key: string]: unknown;
}

export interface JwtDecodeResult {
  header: Partial<JwtHeader>;
  headerRaw: string;
  payload: Partial<JwtPayload>;
  payloadRaw: string;
  signature: string;
  isValid: boolean;
  error?: string;
  /** 过期状态 */
  expiration?: {
    timestamp: number;
    date: string;
    expired: boolean;
    remaining: string; // 剩余时间描述
  };
}

/**
 * 解码 JWT Token。
 * 纯前端解码 Header 和 Payload（Base64），不验证签名。
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      header: {},
      headerRaw: "",
      payload: {},
      payloadRaw: "",
      signature: "",
      isValid: false,
      error: "Token 为空",
    };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      header: {},
      headerRaw: "",
      payload: {},
      payloadRaw: "",
      signature: "",
      isValid: false,
      error: `JWT 需要 3 段（Header.Payload.Signature），当前 ${parts.length} 段`,
    };
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

  try {
    const headerRaw = base64UrlDecode(headerEncoded);
    const payloadRaw = base64UrlDecode(payloadEncoded);

    const header: JwtHeader = JSON.parse(headerRaw);
    const payload: JwtPayload = JSON.parse(payloadRaw);

    let expiration: JwtDecodeResult["expiration"] = undefined;

    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = Date.now();
      const diffMs = payload.exp * 1000 - now;
      const expired = diffMs < 0;

      const remaining = formatDuration(Math.abs(diffMs));

      expiration = {
        timestamp: payload.exp,
        date: expDate.toISOString(),
        expired,
        remaining: expired ? `已过期 ${remaining}` : `${remaining} 后过期`,
      };
    }

    return {
      header,
      headerRaw: formatJsonString(headerRaw),
      payload,
      payloadRaw: formatJsonString(payloadRaw),
      signature: signatureEncoded,
      isValid: true,
      expiration,
    };
  } catch (e) {
    return {
      header: {},
      headerRaw: "",
      payload: {},
      payloadRaw: "",
      signature: "",
      isValid: false,
      error: `解码失败: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/**
 * 校验 JWT 是否过期（基于 exp 字段）。
 */
export function isJwtExpired(token: string): boolean | { error: string } {
  const result = decodeJwt(token);
  if (!result.isValid) {
    return { error: result.error ?? "解码失败" };
  }
  if (!result.payload.exp) {
    return false; // 没有过期字段，视为不过期
  }
  return result.payload.exp * 1000 < Date.now();
}

/**
 * 从 JWT Payload 中提取用户信息（常见字段）。
 */
export function extractJwtUserInfo(
  token: string
): { sub?: string; email?: string; name?: string; picture?: string } | { error: string } {
  const result = decodeJwt(token);
  if (!result.isValid) {
    return { error: result.error ?? "解码失败" };
  }

  return {
    sub: result.payload.sub as string | undefined,
    email: (result.payload.email as string) || (result.payload.preferred_username as string),
    name: (result.payload.name as string) || (result.payload.nickname as string),
    picture: result.payload.picture as string | undefined,
  };
}

// ---- 内部辅助 ----

function base64UrlDecode(input: string): string {
  // Base64URL → Base64
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // 补齐 padding
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const binary = atob(base64);
  // 尝试作为 UTF-8 解码（JWT Payload 通常是 UTF-8）
  try {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    // 如果 UTF-8 解码失败，返回原始 ASCII
    return binary;
  }
}

function formatJsonString(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} 天 ${hours % 24} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes % 60} 分钟`;
  if (minutes > 0) return `${minutes} 分钟 ${seconds % 60} 秒`;
  return `${seconds} 秒`;
}

/**
 * JWT 算法列表（供 UI 展示）
 */
export const JWT_ALGORITHMS = [
  "HS256", "HS384", "HS512",
  "RS256", "RS384", "RS512",
  "ES256", "ES384", "ES512",
  "PS256", "PS384", "PS512",
  "EdDSA",
  "none",
];
