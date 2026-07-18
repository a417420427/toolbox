/**
 * 密码生成器
 * 移植自 flutter_shared/tools/password_generator.dart
 */

export interface PasswordOptions {
  length: number;
  useLower: boolean;
  useUpper: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const PasswordGenerator = {
  generate(options: Partial<PasswordOptions> = {}): string {
    const {
      length = 16,
      useLower = true,
      useUpper = true,
      useDigits = true,
      useSymbols = true,
      excludeAmbiguous = false,
    } = options;

    let chars = '';
    if (useLower) chars += LOWERCASE;
    if (useUpper) chars += UPPERCASE;
    if (useDigits) chars += DIGITS;
    if (useSymbols) chars += SYMBOLS;

    if (excludeAmbiguous) {
      chars = chars.replace(/[0Ool1I!|]/g, '');
    }

    if (!chars) chars = LOWERCASE + DIGITS;

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map(n => chars[n % chars.length]).join('');
  },

  /** 密码强度 0-6 */
  strength(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
    return score;
  },

  strengthLabel(score: number): string {
    if (score <= 1) return '弱';
    if (score <= 3) return '中等';
    if (score <= 4) return '强';
    return '非常强';
  },
};
