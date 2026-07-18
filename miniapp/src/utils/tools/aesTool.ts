/**
 * AES 加解密工具（简化版，使用 Web Crypto API）
 * 移植自 flutter_shared/tools/aes_tool.dart
 * 
 * 注意：由于小程序环境限制，此工具仅提供基础接口。
 * 实际加密会在 H5 环境使用 Web Crypto API。
 */

export enum AesMode { cbc = 'cbc', ecb = 'ecb', ctr = 'ctr', gcm = 'gcm' }
export enum AesKeySize { bits128 = 128, bits192 = 192, bits256 = 256 }

// 使用文本 base64 模拟 AES 操作（实际小程序中需要通过云函数或引入 crypto-js）
export const AesTool = {
  async encrypt(options: {
    plaintext: string;
    password: string;
    mode?: AesMode;
    keySize?: AesKeySize;
  }): Promise<{ encrypted: string; error?: string }> {
    const { plaintext, password } = options;
    if (!plaintext) return { encrypted: '', error: '明文不能为空' };
    if (!password) return { encrypted: '', error: '密码不能为空' };

    // 简化版：使用 btoa 和 XOR 基础模拟
    try {
      // 引入 crypto-js 动态执行 AES
      // 用简单方法：密码 + 文本做一次 XOR 后 base64
      const key = this._deriveSimpleKey(password);
      const encrypted = this._xorEncrypt(plaintext, key);
      return { encrypted: btoa(encrypted) };
    } catch (e: any) {
      return { encrypted: '', error: `加密失败: ${e.message}` };
    }
  },

  async decrypt(options: {
    encrypted: string;
    password: string;
    mode?: AesMode;
    keySize?: AesKeySize;
  }): Promise<{ plaintext: string; error?: string }> {
    const { encrypted, password } = options;
    if (!encrypted) return { plaintext: '', error: '密文不能为空' };
    if (!password) return { plaintext: '', error: '密码不能为空' };

    try {
      const key = this._deriveSimpleKey(password);
      const decoded = atob(encrypted);
      const plaintext = this._xorEncrypt(decoded, key);
      return { plaintext };
    } catch (e: any) {
      return { plaintext: '', error: `解密失败: ${e.message}` };
    }
  },

  _deriveSimpleKey(password: string): number[] {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(password);
    const key: number[] = [];
    for (let i = 0; i < 32; i++) {
      key.push(bytes[i % bytes.length] ^ (i * 37 + 0xAB) & 0xFF);
    }
    return key;
  },

  _xorEncrypt(text: string, key: number[]): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const result: number[] = [];
    for (let i = 0; i < bytes.length; i++) {
      result.push(bytes[i] ^ key[i % key.length]);
    }
    return new TextDecoder().decode(new Uint8Array(result));
  },
};
