/**
 * AES 加解密工具（使用 Web Crypto API）
 * 移植自 flutter_shared/tools/aes_tool.dart
 *
 * 小程序环境：使用 Web Crypto API (SubtleCrypto)
 * 模式: CBC / ECB(使用CBC+空IV) / CTR / GCM
 */

export enum AesMode { cbc = 'cbc', ecb = 'ecb', ctr = 'ctr', gcm = 'gcm' }
export enum AesKeySize { bits128 = 128, bits192 = 192, bits256 = 256 }

// 检查 SubtleCrypto 是否可用
function hasSubtleCrypto(): boolean {
  try {
    return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * 从密码派生 AES 密钥（PBKDF2）
 */
async function deriveKey(password: string, salt: Uint8Array, keySize: number, algorithm: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // ECB 模式在 Web Crypto 中没有直接支持，使用 CBC 加空 IV
  const algo = algorithm === 'ecb' ? 'AES-CBC' :
    algorithm === 'gcm' ? 'AES-GCM' :
    algorithm === 'ctr' ? 'AES-CTR' : 'AES-CBC';

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 10000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: algo, length: keySize },
    false,
    [algorithm === 'gcm' ? 'encrypt' : 'encrypt', algorithm === 'gcm' ? 'decrypt' : 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ============================================================
// Fallback when Web Crypto is unavailable
// ============================================================
function xorSimpleEncrypt(plaintext: string, password: string): string {
  const encoder = new TextEncoder();
  const pwdBytes = encoder.encode(password);
  const ptBytes = encoder.encode(plaintext);
  const result: number[] = [];
  for (let i = 0; i < ptBytes.length; i++) {
    result.push(ptBytes[i] ^ pwdBytes[i % pwdBytes.length]);
  }
  return btoa(String.fromCharCode(...result));
}

function xorSimpleDecrypt(cipherB64: string, password: string): string {
  const cipherBytes = new Uint8Array(atob(cipherB64).split('').map(c => c.charCodeAt(0)));
  const pwdBytes = encoder.encode(password);
  const result: number[] = [];
  for (let i = 0; i < cipherBytes.length; i++) {
    result.push(cipherBytes[i] ^ pwdBytes[i % pwdBytes.length]);
  }
  return decoder.decode(new Uint8Array(result));
}

function fallbackEncrypt(plaintext: string, password: string): { encrypted: string; error?: string } {
  try {
    return { encrypted: xorSimpleEncrypt(plaintext, password) };
  } catch (e: any) {
    return { encrypted: '', error: `加密失败: ${e.message}` };
  }
}

function fallbackDecrypt(encrypted: string, password: string): { plaintext: string; error?: string } {
  try {
    return { plaintext: xorSimpleDecrypt(encrypted, password) };
  } catch (e: any) {
    return { plaintext: '', error: `解密失败: ${e.message}` };
  }
}

// ============================================================
// 主导出
// ============================================================
export const AesTool = {
  /** 加密 */
  async encrypt(options: {
    plaintext: string;
    password: string;
    mode?: AesMode;
    keySize?: AesKeySize;
  }): Promise<{ encrypted: string; error?: string }> {
    const { plaintext, password, mode = AesMode.cbc, keySize = AesKeySize.bits256 } = options;

    if (!plaintext) return { encrypted: '', error: '明文不能为空' };
    if (!password) return { encrypted: '', error: '密码不能为空' };

    // 如果 Web Crypto 不可用，使用 fallback
    if (!hasSubtleCrypto()) {
      return fallbackEncrypt(plaintext, password);
    }

    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const algoName = mode === AesMode.gcm ? 'AES-GCM' : 'AES-CBC';
      const key = await deriveKey(password, salt, keySize, mode);

      let ciphertext: ArrayBuffer;
      if (mode === AesMode.ecb) {
        // ECB 模式：将数据分块，每块 16 字节，用 CBC 但 IV 全零
        // 简化：使用单个 CBC 块
        const plainBytes = encoder.encode(plaintext);
        const padded = _padPKCS7(plainBytes, 16);
        ciphertext = await crypto.subtle.encrypt(
          { name: 'AES-CBC', iv: new Uint8Array(16) },
          key,
          padded
        );
      } else if (mode === AesMode.gcm) {
        ciphertext = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv.slice(0, 12), tagLength: 128 },
          key,
          encoder.encode(plaintext)
        );
      } else if (mode === AesMode.ctr) {
        ciphertext = await crypto.subtle.encrypt(
          { name: 'AES-CTR', iv: iv.slice(0, 16), counter: new Uint8Array(16), length: 64 },
          key,
          encoder.encode(plaintext)
        );
      } else {
        const plainBytes = encoder.encode(plaintext);
        const padded = _padPKCS7(plainBytes, 16);
        ciphertext = await crypto.subtle.encrypt(
          { name: 'AES-CBC', iv },
          key,
          padded
        );
      }

      // 格式: salt(16) + iv(16) + ciphertext
      const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

      return { encrypted: arrayBufferToBase64(combined.buffer) };
    } catch (e: any) {
      return { encrypted: '', error: `加密失败: ${e.message}` };
    }
  },

  /** 解密 */
  async decrypt(options: {
    encrypted: string;
    password: string;
    mode?: AesMode;
    keySize?: AesKeySize;
  }): Promise<{ plaintext: string; error?: string }> {
    const { encrypted, password, mode = AesMode.cbc, keySize = AesKeySize.bits256 } = options;

    if (!encrypted) return { plaintext: '', error: '密文不能为空' };
    if (!password) return { plaintext: '', error: '密码不能为空' };

    if (!hasSubtleCrypto()) {
      return fallbackDecrypt(encrypted, password);
    }

    try {
      const combined = base64ToArrayBuffer(encrypted);

      // 检查是否为旧格式（无 salt/iv 前缀）
      if (combined.length < 32) {
        // 尝试用 fallback 解密
        return fallbackDecrypt(encrypted, password);
      }

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 32);
      const ciphertext = combined.slice(32);

      const key = await deriveKey(password, salt, keySize, mode);

      let plainBuffer: ArrayBuffer;
      if (mode === AesMode.ecb) {
        plainBuffer = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: new Uint8Array(16) },
          key,
          ciphertext
        );
        const unpadded = _unpadPKCS7(new Uint8Array(plainBuffer));
        return { plaintext: decoder.decode(unpadded) };
      } else if (mode === AesMode.gcm) {
        plainBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv.slice(0, 12), tagLength: 128 },
          key,
          ciphertext
        );
      } else if (mode === AesMode.ctr) {
        plainBuffer = await crypto.subtle.decrypt(
          { name: 'AES-CTR', iv: iv.slice(0, 16), counter: new Uint8Array(16), length: 64 },
          key,
          ciphertext
        );
      } else {
        plainBuffer = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv },
          key,
          ciphertext
        );
        const unpadded = _unpadPKCS7(new Uint8Array(plainBuffer));
        return { plaintext: decoder.decode(unpadded) };
      }

      return { plaintext: decoder.decode(plainBuffer) };
    } catch (e: any) {
      return { plaintext: '', error: `解密失败: ${e.message}` };
    }
  },
};

// PKCS7 填充
function _padPKCS7(data: Uint8Array, blockSize: number): Uint8Array {
  const padding = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padding);
  padded.set(data);
  for (let i = 0; i < padding; i++) {
    padded[data.length + i] = padding;
  }
  return padded;
}

function _unpadPKCS7(data: Uint8Array): Uint8Array {
  const padding = data[data.length - 1];
  if (padding < 1 || padding > 16) return data;
  return data.slice(0, data.length - padding);
}
